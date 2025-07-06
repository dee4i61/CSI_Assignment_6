const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar, role } = req.body; // <--- include role here

    const user = await User.create({
      name,
      email,
      password,
      avatar,
      role: role || "user", // default to "user" if role not provided
    });

    sendToken(user, 201, res);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Send token
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(404).json({ message: "User not found with this email" });

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset link is here:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({ message: `Email sent to ${user.email}` });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({ message: "Email could not be sent" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res
      .status(400)
      .json({ message: "Reset token is invalid or expired" });

  if (req.body.password !== req.body.confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
};

// Get logged in user details
exports.getUserDetails = async (req, res) => {
  try {
    // req.user is expected to be populated by auth middleware (JWT verified)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Details Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched)
    return res.status(400).json({ message: "Old password is incorrect" });

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // You can add avatar update logic here

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ user });
};

// Admin: Get all users
exports.getAllUser = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
};

// Admin: Get single user
exports.getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
};

// Admin: Update user role
exports.updateUserRole = async (req, res) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ user });
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  await user.remove();

  res.status(200).json({ message: "User deleted successfully" });
};

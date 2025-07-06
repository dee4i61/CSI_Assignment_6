import api from "./api";

// Register User
export const registerUser = async (userData) => {
  try {
    const { data } = await api.post("/register", userData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const { data } = await api.post("/login", userData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const { data } = await api.get("/logout");
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const { data } = await api.post("/password/forgot", { email });
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Reset Password
export const resetPassword = async (token, passwords) => {
  try {
    const { data } = await api.put(`/password/reset/${token}`, passwords);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get User Details
export const getUserDetails = async () => {
  try {
    const { data } = await api.get("/me");
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Password
export const updatePassword = async (passwords) => {
  try {
    const { data } = await api.put("/password/update", passwords);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update Profile
export const updateProfile = async (userData) => {
  try {
    const { data } = await api.put("/me/update", userData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Get All Users
export const getAllUsers = async () => {
  try {
    const { data } = await api.get("/admin/users");
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Get Single User
export const getSingleUser = async (id) => {
  try {
    const { data } = await api.get(`/admin/user/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Update User Role
export const updateUserRole = async (id, updatedData) => {
  try {
    const { data } = await api.put(`/admin/user/${id}`, updatedData);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Delete User
export const deleteUser = async (id) => {
  try {
    const { data } = await api.delete(`/admin/user/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

import React, { useState, useEffect } from "react";

// Import your API functions here
import {
  getUserDetails,
  updateProfile,
  updatePassword,
  forgotPassword,
} from "../../services/userServices";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("details");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      setError("");
      setLoading(true);
      try {
        const response = await getUserDetails();
        if (response.success) {
          setUser(response.user);
          setProfileForm({
            name: response.user.name || "",
            email: response.user.email || "",
            avatar: response.user.avatar?.url || "",
          });
          setForgotPasswordEmail(response.user.email || "");
        } else {
          setError("Failed to load user details.");
        }
      } catch (err) {
        setError(
          err.message || "Failed to load user details. Please try again."
        );
        if (err.message === "User not found") {
          // Handle navigation to login if needed
          console.log("User not found, redirect to login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        avatar: profileForm.avatar,
      });
      setSuccess("Profile updated successfully!");
      setUser({ ...user, ...response.user });
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess("Password updated successfully!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to update password.");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await forgotPassword(forgotPasswordEmail);
      setSuccess("Password reset email sent successfully!");
    } catch (err) {
      setError(err.message || "Failed to send password reset email.");
    }
  };

  const menuItems = [
    { id: "details", label: "User Details", icon: "👤" },
    { id: "updateProfile", label: "Update Profile", icon: "✏️" },
    { id: "changePassword", label: "Change Password", icon: "🔐" },
    { id: "forgotPassword", label: "Forgot Password", icon: "🔑" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-sm shadow-xl border-r border-gray-200/50 min-h-screen">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Profile Settings
              </h2>
              <p className="text-gray-600 text-sm">
                Manage your account preferences
              </p>
            </div>

            <div className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 py-4 px-5 text-left rounded-xl transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              <div className="pt-4 mt-6 border-t border-gray-200">
                <button
                  onClick={() => console.log("Navigate to home")}
                  className="w-full flex items-center space-x-3 py-4 px-5 text-left rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 hover:shadow-lg"
                >
                  <span className="text-xl">🏠</span>
                  <span className="font-medium">Back to Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-gray-200/50 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                User Profile
              </h1>
              <p className="text-gray-600">
                Manage your personal information and security settings
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg">
                <div className="flex">
                  <span className="text-red-400 mr-2">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-lg">
                <div className="flex">
                  <span className="text-green-400 mr-2">✅</span>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading your profile...</p>
              </div>
            ) : (
              user && (
                <div className="space-y-8">
                  {activeSection === "details" && (
                    <div>
                      <div className="flex items-center space-x-3 mb-8">
                        <span className="text-2xl">👤</span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          User Details
                        </h3>
                      </div>

                      <div className="flex justify-center mb-8">
                        <div className="relative">
                          {user.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt="User Avatar"
                              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-xl">
                              <span className="text-white text-4xl">👤</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/50">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <p className="text-lg font-medium text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                            {user.name}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200/50">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <p className="text-lg font-medium text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                            {user.email}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200/50">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Role
                          </label>
                          <p className="text-lg font-medium text-gray-800 bg-white p-3 rounded-lg border border-gray-200 capitalize">
                            {user.role}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200/50">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Member Since
                          </label>
                          <p className="text-lg font-medium text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        {user.avatar?.public_id && (
                          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200/50 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Avatar Public ID
                            </label>
                            <p className="text-lg font-medium text-gray-800 bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm break-all">
                              {user.avatar.public_id}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeSection === "updateProfile" && (
                    <div>
                      <div className="flex items-center space-x-3 mb-8">
                        <span className="text-2xl">✏️</span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Update Profile
                        </h3>
                      </div>

                      <form
                        onSubmit={handleProfileUpdate}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                name: e.target.value,
                              })
                            }
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                email: e.target.value,
                              })
                            }
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter your email address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Avatar URL
                          </label>
                          <input
                            type="url"
                            name="avatar"
                            value={profileForm.avatar}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                avatar: e.target.value,
                              })
                            }
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter avatar URL (optional)"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg"
                        >
                          Update Profile
                        </button>
                      </form>
                    </div>
                  )}

                  {activeSection === "changePassword" && (
                    <div>
                      <div className="flex items-center space-x-3 mb-8">
                        <span className="text-2xl">🔐</span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Change Password
                        </h3>
                      </div>

                      <form
                        onSubmit={handlePasswordUpdate}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="oldPassword"
                            value={passwordForm.oldPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                oldPassword: e.target.value,
                              })
                            }
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter current password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Confirm new password"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg"
                        >
                          Change Password
                        </button>
                      </form>
                    </div>
                  )}

                  {activeSection === "forgotPassword" && (
                    <div>
                      <div className="flex items-center space-x-3 mb-8">
                        <span className="text-2xl">🔑</span>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Forgot Password
                        </h3>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200/50 mb-6">
                        <p className="text-blue-800 text-sm">
                          Enter your email address and we'll send you a link to
                          reset your password.
                        </p>
                      </div>

                      <form
                        onSubmit={handleForgotPassword}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={forgotPasswordEmail}
                            onChange={(e) =>
                              setForgotPasswordEmail(e.target.value)
                            }
                            required
                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter your email address"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg"
                        >
                          Send Reset Email
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

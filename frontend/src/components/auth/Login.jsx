import React, { useState } from "react";
import { forgotPassword } from "../../services/userServices";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../redux/slices/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState("");

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    dispatch(clearError());

    try {
      const result = await dispatch(login(formData)).unwrap();
      setSuccess("Login successful!");
      setFormData({
        email: "",
        password: "",
      });
      console.log("response", result);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      // Error is already handled by Redux
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    setForgotPasswordLoading(true);

    try {
      const response = await forgotPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(
        response.message || "Password reset email sent successfully!"
      );
      setForgotPasswordEmail("");
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordSuccess("");
      }, 3000);
    } catch (err) {
      setForgotPasswordError(
        err.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Not registered yet?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              Reset Password
            </h3>

            {forgotPasswordError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {forgotPasswordError}
              </div>
            )}
            {forgotPasswordSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {forgotPasswordSuccess}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className={`flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    forgotPasswordLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {forgotPasswordLoading ? "Sending..." : "Send Reset Email"}
                </button>
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import { loginUser, googleLogin, clearAuthData } from "../services/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });
  const [showErrors, setShowErrors] = useState(false);

  // Clear auth on page load
  useEffect(() => {
    clearAuthData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear general error when user modifies any field
    if (error) {
      setError("");
      setShowErrors(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ username: "", password: "" });
    setShowErrors(false);
    setLoading(true);

    // Simple validation
    let hasErrors = false;
    const newFieldErrors = { username: "", password: "" };

    if (!formData.username.trim()) {
      newFieldErrors.username = "Username is required";
      hasErrors = true;
    }

    if (!formData.password) {
      newFieldErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setShowErrors(true);
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData);

      if (response.success) {
        toast.success(response.message || "Login successful!");
        const from = location.state?.from || "/dashboard";

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        // Handle different types of errors
        if (response.errors) {
          // If server returns field-specific errors
          setFieldErrors(response.errors);
          setError("Please fix the errors below");
        } else if (response.message) {
          setError(response.message);
        } else {
          setError("Login failed. Please try again.");
        }
        
        // Show errors after a short delay for better UX
        setTimeout(() => {
          setShowErrors(true);
          toast.error("Login failed. Please check your credentials.");
        }, 300);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "An error occurred. Please try again.";
      
      setError(errorMessage);
      
      setTimeout(() => {
        setShowErrors(true);
        toast.error(errorMessage);
      }, 300);
      
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get field error class
  const getFieldErrorClass = (fieldName) => {
    return showErrors && fieldErrors[fieldName] ? "border-red-500 focus:ring-red-500" : "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-3">
            BB
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm">
            Sign in to your ByteBodh account
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={googleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 rounded-lg py-2 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-500">
            or continue with username/password
          </span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* General Error Message - Animated */}
        {showErrors && error && (
          <div className="mb-4 animate-fadeIn">
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <FaExclamationTriangle className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              {showErrors && fieldErrors.username && (
                <span className="text-xs text-red-500 animate-slideIn">
                  {fieldErrors.username}
                </span>
              )}
            </div>
            <div className="relative">
              <FaEnvelope className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                showErrors && fieldErrors.username ? "text-red-400" : "text-gray-400"
              }`} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                disabled={loading}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-100 transition-colors ${
                  getFieldErrorClass("username")
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {showErrors && fieldErrors.password && (
                <span className="text-xs text-red-500 animate-slideIn">
                  {fieldErrors.password}
                </span>
              )}
            </div>
            <div className="relative">
              <FaLock className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                showErrors && fieldErrors.password ? "text-red-400" : "text-gray-400"
              }`} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-100 transition-colors ${
                  getFieldErrorClass("password")
                }`}
              />
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                disabled={loading}
              />
              Remember me
            </label>
            <Link 
              to="/forgot-password" 
              className="text-blue-600 hover:underline disabled:text-gray-400"
              onClick={(e) => loading && e.preventDefault()}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Switch */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Don&apos;t have an account?{" "}
          <Link 
            to="/register" 
            className="text-blue-600 font-medium hover:underline"
            onClick={(e) => loading && e.preventDefault()}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
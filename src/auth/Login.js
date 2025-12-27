import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
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
    <div className="min-h-screen flex">
      {/* Left Section - Brand/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-blue-50 p-12 flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="mb-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-black to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">BB</span>
              </div>
              <span className="text-2xl font-bold">
                Byte<span className="text-black">Bodh</span>
              </span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-md">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              <span className="text-black">Byte</span>
              <span className="text-blue-600">Bodh</span>
            </h1>
            
            <p className="text-gray-700 text-xl mb-8 leading-relaxed">
              Your all-in-one platform for portfolio building, 
              QR code generation, and professional growth tools.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaArrowRight className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-700">Build stunning portfolios in minutes</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaArrowRight className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-700">Generate & track QR codes</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaArrowRight className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-700">Professional resume builder</span>
              </div>
            </div>
           
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ByteBodh. All rights reserved.
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-black to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">BB</span>
              </div>
              <span className="text-2xl font-bold">
                Byte<span className="text-black">Bodh</span>
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">
              Sign in to continue to your ByteBodh account
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FaGoogle className="text-gray-600" />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* General Error Message */}
          {showErrors && error && (
            <div className="mb-6 animate-fadeIn">
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 ${
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
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all ${
                    getFieldErrorClass("username")
                  }`}
                />
              </div>
              {showErrors && fieldErrors.username && (
                <span className="text-xs text-red-500 mt-2 block animate-slideIn">
                  {fieldErrors.username}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
                  onClick={(e) => loading && e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 ${
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
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all ${
                    getFieldErrorClass("password")
                  }`}
                />
              </div>
              {showErrors && fieldErrors.password && (
                <span className="text-xs text-red-500 mt-2 block animate-slideIn">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-blue-600 font-semibold hover:underline hover:text-blue-700"
                onClick={(e) => loading && e.preventDefault()}
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
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
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-800 selection:bg-[#6C63FF]/20 selection:text-[#6C63FF]">
      {/* Left Section - Brand/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-indigo-50/30 via-white to-purple-50/40 p-16 flex-col justify-between relative overflow-hidden border-r border-slate-200/50 text-left">
        {/* Soft glowing ambient circle */}
        <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-[#6C63FF]/5 blur-[80px] pointer-events-none"></div>

        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6C63FF]/20">
              BB
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                ByteBodh
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">
                AI Portfolio
              </p>
            </div>
          </Link>

          {/* Hero Content */}
          <div className="max-w-md mt-24 relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Create a Site<br />
              That Gets You<br />
              <span className="bg-gradient-to-r from-[#6C63FF] to-blue-500 bg-clip-text text-transparent">
                Hired.
              </span>
            </h1>
            
            <p className="text-slate-500 text-base mb-10 leading-relaxed font-medium">
              Join thousands of students and working professionals deploying fast, responsive portfolios on ByteBodh.
            </p>

            {/* Simulated mini preview panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900">Arjun Sharma</span>
                <span className="px-2 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] text-[9px] font-bold rounded">Active Profile</span>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 w-full bg-slate-100 rounded-full"></div>
                <div className="h-2.5 w-5/6 bg-slate-100 rounded-full"></div>
                <div className="h-2.5 w-2/3 bg-slate-100 rounded-full"></div>
              </div>
              <div className="flex gap-2 pt-2">
                <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-[10px]">✓</span>
                <span className="text-[11px] text-slate-500 font-semibold">1-Click PDF Resume Generated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-slate-400 text-xs font-semibold relative z-10">
          © {new Date().getFullYear()} ByteBodh. All rights reserved.
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-16 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                BB
              </div>
              <span className="text-xl font-black text-slate-900">ByteBodh</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm font-medium">
              Sign in to continue to your ByteBodh account
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300 rounded-2xl py-3.5 px-4 bg-white hover:bg-slate-50 transition-all shadow-sm font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FaGoogle className="text-red-500" />
            <span className="text-sm">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* General Error Message */}
          {showErrors && error && (
            <div className="animate-fadeIn">
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Username
              </label>
              <div className="relative">
                <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${
                  showErrors && fieldErrors.username ? "text-rose-400" : "text-slate-400"
                }`} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm ${
                    getFieldErrorClass("username")
                  }`}
                />
              </div>
              {showErrors && fieldErrors.username && (
                <span className="text-xs text-rose-500 pl-1 block animate-slideIn">
                  {fieldErrors.username}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-[#6C63FF] font-bold hover:underline disabled:text-gray-400"
                  onClick={(e) => loading && e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${
                  showErrors && fieldErrors.password ? "text-rose-400" : "text-slate-400"
                }`} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm ${
                    getFieldErrorClass("password")
                  }`}
                />
              </div>
              {showErrors && fieldErrors.password && (
                <span className="text-xs text-rose-500 pl-1 block animate-slideIn">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pl-1">
              <input 
                type="checkbox" 
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer" 
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2.5 text-xs text-slate-500 font-semibold cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C63FF] hover:bg-[#5b52e6] text-white py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-md shadow-[#6C63FF]/10 hover:shadow-lg hover:shadow-[#6C63FF]/25 mt-4 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FaArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-[#6C63FF] font-extrabold hover:underline"
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
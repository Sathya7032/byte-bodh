import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaCheck, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  registerUser,
  googleLogin,
  getUser,
  isAuthenticated,
} from "../services/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const email = params.get("email");
    const fullName = params.get("fullName");
    const role = params.get("role");

    if (accessToken && refreshToken) {
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            fullName,
            role,
            username: email?.split("@")[0],
          })
        );

        toast.success("Registration successful!");
        navigate("/dashboard");
      } catch {
        toast.error("Failed to process Google registration");
      }
    }
  }, [navigate]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") checkPasswordStrength(value);
    
    // Clear error when user modifies any field
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        const user = getUser();
        toast.success(`Welcome to ByteBodh, ${user?.fullName || "User"}!`);
        navigate("/login");
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains number", met: /[0-9]/.test(formData.password) },
    {
      text: "Contains special character",
      met: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  const strengthColor =
    passwordStrength >= 75
      ? "bg-green-500"
      : passwordStrength >= 50
      ? "bg-blue-500"
      : passwordStrength >= 25
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-800 selection:bg-[#6C63FF]/20 selection:text-[#6C63FF]">
      {/* Left Section - Brand/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-indigo-50/30 via-white to-purple-50/40 p-16 flex-col justify-between relative overflow-hidden border-r border-slate-200/50 text-left font-sans animate-fadeIn">
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
              Showcase Your<br />
              Skills to the<br />
              <span className="bg-gradient-to-r from-[#6C63FF] to-blue-500 bg-clip-text text-transparent">
                World.
              </span>
            </h1>
            
            <p className="text-slate-500 text-base mb-10 leading-relaxed font-medium">
              Create your account in seconds and unlock custom portfolio subdomains, premium template catalog and one-click PDF resumes.
            </p>

            {/* Simulated mini timeline panel */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900">Your Journey</span>
                <span className="px-2 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] text-[9px] font-bold rounded">1-Click Live</span>
              </div>
              <div className="relative pl-6 border-l-2 border-indigo-100 space-y-6 text-left">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#6C63FF] border-4 border-white shadow"></div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none">Register & Verify</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Claim your custom subdomain link instantly.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow"></div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none">Add Experience & Projects</h4>
                  <p className="text-[10px] text-slate-400 mt-1">AI-assisted bio generator completes it for you.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow"></div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none">Share & Get Hired</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Download custom PDF resume with QR mapping.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-slate-400 text-xs font-semibold relative z-10">
          © {new Date().getFullYear()} ByteBodh. All rights reserved.
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-6">
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm font-medium">
              Join ByteBodh and start building your professional presence
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300 rounded-2xl py-3 px-4 bg-white hover:bg-slate-50 transition-all shadow-sm font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle className="text-red-500" />
            <span className="text-sm">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">or sign up with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-fadeIn">
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-4 text-left">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm"
                />
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl p-3 animate-slideIn">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all duration-300 rounded-full`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center text-[10px] font-semibold">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${
                          req.met ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-300"
                        }`}>
                          <FaCheck size={7} />
                        </div>
                        <span className={req.met ? "text-emerald-600 font-bold" : "text-slate-400"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
                      : "border-slate-200"
                  }`}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-rose-500 pl-1 block animate-slideIn">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start pl-1 pt-1">
              <input 
                type="checkbox" 
                id="terms"
                required 
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer" 
                disabled={loading}
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-500 font-semibold cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="text-[#6C63FF] font-bold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#6C63FF] font-bold hover:underline">
                  Privacy Policy
                </Link>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FaArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-[#6C63FF] font-extrabold hover:underline"
                onClick={(e) => loading && e.preventDefault()}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaExclamationTriangle, FaArrowRight, FaArrowLeft, FaKey, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { forgotPassword, resetPassword } from "../services/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // Steps: 1 = Request OTP, 2 = Reset Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

  // Validation rules for Password
  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setShowErrors(false);

    if (!email.trim()) {
      setFieldErrors({ email: "Email is required" });
      setShowErrors(true);
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors({ email: "Please enter a valid email address" });
      setShowErrors(true);
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email.trim());
      if (response.success) {
        toast.success(response.message || "OTP sent successfully!");
        setStep(2);
      } else {
        setError(response.message);
        setShowErrors(true);
        toast.error(response.message || "Failed to send OTP.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred. Please try again.";
      setError(msg);
      setShowErrors(true);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setShowErrors(false);

    const errors = {};
    if (!otp.trim()) {
      errors.otp = "OTP is required";
    } else if (otp.trim().length !== 6) {
      errors.otp = "OTP must be exactly 6 digits";
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      errors.newPassword = passwordError;
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setShowErrors(true);
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(email.trim(), otp.trim(), newPassword);
      if (response.success) {
        toast.success(response.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(response.message);
        setShowErrors(true);
        toast.error(response.message || "Failed to reset password.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred. Please try again.";
      setError(msg);
      setShowErrors(true);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
              Recover Your<br />
              Account<br />
              <span className="bg-gradient-to-r from-[#6C63FF] to-blue-500 bg-clip-text text-transparent">
                Secured.
              </span>
            </h1>
            
            <p className="text-slate-500 text-base mb-10 leading-relaxed font-medium">
              Forgot your password? Don't worry, we have got you covered. Request a one-time passcode on your registered email address to gain access back.
            </p>

            {/* Info Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-900">
                <FaCheckCircle className="text-emerald-500 text-lg" />
                <span>Verification Checklist</span>
              </div>
              <div className="space-y-2 text-xs font-semibold text-slate-500">
                <p>• 6-digit OTP code sent directly to your inbox</p>
                <p>• Secure token verification valid for 10 minutes</p>
                <p>• Instant password updating & secure hashing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-slate-400 text-xs font-semibold relative z-10">
          © {new Date().getFullYear()} ByteBodh. All rights reserved.
        </div>
      </div>

      {/* Right Section - Forgot Password Form */}
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {step === 1 ? "Reset Password" : "Verification"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {step === 1 
                ? "Enter your email address to receive a password reset OTP" 
                : `We've sent a 6-digit verification code to ${email}`}
            </p>
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

          {/* STEP 1: REQUEST OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${
                    showErrors && fieldErrors.email ? "text-rose-400" : "text-slate-400"
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    disabled={loading}
                    className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm ${
                      showErrors && fieldErrors.email ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {showErrors && fieldErrors.email && (
                  <span className="text-xs text-rose-500 pl-1 block animate-slideIn">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C63FF] hover:bg-[#5b52e6] text-white py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-md shadow-[#6C63FF]/10 hover:shadow-lg hover:shadow-[#6C63FF]/25 mt-4 text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP AND RESET */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* OTP */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <FaKey className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${
                    showErrors && fieldErrors.otp ? "text-rose-400" : "text-slate-400"
                  }`} />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    required
                    disabled={loading}
                    className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm tracking-[0.2em] font-mono text-center ${
                      showErrors && fieldErrors.otp ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {showErrors && fieldErrors.otp && (
                  <span className="text-xs text-rose-500 pl-1 block animate-slideIn">
                    {fieldErrors.otp}
                  </span>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                  New Password
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${
                    showErrors && fieldErrors.newPassword ? "text-rose-400" : "text-slate-400"
                  }`} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={loading}
                    className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm ${
                      showErrors && fieldErrors.newPassword ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {showErrors && fieldErrors.newPassword && (
                  <span className="text-xs text-rose-500 pl-1 block animate-slideIn">
                    {fieldErrors.newPassword}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${
                    showErrors && fieldErrors.confirmPassword ? "text-rose-400" : "text-slate-400"
                  }`} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                    className={`w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/15 disabled:bg-slate-50 transition-all text-sm ${
                      showErrors && fieldErrors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                </div>
                {showErrors && fieldErrors.confirmPassword && (
                  <span className="text-xs text-rose-500 pl-1 block animate-slideIn">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6C63FF] hover:bg-[#5b52e6] text-white py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-md shadow-[#6C63FF]/10 hover:shadow-lg hover:shadow-[#6C63FF]/25 mt-4 text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>

              {/* Resend Option */}
              <div className="flex justify-between items-center text-xs font-semibold px-1">
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="text-[#6C63FF] hover:underline disabled:text-slate-400 cursor-pointer"
                >
                  Resend OTP Code
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <FaArrowLeft size={10} />
                  Back to Step 1
                </button>
              </div>
            </form>
          )}

          {/* Footer Back to Login Link */}
          <div className="text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold">
              Remembered your password?{" "}
              <Link 
                to="/login" 
                className="text-[#6C63FF] font-extrabold hover:underline"
                onClick={(e) => loading && e.preventDefault()}
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

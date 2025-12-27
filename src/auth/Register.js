import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaCheck, FaArrowRight } from "react-icons/fa";
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
              <span className="text-black">Join</span>
              <span className="text-blue-600">ByteBodh</span>
            </h1>
            
            <p className="text-gray-700 text-xl mb-8 leading-relaxed">
              Create your free account and unlock powerful tools for your 
              professional journey.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCheck className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-700">Build professional portfolios</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCheck className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-700">Generate & track QR codes</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCheck className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-700">Create ATS-friendly resumes</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaCheck className="text-blue-600 text-sm" />
                </div>
                <span className="text-gray-700">Free starter plan available</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-gray-600 italic mb-3">
                "ByteBodh's portfolio builder helped me showcase my projects 
                beautifully and land multiple interview calls."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">Sarah Miller</p>
                  <p className="text-sm text-gray-500">UI/UX Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ByteBodh. All rights reserved.
        </div>
      </div>

      {/* Right Section - Registration Form */}
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
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">
              Join ByteBodh and start building your professional presence
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FaGoogle className="text-gray-600" />
            <span className="font-medium text-gray-700">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <FaCheck className="text-red-500" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                />
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <FaCheck
                          className={`mr-3 ${
                            req.met ? "text-green-500" : "text-gray-400"
                          }`}
                          size={12}
                        />
                        <span className={req.met ? "text-green-600" : "text-gray-500"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-500 mt-2">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start pt-2">
              <input 
                type="checkbox" 
                id="terms"
                required 
                className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                disabled={loading}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md hover:shadow-lg mt-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 font-semibold hover:underline hover:text-blue-700"
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
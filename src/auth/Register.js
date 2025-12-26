import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
            BB
          </div>
          <h2 className="text-2xl font-semibold">Create Account</h2>
          <p className="text-gray-500 text-sm">
            Join ByteBodh and start your journey
          </p>
        </div>

        {/* Google */}
        <button
          onClick={googleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 rounded-lg py-2 hover:bg-blue-50 transition disabled:opacity-50"
        >
          <FaGoogle />
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-500">or sign up with email</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "fullName", label: "Full Name", icon: <FaUser /> },
            { name: "username", label: "Username", icon: <FaUser /> },
            { name: "email", label: "Email Address", icon: <FaEnvelope /> },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium">{field.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {field.icon}
                </span>
                <input
                  type={field.name === "email" ? "email" : "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {formData.password && (
              <>
                <div className="w-full h-2 bg-gray-200 rounded mt-2">
                  <div
                    className={`h-2 rounded ${strengthColor}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>

                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <FaCheck
                        className={`mr-2 ${
                          req.met ? "text-green-500" : "text-gray-400"
                        }`}
                        size={12}
                      />
                      <span
                        className={req.met ? "text-green-600" : "text-gray-500"}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  Passwords do not match
                </p>
              )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1" />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-blue-600">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

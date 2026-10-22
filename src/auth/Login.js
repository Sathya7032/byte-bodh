import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { loginWithGoogleApi, clearAuthData } from "../services/auth";
import { triggerAppleSignIn, isApplePlatform } from "../utils/appleAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [socialLoading, setSocialLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const isApple = isApplePlatform();

  // Clear auth on page load
  useEffect(() => {
    clearAuthData();
  }, []);

  const handleSuccessfulAuth = (userData) => {
    const displayName = userData?.fullName || userData?.username || "there";
    toast.success(`Welcome back, ${displayName}!`);
    const from = location.state?.from || "/dashboard";
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 400);
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Failed to retrieve Google token");
      return;
    }
    setSocialLoading(true);
    try {
      const res = await loginWithGoogleApi(credentialResponse.credential);
      if (res.success) {
        handleSuccessfulAuth(res.data?.user || res.data);
      } else {
        toast.error(res.message || "Google sign-in was not authorized");
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Google sign-in encountered an error. Please try again.");
    } finally {
      setSocialLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was closed or failed");
  };

  // Apple Sign-In Handler
  const handleAppleLogin = async () => {
    setAppleLoading(true);
    try {
      const res = await triggerAppleSignIn();
      if (res.success) {
        handleSuccessfulAuth(res.data?.user || res.data);
      } else {
        toast.info(res.message || "Apple sign-in requires configured Service ID");
      }
    } catch (err) {
      console.error("Apple sign-in error:", err);
      toast.error("Apple sign-in encountered an error");
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-600">
      {/* Left Section - Clean Minimalist Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-emerald-50/40 via-white to-teal-50/40 p-16 flex-col justify-between relative overflow-hidden border-r border-slate-200/50 text-left">
        <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none"></div>

        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
              BB
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                ByteBodh
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">
                AI Portfolio & Linktree
              </p>
            </div>
          </Link>

          {/* Hero Content - Clean & Minimal */}
          <div className="max-w-md mt-28 relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Create a Site<br />
              That Gets You<br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                Hired.
              </span>
            </h1>

            <p className="text-slate-500 text-base leading-relaxed font-medium">
              Join thousands of students and working professionals deploying fast, responsive portfolios and bio link pages on ByteBodh.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-xs">
                ⚡ 1-Click Fast Auth
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-xs">
                🌐 Custom Domain URL
              </span>
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-xs">
                📱 Mobile Ready
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-slate-400 text-xs font-semibold relative z-10">
          © {new Date().getFullYear()} ByteBodh. All rights reserved.
        </div>
      </div>

      {/* Right Section - Social Login Only */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-14 bg-white relative">
        <div className="w-full max-w-sm space-y-8 text-center">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-2">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
                BB
              </div>
              <span className="text-xl font-black text-slate-900">ByteBodh</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm font-medium">
              Sign in with your preferred account to continue
            </p>
          </div>

          {/* Social Sign-In Buttons (Identical exact size & pill shape) */}
          <div className="flex flex-col items-center gap-3.5 pt-2">
            {/* Google Sign-In */}
            <div className="w-full max-w-[340px] flex justify-center overflow-hidden rounded-full shadow-xs">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
                width="340"
              />
            </div>

            {/* Apple Sign-In - Exactly matching 340px width and 40px height */}
            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={socialLoading || appleLoading}
              className="w-full max-w-[340px] h-[40px] flex items-center justify-center gap-2.5 bg-black hover:bg-neutral-900 text-white rounded-full transition-all duration-200 shadow-xs text-sm font-medium border border-black cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <FaApple className="text-lg" />
              <span>{appleLoading ? "Connecting to Apple..." : "Continue with Apple"}</span>
              {isApple && (
                <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold ml-1">
                  Mac
                </span>
              )}
            </button>
          </div>

          {/* Security footnote */}
          <div className="pt-4 text-xs text-slate-400">
            Protected by Google Identity & Apple Security. No password needed.
          </div>

          {/* Switch to Register */}
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold">
              New to ByteBodh?{" "}
              <Link
                to="/register"
                className="text-emerald-600 font-extrabold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

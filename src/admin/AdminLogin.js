import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminLogin } from '../services/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error("Administrator email is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);
    try {
      const response = await adminLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success) {
        toast.success("Administrator authentication verified!");
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 500);
      } else {
        toast.error(response.message || "Invalid administrator credentials");
      }
    } catch (err) {
      console.error("Admin sign-in error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to authenticate administrator";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-600">
      
      {/* Left Section - Clean Minimalist Branding (Same as User Login & Website) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-emerald-50/40 via-white to-teal-50/40 p-16 flex-col justify-between relative overflow-hidden border-r border-slate-200/50 text-left">
        <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none"></div>

        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
              <Shield size={20} />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                ByteBodh
              </span>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider leading-none">
                Admin Console
              </p>
            </div>
          </Link>

          {/* Hero Branding */}
          <div className="max-w-md mt-24 relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Platform<br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Administration
              </span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Secure administrative access for managing subscription tiers, auditing Razorpay transactions, configuring portfolio layout templates, and monitoring user accounts.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-400 font-medium z-10 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} ByteBodh Inc.</span>
          <span className="text-emerald-600 font-bold">Encrypted Session</span>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="text-left space-y-2">
            <div className="lg:hidden inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                <Shield size={18} />
              </div>
              <span className="text-xl font-black text-slate-900">ByteBodh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Admin
            </h2>
            <p className="text-sm text-slate-500">
              Enter your administrative credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@bytebodh.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-left">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick link back to website */}
          <div className="pt-4 border-t border-slate-200/60 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              &larr; Return to Member Login
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminLogin;

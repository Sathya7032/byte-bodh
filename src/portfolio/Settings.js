import React, { useState } from "react";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { motion } from "framer-motion";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";
import { changePassword } from "../services/auth";
import { toast } from "react-toastify";

const Settings = () => {
  const isGoogleUser = !localStorage.getItem("refreshToken");

  const [securityData, setSecurityData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityErrors, setSecurityErrors] = useState({});

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityErrors({});
    
    const errors = {};
    if (!securityData.oldPassword) {
      errors.oldPassword = "Current password is required";
    }
    if (!securityData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (securityData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters long";
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setSecurityErrors(errors);
      return;
    }

    setSecurityLoading(true);
    try {
      const response = await changePassword(securityData.oldPassword, securityData.newPassword);
      if (response.success) {
        toast.success("Password changed successfully!");
        setSecurityData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast.error(response.message || "Failed to change password");
        setSecurityErrors({ api: response.message });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "An error occurred";
      toast.error(msg);
      setSecurityErrors({ api: msg });
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">Manage your security credentials and profile preferences</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl">
                <FaLock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Security & Password</h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Manage your account credentials and security settings</p>
              </div>
            </div>

            {isGoogleUser ? (
              <div className="bg-amber-50 border border-amber-250 rounded-2xl p-6 text-left max-w-2xl">
                <div className="flex gap-3">
                  <FaExclamationTriangle className="text-amber-600 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Connected via Google OAuth</h4>
                    <p className="text-xs font-semibold text-amber-700 mt-2 leading-relaxed">
                      Your account is linked to your Google profile. Password changes on ByteBodh are disabled for OAuth accounts. 
                      To secure your account, please manage your credentials directly through your Google Account settings.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-md">
                {/* Current Password */}
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-bold text-slate-600">Current Password</label>
                  <input
                    type="password"
                    className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400 ${
                      securityErrors.oldPassword ? "border-red-500 focus:ring-red-500/15" : ""
                    }`}
                    value={securityData.oldPassword}
                    onChange={(e) => setSecurityData({ ...securityData, oldPassword: e.target.value })}
                    placeholder="Enter your current password"
                    required
                  />
                  {securityErrors.oldPassword && (
                    <span className="text-[10px] text-red-500 font-bold block">{securityErrors.oldPassword}</span>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-bold text-slate-600">New Password</label>
                  <input
                    type="password"
                    className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400 ${
                      securityErrors.newPassword ? "border-red-500 focus:ring-red-500/15" : ""
                    }`}
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    placeholder="Enter new password (min. 6 chars)"
                    required
                  />
                  {securityErrors.newPassword && (
                    <span className="text-[10px] text-red-500 font-bold block">{securityErrors.newPassword}</span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-bold text-slate-600">Confirm New Password</label>
                  <input
                    type="password"
                    className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400 ${
                      securityErrors.confirmPassword ? "border-red-500 focus:ring-red-500/15" : ""
                    }`}
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                  {securityErrors.confirmPassword && (
                    <span className="text-[10px] text-red-500 font-bold block">{securityErrors.confirmPassword}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={securityLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                >
                  {securityLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <FaLock className="w-3.5 h-3.5" />
                      Change Password
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

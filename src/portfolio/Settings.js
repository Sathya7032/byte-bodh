import React, { useEffect, useState } from "react";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { getUser, clearAuthData } from "../services/auth";
import { userApi } from "../api/portfolioApiService";
import { getPortfolioUrl } from "../config/api";
import { toast } from "react-toastify";
import {
  FaShieldAlt,
  FaDesktop,
  FaMobileAlt,
  FaTrashAlt,
  FaSignOutAlt,
  FaCheckCircle,
  FaUserCheck,
  FaSpinner,
} from "react-icons/fa";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const [revokingAll, setRevokingAll] = useState(false);

  useEffect(() => {
    const storedUser = getUser();
    setUser(storedUser);
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await userApi.getSessions();
      const sessionList = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setSessions(sessionList);
    } catch (err) {
      console.error("Failed to load sessions:", err);
      // Fallback: at least show current device
      setSessions([
        {
          id: "current",
          deviceName: navigator.userAgent.includes("Mac")
            ? "Apple Mac"
            : navigator.userAgent.includes("Windows")
            ? "Windows PC"
            : "Desktop Browser",
          deviceOs: navigator.platform || "macOS",
          isCurrentSession: true,
          ipAddress: "Current IP",
          lastActiveAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to sign out this device?")) return;
    try {
      setRevokingId(sessionId);
      await userApi.revokeSession(sessionId);
      toast.success("Session revoked successfully.");
      setSessions((prev) => prev.filter((s) => s.id !== sessionId && s.sessionId !== sessionId));
    } catch (err) {
      console.error("Error revoking session:", err);
      toast.error(err.response?.data?.message || "Failed to revoke session.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("This will log you out from all devices including this one. Proceed?"))
      return;
    try {
      setRevokingAll(true);
      await userApi.logoutAll();
      toast.success("All device sessions have been revoked.");
      clearAuthData();
      window.location.href = "/login";
    } catch (err) {
      console.error("Error revoking all sessions:", err);
      toast.error("Failed to revoke all sessions.");
      setRevokingAll(false);
    }
  };

  const portfolioUrl = getPortfolioUrl(user?.username || "portfolio");

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn text-left">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <FaShieldAlt className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Security & Device Sessions</h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Manage your active login sessions, verified identities, and security controls.
            </p>
          </div>
        </div>
      </div>

      {/* Account Identity Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <FaUserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Verified Social Account</h2>
            <p className="text-xs text-slate-400 font-medium">Authentication identity details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
            <p className="text-sm font-black text-slate-900">{user?.fullName || "ByteBodh Creator"}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
            <p className="text-sm font-black text-slate-900 truncate">{user?.email || "—"}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auth Provider</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FaCheckCircle size={10} /> {user?.authProvider || "GOOGLE"} OAuth
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Public Portfolio Link
            </span>
            <p className="text-xs font-bold text-emerald-950 truncate">{portfolioUrl}</p>
          </div>
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap cursor-pointer"
          >
            Open Live Portfolio
          </a>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Active Device Sessions</h2>
            <p className="text-xs text-slate-400 font-medium">
              Devices and browsers currently authenticated to your account
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleLogoutAll}
              disabled={revokingAll}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
            >
              <FaSignOutAlt />
              {revokingAll ? "Signing Out..." : "Sign Out of All Devices"}
            </button>
          )}
        </div>

        {loadingSessions ? (
          <div className="p-12 text-center text-slate-400">
            <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
            <span className="text-xs font-bold">Loading active sessions...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess, idx) => {
              const sid = sess.id || sess.sessionId || idx;
              const isCurrent = sess.isCurrentSession;
              const isMobile =
                (sess.deviceName || "").toLowerCase().includes("iphone") ||
                (sess.deviceName || "").toLowerCase().includes("android") ||
                (sess.deviceOs || "").toLowerCase().includes("ios") ||
                (sess.deviceOs || "").toLowerCase().includes("android");

              return (
                <div
                  key={sid}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs">
                      {isMobile ? <FaMobileAlt size={18} /> : <FaDesktop size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900">
                          {sess.deviceName || "Desktop Browser"}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {sess.deviceOs || "Operating System"} • {sess.ipAddress || "Active Connection"}
                        {sess.lastActiveAt && (
                          <> • Last active {new Date(sess.lastActiveAt).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                  </div>

                  {!isCurrent && sess.id && sess.id !== "current" && (
                    <button
                      onClick={() => handleRevokeSession(sess.id || sess.sessionId)}
                      disabled={revokingId === sid}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Revoke session"
                    >
                      {revokingId === sid ? (
                        <FaSpinner className="animate-spin text-xs" />
                      ) : (
                        <FaTrashAlt size={12} />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;

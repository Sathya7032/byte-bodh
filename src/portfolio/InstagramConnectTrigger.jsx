import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { instagramApi } from "../api/portfolioApiService";
import { getAccessToken } from "../services/auth";
import { FaInstagram, FaArrowLeft, FaBolt, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

/**
 * Direct Frontend Trigger URL for Instagram OAuth Connection.
 * Routes: /instagram-connect and /instagram/connect
 *
 * Automatically verifies authentication, fetches the Meta OAuth authorization URL,
 * and seamlessly redirects the user's browser to Instagram Login for Business.
 */
export default function InstagramConnectTrigger() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    initiateConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initiateConnection = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.info("Please sign in to connect your Instagram account.");
      sessionStorage.setItem("redirectAfterLogin", "/instagram-connect");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await instagramApi.getConnectUrl();
      if (res.data?.authorizationUrl) {
        // Redirect browser to Meta Instagram OAuth Dialog
        window.location.href = res.data.authorizationUrl;
      } else {
        throw new Error("Missing authorization URL from server response");
      }
    } catch (err) {
      console.error("Failed to generate Instagram connect URL:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Could not generate Instagram authorization URL. Please try again.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Instagram Gradient Logo */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shadow-xl shadow-pink-500/20">
          <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
            <FaInstagram className="text-white text-3xl animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-400 text-xs font-black uppercase tracking-wider mb-3">
          <FaBolt size={10} /> Meta Graph API
        </div>

        <h1 className="text-2xl font-black tracking-tight mb-2">
          Connecting Instagram
        </h1>

        {loading && (
          <div className="space-y-4 py-4">
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
              Generating secure OAuth token and preparing Instagram Login for Business authorization...
            </p>

            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-bounce"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
            </div>

            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-4">
              <FaShieldAlt className="text-emerald-400" /> Redirecting to Meta secure login...
            </p>
          </div>
        )}

        {error && (
          <div className="space-y-5 py-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-left">
              <p className="text-xs text-red-400 font-semibold">{error}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={initiateConnection}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-pink-500/20"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/instagram-automation")}
                className="flex items-center justify-center gap-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <FaArrowLeft size={10} /> Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

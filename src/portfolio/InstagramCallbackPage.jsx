import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { instagramApi } from "../api/portfolioApiService";
import { FaInstagram, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

/**
 * Frontend Callback Handler for Instagram OAuth redirects.
 * Routes: /instagram/callback and /auth/instagram/callback
 *
 * Reads 'code' and 'state' from the URL, exchanges the code with the backend
 * via POST /api/v1/instagram/auth/callback, and navigates to /instagram-automation.
 */
export default function InstagramCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("processing"); // "processing" | "success" | "error"
  const [message, setMessage] = useState("Exchanging authorization code with Meta...");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;
    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleCallback = async () => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const statusParam = params.get("status");
    const username = params.get("username");

    // Case 1: Backend redirected here with status=success
    if (statusParam === "success") {
      setStatus("success");
      const msg = username ? `Successfully connected @${username}!` : "Instagram account connected successfully!";
      setMessage(msg);
      toast.success(`🎉 ${msg}`);
      setTimeout(() => navigate("/instagram-automation"), 1200);
      return;
    }

    // Case 2: Meta returned an error or user cancelled
    if (error || errorDescription || statusParam === "error") {
      const err = errorDescription || error || params.get("message") || "Authorization was cancelled.";
      setStatus("error");
      setMessage(err);
      toast.error(err);
      setTimeout(() => navigate("/instagram-automation"), 2500);
      return;
    }

    // Case 3: Code received directly from Meta redirect
    if (code) {
      try {
        setMessage("Verifying token and subscribing to Meta webhooks...");
        const res = await instagramApi.handleCallback(code, state);
        const linkedUsername = res.data?.username;
        setStatus("success");
        const successMsg = linkedUsername
          ? `Successfully connected @${linkedUsername}!`
          : "Instagram connected successfully!";
        setMessage(successMsg);
        toast.success(`🎉 ${successMsg}`);
        setTimeout(() => navigate("/instagram-automation"), 1200);
      } catch (err) {
        console.error("Instagram code exchange failed:", err);
        const errMsg = err.response?.data?.message || err.message || "Failed to link Instagram account.";
        setStatus("error");
        setMessage(errMsg);
        toast.error(errMsg);
        setTimeout(() => navigate("/instagram-automation"), 2500);
      }
      return;
    }

    // Fallback: No parameters received
    navigate("/instagram-automation");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shadow-xl">
          <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
            {status === "success" ? (
              <FaCheckCircle className="text-emerald-400 text-3xl animate-bounce" />
            ) : status === "error" ? (
              <FaExclamationTriangle className="text-red-400 text-3xl" />
            ) : (
              <FaInstagram className="text-white text-3xl animate-pulse" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-black mb-2">
          {status === "success"
            ? "Account Linked!"
            : status === "error"
            ? "Connection Failed"
            : "Completing Instagram Connection"}
        </h2>

        <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">
          {message}
        </p>

        {status === "processing" && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-bounce"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}

        <button
          onClick={() => navigate("/instagram-automation")}
          className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaLock } from "react-icons/fa";

const SubscriptionRequiredNotice = ({ message, title = "Subscription Required" }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-10 text-center shadow-xl border border-slate-800 relative overflow-hidden">
      <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[60px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <FaLock className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-white font-black text-lg">{title}</h3>
        <p className="text-slate-400 text-xs font-semibold mt-2 max-w-md mx-auto leading-relaxed">
          {message || "An active subscription is required to use this feature. Subscribe for ₹29/month or ₹299/year to unlock all templates, blogs and portfolio messages."}
        </p>
        <button
          onClick={() => navigate("/subscription")}
          className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <FaCrown /> Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default SubscriptionRequiredNotice;

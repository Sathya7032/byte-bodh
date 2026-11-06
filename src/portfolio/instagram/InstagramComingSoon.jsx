import React from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaClock, FaArrowLeft, FaComments, FaChartLine, FaPaperPlane } from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";

const UPCOMING = [
  { icon: <FaComments />, title: "Comment-to-DM Automation", desc: "Auto-send your portfolio or Linktree when followers comment a keyword." },
  { icon: <FaPaperPlane />, title: "Publish & Inbox", desc: "Post content and reply to DMs and comments from one place." },
  { icon: <FaChartLine />, title: "Insights", desc: "Reach, engagement and audience analytics for your account." },
];

export default function InstagramComingSoon() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-6">
        <div className="bg-gradient-to-br from-slate-900 via-[#2a0f3a] to-slate-900 rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-pink-500/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 mb-5 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 shadow-xl shadow-pink-500/20">
              <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                <FaInstagram className="text-white text-3xl" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-[11px] font-black uppercase tracking-wider mb-3">
              <FaClock size={10} /> Coming Soon
            </span>

            <h1 className="text-white text-2xl sm:text-3xl font-black tracking-tight">Instagram features are on the way</h1>
            <p className="text-slate-400 text-sm font-medium mt-3 max-w-lg leading-relaxed">
              We're waiting for Meta to approve our app. As soon as it's approved, you'll be able to connect your
              Instagram Professional account here. You don't need to do anything now.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-8 w-full text-left">
              {UPCOMING.map((f) => (
                <div key={f.title} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-300 flex items-center justify-center mb-2">{f.icon}</div>
                  <h3 className="text-white text-xs font-bold">{f.title}</h3>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-2xl text-xs font-black transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <FaArrowLeft size={10} /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

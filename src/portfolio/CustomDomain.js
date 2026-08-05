import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  Globe,
  ShieldCheck,
  Lightning,
  Star,
  Bell,
  CheckCircleFill,
  LockFill,
  ArrowRepeat,
  PersonFill,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

/* ── Countdown helper ──────────────────────────────────────────── */
const LAUNCH_DATE = new Date("2026-09-01T00:00:00");

function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 864e5),
      hours: Math.floor((diff % 864e5) / 36e5),
      minutes: Math.floor((diff % 36e5) / 6e4),
      seconds: Math.floor((diff % 6e4) / 1e3),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return time;
}

/* ── Feature cards ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Globe size={22} className="text-violet-400" />,
    title: "Your Own Domain",
    desc: "Connect yourdomain.com directly to your ByteBodh portfolio — no technical knowledge needed.",
    bg: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-500/20",
  },
  {
    icon: <LockFill size={20} className="text-emerald-400" />,
    title: "Free SSL Certificate",
    desc: "Every custom domain comes with a free HTTPS certificate auto-renewed for you.",
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    icon: <Lightning size={22} className="text-amber-400" />,
    title: "Instant Propagation",
    desc: "DNS changes go live within minutes. One-click setup with our guided wizard.",
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
  },
  {
    icon: <ShieldCheck size={22} className="text-sky-400" />,
    title: "SEO Optimised",
    desc: "A branded domain boosts your search ranking and personal brand visibility.",
    bg: "from-sky-500/10 to-sky-500/5",
    border: "border-sky-500/20",
  },
  {
    icon: <ArrowRepeat size={22} className="text-pink-400" />,
    title: "Flexible Plans",
    desc: "Choose monthly or yearly billing — cancel anytime with zero lock-in.",
    bg: "from-pink-500/10 to-pink-500/5",
    border: "border-pink-500/20",
  },
  {
    icon: <PersonFill size={22} className="text-teal-400" />,
    title: "Dedicated Support",
    desc: "Our team helps you configure your domain records step by step.",
    bg: "from-teal-500/10 to-teal-500/5",
    border: "border-teal-500/20",
  },
];

/* ── Countdown tile ────────────────────────────────────────────── */
function Tile({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function CustomDomain() {
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const countdown = useCountdown(LAUNCH_DATE);

  const handleNotify = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Please enter a valid email"); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900)); // simulated delay
    setNotified(true);
    setSubmitting(false);
    toast.success("You're on the list! We'll notify you at launch 🚀");
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-8 animate-fadeIn text-left">

      {/* ── Hero banner ──────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-700/50 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] shadow-2xl">
        {/* blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-violet-600/20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-sky-600/15 blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-6 py-12 md:py-16 flex flex-col items-center text-center">
          {/* badge */}
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-widest">
            <Star size={12} className="fill-violet-300" /> Coming Soon
          </span>

          {/* globe icon */}
          <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
            <Globe size={38} className="text-white" />
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Custom Domain
          </h1>
          <p className="mt-4 text-slate-300 text-sm md:text-base font-semibold max-w-xl leading-relaxed">
            Connect <span className="text-violet-300 font-black">yourname.com</span> to your portfolio — a fully branded, SSL-secured, SEO-optimised personal domain is just around the corner.
          </p>

          {/* countdown */}
          <div className="mt-10 flex items-center gap-4 sm:gap-6">
            <Tile value={countdown.days}    label="Days"    />
            <span className="text-slate-500 text-2xl font-black pb-5">:</span>
            <Tile value={countdown.hours}   label="Hours"   />
            <span className="text-slate-500 text-2xl font-black pb-5">:</span>
            <Tile value={countdown.minutes} label="Minutes" />
            <span className="text-slate-500 text-2xl font-black pb-5">:</span>
            <Tile value={countdown.seconds} label="Seconds" />
          </div>

          {/* notify form */}
          <div className="mt-10 w-full max-w-md">
            {notified ? (
              <div className="flex items-center justify-center gap-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-6 py-4 text-emerald-300 font-bold text-sm">
                <CheckCircleFill size={18} /> You're on the early-access list!
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex gap-2">
                <div className="flex-1 relative">
                  <Bell size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email for early access"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-2xl shadow-md shadow-violet-600/30 transition-all active:scale-95 cursor-pointer disabled:opacity-60 whitespace-nowrap"
                >
                  {submitting ? "..." : "Notify Me"}
                </button>
              </form>
            )}
            <p className="mt-2.5 text-[10px] text-slate-500 font-semibold">
              No spam. We'll only email you when it launches.
            </p>
          </div>
        </div>
      </div>

      {/* ── What's coming ────────────────────────────────── */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-800">What to Expect</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Here's everything included when Custom Domain goes live.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${f.bg} border ${f.border} rounded-2xl p-5 flex gap-4 hover:scale-[1.01] transition-transform`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing preview ──────────────────────────────── */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-800">Pricing Preview</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Transparent, simple pricing — no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* monthly */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly</span>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-4xl font-black text-slate-800">₹99</span>
              <span className="text-sm text-slate-400 font-bold mb-1">/month</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-2">Billed month-to-month. Cancel any time.</p>
            <ul className="mt-5 space-y-2.5">
              {["1 custom domain", "Free SSL (HTTPS)", "DNS setup wizard", "Standard support"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <CheckCircleFill size={14} className="text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* yearly */}
          <div className="relative bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] rounded-3xl p-7 shadow-xl overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-b-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Yearly</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                  Save 16%
                </span>
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-black text-white">₹999</span>
                <span className="text-sm text-slate-400 font-bold mb-1">/year</span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-2">Billed annually — best value.</p>
              <ul className="mt-5 space-y-2.5">
                {["1 custom domain", "Free SSL (HTTPS)", "DNS setup wizard", "Priority support", "Early-access features"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <CheckCircleFill size={14} className="text-violet-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA strip ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg shadow-violet-600/20">
        <div>
          <h3 className="text-white font-black text-lg">Be first in line 🎉</h3>
          <p className="text-violet-200 text-xs font-semibold mt-1">
            Early-access members get an exclusive launch discount.
          </p>
        </div>
        {notified ? (
          <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-2xl px-5 py-2.5 text-white font-bold text-sm">
            <CheckCircleFill size={16} /> You're on the list
          </div>
        ) : (
          <button
            onClick={() => document.querySelector('input[type="email"]')?.focus()}
            className="px-6 py-3 bg-white text-violet-700 font-black text-sm rounded-2xl shadow-md hover:bg-violet-50 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Get Early Access
          </button>
        )}
      </div>

    </DashboardLayout>
  );
}

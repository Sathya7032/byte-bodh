import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaCrown, FaTimesCircle } from "react-icons/fa";
import usePublicPlans from "../hooks/usePublicPlans";
import { formatPrice, parseFeatures } from "../api/publicPlansApi";
import { isAuthenticated } from "../services/auth";

/* ------------------------------------------------------------------
   Website pricing cards driven by the plans the admin creates in
   Admin → Subscriptions (only ACTIVE plans, in their display order).
------------------------------------------------------------------- */

const fadeInUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

const FREE_FEATURES = [
  "Access to free portfolio templates",
  "Public portfolio link & QR code",
  "Task & project tracker",
  "Contact form on your portfolio",
  "Referral program access",
];
const FREE_MISSING = ["Premium templates", "Personal blogs section"];

const CYCLE_LABEL = { MONTHLY: "Monthly", YEARLY: "Yearly" };
const PERIOD = { MONTHLY: "month", YEARLY: "year" };

const GRID = {
  1: "md:grid-cols-1 max-w-md mx-auto",
  2: "md:grid-cols-2 max-w-4xl mx-auto",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

const PlanCard = ({ plan, cycle, monthlyReference, ctaTo }) => {
  const dark = Boolean(plan.isPopular);
  const features = parseFeatures(plan.features);
  const price = Number(plan.price);
  const discount = Number(plan.discountPercentage) || 0;
  const originalPrice = discount > 0 && discount < 100 ? price / (1 - discount / 100) : null;

  // Yearly: show the monthly equivalent and how much it saves vs paying monthly
  const perMonth = cycle === "YEARLY" ? price / 12 : null;
  const savings =
    cycle === "YEARLY" && monthlyReference && monthlyReference * 12 > price
      ? Math.round((1 - price / (monthlyReference * 12)) * 100)
      : null;

  return (
    <motion.div
      variants={fadeInUp}
      className={`relative rounded-3xl p-8 flex flex-col overflow-hidden ${
        dark
          ? "bg-gradient-to-br from-[#0f172a] via-[#064e3b] to-[#0f172a] shadow-xl border border-slate-800 md:-translate-y-2"
          : "bg-white border border-slate-200/90 shadow-sm"
      }`}
    >
      {dark && (
        <>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </>
      )}

      <div className="relative z-10 flex items-center justify-between gap-2 min-h-[24px]">
        <span className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-500"}`}>{plan.name}</span>
        {plan.isPopular ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
            <FaCrown size={9} /> Most Popular
          </span>
        ) : discount > 0 ? (
          <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            {discount}% off
          </span>
        ) : null}
      </div>

      <div className="relative z-10 mt-3 flex items-end gap-2 flex-wrap">
        <span className={`text-4xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{formatPrice(price, plan.currency)}</span>
        <span className={`text-sm font-bold mb-1 ${dark ? "text-slate-400" : "text-slate-400"}`}>/{PERIOD[cycle] || "period"}</span>
        {originalPrice && (
          <span className={`text-sm font-bold mb-1 line-through ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {formatPrice(Math.round(originalPrice), plan.currency)}
          </span>
        )}
      </div>

      <p className={`relative z-10 text-xs font-semibold mt-2 ${dark ? "text-slate-400" : "text-slate-500"}`}>
        {perMonth ? (
          <>
            Just {formatPrice(Math.round(perMonth * 100) / 100, plan.currency)}/month, billed yearly.
            {savings > 0 && <span className={dark ? "text-emerald-300" : "text-emerald-600"}> Save {savings}%.</span>}
          </>
        ) : (
          <>Billed every {plan.durationDays && plan.durationDays !== 30 ? `${plan.durationDays} days` : "month"}. Cancel any time.</>
        )}
      </p>

      {plan.description && (
        <p className={`relative z-10 text-sm mt-3 leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{plan.description}</p>
      )}

      <ul className="relative z-10 mt-6 space-y-3 flex-1">
        {(features.length ? features : ["Everything in Free", "All premium features"]).map((item) => (
          <li key={item} className={`flex items-start gap-2.5 text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-600"}`}>
            <FaCheckCircle className={`flex-shrink-0 mt-0.5 ${dark ? "text-emerald-400" : "text-emerald-500"}`} />
            {item}
          </li>
        ))}
      </ul>

      <Link
        to={ctaTo}
        state={{ planId: plan.id }}
        className={`relative z-10 mt-8 w-full py-3 text-sm font-black rounded-2xl text-center transition-all ${
          dark
            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
            : "bg-slate-900 hover:bg-slate-800 text-white"
        }`}
      >
        Choose {plan.name}
      </Link>
    </motion.div>
  );
};

const FreeCard = () => (
  <motion.div variants={fadeInUp} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 flex flex-col">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 min-h-[24px] flex items-center">Free</span>
    <div className="mt-3 flex items-end gap-1">
      <span className="text-4xl font-black text-slate-900">₹0</span>
      <span className="text-sm text-slate-400 font-bold mb-1">/forever</span>
    </div>
    <p className="text-xs text-slate-500 font-semibold mt-2">Get started with a live portfolio in minutes.</p>
    <ul className="mt-6 space-y-3 flex-1">
      {FREE_FEATURES.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
          <FaCheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" />
          {item}
        </li>
      ))}
      {FREE_MISSING.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-xs font-semibold text-slate-400">
          <FaTimesCircle className="text-slate-300 flex-shrink-0 mt-0.5" />
          {item}
        </li>
      ))}
    </ul>
    <Link to="/register" className="mt-8 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-black rounded-2xl text-center transition-all">
      Get Started Free
    </Link>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="rounded-3xl border border-slate-200 p-8 bg-white animate-pulse">
    <div className="h-3 w-20 bg-slate-100 rounded" />
    <div className="h-9 w-32 bg-slate-100 rounded mt-4" />
    <div className="h-3 w-40 bg-slate-100 rounded mt-3" />
    <div className="space-y-3 mt-8">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${85 - i * 8}%` }} />
      ))}
    </div>
    <div className="h-11 bg-slate-100 rounded-2xl mt-10" />
  </div>
);

export default function PricingPlans() {
  const { plans, loading, error, reload } = usePublicPlans();
  const loggedIn = isAuthenticated();
  const ctaTo = loggedIn ? "/subscription" : "/register";

  const byCycle = useMemo(() => {
    const groups = { MONTHLY: [], YEARLY: [] };
    plans.forEach((p) => (groups[p.billingCycle] || (groups[p.billingCycle] = [])).push(p));
    return groups;
  }, [plans]);

  const cycles = Object.keys(byCycle).filter((c) => byCycle[c].length);
  const [cycle, setCycle] = useState("MONTHLY");

  useEffect(() => {
    if (cycles.length && !cycles.includes(cycle)) setCycle(cycles[0]);
  }, [cycles, cycle]);

  const visible = byCycle[cycle] || [];
  // Reference monthly price (cheapest monthly plan) for the yearly "save X%" label
  const monthlyReference = byCycle.MONTHLY?.length ? Math.min(...byCycle.MONTHLY.map((p) => Number(p.price) || Infinity)) : null;
  const maxYearlyDiscount = Math.max(0, ...(byCycle.YEARLY || []).map((p) => Number(p.discountPercentage) || 0));

  const cardCount = Math.min(4, 1 + (loading ? 2 : visible.length));

  return (
    <div>
      {/* Billing cycle toggle — only when the admin offers more than one cycle */}
      {cycles.length > 1 && (
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl" role="tablist" aria-label="Billing cycle">
            {cycles.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cycle === c}
                onClick={() => setCycle(c)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  cycle === c
                    ? c === "YEARLY"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {CYCLE_LABEL[c] || c}
                {c === "YEARLY" && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-500 text-white rounded-md uppercase tracking-wider">
                    {maxYearlyDiscount > 0 ? `Save ${maxYearlyDiscount}%` : "Best Value"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <motion.div
        key={cycle}
        className={`grid grid-cols-1 gap-8 items-stretch ${GRID[cardCount] || GRID[4]}`}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <FreeCard />
        {loading
          ? [0, 1].map((i) => <SkeletonCard key={i} />)
          : visible.map((plan) => <PlanCard key={plan.id} plan={plan} cycle={cycle} monthlyReference={monthlyReference} ctaTo={ctaTo} />)}
      </motion.div>

      {!loading && error && (
        <div className="mt-8 text-center text-sm text-slate-500">
          We couldn't load our plans right now.{" "}
          <button onClick={reload} className="font-bold text-emerald-600 hover:underline">
            Try again
          </button>
        </div>
      )}
      {!loading && !error && plans.length === 0 && (
        <p className="mt-8 text-center text-sm text-slate-500">Premium plans are coming soon. Start free today!</p>
      )}
      {!loading && visible.length > 0 && (
        <p className="mt-8 text-center text-xs text-slate-400">Secure payments via Razorpay. Cancel any time.</p>
      )}
    </div>
  );
}

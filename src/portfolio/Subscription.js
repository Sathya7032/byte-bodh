import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "./components/DashboardLayout";
import { getUser } from "../services/auth";
import { subscriptionsApi } from "../api/portfolioApiService";
import {
  FaCrown,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt,
  FaPalette,
  FaExternalLinkAlt,
  FaEnvelopeOpenText,
  FaQrcode,
  FaBolt,
  FaExclamationCircle,
  FaHistory,
} from "react-icons/fa";

const PERKS = [
  { icon: <FaPalette />, text: "Unlock every premium portfolio template in the catalog" },
  { icon: <FaExternalLinkAlt />, text: "Connect your custom domain with automatic SSL" },
  { icon: <FaBolt />, text: "Unlimited Instagram Comment-to-DM auto-replies" },
  { icon: <FaEnvelopeOpenText />, text: "Direct recruiter inbox & portfolio contact messaging" },
  { icon: <FaQrcode />, text: "High-resolution shareable vector QR codes" },
];

const Subscription = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({
    active: false,
    planType: null,
    planName: null,
    startDate: null,
    expiryDate: null,
    remainingDays: null,
  });
  // Real plans from backend (empty array by default - no hardcoded plans)
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [billingCycle, setBillingCycle] = useState("YEARLY");
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch active subscription, plans, and payment history in parallel
      const [statusRes, plansRes, historyRes] = await Promise.allSettled([
        subscriptionsApi.getCurrent(),
        subscriptionsApi.getActivePlans(),
        subscriptionsApi.getHistory(),
      ]);

      // Unpack current subscription
      if (statusRes.status === "fulfilled" && statusRes.value?.data) {
        const subData = statusRes.value.data.data || statusRes.value.data;
        const isActive = Boolean(
          subData.active ||
          subData.isActive ||
          subData.hasActiveSubscription ||
          subData.status === "ACTIVE"
        );
        setStatus({
          active: isActive,
          planType: subData.billingCycle || subData.planType || "PRO",
          planName: subData.planName || (isActive ? "Pro Member" : "Free Plan"),
          startDate:
            subData.startDate || subData.startsAt
              ? new Date(subData.startDate || subData.startsAt).toLocaleDateString()
              : null,
          expiryDate:
            subData.expiryDate || subData.expiresAt
              ? new Date(subData.expiryDate || subData.expiresAt).toLocaleDateString()
              : null,
          remainingDays: subData.remainingDays ?? null,
        });
      }

      // Unpack plans - strictly use backend data, no hardcoded fallbacks
      if (plansRes.status === "fulfilled" && plansRes.value?.data) {
        const plansList = Array.isArray(plansRes.value.data)
          ? plansRes.value.data
          : plansRes.value.data?.data || [];
        setPlans(plansList);

        // Adjust default cycle if only one type exists
        const hasYearly = plansList.some((p) => (p.billingCycle || "").toUpperCase() === "YEARLY");
        const hasMonthly = plansList.some((p) => (p.billingCycle || "").toUpperCase() === "MONTHLY");
        if (!hasYearly && hasMonthly) {
          setBillingCycle("MONTHLY");
        } else if (hasYearly) {
          setBillingCycle("YEARLY");
        }
      } else {
        setPlans([]);
      }

      // Unpack history
      if (historyRes.status === "fulfilled" && historyRes.value?.data) {
        const historyList = Array.isArray(historyRes.value.data)
          ? historyRes.value.data
          : historyRes.value.data?.data || [];
        setHistory(historyList);
      }
    } catch (err) {
      console.error("Error loading subscription data:", err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUser(getUser());
    fetchData();
  }, [fetchData]);

  // Find the plan corresponding to the selected billing cycle
  const selectedPlan =
    plans.find((p) => (p.billingCycle || "").toUpperCase() === billingCycle.toUpperCase()) ||
    plans[0] ||
    null;

  // Available billing cycles based on live plans
  const hasMonthlyPlan = plans.some((p) => (p.billingCycle || "").toUpperCase() === "MONTHLY");
  const hasYearlyPlan = plans.some((p) => (p.billingCycle || "").toUpperCase() === "YEARLY");

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedPlan.id) {
      toast.error("No valid subscription plan selected.");
      return;
    }

    try {
      setProcessing(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setProcessing(false);
        return;
      }

      // 1. Create Razorpay order via backend subscription checkout API
      const checkoutRes = await subscriptionsApi.checkout(selectedPlan.id);
      const orderData = checkoutRes.data?.data || checkoutRes.data;

      if (!orderData || !orderData.razorpayOrderId) {
        throw new Error(orderData?.message || "Failed to create payment order with gateway.");
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.razorpayKeyId || "rzp_test_TpJAO91ANl7CVE",
        amount: orderData.amountInPaise || Math.round(Number(orderData.amount) * 100),
        currency: orderData.currency || "INR",
        name: "ByteBodh",
        description: `${orderData.planName || selectedPlan.name || "Pro"} Subscription`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: orderData.prefillName || user?.fullName || "",
          email: orderData.prefillEmail || user?.email || "",
        },
        theme: { color: "#10B981" },
        handler: async function (response) {
          try {
            // 3. Verify Razorpay cryptographic HMAC signature via backend API
            const verificationPayload = {
              subscriptionId: orderData.subscriptionId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            const verifyRes = await subscriptionsApi.verify(verificationPayload);
            if (verifyRes.data) {
              toast.success("Payment verified! Pro subscription activated successfully.");
              fetchData();
            } else {
              toast.error("Payment verification was not acknowledged.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            toast.error(
              verifyErr.response?.data?.message || "Failed to verify payment with server."
            );
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment window closed.");
            setProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Subscribe error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to start checkout");
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-8 animate-fadeIn text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <FaCrown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Subscription & Plans</h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Unlock every premium template, custom domains, and Instagram Comment-to-DM automation.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
          <FaSpinner className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-semibold">Loading subscription plans...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-5 gap-6">
            {/* Current Status Card */}
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
                  Current Plan Status
                </h3>
                {status.active ? (
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <FaCheckCircle /> PRO MEMBER
                    </span>
                    <p className="text-sm text-slate-700 font-bold">
                      Plan: <span className="text-slate-900 font-black">{status.planName || "Pro Membership"}</span>
                    </p>
                    {status.remainingDays !== null && (
                      <p className="text-xs text-emerald-600 font-bold">
                        {status.remainingDays} days remaining
                      </p>
                    )}
                    {status.startDate && (
                      <p className="text-xs text-slate-400 font-medium">Activated: {status.startDate}</p>
                    )}
                    {status.expiryDate && (
                      <p className="text-xs text-slate-400 font-medium">Expires / Renews: {status.expiryDate}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      FREE TIER
                    </span>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      You are currently on the free tier. Upgrade to unlock all premium templates, custom domains, and automated DMs.
                    </p>
                  </div>
                )}

                {/* Perks list */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Included in Pro
                  </h4>
                  {PERKS.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        {p.icon}
                      </span>
                      <span>{p.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                Safe & secure payments powered by Razorpay with instant cryptographic verification.
              </div>
            </div>

            {/* Plans / Checkout Section or Active Pro Status Panel */}
            {status.active ? (
              // SUBSCRIBED STATE: DO NOT SHOW SUBSCRIBE BUTTON - SHOW PRO DASHBOARD
              <div className="md:col-span-3 bg-gradient-to-br from-slate-900 via-slate-900 to-[#064e3b] text-white border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Top Status Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                        <FaCrown size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-white tracking-tight">
                            ByteBodh PRO Active
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <FaCheckCircle size={10} /> Active
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">
                          You are currently subscribed to {status.planName || "Pro Membership"}.
                        </p>
                      </div>
                    </div>

                    {status.remainingDays !== null && (
                      <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-right self-start sm:self-auto">
                        <span className="text-[10px] font-bold text-slate-300 block uppercase">Validity</span>
                        <span className="text-sm font-black text-amber-300">{status.remainingDays} Days Left</span>
                      </div>
                    )}
                  </div>

                  {/* Plan Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Plan Tier</span>
                      <span className="text-sm font-black text-white mt-1 block truncate">
                        {status.planName || "Pro Member"}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Activated On</span>
                      <span className="text-sm font-black text-white mt-1 block">
                        {status.startDate || "Active"}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Renews / Expires</span>
                      <span className="text-sm font-black text-emerald-400 mt-1 block">
                        {status.expiryDate || "Ongoing"}
                      </span>
                    </div>
                  </div>

                  {/* Active Features Checklist */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      Unlocked Pro Superpowers
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-400 shrink-0" size={13} />
                        <span>All 18 Portfolio Templates Unlocked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-400 shrink-0" size={13} />
                        <span>All 6 Pro Linktree Bio Themes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-400 shrink-0" size={13} />
                        <span>Instagram Comment-to-DM Automation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-400 shrink-0" size={13} />
                        <span>Custom Domain & Vector QR Codes</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="pt-2">
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3">
                      Jump into Pro Tools
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <a
                        href="/instagram-automation"
                        className="p-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 text-white font-bold text-xs flex items-center justify-center gap-2 transition text-center"
                      >
                        <FaBolt className="text-pink-400" /> Instagram Auto-DM
                      </a>
                      <a
                        href="/portfolio-templates"
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition text-center"
                      >
                        <FaPalette className="text-emerald-400" /> Pro Portfolio Themes
                      </a>
                      <a
                        href="/linktree"
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition text-center"
                      >
                        <FaExternalLinkAlt className="text-teal-400" /> Manage Bio Links
                      </a>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Your subscription is active. No further payments required.</span>
                  <span className="text-emerald-400 font-bold">100% Verified</span>
                </div>
              </div>
            ) : plans.length === 0 ? (
              // Empty State: No Subscription Plans Available
              <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-xs">
                  <FaExclamationCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    No Subscription Plans Available
                  </h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mt-1.5 leading-relaxed">
                    There are currently no active subscription plans configured on the platform. Please check back later or contact support if you need early access.
                  </p>
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Refresh Plans
                </button>
              </div>
            ) : (
              // Active Plan Selector & Razorpay Checkout
              <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Choose Billing Frequency</h3>
                      <p className="text-xs text-slate-400 font-medium">Cancel or switch your plan anytime</p>
                    </div>

                    {/* Frequency Switcher */}
                    {(hasMonthlyPlan && hasYearlyPlan) ? (
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
                        <button
                          onClick={() => setBillingCycle("MONTHLY")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            billingCycle === "MONTHLY"
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingCycle("YEARLY")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            billingCycle === "YEARLY"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-slate-500 hover:text-emerald-600"
                          }`}
                        >
                          Yearly
                          <span className="px-1.5 py-0.2 text-[9px] font-black bg-emerald-500 text-white rounded">
                            Save 15%
                          </span>
                        </button>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                        {billingCycle}
                      </span>
                    )}
                  </div>

                  {/* Price Display */}
                  {selectedPlan && (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 tracking-tight">
                          ₹{selectedPlan.price}
                        </span>
                        <span className="text-sm text-slate-400 font-bold">
                          /{billingCycle === "YEARLY" ? "year" : "month"}
                        </span>
                        {selectedPlan.discountPercentage > 0 && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                            {selectedPlan.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-2">
                        {billingCycle === "YEARLY"
                          ? "Billed annually. Best value for creators & students looking for permanent portfolios."
                          : "Billed monthly. Renews automatically every 30 days."}
                      </p>
                    </div>
                  )}

                  {/* Plan Features */}
                  <div className="space-y-2 mb-6 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500" />
                      <span>Instant Pro activation on your live portfolio link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500" />
                      <span>Custom domain configuration (`yourname.com`)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-500" />
                      <span>Full access to template catalog & Instagram auto-reply engine</span>
                    </div>
                  </div>
                </div>

                {/* Subscribe CTA Button */}
                <button
                  onClick={handleSubscribe}
                  disabled={processing || !selectedPlan}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-4 rounded-2xl text-sm font-black transition-all shadow-md shadow-emerald-600/15 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <FaShieldAlt />
                      <span>
                        {status.active ? "Renew / Switch Plan" : "Upgrade to Pro"} — ₹{selectedPlan?.price || 0}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Payment & Invoice History Section */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <FaHistory />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Payment & Invoice History</h3>
                  <p className="text-xs text-slate-400 font-medium">Record of your past subscription transactions</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Plan Name</th>
                      <th className="py-3 px-4">Cycle</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {history.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 text-slate-500">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.planName || "Pro Plan"}
                        </td>
                        <td className="py-3.5 px-4 uppercase text-[11px]">
                          {item.billingCycle || "—"}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₹{item.amountPaid || item.amount || "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              item.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.status === "EXPIRED"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {item.status || "COMPLETED"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 truncate max-w-[140px]">
                          {item.razorpayPaymentId || item.razorpayOrderId || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Subscription;

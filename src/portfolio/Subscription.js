import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "./components/DashboardLayout";
import { getUser } from "../services/auth";
import {
  getSubscriptionStatus,
  getSubscriptionConfig,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  recordSubscriptionPaymentFailure,
} from "../api/subscriptionService";
import {
  FaCrown,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt,
  FaPalette,
  FaBookOpen,
  FaEnvelopeOpenText,
  FaGift,
} from "react-icons/fa";

const PERKS = [
  { icon: <FaPalette />, text: "Unlock every premium portfolio template" },
  { icon: <FaBookOpen />, text: "Enable the personal blogs section" },
  { icon: <FaEnvelopeOpenText />, text: "Receive portfolio contact messages" },
  { icon: <FaGift />, text: "Count toward your referral milestones" },
];

const Subscription = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ active: false, planType: null, startDate: null, expiryDate: null });
  const [config, setConfig] = useState({ monthlyCost: 29, yearlyCost: 299, active: true });
  const [billingCycle, setBillingCycle] = useState("MONTHLY");
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
      const [statusRes, configRes] = await Promise.all([
        getSubscriptionStatus(),
        getSubscriptionConfig().catch(() => ({ data: null })),
      ]);

      if (statusRes.data?.success) {
        setStatus(statusRes.data.data || { active: false });
      }

      const cfg = configRes?.data?.data || configRes?.data;
      if (cfg) {
        setConfig({
          monthlyCost: cfg.monthlyCost ?? 29,
          yearlyCost: cfg.yearlyCost ?? 299,
          active: cfg.active !== undefined ? cfg.active : true,
        });
      }
    } catch (err) {
      console.error("Error loading subscription data:", err);
      toast.error("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUser(getUser());
    fetchData();
  }, [fetchData]);

  const isExpired = (() => {
    if (!status.expiryDate) return false;
    const exp = new Date(status.expiryDate);
    if (isNaN(exp.getTime())) return false;
    exp.setHours(23, 59, 59, 999);
    return exp < new Date();
  })();

  const handleSubscribe = async () => {
    try {
      setProcessing(true);

      const orderRes = await createSubscriptionOrder(billingCycle);
      if (!orderRes.data?.success) {
        throw new Error(orderRes.data?.message || "Order creation failed");
      }
      const orderData = orderRes.data.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setProcessing(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: Math.round(Number(orderData.amount) * 100),
        currency: "INR",
        name: "ByteBodh",
        description: `${billingCycle === "YEARLY" ? "Yearly" : "Monthly"} Subscription`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifySubscriptionPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              toast.success("Subscription activated successfully!");
              fetchData();
            } else {
              toast.error(verifyRes.data?.message || "Payment verification failed.");
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            toast.error(verifyErr.response?.data?.message || "Failed to verify subscription payment");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.email || "",
        },
        theme: { color: "#10B981" },
        modal: {
          ondismiss: async function () {
            toast.warning("Payment cancelled.");
            try {
              await recordSubscriptionPaymentFailure({
                razorpay_order_id: orderData.orderId,
                razorpay_payment_id: "",
                error_code: "PAYMENT_CANCELLED",
                error_description: "Payment cancelled by the user",
              });
            } catch (failErr) {
              console.error("Failed recording subscription failure:", failErr);
            }
            setProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to start subscription checkout");
      setProcessing(false);
    }
  };

  const priceDisplay = billingCycle === "YEARLY" ? config.yearlyCost : config.monthlyCost;

  return (
    <DashboardLayout containerClassName="w-full space-y-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <FaCrown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Subscription</h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              One subscription unlocks every premium template, blogs and portfolio messaging.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
          <FaSpinner className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading subscription details...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-6">
          {/* Status Card */}
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm h-fit">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Current Status</h3>
            {status.active && !isExpired ? (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <FaCheckCircle /> ACTIVE
                </span>
                <p className="text-sm text-slate-600 font-semibold">
                  Plan: <span className="text-slate-900 font-black">{status.planType === "YEARLY" ? "Yearly" : "Monthly"}</span>
                </p>
                {status.startDate && (
                  <p className="text-xs text-slate-400 font-semibold">Started: {status.startDate}</p>
                )}
                {status.expiryDate && (
                  <p className="text-xs text-slate-400 font-semibold">Renews / Expires: {status.expiryDate}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-100">
                  {isExpired ? "EXPIRED" : "NOT SUBSCRIBED"}
                </span>
                <p className="text-sm text-slate-500 font-semibold">
                  Subscribe below to unlock all premium templates and features.
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              {PERKS.map((p, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    {p.icon}
                  </span>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          {/* Plan Selector / Subscribe Card */}
          <div className="md:col-span-3 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl w-fit mb-6">
              <button
                onClick={() => setBillingCycle("MONTHLY")}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  billingCycle === "MONTHLY" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("YEARLY")}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "YEARLY" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-slate-500 hover:text-emerald-600"
                }`}
              >
                Yearly
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-500 text-white rounded-md uppercase tracking-wider">Best Value</span>
              </button>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-slate-900">₹{priceDisplay}</span>
              <span className="text-sm text-slate-400 font-bold mb-2">/{billingCycle === "YEARLY" ? "year" : "month"}</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mb-8">
              {billingCycle === "YEARLY"
                ? "Billed once a year. Cancel any time before renewal."
                : "Billed every month. Cancel any time."}
            </p>

            <button
              onClick={handleSubscribe}
              disabled={processing || !config.active}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-4 rounded-2xl text-sm font-black transition-all shadow-md shadow-emerald-600/15 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaShieldAlt />
                  {status.active && !isExpired ? "Renew / Switch Plan" : "Subscribe Now"} — ₹{priceDisplay}
                </>
              )}
            </button>

            {!config.active && (
              <p className="text-xs text-rose-500 font-bold mt-3 text-center">
                Subscriptions are temporarily unavailable. Please check back later.
              </p>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Subscription;

import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { toast } from "react-toastify";
import {
  adminSubscriptionApi,
  adminSubscriptionPlanApi,
} from "../../api/adminApiService";
import { CLOUDFLARE_R2_PUBLIC_URL } from "../../config/api";
import {
  FaCrown,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaGift,
  FaCreditCard,
  FaCalendarAlt,
} from "react-icons/fa";

const AdminSubscriptions = () => {
  const [tab, setTab] = useState("subscriptions"); // subscriptions | plans | grant
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Plan Modal state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planSubmitting, setPlanSubmitting] = useState(false);
  const [planForm, setPlanForm] = useState({
    planCode: "PRO_ANNUAL",
    name: "Pro Annual",
    description: "Full platform access with unlimited templates and custom domain",
    billingCycle: "YEARLY",
    durationDays: 365,
    price: 299,
    currency: "INR",
    discountPercentage: 15,
    features: "All Templates, Custom Domain, Instagram Automation, Recruiter Inbox",
    isActive: true,
    isPopular: true,
    displayOrder: 1,
  });

  // Manual Grant State
  const [granting, setGranting] = useState(false);
  const [grantForm, setGrantForm] = useState({
    userId: "",
    planId: "",
    customDays: 365,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [subsRes, plansRes] = await Promise.allSettled([
        adminSubscriptionApi.getAll(),
        adminSubscriptionPlanApi.getAll(),
      ]);

      if (subsRes.status === "fulfilled" && subsRes.value?.data) {
        const subsList = Array.isArray(subsRes.value.data)
          ? subsRes.value.data
          : subsRes.value.data?.data || [];
        setSubscriptions(subsList);
      }

      if (plansRes.status === "fulfilled" && plansRes.value?.data) {
        const plansList = Array.isArray(plansRes.value.data)
          ? plansRes.value.data
          : plansRes.value.data?.data || [];
        setPlans(plansList);
        if (plansList.length > 0 && !grantForm.planId) {
          setGrantForm((prev) => ({ ...prev, planId: plansList[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load admin subscription governance:", err);
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  }, [grantForm.planId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Plan Create / Update
  const handleOpenPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({
        planCode: plan.planCode || "",
        name: plan.name || "",
        description: plan.description || "",
        billingCycle: plan.billingCycle || "MONTHLY",
        durationDays: plan.durationDays || 30,
        price: plan.price || 0,
        currency: plan.currency || "INR",
        discountPercentage: plan.discountPercentage || 0,
        features: plan.features || "",
        isActive: plan.isActive !== false,
        isPopular: Boolean(plan.isPopular),
        displayOrder: plan.displayOrder || 1,
      });
    } else {
      setEditingPlan(null);
      setPlanForm({
        planCode: "PRO_MONTHLY",
        name: "Pro Monthly",
        description: "Monthly subscription unlocking all premium features",
        billingCycle: "MONTHLY",
        durationDays: 30,
        price: 29,
        currency: "INR",
        discountPercentage: 0,
        features: "All Templates, Custom Domain, Instagram Automation, Recruiter Inbox",
        isActive: true,
        isPopular: false,
        displayOrder: 1,
      });
    }
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      setPlanSubmitting(true);
      if (editingPlan?.id) {
        await adminSubscriptionPlanApi.update(editingPlan.id, planForm);
        toast.success("Subscription plan updated successfully!");
      } else {
        await adminSubscriptionPlanApi.create(planForm);
        toast.success("Subscription plan created successfully!");
      }
      setShowPlanModal(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save plan:", err);
      toast.error(err.response?.data?.message || "Failed to save subscription plan.");
    } finally {
      setPlanSubmitting(false);
    }
  };

  const handleTogglePlan = async (planId) => {
    try {
      await adminSubscriptionPlanApi.toggle(planId);
      toast.success("Plan status updated.");
      setPlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p))
      );
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Failed to toggle plan status.");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this subscription plan?")) return;
    try {
      await adminSubscriptionPlanApi.delete(planId);
      toast.success("Plan deleted successfully.");
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete plan.");
    }
  };

  // Cancel User Subscription
  const handleCancelSubscription = async (subscriptionId) => {
    const reason = window.prompt("Reason for cancellation (optional):", "Cancelled by Admin");
    if (reason === null) return;
    try {
      await adminSubscriptionApi.cancel(subscriptionId, reason);
      toast.success("User subscription cancelled successfully.");
      fetchData();
    } catch (err) {
      console.error("Cancellation error:", err);
      toast.error(err.response?.data?.message || "Failed to cancel subscription.");
    }
  };

  // Manual Grant Pro Access
  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!grantForm.userId || !grantForm.planId) {
      toast.error("User UUID and Plan are required.");
      return;
    }
    try {
      setGranting(true);
      await adminSubscriptionApi.grantAccess(
        grantForm.userId.trim(),
        grantForm.planId,
        grantForm.customDays
      );
      toast.success("Pro subscription access granted to user!");
      setGrantForm({ userId: "", planId: plans[0]?.id || "", customDays: 365 });
      setTab("subscriptions");
      fetchData();
    } catch (err) {
      console.error("Grant error:", err);
      toast.error(err.response?.data?.message || "Failed to grant subscription access.");
    } finally {
      setGranting(false);
    }
  };

  // Filter subscriptions
  const filteredSubs = subscriptions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.planName?.toLowerCase().includes(term) ||
      s.userEmail?.toLowerCase().includes(term) ||
      s.userFullName?.toLowerCase().includes(term) ||
      s.razorpayOrderId?.toLowerCase().includes(term) ||
      s.razorpayPaymentId?.toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout pageTitle="Subscription Governance">
      <div className="p-6 max-w-7xl mx-auto font-sans text-left space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FaCrown className="text-amber-500" /> Subscription Governance
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage live user subscriptions, Monthly/Yearly plans, and manual Pro access grants.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenPlanModal()}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <FaPlus size={10} /> + New Plan
            </button>
            <button
              onClick={() => setTab("grant")}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FaGift size={11} /> Grant Pro Access
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <FaCrown />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Subscriptions
              </span>
              <h3 className="text-2xl font-black text-slate-900">{subscriptions.length}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
              <FaCreditCard />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Catalog Plans
              </span>
              <h3 className="text-2xl font-black text-slate-900">{plans.length}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <FaCalendarAlt />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pro Subscribers Active
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                {subscriptions.filter((s) => s.status === "ACTIVE").length}
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
          <button
            onClick={() => setTab("subscriptions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === "subscriptions"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 border border-slate-200/60"
            }`}
          >
            User Subscriptions ({subscriptions.length})
          </button>
          <button
            onClick={() => setTab("plans")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === "plans"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 border border-slate-200/60"
            }`}
          >
            Plan Catalog ({plans.length})
          </button>
          <button
            onClick={() => setTab("grant")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === "grant"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                : "bg-white text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 border border-slate-200/60"
            }`}
          >
            Manual Access Grant
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-xs">
            <FaSpinner className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">Loading subscription governance data...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: USER SUBSCRIPTIONS */}
            {tab === "subscriptions" && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search by user email, plan, or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Plan Name</th>
                        <th className="py-3 px-4">Cycle</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Dates</th>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {filteredSubs.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            No subscription records found.
                          </td>
                        </tr>
                      ) : (
                        filteredSubs.map((sub, idx) => (
                          <tr key={sub.id || idx} className="hover:bg-slate-50/50">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                  {sub.userAvatarUrl ? (
                                    <img
                                      src={
                                        sub.userAvatarUrl.startsWith('http')
                                          ? sub.userAvatarUrl
                                          : `${CLOUDFLARE_R2_PUBLIC_URL}/${sub.userAvatarUrl.replace(/^\//, '')}`
                                      }
                                      alt={sub.userFullName || "User"}
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    style={{ display: sub.userAvatarUrl ? 'none' : 'flex' }}
                                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold items-center justify-center text-xs shadow-xs"
                                  >
                                    {(sub.userFullName || sub.userEmail || 'U').charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 leading-tight">{sub.userFullName || "User"}</p>
                                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sub.userEmail || sub.userId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {sub.planName || "Pro Plan"}
                            </td>
                            <td className="py-3.5 px-4 uppercase text-[11px] font-bold">
                              {sub.billingCycle || "—"}
                            </td>
                            <td className="py-3.5 px-4 font-black text-slate-900">
                              ₹{sub.amountPaid || sub.amount || "—"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  sub.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : sub.status === "CANCELLED"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {sub.status || "COMPLETED"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-[10px] text-slate-500 space-y-0.5">
                              <div>Start: {sub.startsAt || sub.startDate || "—"}</div>
                              <div>Expires: {sub.expiresAt || sub.expiryDate || "—"}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 max-w-[130px] truncate">
                              {sub.razorpayPaymentId || sub.razorpayOrderId || "—"}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {sub.status === "ACTIVE" && (
                                <button
                                  onClick={() => handleCancelSubscription(sub.id)}
                                  className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                  title="Cancel active subscription"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PLAN CATALOG MANAGEMENT */}
            {tab === "plans" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                          {p.billingCycle}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {p.isPopular && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800">
                              POPULAR
                            </span>
                          )}
                          <button
                            onClick={() => handleTogglePlan(p.id)}
                            className="text-lg cursor-pointer"
                            title={p.isActive ? "Deactivate plan" : "Activate plan"}
                          >
                            {p.isActive ? (
                              <FaToggleOn className="text-emerald-500" />
                            ) : (
                              <FaToggleOff className="text-slate-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-slate-900">{p.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                        {p.description}
                      </p>

                      <div className="flex items-baseline gap-1.5 my-4">
                        <span className="text-3xl font-black text-slate-900">₹{p.price}</span>
                        <span className="text-xs text-slate-400 font-bold">
                          /{p.billingCycle === "YEARLY" ? "year" : "month"}
                        </span>
                        {p.discountPercentage > 0 && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            {p.discountPercentage}% OFF
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100">
                        <p className="font-bold text-[11px] text-slate-400 uppercase">Features</p>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {p.features || "All Templates, Custom Domain, Instagram Automation"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenPlanModal(p)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FaEdit size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlan(p.id)}
                        className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <FaTrash size={11} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: MANUAL ACCESS GRANT */}
            {tab === "grant" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-xl mx-auto space-y-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <FaGift className="text-emerald-600" /> Manual Pro Access Grant
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Directly grant a user an active Pro subscription without processing a payment gateway transaction.
                  </p>
                </div>

                <form onSubmit={handleGrantAccess} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">User UUID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0686d542-b0a4-49c3-b68f-d851d9f6e75e"
                      value={grantForm.userId}
                      onChange={(e) => setGrantForm({ ...grantForm, userId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Plan *</label>
                    <select
                      value={grantForm.planId}
                      onChange={(e) => setGrantForm({ ...grantForm, planId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.billingCycle}) — ₹{p.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Custom Duration (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={grantForm.customDays}
                      onChange={(e) =>
                        setGrantForm({ ...grantForm, customDays: parseInt(e.target.value) || 30 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={granting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {granting ? "Granting Pro Access..." : "Grant Pro Subscription"}
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {/* MODAL: CREATE / EDIT PLAN */}
        {showPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                {editingPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
              </h3>

              <form onSubmit={handleSavePlan} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Plan Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PRO_MONTHLY"
                      value={planForm.planCode}
                      onChange={(e) => setPlanForm({ ...planForm, planCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Display Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pro Monthly"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Billing Cycle</label>
                    <select
                      value={planForm.billingCycle}
                      onChange={(e) => setPlanForm({ ...planForm, billingCycle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      <option value="MONTHLY">MONTHLY</option>
                      <option value="YEARLY">YEARLY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={planForm.price}
                      onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={planForm.discountPercentage}
                      onChange={(e) => setPlanForm({ ...planForm, discountPercentage: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    value={planForm.features}
                    onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.isActive}
                      onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    Active / Published
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.isPopular}
                      onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    Mark as Popular
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={planSubmitting}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {planSubmitting ? "Saving..." : "Save Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptions;

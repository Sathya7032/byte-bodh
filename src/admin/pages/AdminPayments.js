import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { adminSubscriptionApi } from "../../api/adminApiService";
import { CLOUDFLARE_R2_PUBLIC_URL } from "../../config/api";
import {
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  ShieldAlert,
  Loader2,
  Sparkles
} from "lucide-react";
import { toast } from "react-toastify";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCycle, setSelectedCycle] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Cancellation Modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingSub, setCancellingSub] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const fetchPayments = async () => {
    try {
      setRefreshing(true);
      const res = await adminSubscriptionApi.getAll();
      const data = res.data?.data || res.data || [];
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Failed to fetch subscription payments:", error);
      toast.error("Failed to load transactions and subscription records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filterPayments = useCallback(() => {
    let result = [...payments];

    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.id?.toLowerCase().includes(term) ||
          p.planName?.toLowerCase().includes(term) ||
          p.planCode?.toLowerCase().includes(term) ||
          p.razorpayOrderId?.toLowerCase().includes(term) ||
          p.razorpayPaymentId?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter((p) => {
        if (selectedStatus === "ACTIVE") return p.isCurrentlyActive || p.status === "ACTIVE";
        if (selectedStatus === "CANCELLED") return p.status === "CANCELLED";
        if (selectedStatus === "EXPIRED") return p.status === "EXPIRED" || (!p.isCurrentlyActive && p.status !== "CANCELLED");
        if (selectedStatus === "MANUAL_GRANT") return p.razorpayPaymentId === "ADMIN_MANUAL_GRANT";
        return true;
      });
    }

    // Billing Cycle filter
    if (selectedCycle !== "all") {
      result = result.filter(
        (p) => p.billingCycle?.toUpperCase() === selectedCycle.toUpperCase()
      );
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0));

    setFilteredPayments(result);
    setCurrentPage(1);
  }, [payments, searchTerm, selectedStatus, selectedCycle]);

  useEffect(() => {
    filterPayments();
  }, [filterPayments]);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Copied reference to clipboard!", { autoClose: 1500 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openCancelModal = (subscription) => {
    setCancellingSub(subscription);
    setCancelReason("Administrative cancellation");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingSub) return;
    setSubmittingCancel(true);
    try {
      await adminSubscriptionApi.cancel(cancellingSub.id, cancelReason);
      toast.success("Subscription cancelled successfully.");
      setShowCancelModal(false);
      setCancellingSub(null);
      fetchPayments();
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel subscription.");
    } finally {
      setSubmittingCancel(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Stats
  const totalRevenue = payments.reduce(
    (sum, p) => sum + (p.amountPaid ? Number(p.amountPaid) : 0),
    0
  );
  const activeCount = payments.filter((p) => p.isCurrentlyActive || p.status === "ACTIVE").length;
  const manualCount = payments.filter((p) => p.razorpayPaymentId === "ADMIN_MANUAL_GRANT").length;

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (p) => {
    if (p.razorpayPaymentId === "ADMIN_MANUAL_GRANT") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <Sparkles className="w-3 h-3 text-purple-600" /> Manual Grant
        </span>
      );
    }
    if (p.isCurrentlyActive || p.status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
        </span>
      );
    }
    if (p.status === "CANCELLED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3 text-red-600" /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
        <Clock className="w-3 h-3 text-slate-500" /> {p.status || "Expired"}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Payments & Invoices">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10 mb-4 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="text-slate-600 font-semibold text-sm">Loading transaction records...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Payments & Invoices">
      <div className="space-y-6 text-left">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Payment Audit Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Subscription Payments & Invoices
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Audit Razorpay orders, transaction signatures, Pro subscriptions, and revenue logs.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 text-xs transition-all active:scale-95 cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh Records"}</span>
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center">
            <div className="rounded-xl bg-emerald-50 p-3 mr-4 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-black text-slate-900">{payments.length}</h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 flex items-center">
            <div className="rounded-xl bg-white/20 p-3 mr-4 text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">Platform Revenue</p>
              <h3 className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center">
            <div className="rounded-xl bg-teal-50 p-3 mr-4 text-teal-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Pro</p>
              <h3 className="text-2xl font-black text-slate-900">{activeCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center">
            <div className="rounded-xl bg-purple-50 p-3 mr-4 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Admin Grants</p>
              <h3 className="text-2xl font-black text-slate-900">{manualCount}</h3>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order ID, payment ID, or plan..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                <select
                  className="border border-slate-200/60 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-semibold cursor-pointer"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="MANUAL_GRANT">Manual Grants</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cycle:</span>
                <select
                  className="border border-slate-200/60 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-semibold cursor-pointer"
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                >
                  <option value="all">All Cycles</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Plan & Tier</th>
                  <th className="px-6 py-4">Billing</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Active Period</th>
                  <th className="px-6 py-4">Razorpay References</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {currentPayments.length > 0 ? (
                  currentPayments.map((p) => {
                    const isActive = p.isCurrentlyActive || p.status === "ACTIVE";
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="relative flex-shrink-0 w-8 h-8 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              {p.userAvatarUrl ? (
                                <img
                                  src={
                                    p.userAvatarUrl.startsWith('http')
                                      ? p.userAvatarUrl
                                      : `${CLOUDFLARE_R2_PUBLIC_URL}/${p.userAvatarUrl.replace(/^\//, '')}`
                                  }
                                  alt={p.userFullName || "User"}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                style={{ display: p.userAvatarUrl ? 'none' : 'flex' }}
                                className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold items-center justify-center text-[11px]"
                              >
                                {(p.userFullName || p.userEmail || 'U').charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate text-xs">{p.userFullName || "User"}</div>
                              <div className="text-[10px] text-slate-400 truncate font-mono">{p.userEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{p.planName || "Pro Plan"}</div>
                          <div className="font-mono text-[10px] text-slate-400 uppercase">{p.planCode}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                            {p.billingCycle || "MONTHLY"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap font-black text-slate-900 text-sm">
                          {formatCurrency(p.amountPaid)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(p)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          <div className="font-medium text-slate-700">{formatDate(p.startDate || p.createdAt)} to {formatDate(p.endDate)}</div>
                          {p.remainingDays != null && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              ({p.remainingDays} days remaining)
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-xs font-mono">
                          {p.razorpayPaymentId === "ADMIN_MANUAL_GRANT" ? (
                            <span className="text-purple-600 font-bold text-[11px]">ADMIN_MANUAL_GRANT</span>
                          ) : (
                            <div className="space-y-1">
                              {p.razorpayPaymentId && (
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <span>Pay: {p.razorpayPaymentId}</span>
                                  <button
                                    onClick={() => handleCopy(p.razorpayPaymentId, p.id + "-p")}
                                    className="p-1 hover:text-emerald-600 text-slate-400 cursor-pointer"
                                    title="Copy Payment ID"
                                  >
                                    {copiedId === p.id + "-p" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              )}
                              {p.razorpayOrderId && (
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                                  <span>Ord: {p.razorpayOrderId}</span>
                                  <button
                                    onClick={() => handleCopy(p.razorpayOrderId, p.id + "-o")}
                                    className="p-0.5 hover:text-emerald-600 text-slate-400 cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedId === p.id + "-o" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {isActive && (
                            <button
                              onClick={() => openCancelModal(p)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center">
                      <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-slate-800">No payment transactions found</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Try adjusting your search criteria or filter selections.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <span className="font-bold text-slate-700">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-bold text-slate-700">
                  {Math.min(indexOfLastItem, filteredPayments.length)}
                </span>{" "}
                of <span className="font-bold text-slate-700">{filteredPayments.length}</span> records
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200/60 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Previous
                </button>
                <span className="font-bold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200/60 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Cancellation Modal */}
      {showCancelModal && cancellingSub && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200/60">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center">
              Terminate User Subscription?
            </h3>
            <p className="text-xs text-slate-500 mt-1 text-center">
              This will revoke active Pro features for plan{" "}
              <span className="font-bold text-slate-700">
                "{cancellingSub.planName || cancellingSub.planCode}"
              </span>
              .
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 text-xs border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="e.g. User requested termination or refund issued"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={submittingCancel}
                className="px-4 py-2 border border-slate-200/60 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                Keep Active
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={submittingCancel}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                {submittingCancel && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Termination</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminPayments;

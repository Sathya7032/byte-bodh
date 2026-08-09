import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { toast } from "react-toastify";
import {
  getAllWallets,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../../api/walletService";
import {
  FaWallet,
  FaSpinner,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const AdminWallets = () => {
  const [tab, setTab] = useState("withdrawals"); // withdrawals | wallets
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [processingId, setProcessingId] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [walletsRes, withdrawalsRes] = await Promise.all([
        getAllWallets(),
        getAllWithdrawals(),
      ]);
      setWallets(walletsRes.data?.data || []);
      setWithdrawals(withdrawalsRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load wallet/withdrawal data:", err);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      const res = await approveWithdrawal(id);
      if (res.data?.success) {
        toast.success("Withdrawal approved");
        fetchAll();
      } else {
        toast.error(res.data?.message || "Failed to approve withdrawal");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const note = window.prompt("Optional note for rejection:");
    try {
      setProcessingId(id);
      const res = await rejectWithdrawal(id, note || undefined);
      if (res.data?.success) {
        toast.success("Withdrawal rejected");
        fetchAll();
      } else {
        toast.error(res.data?.message || "Failed to reject withdrawal");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

  const filteredWallets = wallets.filter((w) => {
    const term = searchTerm.toLowerCase();
    return w.userFullName?.toLowerCase().includes(term) || w.userEmail?.toLowerCase().includes(term);
  });

  const filteredWithdrawals = withdrawals.filter((w) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      w.userFullName?.toLowerCase().includes(term) ||
      w.userEmail?.toLowerCase().includes(term) ||
      w.upiId?.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "ALL" || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status) => {
    if (status === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase">
          <FaCheckCircle /> Approved
        </span>
      );
    }
    if (status === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 uppercase">
          <FaTimesCircle /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 uppercase">
        <FaHourglassHalf /> Pending
      </span>
    );
  };

  const totalWalletBalance = wallets.reduce((acc, w) => acc + Number(w.balance || 0), 0);
  const pendingCount = withdrawals.filter((w) => w.status === "PENDING").length;

  return (
    <DashboardLayout pageTitle="Wallets & Withdrawals">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FaWallet className="text-blue-600" /> Wallets &amp; Withdrawals
            </h1>
            <p className="text-slate-600 mt-1">Review user wallet balances and process withdrawal requests.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-sm text-slate-500 font-medium">Total Wallet Balance</p>
            <h3 className="text-2xl font-bold text-slate-800">{formatAmount(totalWalletBalance)}</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-sm text-slate-500 font-medium">Pending Withdrawals</p>
            <h3 className="text-2xl font-bold text-amber-600">{pendingCount}</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-sm text-slate-500 font-medium">Total Withdrawal Requests</p>
            <h3 className="text-2xl font-bold text-slate-800">{withdrawals.length}</h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
            {[
              { id: "withdrawals", label: "Withdrawal Requests" },
              { id: "wallets", label: "All Wallets" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tab === t.id ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm w-64"
              />
            </div>
            {tab === "withdrawals" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-slate-600 font-semibold">Loading data...</p>
          </div>
        ) : tab === "wallets" ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filteredWallets.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-semibold">No wallets found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredWallets.map((w) => (
                      <tr key={w.userId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3 font-semibold text-slate-800">{w.userFullName}</td>
                        <td className="px-6 py-3 text-slate-500">{w.userEmail}</td>
                        <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(w.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filteredWithdrawals.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-semibold">No withdrawal requests found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3">Bank / UPI</th>
                      <th className="px-6 py-3">Requested</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredWithdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-semibold text-slate-800">{w.userFullName}</p>
                          <p className="text-xs text-slate-400">{w.userEmail}</p>
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(w.amount)}</td>
                        <td className="px-6 py-3 text-xs text-slate-500">
                          <p>{w.accountHolderName} · {w.accountNumber} ({w.ifscCode})</p>
                          <p className="text-slate-400">UPI: {w.upiId}</p>
                        </td>
                        <td className="px-6 py-3 text-slate-500 text-xs">{w.createdAt ? new Date(w.createdAt).toLocaleString() : "—"}</td>
                        <td className="px-6 py-3 text-center">{statusBadge(w.status)}</td>
                        <td className="px-6 py-3 text-center">
                          {w.status === "PENDING" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApprove(w.id)}
                                disabled={processingId === w.id}
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-100 transition-all disabled:opacity-50"
                                title="Approve"
                              >
                                <FaCheck size={14} />
                              </button>
                              <button
                                onClick={() => handleReject(w.id)}
                                disabled={processingId === w.id}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100 transition-all disabled:opacity-50"
                                title="Reject"
                              >
                                <FaTimes size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold">{w.processedByEmail || "—"}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminWallets;

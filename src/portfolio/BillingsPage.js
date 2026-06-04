import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { getPaymentHistory } from "../api/templateService";
import { 
  FaCreditCard, 
  FaReceipt, 
  FaSearch, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaFileInvoiceDollar
} from "react-icons/fa";

const BillingsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPaymentHistory();
      if (response.data?.success) {
        setPayments(response.data.data || []);
      } else {
        setError("Failed to fetch payment details.");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.response?.data?.message || "Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "SUCCESS" || s === "COMPLETED" || s === "PAID") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
          <FaCheckCircle className="text-emerald-500" /> Success
        </span>
      );
    }
    if (s === "PENDING" || s === "CREATED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 uppercase tracking-wider">
          <FaHourglassHalf className="text-amber-500 animate-pulse" /> Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 uppercase tracking-wider">
        <FaTimesCircle className="text-rose-500" /> Failed
      </span>
    );
  };

  // Filter payments
  const filteredPayments = payments.filter((item) => {
    const matchesSearch =
      item.templateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toString().includes(searchTerm) ||
      item.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      item.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const stats = {
    totalSpent: payments
      .filter((p) => p.status?.toUpperCase() === "SUCCESS" || p.status?.toUpperCase() === "COMPLETED")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0),
    totalTransactions: payments.length,
    successfulPayments: payments.filter(
      (p) => p.status?.toUpperCase() === "SUCCESS" || p.status?.toUpperCase() === "COMPLETED"
    ).length,
    failedPayments: payments.filter((p) => p.status?.toUpperCase() === "FAILED").length,
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-[#6C63FF]/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-[#6C63FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
              <FaCreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-sans">Billings & Invoices</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                View your payment details, transaction history, and download invoice receipts.
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchPaymentHistory}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer self-start sm:self-center"
          >
            Refresh History
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Spent",
            val: formatAmount(stats.totalSpent),
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-100",
            icon: <FaFileInvoiceDollar className="w-5 h-5 text-emerald-500" />,
          },
          {
            label: "All Transactions",
            val: stats.totalTransactions,
            color: "text-slate-800",
            bg: "bg-slate-50 border-slate-100",
            icon: <FaReceipt className="w-5 h-5 text-slate-400" />,
          },
          {
            label: "Successful payments",
            val: stats.successfulPayments,
            color: "text-indigo-600",
            bg: "bg-indigo-50 border-indigo-100",
            icon: <FaCheckCircle className="w-5 h-5 text-indigo-500" />,
          },
          {
            label: "Failed payments",
            val: stats.failedPayments,
            color: "text-rose-600",
            bg: "bg-rose-50 border-rose-100",
            icon: <FaTimesCircle className="w-5 h-5 text-rose-500" />,
          },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/85 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
              <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.val}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.bg}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/85 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search payments by template or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-[#6C63FF] rounded-xl text-xs font-semibold focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder-slate-400"
          />
        </div>

        <div className="flex gap-2">
          {[
            { id: "ALL", label: "All Payments" },
            { id: "SUCCESS", label: "Success" },
            { id: "PENDING", label: "Pending" },
            { id: "FAILED", label: "Failed" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === btn.id
                  ? "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/15 border-transparent"
                  : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <FaSpinner className="w-8 h-8 text-[#6C63FF] animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Fetching transaction history...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-600 bg-rose-50/50">
            <FaTimesCircle className="w-10 h-10 mx-auto mb-3" />
            <p className="font-bold text-sm">{error}</p>
            <button
              onClick={fetchPaymentHistory}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              💳
            </div>
            <h3 className="text-lg font-black text-slate-800">No transactions found</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm">
              {searchTerm || statusFilter !== "ALL"
                ? "Try adjusting your search criteria or changing status filters."
                : "You have not made any payments yet. Explore premium templates to unlock extra features."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">#{p.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{p.templateName}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(p.date)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {formatAmount(p.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BillingsPage;

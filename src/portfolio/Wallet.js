import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "./components/DashboardLayout";
import {
  getMyWallet,
  getMyWalletTransactions,
  requestWithdrawal,
  getMyWithdrawals,
} from "../api/walletService";
import {
  FaWallet,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaTimes,
} from "react-icons/fa";

const Wallet = () => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [walletRes, txRes, wdRes] = await Promise.all([
        getMyWallet(),
        getMyWalletTransactions(),
        getMyWithdrawals(),
      ]);
      setBalance(walletRes.data?.data?.balance ?? 0);
      setTransactions(txRes.data?.data || []);
      setWithdrawals(wdRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load wallet data:", err);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }
    if (parseFloat(form.amount) > balance) {
      toast.error("Withdrawal amount cannot exceed your wallet balance");
      return;
    }
    try {
      setSubmitting(true);
      const res = await requestWithdrawal({
        amount: parseFloat(form.amount),
        accountHolderName: form.accountHolderName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim(),
        bankName: form.bankName.trim() || undefined,
        upiId: form.upiId.trim(),
      });
      if (res.data?.success) {
        toast.success("Withdrawal request submitted successfully!");
        setShowModal(false);
        setForm({ amount: "", accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "", upiId: "" });
        fetchAll();
      } else {
        toast.error(res.data?.message || "Failed to submit withdrawal request");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase">
          <FaCheckCircle /> Approved
        </span>
      );
    }
    if (s === "REJECTED") {
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

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn text-left">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FaWallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">My Wallet</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Track referral earnings and withdraw your balance.
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available Balance</span>
            <span className="block text-3xl font-black text-emerald-400">{loading ? "—" : formatAmount(balance)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          disabled={loading || balance <= 0}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <FaMoneyBillWave /> Request Withdrawal
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <FaSpinner className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">Loading wallet...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Transactions */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Transaction History</h3>
            </div>
            {transactions.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm font-semibold">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                        {t.type === "CREDIT" ? <FaArrowDown /> : <FaArrowUp />}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.reason || t.type}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{t.date ? new Date(t.date).toLocaleString() : ""}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-black ${t.type === "CREDIT" ? "text-emerald-600" : "text-rose-600"}`}>
                      {t.type === "CREDIT" ? "+" : "-"}{formatAmount(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Withdrawals */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Withdrawal Requests</h3>
            </div>
            {withdrawals.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm font-semibold">No withdrawal requests yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {withdrawals.map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{formatAmount(w.amount)}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{w.createdAt ? new Date(w.createdAt).toLocaleString() : ""}</p>
                      {w.adminNote && <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Note: {w.adminNote}</p>}
                    </div>
                    {statusBadge(w.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdrawal request modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-800">Request Withdrawal</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount (₹) <span className="text-rose-500">*</span></label>
                <input type="number" name="amount" value={form.amount} onChange={handleChange} min="1" max={balance}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold" required />
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Available: {formatAmount(balance)}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Account Holder Name <span className="text-rose-500">*</span></label>
                <input type="text" name="accountHolderName" value={form.accountHolderName} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Account Number <span className="text-rose-500">*</span></label>
                  <input type="text" name="accountNumber" value={form.accountNumber} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">IFSC Code <span className="text-rose-500">*</span></label>
                  <input type="text" name="ifscCode" value={form.ifscCode} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold uppercase" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bank Name</label>
                <input type="text" name="bankName" value={form.bankName} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">UPI ID <span className="text-rose-500">*</span></label>
                <input type="text" name="upiId" value={form.upiId} onChange={handleChange} placeholder="yourname@upi"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold" required />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} disabled={submitting}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50">
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaMoneyBillWave />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Wallet;

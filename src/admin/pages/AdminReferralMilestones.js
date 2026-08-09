import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { toast } from "react-toastify";
import {
  getAllMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getAllReferrers,
  getReferralLeaderboard,
} from "../../api/referralMilestoneService";
import {
  FaGift,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaTrophy,
} from "react-icons/fa";

const AdminReferralMilestones = () => {
  const [tab, setTab] = useState("milestones"); // milestones | referrers | leaderboard
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ requiredReferrals: "", rewardAmount: "", description: "", active: true });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [milestonesRes, referrersRes, leaderboardRes] = await Promise.all([
        getAllMilestones(),
        getAllReferrers(),
        getReferralLeaderboard(20),
      ]);
      setMilestones(milestonesRes.data?.data || []);
      setReferrers(referrersRes.data?.data || []);
      setLeaderboard(leaderboardRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load referral data:", err);
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ requiredReferrals: "", rewardAmount: "", description: "", active: true });
    setShowModal(true);
  };

  const openEditModal = (m) => {
    setEditingId(m.id);
    setForm({
      requiredReferrals: m.requiredReferrals,
      rewardAmount: m.rewardAmount,
      description: m.description || "",
      active: m.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.requiredReferrals || Number(form.requiredReferrals) <= 0) {
      toast.error("Required referrals must be greater than 0");
      return;
    }
    if (!form.rewardAmount || Number(form.rewardAmount) <= 0) {
      toast.error("Reward amount must be greater than 0");
      return;
    }
    const payload = {
      requiredReferrals: parseInt(form.requiredReferrals, 10),
      rewardAmount: parseFloat(form.rewardAmount),
      description: form.description.trim() || null,
      active: form.active,
    };
    try {
      setSubmitting(true);
      if (editingId) {
        await updateMilestone(editingId, payload);
        toast.success("Milestone updated successfully");
      } else {
        await createMilestone(payload);
        toast.success("Milestone created successfully");
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save milestone");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMilestone(toDelete.id);
      toast.success("Milestone deleted successfully");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete milestone");
    } finally {
      setShowDeleteModal(false);
      setToDelete(null);
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

  return (
    <DashboardLayout pageTitle="Referral Milestones">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FaGift className="text-pink-600" /> Referral Program
            </h1>
            <p className="text-slate-600 mt-1">Configure referral reward milestones and review referrer performance.</p>
          </div>
          {tab === "milestones" && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-150"
            >
              <FaPlus className="text-sm" /> Add Milestone
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
          {[
            { id: "milestones", label: "Milestones" },
            { id: "referrers", label: "All Referrers" },
            { id: "leaderboard", label: "Leaderboard" },
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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-slate-600 font-semibold">Loading...</p>
          </div>
        ) : tab === "milestones" ? (
          milestones.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <FaGift size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800">No milestones configured</h3>
              <p className="text-slate-500 mt-1">Add a milestone to start rewarding referrers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${m.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
                      {m.active ? "Active" : "Inactive"}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(m)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg border border-slate-200 transition-all">
                        <FaEdit size={14} />
                      </button>
                      <button onClick={() => { setToDelete(m); setShowDeleteModal(true); }} className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg border border-slate-200 transition-all">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">{m.requiredReferrals} Referrals</h3>
                  <p className="text-sm font-bold text-emerald-600 mt-1">Reward: {formatAmount(m.rewardAmount)}</p>
                  {m.description && <p className="text-xs text-slate-500 mt-2">{m.description}</p>}
                </div>
              ))}
            </div>
          )
        ) : tab === "referrers" ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {referrers.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-semibold">No referrers yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-3">Referrer</th>
                      <th className="px-6 py-3">Referral Code</th>
                      <th className="px-6 py-3 text-center">Joined</th>
                      <th className="px-6 py-3 text-center">Subscribed</th>
                      <th className="px-6 py-3 text-right">Wallet Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {referrers.map((r) => (
                      <tr key={r.referrerId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-semibold text-slate-800">{r.referrerFullName}</p>
                          <p className="text-xs text-slate-400">{r.referrerEmail}</p>
                        </td>
                        <td className="px-6 py-3 font-mono text-xs text-slate-600">{r.referralCode}</td>
                        <td className="px-6 py-3 text-center font-semibold text-slate-700">{r.totalJoinedUsers}</td>
                        <td className="px-6 py-3 text-center font-semibold text-emerald-600">{r.subscribedReferrals}</td>
                        <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(r.walletBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {leaderboard.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-semibold">No leaderboard data yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3 text-center">Joined</th>
                      <th className="px-6 py-3 text-center">Subscribed</th>
                      <th className="px-6 py-3 text-right">Total Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {leaderboard.map((entry) => (
                      <tr key={entry.userId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center gap-1.5 font-black text-slate-700">
                            {entry.rank <= 3 && <FaTrophy className={entry.rank === 1 ? "text-amber-400" : entry.rank === 2 ? "text-slate-400" : "text-amber-700"} />}
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <p className="font-semibold text-slate-800">{entry.fullName}</p>
                          <p className="text-xs text-slate-400">{entry.email}</p>
                        </td>
                        <td className="px-6 py-3 text-center font-semibold text-slate-700">{entry.totalJoinedUsers}</td>
                        <td className="px-6 py-3 text-center font-semibold text-emerald-600">{entry.subscribedReferrals}</td>
                        <td className="px-6 py-3 text-right font-bold text-slate-900">{formatAmount(entry.totalEarned)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? "Edit Milestone" : "Create Milestone"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600">
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Required Referrals <span className="text-rose-500">*</span></label>
                <input type="number" min="1" value={form.requiredReferrals}
                  onChange={(e) => setForm((p) => ({ ...p, requiredReferrals: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reward Amount (₹) <span className="text-rose-500">*</span></label>
                <input type="number" min="1" value={form.rewardAmount}
                  onChange={(e) => setForm((p) => ({ ...p, rewardAmount: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea rows={2} value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-700">Active</span>
                <input type="checkbox" checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} disabled={submitting}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50">
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && toDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                <FaTrash size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Delete Milestone</h3>
                <p className="text-xs text-slate-500">This action is irreversible</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Delete the <strong>{toDelete.requiredReferrals} referrals</strong> milestone?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowDeleteModal(false); setToDelete(null); }} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminReferralMilestones;

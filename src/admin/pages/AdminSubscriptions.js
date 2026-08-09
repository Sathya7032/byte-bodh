import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { toast } from "react-toastify";
import {
  getSubscribedUsers,
  getUnsubscribedUsers,
  getSubscriptionConfig,
  updateSubscriptionConfig,
} from "../../api/subscriptionService";
import {
  FaCrown,
  FaSpinner,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

const AdminSubscriptions = () => {
  const [tab, setTab] = useState("subscribed"); // subscribed | unsubscribed | config
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState([]);
  const [unsubscribed, setUnsubscribed] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [config, setConfig] = useState({ monthlyCost: 29, yearlyCost: 299, active: true });
  const [savingConfig, setSavingConfig] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [subRes, unsubRes, configRes] = await Promise.all([
        getSubscribedUsers(),
        getUnsubscribedUsers(),
        getSubscriptionConfig(),
      ]);
      setSubscribed(subRes.data?.data || []);
      setUnsubscribed(unsubRes.data?.data || []);
      const cfg = configRes.data?.data;
      if (cfg) {
        setConfig({
          monthlyCost: cfg.monthlyCost ?? 29,
          yearlyCost: cfg.yearlyCost ?? 299,
          active: cfg.active !== undefined ? cfg.active : true,
        });
      }
    } catch (err) {
      console.error("Failed to load subscription data:", err);
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      setSavingConfig(true);
      const res = await updateSubscriptionConfig({
        monthlyCost: parseFloat(config.monthlyCost) || 0,
        yearlyCost: parseFloat(config.yearlyCost) || 0,
        active: Boolean(config.active),
      });
      if (res.data?.success) {
        toast.success("Subscription pricing updated successfully");
      } else {
        toast.error(res.data?.message || "Failed to update pricing");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update pricing");
    } finally {
      setSavingConfig(false);
    }
  };

  const activeList = tab === "subscribed" ? subscribed : unsubscribed;
  const filteredList = activeList.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.username?.toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout pageTitle="Subscriptions">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FaCrown className="text-amber-500" /> Subscriptions
            </h1>
            <p className="text-slate-600 mt-1">Manage subscribed users and platform subscription pricing.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className="rounded-2xl bg-emerald-50 p-4 mr-4 text-emerald-600">
              <FaUserCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Subscribed Users</p>
              <h3 className="text-2xl font-bold text-slate-800">{subscribed.length}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className="rounded-2xl bg-rose-50 p-4 mr-4 text-rose-600">
              <FaUserTimes size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Unsubscribed Users</p>
              <h3 className="text-2xl font-bold text-slate-800">{unsubscribed.length}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className="rounded-2xl bg-blue-50 p-4 mr-4 text-blue-600">
              <FaUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-800">{subscribed.length + unsubscribed.length}</h3>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
          {[
            { id: "subscribed", label: "Subscribed" },
            { id: "unsubscribed", label: "Unsubscribed" },
            { id: "config", label: "Pricing Config" },
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
            <p className="text-slate-600 font-semibold">Loading subscription data...</p>
          </div>
        ) : tab === "config" ? (
          <form onSubmit={handleSaveConfig} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Monthly Price (₹)</label>
              <input
                type="number"
                min="1"
                value={config.monthlyCost}
                onChange={(e) => setConfig((p) => ({ ...p, monthlyCost: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Yearly Price (₹)</label>
              <input
                type="number"
                min="1"
                value={config.yearlyCost}
                onChange={(e) => setConfig((p) => ({ ...p, yearlyCost: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                required
              />
            </div>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="block text-sm font-bold text-slate-800">Subscriptions Enabled</span>
                <span className="block text-xs text-slate-500">Allow users to purchase new subscriptions</span>
              </div>
              <input
                type="checkbox"
                checked={config.active}
                onChange={(e) => setConfig((p) => ({ ...p, active: e.target.checked }))}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={savingConfig}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {savingConfig ? <FaSpinner className="animate-spin" /> : <FaSave />}
              Save Pricing
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="relative max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {filteredList.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 font-semibold">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Plan</th>
                      <th className="px-6 py-3">Start Date</th>
                      <th className="px-6 py-3">Expiry Date</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredList.map((u) => (
                      <tr key={u.userId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3 font-semibold text-slate-800">{u.fullName || u.username}</td>
                        <td className="px-6 py-3 text-slate-500">{u.email}</td>
                        <td className="px-6 py-3 text-slate-600 font-semibold">{u.planType || "—"}</td>
                        <td className="px-6 py-3 text-slate-500">{u.startDate || "—"}</td>
                        <td className="px-6 py-3 text-slate-500">{u.expiryDate || "—"}</td>
                        <td className="px-6 py-3 text-center">
                          {u.subscribed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
                              <FaCheckCircle /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100">
                              <FaTimesCircle /> Inactive
                            </span>
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

export default AdminSubscriptions;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { instagramApi, userApi } from "../api/portfolioApiService";
import { getSubscriptionStatus } from "../api/subscriptionService";
import { toast } from "react-toastify";
import {
  FaInstagram,
  FaRobot,
  FaPlus,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaLink,
  FaCopy,
  FaCheck,
  FaCrown,
  FaLock,
} from "react-icons/fa";

export default function InstagramAutomationPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rules"); // "rules" | "logs"
  const [copiedTrigger, setCopiedTrigger] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ruleName: "Lead Magnet - Free Portfolio Link",
    mediaId: "",
    triggerType: "CONTAINS",
    keywords: "LINK, PORTFOLIO",
    dmMessage: "Hey @{username}! Thanks for commenting. Here is my portfolio link: https://{username}.bytebodh.in 🚀",
    publicReplyMessage: "Sent you a DM! Check your inbox 📩",
    isActive: true,
    replyOncePerUser: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accRes, rulesRes, logsRes, subRes, profileRes] = await Promise.allSettled([
        instagramApi.getAccount(),
        instagramApi.getRules(),
        instagramApi.getLogs(0, 25),
        getSubscriptionStatus().catch(() => ({ data: { active: false } })),
        userApi.getProfile().catch(() => ({ data: {} })),
      ]);

      if (subRes.status === "fulfilled" && subRes.value?.data) {
        const subData = subRes.value.data.data || subRes.value.data;
        const profileData = profileRes.status === "fulfilled" && profileRes.value?.data
          ? profileRes.value.data.data || profileRes.value.data
          : {};
        
        const active = Boolean(
          subData.active ||
          subData.isActive ||
          subData.status === "ACTIVE" ||
          profileData.hasActiveSubscription
        );
        setIsSubscribed(active);
      } else if (profileRes.status === "fulfilled" && profileRes.value?.data) {
        const profileData = profileRes.value.data.data || profileRes.value.data;
        setIsSubscribed(Boolean(profileData.hasActiveSubscription));
      }

      if (accRes.status === "fulfilled" && accRes.value.data) {
        setAccount(accRes.value.data);
        // Fetch posts if connected
        try {
          const postsRes = await instagramApi.getUserPosts();
          if (Array.isArray(postsRes.data)) {
            setPosts(postsRes.data);
          }
        } catch (_e) {
          // Non-critical
        }
      } else {
        setAccount(null);
      }

      if (rulesRes.status === "fulfilled" && Array.isArray(rulesRes.value.data)) {
        setRules(rulesRes.value.data);
      }

      if (logsRes.status === "fulfilled" && logsRes.value.data?.content) {
        setLogs(logsRes.value.data.content);
      }
    } catch (err) {
      console.error("Error fetching Instagram data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Handle OAuth redirect status query params from backend or Meta
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get("status");
    const usernameParam = params.get("username");
    const errorParam = params.get("message") || params.get("error");

    if (statusParam === "success") {
      const msg = usernameParam
        ? `Successfully connected @${usernameParam} to ByteBodh Automation!`
        : "Instagram account connected successfully!";
      toast.success(`🎉 ${msg}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchData();
    } else if (statusParam === "error" || errorParam) {
      toast.error(errorParam || "Instagram authorization was cancelled or failed.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const triggerUrl = `${window.location.origin}/instagram-connect`;

  const handleCopyTrigger = () => {
    navigator.clipboard.writeText(triggerUrl);
    setCopiedTrigger(true);
    toast.success("Direct Instagram connect link copied to clipboard!");
    setTimeout(() => setCopiedTrigger(false), 2000);
  };

  const handleStartConnect = async () => {
    try {
      const res = await instagramApi.getConnectUrl();
      if (res.data?.authorizationUrl) {
        window.location.href = res.data.authorizationUrl;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not retrieve Instagram connect URL.");
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!isSubscribed) {
      toast.info("Instagram Comment-to-DM Automation is a PRO feature. Please subscribe to activate rules.");
      navigate("/subscription");
      return;
    }
    if (!account) {
      toast.error("Please connect an Instagram Business account first.");
      return;
    }
    if (!formData.ruleName.trim() || !formData.dmMessage.trim()) {
      toast.error("Rule name and DM message are required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        instagramAccountId: account.id,
        ruleName: formData.ruleName.trim(),
        mediaId: formData.mediaId.trim() || null,
        triggerType: formData.triggerType,
        keywords: formData.keywords.trim(),
        dmMessage: formData.dmMessage.trim(),
        publicReplyMessage: formData.publicReplyMessage.trim() || null,
        isActive: formData.isActive,
        replyOncePerUser: formData.replyOncePerUser,
      };

      const res = await instagramApi.createRule(payload);
      setRules((prev) => [res.data, ...prev]);
      toast.success("Comment-to-DM rule created and active!");
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create rule.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRule = async (rule) => {
    if (!isSubscribed) {
      toast.info("Active PRO subscription required to enable automation rules. Please upgrade to Pro.");
      navigate("/subscription");
      return;
    }
    const nextStatus = !rule.isActive;
    try {
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, isActive: nextStatus } : r))
      );
      await instagramApi.toggleRule(rule.id, nextStatus);
    } catch (_err) {
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, isActive: rule.isActive } : r))
      );
      toast.error("Failed to toggle rule.");
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    try {
      await instagramApi.deleteRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rule deleted.");
    } catch (_err) {
      toast.error("Failed to delete rule.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* ===== TOP BAR & INSTAGRAM STATUS ===== */}
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-pink-200/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {isSubscribed ? (
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <FaCrown size={10} /> PRO UNLOCKED
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-300">
                  <FaLock size={10} /> PRO FEATURE
                </span>
              )}
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Instagram Comment-to-DM
              </h1>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Automatically send direct messages with your portfolio link when followers comment keywords on your reels and posts.
            </p>
          </div>

          {account ? (
            <div className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {account.profilePictureUrl ? (
                    <img src={account.profilePictureUrl} alt={account.username} className="w-full h-full object-cover" />
                  ) : (
                    <FaInstagram className="text-pink-600" size={20} />
                  )}
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-800">@{account.username}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  Connected & Synced
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartConnect}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <FaInstagram size={16} />
              <span>Connect Instagram</span>
            </button>
          )}
        </div>

        {/* ===== PRO FEATURE GATING BANNER (Shown if not subscribed) ===== */}
        {!isSubscribed && (
          <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-600/15 border-2 border-amber-400/40 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20 shrink-0">
                <FaCrown size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Instagram Comment-to-DM is an Exclusive PRO Feature
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    PRO Required
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed max-w-2xl">
                  Subscribe to ByteBodh PRO to unlock unlimited automated DM replies. Automatically send your verified portfolio link, capture leads, and engage followers 24/7 whenever they comment on your posts or reels.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/subscription")}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <FaCrown size={12} />
              <span>Upgrade to PRO Now</span>
            </button>
          </div>
        )}

        {/* Direct Trigger URL Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">
              <FaLink size={12} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                Direct Connect Trigger URL
                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">
                  Instant OAuth
                </span>
              </p>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                {triggerUrl}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyTrigger}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {copiedTrigger ? <FaCheck className="text-emerald-600" size={11} /> : <FaCopy size={11} />}
              <span>{copiedTrigger ? "Copied" : "Copy Trigger URL"}</span>
            </button>
            <button
              onClick={handleStartConnect}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FaInstagram size={12} />
              <span>Trigger Now</span>
            </button>
          </div>
        </div>

        {/* ===== TABS & ACTIONS ===== */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("rules")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "rules"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Rules ({rules.length})
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "logs"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Delivery Logs ({logs.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (!isSubscribed) {
                toast.info("Instagram Comment-to-DM Automation requires an active PRO subscription. Please upgrade to Pro.");
                navigate("/subscription");
                return;
              }
              setModalOpen(true);
            }}
            className={`flex items-center gap-2 font-black text-xs px-4 py-2.5 rounded-xl shadow-sm cursor-pointer transition active:scale-95 ${
              isSubscribed
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950"
            }`}
          >
            {isSubscribed ? <FaPlus size={11} /> : <FaCrown size={12} />}
            <span>{isSubscribed ? "Create Rule" : "Unlock Rule Creation (PRO)"}</span>
          </button>
        </div>

        {/* ===== TAB CONTENT ===== */}
        {activeTab === "rules" ? (
          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
                <FaRobot size={36} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No automation rules configured</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Create a rule like &quot;When anyone comments LINK, send them my verified portfolio URL via DM&quot;.
                </p>
                <button
                  onClick={() => {
                    if (!isSubscribed) {
                      toast.info("Instagram Comment-to-DM Automation requires an active PRO subscription. Please upgrade to Pro.");
                      navigate("/subscription");
                      return;
                    }
                    setModalOpen(true);
                  }}
                  className={`mt-4 px-5 py-2.5 text-xs font-black rounded-xl transition flex items-center gap-1.5 mx-auto ${
                    isSubscribed
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-md"
                  }`}
                >
                  {isSubscribed ? <FaPlus size={11} /> : <FaCrown size={12} />}
                  <span>{isSubscribed ? "Create Rule Now" : "Upgrade to PRO to Create Rules"}</span>
                </button>
              </div>
            ) : (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-800">{rule.ruleName}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {rule.triggerType}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Triggered {rule.triggerCount || 0} times
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Keywords:</span>
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                        {rule.keywords || "ANY"}
                      </span>
                      <span>•</span>
                      <span>Target: {rule.mediaId ? `Post #${rule.mediaId.slice(-6)}` : "All Posts & Reels"}</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 max-w-xl">
                      <span className="font-bold text-slate-700">DM Message:</span> {rule.dmMessage}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleRule(rule)}
                      className={`text-2xl cursor-pointer ${rule.isActive ? "text-emerald-500" : "text-slate-300"}`}
                      title={rule.isActive ? "Pause Rule" : "Activate Rule"}
                    >
                      {rule.isActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Rule"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No comment deliveries recorded yet. When users comment on your posts, delivery logs will show here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Commenter</th>
                      <th className="p-3.5">Comment Text</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">DM Sent</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-bold text-slate-800">@{log.commenterUsername}</td>
                        <td className="p-3.5 text-slate-600 font-mono">&quot;{log.commentText}&quot;</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              log.status === "SENT"
                                ? "bg-emerald-100 text-emerald-800"
                                : log.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 max-w-xs truncate">{log.dmMessageSent || "—"}</td>
                        <td className="p-3.5 text-slate-400">
                          {new Date(log.processedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== CREATE RULE MODAL ===== */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                New Comment-to-DM Rule
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure your trigger keywords and the automated message to send.
              </p>

              <form onSubmit={handleCreateRule} className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ruleName}
                    onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Trigger Keywords (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="LINK, PORTFOLIO, GUIDE"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Automated Direct Message (DM) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.dmMessage}
                    onChange={(e) => setFormData({ ...formData, dmMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Use &#123;username&#125; to personalize with follower&apos;s handle.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Post / Reel
                  </label>
                  {posts.length > 0 ? (
                    <select
                      value={formData.mediaId}
                      onChange={(e) => setFormData({ ...formData, mediaId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">All Posts & Reels (Default)</option>
                      {posts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.mediaType} - {p.caption ? p.caption.slice(0, 40) + "..." : `#${p.id.slice(-6)}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Leave blank for all posts, or enter Meta Media ID"
                      value={formData.mediaId}
                      onChange={(e) => setFormData({ ...formData, mediaId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                  >
                    {saving ? "Creating..." : "Activate Rule"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

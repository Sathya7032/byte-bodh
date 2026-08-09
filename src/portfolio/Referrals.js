import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { getMyReferrals, applyReferralCode } from "../api/profileService";
import { getActiveMilestones } from "../api/referralMilestoneService";
import { toast } from "react-toastify";
import { FaUsers, FaGift, FaCopy, FaCheckCircle, FaUserCheck, FaShareAlt, FaWallet, FaTrophy } from "react-icons/fa";

const Referrals = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [milestones, setMilestones] = useState([]);

  const [referralData, setReferralData] = useState({
    referralCode: "",
    totalJoinedUsers: 0,
    subscribedReferrals: 0,
    walletBalance: 0,
    referredUsers: []
  });

  const [inputCode, setInputCode] = useState("");
  const [codeApplied, setCodeApplied] = useState(false);

  useEffect(() => {
    fetchReferralDetails();
    getActiveMilestones()
      .then((res) => {
        if (res.data?.success) setMilestones(res.data.data || []);
      })
      .catch(() => {});
  }, []);

  const fetchReferralDetails = async () => {
    try {
      setLoading(true);
      const res = await getMyReferrals();
      if (res.data?.success) {
        setReferralData(res.data.data);
      }
    } catch (err) {
      console.error("Error loading referrals:", err);
      toast.error("Failed to load referral details");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount || 0);

  const handleCopyCode = () => {
    if (!referralData.referralCode) return;
    navigator.clipboard.writeText(referralData.referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!referralData.referralCode) return;
    const shareText = `Hey! Join ByteBodh using my referral code: ${referralData.referralCode} and build your premium AI portfolio instantly!`;
    if (navigator.share) {
      navigator.share({
        title: "Join ByteBodh Folio Builder",
        text: shareText,
        url: window.location.origin
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Invitation message copied to clipboard!");
    }
  };

  const handleApplyCode = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      toast.warning("Please enter a referral code");
      return;
    }

    setSubmitting(true);
    try {
      const res = await applyReferralCode(inputCode.trim());
      if (res.data?.success) {
        toast.success(res.data.message || "Referral code applied successfully!");
        setCodeApplied(true);
        setInputCode("");
      } else {
        toast.error(res.data?.message || "Failed to apply referral code");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to apply referral code";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-550 font-bold">Loading referral portal...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn text-left">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[60px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FaGift className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-sans">Referral Program</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Invite your friends to ByteBodh and build networks together.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: SHARE & CODE STATS */}
        <div className="lg:col-span-2 space-y-6">
          {/* STATS BENTO CHECKLIST */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl inline-flex items-center justify-center">
                <FaUsers className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Referred Friends</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-3xl font-black text-slate-800">{referralData.totalJoinedUsers}</h3>
                  <span className="text-xs text-slate-500 font-semibold">joined account(s)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">Your Referral Code</span>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-inner">
                <span className="font-mono text-base font-black text-emerald-600 tracking-widest">
                  {referralData.referralCode || "N/A"}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    <FaCopy size={14} className={copied ? "text-emerald-500 scale-110" : "transition-transform active:scale-90"} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                    title="Share Invitation"
                  >
                    <FaShareAlt size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SUBSCRIBED REFERRALS + WALLET */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-violet-50 border border-violet-100 text-violet-600 rounded-xl inline-flex items-center justify-center">
                <FaUserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subscribed Referrals</span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{referralData.subscribedReferrals || 0}</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Counts toward your milestone rewards</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/wallet")}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer text-left"
            >
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl inline-flex items-center justify-center">
                <FaWallet className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wallet Balance</span>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{formatAmount(referralData.walletBalance)}</h3>
                <p className="text-[10px] text-emerald-600 font-bold">View wallet &amp; withdraw →</p>
              </div>
            </button>
          </div>

          {/* MILESTONES */}
          {milestones.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
                <FaTrophy className="text-amber-500" /> Referral Reward Milestones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestones.map((m) => {
                  const reached = (referralData.subscribedReferrals || 0) >= m.requiredReferrals;
                  return (
                    <div
                      key={m.id}
                      className={`rounded-2xl p-4 border ${reached ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg font-black text-slate-800">{m.requiredReferrals} referrals</span>
                        {reached && <FaCheckCircle className="text-emerald-500" />}
                      </div>
                      <p className="text-sm font-bold text-emerald-600">{formatAmount(m.rewardAmount)}</p>
                      {m.description && <p className="text-[10px] text-slate-400 font-semibold mt-1">{m.description}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* REFERRED FRIENDS LIST */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
              <span>👥</span> Referred Friends
            </h3>

            {referralData.referredUsers.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  👋
                </div>
                <h4 className="text-sm font-black text-slate-800">No referrals yet</h4>
                <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm text-center">
                  Share your referral code with friends to help them get started on ByteBodh.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-slate-650">
                  <thead>
                    <tr className="border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">
                      <th className="pb-3.5">User</th>
                      <th className="pb-3.5">Username</th>
                      <th className="pb-3.5">Email</th>
                      <th className="pb-3.5">Joined Date</th>
                      <th className="pb-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {referralData.referredUsers.map((u) => {
                      const initials = u.fullName ? u.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";
                      return (
                        <tr key={u.userId} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-[10px]">
                              {initials}
                            </div>
                            <span className="font-bold text-slate-800">{u.fullName || "User"}</span>
                          </td>
                          <td className="py-3 text-slate-500">@{u.username || "username"}</td>
                          <td className="py-3 text-slate-500">{u.email || "N/A"}</td>
                          <td className="py-3 text-slate-500">{formatDate(u.joinedDate)}</td>
                          <td className="py-3">
                            {u.subscribed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100">
                                Subscribed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-slate-400 bg-slate-50 border border-slate-100">
                                Not Yet
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: APPLY REFERRAL CODE */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <span>🎟️</span> Support a Friend
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-6 leading-relaxed">
              If a friend invited you to ByteBodh, enter their referral code below to link your account.
            </p>

            {codeApplied ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-left">
                <FaCheckCircle className="text-emerald-500 flex-shrink-0 text-base" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-800">Referral Code Applied</h4>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Thank you for supporting your referrer!</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplyCode} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">
                    Referral Code
                  </label>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-slate-200 focus:border-emerald-500 rounded-2xl text-xs font-black focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono tracking-widest text-center uppercase placeholder-slate-350"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !inputCode.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-600/15 hover:shadow-lg cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Applying code...</span>
                    </>
                  ) : (
                    <>
                      <FaUserCheck size={12} />
                      <span>Apply Referral Code</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referrals;

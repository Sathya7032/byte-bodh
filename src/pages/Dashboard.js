import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { getUser, getAccessToken } from "../services/auth";
import { getUserStats, getMyProfile, getContactMessages } from "../api/profileService";
import { getPaymentHistory } from "../api/templateService";
import { getPortfolioUrl } from "../config/api";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { 
  FaEye, 
  FaTasks, 
  FaArrowRight,
  FaSpinner,
  FaPalette,
  FaCopy,
  FaExternalLinkAlt,
  FaEnvelopeOpen,
  FaGlobe,
  FaUsers,
  FaGift
} from "react-icons/fa";

const quotes = [
  {
    text: "Success is the sum of small efforts, repeated day-in and day-out.",
    author: "Robert Collier",
    category: "Consistency"
  },
  {
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon",
    category: "Hard Work"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "Persistence"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Resilience"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Action"
  },
  {
    text: "Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did do.",
    author: "Mark Twain",
    category: "Opportunity"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalTemplatesOwned: 0,
    activeTemplateName: "None",
    referralCount: 0,
    referralCode: ""
  });
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [username, setUsername] = useState("");
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUser();

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchDashboardStats();
    
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 30000);

    return () => clearInterval(quoteInterval);
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch stats, profile, messages and payments in parallel
      const [statsRes, profileRes, messagesRes, paymentsRes] = await Promise.all([
        getUserStats().catch(err => ({ data: { success: false } })),
        getMyProfile().catch(err => ({ data: { success: false } })),
        getContactMessages().catch(err => ({ data: { success: false } })),
        getPaymentHistory().catch(err => ({ data: { success: false } }))
      ]);

      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
      
      const profileData = profileRes.data || {};
      if (profileData.user?.username) {
        setUsername(profileData.user.username);
      }

      if (messagesRes.data?.success) {
        setRecentMessages((messagesRes.data.data || []).slice(0, 3));
      }

      if (paymentsRes.data?.success) {
        setRecentPayments((paymentsRes.data.data || []).slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferral = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedReferral(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleNextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleCopyLink = () => {
    const liveUrl = getPortfolioUrl(username || 'profile');
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    toast.success("Portfolio link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="text-[#6C63FF] text-2xl animate-spin" />
              </div>
            </div>
            <p className="text-lg text-slate-600 mt-6 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const completionPercent =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const userName = user?.username || username || user?.fullName || user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const portfolioUrl = getPortfolioUrl(username);

  // SVG circular loader variables
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercent / 100) * circumference;

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn">
          
          {/* PREMIUM BANNER CARD */}
          <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 animate-fadeIn text-left">
            <div className="absolute -top-[10%] -left-[10%] w-[250px] h-[250px] rounded-full bg-[#6C63FF]/10 blur-[60px] pointer-events-none"></div>
            <div className="absolute -bottom-[20%] -right-[15%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-[#6C63FF] rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-[#6C63FF]/30">
                  {userInitial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight">{userName}</h1>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Manage your digital identity & layout parameters</p>
                </div>
              </div>

              {/* Share widget */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 max-w-xl w-full">
                <div className="flex items-center gap-2 pl-3 flex-1 overflow-hidden min-w-0">
                  <FaGlobe className="text-[#6C63FF] flex-shrink-0 text-sm" />
                  <span className="text-xs font-semibold text-slate-200 truncate">{portfolioUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <FaCopy className="text-indigo-200" /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#6C63FF] hover:bg-[#5b52e6] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6C63FF]/20 hover:shadow-lg hover:shadow-[#6C63FF]/30 active:scale-95"
                  >
                    <FaExternalLinkAlt size={10} /> View Site
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO GRID ANALYTICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* CARD 1: VIEWS */}
            <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-[#6C63FF]/30 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-indigo-50 border border-indigo-100 text-[#6C63FF] rounded-xl inline-flex items-center justify-center mb-3">
                    <FaEye className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    +14% ↗
                  </div>
                </div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total Profile Views</span>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.profileViews}</h3>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="mt-4 -mx-5 -mb-5 h-12 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 100 30" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0,28 C10,25 18,5 30,18 C42,31 55,8 70,22 C85,36 90,10 100,5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0,28 C10,25 18,5 30,18 C42,31 55,8 70,22 C85,36 90,10 100,5 L100,30 L0,30 Z"
                    fill="url(#sparkline-grad)"
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* CARD 2: COMPLETENESS */}
            <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-orange-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex-1">
                  <div className="p-2 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl inline-flex items-center justify-center mb-3">
                    <FaTasks className="w-4 h-4" />
                  </div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Setup Progress</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-3xl font-black text-slate-800">{completionPercent}%</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">({stats.completedTasks}/{stats.totalTasks} Done)</span>
                </div>
                {/* SVG circular indicator */}
                <div className="relative flex items-center justify-center w-14 h-14 mt-1">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r={radius}
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r={radius}
                      className="text-amber-500 transition-all duration-1000"
                      strokeWidth="3.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-black text-slate-700">{completionPercent}%</span>
                </div>
              </div>
            </div>

            {/* CARD 3: ACTIVE TEMPLATE */}
            <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 to-indigo-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="p-2 bg-purple-50 border border-purple-100 text-purple-600 rounded-xl inline-flex items-center justify-center mb-3">
                  <FaPalette className="w-4 h-4" />
                </div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Design Layout</span>
                <h3 className="text-base font-black text-slate-800 mt-2 truncate flex items-center gap-1.5" title={stats.activeTemplateName || "None"}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF] inline-block"></span>
                  {stats.activeTemplateName || "None"}
                </h3>
                <span className="block text-[10px] text-slate-400 font-semibold mt-1">Owned: {stats.totalTemplatesOwned || 0} template(s)</span>
              </div>
              <div className="flex flex-col gap-1.5 mt-4">
                <Link to="/portfolio-templates" className="text-[10px] text-[#6C63FF] font-extrabold hover:underline flex items-center gap-1">
                  Change Template <FaArrowRight size={8} />
                </Link>
                {username && (
                  <a 
                    href={getPortfolioUrl(username)} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] text-emerald-600 font-extrabold hover:underline flex items-center gap-1"
                  >
                    View Live Site <FaExternalLinkAlt size={8} />
                  </a>
                )}
              </div>
            </div>

            {/* CARD 4: RECRUITER INBOX */}
            <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-green-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl inline-flex items-center justify-center mb-3">
                    <FaEnvelopeOpen className="w-4 h-4" />
                  </div>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recruiter Messages</span>
                <h3 className="text-xl font-black text-slate-800 mt-2">Inbox</h3>
              </div>
              <Link to="/contacts" className="text-[10px] text-emerald-600 font-extrabold hover:underline flex items-center gap-1 mt-4">
                Open Messages <FaArrowRight size={8} />
              </Link>
            </div>
          </div>

          {/* REFERRALS CARD */}
          <div className="group relative bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between md:flex-row md:items-center gap-6 text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl inline-flex items-center justify-center">
                  <FaUsers className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Referral Stats</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-800">{stats.referralCount || 0}</h3>
                    <span className="text-xs text-slate-500 font-semibold">referred user(s)</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <FaGift className="text-indigo-500 text-xs animate-bounce" />
                <span>Share your code to invite your friends!</span>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col gap-2 min-w-[200px]">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Referral Code</span>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 flex items-center justify-between gap-3 shadow-inner">
                <span className="font-mono text-sm font-extrabold text-indigo-600 tracking-wider">
                  {stats.referralCode || "N/A"}
                </span>
                {stats.referralCode && (
                  <button
                    onClick={() => handleCopyReferral(stats.referralCode)}
                    className="p-1.5 hover:bg-slate-200/80 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                    title="Copy referral code"
                  >
                    <FaCopy size={12} className={copiedReferral ? "text-emerald-500 scale-110" : "transition-transform active:scale-90"} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE GRID: QR CODE HUB & RECENT BILLINGS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* COLUMN 1: QR HUB */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
              <div className="w-full text-left flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <span>📱</span> Shareable QR Code
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Let others scan to view your live profile</p>
                </div>
                <Link to="/qr-code" className="text-[10px] text-[#6C63FF] font-extrabold hover:underline">
                  Customize
                </Link>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center shadow-inner max-w-[180px] w-full">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <QRCode
                    id="dashboard-qr-code-svg"
                    value={portfolioUrl || "https://bytebodh.in"}
                    size={120}
                    level="H"
                    fgColor="#6C63FF"
                    bgColor="transparent"
                  />
                </div>
              </div>
              <div className="w-full mt-4 pt-3 border-t border-slate-100 text-center flex flex-col gap-2">
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">
                  Scan to preview on mobile
                </span>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2 bg-indigo-50 border border-indigo-105 hover:bg-indigo-100 text-[#6C63FF] rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FaCopy size={11} /> Copy Public Link
                </button>
              </div>
            </div>

            {/* COLUMN 2: RECENT BILLINGS & PAYMENTS */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <span>💳</span> Recent Payments
                  </h3>
                  <Link to="/billings" className="text-[10px] text-[#6C63FF] font-extrabold hover:underline">
                    View All
                  </Link>
                </div>

                {recentPayments.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center justify-center h-[160px]">
                    <span className="text-2xl mb-2">💸</span>
                    <p className="text-xs text-slate-400 font-bold">No payments found</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Explore premium templates to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {recentPayments.map((p) => {
                      const s = (p.status || "").toUpperCase();
                      const statusColor = 
                        s === "SUCCESS" || s === "COMPLETED" || s === "PAID"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : s === "PENDING" || s === "CREATED"
                          ? "text-amber-600 bg-amber-50 border-amber-100"
                          : "text-rose-600 bg-rose-50 border-rose-100";
                      
                      return (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow">
                          <div className="min-w-0 flex-1 pr-3">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{p.templateName}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ID: #{p.id} • {new Date(p.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-extrabold text-slate-900">
                              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(p.amount)}
                            </span>
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-lg border ${statusColor}`}>
                              {s}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LOWER GRID: INSPIRATION & RECRUITER INBOX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* ROTATING QUOTE BANNER */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-white/10 flex flex-col justify-between min-h-[200px]">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              
              <div className="relative z-10">
                <span className="px-2.5 py-1 bg-white/20 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                  Daily Inspiration
                </span>
                <p className="text-sm font-bold mt-5 italic leading-relaxed">
                  "{quotes[currentQuote].text}"
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <p className="text-[10px] opacity-75 font-semibold">— {quotes[currentQuote].author}</p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevQuote}
                    className="p-2 bg-white/15 hover:bg-white/25 border border-white/10 rounded-xl transition-all cursor-pointer active:scale-90"
                    aria-label="Previous quote"
                  >
                    <FaArrowRight className="w-3 h-3 rotate-180" />
                  </button>
                  <button
                    onClick={handleNextQuote}
                    className="p-2 bg-white/15 hover:bg-white/25 border border-white/10 rounded-xl transition-all cursor-pointer active:scale-90"
                    aria-label="Next quote"
                  >
                    <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* RECRUITER MESSAGES INBOX */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[200px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <span>📩</span> Recruiter Inbox
                  </h3>
                  <Link to="/contacts" className="text-[10px] text-[#6C63FF] font-extrabold hover:underline">
                    View All
                  </Link>
                </div>

                {recentMessages.length === 0 ? (
                  <div className="text-center py-8 flex flex-col items-center justify-center">
                    <span className="text-xl mb-1">📬</span>
                    <p className="text-xs text-slate-400 font-bold">No messages received yet</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Recruiter messages from your portfolio will display here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentMessages.map((msg) => {
                      const initials = msg.name ? msg.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";
                      return (
                        <div key={msg.id} className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="w-7 h-7 bg-indigo-50 border border-indigo-100 text-[#6C63FF] rounded-lg flex items-center justify-center text-[10px] font-bold">
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-baseline gap-1.5">
                              <h4 className="text-[11px] font-bold text-slate-850 truncate">{msg.name}</h4>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">{msg.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardLayout>
  );
};

export default Dashboard;
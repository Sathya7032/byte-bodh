import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { getUser, getAccessToken } from "../services/auth";
import { dashboardStats, getMyProfile } from "../api/profileService";
import { toast } from "react-toastify";
import { 
  FaEye, 
  FaTasks, 
  FaArrowRight,
  FaSpinner,
  FaPalette,
  FaCopy,
  FaExternalLinkAlt,
  FaUserEdit,
  FaFilePdf,
  FaEnvelopeOpen,
  FaListUl,
  FaGlobe
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
  });
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [copied, setCopied] = useState(false);
  const [username, setUsername] = useState("");



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
      const response = await dashboardStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
      
      const profileResponse = await getMyProfile();
      const profileData = profileResponse.data || {};
      if (profileData.user?.username) {
        setUsername(profileData.user.username);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleCopyLink = () => {
    const liveUrl = `http://localhost:3001/${username || 'profile'}`;
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

  const userName = user?.fullName || user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const portfolioUrl = `http://localhost:3001/${username}`;

  // SVG circular loader variables
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercent / 100) * circumference;

  return (
    <DashboardLayout containerClassName="w-full min-h-screen bg-slate-50/50 space-y-6">
      <div className="max-w-7xl mx-auto w-full space-y-8 flex flex-col p-4 md:p-6 animate-fadeIn">
          
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
                <h3 className="text-base font-black text-slate-800 mt-2 truncate flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF] inline-block"></span>
                  Premium Portfolio
                </h3>
              </div>
              <div className="flex flex-col gap-1.5 mt-4">
                <Link to="/portfolio-templates" className="text-[10px] text-[#6C63FF] font-extrabold hover:underline flex items-center gap-1">
                  Change Template <FaArrowRight size={8} />
                </Link>
                {username && (
                  <a 
                    href={`http://localhost:3001/${username}`} 
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

          {/* BUILDER MODULES */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-xl">🛠️</span> Portfolio Builder Modules
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <Link
                to="/profile"
                className="group border border-slate-100 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-2xl p-5 transition-all duration-300 flex items-start gap-4 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-indigo-50 text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white rounded-xl flex items-center justify-center text-lg shadow-sm transition-all flex-shrink-0">
                  <FaUserEdit />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#6C63FF] transition-colors">Bio & Contact Details</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Update your name, bio summaries, phone, and social coordinates.</p>
                </div>
              </Link>

              <Link
                to="/resume-builder"
                className="group border border-slate-100 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-2xl p-5 transition-all duration-300 flex items-start gap-4 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-indigo-50 text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white rounded-xl flex items-center justify-center text-lg shadow-sm transition-all flex-shrink-0">
                  <FaFilePdf />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#6C63FF] transition-colors">Resume PDF Exporter</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Compile credentials to download offline ATS-ready resumes.</p>
                </div>
              </Link>

              <Link
                to="/portfolio-templates"
                className="group border border-slate-100 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-2xl p-5 transition-all duration-300 flex items-start gap-4 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-indigo-50 text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white rounded-xl flex items-center justify-center text-lg shadow-sm transition-all flex-shrink-0">
                  <FaPalette />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#6C63FF] transition-colors">Design & Theme Layouts</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Unlock premium layouts, monospace, and modern grid styles.</p>
                </div>
              </Link>

              <Link
                to="/tasks"
                className="group border border-slate-100 hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-2xl p-5 transition-all duration-300 flex items-start gap-4 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-indigo-50 text-[#6C63FF] group-hover:bg-[#6C63FF] group-hover:text-white rounded-xl flex items-center justify-center text-lg shadow-sm transition-all flex-shrink-0">
                  <FaListUl />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#6C63FF] transition-colors">Project & Skill Checklist</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Mark pending milestones and complete your portfolio setup.</p>
                </div>
              </Link>
            </div>
          </div>

          {/* INSPIRATION & CHECKLIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* ROTATING QUOTE BANNER */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-white/10 flex flex-col justify-between">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              
              <div className="relative z-10">
                <span className="px-2.5 py-1 bg-white/20 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                  Daily Inspiration
                </span>
                <p className="text-base font-bold mt-5 italic leading-relaxed">
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

            {/* SETUP TIMELINE CHECKLIST */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                  <span>📋</span> Setup Checklist
                </h3>
                
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Site Completion</span>
                    <span className="text-[#6C63FF]">{completionPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#6C63FF] h-full rounded-full transition-all duration-1000" style={{ width: `${completionPercent}%` }}></div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-[9px] font-bold">
                        ✓
                      </div>
                      <span className="text-xs text-slate-400 font-medium line-through">Create profile credentials</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-[9px] font-bold">
                        ✓
                      </div>
                      <span className="text-xs text-slate-400 font-medium line-through">Claim public portfolio path</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        stats.completedTasks > 0 ? "bg-emerald-50 border border-emerald-200 text-emerald-600" : "bg-slate-50 border border-slate-200 text-slate-400"
                      }`}>
                        {stats.completedTasks > 0 ? "✓" : "○"}
                      </div>
                      <span className={`text-xs font-semibold ${stats.completedTasks > 0 ? "text-slate-400 line-through" : "text-slate-600"}`}>
                        Add core technical skills
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-[9px] font-bold">
                        ○
                      </div>
                      <span className="text-xs text-slate-600 font-semibold">Link developer repositories</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
                <Link
                  to="/help"
                  className="inline-flex items-center gap-1 text-xs text-[#6C63FF] font-bold hover:underline"
                >
                  Need some guidance? <FaArrowRight size={8} />
                </Link>
              </div>
            </div>

            </div>
          </div>
        </DashboardLayout>
  );
};

export default Dashboard;
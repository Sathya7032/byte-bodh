import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaSpinner,
  FaPalette,
  FaEye,
  FaLock,
  FaCrown,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import DashboardLayout from "./components/DashboardLayout";
import { linktreeTemplatesApi, userApi } from "../api/portfolioApiService";
import { getSubscriptionStatus } from "../api/subscriptionService";
import { getLinktreeUrl } from "../config/api";
import {
  LinktreeCyberDark,
  LinktreeMinimalIvory,
  LinktreeNeoBrutalist,
  LinktreeAuroraGlass,
  LinktreeBentoGrid,
  LinktreeSunsetGlow,
  normalizeTemplateCode,
} from "./LinktreeTemplates";

const TEMPLATE_PREVIEWS = {
  CYBER_DARK: {
    bg: "from-[#070B14] to-[#0C1222]",
    accent: "#10B981",
    tag: "Obsidian Neon",
    sampleCards: ["bg-slate-900 border-slate-800 text-slate-200", "bg-slate-900 border-slate-800 text-slate-200"],
  },
  MINIMAL_IVORY: {
    bg: "from-[#FAFAF9] to-[#F5F5F4]",
    accent: "#0F172A",
    tag: "Clean Slate",
    sampleCards: ["bg-white border-slate-200 text-slate-900", "bg-white border-slate-200 text-slate-900"],
  },
  NEO_BRUTALIST: {
    bg: "from-[#FEFCE8] to-[#FEF08A]",
    accent: "#000000",
    tag: "Retro Pop",
    sampleCards: ["bg-white border-2 border-black shadow-[3px_3px_0px_#000] text-black", "bg-[#A7F3D0] border-2 border-black shadow-[3px_3px_0px_#000] text-black"],
  },
  AURORA_GLASS: {
    bg: "from-[#0A061E] to-[#1E1035]",
    accent: "#A855F7",
    tag: "Iridescent Glass",
    sampleCards: ["bg-white/10 border-white/20 text-white backdrop-blur-md", "bg-white/10 border-white/20 text-white backdrop-blur-md"],
  },
  BENTO_GRID: {
    bg: "from-[#090D16] to-[#0F172A]",
    accent: "#06B6D4",
    tag: "Modular Bento",
    sampleCards: ["bg-slate-900/90 border-slate-800 text-slate-100", "bg-slate-900/90 border-slate-800 text-slate-100"],
  },
  SUNSET_GLOW: {
    bg: "from-[#1C0F24] to-[#2D1233]",
    accent: "#F59E0B",
    tag: "Warm Amber",
    sampleCards: ["bg-rose-950/40 border-rose-500/30 text-amber-100", "bg-rose-950/40 border-rose-500/30 text-amber-100"],
  },
};

export default function LinktreeTemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState({ active: false });
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL | FREE | PRO

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tplRes, activeRes, userRes, subRes] = await Promise.allSettled([
        linktreeTemplatesApi.getAll(),
        linktreeTemplatesApi.getMyActive(),
        userApi.getProfile().catch(() => userApi.getMe()),
        getSubscriptionStatus().catch(() => ({ data: { active: false } })),
      ]);

      let tplList = [];
      if (tplRes.status === "fulfilled" && tplRes.value?.data) {
        tplList = Array.isArray(tplRes.value.data) ? tplRes.value.data : tplRes.value.data?.data || [];
      }

      // If database has not seeded Linktree templates yet, seed them automatically
      if (tplList.length === 0) {
        try {
          const seedRes = await linktreeTemplatesApi.seedAll();
          tplList = seedRes.data?.data || [];
        } catch (e) {
          console.warn("Could not seed linktree templates:", e);
        }
      }

      setTemplates(tplList);

      if (activeRes.status === "fulfilled" && activeRes.value?.data) {
        setActiveTemplate(activeRes.value.data?.data || activeRes.value.data);
      }

      if (userRes.status === "fulfilled" && userRes.value?.data) {
        const u = userRes.value.data?.data || userRes.value.data;
        setUser(u);
      }

      if (subRes.status === "fulfilled" && subRes.value?.data) {
        setSubscription(subRes.value.data?.data || subRes.value.data || { active: false });
      }
    } catch (err) {
      console.error("Error loading linktree templates:", err);
      toast.error("Failed to load templates. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasActiveSubscription = Boolean(
    subscription?.active ||
    subscription?.isActive ||
    subscription?.status === "ACTIVE" ||
    user?.hasActiveSubscription
  );

  const handleActivate = async (template) => {
    if (template.isPremium && !hasActiveSubscription) {
      toast.info("This is a Pro template. Please upgrade your plan to activate it.");
      navigate("/subscription");
      return;
    }

    try {
      setActivatingId(template.id);
      const res = await linktreeTemplatesApi.activate(template.id);
      const updated = res.data?.data || res.data || template;
      setActiveTemplate(updated);

      if (user?.username) {
        try {
          localStorage.setItem(`bytebodh_linktree_template_${user.username}`, template.templateCode.toLowerCase().replace(/_/g, "-"));
        } catch {}
      }

      toast.success(`${template.name} activated! Your bio page (bytebodh.in/${user?.username || "username"}) is now live with this layout.`);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 400 && msg?.toLowerCase().includes("subscription")) {
        toast.error(msg);
        navigate("/subscription");
      } else {
        toast.error(msg || "Failed to activate Linktree template.");
      }
    } finally {
      setActivatingId(null);
    }
  };

  const handleDeactivate = async () => {
    try {
      setActivatingId("deactivate");
      const res = await linktreeTemplatesApi.deactivate();
      const fallback = res.data?.defaultTemplate || null;
      setActiveTemplate(fallback);
      toast.success("Reverted to default Cyber Dark Linktree layout.");
    } catch (err) {
      toast.error("Failed to revert template.");
    } finally {
      setActivatingId(null);
    }
  };

  const isTemplateActive = (template) => {
    if (!template) return false;
    if (activeTemplate?.id && activeTemplate.id === template.id) return true;
    if (activeTemplate?.templateCode && activeTemplate.templateCode.toUpperCase() === template.templateCode.toUpperCase()) return true;
    if (user?.activeLinktreeTemplateId && user.activeLinktreeTemplateId === template.id) return true;
    if (user?.activeLinktreeTemplateCode && user.activeLinktreeTemplateCode.toUpperCase() === template.templateCode.toUpperCase()) return true;
    return false;
  };

  const filteredTemplates = templates.filter((t) => {
    if (filter === "FREE") return !t.isPremium;
    if (filter === "PRO") return Boolean(t.isPremium);
    return true;
  });

  const renderLiveModalContent = () => {
    if (!previewTemplate) return null;
    const norm = normalizeTemplateCode(previewTemplate.templateCode);
    const mockUser = user || {
      fullName: "Alex Rivera",
      username: "alex_dev",
      headline: "Senior Full Stack Engineer • Open Source Contributor",
      avatarUrl: "",
      bannerUrl: "",
      location: "Bengaluru, India",
    };

    const mockLinks = [
      { id: "1", title: "GitHub Projects & Repos", url: "https://github.com", platform: "GITHUB", clickCount: 124 },
      { id: "2", title: "Read My Engineering Blog", url: "https://bytebodh.in", platform: "WEBSITE", clickCount: 89 },
      { id: "3", title: "Connect on LinkedIn", url: "https://linkedin.com", platform: "LINKEDIN", clickCount: 65 },
      { id: "4", title: "Follow on X / Twitter", url: "https://x.com", platform: "TWITTER", clickCount: 42 },
    ];

    const mockSocial = [
      { platform: "github", url: "https://github.com" },
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "twitter", url: "https://x.com" },
      { platform: "instagram", url: "https://instagram.com" },
    ];

    switch (norm) {
      case "minimal-ivory":
        return <LinktreeMinimalIvory user={mockUser} links={mockLinks} socialLinks={mockSocial} />;
      case "neo-brutalist":
        return <LinktreeNeoBrutalist user={mockUser} links={mockLinks} socialLinks={mockSocial} />;
      case "aurora-glass":
        return <LinktreeAuroraGlass user={mockUser} links={mockLinks} socialLinks={mockSocial} />;
      case "bento-grid":
        return <LinktreeBentoGrid user={mockUser} links={mockLinks} socialLinks={mockSocial} />;
      case "sunset-glow":
        return <LinktreeSunsetGlow user={mockUser} links={mockLinks} socialLinks={mockSocial} />;
      case "cyber-dark":
      default:
        return <LinktreeCyberDark user={mockUser} links={mockLinks} socialLinks={mockSocial} />;
    }
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
            <FaPalette className="text-emerald-500" /> Bio Link Showcase
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Linktree Bio Templates
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Activate whichever aesthetic fits your brand. Your Linktree at{" "}
            <span className="font-mono text-emerald-600 font-bold">bytebodh.in/{user?.username || ":username"}</span> will instantly render with all your links and verified profile details.
          </p>
        </div>

        {/* Public Endpoint Pill */}
        {user?.username && (
          <a
            href={getLinktreeUrl(user.username)}
            target="_blank"
            rel="noreferrer"
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-700 hover:text-emerald-600 hover:border-emerald-300 transition"
          >
            <span>Preview Live Bio</span>
            <FaExternalLinkAlt size={11} className="text-emerald-500" />
          </a>
        )}
      </div>

      {/* Switcher Tabs: Portfolio Website vs Linktree Bio */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-left">
        <button
          onClick={() => navigate("/portfolio-templates")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <FaPalette className="text-slate-500" />
          <span>Portfolio Website Templates</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
            username.bytebodh.in
          </span>
        </button>

        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 cursor-pointer">
          <span className="text-emerald-400">⚡</span>
          <span>Linktree Bio Templates</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
            bytebodh.in/:username
          </span>
        </button>
      </div>

      {/* Subscription status banner */}
      {!loading && !hasActiveSubscription && (
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <FaCrown className="text-slate-950 text-lg" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm">Unlock All Pro Linktree Themes</h3>
              <p className="text-slate-300 text-xs font-medium mt-0.5">
                Free Linktree themes can be activated anytime. Upgrade to Pro to unlock Neo-Brutalist, Aurora Glass, and Bento Grid bio layouts.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/subscription")}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <FaCrown /> View Pro Plans
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {["ALL", "FREE", "PRO"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f === "ALL" ? "All Themes" : f === "FREE" ? "Free Themes" : "Pro Themes"}
            </button>
          ))}
        </div>

        {activeTemplate && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>Currently Active:</span>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1.5 font-black">
              <FaCheckCircle className="text-emerald-600" />
              {activeTemplate.name}
            </span>
            <button
              onClick={handleDeactivate}
              className="text-[11px] text-slate-400 hover:text-slate-700 underline font-semibold transition cursor-pointer"
              title="Reset to default Cyber Dark theme"
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-20 text-center shadow-sm">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading Linktree templates catalog...</p>
        </div>
      )}

      {/* Template Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredTemplates.map((tpl) => {
            const preview = TEMPLATE_PREVIEWS[tpl.templateCode] || TEMPLATE_PREVIEWS.CYBER_DARK;
            const isActive = isTemplateActive(tpl);
            const isLocked = tpl.isPremium && !hasActiveSubscription;
            const isProcessing = activatingId === tpl.id;

            return (
              <div
                key={tpl.id}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                  isActive
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div>
                  {/* Visual Mockup Card */}
                  <div
                    className={`h-48 bg-gradient-to-b ${preview.bg} p-4 flex flex-col justify-between relative overflow-hidden group cursor-pointer`}
                    onClick={() => setPreviewTemplate(tpl)}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
                        {preview.tag}
                      </span>
                      {tpl.isPremium ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                          <FaCrown size={9} /> Pro
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Free
                        </span>
                      )}
                    </div>

                    {/* Mini Phone representation */}
                    <div className="w-40 mx-auto space-y-1.5 text-center relative z-10 transition-transform duration-300 group-hover:scale-105">
                      <div className="w-8 h-8 rounded-full mx-auto border-2 border-white shadow-md bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                        {user?.fullName?.charAt(0) || "U"}
                      </div>
                      <div className="w-24 h-2 rounded-full bg-white/40 mx-auto" />
                      <div className="space-y-1 pt-1">
                        {preview.sampleCards.map((c, i) => (
                          <div key={i} className={`p-1.5 rounded-lg text-[9px] font-bold text-center truncate ${c}`}>
                            {i === 0 ? "My Portfolio Website" : "Latest Project Repository"}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover eye icon overlay */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                      <FaEye size={14} /> Click to Live Preview
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-800 text-base">{tpl.name}</h3>
                      {isActive && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaCheckCircle size={10} /> Active Bio
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                      {tpl.description}
                    </p>

                    {/* Feature tags */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                        Social Dock
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                        QR Sharing
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                        Portfolio Jump
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <FaEye size={12} />
                    <span>Preview</span>
                  </button>

                  {isActive ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 px-3 bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <FaCheckCircle size={12} />
                      <span>Active</span>
                    </button>
                  ) : isLocked ? (
                    <button
                      onClick={() => {
                        toast.info("Upgrade to Pro to unlock this Linktree theme!");
                        navigate("/subscription");
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <FaLock size={11} />
                      <span>Unlock Pro</span>
                    </button>
                  ) : (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleActivate(tpl)}
                      className="flex-1 py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <FaSpinner className="animate-spin" size={11} />
                          <span>Activating...</span>
                        </>
                      ) : (
                        <span>Activate</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== LIVE PREVIEW MODAL ===== */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Linktree Live Preview
                </span>
                <h3 className="text-base font-black">{previewTemplate.name}</h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal Body: Rendered Live Template */}
            <div className="flex-1 overflow-y-auto">
              {renderLiveModalContent()}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-400">
                {previewTemplate.isPremium ? "Pro Subscription Required" : "Free for all creators"}
              </span>

              {isTemplateActive(previewTemplate) ? (
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                  <FaCheckCircle /> Currently Active Theme
                </span>
              ) : previewTemplate.isPremium && !hasActiveSubscription ? (
                <button
                  onClick={() => {
                    setPreviewTemplate(null);
                    navigate("/subscription");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FaCrown size={11} /> Upgrade to Activate
                </button>
              ) : (
                <button
                  disabled={activatingId === previewTemplate.id}
                  onClick={() => {
                    handleActivate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <span>Activate This Theme</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { getUser, getAccessToken } from "../services/auth";
import { getPortfolioUrl, getLinktreeUrl } from "../config/api";
import {
  userApi,
  linktreeApi,
  projectsApi,
  skillsApi,
  educationApi,
  certificationsApi,
  achievementsApi,
  linksApi,
  instagramApi,
  subscriptionsApi,
  templatesApi,
  resolveImageUrl,
} from "../api/portfolioApiService";
import { getContactMessages } from "../api/profileService";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import {
  FaEye,
  FaArrowRight,
  FaCopy,
  FaEnvelopeOpen,
  FaExternalLinkAlt,
  FaGlobe,
  FaLink,
  FaProjectDiagram,
  FaInstagram,
  FaCheckCircle,
  FaQrcode,
  FaPlus,
  FaTrash,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaMapMarkerAlt,
  FaMousePointer,
  FaTimes,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaSave,
  FaToggleOn,
  FaToggleOff,
  FaCrown,
} from "react-icons/fa";

const quotes = [
  {
    text: "Success is the sum of small efforts, repeated day-in and day-out.",
    author: "Robert Collier",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    totalLinks: 0,
    linkClicks: 0,
    totalProjects: 0,
    totalSkills: 0,
    totalEducation: 0,
    totalCerts: 0,
    activeTemplateName: "Modern Minimal",
    subscriptionPlan: "Free Tier",
    instagramConnected: false,
    instagramRulesCount: 0,
  });

  const [linktreeLinks, setLinktreeLinks] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [copiedLinktree, setCopiedLinktree] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUser();

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchDashboardData(storedUser);

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 25000);

    return () => clearInterval(quoteInterval);
  }, [navigate]);

  const fetchDashboardData = async (activeUser) => {
    try {
      setLoading(true);

      // Run parallel queries across all relevant endpoints
      const [
        profileRes,
        linktreeRes,
        projectsRes,
        skillsRes,
        eduRes,
        certsRes,
        achRes,
        linksRes,
        igRes,
        subRes,
        templatesRes,
        messagesRes,
      ] = await Promise.allSettled([
        userApi.getProfile(),
        linktreeApi.getLinks(),
        projectsApi.getAll(),
        skillsApi.getAll(),
        educationApi.getAll(),
        certificationsApi.getAll(),
        achievementsApi.getAll(),
        linksApi.getAll(),
        instagramApi.getAccount(),
        subscriptionsApi.getCurrent(),
        templatesApi.getAll(),
        getContactMessages().catch(() => ({ data: { success: false } })),
      ]);

      // Unpack Profile
      const userProfile =
        profileRes.status === "fulfilled" && profileRes.value?.data
          ? profileRes.value.data.data || profileRes.value.data
          : {};
      setProfile(userProfile);

      // Unpack Linktree links & analytics
      const links =
        linktreeRes.status === "fulfilled" && linktreeRes.value?.data
          ? Array.isArray(linktreeRes.value.data)
            ? linktreeRes.value.data
            : linktreeRes.value.data.data || []
          : [];
      setLinktreeLinks(links);
      const totalClicks =
        links.reduce((sum, item) => sum + (item.clicks || 0), 0) ||
        userProfile.totalLinkClicks ||
        0;

      // Unpack Projects, Skills, Edu, Certs, Achievements, Social Links
      const projects =
        projectsRes.status === "fulfilled" && Array.isArray(projectsRes.value?.data)
          ? projectsRes.value.data
          : [];
      const skills =
        skillsRes.status === "fulfilled" && Array.isArray(skillsRes.value?.data)
          ? skillsRes.value.data
          : [];
      const edu =
        eduRes.status === "fulfilled" && Array.isArray(eduRes.value?.data)
          ? eduRes.value.data
          : [];
      const certs =
        certsRes.status === "fulfilled" && Array.isArray(certsRes.value?.data)
          ? certsRes.value.data
          : [];
      const ach =
        achRes.status === "fulfilled" && Array.isArray(achRes.value?.data)
          ? achRes.value.data
          : [];
      const pLinks =
        linksRes.status === "fulfilled" && Array.isArray(linksRes.value?.data)
          ? linksRes.value.data
          : [];

      // Unpack Instagram
      const igData =
        igRes.status === "fulfilled" && igRes.value?.data
          ? igRes.value.data.data || igRes.value.data
          : {};
      const igConnected = Boolean(igData.status === "CONNECTED" || igData.accessToken);
      const igRules = Array.isArray(igData.rules)
        ? igData.rules.length
        : igData.activeRulesCount || 0;

      // Unpack Subscription
      const subData =
        subRes.status === "fulfilled" && subRes.value?.data
          ? subRes.value.data.data || subRes.value.data
          : {};
      const isSubActive = Boolean(
        subData.active ||
        subData.isActive ||
        subData.status === "ACTIVE" ||
        activeUser.hasActiveSubscription ||
        userProfile.hasActiveSubscription
      );
      const planName = subData.planName || (isSubActive ? "Pro Member" : "Free Plan");
      const expiryFormatted = subData.expiryDate || subData.expiresAt
        ? new Date(subData.expiryDate || subData.expiresAt).toLocaleDateString()
        : null;
      const remainingDays = subData.remainingDays ?? null;

      // Active template
      const allTemplates =
        templatesRes.status === "fulfilled" && Array.isArray(templatesRes.value?.data)
          ? templatesRes.value.data
          : [];
      const activeTpl =
        allTemplates.find((t) => t.id === userProfile.activeTemplateId) || {
          templateName: "ByteBodh Modern",
        };

      // Views directly from user profile entity
      const views = userProfile.totalProfileViews || 0;

      // Messages
      if (
        messagesRes.status === "fulfilled" &&
        messagesRes.value?.data?.success &&
        Array.isArray(messagesRes.value.data.data)
      ) {
        setRecentMessages(messagesRes.value.data.data.slice(0, 3));
      }

      setStats({
        profileViews: views,
        totalLinks: links.length,
        linkClicks: totalClicks,
        totalProjects: projects.length,
        totalSkills: skills.length,
        totalEducation: edu.length,
        totalCerts: certs.length,
        totalAchievements: ach.length,
        totalPortfolioLinks: pLinks.length,
        activeTemplateName: activeTpl.templateName || "Modern Minimal",
        subscriptionPlan: planName,
        isSubscribed: isSubActive,
        subscriptionExpiry: expiryFormatted,
        subscriptionRemainingDays: remainingDays,
        instagramConnected: igConnected,
        instagramRulesCount: igRules,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const username =
    profile?.username || user?.username || (user?.email ? user.email.split("@")[0] : "portfolio");
  const fullName = profile?.fullName || user?.fullName || "Creator";
  const portfolioUrl = getPortfolioUrl(username);
  const linktreeUrl = getLinktreeUrl(username);

  const handleCopyPortfolio = () => {
    if (!portfolioUrl) return;
    navigator.clipboard.writeText(portfolioUrl);
    setCopiedPortfolio(true);
    toast.success("Portfolio URL copied to clipboard!");
    setTimeout(() => setCopiedPortfolio(false), 2000);
  };

  const handleCopyLinktree = () => {
    if (!linktreeUrl) return;
    navigator.clipboard.writeText(linktreeUrl);
    setCopiedLinktree(true);
    toast.success("Linktree URL copied to clipboard!");
    setTimeout(() => setCopiedLinktree(false), 2000);
  };

  // Linktree Interactive Dashboard Management States
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [savingLink, setSavingLink] = useState(false);
  const [linkFormData, setLinkFormData] = useState({
    title: "",
    subtitle: "",
    url: "",
    platform: "CUSTOM",
    isActive: true,
    isPinned: false,
    thumbnailUrl: "",
  });

  const handleOpenAddLinkModal = () => {
    setEditingLink(null);
    setLinkFormData({
      title: "",
      subtitle: "",
      url: "",
      platform: "CUSTOM",
      isActive: true,
      isPinned: false,
      thumbnailUrl: "",
    });
    setLinkModalOpen(true);
  };

  const handleOpenEditLinkModal = (link) => {
    setEditingLink(link);
    setLinkFormData({
      title: link.title || "",
      subtitle: link.subtitle || "",
      url: link.url || "",
      platform: link.platform || "CUSTOM",
      isActive: link.isActive !== false,
      isPinned: Boolean(link.isPinned),
      thumbnailUrl: link.thumbnailUrl || "",
    });
    setLinkModalOpen(true);
  };

  const handleSaveLink = async (e) => {
    e.preventDefault();
    if (!linkFormData.title.trim() || !linkFormData.url.trim()) {
      toast.error("Please provide both Title and Destination URL.");
      return;
    }

    let formattedUrl = linkFormData.url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      setSavingLink(true);
      const payload = {
        title: linkFormData.title.trim(),
        subtitle: linkFormData.subtitle.trim(),
        url: formattedUrl,
        platform: linkFormData.platform,
        isActive: linkFormData.isActive,
        isPinned: linkFormData.isPinned,
        thumbnailUrl: linkFormData.thumbnailUrl.trim(),
      };

      if (editingLink) {
        const res = await linktreeApi.update(editingLink.id, payload);
        const updated = res.data?.data || res.data || { ...editingLink, ...payload };
        setLinktreeLinks((prev) =>
          prev.map((l) => (l.id === editingLink.id ? updated : l))
        );
        toast.success("Bio link updated successfully!");
      } else {
        const res = await linktreeApi.create(payload);
        const created = res.data?.data || res.data || { ...payload, id: Date.now(), clickCount: 0 };
        setLinktreeLinks((prev) => [created, ...prev]);
        setStats((prev) => ({ ...prev, totalLinks: prev.totalLinks + 1 }));
        toast.success("New bio link created!");
      }
      setLinkModalOpen(false);
    } catch (err) {
      console.error("Save link error:", err);
      toast.error(err.response?.data?.message || "Failed to save link.");
    } finally {
      setSavingLink(false);
    }
  };

  const handleToggleLinkActive = async (link) => {
    const nextStatus = !link.isActive;
    setLinktreeLinks((prev) =>
      prev.map((l) => (l.id === link.id ? { ...l, isActive: nextStatus } : l))
    );
    try {
      await linktreeApi.toggleActive(link.id);
      toast.success(`"${link.title}" is now ${nextStatus ? "active" : "inactive"}`);
    } catch (err) {
      setLinktreeLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isActive: link.isActive } : l))
      );
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteLink = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await linktreeApi.delete(id);
      setLinktreeLinks((prev) => prev.filter((l) => l.id !== id));
      setStats((prev) => ({ ...prev, totalLinks: Math.max(0, prev.totalLinks - 1) }));
      toast.success("Link deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete link.");
    }
  };

  const handleMoveLinkOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= linktreeLinks.length) return;

    const newLinks = [...linktreeLinks];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    setLinktreeLinks(newLinks);
    try {
      await linktreeApi.reorder(newLinks.map((l) => l.id));
      toast.success("Links reordered.");
    } catch (err) {
      toast.error("Failed to reorder links.");
    }
  };

  const handleRecordLinkClick = async (link) => {
    try {
      await linktreeApi.recordClick(link.id);
      setLinktreeLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, clickCount: (l.clickCount || l.clicks || 0) + 1 } : l))
      );
      setStats((prev) => ({ ...prev, linkClicks: prev.linkClicks + 1 }));
    } catch (err) {
      console.warn("Click tracking error:", err);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toUpperCase()) {
      case "GITHUB":
        return <FaGithub className="text-slate-900" />;
      case "LINKEDIN":
        return <FaLinkedin className="text-blue-600" />;
      case "TWITTER":
      case "TWITTER_X":
        return <FaTwitter className="text-sky-500" />;
      case "INSTAGRAM":
        return <FaInstagram className="text-pink-600" />;
      case "YOUTUBE":
        return <FaYoutube className="text-red-600" />;
      default:
        return <FaGlobe className="text-teal-600" />;
    }
  };

  // Profile completion calculation
  const completionItems = [
    { label: "Full Name & Bio", done: Boolean(profile?.fullName && profile?.headline) },
    { label: "Avatar / Profile Picture", done: Boolean(profile?.pictureUrl || profile?.avatarUrl) },
    { label: "Projects Added", done: stats.totalProjects > 0 },
    { label: "Skills Added", done: stats.totalSkills > 0 },
    { label: "Education Added", done: stats.totalEducation > 0 },
    { label: "Linktree Links Added", done: stats.totalLinks > 0 },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-base text-slate-600 mt-5 font-semibold">
              Loading your ByteBodh command center...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn">
      {/* HERO BANNER CARD */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 text-left">
        {profile?.bannerUrl && (
          <img
            src={resolveImageUrl(profile.bannerUrl)}
            alt="Cover Banner"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-[#064e3b]/80 to-slate-950/90 pointer-events-none"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[250px] h-[250px] rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[15%] w-[350px] h-[350px] rounded-full bg-teal-500/10 blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User info */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg shadow-emerald-500/30 shrink-0">
              {(profile?.pictureUrl || profile?.avatarUrl) ? (
                <img
                  src={resolveImageUrl(profile.pictureUrl || profile.avatarUrl)}
                  alt={fullName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex";
                  }}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div
                style={{ display: (profile?.pictureUrl || profile?.avatarUrl) ? "none" : "flex" }}
                className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center font-black text-2xl text-white"
              >
                {fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">{fullName}</h1>
                {stats.isSubscribed ? (
                  <span className="text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-3 py-1 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1.5 border border-amber-300">
                    <FaCrown size={11} className="text-slate-950" /> PRO MEMBER
                  </span>
                ) : (
                  <Link
                    to="/subscription"
                    className="text-[10px] font-bold text-slate-300 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 rounded-full transition flex items-center gap-1"
                  >
                    <span>Free Tier</span>
                    <span className="text-emerald-400 font-black">• Upgrade</span>
                  </Link>
                )}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  LIVE
                </span>
                {(profile?.activeTemplateCode || stats.activeTemplateName) && (
                  <span className="text-[10px] font-bold text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-500/30">
                    {profile?.activeTemplateCode || stats.activeTemplateName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                @{username} • {profile?.customProfessionTitle || profile?.headline || "Software Engineer & Creator"}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-300">
                {profile?.location && (
                  <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} className="text-emerald-400" /> {profile.location}</span>
                )}
                <span className="flex items-center gap-1"><FaEye size={10} className="text-teal-400" /> {profile?.totalProfileViews || stats.profileViews} views</span>
                <span className="flex items-center gap-1"><FaMousePointer size={10} className="text-sky-400" /> {profile?.totalLinkClicks || stats.linkClicks} clicks</span>
              </div>
            </div>
          </div>

          {/* Quick link buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Portfolio link button */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-2xl px-3 py-2 text-xs">
              <FaGlobe className="text-emerald-400 shrink-0" />
              <span className="font-semibold truncate max-w-[170px]">{portfolioUrl}</span>
              <button
                onClick={handleCopyPortfolio}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-[11px] transition cursor-pointer"
                title="Copy link"
              >
                {copiedPortfolio ? "Copied!" : <FaCopy />}
              </button>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition"
              >
                <FaExternalLinkAlt size={9} /> View
              </a>
            </div>

            {/* Linktree link button */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-2xl px-3 py-2 text-xs">
              <FaLink className="text-teal-400 shrink-0" />
              <span className="font-semibold truncate max-w-[150px]">Bio Link</span>
              <button
                onClick={handleCopyLinktree}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-[11px] transition cursor-pointer"
                title="Copy linktree url"
              >
                {copiedLinktree ? "Copied!" : <FaCopy />}
              </button>
              <a
                href={linktreeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition"
              >
                <FaExternalLinkAlt size={9} /> Bio
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRO STATUS / UPGRADE BANNER ===== */}
      {stats.isSubscribed ? (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-400/40 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20 shrink-0">
              <FaCrown size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  ByteBodh PRO Member Active
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <FaCheckCircle size={9} /> {stats.subscriptionPlan || "Pro Membership"}
                </span>
                {stats.subscriptionRemainingDays !== null && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {stats.subscriptionRemainingDays} days left
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                All 18 Portfolio Templates, 6 Linktree Bio Themes, and Instagram DM Automation are active on your account.
              </p>
            </div>
          </div>

          <Link
            to="/subscription"
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-black rounded-xl transition shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Manage Plan</span>
            <FaArrowRight size={10} />
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#064e3b] text-white border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20 shrink-0">
              <FaCrown size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight">
                  Upgrade to ByteBodh PRO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Unlock Everything
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Unlock all 18 Portfolio Templates, Instagram Comment-to-DM Auto-replies, Custom Domain, and Pro Themes.
              </p>
            </div>
          </div>

          <Link
            to="/subscription"
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 shrink-0"
          >
            <FaCrown size={11} />
            <span>Upgrade to PRO</span>
          </Link>
        </div>
      )}

      {/* BENTO STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {/* CARD 1: PROFILE VIEWS */}
        <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl inline-flex items-center justify-center mb-3">
                <FaEye className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                Live Analytics
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Profile Views
            </span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.profileViews}</h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Recruiter Impressions</span>
            <span className="text-emerald-600 font-bold">Active</span>
          </div>
        </div>

        {/* CARD 2: LINKTREE BIO LINKS */}
        <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-600 rounded-xl inline-flex items-center justify-center mb-3">
                <FaLink className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full font-bold">
                {stats.linkClicks} Clicks
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Linktree Bio Links
            </span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalLinks} Active</h3>
          </div>
          <Link
            to="/linktree"
            className="text-[11px] text-teal-600 font-extrabold hover:underline flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
          >
            Manage Bio Links <FaArrowRight size={9} />
          </Link>
        </div>

        {/* CARD 3: PORTFOLIO DETAILS */}
        <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl inline-flex items-center justify-center mb-3">
                <FaProjectDiagram className="w-4 h-4" />
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                {stats.totalProjects} Projects
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Portfolio Assets
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800">
                {stats.totalSkills} Skills
              </h3>
              <span className="text-xs text-slate-400 font-bold">• {stats.totalCerts} Certs</span>
            </div>
          </div>
          <Link
            to="/profile"
            className="text-[11px] text-emerald-600 font-extrabold hover:underline flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
          >
            Edit Portfolio Details <FaArrowRight size={9} />
          </Link>
        </div>

        {/* CARD 4: INSTAGRAM AUTOMATION */}
        <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-pink-500/30 transition-all duration-300 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-pink-50 border border-pink-100 text-pink-600 rounded-xl inline-flex items-center justify-center mb-3">
                <FaInstagram className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  stats.instagramConnected
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {stats.instagramConnected ? "Connected" : "Not Linked"}
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Instagram DM Automation
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              {stats.instagramConnected ? `${stats.instagramRulesCount} Auto-Replies` : "Setup Automation"}
            </h3>
          </div>
          <Link
            to="/instagram-automation"
            className="text-[11px] text-pink-600 font-extrabold hover:underline flex items-center gap-1 mt-4 pt-3 border-t border-slate-100"
          >
            Configure Rules <FaArrowRight size={9} />
          </Link>
        </div>
      </div>

      {/* TWO COLUMN SECTION: LINKTREE PREVIEW & PORTFOLIO HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* LINKTREE QUICK MANAGER */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <FaLink className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">Linktree (Bio Links) Command Center</h3>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                      {linktreeLinks.length} Links • {stats.linkClicks} Clicks
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Manage, reorder, toggle visibility, and track performance of your bio links
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddLinkModal}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FaPlus size={10} /> Add Link
                </button>
                <Link
                  to="/linktree"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  Full Page <FaArrowRight size={9} />
                </Link>
              </div>
            </div>

            {/* Links list with Interactive Controls */}
            <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {linktreeLinks.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <FaLink className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No bio links created yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Add social profiles, resumes, and custom URLs for your Instagram bio.
                  </p>
                  <button
                    onClick={handleOpenAddLinkModal}
                    className="inline-block mt-3 px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    + Add First Bio Link
                  </button>
                </div>
              ) : (
                linktreeLinks.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      link.isActive !== false
                        ? "bg-slate-50 border-slate-200/80 hover:border-teal-300 hover:bg-white hover:shadow-xs"
                        : "bg-slate-100/60 border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* Left: Reorder arrows & Icon & Info */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Reorder Arrows */}
                      <div className="flex flex-col gap-0.5 shrink-0 text-slate-400">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveLinkOrder(idx, -1)}
                          className="hover:text-teal-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <FaArrowUp size={9} />
                        </button>
                        <button
                          disabled={idx === linktreeLinks.length - 1}
                          onClick={() => handleMoveLinkOrder(idx, 1)}
                          className="hover:text-teal-600 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <FaArrowDown size={9} />
                        </button>
                      </div>

                      {/* Icon or Thumbnail */}
                      <div className="relative w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-2xs">
                        {link.thumbnailUrl ? (
                          <img
                            src={resolveImageUrl(link.thumbnailUrl)}
                            alt=""
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex";
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <div
                          style={{ display: link.thumbnailUrl ? "none" : "flex" }}
                          className="w-full h-full items-center justify-center"
                        >
                          {getPlatformIcon(link.platform)}
                        </div>
                      </div>

                      {/* Title & Subtitle/URL */}
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-800 truncate">{link.title}</h4>
                          {link.isPinned && (
                            <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-full border border-amber-200 shrink-0">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {link.subtitle ? `${link.subtitle} • ` : ""}{link.url}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions (Clicks, Toggle, Edit, Delete, Visit) */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Click Counter Pill & Test Click */}
                      <button
                        onClick={() => handleRecordLinkClick(link)}
                        title="Click to simulate / track click"
                        className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 px-2 py-0.5 rounded-full transition cursor-pointer flex items-center gap-1"
                      >
                        <FaMousePointer size={8} /> {link.clickCount || link.clicks || 0}
                      </button>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => handleToggleLinkActive(link)}
                        title={link.isActive !== false ? "Click to deactivate" : "Click to activate"}
                        className="p-1 text-base transition cursor-pointer"
                      >
                        {link.isActive !== false ? (
                          <FaToggleOn className="text-emerald-500 text-lg" />
                        ) : (
                          <FaToggleOff className="text-slate-400 text-lg" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditLinkModal(link)}
                        className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Edit link"
                      >
                        <FaEdit size={12} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteLink(link.id, link.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        title="Delete link"
                      >
                        <FaTrash size={11} />
                      </button>

                      {/* External Visit Button */}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleRecordLinkClick(link)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                        title="Visit link destination"
                      >
                        <FaExternalLinkAlt size={10} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <span className="truncate max-w-sm">
              Public Bio URL: <strong className="text-teal-700 font-mono">{linktreeUrl}</strong>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLinktree}
                className="text-teal-600 hover:underline font-bold cursor-pointer flex items-center gap-1"
              >
                <FaCopy size={10} /> {copiedLinktree ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={linktreeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
              >
                <FaExternalLinkAlt size={10} /> Preview Bio
              </a>
            </div>
          </div>
        </div>

        {/* PORTFOLIO COMPLETENESS METER */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Portfolio Readiness</h3>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                {completionPercent}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 mt-5">
              {completionItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${item.done ? "text-slate-700" : "text-slate-400"}`}>
                    {item.label}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.done
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    {item.done ? <FaCheckCircle size={9} /> : null}
                    {item.done ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/profile"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              Complete Profile Details <FaArrowRight size={10} />
            </Link>
          </div>
        </div>
      </div>

      {/* LOWER GRID: RECRUITER MESSAGES, QR CODE HUB & DAILY QUOTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {/* RECRUITER INBOX */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <FaEnvelopeOpen className="text-emerald-600" /> Recruiter Inquiries
              </h3>
              <Link to="/contacts" className="text-[10px] text-emerald-600 font-extrabold hover:underline">
                View All
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400 font-bold">No messages received yet</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  When recruiters contact you via your portfolio, messages appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs"
                  >
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{msg.name}</span>
                      <span className="text-[9px] text-slate-400 font-normal">
                        {new Date(msg.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate mt-0.5">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/contacts"
            className="text-[11px] text-emerald-600 font-extrabold hover:underline flex items-center gap-1 mt-4"
          >
            Open Inbox <FaArrowRight size={8} />
          </Link>
        </div>

        {/* SHAREABLE QR CODE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full text-left flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <FaQrcode className="text-emerald-600" /> Shareable QR Code
            </h3>
            <Link to="/qr-code" className="text-[10px] text-emerald-600 font-extrabold hover:underline">
              Customize
            </Link>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <QRCode value={portfolioUrl || "https://bytebodh.in"} size={105} fgColor="#059669" />
          </div>

          <div className="w-full mt-3 pt-2 text-center">
            <button
              onClick={handleCopyPortfolio}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <FaCopy size={10} /> {copiedPortfolio ? "Copied!" : "Copy Portfolio Link"}
            </button>
          </div>
        </div>

        {/* INSPIRATION & PLAN CARD */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border border-white/10 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-white/20 text-white text-[9px] font-black uppercase tracking-wider rounded-full">
                Plan: {stats.subscriptionPlan}
              </span>
              <Link to="/subscription" className="text-[10px] font-black text-white/90 underline">
                {stats.isSubscribed ? "Manage Plan" : "Upgrade to Pro"}
              </Link>
            </div>
            <p className="text-sm font-bold mt-5 italic leading-relaxed">
              "{quotes[currentQuote].text}"
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/15 text-[11px] opacity-80">
            <span>— {quotes[currentQuote].author}</span>
            <Link to="/portfolio-templates" className="font-bold underline text-white">
              Templates ({stats.activeTemplateName})
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK ADD / EDIT BIO LINK MODAL */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-left">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center font-bold">
                  <FaLink />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    {editingLink ? "Edit Bio Link" : "Add New Bio Link"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Configure link title, destination URL, and platform style
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLinkModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Link Title *
                </label>
                <input
                  type="text"
                  value={linkFormData.title}
                  onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                  placeholder="e.g. 🚀 My Latest Open Source Project"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
                />
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Destination URL *
                </label>
                <input
                  type="text"
                  value={linkFormData.url}
                  onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                  placeholder="https://github.com/username/project"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Subtitle / Secondary Caption (Optional)
                </label>
                <input
                  type="text"
                  value={linkFormData.subtitle}
                  onChange={(e) => setLinkFormData({ ...linkFormData, subtitle: e.target.value })}
                  placeholder="e.g. Starred by 2,000+ developers on GitHub"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15"
                />
              </div>

              {/* Platform & Thumbnail URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Platform Brand
                  </label>
                  <select
                    value={linkFormData.platform}
                    onChange={(e) => setLinkFormData({ ...linkFormData, platform: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 bg-white"
                  >
                    <option value="CUSTOM">Custom Website</option>
                    <option value="GITHUB">GitHub</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="TWITTER_X">X / Twitter</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="YOUTUBE">YouTube</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={linkFormData.thumbnailUrl}
                    onChange={(e) => setLinkFormData({ ...linkFormData, thumbnailUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500 bg-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-5 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkFormData.isActive}
                    onChange={(e) => setLinkFormData({ ...linkFormData, isActive: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span>Active & Published</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkFormData.isPinned}
                    onChange={(e) => setLinkFormData({ ...linkFormData, isPinned: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                  />
                  <span>Pin to Top</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLink}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <FaSave size={12} /> {savingLink ? "Saving..." : editingLink ? "Update Link" : "Create Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

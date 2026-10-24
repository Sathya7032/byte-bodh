import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import {
  linktreeApi,
  userApi,
  linksApi,
  linktreeTemplatesApi,
  resolveImageUrl,
} from "../api/portfolioApiService";
import { getLinktreeUrl, getPortfolioUrl } from "../config/api";
import { toast } from "react-toastify";
import {
  LINKTREE_TEMPLATES,
  LinktreeLinkCard,
  getSocialIcon,
  sortLinks,
} from "./LinktreeTemplates";
import {
  FaLink,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
  FaMousePointer,
  FaArrowUp,
  FaArrowDown,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSpotify,
  FaDiscord,
  FaTiktok,
  FaTwitch,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaGlobeAmericas,
  FaCheckCircle,
  FaPalette,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaImage,
  FaMagic,
  FaThumbtack,
  FaStar,
  FaCoffee,
  FaTimes,
} from "react-icons/fa";

const PLATFORM_OPTIONS = [
  { key: "CUSTOM", label: "Custom Website", icon: <FaGlobe /> },
  { key: "GITHUB", label: "GitHub", icon: <FaGithub /> },
  { key: "LINKEDIN", label: "LinkedIn", icon: <FaLinkedin /> },
  { key: "TWITTER_X", label: "X / Twitter", icon: <FaTwitter /> },
  { key: "INSTAGRAM", label: "Instagram", icon: <FaInstagram /> },
  { key: "YOUTUBE", label: "YouTube", icon: <FaYoutube /> },
  { key: "SPOTIFY", label: "Spotify", icon: <FaSpotify /> },
  { key: "DISCORD", label: "Discord", icon: <FaDiscord /> },
  { key: "TIKTOK", label: "TikTok", icon: <FaTiktok /> },
  { key: "TWITCH", label: "Twitch", icon: <FaTwitch /> },
  { key: "TELEGRAM", label: "Telegram", icon: <FaTelegram /> },
  { key: "WHATSAPP", label: "WhatsApp", icon: <FaWhatsapp /> },
  { key: "EMAIL", label: "Email Contact", icon: <FaEnvelope /> },
  { key: "PHONE", label: "Phone Call", icon: <FaPhone /> },
  { key: "COFFEE", label: "Buy Me a Coffee", icon: <FaCoffee /> },
];

const LINK_TYPES = [
  { key: "CLASSIC", label: "Classic Link", desc: "Standard responsive branded button" },
  { key: "FEATURED_HERO", label: "Featured Hero", desc: "Wide showcase card with banner" },
  { key: "HEADER", label: "Section Header", desc: "Category divider without destination URL" },
  { key: "PAYMENT_DONATION", label: "Tip / Donation", desc: "Support jar with heart/coffee badge" },
  { key: "CONTACT_FORM", label: "Inquiry / Lead", desc: "Contact button for inquiries & bookings" },
];

const ANIMATION_OPTIONS = [
  { key: "NONE", label: "None", desc: "Standard clean card" },
  { key: "PULSE", label: "Pulse", desc: "Subtle breathing animation" },
  { key: "BOUNCE", label: "Bounce", desc: "Gentle bounce effect on hover" },
  { key: "GLOW", label: "Neon Glow", desc: "Radiant pulsing emerald border ring" },
  { key: "SHAKE", label: "Attention Shake", desc: "Subtle wiggle to draw eyes" },
  { key: "POP", label: "Spring Pop", desc: "Smooth elastic pop scale hover" },
];

const initialFormData = {
  title: "",
  subtitle: "",
  url: "",
  type: "CLASSIC",
  platform: "CUSTOM",
  thumbnailUrl: "",
  thumbnailFile: null,
  thumbnailPreview: null,
  animation: "NONE",
  buttonColor: "",
  textColor: "",
  isActive: true,
  isPinned: false,
  isFeatured: false,
  isSensitive: false,
  scheduleStart: "",
  scheduleEnd: "",
};

export default function LinktreePage() {
  const [links, setLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLinktree, setCopiedLinktree] = useState(false);
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("cyber-dark");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // basic | design | animation | visibility
  const [formData, setFormData] = useState(initialFormData);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [linksRes, userRes, socialRes] = await Promise.allSettled([
        linktreeApi.getAll(),
        userApi.getProfile().catch(() => userApi.getMe()),
        linksApi.getAll().catch(() => ({ data: [] })),
      ]);

      if (linksRes.status === "fulfilled") {
        const raw = linksRes.value.data;
        const arrayData = Array.isArray(raw) ? raw : raw?.data || [];
        setLinks(arrayData);
      }
      if (userRes.status === "fulfilled" && userRes.value.data) {
        const rawUser = userRes.value.data;
        const userData = rawUser?.data || rawUser;
        setUser(userData);
        if (userData?.username) {
          const savedTemplate = localStorage.getItem(
            `bytebodh_linktree_template_${userData.username}`
          );
          if (savedTemplate) {
            setSelectedTemplate(savedTemplate);
          }
        }
      }
      if (socialRes.status === "fulfilled") {
        const rawSocial = socialRes.value.data;
        const arraySocial = Array.isArray(rawSocial) ? rawSocial : rawSocial?.data || [];
        setSocialLinks(arraySocial);
      }
    } catch (err) {
      console.error("Error fetching linktree data:", err);
      toast.error("Could not load links. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const publicLinktreeUrl = user?.username ? getLinktreeUrl(user.username) : "";
  const publicPortfolioUrl = user?.username ? getPortfolioUrl(user.username) : "";

  const handleCopyLinktree = () => {
    if (!publicLinktreeUrl) return;
    navigator.clipboard.writeText(publicLinktreeUrl);
    setCopiedLinktree(true);
    toast.success("Linktree URL copied to clipboard!");
    setTimeout(() => setCopiedLinktree(false), 2000);
  };

  const handleCopyPortfolio = () => {
    if (!publicPortfolioUrl) return;
    navigator.clipboard.writeText(publicPortfolioUrl);
    setCopiedPortfolio(true);
    toast.success("Portfolio Website URL copied to clipboard!");
    setTimeout(() => setCopiedPortfolio(false), 2000);
  };

  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);
    if (user?.username) {
      try {
        localStorage.setItem(`bytebodh_linktree_template_${user.username}`, templateId);
      } catch {}
    }
    const tplName = LINKTREE_TEMPLATES.find((t) => t.id === templateId)?.name || templateId;

    try {
      const code = templateId.toUpperCase().replace(/-/g, "_");
      const res = await linktreeTemplatesApi.getByCode(code);
      if (res.data?.id) {
        await linktreeTemplatesApi.activate(res.data.id);
        toast.success(`${tplName} activated! Live on bytebodh.in/${user?.username || "username"}`);
      } else {
        toast.info(`Switched preview to ${tplName}`);
      }
    } catch {
      toast.info(`Switched preview to ${tplName}`);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingLink(null);
    setFormData(initialFormData);
    setActiveTab("basic");
    setModalOpen(true);
  };

  const handleOpenEditModal = (link) => {
    setEditingLink(link);
    setFormData({
      title: link.title || "",
      subtitle: link.subtitle || "",
      url: link.url || "",
      type: link.type || "CLASSIC",
      platform: link.platform || "CUSTOM",
      thumbnailUrl: link.thumbnailUrl || "",
      thumbnailFile: null,
      thumbnailPreview: link.thumbnailUrl ? resolveImageUrl(link.thumbnailUrl) : null,
      animation: link.animation || "NONE",
      buttonColor: link.buttonColor || "",
      textColor: link.textColor || "",
      isActive: link.isActive !== false,
      isPinned: Boolean(link.isPinned),
      isFeatured: Boolean(link.isFeatured),
      isSensitive: Boolean(link.isSensitive),
      scheduleStart: link.scheduleStart ? link.scheduleStart.substring(0, 16) : "",
      scheduleEnd: link.scheduleEnd ? link.scheduleEnd.substring(0, 16) : "",
    });
    setActiveTab("basic");
    setModalOpen(true);
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: file,
        thumbnailPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSaveLink = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (formData.type !== "HEADER" && !formData.url.trim()) {
      toast.error("Destination URL is required for this link type.");
      return;
    }

    let formattedUrl = formData.url.trim();
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl) && !/^mailto:/i.test(formattedUrl) && !/^tel:/i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      setSaving(true);

      // If user uploaded a new thumbnail file, send multipart/form-data
      if (formData.thumbnailFile) {
        const fd = new FormData();
        fd.append("title", formData.title.trim());
        if (formData.subtitle) fd.append("subtitle", formData.subtitle.trim());
        if (formattedUrl) fd.append("url", formattedUrl);
        fd.append("type", formData.type || "CLASSIC");
        fd.append("platform", (formData.platform || "CUSTOM").toUpperCase());
        fd.append("animation", formData.animation || "NONE");
        if (formData.buttonColor) fd.append("buttonColor", formData.buttonColor);
        if (formData.textColor) fd.append("textColor", formData.textColor);
        fd.append("isActive", formData.isActive);
        fd.append("isPinned", formData.isPinned);
        fd.append("isFeatured", formData.isFeatured);
        fd.append("isSensitive", formData.isSensitive);
        if (formData.scheduleStart) fd.append("scheduleStart", new Date(formData.scheduleStart).toISOString());
        if (formData.scheduleEnd) fd.append("scheduleEnd", new Date(formData.scheduleEnd).toISOString());
        fd.append("image", formData.thumbnailFile);

        if (editingLink) {
          const res = await linktreeApi.update(editingLink.id, fd);
          const updated = res.data?.data || res.data || { ...editingLink, ...formData, url: formattedUrl };
          setLinks((prev) => prev.map((l) => (l.id === editingLink.id ? updated : l)));
          toast.success("Link updated with new Cloudflare image!");
        } else {
          const res = await linktreeApi.create(fd);
          const created = res.data?.data || res.data || { ...formData, url: formattedUrl, id: Date.now() };
          setLinks((prev) => [...prev, created]);
          toast.success("New bio link created successfully!");
        }
      } else {
        // Standard JSON payload
        const payload = {
          title: formData.title.trim(),
          subtitle: formData.subtitle?.trim() || null,
          url: formattedUrl || null,
          type: formData.type || "CLASSIC",
          platform: (formData.platform || "CUSTOM").toUpperCase(),
          thumbnailUrl: formData.thumbnailUrl?.trim() || null,
          animation: formData.animation || "NONE",
          buttonColor: formData.buttonColor?.trim() || null,
          textColor: formData.textColor?.trim() || null,
          isActive: formData.isActive,
          isPinned: formData.isPinned,
          isFeatured: formData.isFeatured,
          isSensitive: formData.isSensitive,
          scheduleStart: formData.scheduleStart ? new Date(formData.scheduleStart).toISOString() : null,
          scheduleEnd: formData.scheduleEnd ? new Date(formData.scheduleEnd).toISOString() : null,
        };

        if (editingLink) {
          const res = await linktreeApi.update(editingLink.id, payload);
          const updated = res.data?.data || res.data || { ...editingLink, ...payload };
          setLinks((prev) => prev.map((l) => (l.id === editingLink.id ? updated : l)));
          toast.success("Link updated successfully!");
        } else {
          const res = await linktreeApi.create(payload);
          const created = res.data?.data || res.data || { ...payload, id: Date.now(), clickCount: 0 };
          setLinks((prev) => [...prev, created]);
          toast.success("New bio link created!");
        }
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Save link error:", err);
      toast.error(err.response?.data?.message || "Failed to save link.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (link) => {
    const nextStatus = !link.isActive;
    try {
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isActive: nextStatus } : l))
      );
      await linktreeApi.toggleActive(link.id);
    } catch (err) {
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isActive: link.isActive } : l))
      );
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    try {
      await linktreeApi.delete(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success("Link deleted.");
    } catch (err) {
      toast.error("Failed to delete link.");
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const [moved] = newLinks.splice(index, 1);
    newLinks.splice(targetIndex, 0, moved);

    setLinks(newLinks);
    try {
      const ids = newLinks.map((l) => l.id);
      await linktreeApi.reorder(ids);
    } catch (err) {
      toast.error("Failed to reorder links.");
      fetchData();
    }
  };

  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);
  const activeCount = links.filter((l) => l.isActive).length;
  const pinnedCount = links.filter((l) => l.isPinned).length;

  const sortedActiveLinks = sortLinks(links.filter((l) => l.isActive));

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* ===== TOP BAR & DUAL ENDPOINT ACCESS ===== */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Linktree & Bio
                </span>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  Linktree Management
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Manage your professional Bio Links with rich Hero banners, category headers, 18+ filters, scheduling, and attention animations.
              </p>
            </div>
          </div>

          {/* Dual Public Endpoints Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {/* Endpoint 1: Linktree Bio Page */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <FaLink size={10} /> Linktree Endpoint (Bio Links)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">bytebodh.in/:username</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicLinktreeUrl || "https://bytebodh.in/username"}
                  className="bg-white border border-slate-200 text-xs text-slate-700 font-mono px-3 py-1.5 rounded-lg flex-1 truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyLinktree}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  {copiedLinktree ? <FaCheck size={11} /> : <FaCopy size={11} />}
                  <span>{copiedLinktree ? "Copied" : "Copy"}</span>
                </button>
                {user?.username && (
                  <a
                    href={publicLinktreeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    title="Open Public Linktree"
                  >
                    <FaExternalLinkAlt size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Endpoint 2: Full Portfolio Website */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <FaGlobeAmericas size={10} /> Portfolio Website (Full Folio)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">username.bytebodh.in</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicPortfolioUrl || "https://username.bytebodh.in"}
                  className="bg-white border border-slate-200 text-xs text-slate-700 font-mono px-3 py-1.5 rounded-lg flex-1 truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyPortfolio}
                  className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  {copiedPortfolio ? <FaCheck size={11} /> : <FaCopy size={11} />}
                  <span>{copiedPortfolio ? "Copied" : "Copy"}</span>
                </button>
                {user?.username && (
                  <a
                    href={publicPortfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-teal-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    title="Open Portfolio Website"
                  >
                    <FaExternalLinkAlt size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== STATS ROW ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Links
              </p>
              <p className="text-2xl font-black text-slate-800 mt-1">
                {links.length}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <FaLink size={18} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Links
              </p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {activeCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FaCheckCircle size={18} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pinned Links
              </p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {pinnedCount}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FaThumbtack size={16} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Clicks
              </p>
              <p className="text-2xl font-black text-teal-600 mt-1">
                {totalClicks}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
              <FaMousePointer size={16} />
            </div>
          </div>
        </div>

        {/* ===== MAIN SPLIT VIEW: BUILDER + PHONE PREVIEW ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: LINKS BUILDER (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">
                Your Bio Links ({links.length})
              </h2>
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <FaPlus size={13} />
                <span>Add Bio Link</span>
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-slate-400">
                Loading your Linktree links...
              </div>
            ) : links.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FaLink size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-800">No links added yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Add your portfolio, GitHub, LinkedIn, latest YouTube videos, or tip links to share them seamlessly.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  <FaPlus size={11} /> Create First Link
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link, index) => {
                  const resolvedThumb = link.thumbnailUrl
                    ? resolveImageUrl(link.thumbnailUrl)
                    : null;

                  return (
                    <div
                      key={link.id}
                      className={`bg-white rounded-2xl p-4 border transition-all flex items-start sm:items-center justify-between gap-3 shadow-xs ${
                        link.isActive
                          ? "border-slate-200 hover:border-emerald-300"
                          : "border-slate-200/50 opacity-60 bg-slate-50/50"
                      }`}
                    >
                      {/* Reorder Arrows */}
                      <div className="flex flex-col gap-1 text-slate-300 pt-1 sm:pt-0">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveOrder(index, -1)}
                          className={`hover:text-emerald-600 transition-colors ${
                            index === 0 ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                          }`}
                          title="Move Up"
                        >
                          <FaArrowUp size={11} />
                        </button>
                        <button
                          disabled={index === links.length - 1}
                          onClick={() => handleMoveOrder(index, 1)}
                          className={`hover:text-emerald-600 transition-colors ${
                            index === links.length - 1 ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                          }`}
                          title="Move Down"
                        >
                          <FaArrowDown size={11} />
                        </button>
                      </div>

                      {/* Thumbnail or Platform Icon */}
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {resolvedThumb ? (
                          <img
                            src={resolvedThumb}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getSocialIcon(link.platform || link.title)
                        )}
                      </div>

                      {/* Link Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-800 text-sm truncate">
                            {link.title}
                          </h4>

                          {/* Link Type Badge */}
                          {link.type && link.type !== "CLASSIC" && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {link.type.replace(/_/g, " ")}
                            </span>
                          )}

                          {/* Pinned Badge */}
                          {link.isPinned && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                              <FaThumbtack size={8} /> Pinned
                            </span>
                          )}

                          {/* Featured Badge */}
                          {link.isFeatured && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <FaStar size={8} /> Hero
                            </span>
                          )}

                          {/* Sensitive Badge */}
                          {link.isSensitive && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                              <FaShieldAlt size={8} /> 18+
                            </span>
                          )}

                          {/* Animation Badge */}
                          {link.animation && link.animation !== "NONE" && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                              {link.animation}
                            </span>
                          )}

                          {/* Clicks Badge */}
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 ml-auto">
                            <FaMousePointer size={8} /> {link.clickCount || 0}
                          </span>
                        </div>

                        {link.subtitle && (
                          <p className="text-xs text-slate-500 font-medium truncate">
                            {link.subtitle}
                          </p>
                        )}

                        {link.url && (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-slate-400 hover:text-emerald-600 transition-colors truncate block"
                          >
                            {link.url}
                          </a>
                        )}

                        {/* Scheduling or Custom Color Indicator */}
                        <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400">
                          {link.buttonColor && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                style={{ backgroundColor: link.buttonColor }}
                              />
                              <span>Button</span>
                            </span>
                          )}
                          {link.textColor && (
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-slate-300"
                                style={{ backgroundColor: link.textColor }}
                              />
                              <span>Text</span>
                            </span>
                          )}
                          {link.scheduleStart && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <FaClock size={8} /> From: {new Date(link.scheduleStart).toLocaleDateString()}
                            </span>
                          )}
                          {link.scheduleEnd && (
                            <span className="flex items-center gap-1 text-slate-500">
                              To: {new Date(link.scheduleEnd).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Active Toggle & Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer" title="Toggle Active">
                          <input
                            type="checkbox"
                            checked={link.isActive}
                            onChange={() => handleToggleActive(link)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>

                        <button
                          onClick={() => handleOpenEditModal(link)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Link"
                        >
                          <FaEdit size={14} />
                        </button>

                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Link"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: REAL-TIME TEMPLATE SWITCHER & SMARTPHONE PREVIEW (5 COLS) */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            {/* Template Selector Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FaPalette className="text-emerald-500" /> Linktree Theme
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  {LINKTREE_TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "Cyber Dark"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {LINKTREE_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTemplateChange(t.id)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedTemplate === t.id
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-400/40"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span className="text-[11px] font-bold truncate mt-1">{t.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2.5 border-t border-slate-100 mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Want full layout showcase?</span>
                <Link
                  to="/linktree-templates"
                  className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
                >
                  <span>Browse Templates Catalog</span>
                  <FaArrowRight size={9} />
                </Link>
              </div>
            </div>

            {/* Smartphone Case */}
            <div className="bg-slate-900 rounded-[42px] p-4 shadow-2xl border-4 border-slate-800 max-w-sm mx-auto">
              {/* iPhone Dynamic Island / Speaker */}
              <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
              </div>

              {/* Phone Inner Display with Live Preview */}
              <div
                className={`rounded-[32px] p-5 text-center min-h-[560px] max-h-[640px] overflow-y-auto flex flex-col justify-between transition-all duration-300 relative ${
                  selectedTemplate === "minimal-ivory"
                    ? "bg-slate-50 text-slate-900"
                    : selectedTemplate === "neo-brutalist"
                    ? "bg-[#FEF08A] text-black"
                    : selectedTemplate === "aurora-glass"
                    ? "bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white"
                    : selectedTemplate === "bento-grid"
                    ? "bg-slate-950 text-white"
                    : selectedTemplate === "sunset-glow"
                    ? "bg-gradient-to-b from-[#180828] via-[#2A0E3C] to-[#120420] text-white"
                    : "bg-gradient-to-b from-[#070B14] via-[#0C1222] to-[#070B14] text-white"
                }`}
              >
                <div className="space-y-4">
                  {/* User Profile Summary */}
                  <div className="flex flex-col items-center relative z-10 pt-2">
                    <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 overflow-hidden">
                      {user?.avatarUrl || user?.pictureUrl ? (
                        <img
                          src={resolveImageUrl(user.avatarUrl || user.pictureUrl)}
                          alt={user?.fullName || "User"}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-black text-emerald-400">
                          {user?.fullName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-1 mt-2.5">
                      <h3 className="font-extrabold text-sm tracking-tight">
                        {user?.fullName || "Your Full Name"}
                      </h3>
                      <FaCheckCircle className="text-emerald-400 text-xs shrink-0" />
                    </div>

                    <p className="text-xs font-semibold opacity-75">
                      @{user?.username || "username"}
                    </p>

                    {user?.headline && (
                      <p className="text-[11px] max-w-xs mt-1 opacity-75 line-clamp-2">
                        {user.headline}
                      </p>
                    )}
                  </div>

                  {/* Social Links Dock */}
                  {socialLinks.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                      {socialLinks.slice(0, 6).map((soc, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs"
                          title={soc.title || soc.platform}
                        >
                          {getSocialIcon(soc.platform || soc.title)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bio Links Rendered Live */}
                  <div className="space-y-2 pt-1 text-left">
                    {sortedActiveLinks.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-700/60 text-slate-400 text-xs text-center">
                        No active links to display.
                      </div>
                    ) : (
                      sortedActiveLinks.map((link) => (
                        <LinktreeLinkCard
                          key={link.id}
                          link={link}
                          theme={selectedTemplate}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Phone Footer */}
                <div className="pt-4 pb-1">
                  <span className="text-[9px] tracking-widest opacity-60 uppercase font-black">
                    Powered by ByteBodh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CREATE / EDIT LINK MODAL ===== */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {editingLink ? "Edit Bio Link" : "Create Bio Link"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize your link with rich media, category headers, animations, and scheduling.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-100 gap-2 pt-3">
                {[
                  { key: "basic", label: "General Info", icon: <FaLink size={11} /> },
                  { key: "design", label: "Media & Colors", icon: <FaPalette size={11} /> },
                  { key: "animation", label: "Attention Animations", icon: <FaMagic size={11} /> },
                  { key: "visibility", label: "Rules & Schedule", icon: <FaClock size={11} /> },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-2 px-1 text-xs font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
                      activeTab === tab.key
                        ? "border-emerald-600 text-emerald-600"
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSaveLink} className="space-y-4 pt-4">
                {/* TAB 1: BASIC INFO */}
                {activeTab === "basic" && (
                  <div className="space-y-3.5 animate-fadeIn">
                    {/* Link Type Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Link Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {LINK_TYPES.map((t) => (
                          <button
                            type="button"
                            key={t.key}
                            onClick={() => setFormData({ ...formData, type: t.key })}
                            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                              formData.type === t.key
                                ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <div className="text-xs font-black">{t.label}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={formData.type === "HEADER" ? "e.g. 🚀 Projects & Work" : "e.g. My Open Source Portfolio"}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Subtitle (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Starred by 2,000+ developers on GitHub"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Destination URL */}
                    {formData.type !== "HEADER" && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Destination URL *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="https://github.com/my-profile"
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    )}

                    {/* Platform Icon */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Branded Platform Icon
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl">
                        {PLATFORM_OPTIONS.map((p) => (
                          <button
                            type="button"
                            key={p.key}
                            onClick={() => setFormData({ ...formData, platform: p.key })}
                            className={`p-2 rounded-lg border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                              formData.platform === p.key
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="text-sm">{p.icon}</span>
                            <span className="truncate max-w-[60px] text-[10px]">{p.label.split(" ")[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DESIGN & MEDIA */}
                {activeTab === "design" && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Thumbnail Image Upload to Cloudflare */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Upload Thumbnail Image (Cloudflare R2)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {formData.thumbnailPreview ? (
                            <img
                              src={formData.thumbnailPreview}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaImage className="text-slate-400 text-xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            id="thumbInput"
                            onChange={handleThumbnailFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="thumbInput"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition border border-slate-200"
                          >
                            <FaImage size={11} />
                            <span>Choose Image File</span>
                          </label>
                          <p className="text-[10px] text-slate-400 mt-1">
                            PNG, JPG, or WebP. Uploads directly to Cloudflare.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Or Direct Image URL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Or Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formData.thumbnailUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            thumbnailUrl: e.target.value,
                            thumbnailPreview: e.target.value || null,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Button Color (Hex)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.buttonColor || "#10B981"}
                            onChange={(e) =>
                              setFormData({ ...formData, buttonColor: e.target.value })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                          />
                          <input
                            type="text"
                            placeholder="#10B981"
                            value={formData.buttonColor}
                            onChange={(e) =>
                              setFormData({ ...formData, buttonColor: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Text Color (Hex)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={formData.textColor || "#FFFFFF"}
                            onChange={(e) =>
                              setFormData({ ...formData, textColor: e.target.value })
                            }
                            className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                          />
                          <input
                            type="text"
                            placeholder="#FFFFFF"
                            value={formData.textColor}
                            onChange={(e) =>
                              setFormData({ ...formData, textColor: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ATTENTION ANIMATIONS */}
                {activeTab === "animation" && (
                  <div className="space-y-3 animate-fadeIn">
                    <p className="text-xs text-slate-500">
                      Select an attention-grabbing animation to make your most important links stand out.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {ANIMATION_OPTIONS.map((a) => (
                        <button
                          type="button"
                          key={a.key}
                          onClick={() => setFormData({ ...formData, animation: a.key })}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            formData.animation === a.key
                              ? "bg-purple-50 border-purple-500 text-purple-900 shadow-xs ring-1 ring-purple-400"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-xs font-black">{a.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{a.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: VISIBILITY & SCHEDULING */}
                {activeTab === "visibility" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-700">Active / Live</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPinned}
                          onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-700">📌 Pin to Top</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-700">⭐ Hero Spotlight</span>
                      </label>

                      <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isSensitive}
                          onChange={(e) => setFormData({ ...formData, isSensitive: e.target.checked })}
                          className="w-4 h-4 text-rose-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-700">🔞 18+ Sensitive</span>
                      </label>
                    </div>

                    {/* Scheduling Windows */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <FaClock className="text-emerald-500" />
                        <span>Scheduled Release & Expiration (Optional)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            Start Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.scheduleStart}
                            onChange={(e) =>
                              setFormData({ ...formData, scheduleStart: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            End Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.scheduleEnd}
                            onChange={(e) =>
                              setFormData({ ...formData, scheduleEnd: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingLink ? "Update Link" : "Create Link"}
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

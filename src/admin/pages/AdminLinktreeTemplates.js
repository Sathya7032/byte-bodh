import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import { adminLinktreeTemplateApi } from "../../api/adminApiService";
import { resolveImageUrl } from "../../api/portfolioApiService";
import { toast } from "react-toastify";
import {
  Layers,
  Plus,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  Crown,
  CheckCircle2,
  XCircle,
  Star,
  Palette,
  Check,
  X,
  Upload,
  Loader2,
  Globe
} from "lucide-react";
import {
  LinktreeCyberDark,
  LinktreeMinimalIvory,
  LinktreeNeoBrutalist,
  LinktreeAuroraGlass,
  LinktreeBentoGrid,
  LinktreeSunsetGlow,
  normalizeTemplateCode
} from "../../portfolio/LinktreeTemplates";

const STYLE_CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "DARK", label: "Dark & Obsidian" },
  { value: "MINIMAL", label: "Minimalist & Ivory" },
  { value: "BRUTALIST", label: "Neo Brutalist" },
  { value: "GLASS", label: "Aurora Glassmorphism" },
  { value: "BENTO", label: "Apple Bento Grid" },
  { value: "WARM", label: "Sunset & Dusk Glow" },
  { value: "OTHER", label: "Other / Creative" },
];

const SAMPLE_DEMO_USER = {
  fullName: "Alex Rivera",
  username: "alexrivera",
  headline: "Senior Full-Stack Architect & Open Source Creator",
  bio: "Building developer tools, scalable microservices, and modern web apps.",
  location: "San Francisco, CA",
  contactEmail: "alex@bytebodh.in",
  hasActiveSubscription: true,
  isProfilePublic: true,
  themeAccentColor: "#10B981",
};

const SAMPLE_DEMO_LINKS = [
  {
    id: "sample-hero",
    title: "🚀 Open Source Portfolio Platform",
    subtitle: "Over 10,000 GitHub stars and 200+ contributors",
    url: "https://bytebodh.in",
    type: "FEATURED_HERO",
    platform: "GITHUB",
    isPinned: true,
    isFeatured: true,
    clickCount: 1420,
  },
  {
    id: "sample-divider",
    title: "⚡ Core Projects & Repositories",
    type: "HEADER",
  },
  {
    id: "sample-1",
    title: "Full-Stack System Architecture Guide",
    subtitle: "Read my deep-dive engineering book",
    url: "https://bytebodh.in",
    type: "CLASSIC",
    platform: "CUSTOM",
    clickCount: 840,
  },
  {
    id: "sample-donation",
    title: "Support My Open Source Work",
    subtitle: "Buy me a coffee to keep projects ad-free",
    url: "https://bytebodh.in",
    type: "PAYMENT_DONATION",
    platform: "COFFEE",
    clickCount: 320,
  },
];

const SAMPLE_DEMO_SOCIALS = [
  { platform: "github", url: "https://github.com" },
  { platform: "linkedin", url: "https://linkedin.com" },
  { platform: "twitter", url: "https://twitter.com" },
  { platform: "youtube", url: "https://youtube.com" },
];

const initialForm = {
  name: "",
  templateCode: "",
  styleCategory: "DARK",
  description: "",
  isPremium: false,
  isActive: true,
  isFeatured: false,
  isNew: false,
  demoUrl: "",
  defaultThemeColor: "#10B981",
  previewImageUrl: "",
  thumbnailImageUrl: "",
  supportedFeatures: "HERO_BANNER,CATEGORY_HEADERS,DONATION_CARDS,ANIMATIONS,18_PLUS_FILTER",
  displayOrder: 1,
};

export default function AdminLinktreeTemplates() {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedTier, setSelectedTier] = useState("ALL"); // ALL | FREE | PREMIUM

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Live Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminLinktreeTemplateApi.getAll({ size: 100 });
      const data = res.data?.content || (Array.isArray(res.data) ? res.data : res.data?.data || []);
      setTemplates(data);
    } catch (err) {
      console.error("Failed to fetch Linktree templates:", err);
      toast.error("Failed to load Linktree templates from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    let result = [...templates];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.templateCode?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "ALL") {
      result = result.filter((t) => t.styleCategory?.toUpperCase() === selectedCategory.toUpperCase());
    }

    if (selectedTier === "FREE") {
      result = result.filter((t) => !t.isPremium);
    } else if (selectedTier === "PREMIUM") {
      result = result.filter((t) => t.isPremium);
    }

    setFilteredTemplates(result);
  }, [templates, searchTerm, selectedCategory, selectedTier]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
  };

  const handleSyncDefaultTemplates = async () => {
    try {
      setSyncing(true);
      const res = await adminLinktreeTemplateApi.seedAll();
      toast.success(res.data?.message || "Standard Linktree templates seeded successfully!");
      fetchTemplates();
    } catch (err) {
      console.error("Sync error:", err);
      toast.error(err.response?.data?.message || "Failed to sync Linktree templates.");
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview("");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (tpl) => {
    setIsEditMode(true);
    setEditingId(tpl.id);
    setFormData({
      name: tpl.name || "",
      templateCode: tpl.templateCode || "",
      styleCategory: tpl.styleCategory || "DARK",
      description: tpl.description || "",
      isPremium: Boolean(tpl.isPremium),
      isActive: tpl.isActive !== false,
      isFeatured: Boolean(tpl.isFeatured),
      isNew: Boolean(tpl.isNew),
      demoUrl: tpl.demoUrl || "",
      defaultThemeColor: tpl.defaultThemeColor || "#10B981",
      previewImageUrl: tpl.previewImageUrl || "",
      thumbnailImageUrl: tpl.thumbnailImageUrl || "",
      supportedFeatures: tpl.supportedFeatures || "",
      displayOrder: tpl.displayOrder ?? 1,
    });
    setImageFile(null);
    setImagePreview(tpl.previewImageUrl ? resolveImageUrl(tpl.previewImageUrl) : "");
    setShowFormModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.templateCode.trim()) {
      toast.error("Template Name and Template Code are required.");
      return;
    }

    try {
      setSubmitting(true);

      if (imageFile) {
        const fd = new FormData();
        fd.append("name", formData.name.trim());
        fd.append("templateCode", formData.templateCode.trim().toUpperCase());
        fd.append("styleCategory", formData.styleCategory);
        if (formData.description) fd.append("description", formData.description.trim());
        fd.append("isPremium", formData.isPremium);
        fd.append("isActive", formData.isActive);
        fd.append("isFeatured", formData.isFeatured);
        fd.append("isNew", formData.isNew);
        if (formData.demoUrl) fd.append("demoUrl", formData.demoUrl.trim());
        if (formData.defaultThemeColor) fd.append("defaultThemeColor", formData.defaultThemeColor);
        if (formData.supportedFeatures) fd.append("supportedFeatures", formData.supportedFeatures);
        fd.append("displayOrder", formData.displayOrder || 1);
        fd.append("previewImage", imageFile);

        if (isEditMode) {
          await adminLinktreeTemplateApi.update(editingId, fd);
          toast.success("Linktree template updated with new Cloudflare mockup!");
        } else {
          await adminLinktreeTemplateApi.create(fd);
          toast.success("New Linktree template created!");
        }
      } else {
        const payload = {
          name: formData.name.trim(),
          templateCode: formData.templateCode.trim().toUpperCase(),
          styleCategory: formData.styleCategory,
          description: formData.description?.trim() || null,
          isPremium: formData.isPremium,
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          isNew: formData.isNew,
          demoUrl: formData.demoUrl?.trim() || null,
          defaultThemeColor: formData.defaultThemeColor || "#10B981",
          previewImageUrl: formData.previewImageUrl?.trim() || null,
          thumbnailImageUrl: formData.thumbnailImageUrl?.trim() || null,
          supportedFeatures: formData.supportedFeatures || null,
          displayOrder: Number(formData.displayOrder) || 1,
        };

        if (isEditMode) {
          await adminLinktreeTemplateApi.update(editingId, payload);
          toast.success("Linktree template updated successfully!");
        } else {
          await adminLinktreeTemplateApi.create(payload);
          toast.success("New Linktree template created!");
        }
      }

      setShowFormModal(false);
      fetchTemplates();
    } catch (err) {
      console.error("Save template error:", err);
      toast.error(err.response?.data?.message || "Failed to save Linktree template.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (tpl) => {
    try {
      setTogglingId(tpl.id);
      await adminLinktreeTemplateApi.toggleActive(tpl.id);
      toast.success(`Toggled active status for ${tpl.name}`);
      setTemplates((prev) =>
        prev.map((t) => (t.id === tpl.id ? { ...t, isActive: !t.isActive } : t))
      );
      setFilteredTemplates((prev) =>
        prev.map((t) => (t.id === tpl.id ? { ...t, isActive: !t.isActive } : t))
      );
    } catch (err) {
      toast.error("Failed to toggle template active status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleTogglePremium = async (tpl) => {
    try {
      setTogglingId(tpl.id);
      await adminLinktreeTemplateApi.togglePremium(tpl.id);
      toast.info(`Toggled Free/PRO tier for ${tpl.name}`);
      setTemplates((prev) =>
        prev.map((t) => (t.id === tpl.id ? { ...t, isPremium: !t.isPremium } : t))
      );
      setFilteredTemplates((prev) =>
        prev.map((t) => (t.id === tpl.id ? { ...t, isPremium: !t.isPremium } : t))
      );
    } catch (err) {
      toast.error("Failed to toggle template premium tier.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteClick = (tpl) => {
    setTemplateToDelete(tpl);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    try {
      setDeleting(true);
      await adminLinktreeTemplateApi.delete(templateToDelete.id);
      toast.success(`Template ${templateToDelete.name} deleted.`);
      setShowDeleteModal(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (err) {
      toast.error("Failed to delete template.");
    } finally {
      setDeleting(false);
    }
  };

  // Render Live Preview inside phone modal
  const renderPhonePreview = (templateCode) => {
    const code = normalizeTemplateCode(templateCode);
    switch (code) {
      case "minimal-ivory":
        return <LinktreeMinimalIvory user={SAMPLE_DEMO_USER} links={SAMPLE_DEMO_LINKS} socialLinks={SAMPLE_DEMO_SOCIALS} />;
      case "neo-brutalist":
        return <LinktreeNeoBrutalist user={SAMPLE_DEMO_USER} links={SAMPLE_DEMO_LINKS} socialLinks={SAMPLE_DEMO_SOCIALS} />;
      case "aurora-glass":
        return <LinktreeAuroraGlass user={SAMPLE_DEMO_USER} links={SAMPLE_DEMO_LINKS} socialLinks={SAMPLE_DEMO_SOCIALS} />;
      case "bento-grid":
        return <LinktreeBentoGrid user={SAMPLE_DEMO_USER} links={SAMPLE_DEMO_LINKS} socialLinks={SAMPLE_DEMO_SOCIALS} />;
      case "sunset-glow":
        return <LinktreeSunsetGlow user={SAMPLE_DEMO_USER} links={SAMPLE_DEMO_LINKS} socialLinks={SAMPLE_DEMO_SOCIALS} />;
      case "cyber-dark":
      default:
        return <LinktreeCyberDark user={SAMPLE_DEMO_USER} links={SAMPLE_DEMO_LINKS} socialLinks={SAMPLE_DEMO_SOCIALS} />;
    }
  };

  const totalTemplates = templates.length;
  const activeCount = templates.filter((t) => t.isActive).length;
  const freeCount = templates.filter((t) => !t.isPremium).length;
  const premiumCount = templates.filter((t) => t.isPremium).length;
  const featuredCount = templates.filter((t) => t.isFeatured).length;

  return (
    <DashboardLayout pageTitle="Linktree Bio Templates Management">
      <div className="space-y-6 text-left">
        {/* ===== TOP TABS & SWITCHER BAR ===== */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <Link
              to="/admin-templates"
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
            >
              <Globe size={13} />
              <span>Portfolio Website Templates</span>
            </Link>
            <Link
              to="/admin-linktree-templates"
              className="px-4 py-2 rounded-lg text-xs font-black bg-white text-emerald-700 shadow-xs border border-slate-200/80 flex items-center gap-1.5"
            >
              <Palette size={13} className="text-emerald-500" />
              <span>Linktree Bio Templates</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSyncDefaultTemplates}
              disabled={syncing}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Seed standard 6 Linktree templates if not already seeded"
            >
              <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
              <span>{syncing ? "Syncing..." : "Sync Default Templates"}</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Linktree Template</span>
            </button>
          </div>
        </div>

        {/* ===== STATS OVERVIEW CARDS ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Templates</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">{totalTemplates}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Layers size={18} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Published</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Tier</p>
              <p className="text-xl font-black text-teal-600 mt-0.5">{freeCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Check size={18} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PRO / Premium</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">{premiumCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown size={18} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Featured</p>
              <p className="text-xl font-black text-purple-600 mt-0.5">{featuredCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Star size={18} />
            </div>
          </div>
        </div>

        {/* ===== SEARCH & FILTER BAR ===== */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by template name, code, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              {STYLE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Tier Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {["ALL", "FREE", "PREMIUM"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleTierChange(tier)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    selectedTier === tier
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tier === "ALL" ? "All Tiers" : tier === "FREE" ? "Free Only" : "PRO Only"}
                </button>
              ))}
            </div>

            <button
              onClick={fetchTemplates}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ===== TEMPLATES GRID ===== */}
        {loading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-emerald-500" size={28} />
            <p className="text-xs font-bold mt-2">Loading Linktree templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <Palette className="mx-auto text-slate-400 mb-2" size={32} />
            <h4 className="font-bold text-slate-800 text-sm">No Linktree templates found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No templates match your search criteria. You can create a new template or sync the 6 default templates.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={handleSyncDefaultTemplates}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                Sync Default Templates
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
              >
                Create New Template
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((tpl) => {
              const previewUrl = tpl.previewImageUrl ? resolveImageUrl(tpl.previewImageUrl) : null;

              return (
                <div
                  key={tpl.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                    tpl.isActive ? "border-slate-200 hover:border-emerald-300" : "border-slate-200/60 opacity-60"
                  }`}
                >
                  {/* Card Header & Mockup Area */}
                  <div>
                    <div className="relative h-44 bg-slate-900 overflow-hidden flex items-center justify-center group">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={tpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                          style={{
                            background:
                              tpl.styleCategory === "BRUTALIST"
                                ? "#FEF08A"
                                : tpl.styleCategory === "MINIMAL"
                                ? "#FAFAF9"
                                : tpl.styleCategory === "GLASS"
                                ? "linear-gradient(135deg, #1E1B4B, #0F172A)"
                                : tpl.styleCategory === "WARM"
                                ? "linear-gradient(135deg, #2A0E3C, #180828)"
                                : "linear-gradient(135deg, #070B14, #0C1222)",
                          }}
                        >
                          <span className="text-3xl mb-1">
                            {tpl.styleCategory === "BRUTALIST"
                              ? "🎨"
                              : tpl.styleCategory === "MINIMAL"
                              ? "🕊️"
                              : tpl.styleCategory === "GLASS"
                              ? "🔮"
                              : tpl.styleCategory === "WARM"
                              ? "🌅"
                              : tpl.styleCategory === "BENTO"
                              ? "🍱"
                              : "⚡"}
                          </span>
                          <span
                            className={`text-xs font-black uppercase tracking-wider ${
                              tpl.styleCategory === "BRUTALIST" || tpl.styleCategory === "MINIMAL"
                                ? "text-slate-900"
                                : "text-white"
                            }`}
                          >
                            {tpl.name}
                          </span>
                        </div>
                      )}

                      {/* Overlay Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                        {tpl.isPremium ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Crown size={9} /> PRO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] uppercase tracking-wider shadow-sm">
                            FREE
                          </span>
                        )}

                        {tpl.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white font-black text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Star size={9} /> FEATURED
                          </span>
                        )}

                        {tpl.isNew && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Display Order & Active Indicator */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-slate-300 font-mono text-[9px] font-bold">
                          #{tpl.displayOrder ?? 1}
                        </span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            tpl.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                          title={tpl.isActive ? "Published" : "Inactive"}
                        />
                      </div>

                      {/* Quick Hover Preview Button */}
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-bold text-xs cursor-pointer"
                      >
                        <Eye size={15} />
                        <span>Interactive Preview</span>
                      </button>
                    </div>

                    {/* Template Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900 text-sm">{tpl.name}</h4>
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {tpl.templateCode}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {tpl.description || "No description provided."}
                      </p>

                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                          {tpl.styleCategory || "DARK"}
                        </span>
                        {tpl.defaultThemeColor && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-slate-300"
                              style={{ backgroundColor: tpl.defaultThemeColor }}
                            />
                            {tpl.defaultThemeColor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Template Card Actions */}
                  <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Toggle Active */}
                      <button
                        disabled={togglingId === tpl.id}
                        onClick={() => handleToggleActive(tpl)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          tpl.isActive
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                        }`}
                        title={tpl.isActive ? "Deactivate (Hide from catalog)" : "Publish (Visible in catalog)"}
                      >
                        {tpl.isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      </button>

                      {/* Toggle Free vs Premium */}
                      <button
                        disabled={togglingId === tpl.id}
                        onClick={() => handleTogglePremium(tpl)}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          tpl.isPremium
                            ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                        }`}
                        title={tpl.isPremium ? "Make Free (Anyone can use)" : "Make PRO (Subscription required)"}
                      >
                        <Crown size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Preview Button */}
                      <button
                        onClick={() => setPreviewTemplate(tpl)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 transition cursor-pointer"
                        title="Live Mobile Preview"
                      >
                        <Eye size={13} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(tpl)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-white border border-transparent hover:border-slate-200 transition cursor-pointer"
                        title="Edit Template"
                      >
                        <Edit3 size={13} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(tpl)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Template"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== CREATE / EDIT MODAL ===== */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {isEditMode ? "Edit Linktree Template" : "Create Linktree Template"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure layout attributes, Cloudflare preview mockup, and user subscription requirements.
                  </p>
                </div>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyber Dark"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Template Code */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Template Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CYBER_DARK"
                      value={formData.templateCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          templateCode: e.target.value.toUpperCase().replace(/\s+/g, "_"),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Style Category
                    </label>
                    <select
                      value={formData.styleCategory}
                      onChange={(e) => setFormData({ ...formData, styleCategory: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {STYLE_CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Display Order Position
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the visual layout and aesthetic features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Preview Image Upload to Cloudflare */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preview Mockup Image (Cloudflare R2)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Palette className="text-slate-400" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        id="tplImg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="tplImg"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition border border-slate-200"
                      >
                        <Upload size={11} />
                        <span>Upload Mockup</span>
                      </label>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG or WebP image showing the layout preview.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fallback Preview Image URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Or Direct Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.previewImageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, previewImageUrl: e.target.value });
                      if (!imageFile) setImagePreview(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Accent Color & Demo URL */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Default Theme Accent
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.defaultThemeColor}
                        onChange={(e) => setFormData({ ...formData, defaultThemeColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                      />
                      <input
                        type="text"
                        value={formData.defaultThemeColor}
                        onChange={(e) => setFormData({ ...formData, defaultThemeColor: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Demo URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://bytebodh.in/demo"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Checkbox Attributes */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">Published / Active</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPremium}
                      onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">👑 Requires PRO Plan</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">⭐ Featured Showcase</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700">✨ Show 'NEW' Badge</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : isEditMode ? "Update Template" : "Create Template"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== DELETE CONFIRMATION MODAL ===== */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Delete Linktree Template?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete <span className="font-bold text-slate-800">{templateToDelete?.name}</span>? Users currently using this template code may fall back to default.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== LIVE INTERACTIVE PREVIEW MODAL ===== */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="relative max-w-sm w-full">
              {/* Close Button */}
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Smartphone Case Frame */}
              <div className="bg-slate-900 rounded-[48px] p-4 shadow-2xl border-4 border-slate-800 max-h-[90vh] overflow-hidden">
                {/* Dynamic Island */}
                <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                </div>

                <div className="max-h-[76vh] overflow-y-auto rounded-[36px]">
                  {renderPhonePreview(previewTemplate.templateCode)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

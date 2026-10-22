import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import { adminTemplateApi } from "../../api/adminApiService";
import { CLOUDFLARE_R2_PUBLIC_URL } from "../../config/api";
import { toast } from "react-toastify";
import {
  Edit3,
  Trash2,
  Plus,
  Layers,
  Upload,
  Check,
  X,
  Search,
  CheckCircle2,
  ExternalLink,
  Shield,
  Loader2,
  Tag,
  Sparkles,
  Eye
} from "lucide-react";
import { TemplatePreviewModal, TemplateCardThumbnail } from "../../bytebodh-folio/TemplateRenderer";

const CATEGORIES = [
  { value: "ALL", label: "All Categories" },
  { value: "DEVELOPER", label: "Developer & Tech" },
  { value: "DESIGNER", label: "Designer & UI/UX" },
  { value: "CREATOR", label: "Content Creator" },
  { value: "PHOTOGRAPHER", label: "Photographer" },
  { value: "MUSICIAN", label: "Musician & Audio" },
  { value: "BUSINESS", label: "Business & Executive" },
  { value: "MINIMAL", label: "Minimalist & Clean" },
  { value: "OTHER", label: "Other / General" },
];

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [previewingTemplate, setPreviewingTemplate] = useState(null);

  // Form modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    templateCode: "",
    category: "DEVELOPER",
    description: "",
    isPremium: false,
    isActive: true,
    isFeatured: false,
    isNew: false,
    demoUrl: "",
    defaultThemeColor: "#10b981",
    previewImageUrl: ""
  });

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [syncingTemplates, setSyncingTemplates] = useState(false);

  const handleSyncWebsiteTemplates = async () => {
    try {
      setSyncingTemplates(true);
      const res = await adminTemplateApi.seedAll();
      toast.success(res.data?.message || "All 18 website portfolio templates synced successfully!");
      fetchTemplates();
    } catch (error) {
      console.error("Sync error:", error);
      toast.error(error.response?.data?.message || "Failed to sync website templates.");
    } finally {
      setSyncingTemplates(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await adminTemplateApi.getAll();
      const data = res.data?.data || res.data || [];
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast.error("Failed to load templates from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates list
  useEffect(() => {
    let result = [...templates];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          (t.name || t.templateName)?.toLowerCase().includes(term) ||
          t.templateCode?.toLowerCase().includes(term) ||
          t.description?.toLowerCase().includes(term) ||
          t.category?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "ALL") {
      result = result.filter(
        (t) => (t.category || "").toUpperCase() === selectedCategory.toUpperCase()
      );
    }

    setFilteredTemplates(result);
  }, [templates, searchTerm, selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      name: "",
      templateCode: "",
      category: "DEVELOPER",
      description: "",
      isPremium: false,
      isActive: true,
      isFeatured: false,
      isNew: true,
      demoUrl: "",
      defaultThemeColor: "#10b981",
      previewImageUrl: ""
    });
    setShowModal(true);
  };

  const openEditModal = (template) => {
    setIsEditMode(true);
    setEditingId(template.id);
    setImageFile(null);
    setImagePreview(template.previewImageUrl || "");
    setFormData({
      name: template.name || template.templateName || "",
      templateCode: template.templateCode || "",
      category: template.category || "DEVELOPER",
      description: template.description || "",
      isPremium: template.isPremium !== undefined ? template.isPremium : !template.isFree,
      isActive: template.isActive !== undefined ? template.isActive : true,
      isFeatured: template.isFeatured || false,
      isNew: template.isNew || false,
      demoUrl: template.demoUrl || "",
      defaultThemeColor: template.defaultThemeColor || "#10b981",
      previewImageUrl: template.previewImageUrl || ""
    });
    setShowModal(true);
  };

  const handleToggleActive = async (template) => {
    try {
      setTogglingId(template.id);
      await adminTemplateApi.toggle(template.id);
      toast.success(
        `Template "${template.name || template.templateCode}" is now ${template.isActive ? "Unpublished" : "Published"}!`
      );
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, isActive: !t.isActive } : t))
      );
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to toggle template status.");
    } finally {
      setTogglingId(null);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Template name is required");
      return false;
    }
    if (!formData.templateCode.trim()) {
      toast.error("Template code is required (e.g. BENTO_DEV, MINIMAL_LIGHT)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("templateCode", formData.templateCode.trim().toUpperCase());
      data.append("category", formData.category);
      data.append("description", formData.description.trim());
      data.append("isPremium", formData.isPremium);
      data.append("isActive", formData.isActive);
      data.append("isFeatured", formData.isFeatured);
      data.append("isNew", formData.isNew);
      data.append("demoUrl", formData.demoUrl.trim());
      data.append("defaultThemeColor", formData.defaultThemeColor);

      if (imageFile) {
        data.append("previewImage", imageFile);
      } else if (formData.previewImageUrl) {
        data.append("previewImageUrl", formData.previewImageUrl.trim());
      }

      if (isEditMode) {
        await adminTemplateApi.update(editingId, data);
        toast.success("Template layout updated successfully!");
      } else {
        await adminTemplateApi.create(data);
        toast.success("New template published successfully!");
      }

      setShowModal(false);
      fetchTemplates();
    } catch (error) {
      console.error("Save error:", error);
      const msg = error.response?.data?.message || error.message || "Failed to save template.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (template) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    setDeleting(true);
    try {
      await adminTemplateApi.delete(templateToDelete.id);
      toast.success("Template deleted successfully!");
      setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete template.");
    } finally {
      setDeleting(false);
    }
  };

  // Stats calculation
  const totalCount = templates.length;
  const activeCount = templates.filter((t) => t.isActive).length;
  const premiumCount = templates.filter((t) => t.isPremium).length;
  const freeCount = templates.filter((t) => !t.isPremium).length;

  return (
    <DashboardLayout pageTitle="Portfolio Templates">
      <div className="space-y-6 text-left">
        
        {/* Top Tabs Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <Link
            to="/admin-templates"
            className="px-4 py-2 rounded-lg text-xs font-black bg-white text-emerald-700 shadow-xs border border-slate-200/80 flex items-center gap-1.5"
          >
            <Layers size={13} className="text-emerald-500" />
            <span>Portfolio Website Templates</span>
          </Link>
          <Link
            to="/admin-linktree-templates"
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5"
          >
            <Sparkles size={13} className="text-slate-400" />
            <span>Linktree Bio Templates</span>
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Layout Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Portfolio Templates Catalog
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, configure, and release interactive portfolio layouts for platform users.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleSyncWebsiteTemplates}
              disabled={syncingTemplates}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm text-xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
              title="Add all 18 website portfolio templates with descriptions, categories, and subscription settings"
            >
              {syncingTemplates ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Syncing 18 Layouts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Sync Website Templates (18)</span>
                </>
              )}
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Template</span>
            </button>
          </div>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center">
            <div className="rounded-xl bg-emerald-50 p-3 mr-4 text-emerald-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Templates</p>
              <h3 className="text-2xl font-black text-slate-900">{totalCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center">
            <div className="rounded-xl bg-teal-50 p-3 mr-4 text-teal-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active in Store</p>
              <h3 className="text-2xl font-black text-slate-900">{activeCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center">
            <div className="rounded-xl bg-amber-50 p-3 mr-4 text-amber-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pro Subscription</p>
              <h3 className="text-2xl font-black text-slate-900">{premiumCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center">
            <div className="rounded-xl bg-slate-100 p-3 mr-4 text-slate-600">
              <Tag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Free Access</p>
              <h3 className="text-2xl font-black text-slate-900">{freeCount}</h3>
            </div>
          </div>
        </div>

        {/* Filter and Search Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates by title, code, or description..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Category:</span>
              <select
                className="border border-slate-200/60 rounded-xl px-3.5 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-semibold w-full md:w-auto cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10 mb-4 animate-spin">
              <Loader2 className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-semibold text-sm">Loading template catalog...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No templates found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust your search keywords or click "Add Template" to release a new layout.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const name = template.name || template.templateName || "Untitled Template";
              const isPremium = template.isPremium !== undefined ? template.isPremium : !template.isFree;

              return (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-emerald-300 transition-all group"
                >
                  {/* Live Component Preview Header (Same like website) */}
                  <div
                    onClick={() => setPreviewingTemplate(template)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 cursor-pointer group/img"
                  >
                    <TemplateCardThumbnail
                      templateId={template}
                      title={name}
                    />

                    {/* Hover Overlay with Live Component Preview */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <span className="px-3.5 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" /> Preview Component
                      </span>
                    </div>
                    
                    {/* Live Demo Link overlay */}
                    {template.demoUrl && (
                      <a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-3 right-3 p-2 bg-white/90 text-slate-800 hover:text-emerald-600 hover:bg-white rounded-xl shadow backdrop-blur-sm transition-all z-20"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-sm uppercase tracking-wider z-20">
                      {template.category || "GENERAL"}
                    </span>

                    {/* Pro / Free Tag */}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-sm uppercase tracking-wider z-20 ${
                        isPremium
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-emerald-600 text-white shadow-sm"
                      }`}
                    >
                      {isPremium ? "PRO ONLY" : "FREE"}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1">{name}</h3>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
                          {template.templateCode}
                        </span>
                      </div>

                      <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                        {template.description || "No layout description provided."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {/* Active Toggle Button */}
                      <button
                        onClick={() => handleToggleActive(template)}
                        disabled={togglingId === template.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          template.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {togglingId === template.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : template.isActive ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{template.isActive ? "Published" : "Hidden"}</span>
                      </button>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPreviewingTemplate(template)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                          title="Live Preview Template Component"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(template)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Template"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(template)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/60 text-left">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div>
                <h3 className="font-black text-slate-800 text-lg">
                  {isEditMode ? "Modify Template Layout" : "Publish New Portfolio Layout"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure template codes, preview image mockups, and subscription access.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Template Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Modern Bento Grid Pro"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                    disabled={submitting}
                    required
                  />
                </div>

                {/* Template Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Template Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="templateCode"
                    value={formData.templateCode}
                    onChange={handleInputChange}
                    placeholder="e.g. BENTO_DEV"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono uppercase"
                    disabled={submitting}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Profession / Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer font-medium"
                    disabled={submitting}
                    required
                  >
                    {CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Theme Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="defaultThemeColor"
                      value={formData.defaultThemeColor}
                      onChange={handleInputChange}
                      className="w-9 h-9 p-0.5 border border-slate-200/60 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      name="defaultThemeColor"
                      value={formData.defaultThemeColor}
                      onChange={handleInputChange}
                      className="flex-1 px-3.5 py-2 text-sm border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Demo URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Live Interactive Demo URL
                </label>
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  placeholder="https://bytebodh.in/demo/bento"
                  className="w-full px-3.5 py-2 text-sm border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  disabled={submitting}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Aesthetic Highlights
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the card layout, animations, and target audience..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  disabled={submitting}
                />
              </div>

              {/* Access & Publish Switches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Pro Access Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Pro Subscription Only</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formData.isPremium
                        ? "Requires active subscription"
                        : "Open to free tier users"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPremium"
                      checked={formData.isPremium}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Published Status Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Publish in Catalog</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formData.isActive ? "Visible in template store" : "Hidden from users"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Preview Mockup Image Upload */}
              <div className="pt-1">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Preview Image Mockup
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {imagePreview && (
                    <div className="relative w-36 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                      <img
                        src={
                          imagePreview.startsWith("http") || imagePreview.startsWith("data:")
                            ? imagePreview
                            : `${CLOUDFLARE_R2_PUBLIC_URL}/${imagePreview.replace(/^\//, "")}`
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <label className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200/80 hover:border-emerald-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition-colors">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700">
                        {imageFile ? imageFile.name : "Choose mockup image (PNG, JPG, WebP)"}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Max size 5MB (16:9 recommended)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                        disabled={submitting}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-slate-200/60 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isEditMode ? "Save Changes" : "Create Template"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && templateToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200/60 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Template?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-slate-700">
                "{templateToDelete.name || templateToDelete.templateCode}"
              </span>
              ? This action cannot be undone and purges any Cloudflare mockup images.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 border border-slate-200/60 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Component Preview Modal */}
      {previewingTemplate && (
        <TemplatePreviewModal
          isOpen={Boolean(previewingTemplate)}
          onClose={() => setPreviewingTemplate(null)}
          template={previewingTemplate}
          isAdmin={true}
        />
      )}

    </DashboardLayout>
  );
};

export default Templates;

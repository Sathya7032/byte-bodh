import React, { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from "../../api/templateService";
import { getUsers } from "../../api/users";
import { getUser } from "../../services/auth";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaLayerGroup,
  FaInfoCircle,
  FaUpload,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaDollarSign,
  FaTag,
  FaSearch
} from "react-icons/fa";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Admin user identification
  const [creatorId, setCreatorId] = useState(null);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Image handling states
  const [imagePreview, setImagePreview] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  const [formData, setFormData] = useState({
    templateName: "",
    templateCode: "",
    category: "Academic",
    description: "",
    isFree: true,
    cost: 0,
    isActive: true
  });

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  // Fallback mock images if previewImageUrl is empty
  const mockImageMap = {
    1: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80", // Resume/Minimal
    2: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80", // Monospace/Monochrome
    3: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80", // Creative/Gallery
    4: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"  // Executive
  };

  const fetchCreatorId = async () => {
    try {
      const loggedIn = getUser();
      if (!loggedIn || !loggedIn.email) return;

      const res = await getUsers();
      const userList = res.data || [];
      const adminUser = userList.find(u => u.email === loggedIn.email);
      if (adminUser) {
        setCreatorId(adminUser.id);
      }
    } catch (error) {
      console.error("Failed to find logged-in user ID:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await getAllTemplates();
      const data = res.data?.data || res.data || [];
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast.error("Failed to load templates database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchCreatorId();
  }, []);

  // Filter templates list based on search and category
  useEffect(() => {
    let result = [...templates];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        t =>
          t.templateName?.toLowerCase().includes(term) ||
          t.templateCode?.toLowerCase().includes(term) ||
          t.category?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        t => t.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredTemplates(result);
  }, [templates, searchTerm, selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      // FileReader results look like: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
      // We extract the pure base64 code string to send to backend converter
      const base64String = reader.result.split(",")[1];
      setImageBase64(base64String);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setImagePreview("");
    setImageFileName("");
    setImageBase64("");
    setFormData({
      templateName: "",
      templateCode: "",
      category: "Academic",
      description: "",
      isFree: true,
      cost: 0,
      isActive: true
    });
    setShowModal(true);
  };

  const openEditModal = (template) => {
    setIsEditMode(true);
    setEditingId(template.id);
    setImagePreview(template.previewImageUrl || "");
    setImageFileName("");
    setImageBase64("");
    setFormData({
      templateName: template.templateName || "",
      templateCode: template.templateCode || "",
      category: template.category || "Academic",
      description: template.description || "",
      isFree: template.isFree !== undefined ? template.isFree : true,
      cost: template.cost || 0,
      isActive: template.isActive !== undefined ? template.isActive : true
    });
    setShowModal(true);
  };

  const validateForm = () => {
    if (!formData.templateName.trim()) {
      toast.error("Template name is required");
      return false;
    }
    if (!formData.templateCode.trim()) {
      toast.error("Template code is required");
      return false;
    }
    if (!formData.isFree && (!formData.cost || formData.cost <= 0)) {
      toast.error("Paid templates must have a cost greater than 0");
      return false;
    }
    if (!isEditMode && !imageBase64) {
      toast.error("Please upload a preview image cover");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        templateName: formData.templateName.trim(),
        templateCode: formData.templateCode.trim(),
        category: formData.category,
        description: formData.description.trim(),
        isFree: formData.isFree,
        cost: formData.isFree ? 0.0 : parseFloat(formData.cost),
        isActive: formData.isActive,
        previewImageBase64: imageBase64 || null,
        previewImageFileName: imageFileName || null,
        createdBy: creatorId || 1 // Fallback in case creatorId lookup is pending
      };

      if (isEditMode) {
        await updateTemplate(editingId, payload);
        toast.success("Template updated successfully!");
      } else {
        await createTemplate(payload);
        toast.success("Template created successfully!");
      }

      setShowModal(false);
      fetchTemplates();
    } catch (error) {
      console.error("Save template error:", error);
      const msg = error.response?.data?.message || "Failed to save template. Please try again.";
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
    try {
      await deleteTemplate(templateToDelete.id);
      toast.success("Template deleted successfully!");
      fetchTemplates();
    } catch (error) {
      console.error("Delete template error:", error);
      const msg = error.response?.data?.message || "Failed to delete template.";
      toast.error(msg);
    } finally {
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    }
  };

  // Stats calculation
  const totalCount = templates.length;
  const freeCount = templates.filter(t => t.isFree).length;
  const paidCount = templates.filter(t => !t.isFree).length;
  const activeCount = templates.filter(t => t.isActive).length;

  const categoriesList = ["all", ...new Set(templates.map(t => t.category).filter(Boolean))];

  return (
    <DashboardLayout pageTitle="Templates">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portfolio Templates</h1>
            <p className="text-slate-600 mt-1">Add, update, and manage portfolio layouts available to users.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-150"
          >
            <FaPlus className="text-sm" />
            Add Template
          </button>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className="rounded-2xl bg-blue-50 p-4 mr-4 text-blue-600">
              <FaLayerGroup size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Templates</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalCount}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className="rounded-2xl bg-emerald-50 p-4 mr-4 text-emerald-600">
              <FaTag size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Free Layouts</p>
              <h3 className="text-2xl font-bold text-slate-800">{freeCount}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className="rounded-2xl bg-amber-50 p-4 mr-4 text-amber-600">
              <FaDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Paid Layouts</p>
              <h3 className="text-2xl font-bold text-slate-800">{paidCount}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center">
            <div className="rounded-2xl bg-indigo-50 p-4 mr-4 text-indigo-600">
              <FaCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Templates</p>
              <h3 className="text-2xl font-bold text-slate-800">{activeCount}</h3>
            </div>
          </div>
        </div>

        {/* Filter and Search Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates by name, code, or category..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-slate-500 font-medium text-sm whitespace-nowrap">Filter by Category:</span>
              <select
                className="border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-semibold text-sm w-full md:w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-slate-600 font-semibold">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <FaLayerGroup size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No templates found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters or add a new template layout.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map(template => {
              const imageSrc = template.previewImageUrl || mockImageMap[template.id] || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80";
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Card Cover Preview */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={template.templateName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <a
                        href={`/templates/preview/${template.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/90 text-slate-800 hover:bg-white rounded-full shadow-lg transition-all"
                        title="Live Preview"
                      >
                        <FaEye size={18} />
                      </a>
                    </div>
                    {/* Category Tag */}
                    <span className="absolute top-4 left-4 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      {template.category}
                    </span>
                    {/* Status Badge */}
                    <span
                      className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm border backdrop-blur-sm ${template.isActive
                        ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-500 border-rose-500/30"
                        }`}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg font-bold text-slate-800 truncate">{template.templateName}</h3>
                      <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200 uppercase font-semibold">
                        {template.templateCode}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                      {template.description || "No description provided for this template layout."}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      {/* Price Tag */}
                      <div>
                        <span className="text-xs text-slate-400 font-medium">Pricing Model</span>
                        <p className="font-bold text-slate-800 text-base">
                          {template.isFree ? (
                            <span className="text-emerald-600">Free Access</span>
                          ) : (
                            <span>₹{template.cost}</span>
                          )}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(template)}
                          className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl border border-slate-200 hover:border-blue-200 transition-all"
                          title="Edit Template"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(template)}
                          className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl border border-slate-200 hover:border-rose-200 transition-all"
                          title="Delete Template"
                        >
                          <FaTrash size={16} />
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

      {/* Save Modal (Create / Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 transform scale-100 transition-transform">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {isEditMode ? "Modify Template Layout" : "Create Portfolio Layout"}
                </h3>
                <p className="text-xs text-slate-500">Provide details for the custom resume/portfolio layout structure.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Template Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Template Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="templateName"
                    value={formData.templateName}
                    onChange={handleInputChange}
                    placeholder="e.g. Creative Scholar"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    disabled={submitting}
                    required
                  />
                </div>

                {/* Template Code */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    Template Code <span className="text-rose-500">*</span>
                    <span
                      className="text-slate-400 cursor-help"
                      title="Unique identifier linked to code file renderer (e.g. t1, t2, t3, t4)."
                    >
                      <FaInfoCircle size={13} />
                    </span>
                  </label>
                  <input
                    type="text"
                    name="templateCode"
                    value={formData.templateCode}
                    onChange={handleInputChange}
                    placeholder="e.g. t5"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-mono"
                    disabled={submitting}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
                    disabled={submitting}
                    required
                  >
                    <option value="Academic">Academic / Fresher</option>
                    <option value="Professional">Professional / Resume</option>
                    <option value="Hacker">Hacker / Terminal</option>
                    <option value="Creative">Creative / Gallery</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center h-full sm:pt-6">
                  <label className="flex items-center cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="sr-only"
                        disabled={submitting}
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors duration-250 ${formData.isActive ? "bg-blue-600" : "bg-slate-300"}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-250 ${formData.isActive ? "transform translate-x-6" : ""}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-semibold text-slate-700">
                      Enable Layout Status (Active)
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Template Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Summarize the core layout structure and style guidelines..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-slate-800"
                  disabled={submitting}
                />
              </div>

              {/* Pricing Section */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <label className="flex items-center cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={submitting}
                    />
                    <div className={`block w-14 h-8 rounded-full transition-colors duration-250 ${formData.isFree ? "bg-emerald-600" : "bg-slate-300"}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-250 ${formData.isFree ? "transform translate-x-6" : ""}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-semibold text-slate-700">
                    Free for all subscribers
                  </span>
                </label>

                {!formData.isFree && (
                  <div className="flex-1 max-w-[200px]">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Purchase Cost (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 font-bold text-slate-500 text-sm">₹</span>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        placeholder="199"
                        min="1"
                        className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                        disabled={submitting}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload Preview */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Preview Image Cover
                </label>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {imagePreview && (
                    <div className="relative w-40 aspect-video rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-sm flex-shrink-0 group">
                      <img src={imagePreview} alt="Local Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-all">
                        Selected Image
                      </div>
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <label className={`w-full flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-colors ${submitting ? "pointer-events-none opacity-50" : ""}`}>
                      <FaUpload className="text-slate-400 mb-2" size={20} />
                      <span className="text-sm text-slate-600 font-semibold">
                        {imageFileName ? imageFileName : "Select a new image"}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">Recommended: 16:9 ratio, Max 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={submitting}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Layout</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && templateToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
                <FaTrash size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Delete Layout</h3>
                <p className="text-xs text-slate-500">This action is irreversible</p>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete template <strong className="text-slate-800">{templateToDelete.templateName}</strong>?
              This will remove the template layout from catalog and prevent users from selecting or purchasing it.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTemplateToDelete(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
              >
                Delete Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Templates;

import React, { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "../DashboardLayout";
import { adminBlogApi } from "../../api/adminApiService";
import { getAdmin } from "../../services/auth";
import { toast } from "react-toastify";
import RichTextEditor from "../components/RichTextEditor";
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  ExternalLink,
  Star,
  RefreshCw,
  Clock,
  Video,
  Image as ImageIcon,
  CheckCircle,
  X,
  Upload,
  Globe,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Copy,
} from "lucide-react";

const BLOG_CATEGORIES = [
  "Technology",
  "Engineering",
  "Tutorial",
  "Web Development",
  "Cloud & DevOps",
  "Design & UI/UX",
  "Career Growth",
  "Product Updates",
  "General",
];

const AdminBlogs = () => {
  const currentAdmin = getAdmin();

  // Data states
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal & Form states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content"); // "content" | "media" | "seo"
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [authorName, setAuthorName] = useState(currentAdmin?.fullName || "Administrator");
  const [authorTitle, setAuthorTitle] = useState("Lead Developer & Architect");
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(5);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("PUBLISHED");

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  // Rich text editor (remounted per article via `editorKey`; content read through the ref)
  const editorRef = useRef(null);
  const [editorKey, setEditorKey] = useState(0);
  const [editorInitialHtml, setEditorInitialHtml] = useState("");
  const [contentError, setContentError] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);

  /** Uploads an inline editor image to Cloudflare and returns its public URL. */
  const handleEditorImageUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP, GIF, SVG)");
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Images must be 10 MB or smaller");
      return null;
    }
    const toastId = toast.loading("Uploading image…");
    try {
      const res = await adminBlogApi.uploadEditorImage(file);
      const imageUrl = res.data?.url || res.data?.imageUrl;
      if (!imageUrl) throw new Error("No URL returned");
      toast.update(toastId, { render: "Image uploaded", type: "success", isLoading: false, autoClose: 1800 });
      return imageUrl;
    } catch (err) {
      console.error("Editor image upload failed:", err);
      toast.update(toastId, {
        render: err.response?.data?.message || "Failed to upload image. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3500,
      });
      return null;
    }
  }, []);

  // Generate slug automatically from title if user hasn't explicitly set custom slug
  const generateSlugFromTitle = (val) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugManual) {
      setSlug(generateSlugFromTitle(newTitle));
    }
  };

  const handleSlugChange = (e) => {
    setIsSlugManual(true);
    setSlug(e.target.value);
  };

  const resetSlugToTitle = () => {
    setIsSlugManual(false);
    setSlug(generateSlugFromTitle(title));
  };

  // Tag chip handlers
  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Fetch blogs list
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
        sortBy: "createdAt",
        sortDir: "desc",
      };
      if (search.trim()) params.search = search.trim();
      if (categoryFilter !== "ALL") params.category = categoryFilter;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await adminBlogApi.getAll(params);
      const data = res.data;
      setBlogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Failed to load admin blogs:", err);
      toast.error("Failed to fetch blogs from server");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Quick stats calculation
  const stats = {
    total: totalElements,
    published: blogs.filter((b) => (b.status ? b.status === "PUBLISHED" : b.isPublished)).length,
    drafts: blogs.filter((b) => (b.status ? b.status === "DRAFT" : !b.isPublished)).length,
    featured: blogs.filter((b) => b.isFeatured).length,
    totalViews: blogs.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0),
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setSlug("");
    setIsSlugManual(false);
    setSummary("");
    setCategory("Technology");
    setTags(["Spring Boot", "React", "FullStack"]);
    setAuthorName(currentAdmin?.fullName || "Administrator");
    setAuthorTitle("Lead Developer & Architect");
    setAuthorAvatarUrl("");
    setCoverImageUrl("");
    setCoverImageFile(null);
    setCoverPreview("");
    setCoverImageAlt("");
    setYoutubeVideoUrl("");
    setReadingTimeMinutes(5);
    setIsFeatured(false);
    setStatus("PUBLISHED");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setCanonicalUrl("");
    setActiveTab("content");

    setContentError(false);
    setEditorInitialHtml("");
    setEditorKey((k) => k + 1);
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = async (listBlog) => {
    // Always load the latest full article (list rows can be stale or trimmed)
    setLoadingArticle(true);
    let blog = listBlog;
    try {
      const res = await adminBlogApi.getById(listBlog.id);
      blog = res.data || listBlog;
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't load the latest version of this article. Please try again.");
      setLoadingArticle(false);
      return;
    }
    setLoadingArticle(false);
    setIsEditing(true);
    setEditingId(blog.id);
    setTitle(blog.title || "");
    setSlug(blog.slug || "");
    setIsSlugManual(true);
    setSummary(blog.summary || "");
    setCategory(blog.category || "Technology");
    setTags(Array.isArray(blog.tags) ? blog.tags : Array.from(blog.tags || []));
    setAuthorName(blog.authorName || currentAdmin?.fullName || "Administrator");
    setAuthorTitle(blog.authorTitle || "");
    setAuthorAvatarUrl(blog.authorAvatarUrl || "");
    setCoverImageUrl(blog.coverImageUrl || "");
    setCoverImageFile(null);
    setCoverPreview(blog.coverImageUrl || "");
    setCoverImageAlt(blog.coverImageAlt || "");
    setYoutubeVideoUrl(blog.youtubeVideoUrl || "");
    setReadingTimeMinutes(blog.readingTimeMinutes || 5);
    setIsFeatured(Boolean(blog.isFeatured));
    setStatus(blog.status || (blog.isPublished ? "PUBLISHED" : "DRAFT"));
    setMetaTitle(blog.metaTitle || "");
    setMetaDescription(blog.metaDescription || "");
    setMetaKeywords(blog.metaKeywords || "");
    setCanonicalUrl(blog.canonicalUrl || "");
    setActiveTab("content");

    setContentError(false);
    setEditorInitialHtml(blog.content || "");
    setEditorKey((k) => k + 1);
    setShowModal(true);
  };

  // Handle Cover Image file selection
  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setCoverImageFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Submit Save Blog
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!title.trim()) {
      setActiveTab("content");
      toast.error("Article title is required");
      return;
    }
    if (editorRef.current?.isEmpty()) {
      setActiveTab("content");
      setContentError(true);
      editorRef.current?.focus();
      toast.error("Blog content cannot be empty. Please write your article.");
      return;
    }
    if (metaDescription.length > 500) {
      setActiveTab("seo");
      toast.error("SEO meta description must be 500 characters or fewer");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(isEditing ? "Updating blog post…" : "Saving new blog post…");

    try {
      // Upload any pasted base64 images so the article body stays small and CDN-hosted
      const uploadedCount = await editorRef.current.uploadInlineImages();
      if (uploadedCount) toast.update(toastId, { render: `Uploaded ${uploadedCount} inline image(s)… saving` });
      const htmlContent = editorRef.current.getHTML();

      const formData = new FormData();
      const put = (key, value) => formData.append(key, value == null ? "" : String(value).trim());

      put("title", title);
      put("slug", slug.trim() || generateSlugFromTitle(title));
      formData.append("content", htmlContent);
      // Optional fields are ALWAYS sent (possibly empty) so that clearing a value is persisted on update
      put("summary", summary);
      put("category", category);
      put("authorName", authorName);
      put("authorTitle", authorTitle);
      put("authorAvatarUrl", authorAvatarUrl);
      put("coverImageAlt", coverImageAlt);
      put("youtubeVideoUrl", youtubeVideoUrl);
      if (readingTimeMinutes) put("readingTimeMinutes", parseInt(readingTimeMinutes, 10) || "");
      put("isPublished", status === "PUBLISHED");
      put("isFeatured", isFeatured);
      put("status", status);

      // Tags: an empty value tells the server to clear all tags
      if (tags.length) tags.forEach((tag) => formData.append("tags", tag));
      else formData.append("tags", "");

      put("metaTitle", metaTitle);
      put("metaDescription", metaDescription);
      put("metaKeywords", metaKeywords);
      put("canonicalUrl", canonicalUrl);

      // Cover image: new file > URL > explicitly removed ("")
      if (coverImageFile) formData.append("coverImageFile", coverImageFile);
      else put("coverImageUrl", coverImageUrl);

      if (isEditing) {
        await adminBlogApi.update(editingId, formData);
      } else {
        await adminBlogApi.create(formData);
      }
      toast.update(toastId, {
        render: isEditing ? "Blog updated successfully!" : status === "PUBLISHED" ? "Blog post published!" : "Blog post saved as draft",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });

      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      console.error("Save blog error:", err);
      const data = err.response?.data;
      const fieldError = Array.isArray(data?.validationErrors) && data.validationErrors.length
        ? `${data.validationErrors[0].field}: ${data.validationErrors[0].message}`
        : null;
      const errMsg =
        err.response?.status === 413
          ? "The article or cover image is too large. Use smaller images."
          : fieldError || data?.message || (!err.response ? "Can't reach the server. Check your connection." : err.message) || "Failed to save blog post";
      toast.update(toastId, { render: errMsg, type: "error", isLoading: false, autoClose: 5000 });
    } finally {
      setSaving(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (blog) => {
    try {
      const res = await adminBlogApi.togglePublish(blog.id);
      const updated = res.data;
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      toast.success(
        updated.isPublished ? `"${updated.title}" is now PUBLISHED live!` : `"${updated.title}" reverted to DRAFT.`
      );
    } catch (err) {
      console.error("Toggle publish failed:", err);
      toast.error("Failed to toggle publish status");
    }
  };

  // Toggle Featured
  const handleToggleFeature = async (blog) => {
    try {
      const res = await adminBlogApi.toggleFeature(blog.id);
      const updated = res.data;
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      toast.success(
        updated.isFeatured
          ? `Pinned "${updated.title}" as featured article!`
          : `Removed featured tag from "${updated.title}".`
      );
    } catch (err) {
      console.error("Toggle feature failed:", err);
      toast.error("Failed to toggle feature status");
    }
  };

  // Delete Blog Confirm
  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await adminBlogApi.delete(blogToDelete.id);
      toast.success("Blog article deleted successfully");
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (err) {
      console.error("Delete blog failed:", err);
      toast.error("Failed to delete article");
    }
  };

  // Copy Public Blog URL
  const copyPublicUrl = (slug) => {
    const url = `${window.location.origin}/blogs/${slug}`;
    navigator.clipboard.writeText(url);
    toast.info("Public link copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 p-6 rounded-2xl border border-slate-200/60 backdrop-blur-sm shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <BookOpen size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  Blogs & Editorial Management
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Author, edit, publish rich-text articles, track views, and manage YouTube embeds.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={fetchBlogs}
              disabled={loading}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-emerald-500" : ""} />
            </button>
            <button
              onClick={openCreateModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all cursor-pointer transform active:scale-95"
            >
              <Plus size={16} />
              <span>Create New Blog</span>
            </button>
          </div>
        </div>

        {/* Top Analytics Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Posts</p>
              <p className="text-xl font-black text-slate-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published</p>
              <p className="text-xl font-black text-teal-600">{stats.published}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Drafts</p>
              <p className="text-xl font-black text-amber-600">{stats.drafts}</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Star size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Featured</p>
              <p className="text-xl font-black text-purple-600">{stats.featured}</p>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Views</p>
              <p className="text-xl font-black text-blue-600">{stats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by title, slug, or content..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Drafts Only</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Blog Table / Card Listing */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="animate-spin text-emerald-500 mb-3" size={28} />
              <p className="text-xs font-bold text-slate-600">Loading articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <BookOpen size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No blog posts found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4 font-medium">
                {search || categoryFilter !== "ALL" || statusFilter !== "ALL"
                  ? "No articles matched your active search query or filter."
                  : "Start growing your brand by publishing your first article."}
              </p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                <Plus size={14} />
                Create Blog Post
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Read Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {blogs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Title & Cover */}
                      <td className="py-3.5 px-4 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                            {b.coverImageUrl ? (
                              <img
                                src={b.coverImageUrl}
                                alt={b.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <ImageIcon size={18} className="text-slate-300" />
                            )}
                            {b.youtubeVideoUrl && (
                              <div
                                className="absolute bottom-0.5 right-0.5 bg-red-600 text-white p-0.5 rounded-sm"
                                title="YouTube Video Attached"
                              >
                                <Video size={10} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-800 text-xs truncate group-hover:text-emerald-600 transition-colors">
                                {b.title}
                              </p>
                              {b.isFeatured && (
                                <span
                                  className="text-amber-500 flex-shrink-0"
                                  title="Featured Article on Homepage"
                                >
                                  <Star size={12} className="fill-amber-400" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                                /{b.slug}
                              </span>
                              <button
                                onClick={() => copyPublicUrl(b.slug)}
                                className="text-slate-300 hover:text-emerald-500 transition-colors"
                                title="Copy public link"
                              >
                                <Copy size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                          {b.category || "General"}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {b.authorName || "Administrator"}
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <Eye size={13} className="text-slate-400" />
                          <span>{(b.viewsCount || 0).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Read Time */}
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {b.readingTimeMinutes || 1} min
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                            b.status === "PUBLISHED" || b.isPublished
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : b.status === "ARCHIVED"
                              ? "bg-slate-100 text-slate-500 border border-slate-200"
                              : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              b.status === "PUBLISHED" || b.isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                            }`}
                          />
                          {b.status || (b.isPublished ? "PUBLISHED" : "DRAFT")}
                        </span>
                      </td>

                      {/* Published Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-semibold text-[11px]">
                        {b.publishedAt
                          ? new Date(b.publishedAt).toLocaleDateString()
                          : b.createdAt
                          ? new Date(b.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Feature */}
                          <button
                            onClick={() => handleToggleFeature(b)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              b.isFeatured
                                ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                                : "border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200"
                            }`}
                            title={b.isFeatured ? "Unpin featured" : "Pin as featured"}
                          >
                            <Star size={14} className={b.isFeatured ? "fill-amber-400" : ""} />
                          </button>

                          {/* Toggle Publish */}
                          <button
                            onClick={() => handleTogglePublish(b)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              b.isPublished
                                ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                                : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                            }`}
                            title={b.isPublished ? "Unpublish to Draft" : "Publish Live"}
                          >
                            {b.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Edit article"
                          >
                            <Edit3 size={14} />
                          </button>

                          {/* View public */}
                          <a
                            href={`/blogs/${b.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 transition-colors"
                            title="View on website"
                          >
                            <ExternalLink size={14} />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setBlogToDelete(b);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/50">
              <span>
                Page {page + 1} of {totalPages} ({totalElements} articles total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {loadingArticle && (
        <div className="fixed inset-0 z-[70] bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center" role="status" aria-live="polite">
          <div className="bg-white rounded-2xl px-5 py-4 shadow-xl text-sm font-semibold text-slate-700 flex items-center gap-3">
            <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Loading article…
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base sm:text-lg">
                    {isEditing ? "Edit Blog Article" : "Create New Blog Article"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Configure rich content, YouTube media embed, cover image, and SEO meta tags.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 border-b border-slate-100 flex gap-4 bg-white text-xs font-bold flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "content"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <FileText size={15} />
                Content & Body
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "media"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <ImageIcon size={15} />
                Cover & Media
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "seo"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Globe size={15} />
                SEO & Publishing
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveBlog} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              <div className={activeTab === "content" ? "space-y-4" : "hidden"}>
                  {/* Title & Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Article Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Modern Full-Stack Development with Spring Boot & Next.js in 2026"
                      value={title}
                      onChange={handleTitleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Slug Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        URL Slug <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={resetSlugToTitle}
                        className="text-[11px] text-emerald-600 font-bold hover:underline"
                      >
                        Auto-generate from title
                      </button>
                    </div>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                      <span className="text-slate-400 font-mono select-none">/blogs/</span>
                      <input
                        type="text"
                        required
                        placeholder="modern-full-stack-development"
                        value={slug}
                        onChange={handleSlugChange}
                        className="w-full bg-transparent font-mono text-slate-800 font-semibold focus:outline-none pl-1"
                      />
                    </div>
                  </div>

                  {/* Category & Read Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                      >
                        {BLOG_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Est. Read Time (Minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={readingTimeMinutes}
                        onChange={(e) => setReadingTimeMinutes(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Summary / Excerpt */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Summary / Card Excerpt
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {summary.length}/500 chars (auto-generated if empty)
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={500}
                      placeholder="Brief excerpt displayed on blog cards, search engine cards, and meta tags..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Rich Text Editor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Article Content Description <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Tip: use the image button, or drag & drop / paste images — they upload to Cloudflare automatically.
                      </span>
                    </div>
                    <RichTextEditor
                      key={editorKey}
                      ref={editorRef}
                      initialHtml={editorInitialHtml}
                      onImageUpload={handleEditorImageUpload}
                      onChange={() => contentError && setContentError(false)}
                      invalid={contentError}
                      placeholder="Write your detailed blog post content here with rich formatting..."
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Tags (Press Enter or comma to add)
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-rose-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add tag and hit Enter..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none flex-1 min-w-[120px]"
                      />
                    </div>
                  </div>
              </div>

              {activeTab === "media" && (
                <div className="space-y-5">
                  {/* Cover Image Upload / URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Cover Hero Image (Cloudflare R2 / S3)
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Direct File Upload */}
                      <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all">
                        <Upload size={24} className="text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-700">Click to upload cover image</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverFileChange}
                        />
                      </label>

                      {/* Direct External URL */}
                      <div className="space-y-2">
                        <input
                          type="url"
                          placeholder="Or paste external CDN image URL..."
                          value={coverImageUrl}
                          onChange={(e) => {
                            setCoverImageUrl(e.target.value);
                            setCoverPreview(e.target.value);
                            setCoverImageFile(null);
                          }}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Cover image accessibility ALT text..."
                          value={coverImageAlt}
                          onChange={(e) => setCoverImageAlt(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Preview Box */}
                    {coverPreview && (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-900 flex items-center justify-center">
                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="w-full h-48 object-cover opacity-90"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverPreview("");
                            setCoverImageUrl("");
                            setCoverImageFile(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* YouTube Video Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                        <Video size={16} />
                      </div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        YouTube Video URL (Optional)
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Paste standard (watch?v=), short (youtu.be), or shorts links. The platform will automatically convert it into an interactive responsive video embed.
                    </p>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeVideoUrl}
                      onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                    />

                    {/* YouTube Embed Preview */}
                    {youtubeVideoUrl && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Video Player Embed Preview
                        </p>
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md">
                          <iframe
                            src={
                              youtubeVideoUrl.includes("embed")
                                ? youtubeVideoUrl
                                : youtubeVideoUrl.includes("youtu.be/")
                                ? `https://www.youtube.com/embed/${youtubeVideoUrl.split("youtu.be/")[1]?.split("?")[0]}`
                                : youtubeVideoUrl.includes("watch?v=")
                                ? `https://www.youtube.com/embed/${youtubeVideoUrl.split("watch?v=")[1]?.split("&")[0]}`
                                : youtubeVideoUrl
                            }
                            title="YouTube Preview"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Author Information */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Author Attribution
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Author Name</span>
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="e.g. Sathya Prakash"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Author Professional Title</span>
                        <input
                          type="text"
                          value={authorTitle}
                          onChange={(e) => setAuthorTitle(e.target.value)}
                          placeholder="e.g. Principal Cloud Architect"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">Author Avatar URL</span>
                        <input
                          type="url"
                          value={authorAvatarUrl}
                          onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-4">
                  {/* Status & Featured Settings */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                        Publication Lifecycle Status
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Choose whether to publish immediately on the website or save as draft.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setStatus(newStatus);
                        }}
                        className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="PUBLISHED">Published (Public)</option>
                        <option value="DRAFT">Draft (Admin Only)</option>
                        <option value="ARCHIVED">Archived (Hidden)</option>
                      </select>

                      <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200 select-none">
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Star size={13} className={isFeatured ? "text-amber-500 fill-amber-400" : "text-slate-400"} />
                          Featured Hero
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* SEO Meta Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      placeholder="Defaults to article title if omitted"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* SEO Meta Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Defaults to summary excerpt if omitted"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* SEO Meta Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      SEO Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="spring boot, react 19, tailwind css, portfolio maker"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Canonical URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://bytebodh.in/blogs/..."
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      {isEditing ? "Update Article" : "Publish Article"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && blogToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">Delete Blog Article?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-slate-800">"{blogToDelete.title}"</span>? This will also remove the cover image from storage and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setBlogToDelete(null);
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminBlogs;

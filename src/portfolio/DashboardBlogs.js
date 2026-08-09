import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import {
  getMyBlogs,
  createBlog,
  updateBlog,
  deleteUserBlog,
} from "../api/profileService";
import { toast } from "react-toastify";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Image as ImageIcon,
  Calendar,
  Loader,
  FileText,
  Eye,
  ArrowLeft,
} from "lucide-react";
import DOMPurify from "dompurify";

/* ─── Quill toolbar config ────────────────────────────────────── */
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};
const QUILL_FORMATS = [
  "header", "bold", "italic", "underline", "strike",
  "color", "background",
  "list", "indent", "align",
  "blockquote", "code-block",
  "link", "image",
];

/* ─── blank form ──────────────────────────────────────────────── */
const BLANK = { title: "", tags: "" };

/* ─── date formatters & helpers ────────────────────────────── */
const getCreatedTime = (blog) => blog?.createdTime || blog?.createdAt;
const getUpdatedTime = (blog) => blog?.updatedTime || blog?.updatedAt;

const fmt = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fmtDateTime = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ═══════════════════════════════════════════════════════════════ */
export default function DashboardBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* modal / editor */
  const [mode, setMode] = useState(null); // null | 'editor' | 'preview'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null); // blog to preview

  const fileInputRef = useRef(null);

  /* ── Quill setup ────────────────────────────────────────────── */
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: QUILL_MODULES,
    formats: QUILL_FORMATS,
    placeholder: "Start writing your blog post here…",
  });

  /* populate Quill when editing */
  useEffect(() => {
    if (quill && mode === "editor") {
      const html = editing?.content || "";
      quill.clipboard.dangerouslyPasteHTML(html);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, mode]);

  /* ── fetch ──────────────────────────────────────────────────── */
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyBlogs();
      setBlogs(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load your blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* ── open editor ─────────────────────────────────────────────── */
  const openCreate = () => {
    setEditing(null);
    setForm(BLANK);
    setImageFile(null);
    setImagePreview(null);
    setMode("editor");
  };

  const openEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title || "",
      tags: Array.isArray(blog.tags)
        ? blog.tags.join(", ")
        : blog.tags || "",
    });
    setImageFile(null);
    setImagePreview(blog.imageUrl || blog.image || null);
    setMode("editor");
  };

  const openPreview = (blog) => {
    setPreviewBlog(blog);
    setMode("preview");
  };

  const closeAll = () => {
    setMode(null);
    setEditing(null);
    setPreviewBlog(null);
    setImageFile(null);
    setImagePreview(null);
  };

  /* ── image picker ────────────────────────────────────────────── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ── submit ──────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const htmlContent = quill?.root?.innerHTML || "";
    const textOnly = quill?.getText()?.trim() || "";
    if (!textOnly) { toast.error("Content is required"); return; }

    try {
      setSaving(true);
      const fd = new FormData();
      const blogBlob = new Blob(
        [
          JSON.stringify({
            title: form.title,
            content: htmlContent,
            tags: form.tags
              ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
              : [],
          }),
        ],
        { type: "application/json" }
      );
      fd.append("blog", blogBlob);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await updateBlog(editing.id, fd);
        toast.success("Blog updated!");
      } else {
        await createBlog(fd);
        toast.success("Blog published!");
      }
      closeAll();
      fetchBlogs();
    } catch (err) {
      if (err.response?.status === 402) {
        toast.error(
          <div>
            <p className="font-bold text-sm">
              {err.response?.data?.message || "An active subscription is required to publish blogs."}
            </p>
            <button
              onClick={() => navigate("/subscription")}
              className="mt-1.5 text-xs font-black underline cursor-pointer"
            >
              Subscribe now →
            </button>
          </div>,
          { autoClose: 8000 }
        );
      } else {
        toast.error(err.response?.data?.message || "Failed to save blog");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ──────────────────────────────────────────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      await deleteUserBlog(id);
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── derived ─────────────────────────────────────────────────── */
  const filtered = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ════════════════════════════════════════════════════════════════
     FULL-SCREEN EDITOR
  ════════════════════════════════════════════════════════════════ */
  if (mode === "editor") {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* top bar */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <button
            onClick={closeAll}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h2 className="text-base font-black text-slate-800 hidden sm:block">
            {editing ? "Edit Blog" : "Write New Blog"}
          </h2>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <><Loader className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              editing ? "Save Changes" : "Publish"
            )}
          </button>
        </div>

        {/* two-column layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* ── LEFT: meta sidebar ─────────────────────── */}
          <aside className="w-full lg:w-72 xl:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex-shrink-0 overflow-y-auto">
            <div className="p-5 space-y-5">
              {/* title */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Blog Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Give your blog a great title…"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
              </div>

              {/* tags */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Tags <span className="text-slate-400 font-semibold normal-case tracking-normal">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="java, spring, microservices"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
                />
                {form.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {form.tags.split(",").filter(t => t.trim()).map((t, i) => (
                      <span key={i} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* cover image */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Cover Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-emerald-400 transition-colors text-center"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="cover preview"
                      className="mx-auto max-h-32 rounded-xl object-cover w-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <ImageIcon className="w-7 h-7 text-slate-300" />
                      <p className="text-xs font-bold text-slate-400">Click to upload</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="mt-2 text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    ✕ Remove image
                  </button>
                )}
              </div>

              {/* tips */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">✍️ Writing Tips</p>
                <ul className="space-y-1.5 text-[11px] font-semibold text-amber-700 list-disc list-inside">
                  <li>Use H2/H3 headings to structure content</li>
                  <li>Add code blocks for technical posts</li>
                  <li>Use bullet lists for clarity</li>
                  <li>Keep paragraphs short and scannable</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* ── RIGHT: Quill editor ─────────────────────── */}
          <main className="flex-1 flex flex-col overflow-hidden bg-white">
            <style>{`
              .ql-container { font-size: 15px; font-family: 'Inter', sans-serif; border: none !important; flex: 1; overflow-y: auto; }
              .ql-toolbar { border-top: none !important; border-left: none !important; border-right: none !important; border-bottom: 1px solid #e2e8f0 !important; background: #f8fafc; padding: 10px 16px !important; flex-shrink: 0; }
              .ql-editor { padding: 32px 40px; min-height: calc(100vh - 120px); line-height: 1.8; color: #1e293b; }
              .ql-editor p { margin-bottom: 1em; }
              .ql-editor h1 { font-size: 2em; font-weight: 900; margin-bottom: 0.5em; color: #0f172a; }
              .ql-editor h2 { font-size: 1.5em; font-weight: 800; margin-bottom: 0.5em; color: #1e293b; }
              .ql-editor h3 { font-size: 1.2em; font-weight: 700; margin-bottom: 0.5em; color: #334155; }
              .ql-editor blockquote { border-left: 4px solid #10b981; padding-left: 16px; color: #475569; font-style: italic; margin: 1.5em 0; background: #f0fdf4; border-radius: 0 12px 12px 0; }
              .ql-editor pre.ql-syntax { background: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 16px 20px; font-size: 13px; }
              .ql-editor img { border-radius: 12px; max-width: 100%; margin: 1em 0; }
              .ql-editor ul, .ql-editor ol { padding-left: 1.5em; margin-bottom: 1em; }
              .ql-editor a { color: #10b981; text-decoration: underline; }
              .ql-editor .ql-size-large { font-size: 1.5em; }
              .ql-snow .ql-picker.ql-header .ql-picker-label::before,
              .ql-snow .ql-picker.ql-header .ql-picker-item::before { content: 'Normal'; }
              .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
              .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before { content: 'Heading 1'; }
              .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
              .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before { content: 'Heading 2'; }
              .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
              .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before { content: 'Heading 3'; }
            `}</style>
            <div ref={quillRef} className="flex-1 overflow-y-auto" />
          </main>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     FULL-SCREEN PREVIEW
  ════════════════════════════════════════════════════════════════ */
  if (mode === "preview" && previewBlog) {
    const safeHtml = DOMPurify.sanitize(previewBlog.content || "");
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={closeAll}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Preview</span>
          <button
            onClick={() => openEdit(previewBlog)}
            className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <article className="max-w-3xl mx-auto px-6 py-12">
            {(previewBlog.imageUrl || previewBlog.image) && (
              <img
                src={previewBlog.imageUrl || previewBlog.image}
                alt={previewBlog.title}
                className="w-full h-64 object-cover rounded-3xl mb-8 shadow-lg"
              />
            )}
            {previewBlog.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(Array.isArray(previewBlog.tags) ? previewBlog.tags : previewBlog.tags.split(","))
                  .filter(t => t.toString().trim())
                  .map((tag, i) => (
                    <span key={i} className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {tag.toString().trim()}
                    </span>
                  ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
              {previewBlog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mb-8 pb-6 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span><strong>Created:</strong> {fmtDateTime(getCreatedTime(previewBlog))}</span>
              </span>
              {getUpdatedTime(previewBlog) && (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span>• <strong>Updated:</strong> {fmtDateTime(getUpdatedTime(previewBlog))}</span>
                </span>
              )}
            </div>
            <div
              className="prose prose-slate max-w-none blog-preview-content"
              style={{ lineHeight: "1.85", color: "#334155", fontSize: "15px" }}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </article>
        </div>

        <style>{`
          .blog-preview-content h1 { font-size: 2em; font-weight: 900; margin: 1em 0 0.5em; color: #0f172a; }
          .blog-preview-content h2 { font-size: 1.5em; font-weight: 800; margin: 1em 0 0.5em; color: #1e293b; }
          .blog-preview-content h3 { font-size: 1.2em; font-weight: 700; margin: 1em 0 0.5em; color: #334155; }
          .blog-preview-content p { margin-bottom: 1em; }
          .blog-preview-content blockquote { border-left: 4px solid #10b981; padding: 12px 20px; background: #f0fdf4; border-radius: 0 12px 12px 0; margin: 1.5em 0; font-style: italic; color: #475569; }
          .blog-preview-content pre { background: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 16px 20px; overflow-x: auto; font-size: 13px; margin: 1.5em 0; }
          .blog-preview-content code { background: #f1f5f9; color: #e11d48; padding: 2px 6px; border-radius: 6px; font-size: 13px; }
          .blog-preview-content pre code { background: transparent; color: inherit; padding: 0; }
          .blog-preview-content ul, .blog-preview-content ol { padding-left: 1.5em; margin-bottom: 1em; }
          .blog-preview-content li { margin-bottom: 0.4em; }
          .blog-preview-content a { color: #10b981; text-decoration: underline; }
          .blog-preview-content img { border-radius: 12px; max-width: 100%; margin: 1.5em 0; }
          .blog-preview-content strong { font-weight: 800; color: #1e293b; }
        `}</style>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     MAIN BLOGS LIST
  ════════════════════════════════════════════════════════════════ */
  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn text-left">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-16 -left-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-60 h-60 rounded-full bg-teal-500/10 blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">My Blogs</h1>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Write, edit and manage your personal blog posts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={fetchBlogs}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all cursor-pointer text-white active:scale-95"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Blog
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Blogs", value: blogs.length, icon: <FileText className="w-5 h-5 text-slate-400" />, color: "text-slate-800" },
          {
            label: "This Month",
            value: blogs.filter((b) => {
              const d = new Date(getCreatedTime(b) || "");
              const now = new Date();
              return !isNaN(d.getTime()) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length,
            icon: <Calendar className="w-5 h-5 text-emerald-500" />,
            color: "text-emerald-600",
          },
          {
            label: "With Images",
            value: blogs.filter((b) => b.imageUrl || b.image).length,
            icon: <ImageIcon className="w-5 h-5 text-teal-500" />,
            color: "text-teal-600",
          },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</span>
              <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 bg-slate-50">
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search your blogs…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* ── Blog grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-sm">Loading your blogs…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">📝</div>
            <h3 className="text-lg font-black text-slate-800">
              {searchTerm ? "No matching blogs" : "No blogs yet"}
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm text-center">
              {searchTerm ? "Try a different search term." : 'Click "New Blog" to write your first post.'}
            </p>
            {!searchTerm && (
              <button
                onClick={openCreate}
                className="mt-5 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Write First Blog
              </button>
            )}
          </div>
        ) : (
          filtered.map((blog) => (
            <div
              key={blog.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
            >
              {/* cover */}
              <div className="relative h-44 bg-slate-100 overflow-hidden flex-shrink-0">
                {blog.imageUrl || blog.image ? (
                  <img
                    src={blog.imageUrl || blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <BookOpen className="text-white/50 w-10 h-10" />
                  </div>
                )}
                {/* hover action badges */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openPreview(blog)}
                    className="p-1.5 bg-white rounded-lg shadow-md text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEdit(blog)}
                    className="p-1.5 bg-white rounded-lg shadow-md text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="p-1.5 bg-white rounded-lg shadow-md text-slate-700 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    {deletingId === blog.id ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-500" />
                    Created: {fmt(getCreatedTime(blog))}
                  </span>
                  {getUpdatedTime(blog) && (
                    <span className="text-slate-400">
                      • Updated: {fmt(getUpdatedTime(blog))}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                  {blog.title}
                </h3>

                <p className="text-slate-500 text-xs font-semibold line-clamp-3 flex-1 leading-relaxed">
                  {(blog.content || "").replace(/<[^>]+>/g, "").substring(0, 150) || "No content preview available."}
                </p>

                {/* tags */}
                {blog.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(","))
                      .slice(0, 3)
                      .filter(t => t.toString().trim())
                      .map((tag, i) => (
                        <span key={i} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {tag.toString().trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* footer */}
                <div className="pt-4 border-t border-slate-100 mt-3 flex gap-2">
                  <button
                    onClick={() => openPreview(blog)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-100 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => openEdit(blog)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 py-2 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import {
  FaArrowRight,
  FaSearch,
  FaTag,
  FaSpinner,
  FaEye,
  FaClock,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { blogApi } from "../api/blogs";

const FALLBACK_BLOGS = [
  {
    id: "f1",
    slug: "build-perfect-developer-portfolio",
    title: "How to Build a Perfect Developer Portfolio in 2026",
    category: "Career Growth",
    authorName: "Sathya Prakash",
    createdAt: "2026-05-15T08:00:00.000Z",
    publishedAt: "2026-05-15T08:00:00.000Z",
    summary: "Learn the essential components of a software engineer portfolio that captures recruiters' attention. From project presentations to live demo links, here is a complete blueprint.",
    readingTimeMinutes: 6,
    viewsCount: 1420,
    hasVideo: false,
    coverImageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "f2",
    slug: "demystifying-ats-resume-screeners",
    title: "Demystifying ATS: How to Make Your Resume Machine-Readable",
    category: "Career Growth",
    authorName: "Rohan Deshmukh",
    createdAt: "2026-06-02T10:30:00.000Z",
    publishedAt: "2026-06-02T10:30:00.000Z",
    summary: "Applicant Tracking Systems (ATS) filter out over 70% of resumes before a human recruiter even sees them. Understand how they parse text and how to optimize your resume templates.",
    readingTimeMinutes: 5,
    viewsCount: 890,
    hasVideo: false,
    coverImageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "f3",
    slug: "guide-to-writing-clean-react-code",
    title: "The Ultimate Guide to Writing Clean React Code",
    category: "Technology",
    authorName: "ByteBodh Engineering",
    createdAt: "2026-06-18T14:15:00.000Z",
    publishedAt: "2026-06-18T14:15:00.000Z",
    summary: "Explore best practices in React web development. Learn about clean component architectures, state management patterns, custom hook design, and code splitting techniques.",
    readingTimeMinutes: 8,
    viewsCount: 2310,
    hasVideo: true,
    coverImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "f4",
    slug: "leveraging-qr-analytics-for-networking",
    title: "Leveraging QR Code Analytics for Modern Professional Networking",
    category: "Tutorial",
    authorName: "Aisha Sen",
    createdAt: "2026-06-25T11:00:00.000Z",
    publishedAt: "2026-06-25T11:00:00.000Z",
    summary: "How adding dynamic QR codes to your physical resume or business card can help you track recruiter interest, view click analytics, and stand out in hiring drives.",
    readingTimeMinutes: 4,
    viewsCount: 650,
    hasVideo: false,
    coverImageUrl: "https://images.unsplash.com/photo-1595079672139-cee470784f0b?auto=format&fit=crop&w=1200&q=80",
  },
];

function Blog() {
  useSEO({
    title: "Blog | ByteBodh - Tutorials, Tech Guides & Career Tips",
    description: "Browse the latest tech articles, web development tutorials, and career branding guides. Learn how to write clean React code, build portfolios, and optimize CVs.",
    keywords: "coding articles, react tutorial, developer career guides, resume tips, bytebodh blog, portfolio guide, developer branding, career growth tips, tech tutorials",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch blogs from API
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 9,
        sortBy: "publishedAt",
        sortDir: "desc",
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== "ALL") params.category = selectedCategory;

      const res = await blogApi.getPublishedBlogs(params);
      const data = res.data;
      const content = data.content || (Array.isArray(data) ? data : []);

      if (content.length > 0) {
        setBlogs(content);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalElements || content.length);
      } else if (page === 0 && !searchTerm && selectedCategory === "ALL") {
        setBlogs(FALLBACK_BLOGS);
        setTotalPages(1);
        setTotalCount(FALLBACK_BLOGS.length);
      } else {
        setBlogs([]);
        setTotalPages(0);
        setTotalCount(0);
      }
    } catch (err) {
      console.warn("Backend blog query fallback:", err.message);
      if (page === 0 && !searchTerm && selectedCategory === "ALL") {
        setBlogs(FALLBACK_BLOGS);
        setTotalCount(FALLBACK_BLOGS.length);
      } else {
        setBlogs([]);
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Fetch categories, featured, and recent blogs on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsRes, featRes, recRes] = await Promise.allSettled([
          blogApi.getCategories(),
          blogApi.getFeaturedBlogs(),
          blogApi.getRecentBlogs(5),
        ]);

        if (catsRes.status === "fulfilled" && Array.isArray(catsRes.value.data) && catsRes.value.data.length > 0) {
          setCategories(catsRes.value.data);
        } else {
          setCategories([
            { category: "Technology", count: 4 },
            { category: "Engineering", count: 3 },
            { category: "Career Growth", count: 5 },
            { category: "Tutorial", count: 2 },
          ]);
        }

        if (featRes.status === "fulfilled" && Array.isArray(featRes.value.data) && featRes.value.data.length > 0) {
          setFeaturedBlogs(featRes.value.data);
        }

        if (recRes.status === "fulfilled" && Array.isArray(recRes.value.data) && recRes.value.data.length > 0) {
          setRecentBlogs(recRes.value.data);
        }
      } catch (err) {
        console.warn("Could not load blog metadata:", err);
      }
    };
    fetchMetadata();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchBlogs();
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(0);
  };

  // Main featured hero article (from featured list or first blog)
  const heroArticle = featuredBlogs.length > 0 ? featuredBlogs[0] : blogs[0];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ByteBodh Editorial & Guides</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900 tracking-tight">
            Knowledge Base &{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Tech Insights
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Deep-dive tutorials, career roadmaps, portfolio design patterns, and engineering insights crafted by professionals.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 p-2 group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <FaSearch className="text-slate-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search articles, tutorials, technologies..."
                className="flex-1 py-3 px-2 text-slate-800 focus:outline-none bg-transparent text-sm font-semibold placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => handleCategorySelect("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              All Articles
            </button>
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => handleCategorySelect(c.category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === c.category
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                <span>{c.category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    selectedCategory === c.category ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spotlight Card (if present and page === 0 without search) */}
      {heroArticle && page === 0 && !searchTerm && selectedCategory === "ALL" && (
        <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 mb-12">
          <Link
            to={`/blogs/${heroArticle.slug}`}
            className="group block bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden hover:border-emerald-300 transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden bg-slate-900">
                {heroArticle.coverImageUrl ? (
                  <img
                    src={heroArticle.coverImageUrl}
                    alt={heroArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-8">
                    <span className="text-white font-black text-2xl tracking-tight text-center">
                      {heroArticle.title}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md">
                    Featured Spotlight
                  </span>
                  {heroArticle.hasVideo && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-md flex items-center gap-1">
                      <FaYoutube /> Video Included
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                    <span className="text-emerald-600 font-bold uppercase tracking-wider">
                      {heroArticle.category || "Technology"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaClock className="text-slate-300" />
                      {heroArticle.readingTimeMinutes || 5} min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaEye className="text-slate-300" />
                      {(heroArticle.viewsCount || 0).toLocaleString()} views
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                    {heroArticle.title}
                  </h2>

                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                    {heroArticle.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {heroArticle.authorName?.charAt(0) || "B"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{heroArticle.authorName || "ByteBodh Editorial"}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {heroArticle.publishedAt
                          ? new Date(heroArticle.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently Published"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    Read Story <FaArrowRight size={11} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Main Content + Sidebar Layout */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 8 Cols: Blog Post Grid */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedCategory === "ALL" ? "Latest Articles" : `${selectedCategory} Articles`}
                </h3>
                <span className="text-xs text-slate-400 font-bold">
                  {totalCount} {totalCount === 1 ? "article" : "articles"}
                </span>
              </div>

              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                  <FaSpinner className="animate-spin text-emerald-500 text-3xl mb-3" />
                  <p className="text-sm font-bold text-slate-600">Fetching published articles...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-200/80 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                    <FaTag size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-1">No articles found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Try searching with different keywords or switch categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("ALL");
                    }}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.map((b) => (
                    <Link
                      key={b.id || b.slug}
                      to={`/blogs/${b.slug}`}
                      className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      {/* Card Cover */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        {b.coverImageUrl ? (
                          <img
                            src={b.coverImageUrl}
                            alt={b.coverImageAlt || b.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center p-4">
                            <span className="text-white font-bold text-sm text-center line-clamp-2">
                              {b.title}
                            </span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
                            {b.category || "Article"}
                          </span>
                          {b.hasVideo && (
                            <span className="p-1 rounded-lg bg-red-600 text-white shadow-sm flex items-center" title="Video included">
                              <FaYoutube size={12} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                            <span className="flex items-center gap-1">
                              <FaClock size={11} className="text-slate-300" />
                              {b.readingTimeMinutes || 5} min read
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FaEye size={11} className="text-slate-300" />
                              {(b.viewsCount || 0).toLocaleString()} views
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                            {b.title}
                          </h4>

                          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                            {b.summary}
                          </p>
                        </div>

                        {/* Card Author & Date Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-emerald-600 font-bold flex items-center justify-center text-[10px]">
                              {b.authorName?.charAt(0) || "B"}
                            </div>
                            <span className="text-slate-700 font-bold text-xs truncate max-w-[120px]">
                              {b.authorName || "ByteBodh"}
                            </span>
                          </div>

                          <span className="text-[10px] font-semibold text-slate-400">
                            {b.publishedAt
                              ? new Date(b.publishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Recent"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-6 flex items-center justify-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => {
                      setPage((p) => Math.max(0, p - 1));
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-500">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => {
                      setPage((p) => p + 1);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-6">
              {/* Category Widget */}
              <div className="bg-slate-50/60 rounded-3xl border border-slate-200/80 p-6 space-y-4">
                <h4 className="text-base font-black text-slate-900 border-b border-slate-200/60 pb-3">
                  Categories
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleCategorySelect("ALL")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === "ALL"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "hover:bg-white text-slate-700"
                    }`}
                  >
                    <span>All Articles</span>
                    <span className="text-[10px] opacity-80">{totalCount}</span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.category}
                      onClick={() => handleCategorySelect(c.category)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === c.category
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "hover:bg-white text-slate-700"
                      }`}
                    >
                      <span>{c.category}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md ${
                          selectedCategory === c.category ? "bg-white/20 text-white" : "bg-slate-200/60 text-slate-600"
                        }`}
                      >
                        {c.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Articles Widget */}
              {recentBlogs.length > 0 && (
                <div className="bg-slate-50/60 rounded-3xl border border-slate-200/80 p-6 space-y-4">
                  <h4 className="text-base font-black text-slate-900 border-b border-slate-200/60 pb-3">
                    Recent Stories
                  </h4>
                  <div className="space-y-3">
                    {recentBlogs.map((post) => (
                      <Link
                        key={post.id || post.slug}
                        to={`/blogs/${post.slug}`}
                        className="group flex items-start gap-3 p-2 rounded-xl hover:bg-white transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                          {post.coverImageUrl ? (
                            <img
                              src={post.coverImageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                              {post.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString()
                              : "Recent"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Banner */}
              <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 space-y-3">
                <h4 className="text-lg font-black tracking-tight">Stay Ahead with ByteBodh</h4>
                <p className="text-xs text-emerald-50 font-medium leading-relaxed">
                  Join 100+ developers receiving monthly engineering guides and career strategies.
                </p>
                <div className="space-y-2 pt-2">
                  <input
                    type="email"
                    placeholder="Enter your email..."
                    className="w-full px-3.5 py-2.5 bg-white/15 placeholder-white/60 text-white rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white border border-white/20"
                  />
                  <button
                    onClick={() => alert("Thank you for subscribing to ByteBodh!")}
                    className="w-full bg-white text-emerald-600 font-black py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-md text-xs cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Blog;

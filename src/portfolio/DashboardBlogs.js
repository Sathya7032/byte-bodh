import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import {
  BookOpen,
  Search,
  RefreshCw,
  AlertTriangle,
  Loader,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

export default function DashboardBlogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/api/blogs`);
      const blogsData = res.data.data || res.data || [];
      setBlogs(blogsData);
    } catch (err) {
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getCategoryName = (blog) => {
    if (blog.category?.name) return blog.category.name;
    if (blog.category) return typeof blog.category === "string" ? blog.category : "Uncategorized";
    return "Uncategorized";
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const category = getCategoryName(blog).toUpperCase();
    const matchesFilter = filter === "ALL" || category.includes(filter) || (filter === "OTHER" && !["TECHNOLOGY", "CAREER", "TUTORIAL"].some(c => category.includes(c)));
    
    return matchesSearch && matchesFilter;
  });

  const getFeaturedImage = (blog) => blog.featured_image || blog.imageUrl || null;

  const stats = {
    total: blogs.length,
    recent: blogs.filter(b => {
      const d = new Date(b.createdAt || b.published_date || new Date());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d > weekAgo;
    }).length,
    featured: blogs.filter(b => b.isFeatured || b.is_featured).length
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-purple-500/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-pink-500/10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-sans">Blogs & Insights</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Discover the latest industry trends, tutorials, and insights carefully curated for you.
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchBlogs}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all cursor-pointer text-white active:scale-95 flex items-center justify-center self-start sm:self-center"
            title="Refresh blogs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-650 flex-shrink-0" />
          <p className="text-xs text-red-700 font-semibold">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-650 hover:text-red-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Articles", val: stats.total, color: "text-slate-800", bg: "bg-slate-50 border-slate-100", icon: <BookOpen className="w-5 h-5 text-slate-400" /> },
          { label: "Recent This Week", val: stats.recent, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", icon: <Clock className="w-5 h-5 text-emerald-500" /> },
          { label: "Featured Picks", val: stats.featured, color: "text-purple-600", bg: "bg-purple-50 border-purple-100", icon: <TrendingUp className="w-5 h-5 text-purple-500" /> },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
              <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.val}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.bg}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles, tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-[#6C63FF] rounded-xl text-xs font-semibold focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder-slate-400"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All Topics", activeClass: "bg-purple-600 text-white shadow-md shadow-purple-500/15 border-transparent" },
              { id: "TECHNOLOGY", label: "Technology", activeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
              { id: "CAREER", label: "Career", activeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { id: "TUTORIAL", label: "Tutorials", activeClass: "bg-amber-50 text-amber-700 border-amber-200" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === btn.id 
                    ? btn.activeClass 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blogs Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm">
            <Loader className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Loading insights...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              📚
            </div>
            <h3 className="text-lg font-black text-slate-800">No articles found</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm text-center">
              Try adjusting your search queries or selected category filters.
            </p>
          </div>
        ) : (
          filteredBlogs.map((post) => (
            <div key={post.id || post._id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                {getFeaturedImage(post) ? (
                  <img
                    src={getFeaturedImage(post)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <BookOpen className="text-white/50 w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-purple-700 border border-white/20 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                  {getCategoryName(post)}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center text-[10px] font-bold text-slate-400 mb-3 gap-4 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-300" />
                    <span className="truncate max-w-[100px]">{post.author || post.author_name || "ByteBodh Team"}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>

                <div 
                  className="text-slate-500 text-xs font-semibold mb-4 line-clamp-3 flex-1 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.description || post.excerpt || post.content?.substring(0, 100) || "No description available." }}
                />

                <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                     <Clock className="w-3 h-3" />
                     {post.readTime || post.read_time || "5"} min read
                   </span>
                   <Link
                    to={`/dashboard-blogs/${post.slug || post.id}`}
                    className="text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center transition-colors active:scale-95"
                  >
                    Read
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

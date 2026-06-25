import React, { useEffect, useState } from "react";
import {
  FaCalendar,
  FaUser,
  FaArrowLeft,
  FaEye,
  FaClock,
  FaTag,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaPaperPlane,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../config/api";

function decodeHtml(html) {
  if (!html) return "";
  let lastHtml = "";
  let currentHtml = html;
  
  // Recursively decode entities while there are ampersands indicating potential entities
  while (currentHtml !== lastHtml && currentHtml.includes("&")) {
    lastHtml = currentHtml;
    const txt = document.createElement("textarea");
    txt.innerHTML = currentHtml;
    currentHtml = txt.value;
  }
  return currentHtml;
}

function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { slug } = useParams();

  // Fetch blog details by slug - public endpoint without authentication
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/blogs/slug/${slug}`);
        setBlog(response.data.data || response.data);
        console.log("Fetched blog details:", response.data);
      } catch (err) {
        setError("Blog post not found");
        console.error("Error fetching blog details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogDetail();
    }
  }, [slug]);

  // Fetch all blogs to populate recent articles and categories dynamically
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/blogs`);
        setBlogs(response.data.data || response.data || []);
      } catch (err) {
        console.error("Error fetching all blogs:", err);
      }
    };
    fetchAllBlogs();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-500 font-semibold">Loading blog post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center space-y-6">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">
            Blog Post Not Found
          </h3>
          <p className="text-slate-500 font-medium">
            {error || "The requested blog post could not be found."}
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all"
          >
            <FaArrowLeft />
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter recent blogs (excluding current one)
  const recentBlogs = blogs
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  // Compute category counts dynamically
  const categoryCounts = {};
  blogs.forEach((b) => {
    const catName = b.category?.name || (typeof b.category === "string" ? b.category : null) || "Uncategorized";
    categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
  });

  const categories = Object.keys(categoryCounts)
    .map((name) => ({
      name,
      count: categoryCounts[name],
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />
      
      {/* Blog Hero Section */}
      <section className="relative pt-32 pb-8 md:pt-40 md:pb-12 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-left space-y-6">
          {/* Breadcrumb */}
          <div>
            <Link
              to="/blogs"
              className="inline-flex items-center text-slate-500 hover:text-emerald-500 font-bold text-sm transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blogs
            </Link>
          </div>

          {/* Category Badge */}
          {blog.category?.name && (
            <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md">
              {blog.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-slate-400 text-xs font-semibold uppercase tracking-wider border-t border-slate-200/50 pt-4">
            <div className="flex items-center">
              <FaUser className="mr-2 text-emerald-500" />
              <span>By {blog.author || "ByteBodh Team"}</span>
            </div>
            {(blog.createdAt || blog.created_at || blog.published_date) && (
              <div className="flex items-center">
                <FaCalendar className="mr-2 text-emerald-500" />
                <span>
                  {new Date(
                    blog.createdAt || blog.created_at || blog.published_date
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <FaClock className="mr-2 text-emerald-500" />
              <span>{blog.readTime || blog.read_time || 5} MIN READ</span>
            </div>
            {blog.views !== undefined && (
              <div className="flex items-center">
                <FaEye className="mr-2 text-emerald-500" />
                <span>{blog.views || 0} VIEWS</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Content Section with Sidebar */}
      <section className="pt-8 pb-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Blog Article - 2 Columns */}
            <div className="lg:col-span-2 space-y-8">
              <article className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-10 shadow-sm space-y-8">
                {/* Featured Image */}
                {blog.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-auto max-h-[500px] object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {/* Blog Content - Description HTML */}
                {blog.description && (
                  <div
                    className="prose prose-lg max-w-none 
                               prose-headings:text-slate-900 prose-headings:font-black
                               prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium
                               prose-strong:text-slate-800 prose-strong:font-bold
                               prose-ul:text-slate-500 prose-ul:font-medium
                               prose-ol:text-slate-500 prose-ol:font-medium
                               prose-blockquote:border-l-4 prose-blockquote:border-emerald-500
                               prose-blockquote:pl-6 prose-blockquote:text-slate-500 prose-blockquote:italic
                               prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:rounded-2xl
                               prose-code:text-emerald-600 prose-code:bg-emerald-50/50
                               prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:font-semibold
                               prose-a:text-emerald-500 prose-a:no-underline hover:prose-a:text-emerald-600 hover:prose-a:underline
                               prose-img:rounded-2xl prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: decodeHtml(blog.description) }}
                  />
                )}

                {/* Featured Badge */}
                {blog.isFeatured && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black shadow-md">
                      <FaTag className="mr-2" />
                      FEATURED POST
                    </span>
                  </div>
                )}
              </article>

              {/* Navigation Back */}
              <div className="mt-12 text-center lg:text-left">
                <Link
                  to="/blogs"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all duration-300"
                >
                  <FaArrowLeft />
                  Back to All Blogs
                </Link>
              </div>
            </div>

            {/* Sidebar Column - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                
                {/* Widget 1: About the Author */}
                <div className="bg-slate-50/40 border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-lg font-black text-slate-900 border-b border-slate-200/60 pb-3 mb-5">
                    About The Author
                  </h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md uppercase">
                      {blog.author ? blog.author.substring(0, 2) : "BB"}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-800 text-base leading-tight">
                        {blog.author || "ByteBodh Expert"}
                      </h5>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                        Content Specialist
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                    A technology expert at ByteBodh. Dedicated to publishing insightful tutorials, design methodologies, and digital transformation tips that help professionals and organizations grow.
                  </p>
                  <div className="flex gap-3 text-slate-400">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                      <FaLinkedin size={18} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                      <FaTwitter size={18} />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">
                      <FaGithub size={18} />
                    </a>
                  </div>
                </div>

                {/* Widget 2: Recent Articles */}
                {recentBlogs.length > 0 && (
                  <div className="bg-slate-50/40 border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 border-b border-slate-200/60 pb-3 mb-5">
                      Recent Articles
                    </h4>
                    <div className="space-y-6">
                      {recentBlogs.map((recentBlog) => (
                        <Link 
                          key={recentBlog.id || recentBlog._id || recentBlog.slug}
                          to={`/blogs/${recentBlog.slug}`}
                          className="flex gap-4 group"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                            {recentBlog.imageUrl ? (
                              <img 
                                src={recentBlog.imageUrl} 
                                alt={recentBlog.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-500">
                                <FaTag size={16} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block">
                              {recentBlog.category?.name || (typeof recentBlog.category === 'string' ? recentBlog.category : "Technology")}
                            </span>
                            <h5 className="font-bold text-slate-800 text-sm group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug">
                              {recentBlog.title}
                            </h5>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Widget 3: Categories */}
                {categories.length > 0 && (
                  <div className="bg-slate-50/40 border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h4 className="text-lg font-black text-slate-900 border-b border-slate-200/60 pb-3 mb-4">
                      Explore Categories
                    </h4>
                    <div className="flex flex-col gap-2">
                      {categories.slice(0, 5).map((cat) => (
                        <Link
                          key={cat.name}
                          to="/blogs"
                          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-emerald-500/30 hover:bg-emerald-50/30 transition-all group"
                        >
                          <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                            {cat.name}
                          </span>
                          <span className="bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors px-2.5 py-0.5 rounded-lg text-xs font-black text-slate-500">
                            {cat.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Widget 4: Newsletter Subscription */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-slate-950/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                  
                  <h4 className="text-lg font-black mb-2">Newsletter</h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed mb-5">
                    Stay updated with the latest digital transformation stories, guides, and job notices.
                  </p>
                  {subscribed ? (
                    <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-center text-xs font-bold animate-pulse">
                      Subscription successful!
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                      <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <FaPaperPlane size={11} />
                        Subscribe
                      </button>
                    </form>
                  )}
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

export default BlogDetail;

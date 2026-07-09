import React, { useState, useEffect } from "react";
import {
  FaCalendar,
  FaUser,
  FaArrowRight,
  FaSearch,
  FaTag,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../config/api";
import useSEO from "../hooks/useSEO";

const FALLBACK_BLOGS = [
  {
    id: "f1",
    slug: "build-perfect-developer-portfolio",
    title: "How to Build a Perfect Developer Portfolio in 2026",
    category: "Career Growth",
    author: "Sathya Prakash",
    createdAt: "2026-05-15T08:00:00.000Z",
    excerpt: "Learn the essential components of a software engineer portfolio that captures recruiters' attention. From project presentations to live demo links, here is a complete blueprint.",
    readTime: "6",
    content: "Building a developer portfolio is more than just listing your skills. Recruiters look for live links, interactive layouts, clean GitHub structures, and demonstrable proof of execution. This article explores the structure of highly successful developer portfolios..."
  },
  {
    id: "f2",
    slug: "demystifying-ats-resume-screeners",
    title: "Demystifying ATS: How to Make Your Resume Machine-Readable",
    category: "Career Tools",
    author: "Rohan Deshmukh",
    createdAt: "2026-06-02T10:30:00.000Z",
    excerpt: "Applicant Tracking Systems (ATS) filter out over 70% of resumes before a human recruiter even sees them. Understand how they parse text and how to optimize your resume templates.",
    readTime: "5",
    content: "Most modern enterprises use Applicant Tracking Systems (ATS) to manage job applications. ATS parsers extract text files, checking for keyword densities, layout structures, and standardized headings. Using multi-column grids or custom icons can cause parsing failures. Learn how to format headings and optimize key fields..."
  },
  {
    id: "f3",
    slug: "guide-to-writing-clean-react-code",
    title: "The Ultimate Guide to Writing Clean React Code",
    category: "Technology",
    author: "ByteBodh Engineering",
    createdAt: "2026-06-18T14:15:00.000Z",
    excerpt: "Explore best practices in React web development. Learn about clean component architectures, state management patterns, custom hook design, and code splitting techniques.",
    readTime: "8",
    content: "React has dominated frontend development for years, but as codebases grow, maintaining scalability requires strict architectural discipline. From separation of concerns, writing custom hooks for logic encapsulation, to dynamic code splitting with React Lazy, here are the guidelines to writing clean components..."
  },
  {
    id: "f4",
    slug: "leveraging-qr-analytics-for-networking",
    title: "Leveraging QR Code Analytics for Modern Professional Networking",
    category: "Business Growth",
    author: "Aisha Sen",
    createdAt: "2026-06-25T11:00:00.000Z",
    excerpt: "How adding dynamic QR codes to your physical resume or business card can help you track recruiter interest, view click analytics, and stand out in hiring drives.",
    readTime: "4",
    content: "Traditional networking is evolving. Instead of handing out paper resumes that get lost, modern professionals use dynamic QR codes. By linking to a tracking-ready digital portfolio, you can instantly see when and where your CV gets scanned. This article shows you how to design dynamic QR networking layouts..."
  }
];

function Blog() {
  useSEO({
    title: "Blog | ByteBodh - Tutorials, Tech Guides & Career Tips",
    description: "Browse the latest tech articles, web development tutorials, and career branding guides. Learn how to write clean React code, build portfolios, and optimize CVs.",
    keywords: "coding articles, react tutorial, developer career guides, resume tips, bytebodh blog, portfolio guide, developer branding, career growth tips, tech tutorials"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from API
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/blogs`);
      const blogsData = res.data.data || res.data || [];
      if (blogsData.length > 0) {
        setBlogs(blogsData);
      } else {
        setBlogs(FALLBACK_BLOGS);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      // Fallback to rich static content if the backend is down
      setBlogs(FALLBACK_BLOGS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };


  const categories = [
    { id: 1, name: "Career Growth", post_count: 3 },
    { id: 2, name: "Technology", post_count: 4 },
    { id: 3, name: "Tutorial", post_count: 2 },
    { id: 4, name: "Mobile Development", post_count: 3 },
    { id: 5, name: "Career Tools", post_count: 3 },
    { id: 6, name: "Business Growth", post_count: 3 },
    { id: 7, name: "Web Development", post_count: 4 },
  ];

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFeaturedImage = (blog) => {
    return blog.featured_image || blog.imageUrl || null;
  };

  const getCategoryName = (blog) => {
    if (blog.category?.name) return blog.category.name;
    if (blog.category)
      return typeof blog.category === "string"
        ? blog.category
        : "Uncategorized";
    return "Uncategorized";
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            <span>Learn & Grow</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black leading-[1.1] text-slate-900 tracking-tight">
            ByteBodh <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Expert insights, tutorials, and guides to help startups and small businesses succeed in the digital world.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-xl p-2 group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <FaSearch className="text-slate-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search articles, tutorials, guides..."
                className="flex-1 py-3 px-2 text-slate-800 focus:outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-xl font-bold transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Blog Posts */}
            <div className="lg:w-2/3">
              {loading ? (
                <div className="text-center py-16 bg-white border border-slate-200/50 rounded-3xl shadow-sm">
                  <FaSpinner className="animate-spin text-emerald-500 text-4xl mx-auto mb-4" />
                  <p className="text-slate-500 text-base font-semibold">Loading blogs...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-white border border-slate-200/50 rounded-3xl shadow-sm space-y-4">
                  <div className="text-red-500 text-4xl mx-auto">⚠️</div>
                  <p className="text-slate-600 font-medium">{error}</p>
                  <button
                    onClick={fetchBlogs}
                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200/50 rounded-3xl shadow-sm">
                  <FaSearch className="text-slate-300 text-4xl mx-auto mb-4" />
                  <p className="text-slate-500 text-base font-semibold">
                    No blogs found {searchTerm && `for "${searchTerm}"`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredBlogs.map((post) => (
                    <article
                      key={post.id || post._id}
                      className="bg-white rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 overflow-hidden group flex flex-col justify-between"
                    >
                      {/* Image */}
                      <div className="relative h-56 bg-slate-900 overflow-hidden">
                        {getFeaturedImage(post) ? (
                          <img
                            src={getFeaturedImage(post)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <FaTag className="text-white text-4xl" />
                          </div>
                        )}
                        <span className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md">
                          {getCategoryName(post)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center text-xs text-slate-400 font-bold mb-4 gap-4">
                            <span className="flex items-center gap-1.5">
                              <FaUser className="text-slate-300" />
                              {post.author || post.author_name || "ByteBodh Team"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FaCalendar className="text-slate-300" />
                              {post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString()
                                : post.published_date
                                ? new Date(post.published_date).toLocaleDateString()
                                : "Recent"}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug group-hover:text-emerald-500 transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          <div
                            className="text-slate-500 text-sm leading-relaxed mb-6 font-medium line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: post.description || post.excerpt || post.content?.substring(0, 150) || "No description available."
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                          <span className="text-xs text-slate-400 font-extrabold">
                            {post.readTime || post.read_time || "5"} MIN READ
                          </span>
                          <Link
                            to={`/blogs/${post.slug || post.id}`}
                            className="flex items-center text-emerald-500 hover:text-emerald-600 font-bold text-sm group/read"
                          >
                            Read More
                            <FaArrowRight className="ml-1.5 group-hover/read:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="space-y-8">
                {/* Categories */}
                <div className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between py-3 px-3 hover:bg-emerald-50/50 rounded-xl transition-colors cursor-pointer group"
                      >
                        <span className="text-slate-600 font-semibold text-sm group-hover:text-emerald-600 transition-colors">
                          {category.name}
                        </span>
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                          {category.post_count || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Posts */}
                <div className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100">
                    Featured Posts
                  </h3>
                  <div className="space-y-4">
                    {blogs
                      .filter((b) => b.isFeatured || b.is_featured)
                      .slice(0, 3)
                      .map((post) => (
                        <Link
                          key={post.id || post._id}
                          to={`/blogs/${post.slug || post.id}`}
                          className="block group"
                        >
                          <div className="flex items-start space-x-4 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                            {getFeaturedImage(post) ? (
                              <img
                                src={getFeaturedImage(post)}
                                alt={post.title}
                                className="h-12 w-12 rounded-lg object-cover border border-slate-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                <FaTag className="text-white text-xs" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-500 line-clamp-2 mb-1 leading-snug">
                                {post.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {post.createdAt
                                  ? new Date(post.createdAt).toLocaleDateString()
                                  : post.published_date
                                  ? new Date(post.published_date).toLocaleDateString()
                                  : "Recent"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-500/10 space-y-4">
                  <h3 className="text-xl font-black">Stay Updated</h3>
                  <p className="text-emerald-50 text-sm font-medium leading-relaxed">
                    Get the latest articles and tutorials delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3.5 bg-white/10 placeholder-white/60 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white border border-white/20 text-sm font-semibold"
                    />
                    <button className="w-full bg-white text-emerald-600 font-extrabold py-3.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-md text-sm">
                      Subscribe
                    </button>
                  </div>
                </div>

                {/* ByteBodh Services */}
                <div className="bg-slate-950 rounded-[2rem] border border-slate-900 p-8 text-white space-y-4">
                  <h3 className="text-xl font-black">
                    ByteBodh Services
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-400 font-medium">
                    <li className="flex items-center">
                      <span className="mr-2.5 text-emerald-500">✓</span> Web & Mobile Development
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2.5 text-emerald-500">✓</span> Online Portfolio Maker
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2.5 text-emerald-500">✓</span> Resume Builder & Downloader
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2.5 text-emerald-500">✓</span> Startup Tech Solutions
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2.5 text-emerald-500">✓</span> Budget-Friendly Packages
                    </li>
                  </ul>
                  <a
                    href="mailto:info@bytebodh.in"
                    className="block text-center bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 text-sm"
                  >
                    Explore Services
                  </a>
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

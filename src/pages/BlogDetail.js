import React, { useEffect, useState } from "react";
import {
  FaCalendar,
  FaArrowLeft,
  FaEye,
  FaClock,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
  FaYoutube,
  FaShareAlt,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import PageNotFound from "./PageNotFound";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { blogApi } from "../api/blogs";

const FALLBACK_BLOG_MAP = {
  "build-perfect-developer-portfolio": {
    id: "f1",
    slug: "build-perfect-developer-portfolio",
    title: "How to Build a Perfect Developer Portfolio in 2026",
    category: "Career Growth",
    authorName: "Sathya Prakash",
    authorTitle: "Lead Developer & Architect",
    createdAt: "2026-05-15T08:00:00.000Z",
    publishedAt: "2026-05-15T08:00:00.000Z",
    summary: "Learn the essential components of a software engineer portfolio that captures recruiters' attention. From project presentations to live demo links, here is a complete blueprint.",
    readingTimeMinutes: 6,
    viewsCount: 1420,
    coverImageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    tags: ["Career", "Portfolio", "WebDev"],
    content: `
      <h2>1. The Anatomy of an Unstoppable Portfolio</h2>
      <p>Building a developer portfolio is more than just listing skills in a bulleted format. Modern tech recruiters spend fewer than <strong>30 seconds</strong> reviewing candidates. To stand out, your portfolio needs to communicate technical depth, proof of execution, and measurable impact immediately.</p>
      <h3>2. Focus on Case Studies Rather Than Simple Demos</h3>
      <p>Instead of merely displaying a screenshot and a GitHub link, structure your featured projects as comprehensive case studies:</p>
      <ul>
        <li><strong>Problem Statement:</strong> What challenge or inefficiency were you solving?</li>
        <li><strong>Technical Architecture:</strong> Why did you choose React, Spring Boot, or PostgreSQL?</li>
        <li><strong>Key Metrics:</strong> Did it reduce load times by 40%? Did it automate manual tasks?</li>
      </ul>
      <blockquote>"A portfolio doesn't just show that you can write code; it shows that you can solve business problems with engineering rigor."</blockquote>
      <h3>3. Performance, Mobile Responsiveness, and SEO</h3>
      <p>Ensure your portfolio scores over 90 on Google Lighthouse. Enable responsive touch navigation, instant dark/light themes, and clean canonical URLs.</p>
    `,
  },
  "guide-to-writing-clean-react-code": {
    id: "f3",
    slug: "guide-to-writing-clean-react-code",
    title: "The Ultimate Guide to Writing Clean React Code",
    category: "Technology",
    authorName: "ByteBodh Engineering",
    authorTitle: "Frontend Platform Team",
    createdAt: "2026-06-18T14:15:00.000Z",
    publishedAt: "2026-06-18T14:15:00.000Z",
    summary: "Explore best practices in React web development. Learn about clean component architectures, state management patterns, custom hook design, and code splitting techniques.",
    readingTimeMinutes: 8,
    viewsCount: 2310,
    youtubeVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    coverImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "JavaScript", "CleanCode"],
    content: `
      <h2>Writing Scalable, Maintainable React Applications</h2>
      <p>React 19 continues to evolve modern frontend engineering. However, as applications scale, codebase maintainability depends on separation of concerns, disciplined state management, and defensive rendering.</p>
      <h3>1. Keep Components Small and Single-Purpose</h3>
      <p>Every component should have one clear responsibility. Separate presentation components from business logic and data-fetching hooks.</p>
      <h3>2. Encapsulate Logic with Custom Hooks</h3>
      <p>Whenever you find yourself writing repetitive state or event listener code, abstract it into an isolated custom hook that can be unit-tested without rendering DOM nodes.</p>
    `,
  },
};

function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useSEO({
    title: blog ? (blog.metaTitle || `${blog.title} | ByteBodh Blog`) : "ByteBodh Blog",
    description: blog ? (blog.metaDescription || blog.summary) : "ByteBodh tech blog article",
    keywords: blog ? (blog.metaKeywords || "bytebodh blog, tech articles, coding") : "",
  });

  // Fetch blog detail by slug
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await blogApi.getBlogBySlug(slug);
        const data = res.data;
        if (data) {
          setBlog(data);
        } else if (FALLBACK_BLOG_MAP[slug]) {
          setBlog(FALLBACK_BLOG_MAP[slug]);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        console.warn("Backend blog detail fetch fallback:", err.message);
        if (FALLBACK_BLOG_MAP[slug]) {
          setBlog(FALLBACK_BLOG_MAP[slug]);
        } else {
          setError("Blog post not found");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // Fetch related and recent blogs
  useEffect(() => {
    if (!slug) return;
    const fetchExtras = async () => {
      try {
        const [relatedRes, recentRes, catsRes] = await Promise.allSettled([
          blogApi.getRelatedBlogs(slug, 3),
          blogApi.getRecentBlogs(4),
          blogApi.getCategories(),
        ]);

        if (relatedRes.status === "fulfilled" && Array.isArray(relatedRes.value.data)) {
          setRelatedBlogs(relatedRes.value.data);
        }
        if (recentRes.status === "fulfilled" && Array.isArray(recentRes.value.data)) {
          setRecentBlogs(recentRes.value.data.filter((b) => b.slug !== slug).slice(0, 3));
        }
        if (catsRes.status === "fulfilled" && Array.isArray(catsRes.value.data)) {
          setCategories(catsRes.value.data);
        }
      } catch (err) {
        console.warn("Extras fetch failed:", err);
      }
    };
    fetchExtras();
  }, [slug]);

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Article link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
          <p className="text-slate-500 font-bold text-sm">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <PageNotFound
        statusCode="404"
        title="Article Not Found"
        message="The blog article you are looking for does not exist or has been archived."
        showHeaderFooter={true}
        actionText="Back to Blog Catalog"
        actionLink="/blogs"
      />
    );
  }

  const tagsList = Array.isArray(blog.tags) ? blog.tags : Array.from(blog.tags || []);
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />

      {/* Article Header & Breadcrumbs */}
      <section className="relative pt-32 pb-8 md:pt-40 md:pb-12 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          {/* Breadcrumb & Back */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <FaArrowLeft size={11} /> Back to all articles
            </Link>
            <span className="text-slate-400 font-mono text-[11px]">/blogs/{blog.slug}</span>
          </div>

          {/* Badges & Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs">
              {blog.category || "Technology"}
            </span>

            <span className="flex items-center gap-1.5">
              <FaCalendar className="text-slate-400" />
              {blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recently Published"}
            </span>

            <span>•</span>

            <span className="flex items-center gap-1.5">
              <FaClock className="text-slate-400" />
              {blog.readingTimeMinutes || 5} min read
            </span>

            <span>•</span>

            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <FaEye />
              {(blog.viewsCount || 0).toLocaleString()} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {blog.title}
          </h1>

          {/* Excerpt / Summary */}
          {blog.summary && (
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {blog.summary}
            </p>
          )}

          {/* Author Card */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-500/20">
                {blog.authorAvatarUrl ? (
                  <img
                    src={blog.authorAvatarUrl}
                    alt={blog.authorName}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  blog.authorName?.charAt(0) || "B"
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{blog.authorName || "ByteBodh Editorial"}</p>
                <p className="text-xs text-slate-400 font-medium">{blog.authorTitle || "Technical Writer & Architect"}</p>
              </div>
            </div>

            {/* Social Share Shortcuts */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
                <FaShareAlt size={12} /> Share:
              </span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-xs"
                title="Share on LinkedIn"
              >
                <FaLinkedin size={14} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-sky-500 hover:border-sky-300 transition-colors shadow-xs"
                title="Share on Twitter / X"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + " - " + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-500 hover:border-emerald-300 transition-colors shadow-xs"
                title="Share on WhatsApp"
              >
                <FaWhatsapp size={14} />
              </a>
              <button
                onClick={copyArticleLink}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
                title="Copy link"
              >
                <FaCopy size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Article Container */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 Cols: Article Content */}
            <article className="lg:col-span-8 space-y-8">
              {/* YouTube Video Embed Player */}
              {(blog.youtubeVideoEmbedUrl || blog.youtubeVideoUrl) && (
                <div className="space-y-2">
                  <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200">
                    <iframe
                      src={
                        blog.youtubeVideoEmbedUrl ||
                        (blog.youtubeVideoUrl.includes("embed")
                          ? blog.youtubeVideoUrl
                          : blog.youtubeVideoUrl.includes("youtu.be/")
                          ? `https://www.youtube.com/embed/${blog.youtubeVideoUrl.split("youtu.be/")[1]?.split("?")[0]}`
                          : blog.youtubeVideoUrl.includes("watch?v=")
                          ? `https://www.youtube.com/embed/${blog.youtubeVideoUrl.split("watch?v=")[1]?.split("&")[0]}`
                          : blog.youtubeVideoUrl)
                      }
                      title={blog.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold px-2">
                    <FaYoutube className="text-red-600 text-sm" />
                    <span>Watch video companion for this article</span>
                  </div>
                </div>
              )}

              {/* Cover Hero Image (if present) */}
              {blog.coverImageUrl && !blog.youtubeVideoEmbedUrl && (
                <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg max-h-[480px]">
                  <img
                    src={blog.coverImageUrl}
                    alt={blog.coverImageAlt || blog.title}
                    className="w-full h-full object-cover"
                  />
                  {blog.coverImageAlt && (
                    <p className="text-[11px] text-slate-400 text-center py-2 bg-slate-50 border-t border-slate-100 font-medium italic">
                      {blog.coverImageAlt}
                    </p>
                  )}
                </div>
              )}

              {/* Rich Text Sanitized Content */}
              <div
                className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed font-sans
                  prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:my-4 prose-p:leading-8
                  prose-a:text-emerald-600 prose-a:font-bold prose-a:underline hover:prose-a:text-emerald-700
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/40 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 prose-blockquote:italic
                  prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-slate-900 prose-pre:text-emerald-400 prose-pre:rounded-2xl prose-pre:p-5
                  prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-slate-200 prose-img:my-6
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                  prose-li:my-1.5"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content || ""),
                }}
              />

              {/* Tags Cloud */}
              {tagsList.length > 0 && (
                <div className="pt-8 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Tagged Topics
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-bold text-slate-600 border border-slate-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share & Feedback Bottom Banner */}
              <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Did you find this guide insightful?</h4>
                  <p className="text-xs text-slate-500">Share it with fellow engineers and teams.</p>
                </div>
                <button
                  onClick={copyArticleLink}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <FaCopy size={13} />
                  Copy Article Link
                </button>
              </div>

              {/* Related Articles Section */}
              {relatedBlogs.length > 0 && (
                <div className="pt-8 space-y-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Related Articles in {blog.category || "this Topic"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedBlogs.map((rel) => (
                      <Link
                        key={rel.id || rel.slug}
                        to={`/blogs/${rel.slug}`}
                        className="group p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all bg-white flex gap-3"
                      >
                        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          {rel.coverImageUrl ? (
                            <img
                              src={rel.coverImageUrl}
                              alt={rel.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              {rel.title.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-emerald-600 block uppercase">
                            {rel.category || "Article"}
                          </span>
                          <h5 className="font-bold text-xs text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                            {rel.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {rel.readingTimeMinutes || 5} min read
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Right 4 Cols: Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Author Bio Widget */}
              <div className="bg-slate-50/60 rounded-3xl border border-slate-200/80 p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-base flex items-center justify-center shadow-md">
                    {blog.authorName?.charAt(0) || "B"}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{blog.authorName || "ByteBodh Editorial"}</h4>
                    <p className="text-xs text-slate-400 font-semibold">{blog.authorTitle || "Technical Writer"}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed pt-2">
                  Building next-generation portfolio builders, developer tools, and resume intelligence systems at ByteBodh.
                </p>
              </div>

              {/* Recent Stories Widget */}
              {recentBlogs.length > 0 && (
                <div className="bg-slate-50/60 rounded-3xl border border-slate-200/80 p-6 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 border-b border-slate-200/60 pb-3">
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

              {/* Explore Categories Widget */}
              {categories.length > 0 && (
                <div className="bg-slate-50/60 rounded-3xl border border-slate-200/80 p-6 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 border-b border-slate-200/60 pb-3">
                    Categories
                  </h4>
                  <div className="space-y-1.5">
                    {categories.slice(0, 6).map((c) => (
                      <Link
                        key={c.category}
                        to="/blogs"
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-white text-xs font-bold text-slate-700 transition-colors group"
                      >
                        <span className="group-hover:text-emerald-600 transition-colors">{c.category}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-500">
                          {c.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Widget */}
              <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 space-y-3">
                <h4 className="text-base font-black">Stay in the Loop</h4>
                <p className="text-xs text-emerald-50 font-medium leading-relaxed">
                  Get high-yield tutorials, architecture patterns, and portfolio tips directly in your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Your email address..."
                  className="w-full px-3.5 py-2.5 bg-white/15 placeholder-white/60 text-white rounded-xl text-xs font-semibold focus:outline-none border border-white/20"
                />
                <button
                  onClick={() => alert("Subscribed successfully!")}
                  className="w-full bg-white text-emerald-600 font-black py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-md text-xs cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BlogDetail;

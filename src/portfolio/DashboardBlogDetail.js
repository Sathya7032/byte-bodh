import React, { useEffect, useState } from "react";
import {
  FaCalendar,
  FaUser,
  FaArrowLeft,
  FaEye,
  FaClock,
  FaTag,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import API_BASE_URL from "../config/api";

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default function DashboardBlogDetail() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/blogs/slug/${slug}`);
        setBlog(response.data.data || response.data);
      } catch (err) {
        setError("Blog post not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogDetail();
    }
  }, [slug]);

  if (loading) {
    return (
      <DashboardLayout containerClassName="w-full">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 font-semibold">Loading blog post...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !blog) {
    return (
      <DashboardLayout containerClassName="w-full">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Blog Post Not Found
          </h3>
          <p className="text-slate-600 mb-6">
            {error || "The requested blog post could not be found."}
          </p>
          <Link
            to="/dashboard-blogs"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard Blogs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout containerClassName="w-full text-left space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-semibold text-slate-500 mb-2">
        <Link to="/dashboard" className="hover:text-purple-600 transition-colors">Dashboard</Link>
        <span className="mx-2">/</span>
        <Link to="/dashboard-blogs" className="hover:text-purple-600 transition-colors">Blogs</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 truncate max-w-xs" title={blog.title}>{blog.title}</span>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-purple-500/10 blur-[50px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <Link
              to="/dashboard-blogs"
              className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-6 text-sm font-semibold"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blogs
            </Link>

            {blog.category?.name && (
              <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold mb-4 uppercase tracking-wider">
                {blog.category.name}
              </span>
            )}

            <h1 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-slate-300 text-xs md:text-sm font-semibold">
              <div className="flex items-center">
                <FaUser className="mr-2 text-purple-400" />
                <span>By {blog.author || "ByteBodh Team"}</span>
              </div>
              {(blog.createdAt || blog.created_at || blog.published_date) && (
                <div className="flex items-center">
                  <FaCalendar className="mr-2 text-purple-400" />
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
                <FaClock className="mr-2 text-purple-400" />
                <span>{blog.readTime || blog.read_time || 5} min read</span>
              </div>
              {blog.views !== undefined && (
                <div className="flex items-center">
                  <FaEye className="mr-2 text-purple-400" />
                  <span>{blog.views || 0} views</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {blog.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-md">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-auto max-h-[400px] object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {blog.description && (
            <div
              className="prose prose-lg max-w-none prose-headings:text-slate-800 
                         prose-p:text-slate-600 prose-p:leading-relaxed 
                         prose-strong:text-slate-800 prose-ul:text-slate-600 
                         prose-ol:text-slate-600 prose-li:leading-relaxed
                         prose-blockquote:border-l-4 prose-blockquote:border-purple-500
                         prose-blockquote:pl-6 prose-blockquote:text-slate-600
                         prose-pre:bg-slate-900 prose-pre:text-slate-100
                         prose-code:text-pink-600 prose-code:bg-slate-100
                         prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                         prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: decodeHtml(blog.description) }}
            />
          )}

          {blog.isFeatured && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="inline-flex items-center px-4 py-2 rounded-full 
                             bg-gradient-to-r from-purple-500 to-pink-500 
                             text-white text-xs font-bold uppercase tracking-wider">
                <FaTag className="mr-2" />
                Featured Post
              </span>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// src/pages/BlogDetail.js
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
import Header from "../components/Header";
import Footer from "../components/Footer";

function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const API_BASE = "https://bytebodh.codewithsathya.info/api";

  // Fetch blog details by slug
  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/blog-posts/${slug}/`);
        setBlog(response.data.data);
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading blog post...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center py-12 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Blog Post Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                {error || "The requested blog post could not be found."}
              </p>
              <Link
                to="/blogs"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                <FaArrowLeft className="mr-2" />
                Back to Blogs
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Blog Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Link
                  to="/blogs"
                  className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Blogs
                </Link>
              </div>

              {/* Category Badge */}
              {blog.category?.name && (
                <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold mb-4">
                  {blog.category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                {blog.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 md:gap-6 text-gray-400 text-sm md:text-base">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>By {blog.author || "ByteBodh Team"}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>
                    {new Date(blog.published_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>{blog.read_time || 5} min read</span>
                </div>
                <div className="flex items-center">
                  <FaEye className="mr-2" />
                  <span>{blog.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <article className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                {/* Featured Image */}
                {blog.featured_image && (
                  <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-auto max-h-[400px] object-cover"
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-800 
                           prose-p:text-gray-600 prose-p:leading-relaxed 
                           prose-strong:text-gray-800 prose-ul:text-gray-600 
                           prose-ol:text-gray-600 prose-li:leading-relaxed
                           prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                           prose-blockquote:pl-6 prose-blockquote:text-gray-600
                           prose-pre:bg-gray-900 prose-pre:text-gray-100
                           prose-code:text-red-600 prose-code:bg-gray-100
                           prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                           prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center mb-4">
                      <FaTag className="text-gray-500 mr-2" />
                      <h4 className="text-lg font-semibold text-gray-800">
                        Tags:
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-4 py-2 rounded-full 
                                   bg-gray-100 text-gray-700 text-sm font-medium 
                                   border border-gray-200 hover:bg-gray-200 transition-colors"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Link
                    to="/blogs"
                    className="inline-flex items-center justify-center 
                               bg-gradient-to-r from-blue-600 to-indigo-600 
                               text-white font-semibold px-6 py-3 rounded-lg
                               hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back to All Blogs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;

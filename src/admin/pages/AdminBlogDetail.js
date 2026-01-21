// pages/BlogDetail.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog } from "../../api/blogs";
import DashboardLayout from "../DashboardLayout";

const AdminBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    try {
      const res = await getBlogById(id);
      setBlog(res.data.data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      navigate("/blogs");
    }
    setLoading(false);
  }, [id, navigate]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id);
      navigate("/blogs");
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Loading...">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading blog...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!blog) {
    return (
      <DashboardLayout pageTitle="Blog Not Found">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <Link to="/blogs" className="text-blue-600 hover:text-blue-800">
            ← Back to Blogs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={blog.title}>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <Link
                to="/blogs"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blogs
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/admin-blogs/edit/${id}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Blog Header */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {blog.category?.name || "Uncategorized"}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                blog.isFeatured
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {blog.isFeatured ? "Featured" : "Regular"}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">{blog.readTime || 5} min read</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">
                {new Date(blog.createdTime).toLocaleDateString()}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">{blog.views || 0} views</span>
            </div>
            <div className="text-gray-600 mb-4">
              <span className="font-medium">Author:</span> {blog.author || "Unknown"}
            </div>
          </div>

          {/* Featured Image */}
          {blog.imageUrl && (
            <div className="w-full">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.description }} />
            </div>
          </div>

          {/* Blog Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">
                  Last updated: {new Date(blog.updatedTime).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Slug: {blog.slug}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                ID: {blog.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminBlogDetail;
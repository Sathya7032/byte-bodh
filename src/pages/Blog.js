// src/pages/Blog.js
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

function Blog() {
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
      // Assuming your API returns data in res.data.data or res.data
      const blogsData = res.data.data || res.data || [];
      setBlogs(blogsData);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Dummy categories data (you might want to fetch this from API too)
  const categories = [
    { id: 1, name: "Career Growth", post_count: 3 },
    { id: 2, name: "Technology", post_count: 4 },
    { id: 3, name: "Tutorial", post_count: 2 },
    { id: 4, name: "Mobile Development", post_count: 3 },
    { id: 5, name: "Career Tools", post_count: 3 },
    { id: 6, name: "Business Growth", post_count: 3 },
    { id: 7, name: "Web Development", post_count: 4 },
  ];

  // Filtered Blogs by search
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get featured image
  const getFeaturedImage = (blog) => {
    return blog.featured_image || blog.imageUrl || null;
  };

  // Helper function to get category name
  const getCategoryName = (blog) => {
    if (blog.category?.name) return blog.category.name;
    if (blog.category)
      return typeof blog.category === "string"
        ? blog.category
        : "Uncategorized";
    return "Uncategorized";
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium mb-6">
                Learn & Grow
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-100">
                ByteBodh{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Expert insights, tutorials, and guides to help startups and
                small businesses succeed in the digital world. Learn about
                technology, business growth, and budget-friendly solutions.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mt-8">
                <div className="relative flex items-center bg-white rounded-xl shadow-lg p-2">
                  <FaSearch className="text-gray-400 ml-3 mr-2" />
                  <input
                    type="text"
                    placeholder="Search articles, tutorials, guides..."
                    className="flex-1 py-3 px-2 text-gray-800 focus:outline-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={() => setSearchTerm(searchTerm)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Blog Posts */}
              <div className="lg:w-2/3">
                {loading ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Loading blogs...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <div className="text-red-500 text-4xl mx-auto mb-4">⚠️</div>
                    <p className="text-gray-600 text-lg mb-4">{error}</p>
                    <button
                      onClick={fetchBlogs}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredBlogs.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <FaSearch className="text-gray-300 text-4xl mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">
                      No blogs found {searchTerm && `for "${searchTerm}"`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBlogs.map((post) => (
                      <article
                        key={post.id || post._id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                      >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-900 overflow-hidden">
                          {getFeaturedImage(post) ? (
                            <img
                              src={getFeaturedImage(post)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.onerror = null; // prevent infinite loop
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <FaTag className="text-white text-4xl" />
                            </div>
                          )}
                          <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {getCategoryName(post)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                            <span className="flex items-center gap-1">
                              <FaUser className="text-gray-400" />
                              {post.author ||
                                post.author_name ||
                                "ByteBodh Team"} 
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendar className="text-gray-400" />
                              {post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString()
                                : post.published_date
                                ? new Date(
                                    post.published_date
                                  ).toLocaleDateString()
                                : post.createdTime
                                ? new Date(
                                    post.createdTime
                                  ).toLocaleDateString()
                                : "Recent"}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                            {post.title}
                          </h3>

                          <div 
                            className="text-gray-600 mb-4 line-clamp-3 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: post.description || post.excerpt || post.content?.substring(0, 150) || "No description available."
                            }}
                          />

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">
                              {post.readTime || post.read_time || "5"} min read
                            </span>
                            <Link
                              to={`/blogs/${post.slug || post.id}`}
                              className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm group/read"
                            >
                              Read More
                              <FaArrowRight className="ml-2 group-hover/read:translate-x-1 transition-transform" />
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
                <div className="space-y-6">
                  {/* Categories */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                        >
                          <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </span>
                          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                            {category.post_count || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Posts */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
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
                            <div className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              {(post.imageUrl || post.featured_image) ? (
                                <img
                                  src={post.imageUrl || post.featured_image}
                                  alt={post.title}
                                  className="h-12 w-12 rounded-lg object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                  <FaTag className="text-white" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-1">
                                  {post.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {post.createdAt
                                    ? new Date(
                                        post.createdAt
                                      ).toLocaleDateString()
                                    : post.published_date
                                    ? new Date(
                                        post.published_date
                                      ).toLocaleDateString()
                                    : "Recent"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>

                  {/* Newsletter */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                    <p className="text-blue-100 mb-4 leading-relaxed">
                      Get the latest articles and tutorials delivered to your
                      inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                        Subscribe
                      </button>
                    </div>
                  </div>

                  {/* ByteBodh Services */}
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-3">
                      ByteBodh Services
                    </h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Web & Mobile Development
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Online Portfolio Maker
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Resume Builder &
                        Downloader
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Startup Tech Solutions
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Budget-Friendly Packages
                      </li>
                    </ul>
                    <Link
                      to="/services"
                      className="block text-center bg-white text-green-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Explore Services
                    </Link>
                  </div>
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

export default Blog;

// src/pages/Blog.js
import React, { useState } from "react";
import { FaCalendar, FaUser, FaArrowRight, FaSearch, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Blog() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy blogs data
  const blogs = [
    {
      id: 1,
      slug: "why-portfolio-matters-in-2024",
      title: "Why Your Digital Portfolio Matters More Than Ever in 2024",
      excerpt: "In today's competitive job market, a well-crafted portfolio can increase your chances of getting hired by 70%. Learn how to showcase your skills effectively.",
      featured_image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author_name: "Alex Johnson",
      published_date: "2024-01-15",
      read_time: 5,
      is_featured: true,
      category: { name: "Career Growth" }
    },
    {
      id: 2,
      slug: "bytebodh-complete-solution",
      title: "ByteBodh: The All-in-One Platform for Professionals and Businesses",
      excerpt: "Discover how ByteBodh combines web development, portfolio creation, and resume tools to empower startups and professionals in one unified platform.",
      featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author_name: "Sarah Chen",
      published_date: "2024-01-10",
      read_time: 7,
      is_featured: true,
      category: { name: "Technology" }
    },
    {
      id: 3,
      slug: "build-portfolio-under-30-minutes",
      title: "Build a Stunning Portfolio in Under 30 Minutes with ByteBodh",
      excerpt: "Step-by-step guide to creating an impressive online portfolio using ByteBodh's intuitive tools. No coding experience required!",
      featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author_name: "Mike Rodriguez",
      published_date: "2024-01-05",
      read_time: 4,
      is_featured: false,
      category: { name: "Tutorial" }
    },
    {
      id: 4,
      slug: "mobile-app-development-trends",
      title: "Top 5 Mobile App Development Trends for Small Businesses",
      excerpt: "Stay ahead with these emerging mobile app trends that can help your business reach more customers and increase engagement.",
      featured_image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author_name: "ByteBodh Team",
      published_date: "2024-01-03",
      read_time: 6,
      is_featured: true,
      category: { name: "Mobile Development" }
    },
    {
      id: 5,
      slug: "resume-downloader-tips",
      title: "How to Create Download-Ready Resumes That Get You Interviews",
      excerpt: "Learn the secrets of crafting ATS-friendly resumes that stand out and how ByteBodh's resume downloader tool simplifies the process.",
      featured_image: "https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author_name: "Jessica Williams",
      published_date: "2023-12-28",
      read_time: 8,
      is_featured: false,
      category: { name: "Career Tools" }
    },
    {
      id: 6,
      slug: "budget-web-development-solutions",
      title: "Budget-Friendly Web Development Solutions for Startups",
      excerpt: "How ByteBodh provides affordable web development services without compromising on quality or features for growing businesses.",
      featured_image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      author_name: "David Kumar",
      published_date: "2023-12-20",
      read_time: 5,
      is_featured: false,
      category: { name: "Business Growth" }
    }
  ];

  // Dummy categories data
  const categories = [
    { id: 1, name: "Career Growth", post_count: 3 },
    { id: 2, name: "Technology", post_count: 4 },
    { id: 3, name: "Tutorial", post_count: 2 },
    { id: 4, name: "Mobile Development", post_count: 3 },
    { id: 5, name: "Career Tools", post_count: 3 },
    { id: 6, name: "Business Growth", post_count: 3 },
    { id: 7, name: "Web Development", post_count: 4 }
  ];

  // Filtered Blogs by search
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                ByteBodh <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Expert insights, tutorials, and guides to help startups and small businesses 
                succeed in the digital world. Learn about technology, business growth, and budget-friendly solutions.
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
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity">
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
                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <FaSearch className="text-gray-300 text-4xl mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No blogs found for your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBlogs.map((post) => (
                      <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                        {/* Image */}
                        <div className="relative h-48 bg-gray-900 overflow-hidden">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                              <FaTag className="text-white text-3xl opacity-70" />
                            </div>
                          )}
                          {post.category && (
                            <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {post.category.name}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                            <span className="flex items-center gap-1">
                              <FaUser className="text-gray-400" />
                              {post.author_name || "ByteBodh Team"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendar className="text-gray-400" />
                              {new Date(post.published_date).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">
                              {post.read_time || "5"} min read
                            </span>
                            <Link
                              to={`/blogs/${post.slug}`}
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

                  {/* Popular Posts */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                      Featured Posts
                    </h3>
                    <div className="space-y-4">
                      {blogs
                        .filter((b) => b.is_featured)
                        .slice(0, 3)
                        .map((post) => (
                          <Link
                            key={post.id}
                            to={`/blogs/${post.slug}`}
                            className="block group"
                          >
                            <div className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-1">
                                  {post.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(post.published_date).toLocaleDateString()}
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
                      Get the latest articles and tutorials delivered to your inbox.
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
                    <h3 className="text-xl font-bold mb-3">ByteBodh Services</h3>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Web & Mobile Development
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Online Portfolio Maker
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">•</span> Resume Builder & Downloader
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
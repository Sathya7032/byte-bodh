// src/pages/Blog.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner } from "react-bootstrap";
import { FaCalendar, FaUser, FaArrowRight, FaSearch, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE = "https://bytebodh.codewithsathya.info/api";

  // Fetch blogs and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          axios.get(`${API_BASE}/blog-posts/`),
          axios.get(`${API_BASE}/categories/`),
        ]);
        setBlogs(blogRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered Blogs by search
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="bytebodh-blog-page">
        {/* Hero Section */}
        <section className="bytebodh-blog-hero">
          <Container>
            <Row className="text-center py-5">
              <Col lg={8} className="mx-auto">
                <Badge bg="primary" className="bytebodh-hero-badge mb-3">
                  Learn & Grow
                </Badge>
                <h1 className="bytebodh-hero-title mb-3">
                  ByteBodh <span className="bytebodh-hero-gradient">Blog</span>
                </h1>
                <p className="bytebodh-hero-description">
                  Expert insights, tutorials, and guides to help startups and small businesses 
                  succeed in the digital world. Learn about technology, business growth, and budget-friendly solutions.
                </p>

                {/* Search Bar */}
                <div className="bytebodh-search-box mt-4">
                  <div className="bytebodh-search-input">
                    <FaSearch className="bytebodh-search-icon" />
                    <input
                      type="text"
                      placeholder="Search articles, tutorials, guides..."
                      className="bytebodh-search-field"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button className="bytebodh-search-btn">Search</Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Blog Content */}
        <section className="bytebodh-blog-content py-5">
          <Container>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Row>
                {/* Main Blog Posts */}
                <Col lg={8}>
                  <Row className="g-4">
                    {filteredBlogs.map((post) => (
                      <Col key={post.id} md={6}>
                        <Card className="bytebodh-blog-card">
                          <div className="bytebodh-blog-image">
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="bytebodh-blog-img"
                              />
                            ) : (
                              <div className="bytebodh-image-placeholder">
                                <FaTag size={32} className="bytebodh-placeholder-icon" />
                              </div>
                            )}
                            {post.category && (
                              <Badge bg="primary" className="bytebodh-category-badge">
                                {post.category.name}
                              </Badge>
                            )}
                          </div>
                          <Card.Body>
                            <div className="bytebodh-blog-meta mb-2">
                              <span className="bytebodh-meta-item">
                                <FaUser className="me-1" />
                                {post.author_name || "ByteBodh Team"}
                              </span>
                              <span className="bytebodh-meta-item">
                                <FaCalendar className="me-1" />
                                {new Date(post.published_date).toLocaleDateString()}
                              </span>
                            </div>
                            <Card.Title className="bytebodh-blog-title">
                              {post.title}
                            </Card.Title>
                            <Card.Text className="bytebodh-blog-excerpt">
                              {post.excerpt}
                            </Card.Text>
                            <div className="bytebodh-blog-footer">
                              <span className="bytebodh-read-time">
                                {post.read_time} min read
                              </span>
                              <Link
                                to={`/blogs/${post.slug}`}
                                className="bytebodh-read-more"
                              >
                                Read More <FaArrowRight className="ms-1" />
                              </Link>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {filteredBlogs.length === 0 && (
                    <div className="text-center py-5">
                      <p className="text-muted">No blogs found for your search.</p>
                    </div>
                  )}
                </Col>

                {/* Sidebar */}
                <Col lg={4}>
                  <div className="bytebodh-blog-sidebar">
                    {/* Categories */}
                    <Card className="bytebodh-sidebar-widget mb-4">
                      <Card.Body>
                        <h5 className="bytebodh-widget-title">Categories</h5>
                        <div className="bytebodh-categories-list">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className="bytebodh-category-item"
                            >
                              <span>{category.name}</span>
                              <span className="bytebodh-category-count">
                                {category.post_count || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Popular Posts */}
                    <Card className="bytebodh-sidebar-widget mb-4">
                      <Card.Body>
                        <h5 className="bytebodh-widget-title">Featured Posts</h5>
                        <div className="bytebodh-popular-posts">
                          {blogs
                            .filter((b) => b.is_featured)
                            .slice(0, 3)
                            .map((post) => (
                              <Link
                                key={post.id}
                                to={`/blogs/${post.slug}`}
                                className="bytebodh-popular-post"
                              >
                                <div className="bytebodh-popular-content">
                                  <h6>{post.title}</h6>
                                  <span>
                                    {new Date(
                                      post.published_date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Newsletter */}
                    <Card className="bytebodh-sidebar-widget">
                      <Card.Body>
                        <h5 className="bytebodh-widget-title">Stay Updated</h5>
                        <p className="bytebodh-newsletter-text">
                          Get the latest articles and tutorials delivered to your inbox.
                        </p>
                        <div className="bytebodh-newsletter-form">
                          <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="bytebodh-newsletter-input"
                          />
                          <Button className="bytebodh-newsletter-btn">
                            Subscribe
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>
            )}
          </Container>
        </section>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .bytebodh-blog-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .bytebodh-blog-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 4rem 0 3rem;
        }

        .bytebodh-hero-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 50px;
        }

        .bytebodh-hero-title {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          color: #f8fafc;
        }

        .bytebodh-hero-gradient {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bytebodh-hero-description {
          font-size: 1.2rem;
          color: #cbd5e1;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .bytebodh-search-box {
          max-width: 500px;
          margin: 0 auto;
        }

        .bytebodh-search-input {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border-radius: 12px;
          padding: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .bytebodh-search-icon {
          color: #64748b;
          margin: 0 1rem;
        }

        .bytebodh-search-field {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.5rem 0;
          font-size: 1rem;
          background: transparent;
        }

        .bytebodh-search-btn {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1.5rem;
          font-weight: 600;
        }

        .bytebodh-blog-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
        }

        .bytebodh-blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .bytebodh-blog-image {
          position: relative;
          height: 200px;
          background: #1e293b;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
        }

        .bytebodh-blog-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bytebodh-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #64748b;
        }

        .bytebodh-placeholder-icon {
          opacity: 0.5;
        }

        .bytebodh-category-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .bytebodh-blog-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .bytebodh-meta-item {
          display: flex;
          align-items: center;
        }

        .bytebodh-blog-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.1rem;
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .bytebodh-blog-excerpt {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .bytebodh-blog-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bytebodh-read-time {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .bytebodh-read-more {
          color: #0284c7;
          text-decoration: none;
          font-weight: 600;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .bytebodh-read-more:hover {
          color: #0369a1;
          text-decoration: none;
        }

        /* Sidebar Styles */
        .bytebodh-sidebar-widget {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .bytebodh-widget-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .bytebodh-categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .bytebodh-category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          color: #475569;
          text-decoration: none;
          border-bottom: 1px solid #f1f5f9;
          transition: color 0.3s ease;
        }

        .bytebodh-category-item:hover {
          color: #0284c7;
          text-decoration: none;
        }

        .bytebodh-category-item:last-child {
          border-bottom: none;
        }

        .bytebodh-category-count {
          background: #f1f5f9;
          color: #64748b;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .bytebodh-popular-posts {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bytebodh-popular-post {
          display: flex;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
          padding: 0.75rem;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .bytebodh-popular-post:hover {
          background: #f8fafc;
          text-decoration: none;
          color: inherit;
        }

        .bytebodh-popular-content h6 {
          color: #0f172a;
          font-weight: 600;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 0.25rem;
        }

        .bytebodh-popular-content span {
          color: #64748b;
          font-size: 0.8rem;
        }

        .bytebodh-newsletter-text {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .bytebodh-newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .bytebodh-newsletter-input {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.9rem;
          transition: border-color 0.3s ease;
        }

        .bytebodh-newsletter-input:focus {
          outline: none;
          border-color: #0284c7;
        }

        .bytebodh-newsletter-btn {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .bytebodh-hero-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-hero-description {
            font-size: 1.1rem;
          }
          
          .bytebodh-search-input {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .bytebodh-search-field {
            width: 100%;
          }

          .bytebodh-blog-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .bytebodh-blog-footer {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}

export default Blog;
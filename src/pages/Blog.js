// src/pages/Blog.js
import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaCalendar, FaUser, FaArrowRight, FaSearch, FaTag } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Build a Website on a Budget: Complete Guide for Startups",
      excerpt: "Learn how to create a professional website without breaking the bank. Perfect for solo entrepreneurs and small businesses.",
      image: "/images/blog-website-budget.jpg",
      category: "Web Development",
      author: "ByteBodh Team",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      tags: ["Budget", "Startup", "Web Development"]
    },
    {
      id: 2,
      title: "Mobile App Development: React Native vs Flutter",
      excerpt: "Comparing the two most popular cross-platform frameworks to help you choose the right one for your project.",
      image: "/images/blog-mobile-comparison.jpg",
      category: "Mobile Development",
      author: "ByteBodh Team",
      date: "Dec 10, 2024",
      readTime: "12 min read",
      tags: ["React Native", "Flutter", "Mobile"]
    },
    {
      id: 3,
      title: "Cloud Solutions for Small Businesses: AWS vs Azure vs Google Cloud",
      excerpt: "Understanding cloud pricing and features to make the best choice for your growing business.",
      image: "/images/blog-cloud-comparison.jpg",
      category: "Cloud Computing",
      author: "ByteBodh Team",
      date: "Dec 5, 2024",
      readTime: "10 min read",
      tags: ["AWS", "Azure", "Google Cloud"]
    },
    {
      id: 4,
      title: "Essential Security Practices for Your Startup Website",
      excerpt: "Protect your business and customer data with these must-implement security measures.",
      image: "/images/blog-security.jpg",
      category: "Security",
      author: "ByteBodh Team",
      date: "Nov 28, 2024",
      readTime: "6 min read",
      tags: ["Security", "Best Practices", "Web"]
    },
    {
      id: 5,
      title: "From Idea to MVP: Launch Your Product in 30 Days",
      excerpt: "A step-by-step guide to building and launching your minimum viable product quickly and efficiently.",
      image: "/images/blog-mvp-guide.jpg",
      category: "Product Development",
      author: "ByteBodh Team",
      date: "Nov 20, 2024",
      readTime: "15 min read",
      tags: ["MVP", "Product", "Launch"]
    },
    {
      id: 6,
      title: "Cost-Effective Digital Marketing Strategies for Startups",
      excerpt: "Maximize your marketing impact with limited resources using these proven strategies.",
      image: "/images/blog-marketing.jpg",
      category: "Marketing",
      author: "ByteBodh Team",
      date: "Nov 15, 2024",
      readTime: "9 min read",
      tags: ["Marketing", "Growth", "Startup"]
    }
  ];

  const categories = [
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "Security",
    "Product Development",
    "Marketing",
    "Budget Tips"
  ];

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
          <Row>
            {/* Main Blog Posts */}
            <Col lg={8}>
              <Row className="g-4">
                {blogPosts.map((post) => (
                  <Col key={post.id} md={6}>
                    <Card className="bytebodh-blog-card">
                      <div className="bytebodh-blog-image">
                        <div className="bytebodh-image-placeholder">
                          <FaTag size={32} className="bytebodh-placeholder-icon" />
                        </div>
                        <Badge bg="primary" className="bytebodh-category-badge">
                          {post.category}
                        </Badge>
                      </div>
                      <Card.Body>
                        <div className="bytebodh-blog-meta mb-2">
                          <span className="bytebodh-meta-item">
                            <FaUser className="me-1" />
                            {post.author}
                          </span>
                          <span className="bytebodh-meta-item">
                            <FaCalendar className="me-1" />
                            {post.date}
                          </span>
                        </div>
                        <Card.Title className="bytebodh-blog-title">
                          {post.title}
                        </Card.Title>
                        <Card.Text className="bytebodh-blog-excerpt">
                          {post.excerpt}
                        </Card.Text>
                        <div className="bytebodh-blog-tags mb-3">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="bytebodh-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="bytebodh-blog-footer">
                          <span className="bytebodh-read-time">{post.readTime}</span>
                          <Button variant="link" className="bytebodh-read-more">
                            Read More <FaArrowRight className="ms-1" />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Load More Button */}
              <div className="text-center mt-5">
                <Button className="bytebodh-load-more-btn">
                  Load More Articles
                </Button>
              </div>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              <div className="bytebodh-blog-sidebar">
                {/* Categories */}
                <Card className="bytebodh-sidebar-widget mb-4">
                  <Card.Body>
                    <h5 className="bytebodh-widget-title">Categories</h5>
                    <div className="bytebodh-categories-list">
                      {categories.map((category, index) => (
                        <a key={index} href="#" className="bytebodh-category-item">
                          <span>{category}</span>
                          <span className="bytebodh-category-count">12</span>
                        </a>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Popular Posts */}
                <Card className="bytebodh-sidebar-widget mb-4">
                  <Card.Body>
                    <h5 className="bytebodh-widget-title">Popular Posts</h5>
                    <div className="bytebodh-popular-posts">
                      {blogPosts.slice(0, 3).map((post) => (
                        <a key={post.id} href="#" className="bytebodh-popular-post">
                          <div className="bytebodh-popular-content">
                            <h6>{post.title}</h6>
                            <span>{post.date}</span>
                          </div>
                        </a>
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
        </Container>
      </section>

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

        .bytebodh-blog-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .bytebodh-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
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
        }

        .bytebodh-read-more:hover {
          color: #0369a1;
        }

        .bytebodh-load-more-btn {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.875rem 2rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .bytebodh-load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
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
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
}

export default Blog;
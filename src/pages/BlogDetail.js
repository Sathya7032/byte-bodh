// src/pages/BlogDetail.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import { FaCalendar, FaUser, FaArrowLeft, FaEye, FaClock } from "react-icons/fa";
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
        <div className="bytebodh-blog-detail-page">
          <Container>
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading blog post...</p>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Header />
        <div className="bytebodh-blog-detail-page">
          <Container>
            <div className="text-center py-5">
              <h3>Blog Post Not Found</h3>
              <p className="text-muted mb-4">{error || "The requested blog post could not be found."}</p>
              <Link to="/blogs" className="bytebodh-back-btn">
                <FaArrowLeft className="me-2" />
                Back to Blogs
              </Link>
            </div>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bytebodh-blog-detail-page">
        {/* Blog Hero Section */}
        <section className="bytebodh-blog-detail-hero">
          <Container>
            <div className="bytebodh-breadcrumb mb-4">
              <Link to="/blogs" className="bytebodh-back-btn">
                <FaArrowLeft className="me-2" />
                Back to Blogs
              </Link>
            </div>
            
            <Row className="justify-content-center">
              <Col lg={8}>
                <Badge bg="primary" className="bytebodh-category-badge mb-3">
                  {blog.category?.name || "Uncategorized"}
                </Badge>
                
                <h1 className="bytebodh-blog-detail-title mb-4">
                  {blog.title}
                </h1>
                
                <p className="bytebodh-blog-detail-excerpt">
                  {blog.excerpt}
                </p>
                
                <div className="bytebodh-blog-meta">
                  <div className="bytebodh-meta-item">
                    <FaUser className="me-2" />
                    <span>By {blog.author || "ByteBodh Team"}</span>
                  </div>
                  <div className="bytebodh-meta-item">
                    <FaCalendar className="me-2" />
                    <span>{new Date(blog.published_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="bytebodh-meta-item">
                    <FaClock className="me-2" />
                    <span>{blog.read_time || 5} min read</span>
                  </div>
                  <div className="bytebodh-meta-item">
                    <FaEye className="me-2" />
                    <span>{blog.views} views</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Blog Content Section */}
        <section className="bytebodh-blog-content-section py-5">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <article className="bytebodh-blog-article">
                  {blog.featured_image && (
                    <div className="bytebodh-blog-featured-image mb-5">
                      <img 
                        src={blog.featured_image} 
                        alt={blog.title}
                        className="img-fluid rounded"
                      />
                    </div>
                  )}
                  
                  <div 
                    className="bytebodh-blog-content"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="bytebodh-blog-tags mt-5">
                      <h6 className="bytebodh-tags-title">Tags:</h6>
                      <div className="bytebodh-tags-list">
                        {blog.tags.map((tag, index) => (
                          <Badge 
                            key={tag.id} 
                            bg="outline-primary" 
                            className="bytebodh-tag me-2 mb-2"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
                
                {/* Navigation */}
                <div className="bytebodh-blog-navigation mt-5 pt-4 border-top">
                  <Row>
                    <Col className="text-center">
                      <Link to="/blogs" className="bytebodh-back-to-blogs-btn">
                        <FaArrowLeft className="me-2" />
                        Back to All Blogs
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <style jsx>{`
        .bytebodh-blog-detail-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .bytebodh-blog-detail-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 3rem 0 4rem;
        }

        .bytebodh-breadcrumb {
          opacity: 0.9;
        }

        .bytebodh-back-btn {
          color: #cbd5e1;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .bytebodh-back-btn:hover {
          color: #ffffff;
          text-decoration: none;
        }

        .bytebodh-category-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 6px;
        }

        .bytebodh-blog-detail-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          color: #f8fafc;
          margin-bottom: 1rem;
        }

        .bytebodh-blog-detail-excerpt {
          font-size: 1.2rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .bytebodh-blog-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          font-size: 0.95rem;
          color: #94a3b8;
        }

        .bytebodh-meta-item {
          display: flex;
          align-items: center;
        }

        .bytebodh-blog-content-section {
          background: white;
        }

        .bytebodh-blog-article {
          color: #374151;
          line-height: 1.7;
        }

        .bytebodh-blog-featured-image img {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .bytebodh-blog-content {
          font-size: 1.1rem;
          color: #374151;
        }

        .bytebodh-blog-content h1,
        .bytebodh-blog-content h2,
        .bytebodh-blog-content h3,
        .bytebodh-blog-content h4,
        .bytebodh-blog-content h5,
        .bytebodh-blog-content h6 {
          color: #0f172a;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .bytebodh-blog-content h1 { font-size: 2rem; }
        .bytebodh-blog-content h2 { font-size: 1.75rem; }
        .bytebodh-blog-content h3 { font-size: 1.5rem; }
        .bytebodh-blog-content h4 { font-size: 1.25rem; }
        .bytebodh-blog-content h5 { font-size: 1.1rem; }
        .bytebodh-blog-content h6 { font-size: 1rem; }

        .bytebodh-blog-content p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .bytebodh-blog-content ul,
        .bytebodh-blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .bytebodh-blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .bytebodh-blog-content strong {
          color: #0f172a;
          font-weight: 600;
        }

        .bytebodh-blog-content code {
          background: #f1f5f9;
          color: #dc2626;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .bytebodh-blog-content pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .bytebodh-blog-content pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        .bytebodh-blog-content blockquote {
          border-left: 4px solid #0284c7;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          color: #64748b;
          font-style: italic;
        }

        .bytebodh-tags-title {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .bytebodh-tag {
          background: #f1f5f9 !important;
          color: #475569 !important;
          border: 1px solid #e2e8f0 !important;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 20px;
        }

        .bytebodh-back-to-blogs-btn {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          color: white;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .bytebodh-back-to-blogs-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
          color: white;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .bytebodh-blog-detail-hero {
            padding: 2rem 0 3rem;
          }

          .bytebodh-blog-detail-title {
            font-size: 2rem;
          }

          .bytebodh-blog-detail-excerpt {
            font-size: 1.1rem;
          }

          .bytebodh-blog-meta {
            flex-direction: column;
            gap: 1rem;
          }

          .bytebodh-blog-content {
            font-size: 1rem;
          }

          .bytebodh-blog-content h1 { font-size: 1.75rem; }
          .bytebodh-blog-content h2 { font-size: 1.5rem; }
          .bytebodh-blog-content h3 { font-size: 1.25rem; }
        }
      `}</style>
      <Footer />
    </>
  );
}

export default BlogDetail;
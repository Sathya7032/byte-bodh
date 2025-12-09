// src/pages/Products.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaQrcode, FaFileAlt, FaBusinessTime, FaMobile, FaSearch, FaRocket, FaUsers, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const products = [
    {
      id: 1,
      title: "QR Code Generator",
      description: "Create professional, customizable QR codes instantly with logo support, color customization, and multiple download formats.",
      icon: <FaQrcode />,
      category: "Marketing Tools",
      features: ["Custom Colors", "Logo Upload", "Multiple Formats", "Instant Download"],
      status: "Live",
      path: "/qr",
      color: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)"
    },
    {
      id: 2,
      title: "Resume Maker Pro",
      description: "Create professional resumes with beautiful templates, AI-powered suggestions, and easy customization options.",
      icon: <FaFileAlt />,
      category: "Career Tools",
      features: ["15+ Templates", "AI Suggestions", "PDF Export", "ATS Friendly"],
      status: "Coming Soon",
      path: "/coming-soon",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    },
    {
      id: 3,
      title: "Business Profile Builder",
      description: "Build stunning digital business profiles with integrated QR codes, contact management, and analytics.",
      icon: <FaBusinessTime />,
      category: "Business Tools",
      features: ["QR Integration", "Contact Cards", "Analytics", "Custom Domain"],
      status: "Beta",
      path: "/coming-soon",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    },
    {
      id: 4,
      title: "QR Scanner Pro",
      description: "Advanced QR code scanner with batch scanning, history tracking, and business card detection.",
      icon: <FaMobile />,
      category: "Utility Tools",
      features: ["Batch Scan", "History", "Export Data", "Offline Mode"],
      status: "In Development",
      path: "/coming-soon",
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
    },
    {
      id: 5,
      title: "Digital Business Cards",
      description: "Create interactive digital business cards that can be shared via QR codes, links, or NFC.",
      icon: <FaUsers />,
      category: "Networking Tools",
      features: ["Interactive Cards", "QR Sharing", "Analytics", "Contact Sync"],
      status: "Planned",
      path: "/coming-soon",
      color: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
    },
    {
      id: 6,
      title: "Marketing Analytics",
      description: "Track QR code performance, campaign analytics, and customer engagement metrics.",
      icon: <FaChartLine />,
      category: "Analytics Tools",
      features: ["QR Analytics", "Campaign Tracking", "Real-time Data", "Export Reports"],
      status: "Planned",
      path: "/coming-soon",
      color: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Live':
        return <Badge bg="success" className="product-status-badge">Live</Badge>;
      case 'Coming Soon':
        return <Badge bg="warning" className="product-status-badge">Coming Soon</Badge>;
      case 'Beta':
        return <Badge bg="info" className="product-status-badge">Beta</Badge>;
      case 'In Development':
        return <Badge bg="primary" className="product-status-badge">In Development</Badge>;
      case 'Planned':
        return <Badge bg="secondary" className="product-status-badge">Planned</Badge>;
      default:
        return <Badge bg="light" text="dark" className="product-status-badge">{status}</Badge>;
    }
  };

  return (
    <>
      <Header />
      <div className="bytebodh-products-page">

        {/* Hero Section */}
        <section className="bytebodh-products-hero">
          <Container>
            <Row className="text-center py-5">
              <Col lg={8} className="mx-auto">
                <Badge bg="primary" className="bytebodh-hero-badge mb-3">
                  <FaRocket className="me-2" />
                  Our Products
                </Badge>

                <h1 className="bytebodh-hero-title mb-3">
                  Explore <span className="bytebodh-hero-gradient">ByteBodh Tools</span>
                </h1>

                <p className="bytebodh-hero-description">
                  Discover our suite of digital tools designed to empower businesses and students.
                  From QR code generation to professional resume building, we create solutions that
                  simplify tasks and enhance productivity.
                </p>

                {/* Search Box */}
                <div className="bytebodh-search-box mt-4">
                  <div className="bytebodh-search-input">
                    <FaSearch className="bytebodh-search-icon" />
                    <input
                      type="text"
                      placeholder="Search tools by name, category, or features..."
                      className="bytebodh-search-field"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

              </Col>
            </Row>
          </Container>
        </section>

        {/* Products List Section */}
        <section className="bytebodh-products-list-section py-5">
          <Container>
            {/* Products Count */}
            <Row className="mb-4">
              <Col>
                <h4 className="bytebodh-products-count">
                  {filteredProducts.length} Digital Tools Available
                </h4>
              </Col>
            </Row>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <Row>
                <Col className="text-center">
                  <div className="bytebodh-no-products">
                    <h5>No Tools Found</h5>
                    <p>Try different keywords or check back soon for new product announcements.</p>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row className="g-4">
                {filteredProducts.map((product) => (
                  <Col key={product.id} lg={6}>
                    <Card className="bytebodh-product-card h-100">
                      <Card.Body className="d-flex flex-column">

                        {/* Product Header */}
                        <div className="bytebodh-product-header mb-3">
                          <div className="bytebodh-product-title-section">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="bytebodh-product-icon" style={{background: product.color}}>
                                {product.icon}
                              </div>
                              {getStatusBadge(product.status)}
                            </div>
                            
                            <h5 className="bytebodh-product-title mt-3">
                              {product.title}
                            </h5>

                            <Badge bg="light" text="dark" className="bytebodh-category-badge">
                              {product.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Product Description */}
                        <div className="bytebodh-product-description mb-3">
                          <p className="mb-0">{product.description}</p>
                        </div>

                        {/* Product Features */}
                        <div className="bytebodh-product-features mb-3">
                          <h6 className="bytebodh-features-title">Key Features:</h6>
                          <div className="bytebodh-features-grid">
                            {product.features.map((feature, index) => (
                              <div key={index} className="bytebodh-feature-item">
                                <div className="bytebodh-feature-dot"></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto d-flex gap-2">
                          <Link 
                            to={product.path}
                            className="bytebodh-view-btn"
                          >
                            {product.status === 'Live' ? 'Try Now' : 'Learn More'}
                          </Link>
                          {product.status === 'Live' && (
                            <Button 
                              variant="primary" 
                              className="bytebodh-try-btn"
                              as={Link}
                              to={product.path}
                            >
                              <FaRocket className="me-2" />
                              Launch Tool
                            </Button>
                          )}
                        </div>

                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {/* CTA Section */}
            <Row className="mt-5">
              <Col>
                <div className="bytebodh-products-cta text-center p-5">
                  <h3 className="mb-3">Need a Custom Solution?</h3>
                  <p className="bytebodh-cta-description mb-4">
                    Have specific requirements for your business or educational institution?
                    Let's build a custom tool tailored to your needs.
                  </p>
                  <Button 
                    variant="outline-primary" 
                    size="lg"
                    className="bytebodh-cta-btn"
                    href="mailto:info@bytebodh.in"
                  >
                    Contact Us for Custom Solutions
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>

      <Footer />

      {/* STYLES - Modified for Products */}
      <style jsx>{`
        .bytebodh-products-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .bytebodh-products-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 4rem 0;
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
          margin-bottom: 1rem;
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
          padding: 0.5rem 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .bytebodh-search-icon {
          color: #64748b;
          margin-right: 0.5rem;
          font-size: 1.1rem;
        }

        .bytebodh-search-field {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.75rem 0;
          font-size: 1rem;
          background: transparent;
        }

        .bytebodh-products-list-section {
          background: white;
        }

        .bytebodh-products-count {
          color: #0f172a;
          font-weight: 600;
        }

        .bytebodh-product-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          background: white;
        }

        .bytebodh-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .bytebodh-product-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .product-status-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .bytebodh-product-title {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .bytebodh-category-badge {
          background: #f1f5f9 !important;
          color: #475569 !important;
          font-weight: 500;
          border-radius: 8px;
          padding: 0.25rem 0.75rem;
        }

        .bytebodh-product-description {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .bytebodh-features-title {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .bytebodh-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .bytebodh-feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #475569;
        }

        .bytebodh-feature-dot {
          width: 6px;
          height: 6px;
          background: #0284c7;
          border-radius: 50%;
        }

        .bytebodh-view-btn {
          display: inline-block;
          background: transparent;
          color: #0284c7;
          border: 2px solid #0284c7;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          flex: 1;
          transition: all 0.3s ease;
        }

        .bytebodh-view-btn:hover {
          background: #0284c7;
          color: white;
          text-decoration: none;
        }

        .bytebodh-try-btn {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none !important;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          flex: 1;
          transition: all 0.3s ease;
        }

        .bytebodh-try-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
        }

        .bytebodh-no-products {
          padding: 3rem 1rem;
          color: #64748b;
        }

        .bytebodh-no-products h5 {
          color: #475569;
          margin-bottom: 1rem;
        }

        .bytebodh-products-cta {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .bytebodh-products-cta h3 {
          color: #0f172a;
          font-weight: 600;
        }

        .bytebodh-cta-description {
          color: #64748b;
          max-width: 500px;
          margin: 0 auto;
        }

        .bytebodh-cta-btn {
          border: 2px solid #0284c7;
          color: #0284c7;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .bytebodh-cta-btn:hover {
          background: #0284c7;
          color: white;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .bytebodh-hero-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-features-grid {
            grid-template-columns: 1fr;
          }
          
          .bytebodh-view-btn,
          .bytebodh-try-btn {
            flex: none;
            width: 100%;
          }
          
          .d-flex.gap-2 {
            flex-direction: column;
          }
          
          .bytebodh-products-cta {
            padding: 2rem 1rem !important;
          }
        }
      `}</style>
    </>
  );
}

export default Products;
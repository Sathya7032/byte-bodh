// src/pages/AboutUs.js
import React from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AboutUs() {


  return (
    <>
      <Header />
      <div className="bytebodh-about-page">
        {/* Hero Section */}
        <section className="bytebodh-about-hero">
          <Container>
            <Row className="text-center py-5">
              <Col lg={8} className="mx-auto">
                <Badge bg="primary" className="bytebodh-hero-badge mb-3">
                  Learn & Grow
                </Badge>
                <h1 className="bytebodh-hero-title mb-3">
                  About <span className="bytebodh-hero-gradient">ByteBodh</span>
                </h1>
                <p className="bytebodh-hero-description">
                  Empowering students and small businesses with affordable technology solutions 
                  and comprehensive learning resources.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Mission Section */}
        <section className="bytebodh-mission-section py-5">
          <Container>
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="ByteBodh Team" 
                  className="bytebodh-mission-image"
                />
              </Col>
              <Col lg={6}>
                <h2 className="bytebodh-section-title mb-4">Our Mission</h2>
                <p className="bytebodh-mission-text mb-4">
                  At ByteBodh, we believe that knowledge and technology should be accessible to everyone, 
                  regardless of their budget or background. We're committed to bridging the gap between 
                  ambition and opportunity.
                </p>
                <p className="bytebodh-mission-text">
                  Our platform serves as a comprehensive ecosystem where learning meets practical application, 
                  empowering individuals and businesses to thrive in the digital age.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Services Section */}
        <section className="bytebodh-services-section py-5">
          <Container>
            <Row>
              <Col lg={6} className="mb-5">
                <div className="bytebodh-service-card">
                  <h3 className="bytebodh-service-title">For Students & Learners</h3>
                  <p className="bytebodh-service-description">
                    We provide comprehensive learning resources including:
                  </p>
                  <ul className="bytebodh-service-list">
                    <li>📚 Detailed Tutorials & Guides</li>
                    <li>🎥 Video Learning Content</li>
                    <li>💻 Practical Coding Examples</li>
                    <li>🛠️ Hands-on Projects</li>
                    <li>📖 Educational Blog Posts</li>
                    <li>🎯 Career Guidance</li>
                  </ul>
                  <p className="bytebodh-service-note">
                    Our student-focused approach ensures that complex concepts are broken down into 
                    easily understandable content, making learning technology accessible and enjoyable.
                  </p>
                </div>
              </Col>
              
              <Col lg={6} className="mb-5">
                <div className="bytebodh-service-card">
                  <h3 className="bytebodh-service-title">For Small Businesses</h3>
                  <p className="bytebodh-service-description">
                    We offer affordable solutions for:
                  </p>
                  <ul className="bytebodh-service-list">
                    <li>🌐 Website Development</li>
                    <li>📱 Mobile Applications</li>
                    <li>🛒 E-commerce Solutions</li>
                    <li>☁️ Digital Transformation</li>
                    <li>🎨 UI/UX Design</li>
                    <li>🚀 MVP Development</li>
                  </ul>
                  <p className="bytebodh-service-note">
                    We understand the budget constraints of small and micro-scale businesses and provide 
                    high-quality solutions at prices that won't break the bank.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Why Choose Us */}
        <section className="bytebodh-why-section py-5">
          <Container>
            <Row className="text-center mb-5">
              <Col lg={8} className="mx-auto">
                <h2 className="bytebodh-section-title">Why Choose ByteBodh?</h2>
                <p className="bytebodh-section-description">
                  We stand out by making technology and education accessible to all
                </p>
              </Col>
            </Row>
            <Row className="g-4">
              <Col md={4}>
                <div className="bytebodh-feature-box">
                  <div className="bytebodh-feature-icon">💰</div>
                  <h5>Budget-Friendly</h5>
                  <p>Quality solutions and education at affordable prices for everyone</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="bytebodh-feature-box">
                  <div className="bytebodh-feature-icon">🎓</div>
                  <h5>Expert Guidance</h5>
                  <p>Learn from industry experts and get professional solutions</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="bytebodh-feature-box">
                  <div className="bytebodh-feature-icon">⚡</div>
                  <h5>Quick Delivery</h5>
                  <p>Fast turnaround times without compromising on quality</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="bytebodh-cta-section py-5">
          <Container>
            <Row className="text-center">
              <Col lg={8} className="mx-auto">
                <h2 className="bytebodh-cta-title">Ready to Get Started?</h2>
                <p className="bytebodh-cta-description">
                  Whether you're a student looking to learn or a business seeking affordable solutions, 
                  we're here to help you succeed.
                </p>
                <div className="bytebodh-cta-buttons">
                  <Button className="bytebodh-cta-btn primary">Explore Learning Resources</Button>
                  <Button className="bytebodh-cta-btn secondary">Get Business Solutions</Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <style jsx>{`
          .bytebodh-about-page {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            min-height: 100vh;
          }

          .bytebodh-about-hero {
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
            padding: 0.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .bytebodh-search-icon {
            color: #64748b;
            margin: 0 1rem;
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

          .bytebodh-search-btn {
            background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            color: white;
          }

          .bytebodh-mission-section {
            background: white;
          }

          .bytebodh-mission-image {
            width: 100%;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

          .bytebodh-section-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 1rem;
          }

          .bytebodh-mission-text {
            font-size: 1.1rem;
            color: #64748b;
            line-height: 1.7;
            margin-bottom: 1rem;
          }

          .bytebodh-services-section {
            background: #f8fafc;
          }

          .bytebodh-service-card {
            background: white;
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            height: 100%;
          }

          .bytebodh-service-title {
            color: #0f172a;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .bytebodh-service-description {
            color: #475569;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            font-weight: 500;
          }

          .bytebodh-service-list {
            list-style: none;
            padding: 0;
            margin-bottom: 2rem;
          }

          .bytebodh-service-list li {
            padding: 0.5rem 0;
            color: #64748b;
            font-size: 1rem;
          }

          .bytebodh-service-note {
            color: #475569;
            font-style: italic;
            line-height: 1.6;
            border-left: 4px solid #0284c7;
            padding-left: 1rem;
          }

          .bytebodh-why-section {
            background: white;
          }

          .bytebodh-section-description {
            font-size: 1.1rem;
            color: #64748b;
            line-height: 1.6;
          }

          .bytebodh-feature-box {
            text-align: center;
            padding: 2rem 1.5rem;
            border-radius: 16px;
            background: #f8fafc;
            transition: transform 0.3s ease;
          }

          .bytebodh-feature-box:hover {
            transform: translateY(-5px);
          }

          .bytebodh-feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .bytebodh-feature-box h5 {
            color: #0f172a;
            font-weight: 600;
            margin-bottom: 1rem;
          }

          .bytebodh-feature-box p {
            color: #64748b;
            line-height: 1.6;
            margin: 0;
          }

          .bytebodh-cta-section {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
          }

          .bytebodh-cta-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 1rem;
          }

          .bytebodh-cta-description {
            font-size: 1.2rem;
            color: #cbd5e1;
            line-height: 1.6;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .bytebodh-cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .bytebodh-cta-btn {
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            transition: all 0.3s ease;
          }

          .bytebodh-cta-btn.primary {
            background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
            color: white;
          }

          .bytebodh-cta-btn.secondary {
            background: transparent;
            color: white;
            border: 2px solid #334155;
          }

          .bytebodh-cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
          }

          @media (max-width: 768px) {
            .bytebodh-hero-title {
              font-size: 2.25rem;
            }
            
            .bytebodh-section-title {
              font-size: 2rem;
            }
            
            .bytebodh-cta-title {
              font-size: 2rem;
            }
            
            .bytebodh-search-input {
              flex-direction: column;
              gap: 0.5rem;
            }
            
            .bytebodh-search-field {
              width: 100%;
              text-align: center;
            }
            
            .bytebodh-cta-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .bytebodh-cta-btn {
              width: 100%;
              max-width: 300px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
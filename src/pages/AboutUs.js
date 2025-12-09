// src/pages/AboutUs.js (Updated for Option B: Tools + Learning Resources)
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
                  Learn, Build & Grow
                </Badge>
                <h1 className="bytebodh-hero-title mb-3">
                  About <span className="bytebodh-hero-gradient">ByteBodh</span>
                </h1>
                <p className="bytebodh-hero-description">
                  Empowering students and small businesses with digital tools, practical
                  learning resources, and growth-focused solutions to build a stronger
                  online presence.
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
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="ByteBodh Team"
                  className="bytebodh-mission-image"
                />
              </Col>
              <Col lg={6}>
                <h2 className="bytebodh-section-title mb-4">Our Mission</h2>
                <p className="bytebodh-mission-text mb-4">
                  At ByteBodh, our goal is to bridge the gap between learning and
                  practical application. We help students improve their technical skills
                  and support small businesses with tools that enhance productivity and
                  online visibility.
                </p>
                <p className="bytebodh-mission-text">
                  Whether you're learning to code, exploring digital tools, or growing a
                  business, ByteBodh serves as your all‑in‑one digital companion.
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
                    We provide learning support and essential digital tools to help you
                    grow.
                  </p>
                  <ul className="bytebodh-service-list">
                    <li>📚 Beginner‑friendly Tutorials</li>
                    <li>🛠️ Project‑based Learning</li>
                    <li>💡 Tech Guides & Resources</li>
                    <li>📦 Useful Tools for Coding & Productivity</li>
                    <li>📖 Community Learning Support</li>
                  </ul>
                  <p className="bytebodh-service-note">
                    We ensure that concepts are easy to understand and directly connected
                    to real‑world use cases.
                  </p>
                </div>
              </Col>

              <Col lg={6} className="mb-5">
                <div className="bytebodh-service-card">
                  <h3 className="bytebodh-service-title">For Small Businesses</h3>
                  <p className="bytebodh-service-description">
                    We help businesses improve efficiency and strengthen their online
                    presence.
                  </p>
                  <ul className="bytebodh-service-list">
                    <li>🌐 Websites & Portfolio Pages</li>
                    <li>⚙️ Digital Tools to Manage Your Business</li>
                    <li>📱 Simple Apps for Daily Operations</li>
                    <li>🛒 Lightweight E‑commerce Solutions</li>
                    <li>📊 Online Presence Boosting Tools</li>
                  </ul>
                  <p className="bytebodh-service-note">
                    Our solutions are tailored for micro and small businesses who want
                    growth without heavy expenses.
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
                  A perfect blend of learning + practical tools for real‑world growth.
                </p>
              </Col>
            </Row>
            <Row className="g-4">
              <Col md={4}>
                <div className="bytebodh-feature-box">
                  <div className="bytebodh-feature-icon">💰</div>
                  <h5>Affordable Solutions</h5>
                  <p>Quality tools and resources designed to fit every budget.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="bytebodh-feature-box">
                  <div className="bytebodh-feature-icon">🎓</div>
                  <h5>Education + Tools</h5>
                  <p>A unique mix of learning and practical business utilities.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="bytebodh-feature-box">
                  <div className="bytebodh-feature-icon">⚡</div>
                  <h5>Easy to Use</h5>
                  <p>Beginner‑friendly resources built for simplicity and speed.</p>
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
                <h2 className="bytebodh-cta-title">Start Your Growth Journey</h2>
                <p className="bytebodh-cta-description">
                  Whether you're learning new skills or growing your business, ByteBodh
                  gives you the tools and guidance you need.
                </p>
                <div className="bytebodh-cta-buttons">
                  <Button className="bytebodh-cta-btn primary">Explore Learning</Button>
                  <Button className="bytebodh-cta-btn secondary">Discover Tools</Button>
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
            border-radius: 50px;
          }

          .bytebodh-hero-title {
            font-size: 3rem;
            font-weight: 700;
            color: #f8fafc;
          }

          .bytebodh-hero-gradient {
            background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .bytebodh-hero-description {
            font-size: 1.2rem;
            color: #cbd5e1;
            max-width: 600px;
            margin: 0 auto;
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
          }

          .bytebodh-mission-text {
            font-size: 1.1rem;
            color: #64748b;
          }

          .bytebodh-services-section {
            background: #f1f5f9;
            border-radius: 20px;
          }

          .bytebodh-service-card {
            background: #ffffff;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
          }

          .bytebodh-service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          }

          .bytebodh-service-title {
            font-size: 1.6rem;
            font-weight: 600;
            color: #0f172a;
          }

          .bytebodh-service-description {
            color: #475569;
            margin-bottom: 1rem;
          }

          .bytebodh-service-list li {
            margin-bottom: 0.5rem;
            font-size: 1rem;
          }

          .bytebodh-service-note {
            margin-top: 1rem;
            font-size: 0.95rem;
            color: #64748b;
          }

          .bytebodh-why-section {
            background: #ffffff;
          }

          .bytebodh-feature-box {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            text-align: center;
            transition: all 0.3s ease;
          }

          .bytebodh-feature-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
          }

          .bytebodh-feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }

          .bytebodh-cta-section {
            background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
            color: white;
            padding: 4rem 0;
            border-radius: 20px;
            margin: 3rem;
          }

          .bytebodh-cta-title {
            font-size: 2.5rem;
            font-weight: 700;
          }

          .bytebodh-cta-description {
            color: #e2e8f0;
            margin-bottom: 2rem;
          }

          .bytebodh-cta-buttons .bytebodh-cta-btn {
            padding: 0.9rem 2rem;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 12px;
            margin: 0.5rem;
            transition: all 0.3s ease;
          }

          .bytebodh-cta-btn.primary {
            background: #ffffff;
            color: #1e293b;
            border: none;
          }

          .bytebodh-cta-btn.primary:hover {
            background: #e2e8f0;
            transform: translateY(-3px);
          }

          .bytebodh-cta-btn.secondary {
            background: transparent;
            border: 2px solid #ffffff;
            color: white;
          }

          .bytebodh-cta-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-3px);
          }

        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
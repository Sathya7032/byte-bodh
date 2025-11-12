// src/pages/AboutUs.js
import React from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { 
  FaRocket, 
  FaUsers, 
  FaHandHoldingUsd, 
  FaAward,
  FaLightbulb,
  FaShieldAlt,
  FaCode,
  FaMobile
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AboutUs() {
  const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '95%', label: 'Client Satisfaction' },
    { number: '₹5L+', label: 'Saved for Clients' },
    { number: '24/7', label: 'Support Available' }
  ];

  const values = [
    {
      icon: <FaHandHoldingUsd />,
      title: 'Budget-Friendly',
      description: 'We believe quality solutions should be accessible to everyone, regardless of budget size.'
    },
    {
      icon: <FaRocket />,
      title: 'Fast Delivery',
      description: 'Quick turnaround times without compromising on quality or attention to detail.'
    },
    {
      icon: <FaLightbulb />,
      title: 'Innovation',
      description: 'Staying updated with latest technologies to provide cutting-edge solutions.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Reliability',
      description: 'Consistent, dependable service with long-term support and maintenance.'
    }
  ];

  const services = [
    {
      icon: <FaCode />,
      title: 'Web Development',
      description: 'Responsive websites, e-commerce stores, and web applications',
      projects: '25+'
    },
    {
      icon: <FaMobile />,
      title: 'Mobile Apps',
      description: 'Cross-platform mobile applications for iOS and Android',
      projects: '15+'
    },
    {
      icon: <FaRocket />,
      title: 'MVP Development',
      description: 'Rapid prototyping and minimum viable product development',
      projects: '10+'
    }
  ];

  return (
    <>
    <Header />
    <div className="bytebodh-about-page">
      {/* Hero Section */}
      <section className="bytebodh-about-hero">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6}>
              <Badge bg="primary" className="bytebodh-hero-badge mb-3">
                Our Story
              </Badge>
              <h1 className="bytebodh-hero-title mb-4">
                Empowering Dreams with <span className="bytebodh-hero-gradient">Affordable Technology</span>
              </h1>
              <p className="bytebodh-hero-description mb-4">
                ByteBodh was born from a simple belief: every great idea deserves a chance to become reality, 
                regardless of budget constraints. We're passionate about helping solo entrepreneurs, startups, 
                and small businesses succeed in the digital world.
              </p>
              <p className="bytebodh-hero-description">
                Our mission is to democratize technology access by providing professional-grade solutions 
                at prices that won't break the bank. We've helped numerous businesses launch and grow 
                without the traditional high costs of digital transformation.
              </p>
            </Col>
            <Col lg={6}>
              <div className="bytebodh-hero-stats">
                <Row>
                  {stats.map((stat, index) => (
                    <Col key={index} sm={6} className="text-center mb-4">
                      <div className="bytebodh-stat-card">
                        <div className="bytebodh-stat-number">{stat.number}</div>
                        <div className="bytebodh-stat-label">{stat.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Values */}
      <section className="bytebodh-values-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="bytebodh-section-title mb-3">Our Values</h2>
              <p className="bytebodh-section-description">
                These core principles guide everything we do and define how we work with our clients.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {values.map((value, index) => (
              <Col key={index} lg={3} md={6}>
                <Card className="bytebodh-value-card">
                  <Card.Body className="text-center">
                    <div className="bytebodh-value-icon">
                      {value.icon}
                    </div>
                    <h5 className="bytebodh-value-title">{value.title}</h5>
                    <p className="bytebodh-value-description">{value.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Our Services */}
      <section className="bytebodh-services-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="bytebodh-section-title mb-3">What We Do</h2>
              <p className="bytebodh-section-description">
                Comprehensive technology solutions tailored for businesses of all sizes, 
                with a focus on affordability and quality.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {services.map((service, index) => (
              <Col key={index} lg={4} md={6}>
                <Card className="bytebodh-service-card">
                  <Card.Body>
                    <div className="bytebodh-service-icon">
                      {service.icon}
                    </div>
                    <h5 className="bytebodh-service-title">{service.title}</h5>
                    <p className="bytebodh-service-description">{service.description}</p>
                    <div className="bytebodh-service-projects">
                      <span>{service.projects} Projects</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="bytebodh-why-choose-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="bytebodh-section-title mb-4">Why Choose ByteBodh?</h2>
              <div className="bytebodh-features-list">
                <div className="bytebodh-feature-item">
                  <FaAward className="bytebodh-feature-icon" />
                  <div>
                    <h6>Proven Track Record</h6>
                    <p>50+ successful projects delivered on time and within budget</p>
                  </div>
                </div>
                <div className="bytebodh-feature-item">
                  <FaUsers className="bytebodh-feature-icon" />
                  <div>
                    <h6>Dedicated Support</h6>
                    <p>Personalized attention and ongoing support for all our clients</p>
                  </div>
                </div>
                <div className="bytebodh-feature-item">
                  <FaHandHoldingUsd className="bytebodh-feature-icon" />
                  <div>
                    <h6>Transparent Pricing</h6>
                    <p>No hidden costs with clear, upfront pricing for all services</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="bytebodh-skills-section">
                <h5 className="bytebodh-skills-title mb-4">Our Expertise</h5>
                <div className="bytebodh-skill-item">
                  <div className="bytebodh-skill-header">
                    <span>Web Development</span>
                    <span>95%</span>
                  </div>
                  <ProgressBar now={95} className="bytebodh-skill-progress" />
                </div>
                <div className="bytebodh-skill-item">
                  <div className="bytebodh-skill-header">
                    <span>Mobile Development</span>
                    <span>88%</span>
                  </div>
                  <ProgressBar now={88} className="bytebodh-skill-progress" />
                </div>
                <div className="bytebodh-skill-item">
                  <div className="bytebodh-skill-header">
                    <span>UI/UX Design</span>
                    <span>92%</span>
                  </div>
                  <ProgressBar now={92} className="bytebodh-skill-progress" />
                </div>
                <div className="bytebodh-skill-item">
                  <div className="bytebodh-skill-header">
                    <span>Cloud Solutions</span>
                    <span>85%</span>
                  </div>
                  <ProgressBar now={85} className="bytebodh-skill-progress" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bytebodh-about-cta py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="bytebodh-cta-title mb-3">Ready to Start Your Project?</h2>
              <p className="bytebodh-cta-description mb-4">
                Let's work together to bring your ideas to life. Get a free consultation and quote today.
              </p>
              <a href="/contact" className="bytebodh-cta-btn">
                Start Your Journey
              </a>
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
          padding: 5rem 0;
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
          font-size: 1.1rem;
          color: #cbd5e1;
          line-height: 1.7;
        }

        .bytebodh-stat-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem 1rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .bytebodh-stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .bytebodh-stat-label {
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .bytebodh-values-section,
        .bytebodh-services-section,
        .bytebodh-why-choose-section {
          background: white;
        }

        .bytebodh-section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .bytebodh-section-description {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .bytebodh-value-card {
          border: none;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
        }

        .bytebodh-value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .bytebodh-value-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
        }

        .bytebodh-value-title {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .bytebodh-value-description {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .bytebodh-service-card {
          border: none;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
        }

        .bytebodh-service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .bytebodh-service-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .bytebodh-service-title {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .bytebodh-service-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .bytebodh-service-projects {
          background: #f1f5f9;
          color: #475569;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-block;
        }

        .bytebodh-features-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .bytebodh-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .bytebodh-feature-icon {
          color: #0284c7;
          font-size: 1.5rem;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .bytebodh-feature-item h6 {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .bytebodh-feature-item p {
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        .bytebodh-skills-section {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .bytebodh-skills-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .bytebodh-skill-item {
          margin-bottom: 1.5rem;
        }

        .bytebodh-skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .bytebodh-skill-header span:first-child {
          color: #0f172a;
          font-weight: 500;
        }

        .bytebodh-skill-header span:last-child {
          color: #0284c7;
          font-weight: 600;
        }

        .bytebodh-skill-progress {
          height: 8px;
          border-radius: 4px;
          background: #f1f5f9;
        }

        .bytebodh-skill-progress .progress-bar {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          border-radius: 4px;
        }

        .bytebodh-about-cta {
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
          max-width: 600px;
          margin: 0 auto;
        }

        .bytebodh-cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .bytebodh-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(2, 132, 199, 0.4);
          color: white;
          text-decoration: none;
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
          
          .bytebodh-feature-item {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
}

export default AboutUs;
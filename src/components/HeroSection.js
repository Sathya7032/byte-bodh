// src/components/HeroSection.js
import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { 
  FaPlay, 
  FaArrowRight, 
  FaCheckCircle,
  FaStar
} from 'react-icons/fa';

function HeroSection() {
  

  const stats = [
    { number: '500+', label: 'Tutorials' },
    { number: '50+', label: 'Products' },
    { number: '10K+', label: 'Students' },
    { number: '95%', label: 'Satisfaction' }
  ];

  return (
    <section className="bytebodh-hero">
      <Container>
        <Row className="align-items-center min-vh-80 py-5">
          {/* Left Content */}
          <Col lg={6} className="bytebodh-hero-content">
            <Badge bg="primary" className="bytebodh-hero-badge mb-3">
              <FaStar className="me-2" />
              Trusted by 1000+ Small Businesses
            </Badge>
            
            <h1 className="bytebodh-hero-title mb-4">
              Transform Your Business with 
              <span className="bytebodh-hero-gradient"> Professional IT Solutions</span>
            </h1>
            
            <p className="bytebodh-hero-description mb-5">
              Master cutting-edge technologies with our expert tutorials and deploy powerful, 
              affordable IT products designed specifically for small-scale industries. 
              From websites to mobile apps - we've got you covered.
            </p>

           

            {/* CTA Buttons */}
            <div className="bytebodh-hero-actions d-flex flex-wrap gap-3">
              <Button className="bytebodh-btn-primary btn-lg">
                Explore Tutorials <FaArrowRight className="ms-2" />
              </Button>
              <Button className="bytebodh-btn-secondary btn-lg">
                <FaPlay className="me-2" />
                Watch Demo
              </Button>
            </div>
          </Col>

          {/* Right Content - Illustration */}
          <Col lg={6} className="bytebodh-hero-visual">
            <div className="bytebodh-hero-card">
              <div className="bytebodh-card-header">
                <div className="bytebodh-card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="bytebodh-card-content">
                <div className="bytebodh-card-item">
                  <FaCheckCircle className="bytebodh-card-icon text-success" />
                  <span>Website Development</span>
                </div>
                <div className="bytebodh-card-item">
                  <FaCheckCircle className="bytebodh-card-icon text-success" />
                  <span>Mobile Applications</span>
                </div>
                <div className="bytebodh-card-item">
                  <FaCheckCircle className="bytebodh-card-icon text-success" />
                  <span>E-commerce Solutions</span>
                </div>
                <div className="bytebodh-card-item">
                  <FaCheckCircle className="bytebodh-card-icon text-success" />
                  <span>Cloud Deployment</span>
                </div>
                <div className="bytebodh-card-item">
                  <FaCheckCircle className="bytebodh-card-icon text-success" />
                  <span>Security Setup</span>
                </div>
              </div>
              <div className="bytebodh-card-footer">
                <div className="bytebodh-card-badge">Perfect for Small Businesses</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Hero-specific CSS */}
      <style jsx>{`
        .bytebodh-hero {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          position: relative;
          overflow: hidden;
        }

        .bytebodh-hero::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }

        .min-vh-80 {
          min-height: 80vh;
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
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }

        .bytebodh-hero-gradient {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bytebodh-hero-description {
          font-size: 1.0rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 90%;
        }

        .bytebodh-hero-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .bytebodh-feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #475569;
          font-weight: 500;
        }

        .bytebodh-feature-icon {
          color: #0284c7;
          font-size: 1.1rem;
        }

        .bytebodh-feature-text {
          font-size: 0.95rem;
        }

        .bytebodh-btn-primary {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.875rem 2rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
          color: white;
        }

        .bytebodh-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
          color: white;
        }

        .bytebodh-btn-secondary {
          background: transparent !important;
          border: 2px solid #e2e8f0 !important;
          color: #475569 !important;
          padding: 0.875rem 2rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .bytebodh-btn-secondary:hover {
          border-color: #0284c7 !important;
          color: #0284c7 !important;
          transform: translateY(-2px);
          background: transparent !important;
        }

        .bytebodh-hero-stats {
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .bytebodh-stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }

        .bytebodh-stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        .bytebodh-hero-visual {
          position: relative;
          padding-left: 2rem;
        }

        .bytebodh-hero-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          transform: perspective(1000px) rotateY(-5deg);
          transition: all 0.3s ease;
        }

        .bytebodh-hero-card:hover {
          transform: perspective(1000px) rotateY(0deg);
        }

        .bytebodh-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .bytebodh-card-dots {
          display: flex;
          gap: 0.5rem;
        }

        .bytebodh-card-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e2e8f0;
        }

        .bytebodh-card-dots span:first-child {
          background: #ef4444;
        }

        .bytebodh-card-dots span:nth-child(2) {
          background: #f59e0b;
        }

        .bytebodh-card-dots span:last-child {
          background: #10b981;
        }

        .bytebodh-card-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bytebodh-card-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 10px;
          font-weight: 500;
          color: #334155;
          transition: all 0.3s ease;
        }

        .bytebodh-card-item:hover {
          background: #f1f5f9;
          transform: translateX(5px);
        }

        .bytebodh-card-icon {
          font-size: 1.1rem;
        }

        .bytebodh-card-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .bytebodh-card-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .bytebodh-hero-title {
            font-size: 2.2rem;
          }
          
          .bytebodh-hero-description {
            font-size: 1rem;
            max-width: 100%;
          }
          
          .bytebodh-hero-visual {
            padding-left: 0;
            margin-top: 3rem;
          }
          
          .bytebodh-hero-card {
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .bytebodh-hero-title {
            font-size: 2rem;
          }
          
          .bytebodh-hero-features {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .bytebodh-hero-title {
            font-size: 1.8rem;
          }
          
          .bytebodh-hero-actions {
            flex-direction: column;
          }
          
          .bytebodh-hero-actions .btn {
            width: 100%;
          }
          
          .bytebodh-hero-stats .row {
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
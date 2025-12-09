import React from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { FaArrowRight, FaStar, FaQrcode } from "react-icons/fa";
import Lottie from "lottie-react";
import animationData from "../assets/anime/hero.json";

function HeroSection() {
  const handleTryQRGenerator = () => {
    // Navigate to QR Generator page or section
    window.location.href = '/qr'; // Change this to your actual route
  };

  return (
    <section className="bytebodh-hero">
      <Container>
        <Row className="align-items-center min-vh-80 py-5">
          {/* Left Content */}
          <Col lg={7} className="bytebodh-hero-content">
            <Badge bg="primary" className="bytebodh-hero-badge mb-3">
              <FaStar className="me-2" />
              Empowering Students & Businesses
            </Badge>

            <h1 className="bytebodh-hero-title mb-4">
              Improve Your Online Presence with
              <span className="bytebodh-hero-gradient"> Smart Digital Tools</span>
            </h1>

            <p className="bytebodh-hero-description mb-4">
              ByteBodh provides modern, easy-to-use digital tools crafted for both
              growing businesses and ambitious students. Whether you want to
              strengthen your brand, automate daily work, enhance productivity, or
              build a powerful online identity, our solutions help you grow with
              confidence.
            </p>

            <p className="bytebodh-hero-description mb-5">
              <strong>Latest Feature:</strong> Try our new QR Code Generator to create
              professional, customizable QR codes instantly for your business needs.
            </p>

            {/* CTA Buttons */}
            <div className="bytebodh-hero-actions d-flex flex-wrap gap-3">
              <Button className="bytebodh-btn-primary btn-lg">
                Explore Tools <FaArrowRight className="ms-2" />
              </Button>
              <Button 
                className="bytebodh-btn-qr-highlight btn-lg"
                onClick={handleTryQRGenerator}
              >
                <FaQrcode className="me-2" />
                Try QR Generator
              </Button>
            </div>
          </Col>

          {/* Right Content - Lottie Animation */}
          <Col lg={5} className="bytebodh-hero-visual">
            <Lottie animationData={animationData} loop={true} style={{ width: "100%", height: "50%" }} />
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .bytebodh-hero {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          position: relative;
          overflow: hidden;
        }
        .bytebodh-hero::before {
          content: "";
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
          font-size: 1rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 90%;
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
        .bytebodh-btn-qr-highlight {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          border: none !important;
          padding: 0.875rem 2rem;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
          color: white !important;
          position: relative;
          overflow: hidden;
        }
        .bytebodh-btn-qr-highlight::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        .bytebodh-btn-qr-highlight:hover::before {
          left: 100%;
        }
        .bytebodh-btn-qr-highlight:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          color: white !important;
        }
        .bytebodh-hero-visual {
          position: relative;
          padding-left: 2rem;
        }
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
        }
        @media (max-width: 768px) {
          .bytebodh-hero-title {
            font-size: 2rem;
          }
          .bytebodh-hero-actions {
            flex-direction: column;
          }
          .bytebodh-hero-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
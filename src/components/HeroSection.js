import React from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { FaPlay, FaArrowRight, FaStar } from "react-icons/fa";
import Lottie from "lottie-react";
import animationData from "../assets/anime/hero.json"; // Replace with actual Lottie animation JSON file

function HeroSection() {
  return (
    <section className="bytebodh-hero">
      <Container>
        <Row className="align-items-center min-vh-80 py-5">
          {/* Left Content */}
          <Col lg={7} className="bytebodh-hero-content">
            <Badge bg="primary" className="bytebodh-hero-badge mb-3">
              <FaStar className="me-2" />
              Trusted by 1000+ Small Businesses
            </Badge>

            <h1 className="bytebodh-hero-title mb-4">
              Transform Your Business with
              <span className="bytebodh-hero-gradient">
                {" "}
                Professional IT Solutions
              </span>
            </h1>

            <p className="bytebodh-hero-description mb-5">
              At ByteBodh, we understand the unique challenges faced by small
              and individually started businesses. That's why we offer a
              comprehensive range of IT tutorials and products tailored to your
              specific needs. Whether you're looking to build an online presence
              with a professional website, streamline your operations with
              mobile apps, or enhance your tech skills, we've got you covered.
              Our expert-led tutorials provide step-by-step guidance, helping
              you master the latest tools and technologies with ease.
              Additionally, our affordable IT solutions are designed to scale
              with your business, allowing you to focus on growth while we
              handle the tech side. Start empowering your business with the
              right tools and knowledge today!
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

          {/* Right Content - Lottie Animation */}
          <Col lg={5} className="bytebodh-hero-visual">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: "100%", height: "50%" }}
            />
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
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(2, 132, 199, 0.05) 0%,
            rgba(99, 102, 241, 0.05) 100%
          );
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }

        .min-vh-80 {
          min-height: 80vh;
        }

        .bytebodh-hero-badge {
          background: linear-gradient(
            135deg,
            #0284c7 0%,
            #6366f1 100%
          ) !important;
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
          background: linear-gradient(
            135deg,
            #0284c7 0%,
            #6366f1 100%
          ) !important;
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

        .bytebodh-hero-visual {
          position: relative;
          padding-left: 2rem;
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

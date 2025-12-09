// src/components/AboutSection.js
import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

function AboutSection() {
  return (
    <section className="bytebodh-about" id="about">
      <Container>
        <Row className="justify-content-center py-5 my-5">
          <Col lg={10} className="bytebodh-about-content text-center">
            <Badge bg="primary" className="bytebodh-about-badge mb-4">
              <FaUser className="me-2" />
              About Us
            </Badge>

            <h2 className="bytebodh-about-title mb-4">Empowering Businesses and Students Through Smart Digital Tools</h2>

            <p className="bytebodh-about-description mb-4">
              At <strong>ByteBodh</strong>, we create powerful, easy-to-use digital tools designed for both growing businesses and ambitious students. Whether you're an entrepreneur streamlining workflows or a student enhancing productivity, our solutions are built to simplify tasks, improve efficiency, and support your long-term goals.
            </p>

            <p className="bytebodh-about-description mb-5">
              We build practical, affordable, and scalable tools that solve real problems — from business automation to student-friendly utilities that boost learning and project management. No complexity, no high costs — just tools that help you work smarter, stay organized, and grow confidently.
            </p>

            <div className="bytebodh-cta mt-5">
              <p className="bytebodh-cta-text">
                <strong>Ready to take the next step?</strong> Let ByteBodh empower your journey with smart tools made for both business growth and student success.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .bytebodh-about {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          position: relative;
        }

        .bytebodh-about::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230284c7' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        .bytebodh-about-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 50px;
        }

        .bytebodh-about-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }

        .bytebodh-about-description {
          font-size: 1.15rem;
          color: #64748b;
          line-height: 1.7;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .bytebodh-about-description strong {
          color: #0284c7;
        }

        .bytebodh-cta {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          padding: 2.5rem;
          border-radius: 20px;
          color: white;
          margin-top: 3rem;
        }

        .bytebodh-cta-text {
          font-size: 1.2rem;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 991.98px) {
          .bytebodh-about-title {
            font-size: 2.25rem;
          }

          .bytebodh-about-description {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 768px) {
          .bytebodh-about-title {
            font-size: 2rem;
          }

          .bytebodh-cta {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .bytebodh-about-title {
            font-size: 1.75rem;
          }

          .bytebodh-about-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}

export default AboutSection;

// src/components/AboutSection.js
import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { 
  FaUser,
} from 'react-icons/fa';

function AboutSection() {
  return (
    <section className="bytebodh-about" id="about">
      <Container>
        <Row className="justify-content-center py-5 my-5">
          <Col lg={10} className="bytebodh-about-content text-center">
            <Badge bg="primary" className="bytebodh-about-badge mb-4">
              <FaUser className="me-2" />
              About us
            </Badge>
            
            <h2 className="bytebodh-about-title mb-4">
              Empowering Dreams, Not Budgets
            </h2>
            
            <p className="bytebodh-about-description mb-4">
              At <strong>ByteBodh</strong>, we believe that financial constraints should never be a barrier to digital success. 
              We specialize in helping <strong>bootstrapped startups</strong>, <strong>individual entrepreneurs</strong>, and 
              <strong> micro-businesses</strong> achieve their technology goals without breaking the bank.
            </p>

            <p className="bytebodh-about-description mb-5">
              Whether you're working with just ₹5,000 or ₹50,000, our affordable tutorials and cost-effective 
              solutions ensure you get professional-grade results at a fraction of the market price. We understand 
              the challenges of starting small because we've been there too.
            </p>

            {/* Final CTA */}
            <div className="bytebodh-cta mt-5">
              <p className="bytebodh-cta-text">
                <strong>Ready to start your digital journey?</strong> Let's build something amazing together, 
                no matter how small your budget. Your vision deserves to come to life.
              </p>
            </div>
          </Col>   
        </Row>
      </Container>

      {/* About-specific CSS */}
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

        /* Feature Cards */
        .bytebodh-budget-features {
          margin-top: 3rem !important;
        }

        .bytebodh-feature-card {
          padding: 2rem 1.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          height: 100%;
        }

        .bytebodh-feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .bytebodh-feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 1.75rem;
          color: white;
        }

        .bytebodh-feature-icon.budget {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .bytebodh-feature-icon.launch {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .bytebodh-feature-icon.support {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        }

        .bytebodh-feature-card h5 {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .bytebodh-feature-card p {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        /* Success Stories */
        .bytebodh-success-stories {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }

        .bytebodh-stories-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.5rem;
        }

        .bytebodh-story {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }

        .bytebodh-story-icon {
          font-size: 1.5rem;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .bytebodh-story-content strong {
          color: #0f172a;
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .bytebodh-story-content p {
          color: #64748b;
          margin: 0;
          font-size: 0.9rem;
        }

        /* CTA Section */
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

        .bytebodh-cta-text strong {
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .bytebodh-about-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-about-description {
            font-size: 1.1rem;
          }
          
          .bytebodh-feature-card {
            padding: 1.5rem 1rem;
          }
        }

        @media (max-width: 768px) {
          .bytebodh-about-title {
            font-size: 2rem;
          }
          
          .bytebodh-success-stories,
          .bytebodh-cta {
            padding: 2rem 1.5rem;
          }
          
          .bytebodh-story {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .bytebodh-about-title {
            font-size: 1.75rem;
          }
          
          .bytebodh-about-description {
            font-size: 1rem;
          }
          
          .bytebodh-feature-icon {
            width: 60px;
            height: 60px;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}

export default AboutSection;
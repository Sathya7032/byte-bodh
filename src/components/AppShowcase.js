// src/components/AppShowcase.js
import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { 
  FaGooglePlay,
  FaStar,
  FaDownload,
  FaMobile,
  FaCheckCircle
} from 'react-icons/fa';

function AppShowcase() {

  const ratings = [
    { stars: 5, percentage: 87 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 0 }
  ];

  return (
    <section className="bytebodh-app-showcase">
      <Container>
        <Row className="align-items-center py-5 my-4">
          {/* Left Content - App Info */}
          <Col lg={6} className="bytebodh-app-content">
            <Badge bg="primary" className="bytebodh-app-badge mb-3">
              <FaMobile className="me-2" />
              Now Available on Play Store
            </Badge>
            
            <h2 className="bytebodh-app-title mb-3">
              Learn Anytime, Anywhere with 
              <span className="bytebodh-app-gradient"> ByteBodh App</span>
            </h2>
            
            <p className="bytebodh-app-description mb-4">
              Take your IT learning journey mobile! Our Android app brings all ByteBodh tutorials, 
              projects, and tools to your fingertips. Perfect for busy entrepreneurs and small business 
              owners who want to learn on the go.
            </p>

            {/* App Ratings */}
            <div className="bytebodh-app-ratings mb-4">
              <div className="bytebodh-rating-overview d-flex align-items-center mb-3">
                <div className="bytebodh-rating-score me-3">
                  <div className="bytebodh-rating-number">4.8</div>
                  <div className="bytebodh-rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-warning" />
                    ))}
                  </div>
                  <div className="bytebodh-rating-count">2.5K+ reviews</div>
                </div>
                <div className="bytebodh-rating-bars flex-grow-1">
                  {ratings.map((rating, index) => (
                    <div key={index} className="bytebodh-rating-bar d-flex align-items-center mb-1">
                      <span className="bytebodh-rating-star-count me-2">{rating.stars}</span>
                      <FaStar className="bytebodh-rating-star-icon me-2" />
                      <div className="bytebodh-rating-progress flex-grow-1">
                        <div 
                          className="bytebodh-rating-progress-bar"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="bytebodh-rating-percentage ms-2">{rating.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="bytebodh-download-actions">
              <Button className="bytebodh-playstore-btn btn-lg">
                <FaGooglePlay className="me-2" size={24} />
                <div className="bytebodh-btn-text">
                  <small>GET IT ON</small>
                  <strong>Google Play</strong>
                </div>
              </Button>
              
              <div className="bytebodh-download-stats mt-3">
                <FaDownload className="text-primary me-2" />
                <span>10+ Downloads</span>
              </div>
            </div>
          </Col>

          {/* Right Content - App Mockup */}
          <Col lg={6} className="bytebodh-app-visual">
            <div className="bytebodh-phone-mockup">
              <div className="bytebodh-phone-frame">
                <div className="bytebodh-phone-screen">
                  {/* App Screen Content */}
                  <div className="bytebodh-app-screen">
                    <div className="bytebodh-app-header">
                      <div className="bytebodh-app-logo">
                        <div className="bytebodh-app-logo-icon">B</div>
                        <span>ByteBodh</span>
                      </div>
                    </div>
                    
                    <div className="bytebodh-app-content-preview">
                      <div className="bytebodh-app-feature-preview">
                        <FaCheckCircle className="text-success me-2" />
                        <span>Web Development</span>
                      </div>
                      <div className="bytebodh-app-feature-preview">
                        <FaCheckCircle className="text-success me-2" />
                        <span>Mobile Apps</span>
                      </div>
                      <div className="bytebodh-app-feature-preview">
                        <FaCheckCircle className="text-success me-2" />
                        <span>Cloud Computing</span>
                      </div>
                      <div className="bytebodh-app-feature-preview">
                        <FaCheckCircle className="text-success me-2" />
                        <span>Data Analytics</span>
                      </div>
                    </div>
                    
                    <div className="bytebodh-app-bottom-nav">
                      <div className="bytebodh-nav-item active">Learn</div>
                      <div className="bytebodh-nav-item">Practice</div>
                      <div className="bytebodh-nav-item">Projects</div>
                      <div className="bytebodh-nav-item">Profile</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="bytebodh-app-floating element-1">
                <FaStar className="bytebodh-floating-icon" />
                <span>4.8 Rating</span>
              </div>
              <div className="bytebodh-app-floating element-2">
                <FaDownload className="bytebodh-floating-icon" />
                <span>10+ Downloads</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* App Showcase-specific CSS */}
      <style jsx>{`
        .bytebodh-app-showcase {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .bytebodh-app-showcase::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .bytebodh-app-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 50px;
        }

        .bytebodh-app-title {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.2;
          color: #f8fafc;
        }

        .bytebodh-app-gradient {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .bytebodh-app-description {
          font-size: 1.1rem;
          color: #cbd5e1;
          line-height: 1.7;
          max-width: 90%;
        }

        /* Ratings Styles */
        .bytebodh-app-ratings {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bytebodh-rating-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1;
        }

        .bytebodh-rating-stars {
          color: #fbbf24;
          margin: 0.5rem 0;
        }

        .bytebodh-rating-count {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .bytebodh-rating-bar {
          font-size: 0.875rem;
        }

        .bytebodh-rating-star-count {
          color: #cbd5e1;
          width: 20px;
        }

        .bytebodh-rating-star-icon {
          color: #fbbf24;
          font-size: 0.75rem;
        }

        .bytebodh-rating-progress {
          background: rgba(255, 255, 255, 0.1);
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
        }

        .bytebodh-rating-progress-bar {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .bytebodh-rating-percentage {
          color: #94a3b8;
          width: 30px;
          text-align: right;
        }

        /* App Features */
        .bytebodh-app-feature {
          padding: 1rem;
        }

        .bytebodh-app-feature-icon {
          color: #0284c7;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .bytebodh-app-feature-text strong {
          color: #f8fafc;
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .bytebodh-app-feature-text small {
          color: #94a3b8;
          font-size: 0.8rem;
        }

        /* Download Button */
        .bytebodh-playstore-btn {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .bytebodh-playstore-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.4);
        }

        .bytebodh-btn-text {
          text-align: left;
          line-height: 1.2;
        }

        .bytebodh-btn-text small {
          font-size: 0.75rem;
          opacity: 0.9;
          display: block;
        }

        .bytebodh-btn-text strong {
          font-size: 1.1rem;
          display: block;
        }

        .bytebodh-download-stats {
          color: #cbd5e1;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
        }

        /* Phone Mockup */
        .bytebodh-phone-mockup {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
        }

        .bytebodh-phone-frame {
          width: 300px;
          height: 600px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 40px;
          padding: 12px;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bytebodh-phone-screen {
          background: white;
          height: 100%;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
        }

        .bytebodh-app-screen {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .bytebodh-app-header {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          color: white;
          padding: 1.5rem 1rem 1rem;
        }

        .bytebodh-app-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }

        .bytebodh-app-logo-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .bytebodh-app-content-preview {
          flex: 1;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bytebodh-app-feature-preview {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          color: #334155;
          font-weight: 500;
        }

        .bytebodh-app-bottom-nav {
          display: flex;
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 0.75rem 0;
        }

        .bytebodh-nav-item {
          flex: 1;
          text-align: center;
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .bytebodh-nav-item.active {
          color: #0284c7;
        }

        /* Floating Elements */
        .bytebodh-app-floating {
          position: absolute;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
          animation: bytebodh-app-float 3s ease-in-out infinite;
        }

        .bytebodh-floating-icon {
          font-size: 1rem;
        }

        .element-1 {
          top: 20%;
          right: 10%;
          animation-delay: 0s;
        }

        .element-2 {
          bottom: 30%;
          left: 5%;
          animation-delay: 1.5s;
        }

        @keyframes bytebodh-app-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .bytebodh-app-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-app-description {
            max-width: 100%;
          }
          
          .bytebodh-phone-mockup {
            margin-top: 3rem;
            min-height: 400px;
          }
          
          .bytebodh-phone-frame {
            transform: scale(0.9);
          }
        }

        @media (max-width: 576px) {
          .bytebodh-app-title {
            font-size: 2rem;
          }
          
          .bytebodh-phone-frame {
            transform: scale(0.8);
          }
          
          .bytebodh-app-floating {
            display: none;
          }
          
          .bytebodh-rating-overview {
            flex-direction: column;
            text-align: center;
          }
          
          .bytebodh-rating-score {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </section>
  );
}

export default AppShowcase;
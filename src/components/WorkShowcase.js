// src/components/WorkShowcase.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';

function WorkShowcase() {
  const websites = [
    {
      id: 1,
      title: "ByteBodh",
      url: "https://www.bytebodh.in",
    },
    {
      id: 2,
      title: "QR Generator",
      url: "https://qr.bytebodh.in",
    },
    {
      id: 3,
      title: "Scoremate",
      url: "https://www.scoremate.in",
    }
  ];

  return (
    <section className="our-products">
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 className="section-title">Our Web Products</h2>
          </Col>
        </Row>

        <Row className="g-4">
          {websites.map((website) => (
            <Col key={website.id} lg={4} md={6}>
              <div className="website-card">
                <div className="preview-frame">
                  <div className="frame-header">
                    <div className="frame-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="frame-url">{website.url.replace('https://', '')}</div>
                  </div>
                  <div className="frame-content">
                    <iframe
                      src={website.url}
                      className="website-iframe"
                      title={`Live preview of ${website.title}`}
                      loading="lazy"
                    />
                    <div className="frame-overlay">
                      <a 
                        href={website.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="preview-link"
                      >
                        <FaExternalLinkAlt />
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
                <div className="website-info">
                  <h3 className="website-title">{website.title}</h3>
                  <a 
                    href={website.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="visit-btn"
                  >
                    <FaExternalLinkAlt />
                    Open Site
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <style jsx>{`
        .our-products {
          padding: 4rem 0;
          background: #0f172a;
        }

        .section-title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .website-card {
          background: #1e293b;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .website-card:hover {
          transform: translateY(-5px);
        }

        .preview-frame {
          background: #1e293b;
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }

        .frame-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: #0f172a;
          border-bottom: 1px solid #334155;
        }

        .frame-dots {
          display: flex;
          gap: 0.5rem;
        }

        .frame-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .frame-dots span:nth-child(1) { background: #ef4444; }
        .frame-dots span:nth-child(2) { background: #f59e0b; }
        .frame-dots span:nth-child(3) { background: #10b981; }

        .frame-url {
          color: #64748b;
          font-size: 0.75rem;
          font-family: monospace;
        }

        .frame-content {
          height: 250px;
          position: relative;
          overflow: hidden;
        }

        .website-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: white;
        }

        .frame-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-frame:hover .frame-overlay {
          opacity: 1;
        }

        .preview-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #6366f1;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .preview-link:hover {
          background: #4f46e5;
          transform: translateY(-2px);
          color: white;
        }

        .website-info {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .website-title {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .visit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #10b981;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .visit-btn:hover {
          background: #059669;
          color: white;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          
          .frame-content {
            height: 200px;
          }
        }

        @media (max-width: 576px) {
          .our-products {
            padding: 2rem 0;
          }
          
          .section-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
}

export default WorkShowcase;
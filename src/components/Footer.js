// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaPhone, 
  FaFacebook, 
  FaLinkedin, 
  FaInstagram,
  FaYoutube,
  FaGithub
} from 'react-icons/fa';
import './Footer.css';

function Footer() {
  // Services data
  const SERVICES = [
    { id: 1, title: 'IT Tutorials & Courses' },
    { id: 2, title: 'Websites' },
    { id: 3, title: 'Android Applications' },
    { id: 4, title: 'IOS Applications' },
    { id: 5, title: 'Cloud' },
    { id: 6, title: 'Mobile Apps' }
  ];

  return (
    <footer className="bytebodh-footer">
      <Container>
        {/* Main Footer Content */}
        <Row className="bytebodh-footer-main py-5">
          <Col lg={4} className="mb-4">
            <div className="bytebodh-footer-brand mb-3">
              
              <div>
                <div className="bytebodh-footer-company-name fs-5 fw-bold">ByteBodh</div>
              </div>
            </div>
            <p className="bytebodh-footer-description mb-4">
              Professional IT tutorials and powerful tools designed for small businesses and startups 
              to thrive in the digital landscape. Empowering your journey with cutting-edge technology education.
            </p>
            <div className="bytebodh-footer-social">
              <a href="https://www.facebook.com/share/1AE1wkgx2m/?mibextid=wwXIfr" className="bytebodh-social-link">
                <FaFacebook size={18} />
              </a>
             
              <a href="https://www.linkedin.com/company/bytebodh/" className="bytebodh-social-link">
                <FaLinkedin size={18} />
              </a>
              <a href="https://www.instagram.com/bytebodh/" className="bytebodh-social-link">
                <FaInstagram size={18} />
              </a>
              <a href="https://youtube.com/@bytebodh?si=z3Kdf8dOBZMVU9YF" className="bytebodh-social-link">
                <FaYoutube size={18} />
              </a>
              <a href="#github" className="bytebodh-social-link">
                <FaGithub size={18} />
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="bytebodh-footer-heading mb-3">Services</h6>
            <ul className="bytebodh-footer-list list-unstyled">
              {SERVICES.slice(0, 4).map((service) => (
                <li key={service.id} className="mb-2">
                  <a href="#!" className="bytebodh-footer-link">{service.title}</a>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="bytebodh-footer-heading mb-3">Company</h6>
            <ul className="bytebodh-footer-list list-unstyled">
              <li className="mb-2"><a href="/about" className="bytebodh-footer-link">About Us</a></li>
              <li className="mb-2"><a href="/about" className="bytebodh-footer-link">Our Team</a></li>
              <li className="mb-2"><a href="/contact" className="bytebodh-footer-link">Careers</a></li>
              <li className="mb-2"><a href="/blog" className="bytebodh-footer-link">Blog</a></li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="bytebodh-footer-heading mb-3">Support</h6>
            <ul className="bytebodh-footer-list list-unstyled">
              <li className="mb-2"><a href="/contact" className="bytebodh-footer-link">Help Center</a></li>
              <li className="mb-2"><a href="/contact" className="bytebodh-footer-link">Contact Us</a></li>
              <li className="mb-2"><a href="/privacy-policy" className="bytebodh-footer-link">Privacy Policy</a></li>
              <li className="mb-2"><a href="/terms-and-conditions" className="bytebodh-footer-link">Terms of Service</a></li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="bytebodh-footer-heading mb-3">Contact Info</h6>
            <div className="bytebodh-contact-info">
              <div className="bytebodh-contact-item d-flex align-items-center mb-3">
                <FaEnvelope className="bytebodh-contact-icon me-2" />
                <span className="bytebodh-contact-text">info@bytebodh.in</span>
              </div>
              <div className="bytebodh-contact-item d-flex align-items-center mb-3">
                <FaPhone className="bytebodh-contact-icon me-2" />
                <span className="bytebodh-contact-text">+91 8519965746</span>
              </div>
              
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="bytebodh-footer-bottom py-4 border-top">
          <Col md={6} className="mb-2 mb-md-0">
            <div className="bytebodh-copyright">
              © {new Date().getFullYear()} ByteBodh Technologies. All rights reserved.
            </div>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="bytebodh-footer-links">
              <a href="/privacy-policy" className="bytebodh-footer-link me-3">Privacy Policy</a>
              <a href="/terms-and-conditions" className="bytebodh-footer-link me-3">Terms of Service</a>
              <a href="/cookie-policy" className="bytebodh-footer-link">Cookie Policy</a>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer-specific CSS */}
      <style jsx>{`
        .bytebodh-footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          margin-top: auto;
        }

        .bytebodh-footer-main {
          border-bottom: 1px solid #334155;
        }

        .bytebodh-footer-logo {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          font-size: 1.2rem;
        }

        .bytebodh-footer-company-name {
          color: #f8fafc;
          font-size: 1.25rem !important;
        }

        .bytebodh-footer-tagline {
          color: #94a3b8 !important;
          font-size: 0.875rem;
        }

        .bytebodh-footer-description {
          color: #cbd5e1;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .bytebodh-footer-heading {
          color: #f8fafc;
          font-weight: 600;
          font-size: 1rem;
        }

        .bytebodh-footer-list {
          color: #cbd5e1;
        }

        .bytebodh-footer-link {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .bytebodh-footer-link:hover {
          color: #0284c7;
          transform: translateX(3px);
        }

        .bytebodh-footer-social {
          display: flex;
          gap: 12px;
        }

        .bytebodh-social-link {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
        }

        .bytebodh-social-link:hover {
          color: #0284c7;
          background: rgba(2, 132, 199, 0.1);
          transform: translateY(-2px);
        }

        .bytebodh-contact-info {
          color: #cbd5e1;
        }

        .bytebodh-contact-item {
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .bytebodh-contact-icon {
          color: #0284c7;
          flex-shrink: 0;
        }

        .bytebodh-contact-text {
          color: #cbd5e1;
        }

        .bytebodh-footer-bottom {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .bytebodh-copyright {
          color: #94a3b8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .bytebodh-footer-brand {
            text-align: center;
            justify-content: center;
          }
          
          .bytebodh-footer-social {
            justify-content: center;
          }
          
          .bytebodh-footer-heading {
            margin-top: 1rem;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
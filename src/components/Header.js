import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaPhone, 
  FaFacebook, 
  FaLinkedin, 
  FaInstagram,
  FaBars,
  FaTimes,
  FaYoutube
} from 'react-icons/fa';
import './header.css'

// Navigation items data
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Get current path without leading slash
  const currentPath = location.pathname.substring(1) || 'home';

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar with Contact Info and Social Icons */}
      <div className="bg-dark text-white py-2 d-none d-lg-block">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            {/* Contact Information */}
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <FaEnvelope size={14} className="text-primary" />
                <span className="fs-7">info@bytebodh.in</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaPhone size={14} className="text-primary" />
                <span className="fs-7">+91 8519965746</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="d-flex align-items-center gap-3">
              <a href="https://www.facebook.com/share/1AE1wkgx2m/?mibextid=wwXIfr" className="text-white-50 hover:text-primary transition-colors">
                <FaFacebook size={16} />
              </a>
              <a href="https://youtube.com/@bytebodh?si=z3Kdf8dOBZMVU9YF" className="text-white-50 hover:text-primary transition-colors">
                <FaYoutube size={16} />
              </a>
              <a href="https://www.linkedin.com/company/bytebodh/" className="text-white-50 hover:text-primary transition-colors">
                <FaLinkedin size={16} />
              </a>
              <a href="https://www.instagram.com/bytebodh/" className="text-white-50 hover:text-primary transition-colors">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <Navbar expand="lg" className="bg-white shadow-sm sticky-top z-40" expanded={isMenuOpen}>
        <Container>
          {/* Brand/Logo */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center text-decoration-none">
            
            <div className="ms-3">
              <div className="fs-5 fw-bold text-dark">ByteBodh</div>
            </div>
          </Navbar.Brand>

          {/* Mobile Menu Toggle */}
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="border-0"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            {/* Navigation Links */}
            <Nav className="mx-auto">
              {NAV_ITEMS.map((item) => (
                <Nav.Link
                  key={item.id}
                  as={Link}
                  to={item.id === 'home' ? '/' : `/${item.id}`}
                  className={`fw-medium mx-2 px-3 ${
                    currentPath === item.id 
                      ? 'text-primary' 
                      : 'text-dark'
                  }`}
                  onClick={handleNavClick}
                  style={{
                    fontSize: '0.95rem',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.label}
                  {currentPath === item.id && (
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '30px',
                        height: '2px',
                        background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </Nav.Link>
              ))}
            </Nav>

            {/* Action Buttons */}
            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
              <Link
                to="/contact"
                className="btn btn-outline-dark border-2 px-4 py-2 fw-medium rounded-3"
                style={{ 
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleNavClick}
              >
                Contact
              </Link>
              <Link
                to="/contact"
                className="btn btn-primary px-4 py-2 fw-medium rounded-3 border-0"
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleNavClick}
              >
                Get a Quote
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
// Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { isAuthenticated, logout } from "../services/auth";
// adjust path if needed

// Simplified navigation items - removed dropdown
const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "jobs", label: "Jobs", href: "/jobs" },
  { id: "products", label: "Our Products", href: "/products" },
  { id: "blogs", label: "Blogs", href: "/blogs" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
]

const SOCIAL_LINKS = [
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/share/1AE1wkgx2m/?mibextid=wwXIfr",
    color: "hover:text-blue-600",
  },
  {
    icon: FaYoutube,
    href: "https://youtube.com/@bytebodh?si=z3Kdf8dOBZMVU9YF",
    color: "hover:text-red-600",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/bytebodh/",
    color: "hover:text-blue-700",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/bytebodh/",
    color: "hover:text-pink-600",
  },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const currentPath = location.pathname;

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
  }, [location]); // re-check on route change

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Contact Info */}
            <div className="flex items-center space-x-6">
              <a
                href="mailto:info@bytebodh.in"
                className="flex items-center space-x-2 group transition-all duration-200 hover:text-blue-300"
              >
                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <FaEnvelope size={12} />
                </div>
                <span className="text-sm font-medium">info@bytebodh.in</span>
              </a>
              <a
                href="tel:+918519965746"
                className="flex items-center space-x-2 group transition-all duration-200 hover:text-blue-300"
              >
                <div className="bg-green-600 p-1.5 rounded-lg group-hover:bg-green-500 transition-colors">
                  <FaPhone size={12} />
                </div>
                <span className="text-sm font-medium">+91 8519965746</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Follow us:</span>
              <div className="flex items-center space-x-3">
                {SOCIAL_LINKS.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-300 ${social.color} transition-colors duration-200 transform hover:scale-110`}
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-lg font-bold text-xl">
                    BB
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ByteBodh
                  </span>
                  <p className="text-xs text-gray-500 font-medium">
                    Digital Solutions
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPath === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-3">
              {authenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={logout}
                    className="px-5 py-2.5 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all"
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/login"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-5 relative">
                <span
                  className={`absolute left-0 top-0 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`absolute left-0 top-2 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`absolute left-0 top-4 w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden animate-slideDown">
              <div className="py-4 px-2 bg-white border-t border-gray-100 shadow-lg rounded-b-2xl">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`block px-4 py-3 rounded-lg transition-colors font-medium mb-1 ${
                      currentPath === item.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 px-2">
                  {authenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-center px-4 py-3 border-2 border-red-500 text-red-500 font-semibold rounded-lg"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="block w-full text-center px-4 py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>

                      <Link
                        to="/login"
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>

                {/* Social Links - Mobile */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="px-4 text-sm text-gray-500 mb-3">
                    Connect with us:
                  </p>
                  <div className="flex justify-center space-x-6">
                    {SOCIAL_LINKS.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-full bg-gray-100 ${social.color} transition-colors duration-200`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon size={18} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;

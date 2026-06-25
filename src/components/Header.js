import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "../services/auth";
import {
  FaBars,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "blogs", label: "Blogs", href: "/blogs" },
  { id: "jobs", label: "Job Notifications", href: "/jobs" },
  { id: "about", label: "About Us", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const currentPath = location.pathname;
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-md"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      {/* Top Header Bar */}
      <div
        className={`bg-slate-950 text-slate-400 border-b border-slate-900 px-6 hidden sm:block transition-all duration-300 overflow-hidden ${
          isScrolled ? "max-h-0 py-0 border-b-transparent" : "max-h-12 py-2.5"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-semibold">
          {/* Left: Contact Info */}
          <div className="flex items-center space-x-6">
            <a
              href="mailto:info@bytebodh.in"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
            >
              <FaEnvelope className="text-emerald-500" />
              <span>info@bytebodh.in</span>
            </a>
            <a
              href="tel:+918519965746"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
            >
              <FaPhone className="text-emerald-500" />
              <span>+91 8519965746</span>
            </a>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center space-x-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Follow us:</span>
            <div className="flex items-center space-x-3.5">
              {[
                { icon: <FaFacebook className="w-3.5 h-3.5" />, url: "https://www.facebook.com/share/1AE1wkgx2m/?mibextid=wwXIfr", label: "Facebook" },
                { icon: <FaLinkedin className="w-3.5 h-3.5" />, url: "https://www.linkedin.com/company/bytebodh/", label: "LinkedIn" },
                { icon: <FaInstagram className="w-3.5 h-3.5" />, url: "https://instagram.com/bytebodh", label: "Instagram" },
                { icon: <FaYoutube className="w-3.5 h-3.5" />, url: "https://youtube.com/@bytebodh?si=z3Kdf8dOBZMVU9YF", label: "YouTube" }
              ].map((soc) => (
                <a
                  key={soc.label}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/25">
            BB
          </div>
          <div>
            <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              ByteBodh
            </span>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">
              AI Portfolio
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                currentPath === item.href
                  ? "text-emerald-600 font-bold bg-emerald-50/50"
                  : "text-slate-600 hover:text-emerald-500 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {authenticated ? (
            <>
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200/80 shadow-xl py-4 px-6 flex flex-col space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`block py-3 px-4 text-base font-semibold rounded-xl ${
                currentPath === item.href
                  ? "text-emerald-600 bg-emerald-50/50"
                  : "text-slate-600 hover:text-emerald-500 hover:bg-slate-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 px-4">
            {authenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full py-3 text-center bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 text-center border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full py-3 text-center text-slate-700 font-bold hover:text-emerald-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full py-3 text-center bg-emerald-500 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;

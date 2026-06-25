import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaFacebook,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 border-b border-slate-900 pb-12">
        {/* Brand info */}
        <div className="col-span-2 space-y-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              BB
            </div>
            <span className="text-xl font-black text-white">ByteBodh</span>
          </Link>
          <p className="text-xs leading-relaxed max-w-sm">
            ByteBodh is an AI-powered portfolio website builder designed to help fresh graduates and software engineers deploy hiring-ready personal websites.
          </p>
          <div className="flex gap-4">
            {[
              { icon: <FaInstagram className="w-4 h-4" />, url: "https://instagram.com/bytebodh", label: "Instagram" },
              { icon: <FaLinkedin className="w-4 h-4" />, url: "https://linkedin.com/company/bytebodh", label: "LinkedIn" },
              { icon: <FaGithub className="w-4 h-4" />, url: "https://github.com/bytebodh", label: "GitHub" },
              { icon: <FaFacebook className="w-4 h-4" />, url: "https://www.facebook.com/share/1AE1wkgx2m/?mibextid=wwXIfr", label: "Facebook" }
            ].map((soc) => (
              <a
                key={soc.label}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={soc.label}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-emerald-500 hover:bg-slate-900 transition-all"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links cols */}
        <div>
          <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4">Product</h5>
          <ul className="space-y-3 text-xs">
            <li><Link to="/#templates-section" className="hover:text-white transition-colors">Templates</Link></li>
            <li><Link to="/#features-section" className="hover:text-white transition-colors">Core Features</Link></li>
            <li><Link to="/#faq" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Company links */}
        <div>
          <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4">Company</h5>
          <ul className="space-y-3 text-xs">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link to="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Resources links */}
        <div>
          <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4">Resources</h5>
          <ul className="space-y-3 text-xs">
            <li><Link to="/#faq" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie settings</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>© {new Date().getFullYear()} ByteBodh. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer transition-colors">System Online</span>
          <span className="hover:text-white cursor-pointer transition-colors">V2026.1</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600 flex flex-col justify-between">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-6 pt-36 pb-20 bg-gradient-to-br from-emerald-50/10 via-white to-teal-50/10">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* 404 Number */}
          <div>
            <h1 className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 drop-shadow-sm select-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Page Not Found
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>
          </div>

          {/* Illustration or Icon */}
          <div className="py-4">
            <svg
              className="w-48 h-48 mx-auto text-slate-200 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Go to Homepage
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-white text-slate-700 font-extrabold rounded-xl shadow-sm hover:shadow-md border border-slate-200 transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-slate-100 max-w-md mx-auto">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">You might be looking for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: "Products", to: "/products" },
                { label: "Blogs", to: "/blogs" },
                { label: "Jobs", to: "/jobs" },
                { label: "Contact Us", to: "/contact" }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 text-xs font-bold rounded-xl border border-slate-150 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PageNotFound;

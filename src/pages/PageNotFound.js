import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaHome, FaArrowLeft, FaExclamationTriangle, FaPlusCircle, FaCompass } from "react-icons/fa";

const PageNotFound = ({
  statusCode = "404",
  title = "Page Not Found",
  message = "Oops! The page or resource you're looking for doesn't exist, has been moved, or is temporarily unavailable.",
  errorDetails = null,
  showHeaderFooter = true,
  actionText = "Go to Homepage",
  actionLink = "/"
}) => {
  const navigate = useNavigate();

  const mainContent = (
    <div className="flex-grow flex items-center justify-center px-4 py-16 md:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-[75vh]">
      <div className="max-w-2xl w-full text-center space-y-8 relative">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* 404 Large Gradient Display */}
        <div className="relative">
          <h1 className="text-[7rem] sm:text-[9rem] md:text-[11rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_10px_35px_rgba(16,185,129,0.25)] select-none tracking-tight">
            {statusCode}
          </h1>
          
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <FaExclamationTriangle className="text-rose-400 text-xs animate-bounce" />
            HTTP Status: {statusCode} Not Found
          </div>
        </div>

        {/* Heading & Description */}
        <div className="space-y-3 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
            {message}
          </p>

          {/* Clean Technical Error Code Badge */}
          {errorDetails && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-slate-900/90 text-slate-300 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono select-all shadow-inner">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Error details:</span>
                <span className="text-emerald-400 font-semibold">{errorDetails}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 pt-2">
          <Link
            to={actionLink}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            <FaHome className="text-slate-950 text-base" />
            {actionText}
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold rounded-xl border border-slate-800 hover:border-slate-700 transform hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <FaArrowLeft className="text-slate-400 text-xs" />
            Go Back
          </button>

          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/40 hover:bg-slate-800/80 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 transform hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            <FaPlusCircle className="text-emerald-400 text-xs" />
            Create Portfolio
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-slate-800/80 max-w-md mx-auto relative z-10">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5">
            <FaCompass className="text-emerald-400 text-xs" />
            Popular Destinations
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Home", to: "/" },
              { label: "Templates", to: "/templates" },
              { label: "Blogs", to: "/blogs" },
              { label: "Jobs", to: "/jobs" },
              { label: "Contact Us", to: "/contact" }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 bg-slate-900/90 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-400 text-xs font-semibold rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!showHeaderFooter) {
    return mainContent;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-400 flex flex-col justify-between">
      <Header />
      {mainContent}
      <Footer />
    </div>
  );
};

export default PageNotFound;

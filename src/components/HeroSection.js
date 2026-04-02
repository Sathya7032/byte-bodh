import React from "react";
import { FaArrowRight, FaStar, FaMobileAlt, FaBriefcase } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
import Lottie from "lottie-react";
import animationData from "../assets/anime/hero.json";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-green-500/10 to-emerald-600/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/25 animate-pulse">
              <FaStar className="animate-spin-slow" />
              <span>The #1 App for IT Students & Tech Learners</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Learn Java & IT</span>{" "}
              <span className="text-gray-900">Technologies,</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Grow Your Tech Career
              </span>
            </h1>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg text-gray-600 leading-relaxed">
                Byte Bodh is a mobile app built for tech learners and students. Master Java, Android, and other IT technologies through tutorials, get instant job notifications, and build a professional online portfolio — all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a
                href="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <FaGooglePlay className="text-lg" />
                  Download on Play Store
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl border-2 border-white/20 -m-0.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>

              <button
                onClick={() => window.location.href = '/jobs'}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  <FaBriefcase className="group-hover:rotate-12 transition-transform" />
                  View Job Notifications
                </span>
                <div className="absolute inset-0 rounded-xl border-2 border-white/20 -m-0.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>

          {/* Right Content - Animation */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl"></div>

            {/* Main animation container */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 p-8 shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  <FaMobileAlt className="inline mr-1" /> Available on Android
                </div>
              </div>

              <Lottie
                animationData={animationData}
                loop={true}
                className="w-full h-auto"
              />

              {/* Floating elements */}
              <div className="absolute -bottom-3 -left-3 bg-white rounded-xl p-3 shadow-lg border border-gray-100 animate-float">
                <div className="text-sm font-semibold text-blue-600">Java Tutorials</div>
                <div className="text-xs text-gray-500">Step-by-step learning</div>
              </div>

              <div className="absolute -top-3 -right-3 bg-white rounded-xl p-3 shadow-lg border border-gray-100 animate-float-delayed">
                <div className="text-sm font-semibold text-purple-600">Job Alerts</div>
                <div className="text-xs text-gray-500">Latest IT openings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
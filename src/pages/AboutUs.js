// src/pages/AboutUs.js
import React from 'react';
import { FaLightbulb, FaToolbox, FaGraduationCap, FaRocket, FaUsers, FaCode, FaQrcode, FaUserTie, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AboutUs() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium mb-6">
                <FaLightbulb className="mr-2" />
                Developer Tools & Digital Solutions
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">ByteBodh</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Creating innovative digital tools for developers, students, and professionals to enhance productivity and career growth.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="ByteBodh Team"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  At ByteBodh, I build practical digital tools that solve real-world problems for developers and students. From QR code generators to portfolio builders, each tool is designed to simplify workflows and boost productivity.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  I focus on creating affordable, accessible solutions that help you showcase your skills, manage your digital presence, and grow your career without unnecessary complexity.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-green-600">
                    <FaCode className="mr-2" />
                    <span className="font-medium">Web Development</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <FaQrcode className="mr-2" />
                    <span className="font-medium">QR Tools</span>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <FaUserTie className="mr-2" />
                    <span className="font-medium">Portfolio Tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* For Students & Developers Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-4">
                    <FaGraduationCap className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Developers & Students</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Tools and resources to enhance your technical skills and digital presence.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <FaCode className="mr-3 text-blue-500" />
                    <span>QR Code Generator with Analytics</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaUserTie className="mr-3 text-purple-500" />
                    <span>Portfolio & Resume Builder</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-3 text-green-500">🛠️</span>
                    <span>Developer Utilities & Tools</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-3 text-yellow-500">💡</span>
                    <span>Learning Resources & Tutorials</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-3 text-red-500">📊</span>
                    <span>Dashboard with Contact Analytics</span>
                  </li>
                </ul>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-800 text-sm font-medium">
                    Track who contacts you through your QR codes and portfolio views with detailed analytics.
                  </p>
                </div>
              </div>

              {/* For Businesses Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                    <FaUsers className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Small Businesses & Professionals</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Digital solutions to improve efficiency and strengthen your online presence.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <FaQrcode className="mr-3 text-green-500" />
                    <span>Business QR Code Solutions</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-3 text-blue-500">🌐</span>
                    <span>Custom Web Development</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-3 text-purple-500">⚙️</span>
                    <span>Digital Tools for Business Management</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-3 text-indigo-500">📱</span>
                    <span>Mobile App Development</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-3 text-pink-500">📊</span>
                    <span>Analytics & Contact Management</span>
                  </li>
                </ul>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-green-800 text-sm font-medium">
                    Get insights on customer interactions and manage leads through integrated dashboards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose ByteBodh?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Practical tools with real-world applications for developers and professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaToolbox className="text-white text-xl" />
                </div>
                <h5 className="text-xl font-bold text-gray-900 mb-3">Practical Tools</h5>
                <p className="text-gray-600">
                  QR generators, portfolio builders, and developer utilities that solve real problems.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <h5 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h5>
                <p className="text-gray-600">
                  Track contacts, scans, and interactions with detailed analytics.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h5 className="text-xl font-bold text-gray-900 mb-3">Career Growth</h5>
                <p className="text-gray-600">
                  Tools designed to help you showcase skills and advance your career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Building Your Digital Presence
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Whether you're creating QR codes, building your portfolio, or developing your next project, ByteBodh has the tools you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/tools"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Explore Tools
                </Link>
                <Link
                  to="/products"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 hover:scale-105 transition-all duration-200"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default AboutUs;
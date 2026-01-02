import React from "react";
import { Link } from "react-router-dom";
import {
  FaQrcode,
  FaUserGraduate,
  FaArrowRight,
  FaImage,
  FaCode,
} from "react-icons/fa";

function ProductsSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Our Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple tools for developers and students to build and grow.
          </p>
        </div>

        {/* Simple Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* QR Code Generator Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FaQrcode className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  QR Code Generator
                </h3>
                <p className="text-blue-600 text-sm">
                  Create and track QR codes
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Generate custom QR codes for links, business cards, and products.
              Track scans and see who contacts you.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Track scan analytics</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">See contact details</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Export QR codes</span>
              </div>
            </div>

            <Link
              to="/qr"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors text-center"
            >
              Try for Free
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Portfolio & Resume Maker Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <FaUserGraduate className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Portfolio Maker
                </h3>
                <p className="text-purple-600 text-sm">
                  Build resume and portfolio
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Create professional portfolios and resumes. See who views your
              profile and download contact details.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Multiple resume templates</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">View recruiter contacts</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Export PDF/Word formats</span>
              </div>
            </div>

            <Link
              to="/login"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors text-center"
            >
              Build Portfolio
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Online Code Editor Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <FaCode className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Online Code Editor
                </h3>
                <p className="text-green-600 text-sm">
                  Practice & run code online
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Practice programming directly in your browser with a powerful
              online code editor. Write, run, and test code across multiple
              programming languages without setup.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Supports multiple programming languages
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Write and run code instantly
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">No installation required</span>
              </div>
            </div>

            <Link
              to="/code-editor"
              className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors text-center"
            >
              Open Code Editor
              <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Image Compressor Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <FaImage className="text-orange-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Image Compressor
                </h3>
                <p className="text-orange-600 text-sm">
                  Compress images online
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Reduce image file sizes without losing quality. Perfect for
              optimizing photos for web, email, or storage.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Batch compression support</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Quality control options</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Fast and secure processing
                </span>
              </div>
            </div>

            <Link
              to="/image-compressor"
              className="block w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition-colors text-center"
            >
              Compress Images
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Additional Navigation Links */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center space-x-6">
            <Link
              to="/services"
              className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
            >
              View All Services →
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors"
            >
              See Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;

// src/pages/Products.js
import React, { useState } from "react";
import {
  FaQrcode,
  FaFileAlt,
  FaBusinessTime,
  FaMobile,
  FaSearch,
  FaRocket,
  FaExternalLinkAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: 1,
      title: "QR Code Generator",
      description:
        "Generate custom QR codes for links, business cards, and products. Track scans and see who contacts you.",
      icon: <FaQrcode className="text-2xl" />,
      category: "Marketing Tools",
      features: [
        "Track scan analytics",
        "See contact details",
        "Export QR codes",
        "Custom designs",
      ],
      status: "Live",
      path: "/qr",
      color: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)",
    },
    {
      id: 2,
      title: "Portfolio Maker",
      description:
        "Create professional portfolios and resumes. See who views your profile and download contact details.",
      icon: <FaFileAlt className="text-2xl" />,
      category: "Career Tools",
      features: [
        "Multiple resume templates",
        "View recruiter contacts",
        "Export PDF/Word formats",
        "Portfolio showcase",
      ],
      status: "Live",
      path: "/login",
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 3,
      title: "Online Code Editor",
      description:
        "Practice programming directly in your browser with a powerful online code editor. Write, run, and test code across multiple programming languages without setup.",
      icon: <FaBusinessTime className="text-2xl" />,
      category: "Developer Tools",
      features: [
        "Supports multiple programming languages",
        "Write and run code instantly",
        "No installation required",
        "Syntax highlighting",
      ],
      status: "Live",
      path: "/code-editor",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 4,
      title: "Image Compressor",
      description:
        "Reduce image file sizes without losing quality. Perfect for optimizing photos for web, email, or storage.",
      icon: <FaMobile className="text-2xl" />,
      category: "Utility Tools",
      features: ["Batch compression support", "Quality control options", "Fast and secure processing", "Multiple formats"],
      status: "Live",
      path: "/image-compressor",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Live":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Live
          </span>
        );
      case "Coming Soon":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            Coming Soon
          </span>
        );
      case "Beta":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Beta
          </span>
        );
      case "In Development":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            In Development
          </span>
        );
      case "Planned":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            Planned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium mb-6">
                <FaRocket className="mr-2" />
                Our Products
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Explore{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  ByteBodh Tools
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Discover our suite of digital tools designed to empower
                businesses and students. From QR code generation to professional
                resume building, we create solutions that simplify tasks and
                enhance productivity.
              </p>

              {/* Search Box */}
              <div className="max-w-lg mx-auto">
                <div className="relative flex items-center bg-white rounded-xl shadow-lg p-3">
                  <FaSearch className="text-gray-400 ml-2 mr-3" />
                  <input
                    type="text"
                    placeholder="Search tools by name, category, or features..."
                    className="flex-1 outline-none text-gray-800 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products List Section */}
        <section className="py-12 md:py-16 mx-10">
          <div className="container mx-auto px-4">
            {/* Products Count */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-gray-900">
                {filteredProducts.length} Digital Tools Available
              </h4>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <h5 className="text-xl font-semibold text-gray-800 mb-3">
                    No Tools Found
                  </h5>
                  <p className="text-gray-600">
                    Try different keywords or check back soon for new product
                    announcements.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 mb-12 max-w-4xl mx-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6 h-full flex flex-col">
                      {/* Product Header */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                            style={{ background: product.color }}
                          >
                            {product.icon}
                          </div>
                          {getStatusBadge(product.status)}
                        </div>

                        <h5 className="text-xl font-semibold text-gray-900 mb-2">
                          {product.title}
                        </h5>

                        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                          {product.category}
                        </span>
                      </div>

                      {/* Product Description */}
                      <div className="mb-4 flex-1">
                        <p className="text-gray-600 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Product Features */}
                      <div className="mb-6">
                        <h6 className="text-sm font-semibold text-gray-900 mb-3">
                          Key Features:
                        </h6>
                        <div className="grid grid-cols-1 gap-2">
                          {product.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-gray-700"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                        <Link
                          to={product.path}
                          className="flex-1 text-center px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
                        >
                          {product.status === "Live" ? "Try Now" : "Learn More"}
                        </Link>
                        {product.status === "Live" && (
                          <Link
                            to={product.path}
                            className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] flex items-center justify-center"
                          >
                            <FaRocket className="mr-2" />
                            Launch Tool
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-12">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-gray-200">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Need a Custom Solution?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Have specific requirements for your business or educational
                  institution? Let's build a custom tool tailored to your needs.
                </p>
                <a
                  href="mailto:info@bytebodh.in"
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
                >
                  Contact Us for Custom Solutions
                  <FaExternalLinkAlt className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Products;

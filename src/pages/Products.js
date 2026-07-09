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
import useSEO from "../hooks/useSEO";


function Products() {
  useSEO({
    title: "Our Products | ByteBodh - Tools & Tech Utilities",
    description: "Explore our collection of utility tools including dynamic QR Code Generator, Resume/Portfolio Maker, Online Code Editor compiler, and client-side Image Compressor.",
    keywords: "online compiler, code editor, qr generator, image compressor, qr code generator with tracking, free online code editor, bytebodh products, utility tools, image size reducer, browser compiler"
  });

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
      color: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
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
      color: "linear-gradient(135deg, #14b8a6 0%, #059669 100%)",
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
      color: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <FaCheckCircle className="mr-1 text-emerald-600" />
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
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            <FaRocket className="text-emerald-500" />
            <span>Our Products</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black leading-[1.1] text-slate-900 tracking-tight">
            Explore <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">ByteBodh Tools</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Discover our suite of digital tools designed to empower businesses and students. We create solutions that simplify tasks and enhance productivity.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-xl p-2 group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <FaSearch className="text-slate-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search tools by name, category, or features..."
                className="flex-1 py-3 px-2 text-slate-800 focus:outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products List Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Products Count */}
          <div className="mb-10 text-left">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">
              {filteredProducts.length} Digital Tools Available
            </h4>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200/50 rounded-3xl shadow-sm max-w-2xl mx-auto">
              <h5 className="text-xl font-black text-slate-900 tracking-tight mb-2">No Tools Found</h5>
              <p className="text-slate-500 font-medium">Try different keywords or check back soon for new product announcements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Product Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                          style={{ background: product.color }}
                        >
                          {product.icon}
                        </div>
                        {getStatusBadge(product.status)}
                      </div>

                      <h5 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-500 transition-colors">
                        {product.title}
                      </h5>

                      <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Description */}
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
                      {product.description}
                    </p>

                    {/* Product Features */}
                    <div className="mb-6">
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                        Key Features:
                      </h6>
                      <div className="space-y-2">
                        {product.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm font-semibold text-slate-600"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2.5"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <Link
                      to={product.path}
                      className="flex-1 text-center py-3.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                    >
                      {product.status === "Live" ? "Try Now" : "Learn More"}
                    </Link>
                    {product.status === "Live" && (
                      <Link
                        to={product.path}
                        className="flex-1 text-center py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-sm"
                      >
                        <FaRocket size={12} />
                        Launch Tool
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="max-w-5xl mx-auto mt-16">
            <div className="bg-gradient-to-tr from-emerald-500 via-emerald-600 to-emerald-500 rounded-[2.5rem] p-8 md:p-12 text-center text-white shadow-xl shadow-emerald-500/20">
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-xl mx-auto mb-6">
                Have specific requirements for your business or educational institution? Let's build a custom tool tailored to your needs.
              </p>
              <a
                href="mailto:info@bytebodh.in"
                className="inline-flex items-center gap-1.5 bg-white text-emerald-600 font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:bg-emerald-50 transition-all text-sm"
              >
                Contact Us for Custom Solutions
                <FaExternalLinkAlt size={10} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Products;

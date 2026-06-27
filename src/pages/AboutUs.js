import React from "react";
import { FaLightbulb, FaToolbox, FaGraduationCap, FaRocket, FaUsers, FaCode, FaQrcode, FaUserTie, FaChartLine, FaEnvelope, FaBriefcase } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";


function AboutUs() {
  useSEO({
    title: "About Us | ByteBodh - Empowering Tech Careers",
    description: "Learn more about ByteBodh. Our mission is to empower developers, students, and professionals to build custom portfolios, design professional resumes, and secure careers.",
    keywords: "about bytebodh, resume creator team, portfolio developer, tech placement services"
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            <FaLightbulb className="text-emerald-500" />
            <span>Modern Portfolio Builder & Career Hub</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black leading-[1.1] text-slate-900 tracking-tight">
            About <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">ByteBodh</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Empowering developers, students, and professionals to build stunning portfolios, track analytics, and unlock career opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-lg opacity-25 group-hover:opacity-45 transition duration-700 animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                alt="ByteBodh Team Working Together"
                className="relative z-10 w-full rounded-2xl shadow-xl hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
            <div className="lg:w-1/2 space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Our Mission</h2>
              <p className="text-base text-slate-500 font-medium leading-relaxed">
                At ByteBodh, we build practical digital solutions that solve real-world career branding problems. We believe that everyone—whether a student starting their career, a designer displaying visual arts, or a developer sharing code repositories—deserves a premium, professional online presence that represents them 24/7.
              </p>
              <p className="text-base text-slate-500 font-medium leading-relaxed">
                Our platform functions as an intuitive, 2-minute portfolio maker. We provide highly responsive, niche-tailored layouts (such as Hacker Terminal, IDE Studio, and Creative Gallery) that showcase your achievements, certifications, and skills without you writing a single line of CSS.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-6">
                <div className="flex items-center text-emerald-600 font-bold text-sm">
                  <FaCode className="mr-2 text-lg" />
                  <span>Developer Templates</span>
                </div>
                <div className="flex items-center text-teal-600 font-bold text-sm">
                  <FaQrcode className="mr-2 text-lg" />
                  <span>QR Code Analytics</span>
                </div>
                <div className="flex items-center text-emerald-500 font-bold text-sm">
                  <FaUserTie className="mr-2 text-lg" />
                  <span>Interactive Dashboards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Students & Developers Card */}
            <div className="bg-white rounded-3xl border border-slate-200/50 p-8 md:p-10 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mr-4 text-white">
                    <FaGraduationCap className="text-xl" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">For Developers & Students</h3>
                </div>
                <p className="text-slate-500 font-medium text-sm mb-6">
                  Curated tools and resources built to scale your professional reputation and highlight your capabilities.
                </p>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <span className="mr-3 text-emerald-500">💻</span>
                    <span>Hacker Monospace & IDE Studio Themes</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <FaUserTie className="mr-3 text-teal-500" />
                    <span>Instant Academic Portfolio & Resume Generator</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <FaCode className="mr-3 text-emerald-500" />
                    <span>GitHub, LinkedIn, and Project Repos Integrations</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <FaLightbulb className="mr-3 text-emerald-500" />
                    <span>Blogs, Tech Tutorials, and Resource Guides</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <FaChartLine className="mr-3 text-emerald-500" />
                    <span>Detailed Traffic and Visitor Insights</span>
                  </li>
                </ul>
              </div>
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-500/10">
                <p className="text-emerald-800 text-xs font-semibold leading-relaxed">
                  Easily monitor traffic sources, page views, and who contacts you through your portfolio analytics.
                </p>
              </div>
            </div>

            {/* For Businesses & Recruiters Card */}
            <div className="bg-white rounded-3xl border border-slate-200/50 p-8 md:p-10 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center mr-4 text-white">
                    <FaUsers className="text-xl" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">For Recruiters & Professionals</h3>
                </div>
                <p className="text-slate-500 font-medium text-sm mb-6">
                  Digital networking resources to help recruiters discover high-potential talent quickly.
                </p>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <FaQrcode className="mr-3 text-teal-500" />
                    <span>Dynamic QR Codes for CVs and Cards</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <span className="mr-3 text-emerald-500">📄</span>
                    <span>1-Click PDF Resumes and Placement Packs</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <FaBriefcase className="mr-3 text-emerald-500" />
                    <span>Tech Job Feeds & Placement Openings</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <FaEnvelope className="mr-3 text-emerald-500" />
                    <span>Direct Lead Capture & Recruiter Contact Forms</span>
                  </li>
                  <li className="flex items-center text-slate-600 text-sm font-semibold">
                    <span className="mr-3 text-emerald-500">🛡️</span>
                    <span>Verified Credentials and Certificates</span>
                  </li>
                </ul>
              </div>
              <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-500/10">
                <p className="text-teal-800 text-xs font-semibold leading-relaxed">
                  Establish trust with potential employers by centralizing references, reviews, and test scores in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Why Choose ByteBodh?
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Innovative utilities, premium designs, and full analytics to propel your career forward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-white">
                <FaToolbox className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2-Minute Setup</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                No hosting setup or coding. Populate a simple form, pick a template, and deploy your portfolio link instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-white">
                <FaChartLine className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Visitor Insights</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Understand user engagement. Monitor page visits, location stats, and recruiter interaction data seamlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-white">
                <FaRocket className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Professional Themes</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Monospace CLI dashboards, tabbed IDE editors, minimalist academic resumes, and gallery styles tailored to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-tr from-emerald-500 via-emerald-600 to-emerald-500 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20">
            <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                Start Building Your Brand Online
              </h2>
              <p className="text-lg text-emerald-50 max-w-xl mx-auto">
                Join over 10,000+ developers, designers, and students showcase their work and accelerate their careers with ByteBodh.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  Create My Portfolio
                </Link>
                <Link
                  to="/products"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutUs;
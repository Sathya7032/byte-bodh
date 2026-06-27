import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaMobileAlt,
  FaRocket,
  FaFilePdf,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaBolt,
  FaGooglePlay
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import hero from "../assets/images/hero.png";
import freeTemplate from "../assets/images/FreeTemplate.png";
import template2 from "../assets/images/Template2.png";
import template3 from "../assets/images/Template3.png";
import template4 from "../assets/images/Template4.png";
import template5 from "../assets/images/Template5.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Testimonial & Mock Data
const testimonials = [
  {
    name: "Vikram Malhotra",
    role: "CSE Student at BITS Pilani",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    quote: "ByteBodh was a lifesaver for placement season. I filled in my credentials, selected the 'Academic Std' template, and recruiters were blown away by my custom portfolio link!",
    rating: 5,
    tag: "Student"
  },
  {
    name: "Rohan Deshmukh",
    role: "Software Engineer at Google",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    quote: "I wanted a geeky developer portfolio without spending hours writing custom CSS. The 'Hacker Terminal' template is outstanding. 1-click update on the go, plus detailed traffic analytics.",
    rating: 5,
    tag: "Professional"
  },
  {
    name: "Aisha Sen",
    role: "Lead Product Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    quote: "This platform is truly a 2-minute portfolio maker. I filled in my background details, chose a layout, and had a stunning live portfolio online instantly. Highly recommend!",
    rating: 5,
    tag: "Professional"
  }
];

const templatesShowcase = [
  {
    name: "Academic Minimalist",
    image: freeTemplate,
    category: "Students & Freshers",
    desc: "A clean, ATS-friendly minimalist layout emphasizing education, publications, and technical skills.",
    accent: "border-slate-200",
    badge: "Free"
  },
  {
    name: "Hacker Terminal",
    image: template2,
    category: "Developers & Sysadmins",
    desc: "A responsive monospace command-line interface. Highly interactive folder navigation styling.",
    accent: "border-emerald-500/20",
    badge: "Developer Fav"
  },
  {
    name: "Creative Gallery",
    image: template3,
    category: "Designers & Artists",
    desc: "A visual grid layout with frosted glass controls, portfolio images, and embedded media assets.",
    accent: "border-teal-500/20",
    badge: "Visual Rich"
  },
  {
    name: "Executive Brand",
    image: template4,
    category: "Product Managers & Leads",
    desc: "A premium corporate layout with timeline progress tracking, corporate KPIs, and details.",
    accent: "border-[#10B981]/20",
    badge: "Premium Clean"
  },
  {
    name: "Developer IDE Studio",
    image: template5,
    category: "Software Engineers",
    desc: "A fully immersive VS Code styled portfolio layout featuring tabs, explorer, and a live compiler mode.",
    accent: "border-sky-500/20",
    badge: "New Release"
  }
];

const Homepage = () => {
  useSEO({
    title: "ByteBodh | AI Portfolio Builder & Career Hub for Developers & Students",
    description: "Create a professional online portfolio website in 2 minutes. Choose from premium CLI terminal, IDE, and academic templates. Compile CVs to PDF and track views.",
    keywords: "portfolio maker, resume builder, developer portfolio, student cv template, terminal portfolio, bytebodh"
  });

  const [faqOpen, setFaqOpen] = useState(null);
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      
      {/* 1. NAVIGATION BAR */}
      <Header />

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        {/* Soft glowing ambient circles */}
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">

          {/* Hero Left Content */}
          <motion.div 
            className="lg:col-span-6 space-y-8 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Trust Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
              <span className="text-amber-500">⭐</span>
              <span>Trusted by 10,000+ students & professionals</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6.5xl font-black leading-[1.1] text-slate-900 tracking-tight">
              Your Portfolio.<br />
              Your Story.<br />
              Built by{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                ByteBodh
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Create a professional portfolio website in minutes. Just enter your details, choose a template, and publish instantly.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                Create My Portfolio
                <FaArrowRight size={14} />
              </Link>
              <a
                href="#templates-section"
                className="w-full sm:w-auto text-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Explore Templates
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Right Visuals: Hero Image Preview */}
          <motion.div 
            className="lg:col-span-6 relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl shadow-2xl shadow-emerald-500/20 group">
              {/* Floating animated blobs behind the image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse"></div>
              
              <img
                src={hero}
                alt="ByteBodh Portfolio Platform"
                className="w-full max-w-[620px] lg:max-w-[680px] h-auto object-contain hover:scale-[1.02] transition-transform duration-500 pointer-events-none select-none relative z-10 rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-slate-200/50 z-20 pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-block">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Portfolio Website in 3 Simple Steps
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500">
              Transform your accomplishments into a stunning website without writing a single line of code.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-12 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Timeline connectors */}
            <div className="hidden md:block absolute top-[28%] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent z-0 overflow-hidden">
               <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 animate-[shimmer_2s_infinite]"></div>
            </div>

            {/* Step 1 */}
            <motion.div variants={fadeInUp} className="relative z-10 bg-white/60 backdrop-blur-md border border-slate-200/50 p-8 rounded-3xl text-center space-y-6 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-2xl font-black text-emerald-500 mx-auto group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Choose a Template</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Browse curated, career-specific templates optimized for students, designers, product managers, and developers.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={fadeInUp} className="relative z-10 bg-white/60 backdrop-blur-md border border-slate-200/50 p-8 rounded-3xl text-center space-y-6 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-2xl font-black text-emerald-500 mx-auto group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Add Your Details</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Fill in your profile, projects, work experiences, certifications, education, and social links in a simple dashboard.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={fadeInUp} className="relative z-10 bg-white/60 backdrop-blur-md border border-slate-200/50 p-8 rounded-3xl text-center space-y-6 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-2xl font-black text-emerald-500 mx-auto group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Publish Instantly</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Deploy your live portfolio URL (e.g. `bytebodh.in/yourname`) in seconds. Instantly ready to share.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. TEMPLATE HORIZONTAL SLIDING SHOWCASE */}
      <section id="templates-section" className="py-24 bg-slate-50/50 border-t border-slate-100 overflow-hidden">
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <motion.div 
          className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-block">
            Templates Catalog
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Templates Designed for Every Career
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-slate-500 max-w-2xl mx-auto">
            Choose from our premium designs, optimized to display your career milestones with rich aesthetics. Click on any template to preview it live.
          </motion.p>
        </motion.div>

        <div className="relative w-full group">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 transform active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer hidden md:flex"
            aria-label="Scroll Left"
          >
            <FaChevronLeft size={16} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 transform active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer hidden md:flex"
            aria-label="Scroll Right"
          >
            <FaChevronRight size={16} />
          </button>

          {/* Fade overlays on left/right for smooth transition visual look */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 via-slate-50/20 to-transparent z-10 pointer-events-none hidden md:block"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 via-slate-50/20 to-transparent z-10 pointer-events-none hidden md:block"></div>

          {/* Horizontally scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto px-6 md:px-24 pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {[freeTemplate, template2, template3, template4, template5].map((img, idx) => (
              <a
                key={idx}
                href={`/templates/preview/${idx + 1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[290px] sm:w-[450px] md:w-[600px] aspect-[16/10] rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.01] snap-center bg-white group relative block"
              >
                <img
                  src={img}
                  alt={`Template ${idx + 1} screenshot`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Floating Preview Overlay on Hover */}
                <div className="absolute inset-0 bg-[#0f172a]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <span className="px-5 py-2.5 bg-white text-slate-900 text-xs font-black rounded-2xl shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 hover:bg-slate-50">
                    Live Preview 👁️
                  </span>
                  <span className="text-[10px] text-white/80 font-semibold tracking-wider drop-shadow-md">
                    Template {idx + 1}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section id="features-section" className="py-24 bg-white border-t border-slate-100 relative">
        {/* Soft glowing ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
          className="max-w-7xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-block">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Everything You Need to Stand Out
            </h2>
            <p className="text-lg text-slate-500">
              ByteBodh packs all the modern features required to launch your brand and make recruiter connections.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI Portfolio Generator",
                desc: "Generate professional bios, summaries, project details, and optimized profile headers instantly with built-in AI assistant prompts.",
                icon: <FaBolt className="text-emerald-500 text-lg" />
              },
              {
                title: "Responsive Design",
                desc: "Your portfolio automatically adjusts to render perfectly across smartphones, tablets, and desktop resolutions.",
                icon: <FaMobileAlt className="text-teal-500 text-lg" />
              },
              {
                title: "Resume Integration",
                desc: "Compile your web portfolio details back into perfectly structured offline PDF resumes in a single click.",
                icon: <FaFilePdf className="text-rose-500 text-lg" />
              },
              {
                title: "One-Click Publishing",
                desc: "Forget manual server files, hosting config, or deployment hooks. Enter details, select design, and go live instantly.",
                icon: <FaRocket className="text-purple-500 text-lg" />
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden"
              >
                {/* Subtle hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300 relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 6. FOR STUDENTS SECTION */}
      <section id="students-section" className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">

          {/* Student Highlights (Left side) */}
          <motion.div 
            className="lg:col-span-6 space-y-8 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-block">
              For Students & Freshers
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for Students
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500 leading-relaxed">
              Struggling to stand out in university campus placement drives? ByteBodh helps fresh graduates compile their academic credentials into a hiring-ready online portfolio.
            </motion.p>

            {/* Highlights Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {[
                { title: "Academic Achievements", desc: "Showcase CGPA, university rank, and scholarship awards." },
                { title: "Certifications Log", desc: "Verified listings of AWS, Google, and Udemy courses." },
                { title: "Internships History", desc: "Highlight summer training roles, client mentors, and scope." },
                { title: "Hackathons Win", desc: "Display hackathon rankings, project team lists, and repos." }
              ].map((highlight, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs mt-1 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{highlight.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{highlight.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
              >
                Create Student Portfolio
                <FaArrowRight size={12} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Student Portfolio Mockup Preview (Right side) */}
          <motion.div 
            className="lg:col-span-6 flex justify-center w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:shadow-emerald-500/10 transition-shadow duration-500">
              {/* MacOS Window Dots */}
              <div className="absolute top-4 left-5 flex gap-1.5 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="absolute top-3 right-6 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Student Profile Preview (Live URL)
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4 mt-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Arjun Sharma</h3>
                  <p className="text-xs text-emerald-500 font-bold">B.Tech Student @IIT Delhi</p>
                </div>
                <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 text-[9px] font-bold">CGPA: 9.2</div>
              </div>

              <div className="space-y-4 text-left text-xs text-slate-500">
                <p className="italic">"Passionate about algorithms and mobile app development. Seeking frontend roles."</p>

                <div className="space-y-2">
                  <h4 className="text-[9px] font-black uppercase text-slate-400">Certificates & Hackathons</h4>
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">AWS Developer Associate</span>
                      <span className="text-[10px] text-slate-400">Amazon Web Services</span>
                    </div>
                    <span className="text-lg">🎖️</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Hackout Delhi 2025</span>
                      <span className="text-[10px] text-slate-400">Winner (Smart Contract Track)</span>
                    </div>
                    <span className="text-lg">🏆</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. FOR PROFESSIONALS SECTION */}
      <section id="professionals-section" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">

          {/* Professional Portfolio Mockup Preview (Left side) */}
          <motion.div 
            className="lg:col-span-6 flex justify-center order-2 lg:order-1 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="w-full max-w-[480px] bg-slate-950 text-slate-200 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group hover:shadow-emerald-500/10 transition-shadow duration-500">
              {/* MacOS Window Dots */}
              <div className="absolute top-4 left-5 flex gap-1.5 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="absolute top-3 right-6 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Professional Profile Preview (Dark Theme)
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4 mt-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Devika Sen</h3>
                  <p className="text-xs text-emerald-500 font-semibold">Lead Backend Engineer</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">DS</div>
              </div>

              <div className="space-y-4 text-left text-xs text-slate-400">
                <p className="leading-relaxed text-xs">"Architecting distributed database systems, scale testing APIs, and optimizing cloud container instances at ScaleCorp."</p>

                <div className="space-y-3">
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Work History</h4>
                  <div className="relative pl-4 border-l border-emerald-500/30 space-y-3 py-1">
                    <div className="hover:bg-slate-900/50 p-1.5 -ml-1.5 rounded-lg transition-colors">
                      <span className="absolute left-[0.5px] top-3 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 -translate-x-full"></span>
                      <div className="flex justify-between text-xs text-white font-bold ml-1.5">
                        <span>Lead Backend Developer</span>
                        <span className="text-[10px] text-slate-500">2023 - Present</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 ml-1.5">ScaleCorp Inc.</p>
                    </div>
                    <div className="hover:bg-slate-900/50 p-1.5 -ml-1.5 rounded-lg transition-colors">
                      <span className="absolute left-[0.5px] top-[3.25rem] w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-950 -translate-x-full"></span>
                      <div className="flex justify-between text-xs text-white font-bold ml-1.5">
                        <span>Software Engineer</span>
                        <span className="text-[10px] text-slate-500">2021 - 2023</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 ml-1.5">TechDev Solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Student Highlights (Right side) */}
          <motion.div 
            className="lg:col-span-6 space-y-8 text-left order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-block">
              For Working Professionals
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for Professionals
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500 leading-relaxed">
              Showcase case studies, leadership highlights, and executive timelines. Stand out on LinkedIn with a professional custom portfolio link.
            </motion.p>

            {/* Highlights Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {[
                { title: "Work Experience Timeline", desc: "Neat vertical timelines documenting previous roles and achievements." },
                { title: "Case Studies Focus", desc: "Explain execution metrics, team sizes, and engineering impact." },
                { title: "Client Testimonials", desc: "Integrate reviews and references from past managers." },
                { title: "Leadership logs", desc: "Showcase mentoring achievements, speaking logs, and team sizes." }
              ].map((highlight, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs mt-1 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{highlight.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{highlight.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
              >
                Build Professional Portfolio
                <FaArrowRight size={12} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 8. TEMPLATE PREVIEW SHOWCASE */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider">
              Template Gallery
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Explore Our Live Layouts
            </h2>
            <p className="text-lg text-slate-500">
              Choose from our premium designs, optimized to display your career milestones with rich aesthetics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templatesShowcase.map((tpl, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-50 border border-slate-150 rounded-2xl mb-5 overflow-hidden relative shadow-inner">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-slate-950/80 text-white text-[10px] font-black uppercase rounded-lg backdrop-blur-sm border border-white/10 shadow">
                        {tpl.badge}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {tpl.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-500 transition-colors leading-snug">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tpl.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase">Template {idx + 1}</span>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:underline"
                  >
                    Select Design <FaArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section id="testimonials-section" className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-block">
              Reviews
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Loved by Students and Professionals
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500">
              Read how freshers and senior developers leverage ByteBodh to build their credentials.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Fade overlays for marquee */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Container */}
            <div className="flex overflow-hidden group">
              <div className="flex gap-8 animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
                {/* Double the testimonials array for seamless looping */}
                {[...testimonials, ...testimonials].map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[350px] shrink-0 bg-slate-50/70 border border-slate-200/50 p-8 rounded-3xl relative flex flex-col justify-between hover:shadow-2xl hover:border-emerald-500/20 transition-all duration-300"
                  >
                    <div>
                      <div className="flex gap-1 text-amber-400 mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <FaStar key={i} size={14} />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{t.quote}"</p>
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-200/40">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-none">{t.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">{t.role}</p>
                      </div>
                    </div>

                    <span className="absolute top-6 right-8 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[8px] font-extrabold uppercase rounded">
                      {t.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. MOBILE APP COMING SOON SECTION */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-900">
        {/* Soft glowing backdrop */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Text Content */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider inline-block">
              On The Go
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              ByteBodh Mobile App <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Available Now</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
              Create, update, and monitor your personal portfolio directly from your mobile device. Edit projects, check analytics, and share your QR code link instantly from anywhere.
            </motion.p>

            {/* Google Play Badges & Features */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:bg-slate-900 hover:border-emerald-500/50 transition-all shadow-xl group cursor-pointer"
              >
                <FaGooglePlay className="text-white text-2xl group-hover:text-emerald-400 transition-colors" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Get it on</span>
                  <span className="text-sm font-bold text-white block">Google Play</span>
                </div>
              </a>
              <span className="text-xs text-emerald-400 font-extrabold uppercase bg-emerald-950/40 px-3.5 py-1.5 border border-emerald-500/20 rounded-full shadow-inner">
                App Store Live
              </span>
            </motion.div>
          </motion.div>

          {/* Visual Showcase (Mockup) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-[280px] aspect-[9/19] bg-slate-900 border-[6px] border-slate-800 rounded-[2.5rem] shadow-2xl p-3 flex flex-col justify-between overflow-hidden group">
              {/* Speaker & camera slot */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-24 bg-slate-800 rounded-b-2xl z-20"></div>

              {/* Internal Mockup Content */}
              <div className="flex-1 rounded-[1.8rem] bg-slate-950 border border-slate-800/50 p-4 pt-8 flex flex-col justify-between relative overflow-hidden text-xs">
                {/* Glow inside mobile */}
                <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black tracking-widest text-emerald-500 uppercase">ByteBodh App</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>

                  {/* Profile mini preview */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-[10px]">BB</div>
                      <div>
                        <h4 className="font-bold text-white text-[10px]">Your Portfolio</h4>
                        <p className="text-[8px] text-emerald-500">bytebodh.in/username</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[8px] pt-1">
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                        <span className="text-slate-500 block">Total Views</span>
                        <span className="font-extrabold text-white text-[9px]">1,240</span>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                        <span className="text-slate-500 block">Templates</span>
                        <span className="font-extrabold text-emerald-500 text-[9px]">Hacker Terminal</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature status list */}
                  <div className="space-y-2 text-[9px]">
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[8px]">✓</div>
                      <span>Live Site Analytics Tracker</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[8px]">✓</div>
                      <span>Instant QR Code Generation</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[8px]">✓</div>
                      <span>AI Bio Editor (Version 2.0)</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-center rounded-xl text-[9px] cursor-pointer transition-colors mt-4 block"
                >
                  Download App 📱
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ SECTION */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-block">
              FAQ
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500">
              Answers regarding domains, coding capabilities, and editing.
            </motion.p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Is coding required?",
                a: "No coding is required whatsoever. ByteBodh's profile builder offers intuitive forms where you input your education, certifications, and project links. We construct the pages and handle database configurations automatically."
              },
              {
                q: "Can I use my own domain?",
                a: "Currently, custom domains are not supported. All portfolios are instantly published directly under the official ByteBodh domain (e.g., bytebodh.in/yourname), providing you with a clean, fast, and unified link to share."
              },
              {
                q: "Can I edit later?",
                a: "Yes, you can edit your portfolio data anytime. Simply login to your dashboard, update your experience or add a project, and the live site updates in milliseconds."
              },
              {
                q: "Is hosting included?",
                a: "Yes, cloud web hosting on our fast Global CDN is fully integrated. Your website stays online 24/7 with zero maintenance or hosting setup required."
              },
              {
                q: "Which templates are available?",
                a: "We offer professional resume portfolios, interactive developer command terminal frames, creative designer grids, product roadmaps, and data scientist model insight dashboards."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="font-bold text-slate-900 text-base md:text-lg pr-4">{faq.q}</span>
                  {faqOpen === index ? (
                    <FaChevronUp className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-slate-400 flex-shrink-0" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${faqOpen === index ? "max-h-52 border-t border-slate-100" : "max-h-0"
                    }`}
                >
                  <p className="p-6 text-slate-500 text-sm md:text-base leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA SECTION */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="bg-gradient-to-tr from-emerald-500 via-emerald-600 to-emerald-500 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Ambient glows inside CTA */}
            <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                Launch Your Portfolio Today
              </h2>
              <p className="text-lg text-indigo-100 max-w-xl mx-auto">
                Join thousands of students and professionals building their online presence with ByteBodh.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  Create Portfolio Free
                </Link>
                <a
                  href="#templates-section"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  View Templates
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <Footer />
    </div>
  );
};

export default Homepage;
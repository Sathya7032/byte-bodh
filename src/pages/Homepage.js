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
  FaGooglePlay,
  FaShieldAlt,
  FaUsers,
  FaCode,
  FaPalette,
  FaChartLine,
  FaCloudUploadAlt,
  FaRegClock,
  FaUserGraduate,
  FaUserTie,
  FaCheckCircle,
  FaPlay,
  FaRegHeart,
  FaShareAlt,
  FaQrcode
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import hero from "../assets/images/hero.jpeg";
import freeTemplate from "../assets/images/FreeTemplate.png";
import template2 from "../assets/images/Template2.png";
import template3 from "../assets/images/Template3.png";
import template4 from "../assets/images/Template4.png";
import template5 from "../assets/images/Template5.png";
import howItWorks1 from "../assets/images/how-it-works (1).jpeg";
import howItWorks2 from "../assets/images/how-it-works (3).jpeg";
import howItWorks3 from "../assets/images/how-it-works (2).jpeg";
import studentImg from "../assets/images/Student.jpeg";
import professionalImg from "../assets/images/Professional.jpeg";

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

const testimonials = [
  {
    name: "Sai Kiran Reddy",
    role: "CSE Student at BITS Pilani Hyderabad",
    quote: "ByteBodh was a lifesaver for placement season. I filled in my credentials, selected the 'Academic Std' template, and recruiters were blown away by my custom portfolio link!",
    rating: 5,
    tag: "Student",
    avatar: "SK"
  },
  {
    name: "Anirudh Rao",
    role: "Software Engineer at Google Hyderabad",
    quote: "I wanted a geeky developer portfolio without spending hours writing custom CSS. The 'Hacker Terminal' template is outstanding. 1-click update on the go, plus detailed traffic analytics.",
    rating: 5,
    tag: "Professional",
    avatar: "AR"
  },
  {
    name: "Harini Reddy",
    role: "Lead Product Manager in Hyderabad",
    quote: "This platform is truly a 2-minute portfolio maker. I filled in my background details, chose a layout, and had a stunning live portfolio online instantly. Highly recommend!",
    rating: 5,
    tag: "Professional",
    avatar: "HR"
  }
];

const templatesShowcase = [
  {
    name: "Academic Minimalist",
    image: freeTemplate,
    category: "Students & Freshers",
    desc: "A clean, ATS-friendly minimalist layout emphasizing education, publications, and technical skills.",
    accent: "border-slate-200",
    badge: "Free",
    color: "from-blue-500 to-cyan-400"
  },
  {
    name: "Hacker Terminal",
    image: template2,
    category: "Developers & Sysadmins",
    desc: "A responsive monospace command-line interface. Highly interactive folder navigation styling.",
    accent: "border-emerald-500/20",
    badge: "Developer Fav",
    color: "from-emerald-500 to-teal-400"
  },
  {
    name: "Creative Gallery",
    image: template3,
    category: "Designers & Artists",
    desc: "A visual grid layout with frosted glass controls, portfolio images, and embedded media assets.",
    accent: "border-emerald-500/20",
    badge: "Visual Rich",
    color: "from-purple-500 to-pink-400"
  },
  {
    name: "Executive Brand",
    image: template4,
    category: "Product Managers & Leads",
    desc: "A premium corporate layout with timeline progress tracking, corporate KPIs, and details.",
    accent: "border-[#10B981]/20",
    badge: "Premium Clean",
    color: "from-indigo-500 to-violet-400"
  },
  {
    name: "Developer IDE Studio",
    image: template5,
    category: "Software Engineers",
    desc: "A fully immersive VS Code styled portfolio layout featuring tabs, explorer, and a live compiler mode.",
    accent: "border-emerald-500/20",
    badge: "New Release",
    color: "from-blue-600 to-cyan-500"
  }
];

const Homepage = () => {
  useSEO({
    title: "ByteBodh | AI Portfolio Builder & Career Hub for Developers & Students",
    description: "Create a professional online portfolio website in 2 minutes. Choose from premium CLI terminal, IDE, and academic templates. Compile CVs to PDF and track views.",
    keywords: "portfolio builder, resume maker, online portfolio maker, developer portfolio templates, terminal portfolio builder, academic cv template, ATS-friendly resume builder, tech job notifications, bytebodh, dynamic portfolio, portfolio builder for developers, free resume maker, best developer portfolio examples, VS Code portfolio template, interactive resume, fresher resume builder, career portfolio maker, software engineer portfolio, build online portfolio free, CV maker online, student resume template, professional portfolio website builder, free online compiler, image compressor, qr code generator tracking"
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

      <Header />

      {/* HERO SECTION - Enhanced */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/30">

        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-emerald-300/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <motion.div
            className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600 hover:shadow-md transition-shadow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Trusted by 10,000+ students & professionals</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.1] text-slate-900 tracking-tight">
              Your Portfolio.<br />
              Your Story.<br />
              Built by{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent relative">
                ByteBodh
                <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q25 10 50 5 Q75 0 100 5" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Create a professional portfolio website in minutes. Just enter your details, choose a template, and publish instantly.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                Create My Portfolio
                <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#templates-section"
                className="w-full sm:w-auto text-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-emerald-500 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Explore Templates
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-emerald-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">4.9/5 from 500+ reviews</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-6 relative flex items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl shadow-2xl shadow-slate-200/80 group max-w-[620px] lg:max-w-[680px] w-full">
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-2 shadow-lg flex items-center gap-2 z-20 animate-float">
                <FaRocket className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-800">Live in 2 min</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-2 shadow-lg flex items-center gap-2 z-20 animate-float-delayed">
                <FaShieldAlt className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-800">100% Free</span>
              </div>
              <img
                src={hero}
                alt="ByteBodh Portfolio Platform"
                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500 pointer-events-none select-none relative z-10 rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-slate-200/50 z-20 pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION - New */}
      <section className="py-12 bg-gradient-to-r from-emerald-50/50 to-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Portfolios Created", icon: <FaUsers className="text-emerald-500" /> },
              { value: "50+", label: "Templates Available", icon: <FaPalette className="text-emerald-500" /> },
              { value: "4.9", label: "User Rating", icon: <FaStar className="text-emerald-500" /> },
              { value: "99.9%", label: "Uptime Guarantee", icon: <FaCloudUploadAlt className="text-emerald-500" /> }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-black text-slate-900">
                  {stat.icon}
                  <span>{stat.value}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Enhanced */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/20 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaRegClock size={12} />
              Simple Process
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Portfolio Website in <span className="text-emerald-500">3 Simple Steps</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500">
              Transform your accomplishments into a stunning website without writing a single line of code.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Timeline connectors */}
            <div className="hidden md:block absolute top-[30%] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 z-0 rounded-full">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60 animate-[shimmer_2s_infinite] rounded-full"></div>
            </div>

            {[
              {
                step: 1,
                title: "Choose a Template",
                desc: "Browse curated, career-specific templates optimized for students, designers, product managers, and developers.",
                img: howItWorks1,
                icon: <FaPalette />
              },
              {
                step: 2,
                title: "Add Your Details",
                desc: "Fill in your profile, projects, work experiences, certifications, education, and social links in a simple dashboard.",
                img: howItWorks2,
                icon: <FaCode />
              },
              {
                step: 3,
                title: "Publish Instantly",
                desc: "Deploy your live portfolio URL (e.g. bytebodh.in/yourname) in seconds. Instantly ready to share.",
                img: howItWorks3,
                icon: <FaCloudUploadAlt />
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="relative z-10 bg-white border border-slate-200/60 p-6 rounded-3xl text-center space-y-6 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-lg">
                    {item.step}
                  </div>
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-emerald-500 shadow-md">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE - Enhanced */}
      <section id="templates-section" className="py-24 bg-gradient-to-b from-slate-50/50 to-white border-t border-slate-100 overflow-hidden">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-float-delayed { animation: float 3s ease-in-out infinite 1.5s; }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        <motion.div
          className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
            <FaPalette size={12} />
            Templates Catalog
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Templates Designed for <span className="text-emerald-500">Every Career</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-slate-500 max-w-2xl mx-auto">
            Choose from our premium designs, optimized to display your career milestones with rich aesthetics.
          </motion.p>
        </motion.div>

        <div className="relative w-full group">
          <button
            onClick={scrollLeft}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 transform active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer hidden md:flex"
            aria-label="Scroll Left"
          >
            <FaChevronLeft size={16} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 border border-slate-200 shadow-xl flex items-center justify-center text-slate-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 transform active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer hidden md:flex"
            aria-label="Scroll Right"
          >
            <FaChevronRight size={16} />
          </button>

          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 via-slate-50/20 to-transparent z-10 pointer-events-none hidden md:block"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 via-slate-50/20 to-transparent z-10 pointer-events-none hidden md:block"></div>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto px-4 md:px-24 pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
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
                className="flex-shrink-0 w-[280px] sm:w-[450px] md:w-[600px] aspect-[16/10] rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02] snap-center bg-white group relative"
              >
                <img
                  src={img}
                  alt={`Template ${idx + 1} screenshot`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <span className="px-5 py-2.5 bg-white text-slate-900 text-xs font-black rounded-2xl shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 hover:bg-slate-50">
                    <FaPlay size={10} /> Live Preview
                  </span>
                  <span className="text-[10px] text-white/80 font-semibold tracking-wider drop-shadow-md">
                    Template {idx + 1}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                  Template {idx + 1}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Enhanced */}
      <section className="py-24 bg-white border-t border-slate-100 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div
          className="max-w-7xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaBolt size={12} />
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Everything You Need to <span className="text-emerald-500">Stand Out</span>
            </h2>
            <p className="text-lg text-slate-500">
              ByteBodh packs all the modern features required to launch your brand and make recruiter connections.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI Portfolio Generator",
                desc: "Generate professional bios, summaries, project details, and optimized profile headers instantly with built-in AI assistant prompts.",
                icon: <FaBolt className="text-emerald-500 text-xl" />,
                gradient: "from-emerald-50 to-teal-50"
              },
              {
                title: "Responsive Design",
                desc: "Your portfolio automatically adjusts to render perfectly across smartphones, tablets, and desktop resolutions.",
                icon: <FaMobileAlt className="text-emerald-500 text-xl" />,
                gradient: "from-blue-50 to-cyan-50"
              },
              {
                title: "Resume Integration",
                desc: "Compile your web portfolio details back into perfectly structured offline PDF resumes in a single click.",
                icon: <FaFilePdf className="text-emerald-500 text-xl" />,
                gradient: "from-red-50 to-rose-50"
              },
              {
                title: "One-Click Publishing",
                desc: "Forget manual server files, hosting config, or deployment hooks. Enter details, select design, and go live instantly.",
                icon: <FaRocket className="text-emerald-500 text-xl" />,
                gradient: "from-purple-50 to-violet-50"
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 relative group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* STUDENTS SECTION - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-slate-50/50 to-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <motion.div
            className="lg:col-span-6 space-y-8 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaUserGraduate size={12} />
              For Students & Freshers
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for <span className="text-emerald-500">Students</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500 leading-relaxed">
              Struggling to stand out in university campus placement drives? ByteBodh helps fresh graduates compile their academic credentials into a hiring-ready online portfolio.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {[
                { title: "Academic Achievements", desc: "Showcase CGPA, university rank, and scholarship awards." },
                { title: "Certifications Log", desc: "Verified listings of AWS, Google, and Udemy courses." },
                { title: "Internships History", desc: "Highlight summer training roles, client mentors, and scope." },
                { title: "Hackathons Win", desc: "Display hackathon rankings, project team lists, and repos." }
              ].map((highlight, idx) => (
                <div key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    <FaCheckCircle size={12} />
                  </div>
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
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
              >
                Create Student Portfolio
                <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-6 flex justify-center w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-3xl p-3 pt-12 shadow-2xl relative overflow-hidden group hover:shadow-emerald-500/20 transition-shadow duration-500">
              <div className="absolute top-4 left-5 flex gap-1.5 z-10">
                <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="absolute top-3 right-6 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Student Profile Preview
              </div>
              <img
                src={studentImg}
                alt="Student Portfolio Preview"
                className="w-full h-auto rounded-2xl border border-slate-100 shadow-sm object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROFESSIONALS SECTION - Enhanced */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <motion.div
            className="lg:col-span-6 flex justify-center order-2 lg:order-1 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="w-full max-w-[480px] bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 border border-slate-700 rounded-3xl p-3 pt-12 shadow-2xl relative overflow-hidden group hover:shadow-emerald-500/20 transition-shadow duration-500">
              <div className="absolute top-4 left-5 flex gap-1.5 z-10">
                <div className="w-3 h-3 rounded-full bg-emerald-600/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
              </div>
              <div className="absolute top-3 right-6 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Professional Profile Preview
              </div>
              <img
                src={professionalImg}
                alt="Professional Portfolio Preview"
                className="w-full h-auto rounded-2xl border border-slate-700 shadow-sm object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-6 space-y-8 text-left order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaUserTie size={12} />
              For Working Professionals
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for <span className="text-emerald-500">Professionals</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500 leading-relaxed">
              Showcase case studies, leadership highlights, and executive timelines. Stand out on LinkedIn with a professional custom portfolio link.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              {[
                { title: "Work Experience Timeline", desc: "Neat vertical timelines documenting previous roles and achievements." },
                { title: "Case Studies Focus", desc: "Explain execution metrics, team sizes, and engineering impact." },
                { title: "Client Testimonials", desc: "Integrate reviews and references from past managers." },
                { title: "Leadership Logs", desc: "Showcase mentoring achievements, speaking logs, and team sizes." }
              ].map((highlight, idx) => (
                <div key={idx} className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    <FaCheckCircle size={12} />
                  </div>
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
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
              >
                Build Professional Portfolio
                <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TEMPLATE GALLERY - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-slate-50/50 to-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaPalette size={12} />
              Template Gallery
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Explore Our <span className="text-emerald-500">Live Layouts</span>
            </h2>
            <p className="text-lg text-slate-500">
              Choose from our premium designs, optimized to display your career milestones with rich aesthetics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templatesShowcase.map((tpl, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 hover:border-emerald-500/30"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-50 border border-slate-150 rounded-2xl mb-5 overflow-hidden relative shadow-inner">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[10px] font-black uppercase rounded-lg backdrop-blur-sm border border-white/10 shadow-lg">
                        {tpl.badge}
                      </span>
                    </div>
                    <div className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br ${tpl.color} opacity-80 blur-sm`}></div>
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors group-hover:underline"
                  >
                    Select Design <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Enhanced */}
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaStar size={12} />
              Reviews
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Loved by Students and <span className="text-emerald-500">Professionals</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500">
              Read how freshers and senior developers leverage ByteBodh to build their credentials.
            </motion.p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex overflow-hidden group">
              <div className="flex gap-8 animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...testimonials, ...testimonials].map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[380px] shrink-0 bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 p-8 rounded-3xl relative flex flex-col justify-between hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div>
                      <div className="flex gap-1 text-emerald-500 mb-4">
                        {[...Array(t.rating)].map((_, i) => (
                          <FaStar key={i} size={14} className="fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{t.quote}"</p>
                    </div>
                    <div className="flex items-center mt-8 pt-4 border-t border-slate-200/40">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                        {t.avatar}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-slate-900 text-sm leading-none">{t.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">{t.role}</p>
                      </div>
                    </div>
                    <span className="absolute top-6 right-6 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[8px] font-extrabold uppercase rounded-lg border border-emerald-500/20">
                      {t.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP SECTION - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t border-b border-slate-900">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div
            className="lg:col-span-7 space-y-6 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaMobileAlt size={12} />
              On The Go
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              ByteBodh Mobile App <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Available Now</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
              Create, update, and monitor your personal portfolio directly from your mobile device. Edit projects, check analytics, and share your QR code link instantly from anywhere.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl text-left hover:bg-slate-800 hover:border-emerald-500/50 transition-all shadow-xl group cursor-pointer hover:-translate-y-1"
              >
                <FaGooglePlay className="text-white text-2xl group-hover:text-emerald-400 transition-colors" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Get it on</span>
                  <span className="text-sm font-bold text-white block">Google Play</span>
                </div>
              </a>

              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <span className="w-8 h-px bg-slate-700"></span>
                <span className="flex items-center gap-1">
                  <FaQrcode className="text-emerald-400" />
                  <span>QR Code Available</span>
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-6 pt-2">
              {[
                { icon: <FaChartLine />, label: "Analytics" },
                { icon: <FaShareAlt />, label: "Share" },
                { icon: <FaRegHeart />, label: "Favorites" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-400 text-xs">
                  <span className="text-emerald-400">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-[280px] aspect-[9/19] bg-slate-900 border-[6px] border-slate-800 rounded-[2.5rem] shadow-2xl p-3 flex flex-col justify-between overflow-hidden group hover:shadow-emerald-500/20 transition-shadow duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-24 bg-slate-800 rounded-b-2xl z-20"></div>

              <div className="flex-1 rounded-[1.8rem] bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/50 p-4 pt-8 flex flex-col justify-between relative overflow-hidden text-xs">
                <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black tracking-widest text-emerald-500 uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      ByteBodh App
                    </span>
                  </div>

                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center font-bold text-[10px] shadow-lg">BB</div>
                      <div>
                        <h4 className="font-bold text-white text-[10px]">Your Portfolio</h4>
                        <p className="text-[8px] text-emerald-400">bytebodh.in/username</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[8px] pt-1">
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-700/50">
                        <span className="text-slate-500 block">Total Views</span>
                        <span className="font-extrabold text-white text-[9px]">1,240</span>
                      </div>
                      <div className="bg-slate-900/80 p-1.5 rounded border border-slate-700/50">
                        <span className="text-slate-500 block">Templates</span>
                        <span className="font-extrabold text-emerald-400 text-[9px]">Hacker Terminal</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[9px]">
                    {[
                      "Live Site Analytics Tracker",
                      "Instant QR Code Generation",
                      "AI Bio Editor (Version 2.0)"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-[8px] border border-emerald-500/20">
                          <FaCheckCircle size={10} />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-center rounded-xl text-[9px] cursor-pointer transition-all mt-4 block shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                >
                  Download App 📱
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50/50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaRegHeart size={12} />
              FAQ
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked <span className="text-emerald-500">Questions</span>
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
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-emerald-50/50 transition-colors focus:outline-none group"
                >
                  <span className="font-bold text-slate-900 text-base md:text-lg pr-4 group-hover:text-emerald-600 transition-colors">{faq.q}</span>
                  {faqOpen === index ? (
                    <FaChevronUp className="text-emerald-500 flex-shrink-0 transition-transform" />
                  ) : (
                    <FaChevronDown className="text-slate-400 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${faqOpen === index ? "max-h-52 border-t border-slate-100" : "max-h-0"
                    }`}
                >
                  <p className="p-6 text-slate-500 text-sm md:text-base leading-relaxed bg-emerald-50/30">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION - Enhanced */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-500/30"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="absolute top-[-30%] left-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium">
                <FaRocket className="text-emerald-200" />
                <span>Join 10,000+ users today</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                Launch Your Portfolio Today
              </h2>
              <p className="text-lg text-emerald-50 max-w-xl mx-auto">
                Join thousands of students and professionals building their online presence with ByteBodh.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-slate-200/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  Create Portfolio Free
                  <FaArrowRight size={14} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#templates-section"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/10"
                >
                  View Templates
                </a>
              </div>
              <p className="text-xs text-emerald-200/80">
                No credit card required • Free forever • 2-minute setup
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
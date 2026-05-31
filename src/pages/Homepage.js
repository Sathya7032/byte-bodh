import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaMobileAlt,
  FaRocket,
  FaCode,
  FaFilePdf,
  FaChevronRight,
  FaGlobe,
  FaStar,
  FaChartLine,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaBolt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
    quote: "The SEO optimization works like magic. My portfolio ranked on page 1 of Google search within a week! Love the clean white SaaS aesthetic of the Executive templates.",
    rating: 5,
    tag: "Professional"
  }
];

const templateCatalog = [
  {
    id: "t1",
    name: "Academic Minimalist",
    category: "Students",
    thumbnail: "📄",
    tag: "ATS Friendly",
    desc: "Structured layouts putting research, GPA, and hackathons front and center."
  },
  {
    id: "t2",
    name: "Hacker Command Line",
    category: "Developers",
    thumbnail: "💻",
    tag: "Geek Favorite",
    desc: "A responsive monospace terminal dashboard. Swaps between folders instantly."
  },
  {
    id: "t3",
    name: "Creative Gallery",
    category: "Designers",
    thumbnail: "🎨",
    tag: "Visual Rich",
    desc: "Frosted-glass frames, grid galleries, and video embeds to highlight visual assets."
  },
  {
    id: "t4",
    name: "Executive Brand",
    category: "Working Professionals",
    thumbnail: "👔",
    tag: "Premium Clean",
    desc: "Split layouts with timeline, corporate metrics, and custom reference slots."
  },
  {
    id: "t5",
    name: "Product Spec Sheet",
    category: "Product Managers",
    thumbnail: "📈",
    tag: "Case Study Focus",
    desc: "Designed around structured case studies, execution stats, and roadmap logs."
  },
  {
    id: "t6",
    name: "Insight Model",
    category: "Data Scientists",
    thumbnail: "📊",
    tag: "Math & Code",
    desc: "Embed charts, technical repositories, and Kaggle scores in a clean layout."
  }
];

const liveExamples = [
  {
    name: "Rahul Sen",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    template: "Hacker Command Line",
    preview: {
      accent: "text-emerald-400",
      bg: "bg-black border-emerald-950",
      content: "$ npx profile --show\nRahul Sen (Full-Stack Engineer)\nSkills: Node, React, Docker\nProjects: CloudDeploy (1.2k Stars)"
    }
  },
  {
    name: "Aisha Patel",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    template: "Creative Gallery",
    preview: {
      accent: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100",
      content: "Aisha's Portfolio\nCreative Art Director\nProjects: FinPay UX, MediApp Design\nMockups: Figma, Adobe 3D"
    }
  },
  {
    name: "Vikram Malhotra",
    role: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    template: "Insight Model",
    preview: {
      accent: "text-blue-600",
      bg: "bg-slate-50 border-blue-100",
      content: "Model Insights\nKaggle Notebooks & Reports\nSkills: Pandas, Python, SQL\nData Viz: Streamlit Dashboards"
    }
  },
  {
    name: "Neha Rao",
    role: "MBA Student",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    template: "Academic Minimalist",
    preview: {
      accent: "text-slate-800",
      bg: "bg-white border-slate-200",
      content: "Neha Rao | MBA Candidate\nIIM Bangalore\nEx-Consultant @Deloitte\nPublications: Market Study 2025"
    }
  }
];

const Homepage = () => {
  const [selectedTemplateTab, setSelectedTemplateTab] = useState("Students");
  const [faqOpen, setFaqOpen] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [previewRole, setPreviewRole] = useState("Developer"); // Developer, Student, Designer

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const filteredTemplates = templateCatalog.filter(
    (t) => t.category === selectedTemplateTab || selectedTemplateTab === "Working Professionals"
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-[#6C63FF]/20 selection:text-[#6C63FF]">

      {/* 1. NAVIGATION BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-3 shadow-sm"
          : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#6C63FF]/25">
              BB
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                ByteBodh
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">
                AI Portfolio
              </p>
            </div>
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <a href="#templates-section" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#6C63FF] transition-colors">Templates</a>
            <a href="#students-section" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#6C63FF] transition-colors">Students</a>
            <a href="#professionals-section" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#6C63FF] transition-colors">Professionals</a>
            <a href="#features-section" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#6C63FF] transition-colors">Features</a>
            <a href="#pricing-section" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#6C63FF] transition-colors">Pricing</a>
            <a href="#testimonials-section" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#6C63FF] transition-colors">Testimonials</a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#6C63FF] transition-all">
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-sm font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg hover:shadow-[#6C63FF]/30 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-gradient-to-tr from-indigo-50/20 via-white to-purple-50/30">
        {/* Soft glowing ambient circles */}
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-[#6C63FF]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center relative z-10">

          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
              <span className="text-amber-500">⭐</span>
              <span>Trusted by 25,000+ users</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black leading-[1.1] text-slate-900 tracking-tight">
              Your Portfolio.<br />
              Your Story.<br />
              Built by{" "}
              <span className="bg-gradient-to-r from-[#6C63FF] to-blue-500 bg-clip-text text-transparent">
                ByteBodh
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Create a professional portfolio website in minutes. Just enter your details, choose a template, and publish instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-4 bg-[#6C63FF] hover:bg-[#5b52e6] text-white font-bold rounded-2xl shadow-xl shadow-[#6C63FF]/20 hover:shadow-2xl hover:shadow-[#6C63FF]/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Create My Portfolio
                <FaArrowRight size={14} />
              </Link>
              <a
                href="#templates-section"
                className="w-full sm:w-auto text-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Explore Templates
              </a>
            </div>
          </div>

          {/* Hero Right Visuals: Interactive 3D Floating Mockups */}
          <div className="lg:col-span-6 relative">
            {/* Selector tabs for hero visual */}
            <div className="flex justify-center gap-2 mb-6 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 shadow-sm max-w-xs mx-auto">
              {["Developer", "Student", "Designer"].map((role) => (
                <button
                  key={role}
                  onClick={() => setPreviewRole(role)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${previewRole === role
                    ? "bg-[#6C63FF] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Container for mockups */}
            <div className="relative aspect-[4/3] w-full max-w-[500px] mx-auto bg-white/40 backdrop-blur-md border border-slate-200/50 rounded-3xl p-4 shadow-xl flex items-center justify-center">

              <AnimatePresence mode="wait">
                {previewRole === "Developer" && (
                  <motion.div
                    key="dev"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full bg-slate-950 text-emerald-400 font-mono p-5 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs">
                      <span>$ npm run dev</span>
                      <span className="text-slate-500">bytebodh.in/rohan</span>
                    </div>
                    <div className="space-y-4 text-xs md:text-sm text-left">
                      <p><span className="text-slate-500">{"// Profile Card"}</span></p>
                      <h3 className="text-white text-base font-bold">Rohan Deshmukh | Software Engineer</h3>
                      <p className="text-emerald-500/80">Ex-Intern @Microsoft | 3rd Year B.Tech CSE</p>
                      <p className="text-slate-400 leading-relaxed text-xs">Built microservices with Spring Boot, optimized REST APIs, and managed Docker clusters.</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {["Java", "Spring Boot", "Docker", "Kubernetes"].map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-900 text-emerald-400 text-[10px] rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {previewRole === "Student" && (
                  <motion.div
                    key="stud"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full bg-white text-slate-800 font-sans p-6 rounded-2xl border border-slate-200 shadow-2xl relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 leading-none">Anya Sharma</h3>
                        <p className="text-[10px] font-bold text-[#6C63FF] tracking-wider uppercase mt-1">Computer Science Student</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">IIT Bombay (CGPA: 9.4/10.0)</p>
                      </div>
                      <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-[9px] font-extrabold rounded-full"> Seeking Internships </span>
                    </div>

                    <div className="space-y-3 text-left">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Academics & Highlights</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                          <span className="text-lg block">🎖️</span>
                          <span className="font-bold text-slate-900 block mt-1">Smart India Hackathon</span>
                          <span className="text-[9px] text-slate-400">1st Place Winner</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                          <span className="text-lg block">📜</span>
                          <span className="font-bold text-slate-900 block mt-1">AWS Cloud Practitioner</span>
                          <span className="text-[9px] text-slate-400">Certified 2025</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                      <span>bytebodh.in/anya</span>
                      <span className="text-[#6C63FF]">View Credentials ↗</span>
                    </div>
                  </motion.div>
                )}

                {previewRole === "Designer" && (
                  <motion.div
                    key="des"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full bg-[#0a0a0c] text-white font-sans p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between"
                  >
                    {/* Glowing design ambient */}
                    <div className="absolute top-[-10%] right-[-10%] w-[100px] h-[100px] rounded-full bg-[#6C63FF]/30 blur-[40px]"></div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">Karan Shah</h3>
                        <p className="text-xs text-[#6C63FF] font-semibold mt-0.5">Interaction & UI/UX Designer</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold">KS</div>
                    </div>

                    <div className="space-y-2 text-left">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Featured Prototype</h4>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">FinPay App UX Case Study</span>
                          <span className="text-[9px] text-slate-400">Design System & Wireframes</span>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs">🚀</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                      <span>bytebodh.in/karan</span>
                      <span className="text-[#6C63FF]">Explore Dribbble ↗</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Portfolio Website in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-500">
              Transform your accomplishments into a stunning website without writing a single line of code.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Timeline connectors */}
            <div className="hidden md:block absolute top-[28%] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#6C63FF]/30 to-[#6C63FF]/10 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 bg-slate-50/70 border border-slate-200/50 p-8 rounded-3xl text-center space-y-6 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-2xl font-black text-[#6C63FF] mx-auto group-hover:bg-[#6C63FF] group-hover:text-white transition-colors duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Choose a Template</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Browse curated, career-specific templates optimized for students, designers, product managers, and developers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 bg-slate-50/70 border border-slate-200/50 p-8 rounded-3xl text-center space-y-6 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-2xl font-black text-[#6C63FF] mx-auto group-hover:bg-[#6C63FF] group-hover:text-white transition-colors duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Add Your Details</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Fill in your profile, projects, work experiences, certifications, education, and social links in a simple dashboard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 bg-slate-50/70 border border-slate-200/50 p-8 rounded-3xl text-center space-y-6 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-2xl font-black text-[#6C63FF] mx-auto group-hover:bg-[#6C63FF] group-hover:text-white transition-colors duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Publish Instantly</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Deploy your live portfolio URL (e.g. `bytebodh.in/yourname`) in seconds. Instantly ready to share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATE SHOWCASE SECTION */}
      <section id="templates-section" className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              Templates Catalog
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Templates Designed for Every Career
            </h2>
            <p className="text-lg text-slate-500">
              Hand-crafted layout formats tailored to represent your specific profession with clean styles.
            </p>
          </div>

          {/* Career Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            {["Students", "Developers", "Designers", "Product Managers", "Data Scientists", "Working Professionals"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTemplateTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${selectedTemplateTab === tab
                  ? "bg-[#6C63FF] text-white shadow-sm shadow-[#6C63FF]/20"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Template Visual frame representation */}
                  <div className="aspect-[4/3] bg-slate-50 border border-slate-100 rounded-2xl mb-6 flex items-center justify-center text-4xl shadow-inner relative overflow-hidden group-hover:border-[#6C63FF]/30 transition-all duration-300">
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-125">{template.thumbnail}</span>

                    {/* Floating template details grid simulated */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="px-4 py-2 bg-[#6C63FF] text-white text-xs font-extrabold rounded-xl shadow-lg">Preview Structure</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-slate-950">{template.name}</h3>
                    <span className="px-2 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] text-[9px] font-extrabold uppercase rounded">
                      {template.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{template.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to="/register"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#6C63FF]/10 hover:bg-[#6C63FF] text-[#6C63FF] hover:text-white rounded-xl text-xs font-extrabold transition-all duration-300"
                  >
                    Use Template
                    <FaChevronRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section id="features-section" className="py-24 bg-white border-t border-slate-100 relative">
        {/* Soft glowing ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Everything You Need to Stand Out
            </h2>
            <p className="text-lg text-slate-500">
              ByteBodh packs all the modern features required to launch your brand and make recruiter connections.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI Portfolio Generator",
                desc: "Generate professional bios, summaries, project details, and optimized profile headers instantly with built-in AI assistant prompts.",
                icon: <FaBolt className="text-[#6C63FF] text-lg" />
              },
              {
                title: "Responsive Design",
                desc: "Your portfolio automatically adjusts to render perfectly across smartphones, tablets, tablets, and desktop resolutions.",
                icon: <FaMobileAlt className="text-blue-500 text-lg" />
              },
              {
                title: "Custom Domain Support",
                desc: "Publish under a free URL (e.g. `bytebodh.in/yourname`) or map your custom domain in the dashboard easily.",
                icon: <FaGlobe className="text-emerald-500 text-lg" />
              },
              {
                title: "SEO Optimized",
                desc: "Superfast static site speeds and semantic layout structures ensure search engines index your brand.",
                icon: <FaSearch className="text-amber-500 text-lg" />
              },
              {
                title: "Resume Integration",
                desc: "Compile your web portfolio details back into perfectly structured offline PDF resumes in a single click.",
                icon: <FaFilePdf className="text-rose-500 text-lg" />
              },
              {
                title: "Project Showcase",
                desc: "Add rich description sheets, tech stack tags, repository links, mock gallery files, and YouTube embeds.",
                icon: <FaCode className="text-indigo-500 text-lg" />
              },
              {
                title: "Analytics Dashboard",
                desc: "Track real-time visitor demographics, country, referral site visits, and visitor metrics from your companion dashboard.",
                icon: <FaChartLine className="text-cyan-500 text-lg" />
              },
              {
                title: "One-Click Publishing",
                desc: "Forget manual server files, hosting config, or deployment hooks. Enter details, select design, and go live instantly.",
                icon: <FaRocket className="text-purple-500 text-lg" />
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/70 border border-slate-200/50 backdrop-blur-md p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOR STUDENTS SECTION */}
      <section id="students-section" className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">

          {/* Student Highlights (Left side) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              For Students & Freshers
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for Students
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Struggling to stand out in university campus placement drives? ByteBodh helps fresh graduates compile their academic credentials into a hiring-ready online portfolio.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                Create Student Portfolio
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Student Portfolio Mockup Preview (Right side) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 left-6 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                Student Profile Preview (Live URL)
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4 mt-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Arjun Sharma</h3>
                  <p className="text-xs text-[#6C63FF] font-bold">B.Tech Student @IIT Delhi</p>
                </div>
                <div className="px-2 py-1 rounded bg-[#6C63FF]/10 text-[#6C63FF] text-[9px] font-bold">CGPA: 9.2</div>
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
          </div>
        </div>
      </section>

      {/* 7. FOR PROFESSIONALS SECTION */}
      <section id="professionals-section" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">

          {/* Professional Portfolio Mockup Preview (Left side) */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1 w-full">
            <div className="w-full max-w-[480px] bg-slate-950 text-slate-200 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 left-6 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Professional Profile Preview (Dark Theme)
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4 mt-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Devika Sen</h3>
                  <p className="text-xs text-[#6C63FF] font-semibold">Lead Backend Engineer</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">DS</div>
              </div>

              <div className="space-y-4 text-left text-xs text-slate-400">
                <p className="leading-relaxed text-xs">"Architecting distributed database systems, scale testing APIs, and optimizing cloud container instances at ScaleCorp."</p>

                <div className="space-y-3">
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Work History</h4>
                  <div className="relative pl-4 border-l border-[#6C63FF]/30 space-y-3 py-1">
                    <div>
                      <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#6C63FF] border-2 border-slate-950"></span>
                      <div className="flex justify-between text-xs text-white font-bold">
                        <span>Lead Backend Developer</span>
                        <span className="text-[10px] text-slate-500">2023 - Present</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">ScaleCorp Inc.</p>
                    </div>
                    <div>
                      <span className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-950"></span>
                      <div className="flex justify-between text-xs text-white font-bold">
                        <span>Software Engineer</span>
                        <span className="text-[10px] text-slate-500">2021 - 2023</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">TechDev Solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Highlights (Right side) */}
          <div className="lg:col-span-6 space-y-8 text-left order-1 lg:order-2">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              For Working Professionals
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Built for Professionals
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Showcase case studies, leadership highlights, and executive timelines. Stand out on LinkedIn with a professional custom portfolio link.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Work Experience Timeline", desc: "Neat vertical timelines documenting previous roles and achievements." },
                { title: "Case Studies Focus", desc: "Explain execution metrics, team sizes, and engineering impact." },
                { title: "Client Testimonials", desc: "Integrate reviews and references from past managers." },
                { title: "Leadership logs", desc: "Showcase mentoring achievements, speaking logs, and team sizes." }
              ].map((highlight, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center text-xs mt-1 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{highlight.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{highlight.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                Build Professional Portfolio
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LIVE EXAMPLE SHOWCASE */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-wider">
              Live Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              See What Users Built
            </h2>
            <p className="text-lg text-slate-500">
              Real online portfolios created by developers, students, and professionals on our platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {liveExamples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Simulated card preview sheet */}
                  <div className={`aspect-[4/3] rounded-2xl mb-4 p-4 border text-[9px] text-left overflow-hidden relative ${ex.preview.bg}`}>
                    <pre className="font-mono text-[8px] leading-relaxed whitespace-pre-wrap">{ex.preview.content}</pre>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={ex.avatar}
                      alt={ex.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-none">{ex.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">{ex.role}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400">Template: {ex.template}</span>
                  <span className="text-[#6C63FF] hover:underline cursor-pointer">Live Preview</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section id="testimonials-section" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              Reviews
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Loved by Students and Professionals
            </h2>
            <p className="text-lg text-slate-500">
              Read how freshers and senior developers leverage ByteBodh to build their credentials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/50 p-8 rounded-3xl relative flex flex-col justify-between hover:shadow-xl transition-all duration-300"
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

                <span className="absolute top-6 right-8 px-2 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] text-[8px] font-extrabold uppercase rounded">
                  {t.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. STATISTICS SECTION */}
      <section className="py-16 bg-[#6C63FF]/10 border-t border-b border-[#6C63FF]/20 relative overflow-hidden">
        {/* Ambient aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-white/20 rounded-full blur-[80px]"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          <div>
            <p className="text-4xl md:text-5xl font-black text-[#6C63FF]">25,000+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Portfolios Created</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-[#6C63FF]">1 Million+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Portfolio Views</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-[#6C63FF]">95%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Placement Success</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-[#6C63FF]">120+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Template Layouts</p>
          </div>
        </div>
      </section>

      {/* 11. PRICING SECTION */}
      <section id="pricing-section" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              Pricing Options
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Simple Pricing for Everyone
            </h2>
            <p className="text-lg text-slate-500">
              No hidden fees. Select the plan that matches your current career stage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-50/70 border border-slate-200/50 p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Free Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">Perfect to get started</p>
                </div>
                <div className="flex items-baseline text-slate-900">
                  <span className="text-4xl font-black">₹0</span>
                  <span className="text-sm text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-500 font-semibold pt-4 border-t border-slate-200/60">
                  <li className="flex items-center gap-2 text-slate-900 font-bold"><FaCheckCircle className="text-[#6C63FF]" /> 1 Template Choice</li>
                  <li className="flex items-center gap-2">✓ Basic Details Editor</li>
                  <li className="flex items-center gap-2">✓ Free Portfolio Hosting</li>
                  <li className="flex items-center gap-2">✓ ByteBodh Footer Branding</li>
                  <li className="flex items-center gap-2 text-slate-300">✗ Custom Domain Mapping</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full mt-8 py-3 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-2 border-[#6C63FF] p-8 rounded-3xl flex flex-col justify-between shadow-xl relative transform hover:scale-[1.02] transition-all duration-300">
              <span className="absolute top-4 right-6 px-3 py-1 bg-[#6C63FF] text-white text-[9px] font-extrabold uppercase rounded-full tracking-wider">
                Popular
              </span>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Pro Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">For active job seekers</p>
                </div>
                <div className="flex items-baseline text-slate-900">
                  <span className="text-4xl font-black">₹299</span>
                  <span className="text-sm text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-500 font-semibold pt-4 border-t border-slate-200/60">
                  <li className="flex items-center gap-2 text-slate-950 font-bold"><FaCheckCircle className="text-[#6C63FF]" /> 3 Premium Templates</li>
                  <li className="flex items-center gap-2 text-slate-950"><FaCheckCircle className="text-[#6C63FF]" /> Swap designs anytime</li>
                  <li className="flex items-center gap-2 text-slate-950"><FaCheckCircle className="text-[#6C63FF]" /> Custom Domain mapping</li>
                  <li className="flex items-center gap-2 text-slate-950"><FaCheckCircle className="text-[#6C63FF]" /> Visitor Analytics</li>
                  <li className="flex items-center gap-2 text-slate-950"><FaCheckCircle className="text-[#6C63FF]" /> AI Bio Enhancement</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full mt-8 py-3.5 text-center bg-[#6C63FF] hover:bg-[#5b52e6] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#6C63FF]/20 transition-all"
              >
                Go Pro
              </Link>
            </div>

            {/* Lifetime Plan */}
            <div className="bg-slate-50/70 border border-slate-200/50 p-8 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Lifetime Plan</h3>
                  <p className="text-xs text-slate-400 mt-1">One-time payment</p>
                </div>
                <div className="flex items-baseline text-slate-900">
                  <span className="text-4xl font-black">₹1,999</span>
                  <span className="text-sm text-slate-500 ml-1">once</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-500 font-semibold pt-4 border-t border-slate-200/60">
                  <li className="flex items-center gap-2 text-slate-900 font-bold"><FaCheckCircle className="text-[#6C63FF]" /> All 120+ Templates</li>
                  <li className="flex items-center gap-2">✓ Unlimited swaps forever</li>
                  <li className="flex items-center gap-2">✓ All future releases</li>
                  <li className="flex items-center gap-2">✓ Multiple portfolios</li>
                  <li className="flex items-center gap-2">✓ Priority VIP support</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full mt-8 py-3 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Get Lifetime Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ SECTION */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="px-4 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-500">
              Answers regarding domains, coding capabilities, and editing.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is coding required?",
                a: "No coding is required whatsoever. ByteBodh's profile builder offers intuitive forms where you input your education, certifications, and project links. We construct the pages and handle database configurations automatically."
              },
              {
                q: "Can I use my own domain?",
                a: "Absolutely! Pro and Lifetime plan holders can map their custom domains (e.g. `yourname.com`) directly in the profile settings panel, with SSL certificates provided free."
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
                    <FaChevronUp className="text-[#6C63FF] flex-shrink-0" />
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
          <div className="bg-gradient-to-tr from-[#6C63FF] via-[#5c52e6] to-[#6C63FF] rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-[#6C63FF]/20">
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
                  className="w-full sm:w-auto text-center px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
                >
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
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12 border-b border-slate-900 pb-12">
          {/* Brand info */}
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                BB
              </div>
              <span className="text-xl font-black text-white">ByteBodh</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              ByteBodh is an AI-powered portfolio website builder designed to help fresh graduates and software engineers deploy hiring-ready personal websites.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub", "Facebook"].map((soc) => (
                <span key={soc} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-white hover:border-[#6C63FF] cursor-pointer transition-all">
                  {soc[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Links cols */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4">Product</h5>
            <ul className="space-y-3 text-xs">
              <li><a href="#templates-section" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#features-section" className="hover:text-white transition-colors">AI Writer</a></li>
              <li><a href="#pricing-section" className="hover:text-white transition-colors">Pricing Options</a></li>
              <li><a href="#pricing-section" className="hover:text-white transition-colors">Lifetime Deal</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4">Company</h5>
            <ul className="space-y-3 text-xs">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="/blogs" className="hover:text-white transition-colors">Blogs</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h5 className="font-extrabold text-white text-xs uppercase tracking-widest mb-4">Resources</h5>
            <ul className="space-y-3 text-xs">
              <li><a href="#faq" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="hover:text-white transition-colors">Cookie settings</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} ByteBodh. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">System Online</span>
            <span className="hover:text-white cursor-pointer transition-colors">V2026.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
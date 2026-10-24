import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaRocket,
  FaPlay,
  FaStar,
  FaChevronDown,
  FaChevronUp,
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
  FaQuoteLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaRegHeart,
  FaQrcode,
  FaTimes,
  FaCrown,
  FaInstagram,
  FaComments,
  FaBolt,
  FaPaperPlane
} from "react-icons/fa";
import { getAllTemplates } from "../api/templateService";
import { getSubscriptionConfig } from "../api/subscriptionService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
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
import metaImg from "../assets/images/meta.png";
import mobileAppImg from "../assets/images/mobileapp.png";
import QRCode from "react-qr-code";
import { TemplateCardThumbnail } from "../bytebodh-folio/TemplateRenderer";

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
    role: "CSE Final Year",
    organization: "BITS Pilani Hyderabad",
    category: "STUDENT",
    quote: "ByteBodh was an absolute lifesaver during placement drives. I filled in my projects, picked the Minimalist layout, and interviewers were genuinely impressed that I had a real live URL instead of a static PDF.",
    rating: 5,
    tag: "Student",
    result: "Placed at Tier-1 Tech Firm",
    avatar: "SK",
    avatarBg: "from-emerald-500 to-teal-600"
  },
  {
    name: "Anirudh Rao",
    role: "Software Engineer",
    organization: "Google Hyderabad",
    category: "PROFESSIONAL",
    quote: "I wanted a sleek developer portfolio without spending weekends writing custom CSS from scratch. The 'Hacker Terminal' layout is incredible. Instant mobile updates, plus real-time visitor tracking.",
    rating: 5,
    tag: "Professional",
    result: "Active Tech Blog & Projects",
    avatar: "AR",
    avatarBg: "from-blue-600 to-cyan-500"
  },
  {
    name: "Pooja Sharma",
    role: "UI/UX & Product Designer",
    organization: "Razorpay",
    category: "PROFESSIONAL",
    quote: "The visual gallery and bento layouts easily rival portfolios crafted on Framer or Webflow. Having an instant QR code card made in-person networking at tech conferences effortless.",
    rating: 5,
    tag: "Professional",
    result: "3 Recruiter Offers Received",
    avatar: "PS",
    avatarBg: "from-purple-500 to-pink-500"
  },
  {
    name: "Harini Reddy",
    role: "Lead Product Manager",
    organization: "FinTech Scaleup",
    category: "PROFESSIONAL",
    quote: "Truly a 2-minute executive portfolio maker. It highlighted my product roadmaps, metrics, and KPI outcomes with remarkable clarity. I had a polished custom domain live in minutes.",
    rating: 5,
    tag: "Professional",
    result: "Promoted to Principal Lead",
    avatar: "HR",
    avatarBg: "from-amber-500 to-orange-500"
  },
  {
    name: "Karthik Varma",
    role: "Full-Stack SDE",
    organization: "Tech Mahindra",
    category: "STUDENT",
    quote: "The integrated compiler and code tabs on the Developer IDE template blew interviewers away. They could inspect my GitHub links, live projects, and certifications in one unified interface.",
    rating: 5,
    tag: "Student",
    result: "Shortlisted for 4 SDE Roles",
    avatar: "KV",
    avatarBg: "from-indigo-500 to-blue-600"
  },
  {
    name: "Sneha Patel",
    role: "Computer Engineering Graduate",
    organization: "VIT University",
    category: "STUDENT",
    quote: "I downloaded the ATS-friendly resume alongside my live portfolio link. Being able to edit projects from my phone while traveling for campus rounds kept all my credentials synchronized.",
    rating: 5,
    tag: "Student",
    result: "Off-Campus SDE Offer Cleared",
    avatar: "SP",
    avatarBg: "from-rose-500 to-pink-500"
  }
];

const featuredPaidTemplates = [
  {
    id: 7,
    name: "Cyber HUD Matrix",
    category: "Tech & Cyber Freshers",
    tagCategory: "3D & Interactive",
    desc: "Futuristic Cyber HUD Console with matrix grid background, glowing status ring, & Anime.js v4 animations.",
    badge: "Cyber HUD • 4-Color",
    tags: ["Cyberpunk HUD", "Matrix Grid", "Glowing Badges", "Anime.js v4"]
  },
  {
    id: 8,
    name: "Vintage Gazette",
    category: "Academic Chronicle",
    tagCategory: "Minimal & Academic",
    desc: "Classic Newspaper Frontpage layout with 3-column editorial grid, serif drop caps, & double border rules.",
    badge: "Gazette Chronicle",
    tags: ["Newspaper Grid", "Vintage Typography", "Editorial Cards", "Drop Caps"]
  },
  {
    id: 9,
    name: "Neo-Brutalist Tech",
    category: "High-Contrast Student",
    tagCategory: "Creative & Vector",
    desc: "Bold Neo-Brutalist Black, White & Yellow showcase with Anime.js continuous live ticker & heavy drop shadows.",
    badge: "Neo-Brutalist • Anime.js",
    tags: ["Neo-Brutalist", "High Contrast", "Continuous Ticker", "Heavy Shadows"]
  }
];

const templatesShowcase = [
  {
    id: 1,
    name: "Academic Minimalist",
    image: freeTemplate,
    category: "Students & Freshers",
    desc: "A clean, ATS-friendly minimalist layout emphasizing education, publications, and technical skills.",
    accent: "border-slate-200",
    badge: "Free",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    name: "Hacker Terminal",
    image: template2,
    category: "Developers & Sysadmins",
    desc: "A responsive monospace command-line interface. Highly interactive folder navigation styling.",
    accent: "border-emerald-500/20",
    badge: "Developer Fav",
    color: "from-emerald-500 to-teal-400"
  },
  {
    id: 3,
    name: "Creative Gallery",
    image: template3,
    category: "Designers & Artists",
    desc: "A visual grid layout with frosted glass controls, portfolio images, and embedded media assets.",
    accent: "border-emerald-500/20",
    badge: "Visual Rich",
    color: "from-purple-500 to-pink-400"
  },
  {
    id: 4,
    name: "Executive Brand",
    image: template4,
    category: "Product Managers & Leads",
    desc: "A premium corporate layout with timeline progress tracking, corporate KPIs, and details.",
    accent: "border-[#10B981]/20",
    badge: "Premium Clean",
    color: "from-indigo-500 to-violet-400"
  },
  {
    id: 5,
    name: "Developer IDE Studio",
    image: template5,
    category: "Software Engineers",
    desc: "A fully immersive VS Code styled portfolio layout featuring tabs, explorer, and a live compiler mode.",
    accent: "border-emerald-500/20",
    badge: "IDE Theme",
    color: "from-blue-600 to-cyan-500"
  },
  {
    id: 6,
    name: "Nature Aurora",
    image: null,
    category: "Creative Freshers",
    desc: "Fresh, organic emerald green design with floating leaf particles and smooth scroll transitions.",
    accent: "border-emerald-500/20",
    badge: "Nature Green",
    color: "from-emerald-600 to-green-400",
    bgStyle: "bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-emerald-100 border-emerald-500/30"
  },
  {
    id: 7,
    name: "Cyber HUD Matrix",
    image: null,
    category: "Tech & Cyber Freshers",
    desc: "Futuristic Cyber HUD Console with matrix grid background, glowing yellow status ring, & Anime.js v4 animations.",
    accent: "border-amber-500/40",
    badge: "Cyber HUD • 4-Color",
    color: "from-slate-900 via-amber-900 to-amber-500",
    bgStyle: "bg-slate-950 text-slate-100 border-amber-500/50"
  },
  {
    id: 8,
    name: "Vintage Gazette",
    image: null,
    category: "Academic Chronicle",
    desc: "Classic Newspaper Frontpage layout with 3-column editorial grid, serif drop caps, & double border rules.",
    accent: "border-amber-800/40",
    badge: "Gazette • 4-Color",
    color: "from-amber-900 via-amber-800 to-yellow-500",
    bgStyle: "bg-stone-100 text-slate-900 border-amber-800/40"
  },
  {
    id: 9,
    name: "Neo-Brutalist Tech",
    image: null,
    category: "High-Contrast Student",
    desc: "Bold Neo-Brutalist Black, White & Yellow showcase with Anime.js continuous live ticker & heavy shadows.",
    accent: "border-black",
    badge: "Anime.js • 4-Color",
    color: "from-yellow-400 via-amber-500 to-black",
    bgStyle: "bg-white text-black border-4 border-black"
  },
  {
    id: 10,
    name: "Dual-Column Slate & Cocoa",
    image: null,
    category: "Modern Student",
    desc: "Dual-column Dark Slate & Cocoa layout featuring Anime.js animated skill progress bars.",
    accent: "border-amber-700/40",
    badge: "Anime.js • 4-Color",
    color: "from-slate-800 via-amber-900 to-yellow-500",
    bgStyle: "bg-slate-800 text-slate-100 border-amber-600/50"
  },
  {
    id: 11,
    name: "Interactive Desktop OS",
    image: null,
    category: "OS Workspace Desktop",
    desc: "Interactive Mac/NeXT-inspired OS Desktop interface (BYTEBODH OS v11.0) with dock app switcher & window pop-ins.",
    accent: "border-blue-500/40",
    badge: "Desktop OS • App Dock",
    color: "from-blue-900 via-slate-900 to-amber-500",
    bgStyle: "bg-slate-900 text-slate-100 border-blue-500/50"
  },
  {
    id: 12,
    name: "Career Roadmap Journey",
    image: null,
    category: "Milestone Metro Roadmap",
    desc: "Interactive visual subway station career timeline with glowing station nodes & Anime.js v4 path animations.",
    accent: "border-amber-500/40",
    badge: "Station Roadmap • Metro",
    color: "from-amber-900 via-amber-600 to-yellow-400",
    bgStyle: "bg-slate-900 text-amber-300 border-amber-500/50"
  },
  {
    id: 13,
    name: "Railway Express Journey",
    image: null,
    category: "Train Express Aviation",
    desc: "Interactive bullet train animation moving across top railway tracks with Anime.js v4 & full student portfolio sections.",
    accent: "border-emerald-500/40",
    badge: "Train Express • Anime.js",
    color: "from-emerald-900 via-slate-900 to-amber-400",
    bgStyle: "bg-slate-900 text-emerald-400 border-emerald-500/50"
  },
  {
    id: 14,
    name: "Aviation Sky Flight",
    image: null,
    category: "Sky Flight Aviation",
    desc: "Interactive airplane sky flight animation flying across sky banner with Anime.js v4 & full student portfolio sections.",
    accent: "border-sky-500/40",
    badge: "Airplane Flight • Anime.js",
    color: "from-sky-900 via-slate-900 to-yellow-400",
    bgStyle: "bg-slate-900 text-sky-400 border-sky-500/50"
  },
  {
    id: 15,
    name: "Playing Cards Poker Deck",
    image: null,
    category: "Casino Poker Royal",
    desc: "Interactive Poker & Casino Deck theme with gold foil borders, suit badges (♠ ♥ ♦ ♣), Ace of Spades profile, & card hands.",
    accent: "border-amber-500/40",
    badge: "Poker Deck • ♠♥♦♣",
    color: "from-emerald-900 via-stone-900 to-amber-400",
    bgStyle: "bg-emerald-950 text-amber-300 border-amber-500/50"
  },
  {
    id: 16,
    name: "Monochrome Vector Noir",
    image: null,
    category: "B&W Vector Line Art",
    desc: "High-contrast Black & White vector illustration theme featuring noir SVG graphics, stark line art, and developer cards.",
    accent: "border-zinc-500/40",
    badge: "B&W Vector Art • Noir",
    color: "from-zinc-900 via-zinc-800 to-white",
    bgStyle: "bg-zinc-950 text-zinc-100 border-zinc-500/50"
  },
  {
    id: 17,
    name: "Vibrant Color Vector Art",
    image: null,
    category: "Modern Color Vector",
    desc: "Lively full-color vector illustration theme with vivid gradients, 2D/3D tech graphics, and colorful project banners.",
    accent: "border-purple-500/40",
    badge: "Color Vector • Vibrant",
    color: "from-purple-900 via-slate-900 to-sky-400",
    bgStyle: "bg-slate-950 text-purple-300 border-purple-500/50"
  }
];

const Homepage = () => {
  useSEO({
    title: "ByteBodh | AI Portfolio Builder & Career Hub for Developers & Students",
    description: "Create a professional online portfolio website in 2 minutes. Choose from premium CLI terminal, IDE, and academic templates. Compile CVs to PDF and track views.",
    keywords: "portfolio builder, resume maker, online portfolio maker, developer portfolio templates, terminal portfolio builder, academic cv template, ATS-friendly resume builder, bytebodh, linktree builder, instagram automation, dynamic portfolio, portfolio builder for developers, free resume maker, best developer portfolio examples, VS Code portfolio template, interactive resume, fresher resume builder, career portfolio maker, software engineer portfolio, build online portfolio free, CV maker online, student resume template, professional portfolio website builder, qr code generator tracking"
  });

  const [faqOpen, setFaqOpen] = useState(null);

  // ThemeWagon Showcase States
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [backendTemplates, setBackendTemplates] = useState([]);
  const [reviewFilter, setReviewFilter] = useState("ALL");

  // Pricing plan states
  const [planBillingCycle, setPlanBillingCycle] = useState("MONTHLY");
  const [subscriptionConfig, setSubscriptionConfig] = useState({ monthlyCost: 29, yearlyCost: 299 });

  useEffect(() => {
    getSubscriptionConfig()
      .then((res) => {
        const cfg = res.data?.data || res.data;
        if (cfg) {
          setSubscriptionConfig({
            monthlyCost: cfg.monthlyCost ?? 29,
            yearlyCost: cfg.yearlyCost ?? 299,
          });
        }
      })
      .catch(() => {
        // Visitor isn't authenticated / config endpoint unreachable — keep default ₹29 / ₹299 pricing.
      });
  }, []);

  useEffect(() => {
    getAllTemplates()
      .then((res) => {
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setBackendTemplates(data);
        }
      })
      .catch(() => { });
  }, []);

  const displayTemplates = useMemo(() => {
    return featuredPaidTemplates.map((paid) => {
      const match = backendTemplates.find((bt) => bt.id === paid.id) || templatesShowcase.find((st) => st.id === paid.id);
      return match ? { ...paid, ...match } : paid;
    });
  }, [backendTemplates]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === "ALL") return testimonials;
    return testimonials.filter((t) => t.category === reviewFilter);
  }, [reviewFilter]);


  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">

      <Header />

      {/* HERO SECTION - All Features Covered (Text-Driven Professional Layout) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white">
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] bg-emerald-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Main Hero Header */}
          <motion.div
            className="text-center max-w-4xl mx-auto space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Trust Pill Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/80 shadow-sm text-xs font-bold text-slate-700 hover:shadow-md transition-shadow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>The Complete Developer &amp; Student Career Platform</span>
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Free Tier</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Your Portfolio. Your Story. <br />
              Built &amp; Hosted with{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent relative inline-block">
                ByteBodh
                <svg className="absolute -bottom-2 left-0 w-full h-2.5" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q25 10 50 5 Q75 0 100 5" stroke="#10B981" strokeWidth="2.5" fill="none" opacity="0.4" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Everything developers, students, and professionals need to showcase their career. Build a personalized portfolio website, automate Instagram DMs, export ATS resumes, and share custom QR codes — in under 2 minutes with zero coding.
            </motion.p>

            {/* Primary CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                <FaRocket size={15} />
                Create My Portfolio Free
                <FaArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#templates-section"
                className="w-full sm:w-auto text-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-emerald-500 rounded-2xl font-bold transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm"
              >
                <FaPalette className="text-emerald-500" />
                Explore 50+ Templates
              </a>
            </motion.div>

            {/* Value Trust Chips */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <FaCheckCircle className="text-emerald-500 text-sm" />
                <span>100% Free Forever Tier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaCheckCircle className="text-emerald-500 text-sm" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaCheckCircle className="text-emerald-500 text-sm" />
                <span>Live in Under 2 Minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaStar className="text-amber-400 text-sm" />
                <span>4.9/5 Rating (100+ Downloads)</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ALL FEATURES COVERED - 3 Core Platform Capabilities */}
          <motion.div
            className="mt-16 pt-10 border-t border-slate-200/60"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full">
                Platform Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Everything You Need in One Unified Platform
              </h2>
              <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
                Three powerful career growth engines designed to build your brand, share your work, and convert traffic automatically.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Portfolio Website",
                  subtitle: "Personal Brand & Work Showcase",
                  badge: "Live Subdomain",
                  badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
                  desc: "Build a stunning, career-specific personal portfolio in under 2 minutes. Pick from 50+ templates with your own live subdomain (yourname.bytebodh.in), free SSL, and global edge hosting.",
                  icon: <FaDesktop className="text-emerald-500 text-xl" />,
                  iconBg: "bg-emerald-50 border-emerald-200",
                  tags: ["50+ Templates", "yourname.bytebodh.in", "Global Edge CDN", "Zero Code"]
                },
                {
                  title: "Linktree Bio Profile",
                  subtitle: "Unified Social & Project Hub",
                  badge: "Link-in-Bio",
                  badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
                  desc: "Consolidate your entire digital presence into one clean, high-speed bio link (bytebodh.in/username). Connect your GitHub, LinkedIn, LeetCode, YouTube, and work samples for mobile audiences.",
                  icon: <FaMobileAlt className="text-indigo-500 text-xl" />,
                  iconBg: "bg-indigo-50 border-indigo-200",
                  tags: ["GitHub & LinkedIn", "LeetCode Hub", "Social Links", "Mobile-Optimized"]
                },
                {
                  title: "Instagram Automations",
                  subtitle: "Comment-to-DM Traffic Engine",
                  badge: "Meta Verified",
                  badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
                  desc: "Convert Instagram Reel and Post viewers into direct portfolio traffic. Automatically send your live portfolio link, Linktree, or resume straight into follower DMs in under 3 seconds when they comment.",
                  icon: <FaInstagram className="text-purple-500 text-xl" />,
                  iconBg: "bg-purple-50 border-purple-200",
                  tags: ["< 3s Dispatch", "Trigger Words", "Meta Graph API", "Lead Capture"]
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/90 hover:border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {feature.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                        {feature.badge}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {feature.subtitle}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors mt-0.5">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mt-2">
                        {feature.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 mt-5">
                    {feature.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION - New */}
      <section className="py-12 bg-gradient-to-r from-emerald-50/50 to-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "100+", label: "App Downloads", icon: <FaUsers className="text-emerald-500" /> },
              { value: "18+", label: "Portfolio Themes", icon: <FaPalette className="text-emerald-500" /> },
              { value: "4.9", label: "Play Store Rating", icon: <FaStar className="text-emerald-500" /> },
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

      {/* HOW IT WORKS SECTION - Enhanced Alternating Row Layout */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Soft Ambient Background Accents */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-transparent to-emerald-50/20 pointer-events-none"></div>
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm">
              <FaRegClock size={12} />
              Simple Process
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Portfolio Website in <span className="text-emerald-500">3 Simple Steps</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Transform your accomplishments into a stunning website without writing a single line of code.
            </motion.p>
          </motion.div>

          <div className="space-y-6 lg:space-y-2">
            {/* STEP 1: Image Left, Text Right */}
            <motion.div
              className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {/* Image Card Left */}
              <motion.div variants={fadeInUp} className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group">
                  {/* Step 1 Number Badge */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white">
                    1
                  </div>

                  {/* Corner Icon Badge */}
                  <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-500 text-xl sm:text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <FaPalette />
                  </div>

                  {/* Illustration Frame */}
                  <div className="w-full bg-gradient-to-b from-slate-50/80 to-slate-100/50 rounded-2xl p-3 sm:p-5 border border-slate-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={howItWorks1}
                      alt="Choose a Template"
                      className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain group-hover:scale-[1.03] transition-transform duration-500 drop-shadow-sm"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Text Right */}
              <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Step 01 • Curated Templates
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Choose a <span className="text-emerald-500">Template</span>
                </h3>
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  Browse curated, career-specific templates optimized for students, designers, product managers, and developers. Every template is engineered for recruiter impact and lightning-fast load times.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Career-specific themes for Students, Developers, & Creatives",
                    "Live interactive previews across Desktop, Tablet & Mobile",
                    "Seamless 1-click theme switching without losing your data"
                  ].map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                        <FaCheckCircle size={12} />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <a
                    href="#templates"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all"
                  >
                    Browse All Templates <FaArrowRight size={12} />
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* DOTTED CONNECTING PATH 1 -> 2 */}
            <div className="relative py-4 lg:py-6 flex items-center justify-center">
              {/* Desktop Curved S-Line Flowing Left to Right */}
              <div className="hidden lg:block w-full max-w-4xl h-24 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 100" fill="none" preserveAspectRatio="none">
                  <path
                    d="M 220 0 C 220 70, 580 30, 580 100"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                  />
                  {/* Milestone Checkpoint Node */}
                  <circle cx="400" cy="50" r="15" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
                  <circle cx="400" cy="50" r="6" fill="#10b981" />
                </svg>
              </div>
              {/* Mobile / Tablet Vertical Dotted Line */}
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-0.5 h-8 border-l-2 border-dashed border-emerald-500"></div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center my-1 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="w-0.5 h-8 border-l-2 border-dashed border-emerald-500"></div>
              </div>
            </div>

            {/* STEP 2: Text Left, Image Right (Vice Versa) */}
            <motion.div
              className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {/* Text Left */}
              <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-6 text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Step 02 • Fast Dashboard
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Add Your <span className="text-emerald-500">Details</span>
                </h3>
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  Fill in your profile, projects, work experiences, certifications, education, and social links in a simple dashboard. No code, no design hurdles — just fill and watch your portfolio build itself.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Intuitive guided form — be up and running in under 5 minutes",
                    "Highlight GitHub repos, live projects, certifications & achievements",
                    "Real-time visual editor with instant feedback on edits"
                  ].map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                        <FaCheckCircle size={12} />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:gap-3 transition-all"
                  >
                    Explore the Dashboard <FaArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>

              {/* Image Card Right */}
              <motion.div variants={fadeInUp} className="lg:col-span-6 flex justify-center order-1 lg:order-2">
                <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group">
                  {/* Step 2 Number Badge */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white">
                    2
                  </div>

                  {/* Corner Icon Badge */}
                  <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-500 text-xl sm:text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <FaCode />
                  </div>

                  {/* Illustration Frame */}
                  <div className="w-full bg-gradient-to-b from-slate-50/80 to-slate-100/50 rounded-2xl p-3 sm:p-5 border border-slate-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={howItWorks2}
                      alt="Add Your Details"
                      className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain group-hover:scale-[1.03] transition-transform duration-500 drop-shadow-sm"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* DOTTED CONNECTING PATH 2 -> 3 */}
            <div className="relative py-4 lg:py-6 flex items-center justify-center">
              {/* Desktop Curved S-Line Flowing Right to Left */}
              <div className="hidden lg:block w-full max-w-4xl h-24 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 100" fill="none" preserveAspectRatio="none">
                  <path
                    d="M 580 0 C 580 70, 220 30, 220 100"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                  />
                  {/* Milestone Checkpoint Node */}
                  <circle cx="400" cy="50" r="15" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
                  <circle cx="400" cy="50" r="6" fill="#10b981" />
                </svg>
              </div>
              {/* Mobile / Tablet Vertical Dotted Line */}
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-0.5 h-8 border-l-2 border-dashed border-emerald-500"></div>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center my-1 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="w-0.5 h-8 border-l-2 border-dashed border-emerald-500"></div>
              </div>
            </div>

            {/* STEP 3: Image Left, Text Right (With Paper Airplane Launch) */}
            <motion.div
              className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {/* Image Card Left */}
              <motion.div variants={fadeInUp} className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group">
                  {/* Step 3 Number Badge */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white">
                    3
                  </div>

                  {/* Top-Right Paper Plane Accent Launching (as in reference image) */}
                  <div className="absolute -top-6 -right-4 sm:-top-8 sm:-right-6 z-20 flex items-center pointer-events-none">
                    <svg className="w-16 h-12 overflow-visible hidden sm:block" viewBox="0 0 60 40" fill="none">
                      <path
                        d="M 5 35 C 20 30, 35 20, 50 5"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray="5 5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 transform rotate-12 hover:rotate-45 transition-transform duration-300">
                      <FaPaperPlane className="text-base sm:text-lg" />
                    </div>
                  </div>

                  {/* Corner Icon Badge */}
                  <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-500 text-xl sm:text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <FaCloudUploadAlt />
                  </div>

                  {/* Illustration Frame */}
                  <div className="w-full bg-gradient-to-b from-slate-50/80 to-slate-100/50 rounded-2xl p-3 sm:p-5 border border-slate-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={howItWorks3}
                      alt="Publish Instantly"
                      className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain group-hover:scale-[1.03] transition-transform duration-500 drop-shadow-sm"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Text Right */}
              <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Step 03 • Go Live Instantly
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Publish <span className="text-emerald-500">Instantly</span>
                </h3>
                <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                  Deploy your personalized live subdomain portfolio (e.g. yourname.bytebodh.in) in seconds. Instantly ready to share on LinkedIn, your resume, or Instagram bio with built-in DM automation.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Free ultra-fast live subdomain (yourname.bytebodh.in)",
                    "Instant share to LinkedIn, resume headers & Linktree profile",
                    "Downloadable custom QR Code for fast mobile scanning"
                  ].map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                        <FaCheckCircle size={12} />
                      </div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-0.5"
                  >
                    <FaRocket size={14} />
                    Create Your Website Free
                    <FaArrowRight size={12} />
                  </Link>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 border border-emerald-200/70 px-3.5 py-2.5 rounded-xl shadow-sm">
                    <FaPaperPlane className="transform -rotate-12 text-sm text-emerald-500" />
                    <span>Live in under 3 minutes</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
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

        {/* TEMPLATES CATALOG SECTION - ThemeWagon Style */}
        <section className="py-24 bg-slate-50 border-t border-slate-200/80 relative overflow-hidden" id="templates">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16 space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
                <FaPalette size={12} />
                ThemeWagon Showcase
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Explore Our <span className="text-emerald-500">Portfolio Templates</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">
                Browse hand-crafted, high-performance web portfolio themes designed for students, developers, and leaders.
              </motion.p>
            </motion.div>

            {/* 3 Paid Templates Preview Grid - Clean preview without any text in cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTemplates.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 relative group aspect-[16/10]"
                >
                  {/* Live Template Component Scaled Preview (Same as templates screen) */}
                  <TemplateCardThumbnail
                    templateId={item.id}
                    title={item.name}
                    className="w-full h-full"
                  />

                  {/* Hover Overlay with Preview Button */}
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20 p-4">
                    <button
                      onClick={() => {
                        setPreviewModalTemplate(item);
                        setPreviewDevice("desktop");
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs sm:text-sm font-black rounded-xl shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <FaPlay size={10} /> Live Preview #{item.id}
                    </button>
                    <a
                      href={`/templates/preview/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl border border-white/20 transition-all transform hover:scale-105 cursor-pointer"
                      title="Open in new window"
                    >
                      <FaRocket size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Templates Button */}
            <div className="mt-14 text-center">
              <Link
                to="/templates"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 group hover:-translate-y-0.5 cursor-pointer"
              >
                <span>View More Templates</span>
                <FaArrowRight className="text-emerald-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </section>

        {/* ThemeWagon Interactive Live Demo Modal */}
        {previewModalTemplate && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col">
            {/* Modal Top Header Bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <h3 className="text-sm font-black tracking-tight">{previewModalTemplate.name}</h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {previewModalTemplate.category}
                </span>
              </div>

              {/* Device Switcher (Desktop / Tablet / Mobile) */}
              <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${previewDevice === "desktop" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                >
                  <FaDesktop /> Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice("tablet")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${previewDevice === "tablet" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                >
                  <FaTabletAlt /> Tablet
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${previewDevice === "mobile" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                >
                  <FaMobileAlt /> Mobile
                </button>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to="/portfolio-templates"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <FaRocket /> Use Template
                </Link>
                <button
                  onClick={() => setPreviewModalTemplate(null)}
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Modal Frame Body */}
            <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-auto">
              <div
                className={`transition-all duration-300 h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ${previewDevice === "desktop" ? "w-full" : previewDevice === "tablet" ? "w-[768px]" : "w-[375px]"
                  }`}
              >
                <iframe
                  src={`/templates/preview/${previewModalTemplate.id}`}
                  title={previewModalTemplate.name}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PRICING SECTION - Free vs Subscription */}
      <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden" id="pricing">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-14 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
              <FaCrown size={12} />
              Simple Pricing
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Start Free. <span className="text-emerald-500">Upgrade Anytime.</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-500">
              One subscription unlocks every premium template, blogs, and portfolio messaging — no per-template pricing.
            </motion.p>
          </motion.div>

          {/* Billing cycle toggle */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
              <button
                onClick={() => setPlanBillingCycle("MONTHLY")}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${planBillingCycle === "MONTHLY"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPlanBillingCycle("YEARLY")}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${planBillingCycle === "YEARLY"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-500 hover:text-emerald-600"
                  }`}
              >
                Yearly
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-500 text-white rounded-md uppercase tracking-wider">Best Value</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FREE PLAN */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 flex flex-col"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Free</span>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-black text-slate-900">₹0</span>
                <span className="text-sm text-slate-400 font-bold mb-1">/forever</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-2">Get started with a live portfolio in minutes.</p>

              <ul className="mt-6 space-y-3 flex-1">
                {[
                  "Access to free portfolio templates",
                  "Public portfolio link & QR code",
                  "Task & project tracker",
                  "Contact form on your portfolio",
                  "Referral program access",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                    <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
                {["Premium templates", "Personal blogs section"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-350">
                    <FaTimesCircle className="text-slate-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="mt-8 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-black rounded-2xl text-center transition-all"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* SUBSCRIPTION PLAN */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="relative bg-gradient-to-br from-[#0f172a] via-[#064e3b] to-[#0f172a] rounded-3xl shadow-xl p-8 flex flex-col overflow-hidden border border-slate-800"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subscription</span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                  <FaCrown size={9} /> Most Popular
                </span>
              </div>

              <div className="relative z-10 mt-3 flex items-end gap-1">
                <span className="text-4xl font-black text-white">
                  ₹{planBillingCycle === "YEARLY" ? subscriptionConfig.yearlyCost : subscriptionConfig.monthlyCost}
                </span>
                <span className="text-sm text-slate-400 font-bold mb-1">/{planBillingCycle === "YEARLY" ? "year" : "month"}</span>
              </div>
              <p className="relative z-10 text-xs text-slate-400 font-semibold mt-2">
                {planBillingCycle === "YEARLY" ? "Billed once a year." : "Billed every month."} Cancel any time.
              </p>

              <ul className="relative z-10 mt-6 space-y-3 flex-1">
                {[
                  "Everything in Free",
                  "Unlock every premium portfolio template",
                  "Personal blogs section enabled",
                  "Receive portfolio contact messages",
                  "Counts toward referral milestone rewards",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                    <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="relative z-10 mt-8 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-black rounded-2xl text-center shadow-lg shadow-emerald-500/20 transition-all"
              >
                Subscribe Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM COMMENT-TO-DM AUTOMATION SECTION */}
      <section className="py-24 bg-white text-slate-900 border-t border-slate-100 relative overflow-hidden" id="instagram-automation">
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-50 via-purple-50 to-emerald-50 border border-pink-200/80 text-pink-600 text-xs font-black uppercase tracking-wider shadow-sm">
              <FaInstagram className="text-pink-500 text-sm" />
              <span>Instagram Comment-to-DM Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black tracking-normal">PRO</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Turn Instagram Comments into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                Instant DMs & Direct Traffic
              </span>
            </motion.h2>


          </motion.div>

          {/* 2-Column Showcase */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Meta 3D Graphic Showcase */}
            <motion.div
              className="lg:col-span-6 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="relative w-full max-w-lg mx-auto flex items-center justify-center p-2">
                <div className="absolute -inset-6 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <img
                  src={metaImg}
                  alt="Turn Instagram Comments into Instant DMs & Direct Traffic - ByteBodh Automation"
                  className="w-full h-auto max-h-[640px] object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Right: Feature Highlights & CTA */}
            <motion.div
              className="lg:col-span-6 space-y-8 text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <span className="text-emerald-600 text-xs font-black uppercase tracking-wider">
                  Automate While You Sleep
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Never Tell Anyone to <br />
                  <span className="text-pink-600">"Check the Link in Bio"</span> Again
                </h3>

              </motion.div>

              {/* 4 Feature Cards */}
              <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Trigger Word Engine",
                    desc: "Set custom trigger words like PORTFOLIO, CODE, RESUME, or SEND. Works across reels, posts, or carousel media.",
                    icon: <FaComments className="text-pink-600 text-lg" />,
                    bg: "bg-pink-50 border-pink-200"
                  },
                  {
                    title: "< 3s Instant Delivery",
                    desc: "Dispatches personalized DMs via high-performance webhooks powered by official Meta Graph API.",
                    icon: <FaBolt className="text-amber-500 text-lg" />,
                    bg: "bg-amber-50 border-amber-200"
                  },
                  {
                    title: "Recruiter & Lead Capture",
                    desc: "Capture direct leads from Instagram comments and seamlessly route them to your portfolio or Linktree.",
                    icon: <FaChartLine className="text-emerald-600 text-lg" />,
                    bg: "bg-emerald-50 border-emerald-200"
                  },
                  {
                    title: "100% Meta Verified & Safe",
                    desc: "Uses official Instagram OAuth credentials. Fully compliant with Instagram platform terms — zero risk to your account.",
                    icon: <FaShieldAlt className="text-purple-600 text-lg" />,
                    bg: "bg-purple-50 border-purple-200"
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bg} border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-emerald-500 hover:from-pink-600 hover:via-purple-700 hover:to-emerald-600 text-white font-extrabold rounded-2xl shadow-xl shadow-pink-500/20 hover:shadow-2xl hover:shadow-pink-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <FaInstagram className="text-lg" />
                  Try Instagram Auto-DM
                  <FaArrowRight size={12} />
                </Link>

                <a
                  href="#pricing"
                  className="w-full sm:w-auto text-center px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <FaCrown className="text-amber-500 text-xs" />
                  Included in Pro Plan
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
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



      {/* TESTIMONIALS SECTION - Professional & Enhanced */}
      <section className="py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 border-t border-slate-200/80 relative overflow-hidden" id="reviews">
        {/* Subtle ambient lighting */}
        <div className="absolute top-12 left-1/4 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-12 right-1/4 w-[450px] h-[300px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12 space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm">
              <FaStar className="text-amber-400" size={13} />
              Reviews
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Loved by Students and <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Professionals</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Read how freshers, college students, and senior software engineers build their digital credentials and stand out to top recruiters.
            </motion.p>
          </motion.div>

          {/* Social Proof Metric Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={13} className="fill-current" />
                ))}
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">4.9 / 5.0</div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Google Play & Web Rating</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl font-black text-emerald-600 tracking-tight mb-1">94%</div>
              <div className="text-xs font-bold text-slate-800">Placement Callback Rate</div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Reported Live URL Boost</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl font-black text-slate-900 tracking-tight mb-1">100+</div>
              <div className="text-xs font-bold text-slate-800">App Downloads</div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Google Play Store</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center hover:border-emerald-500/30 transition-all">
              <div className="text-2xl font-black text-emerald-600 tracking-tight mb-1">&lt; 2 Mins</div>
              <div className="text-xs font-bold text-slate-800">Time to Live Profile</div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Instant Free Deployment</p>
            </div>
          </motion.div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { key: "ALL", label: "All Reviews (6)", icon: <FaStar size={11} /> },
              { key: "STUDENT", label: "Students & Campus Placements", icon: <FaUserGraduate size={11} /> },
              { key: "PROFESSIONAL", label: "Working Professionals & SDEs", icon: <FaUserTie size={11} /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setReviewFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  reviewFilter === tab.key
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <span className={reviewFilter === tab.key ? "text-emerald-400" : "text-slate-400"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-white rounded-3xl border border-slate-200/80 p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1.5 relative group"
              >
                <div>
                  {/* Card Header: Stars & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <FaStar key={i} size={13} className="fill-current" />
                      ))}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 inline-flex items-center gap-1.5 shadow-sm">
                      <FaCheckCircle size={10} className="text-emerald-500" />
                      Verified {item.tag}
                    </span>
                  </div>

                  {/* Quote Content */}
                  <div className="relative">
                    <FaQuoteLeft className="text-slate-200/90 text-xl mb-2" />
                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Outcome Highlight Pill */}
                  <div className="mt-5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">{item.result}</span>
                  </div>
                </div>

                {/* Reviewer Details Footer */}
                <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-100">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.avatarBg} flex items-center justify-center text-white font-black text-xs shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                    {item.avatar}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {item.role}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-bold truncate">
                      {item.organization}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof Alumni & Hiring Strip */}
          <div className="mt-16 pt-8 border-t border-slate-200/60 text-center">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">
              ByteBodh Portfolios Are Presented At Top Universities & Companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-black text-slate-600">
              {["Google", "Microsoft", "Razorpay", "BITS Pilani", "Tech Mahindra", "VIT University", "IIT Hyderabad", "Amazon", "Flipkart"].map((org, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{org}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP SECTION - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t border-b border-slate-900">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),rgba(0,0,0,0))] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Column: Details, Features & CTAs */}
          <motion.div
            className="lg:col-span-7 space-y-7 text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <FaMobileAlt size={13} className="text-emerald-400" />
              <span>ByteBodh Mobile • Android App</span>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                ByteBodh Mobile App <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                  Available Now
                </span>
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl font-normal">
                Create, customize, and monitor your personal portfolio directly from your phone. Edit live projects, track real-time analytics, and share your instant QR code with recruiters anywhere.
              </p>
            </motion.div>

            {/* Feature Highlights Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {[
                {
                  title: "Live Visitor Analytics",
                  desc: "Track real-time visits, views & profile shares",
                  icon: <FaChartLine className="text-emerald-400" />
                },
                {
                  title: "Instant QR Code Share",
                  desc: "One-tap scannable badge for meetups & interviews",
                  icon: <FaQrcode className="text-emerald-400" />
                },
                {
                  title: "On-The-Go Editor",
                  desc: "Add projects, skills & customize bio instantly",
                  icon: <FaBolt className="text-emerald-400" />
                },
                {
                  title: "Instant Cloud Sync",
                  desc: "Auto-synced across web and custom domain",
                  icon: <FaShieldAlt className="text-emerald-400" />
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA & QR Code Download Row */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 group cursor-pointer"
              >
                <FaGooglePlay className="text-slate-950 text-2xl group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-900/80 uppercase font-black tracking-wider block leading-tight">
                    Get it on
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-950 block leading-tight">
                    Google Play Store
                  </span>
                </div>
              </a>

              {/* Scan to Download Card */}
              <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <div className="p-1.5 bg-white rounded-lg shadow-sm shrink-0">
                  <QRCode
                    value="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                    size={42}
                    level="M"
                  />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <FaQrcode className="text-emerald-400 text-[11px]" />
                    <span>Scan to Install</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Point phone camera</p>
                </div>
              </div>
            </motion.div>

            {/* Trust and Rating Badges */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} className="fill-current" />
                  ))}
                </div>
                <span className="font-bold text-white">4.9 / 5</span>
                <span className="text-slate-500">(Google Play)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Free to Download</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Fast & Lightweight</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Mobile App Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center w-full relative">
            <motion.div
              className="relative flex items-center justify-center w-full max-w-[460px]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Radial backdrop lights */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-transparent rounded-full blur-[90px] pointer-events-none animate-pulse"></div>

              {/* Modern ambient circular tech accents */}
              <div className="absolute w-[360px] h-[360px] md:w-[420px] md:h-[420px] border border-emerald-500/15 rounded-full pointer-events-none"></div>
              <div className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] border border-emerald-500/10 rounded-full border-dashed pointer-events-none animate-[spin_60s_linear_infinite]"></div>

              {/* Floating Feature Tag Top Right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 right-2 sm:right-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-xl text-xs font-semibold text-white"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Sync Active</span>
              </motion.div>

              {/* Floating Tag Bottom Left */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 left-2 sm:left-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-md shadow-xl text-xs font-semibold text-slate-200"
              >
                <FaCheckCircle className="text-emerald-400 text-sm" />
                <span>Android 8.0 & Above</span>
              </motion.div>

              {/* Main mobileapp.png image */}
              <motion.div
                className="relative z-10 filter drop-shadow-[0_25px_45px_rgba(16,185,129,0.25)]"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <a
                  href="https://play.google.com/store/apps/details?id=com.bytebodh.bytebodh&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer focus:outline-none"
                  title="Download ByteBodh on Google Play"
                >
                  <img
                    src={mobileAppImg}
                    alt="ByteBodh Mobile App on Google Play - Create and showcase your portfolio"
                    className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[460px] h-auto object-contain mx-auto select-none"
                    loading="lazy"
                  />
                </a>
              </motion.div>
            </motion.div>
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
                q: "What does my public portfolio link look like?",
                a: "All portfolios are instantly published directly under your personalized subdomain in the username.domain.com format (e.g., yourname.bytebodh.in), providing you with a clean, branded, and high-impact link to share on resumes and LinkedIn."
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
                <span>Join 100+ creators & developers</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                Launch Your Portfolio Today
              </h2>
              <p className="text-lg text-emerald-50 max-w-xl mx-auto">
                Join ambitious students and professionals building their online presence with ByteBodh.
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
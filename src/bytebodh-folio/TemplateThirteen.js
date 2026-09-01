import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Mail,
  Phone,
  ArrowUpRight,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Send,
  Eye,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
  Code,
  Crown
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateThirteen = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Golden Frame defaults to White Premium light theme
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle Theme
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Copy Profile Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("Portfolio link copied!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Scroll Spy for Navbar active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "skills", "experience", "education", "projects", "certifications", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Contact Form Submission
  const handleSubmitContact = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const subjectLine = formData.subject.trim() || `Golden Frame Executive Inquiry from ${formData.name}`;
      const payload = {
        id: profile?.user?.id || profile?.userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: `Subject: ${subjectLine}\n\n${formData.message.trim()}`
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("👑 Executive message delivered successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(response?.data?.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Contact Form Error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to deliver message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse Skills Data
  const normalizedSkills = useMemo(() => {
    if (!profile?.skills) return [];
    return profile.skills.map((skill) => {
      if (typeof skill === "object" && skill !== null) {
        return {
          name: skill.name || "Technical Skill",
          proficiency: skill.proficiency || skill.level || 85,
          category: skill.category || "Executive Skill"
        };
      }
      return {
        name: String(skill),
        proficiency: 85,
        category: "Executive Skill"
      };
    });
  }, [profile?.skills]);

  // Social Icon Helper
  const renderSocialIcon = (platform, className = "w-4 h-4") => {
    const p = (platform || "").toUpperCase();
    if (p.includes("LINKEDIN")) return <Linkedin className={className} />;
    if (p.includes("GITHUB")) return <Github className={className} />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className={className} />;
    return <Globe className={className} />;
  };

  // Nav Items Configuration
  const navItems = [
    { id: "hero", label: "Overview", icon: User },
    { id: "skills", label: "Capabilities", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "certifications", label: "Credentials", icon: Award },
    { id: "contact", label: "Contact", icon: Mail }
  ];

  // Calculated Statistics
  const stats = [
    {
      label: "Projects Completed",
      value: profile?.projects?.length || 15,
      suffix: "+",
      icon: FolderGit2
    },
    {
      label: "Technical Stack",
      value: normalizedSkills.length || 22,
      suffix: "+",
      icon: Code
    },
    {
      label: "Certifications",
      value: profile?.certifications?.length || 5,
      suffix: "",
      icon: Award
    },
    {
      label: "Executive Views",
      value: profile?.viewsCount || 2150,
      suffix: "+",
      icon: Eye
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] ${
        isDarkMode ? "bg-[#0B0D12] text-[#F8FAFC]" : "bg-[#FFFFFF] text-[#0F172A]"
      }`}
    >
      {/* Soft Ambient Golden Rays Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#D4AF37]/10" : "bg-[#F3E5AB]/40"
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[170px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#C5A059]/10" : "bg-[#FFFDF5]/80"
          }`}
        />
      </div>

      {/* STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
          isDarkMode
            ? "bg-[#0B0D12]/85 border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/85 border-[#D4AF37]/20 shadow-[0_4px_25px_rgba(212,175,55,0.06)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] p-[2px] shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-sm transition-colors ${
                  isDarkMode ? "bg-[#0B0D12] text-[#D4AF37]" : "bg-white text-[#C5A059]"
                }`}
              >
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5 font-serif">
                {profile?.fullName || "Golden Frame"}
                <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] font-bold">
                Luxury Executive Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-lg ${
              isDarkMode ? "bg-[#121620]/70 border-[#D4AF37]/20" : "bg-[#FFFDF9] border-[#D4AF37]/25"
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 relative ${
                    isActive
                      ? isDarkMode
                        ? "text-[#D4AF37] font-bold"
                        : "text-[#C5A059] font-bold"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeGoldNav"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        isDarkMode
                          ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40"
                          : "bg-white border border-[#D4AF37]/40"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions on Right */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-[#121620] border-[#D4AF37]/30 text-amber-400 hover:border-[#D4AF37]"
                  : "bg-[#FFFDF9] border-[#D4AF37]/30 text-slate-800 hover:border-[#D4AF37]"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Share Link */}
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-full border transition-all duration-300 shadow-sm hidden sm:flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-[#121620] border-[#D4AF37]/30 text-slate-300 hover:text-[#D4AF37]"
                  : "bg-[#FFFDF9] border-[#D4AF37]/30 text-slate-800 hover:text-[#C5A059]"
              }`}
              title="Share Portfolio"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#D4AF37]" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-full border transition-colors ${
                isDarkMode ? "bg-[#121620] border-[#D4AF37]/30 text-slate-200" : "bg-[#FFFDF9] border-[#D4AF37]/30 text-slate-800"
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-b overflow-hidden backdrop-blur-2xl ${
                isDarkMode ? "bg-[#0B0D12]/95 border-[#D4AF37]/20" : "bg-white/95 border-[#D4AF37]/20"
              }`}
            >
              <div className="px-6 py-5 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                      activeSection === item.id
                        ? isDarkMode
                          ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40"
                          : "bg-[#FFFDF5] text-[#C5A059] border border-[#D4AF37]/40 font-bold"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#D4AF37]" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-28">
        
        {/* HERO SECTION WITH LARGE PROFILE & GOLDEN FRAME */}
        <section id="hero" className="pt-6 lg:pt-12 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Executive Brief */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Executive Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FFFDF5] dark:bg-slate-900/60 text-[#C5A059] dark:text-[#D4AF37] text-xs font-semibold tracking-wide shadow-sm">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Executive Recruiter Portfolio</span>
              </div>

              {/* Name & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-serif">
                  Architecting digital legacy for{" "}
                  <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] bg-clip-text text-transparent">
                    {profile?.fullName || "Executive Leader"}
                  </span>
                </h1>
                <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDarkMode ? "text-slate-300" : "text-[#0F172A]/80"}`}>
                  {profile?.headline || "Senior Staff Engineer & Director of Systems"}
                </h2>
              </div>

              {/* Summary */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                {profile?.summary ||
                  "Delivering enterprise-scale platforms, high-throughput cloud infrastructure, and award-winning digital experiences designed with luxury precision."}
              </p>

              {/* Floating Glass CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {/* Primary CTA: Explore Portfolio */}
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C5A059] hover:opacity-95 text-slate-950 font-extrabold text-sm shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Explore Portfolio</span>
                </button>

                {/* Secondary CTA: Contact Executive */}
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-8 py-4 rounded-full font-extrabold text-sm border backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "bg-[#121620]/80 border-[#D4AF37]/40 text-white hover:border-[#D4AF37]"
                      : "bg-white/80 border-[#D4AF37]/40 text-[#0F172A] hover:border-[#D4AF37] hover:bg-[#FFFDF9]"
                  }`}
                >
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span>Contact Executive</span>
                </button>
              </div>

              {/* Quick Details Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile?.mobileNumber && (
                  <a href={`tel:${profile.mobileNumber}`} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{profile.mobileNumber}</span>
                  </a>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Large Profile surrounded by Golden Frame Ring */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Golden Glow Rings */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-30 blur-2xl group-hover:opacity-50 transition duration-500" />

                {/* Golden Metallic Ring Container */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] shadow-[0_0_35px_rgba(212,175,55,0.25)]">
                  <div className="w-full h-full rounded-full p-1 bg-white dark:bg-[#0B0D12]">
                    {profile?.pictureUrl || profile?.photo ? (
                      <img
                        src={profile.pictureUrl || profile.photo}
                        alt={profile.fullName || "Profile"}
                        className="w-full h-full rounded-full object-cover shadow-inner"
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-full flex flex-col items-center justify-center font-serif text-5xl font-extrabold ${
                          isDarkMode ? "bg-[#121620] text-[#D4AF37]" : "bg-[#FFFDF5] text-[#C5A059]"
                        }`}
                      >
                        <span>{profile?.fullName?.[0] || "G"}</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase mt-2 text-[#D4AF37]">GOLDEN FRAME</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Glass Executive Badge */}
                <div
                  className={`absolute -bottom-4 right-2 sm:right-6 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-xl flex items-center gap-3 ${
                    isDarkMode ? "bg-[#121620]/90 border-[#D4AF37]/30 text-white" : "bg-white/95 border-[#D4AF37]/30 text-[#0F172A]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FFFDF5] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold font-serif">Executive Distinction</div>
                    <div className="text-[10px] text-[#D4AF37] font-mono">Rolex & Luxury Inspired</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXECUTIVE QUICK STATISTICS STRIP */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between transition-all hover:border-[#D4AF37]/60 shadow-sm ${
                isDarkMode ? "bg-[#121620]/70 border-[#D4AF37]/20" : "bg-[#FFFDF9] border-[#D4AF37]/25"
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FFFDF5] dark:bg-slate-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-3">
                <st.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-extrabold font-serif tracking-tight text-[#0F172A] dark:text-white mb-1">
                  {st.value}
                  <span className="text-[#D4AF37]">{st.suffix}</span>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {st.label}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* SKILLS SECTION (LUXURY GOLD BADGES) */}
        <section id="skills" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF5] text-[#C5A059] dark:text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-bold">
              <Code className="w-3.5 h-3.5" /> Core Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              Technical Stack & Expertise
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Luxury gold-badged chips representing technical leadership.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3.5 max-w-4xl mx-auto">
            {normalizedSkills.map((sk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className={`px-6 py-3.5 rounded-full border backdrop-blur-xl shadow-sm transition-all duration-300 flex items-center gap-3 cursor-default ${
                  isDarkMode
                    ? "bg-[#121620] border-[#D4AF37]/30 text-slate-200 hover:border-[#D4AF37]"
                    : "bg-[#FFFDF9] border-[#D4AF37]/30 text-[#0F172A] hover:border-[#D4AF37] shadow-sm"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span className="font-bold text-xs sm:text-sm tracking-wide">{sk.name}</span>
                {sk.proficiency && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#C5A059] dark:text-[#D4AF37]">
                    {sk.proficiency}%
                  </span>
                )}
              </motion.div>
            ))}
            {normalizedSkills.length === 0 && (
              <p className="text-xs italic text-slate-500">No capabilities listed yet.</p>
            )}
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF5] text-[#C5A059] dark:text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-bold">
              <Briefcase className="w-3.5 h-3.5" /> Career Growth
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              Executive Experience Timeline
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Professional trajectory and high-impact accomplishments.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {profile?.experience?.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/60 ${
                  isDarkMode
                    ? "bg-[#121620]/70 border-[#D4AF37]/20 shadow-md"
                    : "bg-[#FFFDF9] border-[#D4AF37]/25 hover:bg-white shadow-sm hover:shadow-xl"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#C5A059] p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0B0D12] flex items-center justify-center text-[#D4AF37] font-bold text-lg font-serif">
                        {exp.company?.[0] || "C"}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight font-serif">
                        {exp.position || exp.role || "Software Engineer"}
                      </h3>
                      <div className="text-sm font-semibold text-[#C5A059] dark:text-[#D4AF37] flex items-center gap-2 mt-0.5">
                        <span>{exp.company || "Company"}</span>
                        {exp.location && (
                          <span className={`text-xs font-normal ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            • {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border shrink-0 ${
                    isDarkMode ? "bg-[#0B0D12] border-[#D4AF37]/30 text-slate-300" : "bg-white border-[#D4AF37]/30 text-slate-800 shadow-sm"
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{exp.startDate || "2023"} - {exp.endDate || "Present"}</span>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {exp.description}
                </p>
              </motion.div>
            ))}
            {(!profile?.experience || profile.experience.length === 0) && (
              <p className="text-center text-xs italic text-slate-500">No experience listed yet.</p>
            )}
          </div>
        </section>

        {/* EDUCATION TIMELINE */}
        <section id="education" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF5] text-[#C5A059] dark:text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-bold">
              <GraduationCap className="w-3.5 h-3.5" /> Academic Honors
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              Education Timeline
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Academic qualifications structured in an executive timeline.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/40 space-y-10 my-6">
            {profile?.education?.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Gold Node Ring */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-5 h-5 rounded-full bg-white dark:bg-[#0B0D12] border-2 border-[#D4AF37] flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>

                <div
                  className={`p-7 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/60 ${
                    isDarkMode ? "bg-[#121620]/70 border-[#D4AF37]/20" : "bg-[#FFFDF9] border-[#D4AF37]/25 hover:bg-white shadow-sm hover:shadow-xl"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#D4AF37] tracking-wider uppercase">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#C5A059] dark:text-[#D4AF37]">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight font-serif mb-1">
                    {edu.degree}
                  </h3>
                  <div className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {edu.institution} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                  </div>

                  {edu.description && (
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
            {(!profile?.education || profile.education.length === 0) && (
              <p className="text-xs italic text-slate-500">No education entries listed.</p>
            )}
          </div>
        </section>

        {/* PROJECTS SHOWCASE (PREMIUM CARDS) */}
        <section id="projects" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF5] text-[#C5A059] dark:text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-bold">
              <FolderGit2 className="w-3.5 h-3.5" /> Portfolio Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              Featured Executive Projects
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Premium cards featuring gold accents, technology tags, and project links.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {profile?.projects?.map((proj, idx) => {
              const techList =
                proj.technologies ||
                (typeof proj.techStack === "string" ? proj.techStack.split(",") : []) ||
                [];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`rounded-3xl border overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 group ${
                    isDarkMode
                      ? "bg-[#121620]/70 border-[#D4AF37]/20 hover:border-[#D4AF37]/60 shadow-xl"
                      : "bg-[#FFFDF9] border-[#D4AF37]/25 hover:bg-white hover:border-[#D4AF37]/60 shadow-sm hover:shadow-xl"
                  }`}
                >
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    {proj.imageUrl || proj.image ? (
                      <img
                        src={proj.imageUrl || proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0B0D12] via-slate-950 to-amber-950 flex items-center justify-center p-6 text-center">
                        <Code className="w-12 h-12 text-[#D4AF37]/40 mb-2 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight font-serif mb-2 group-hover:text-[#D4AF37] transition-colors">
                        {proj.title}
                      </h3>
                      <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {techList.map((t, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/10 text-[#C5A059] dark:text-[#D4AF37] border border-[#D4AF37]/25"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>

                      {(proj.link || proj.projectUrl || proj.githubUrl) && (
                        <a
                          href={proj.link || proj.projectUrl || proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C5A059] hover:opacity-95 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                        >
                          <span>Visit Project</span>
                          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {(!profile?.projects || profile.projects.length === 0) && (
              <p className="text-center text-xs italic text-slate-500 col-span-full">No projects listed yet.</p>
            )}
          </div>
        </section>

        {/* CERTIFICATIONS (COMPACT EXECUTIVE CARDS) */}
        <section id="certifications" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF5] text-[#C5A059] dark:text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-bold">
              <Award className="w-3.5 h-3.5" /> Credentials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              Recognized Credentials
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Executive certifications and industry honors.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {profile?.certifications?.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between space-y-4 transition-all hover:border-[#D4AF37]/60 ${
                  isDarkMode
                    ? "bg-[#121620]/70 border-[#D4AF37]/20 shadow-md"
                    : "bg-[#FFFDF9] border-[#D4AF37]/25 hover:bg-white shadow-sm"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFFDF5] dark:bg-slate-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Crown className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${
                      isDarkMode ? "bg-[#0B0D12] border-[#D4AF37]/30 text-slate-300" : "bg-white border-[#D4AF37]/30 text-slate-700 shadow-sm"
                    }`}>
                      {cert.issueDate || cert.date || "2024"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold tracking-tight font-serif mb-1">
                      {cert.name || cert.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#C5A059] dark:text-[#D4AF37]">
                      {cert.issuingOrganization || cert.issuer || "Issuing Body"}
                    </div>
                  </div>

                  {cert.description && (
                    <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {cert.description}
                    </p>
                  )}
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D4AF37] hover:underline pt-2"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </motion.div>
            ))}
            {(!profile?.certifications || profile.certifications.length === 0) && (
              <p className="text-center text-xs italic text-slate-500 col-span-full">No certifications listed yet.</p>
            )}
          </div>
        </section>

        {/* RECRUITER CONTACT FORM SECTION */}
        <section id="contact" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFFDF5] text-[#C5A059] dark:text-[#D4AF37] text-xs font-mono uppercase tracking-widest font-bold">
              <Mail className="w-3.5 h-3.5" /> Direct Inquiry
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              Recruiter Contact Form
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Direct dispatch interface to connect with the executive candidate.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Direct Info */}
            <div
              className={`lg:col-span-5 p-8 rounded-3xl border backdrop-blur-xl space-y-6 flex flex-col justify-between ${
                isDarkMode ? "bg-[#121620]/70 border-[#D4AF37]/20" : "bg-[#FFFDF9] border-[#D4AF37]/25 shadow-md"
              }`}
            >
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight font-serif mb-2">Connect Executive</h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Inquiring about executive leadership positions, advisory roles, or technical consulting? Send a direct message.
                </p>

                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFFDF5] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Email</div>
                        <a href={`mailto:${profile.email}`} className="text-sm font-bold hover:text-[#D4AF37] transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.mobileNumber && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFFDF5] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Mobile</div>
                        <a href={`tel:${profile.mobileNumber}`} className="text-sm font-bold hover:text-[#D4AF37] transition-colors">
                          {profile.mobileNumber}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#D4AF37]/20">
                <div className="text-xs font-bold mb-3">Executive Share</div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 rounded-full border border-[#D4AF37]/40 text-[#C5A059] dark:text-[#D4AF37] bg-white dark:bg-[#0B0D12] text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-[#D4AF37]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Portfolio Link</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <div
              className={`lg:col-span-7 p-8 rounded-3xl border backdrop-blur-xl shadow-xl ${
                isDarkMode ? "bg-[#121620]/80 border-[#D4AF37]/20" : "bg-white border-[#D4AF37]/25"
              }`}
            >
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                        isDarkMode
                          ? "bg-[#0B0D12] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                          : "bg-[#FFFDF5] border-[#D4AF37]/30 text-[#0F172A] focus:border-[#D4AF37] focus:bg-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold mb-1.5">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="recruiter@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                        isDarkMode
                          ? "bg-[#0B0D12] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                          : "bg-[#FFFDF5] border-[#D4AF37]/30 text-[#0F172A] focus:border-[#D4AF37] focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="Executive Engineering Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#0B0D12] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                        : "bg-[#FFFDF5] border-[#D4AF37]/30 text-[#0F172A] focus:border-[#D4AF37] focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hi, I reviewed your Golden Frame executive portfolio and would like to discuss..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-[#0B0D12] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                        : "bg-[#FFFDF5] border-[#D4AF37]/30 text-[#0F172A] focus:border-[#D4AF37] focus:bg-white"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C5A059] hover:opacity-95 text-slate-950 font-extrabold text-sm shadow-[0_10px_25px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Dispatching Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Executive Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING CIRCULAR SOCIAL ICONS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {profile?.socialMediaLinks?.map((soc, idx) => (
          <motion.a
            key={idx}
            href={soc.url || soc.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full border shadow-lg backdrop-blur-xl flex items-center justify-center transition-all ${
              isDarkMode
                ? "bg-[#121620]/90 border-[#D4AF37]/30 text-[#D4AF37] hover:border-[#D4AF37]"
                : "bg-white/95 border-[#D4AF37]/30 text-[#C5A059] hover:border-[#D4AF37] shadow-md"
            }`}
            title={soc.platform}
          >
            {renderSocialIcon(soc.platform)}
          </motion.a>
        ))}
      </div>

      {/* FOOTER */}
      <footer
        className={`border-t backdrop-blur-xl py-12 relative z-10 ${
          isDarkMode ? "bg-[#0B0D12]/90 border-[#D4AF37]/20 text-slate-400" : "bg-white/90 border-[#D4AF37]/20 text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2 font-serif">
            <div className="w-6 h-6 rounded-lg bg-[#D4AF37] flex items-center justify-center text-slate-950 font-extrabold text-xs">
              GF
            </div>
            <span className="font-extrabold text-[#0F172A] dark:text-white">{profile?.fullName || "Golden Frame"}</span>
            <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-[#D4AF37] transition-colors">
                {profile.email}
              </a>
            )}
            {profile?.mobileNumber && (
              <a href={`tel:${profile.mobileNumber}`} className="hover:text-[#D4AF37] transition-colors">
                {profile.mobileNumber}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[#D4AF37] hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateThirteen;

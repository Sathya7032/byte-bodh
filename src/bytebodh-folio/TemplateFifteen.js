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
  Sparkles,
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
  Copy,
  Check,
  MapPin,
  Calendar,
  Code,
  Download,
  ShieldCheck,
  Compass
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateFifteen = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Prism Flow defaults to White (#FFFFFF) & Soft Gray (#F8FAFC)
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

  // Extract recipient identifier
  const username =
    profile?.user?.username ||
    profile?.username ||
    profile?.fullName?.toLowerCase().replace(/\s+/g, "") ||
    "user";

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
      const payload = {
        recipientUsername: username,
        receiverId: profile?.user?.id || profile?.userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || `Prism Flow Inquiry from ${formData.name}`,
        message: formData.message.trim()
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("Message sent successfully!");
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
          proficiency: skill.proficiency || skill.level || 88,
          category: skill.category || "Design & Engineering"
        };
      }
      return {
        name: String(skill),
        proficiency: 88,
        category: "Design & Engineering"
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
      label: "Projects Delivered",
      value: profile?.projects?.length || 18,
      suffix: "+",
      icon: FolderGit2
    },
    {
      label: "Core Skills",
      value: normalizedSkills.length || 24,
      suffix: "+",
      icon: Code
    },
    {
      label: "Certifications",
      value: profile?.certifications?.length || 6,
      suffix: "",
      icon: Award
    },
    {
      label: "Years Experience",
      value: profile?.experience?.length ? profile.experience.length * 2 : 7,
      suffix: "+ Yrs",
      icon: Briefcase
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#16A34A]/20 selection:text-[#16A34A] ${
        isDarkMode ? "bg-[#0B0F19] text-[#F8FAFC]" : "bg-[#FFFFFF] text-[#111827]"
      }`}
    >
      {/* Subtle Prism Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <div
          className={`absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#16A34A]/10" : "bg-[#16A34A]/15"
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[550px] h-[550px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#4F46E5]/10" : "bg-[#4F46E5]/15"
          }`}
        />
      </div>

      {/* STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
          isDarkMode
            ? "bg-[#0B0F19]/85 border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/85 border-[#E2E8F0] shadow-[0_4px_25px_rgba(0,0,0,0.04)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left: Prism Flow Mark */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A34A] via-[#22C55E] to-[#4F46E5] p-[2px] shadow-md shadow-[#16A34A]/20 group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-sm transition-colors ${
                  isDarkMode ? "bg-[#0B0F19] text-[#22C55E]" : "bg-white text-[#16A34A]"
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5 font-serif">
                {profile?.fullName || "Prism Flow"}
                <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A]" />
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[#4F46E5] dark:text-indigo-400 font-bold">
                Handcrafted Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-lg ${
              isDarkMode ? "bg-[#111827]/70 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0]"
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
                        ? "text-[#22C55E] font-bold"
                        : "text-[#16A34A] font-bold"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePrismNav"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        isDarkMode
                          ? "bg-[#16A34A]/20 border border-[#16A34A]/40"
                          : "bg-white border border-[#16A34A]/30"
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
                  ? "bg-[#111827] border-slate-800 text-amber-400 hover:border-[#16A34A]"
                  : "bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 hover:border-[#16A34A]"
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
                  ? "bg-[#111827] border-slate-800 text-slate-300 hover:text-[#22C55E]"
                  : "bg-[#F8FAFC] border-[#E2E8F0] text-slate-800 hover:text-[#16A34A]"
              }`}
              title="Share Portfolio"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-full border transition-colors ${
                isDarkMode ? "bg-[#111827] border-slate-800 text-slate-200" : "bg-[#F8FAFC] border-[#E2E8F0] text-slate-800"
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
                isDarkMode ? "bg-[#0B0F19]/95 border-slate-800" : "bg-white/95 border-[#E2E8F0]"
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
                          ? "bg-[#16A34A]/20 text-[#22C55E] border border-[#16A34A]/40"
                          : "bg-[#F8FAFC] text-[#16A34A] border border-[#16A34A]/30 font-bold"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#16A34A]" />
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
        
        {/* ASYMMETRICAL HERO SECTION WITH LAYERED SURFACES & 32PX BORDER RADIUS */}
        <section id="hero" className="pt-6 lg:pt-12 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Asymmetrical Executive Text (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] dark:bg-slate-900/60 text-[#16A34A] dark:text-[#22C55E] text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Crafted Portfolio • Apple & Linear Inspired</span>
              </div>

              {/* Title & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                  Designed with precision for{" "}
                  <span className="bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#4F46E5] bg-clip-text text-transparent">
                    {profile?.fullName || "Senior Designer & Engineer"}
                  </span>
                </h1>
                <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {profile?.headline || "Senior Staff Engineer & UI/UX Specialist"}
                </h2>
              </div>

              {/* Summary */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                {profile?.summary ||
                  "Handcrafted software products, design systems, and digital experiences created with intentional visual rhythm, clean whitespace, and refined micro-interactions."}
              </p>

              {/* Two Magnetic CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {/* Primary CTA: Download Resume */}
                {profile?.resumeUrl ? (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(22,163,74,0.3)] hover:shadow-[0_15px_35px_rgba(22,163,74,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                  >
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    <span>Download Resume</span>
                  </a>
                ) : (
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="px-8 py-4 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(22,163,74,0.3)] hover:shadow-[0_15px_35px_rgba(22,163,74,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                  >
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    <span>View Resume</span>
                  </button>
                )}

                {/* Secondary CTA: Contact Me */}
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-8 py-4 rounded-full font-extrabold text-sm border-2 backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "border-[#4F46E5] text-indigo-400 hover:bg-[#4F46E5]/15"
                      : "border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5]/10"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Quick Info Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-[#16A34A] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile?.mobileNumber && (
                  <a href={`tel:${profile.mobileNumber}`} className="flex items-center gap-2 hover:text-[#16A34A] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{profile.mobileNumber}</span>
                  </a>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Layered Surface Profile Photo (5 Cols, 32px Radius) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm">
                {/* Background Layer Card */}
                <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-[#16A34A] via-[#22C55E] to-[#4F46E5] opacity-20 blur-xl group-hover:opacity-40 transition duration-500" />

                {/* Profile Photo Surface Card */}
                <div
                  className={`relative p-3 rounded-[32px] border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
                    isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="w-full h-80 sm:h-96 rounded-[24px] overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                    {profile?.pictureUrl || profile?.photo ? (
                      <img
                        src={profile.pictureUrl || profile.photo}
                        alt={profile.fullName || "Profile"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex flex-col items-center justify-center font-extrabold text-6xl ${
                          isDarkMode ? "bg-[#111827] text-[#22C55E]" : "bg-[#F8FAFC] text-[#16A34A]"
                        }`}
                      >
                        <span>{profile?.fullName?.[0] || "P"}</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase mt-3 text-[#4F46E5]">PRISM FLOW</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Glass Distinction Card */}
                <div
                  className={`absolute -bottom-6 -left-4 sm:-left-6 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-xl flex items-center gap-3 ${
                    isDarkMode ? "bg-[#111827]/90 border-slate-800 text-white" : "bg-white/95 border-[#E2E8F0] text-[#111827]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] font-bold text-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold">Handcrafted Design</div>
                    <div className="text-[10px] text-[#4F46E5] dark:text-indigo-400 font-mono">WCAG Compliant • 8pt Grid</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED METRICS (ANIMATED COUNTERS & ASYMMETRICAL CARDS) */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {stats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`p-6 rounded-[28px] border backdrop-blur-xl flex flex-col justify-between transition-all hover:border-[#16A34A]/60 shadow-sm ${
                isDarkMode ? "bg-[#111827]/70 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0]"
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] mb-3">
                <st.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-[#111827] dark:text-white mb-1">
                  {st.value}
                  <span className="text-[#4F46E5] dark:text-indigo-400">{st.suffix}</span>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {st.label}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* SKILLS AS INTERACTIVE CHIPS */}
        <section id="skills" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
              <Code className="w-3.5 h-3.5 text-[#16A34A]" /> Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Core Skills & Proficiency
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Interactive chips with smooth hover lift effects and 28px border radius.
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
                    ? "bg-[#111827] border-slate-800 text-slate-200 hover:border-[#16A34A]"
                    : "bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] hover:border-[#16A34A] shadow-sm"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <span className="font-bold text-xs sm:text-sm tracking-wide">{sk.name}</span>
                {sk.proficiency && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#16A34A]/15 text-[#16A34A] dark:text-[#22C55E]">
                    {sk.proficiency}%
                  </span>
                )}
              </motion.div>
            ))}
            {normalizedSkills.length === 0 && (
              <p className="text-xs italic text-slate-500">No skills listed yet.</p>
            )}
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
              <Briefcase className="w-3.5 h-3.5 text-[#16A34A]" /> Professional History
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Experience Timeline
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Key positions, career progression, and deliverable highlights.
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
                className={`p-8 rounded-[32px] border backdrop-blur-xl transition-all duration-300 hover:border-[#16A34A]/60 ${
                  isDarkMode
                    ? "bg-[#111827]/70 border-slate-800 shadow-md"
                    : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white shadow-sm hover:shadow-xl"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#16A34A] to-[#4F46E5] p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0B0F19] flex items-center justify-center text-[#16A34A] font-bold text-lg">
                        {exp.company?.[0] || "C"}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">
                        {exp.position || exp.role || "Software Engineer"}
                      </h3>
                      <div className="text-sm font-semibold text-[#16A34A] dark:text-[#22C55E] flex items-center gap-2 mt-0.5">
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
                    isDarkMode ? "bg-[#0B0F19] border-slate-800 text-slate-300" : "bg-white border-[#E2E8F0] text-slate-800 shadow-sm"
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-[#16A34A]" /> Academic Excellence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Education Timeline
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Degrees, institution details, and academic milestones.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto pl-6 sm:pl-8 border-l-2 border-[#16A34A]/40 space-y-10 my-6">
            {profile?.education?.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Node Marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-5 h-5 rounded-full bg-white dark:bg-[#0B0F19] border-2 border-[#16A34A] flex items-center justify-center shadow-md group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                </div>

                <div
                  className={`p-7 rounded-[28px] border backdrop-blur-xl transition-all duration-300 hover:border-[#16A34A]/60 ${
                    isDarkMode ? "bg-[#111827]/70 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white shadow-sm hover:shadow-xl"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#16A34A] dark:text-[#22C55E] tracking-wider uppercase">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#16A34A]/10 border-[#16A34A]/30 text-[#16A34A] dark:text-[#22C55E]">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-1">
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

        {/* PROJECTS SHOWCASE (ALTERNATING LARGE & SMALL CARDS) */}
        <section id="projects" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
              <FolderGit2 className="w-3.5 h-3.5 text-[#16A34A]" /> Portfolio Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Featured Work & Products
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Asymmetrical layout with alternating feature cards and screenshots.
            </p>
          </div>

          <div className="space-y-8">
            {profile?.projects?.map((proj, idx) => {
              const isLarge = idx % 2 === 0; // Alternating large (even index) and small (odd index) cards
              const techList =
                proj.technologies ||
                (typeof proj.techStack === "string" ? proj.techStack.split(",") : []) ||
                [];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`rounded-[32px] border overflow-hidden backdrop-blur-xl transition-all duration-500 hover:border-[#16A34A]/60 group ${
                    isDarkMode
                      ? "bg-[#111827]/70 border-slate-800 hover:shadow-2xl"
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white shadow-sm hover:shadow-xl"
                  }`}
                >
                  <div className={`grid ${isLarge ? "lg:grid-cols-12" : "lg:grid-cols-12"} items-center gap-8 p-6 sm:p-8`}>
                    {/* Image Column */}
                    <div className={`${isLarge ? "lg:col-span-7" : "lg:col-span-5"} overflow-hidden rounded-[24px] bg-slate-900 relative h-64 sm:h-80`}>
                      {proj.imageUrl || proj.image ? (
                        <img
                          src={proj.imageUrl || proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0B0F19] via-slate-950 to-emerald-950 flex items-center justify-center p-6 text-center">
                          <Code className="w-12 h-12 text-[#16A34A]/40 mb-2 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                    </div>

                    {/* Content Column */}
                    <div className={`${isLarge ? "lg:col-span-5" : "lg:col-span-7"} space-y-4`}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#16A34A]/10 text-[#16A34A] dark:text-[#22C55E]">
                        <span>PROJECT 0{idx + 1}</span>
                      </div>

                      <h3 className="text-2xl font-bold tracking-tight group-hover:text-[#16A34A] transition-colors">
                        {proj.title}
                      </h3>

                      <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {techList.map((t, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#4F46E5]/10 text-[#4F46E5] dark:text-indigo-400 border border-[#4F46E5]/20"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>

                      {(proj.link || proj.projectUrl || proj.githubUrl) && (
                        <div className="pt-2">
                          <a
                            href={proj.link || proj.projectUrl || proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs shadow-md transition-all group/btn cursor-pointer"
                          >
                            <span>View Project</span>
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {(!profile?.projects || profile.projects.length === 0) && (
              <p className="text-center text-xs italic text-slate-500">No projects listed yet.</p>
            )}
          </div>
        </section>

        {/* CERTIFICATIONS IN CLEAN HORIZONTAL CARDS */}
        <section id="certifications" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
              <Award className="w-3.5 h-3.5 text-[#16A34A]" /> Verified Credentials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Certifications & Recognitions
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Clean horizontal cards displaying verified industry qualifications.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {profile?.certifications?.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-6 rounded-[28px] border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#16A34A]/60 ${
                  isDarkMode
                    ? "bg-[#111827]/70 border-slate-800 shadow-md"
                    : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight">
                      {cert.name || cert.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#4F46E5] dark:text-indigo-400">
                      {cert.issuingOrganization || cert.issuer || "Issuing Body"} • {cert.issueDate || cert.date || "2024"}
                    </div>
                  </div>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#16A34A] dark:text-[#22C55E] hover:underline shrink-0"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </motion.div>
            ))}
            {(!profile?.certifications || profile.certifications.length === 0) && (
              <p className="text-center text-xs italic text-slate-500">No certifications listed yet.</p>
            )}
          </div>
        </section>

        {/* PROFESSIONAL RECRUITER CONTACT SECTION */}
        <section id="contact" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
              <Mail className="w-3.5 h-3.5 text-[#16A34A]" /> Recruiter Connection
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get in Touch
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Direct dispatch interface to connect with the candidate.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Direct Info */}
            <div
              className={`lg:col-span-5 p-8 rounded-[32px] border backdrop-blur-xl space-y-6 flex flex-col justify-between ${
                isDarkMode ? "bg-[#111827]/70 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0] shadow-md"
              }`}
            >
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Let's Build Together</h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Inquiring about full-time engineering roles, technical consulting, or leadership positions? Reach out directly.
                </p>

                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Email</div>
                        <a href={`mailto:${profile.email}`} className="text-sm font-bold hover:text-[#16A34A] transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.mobileNumber && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Phone</div>
                        <a href={`tel:${profile.mobileNumber}`} className="text-sm font-bold hover:text-[#16A34A] transition-colors">
                          {profile.mobileNumber}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold mb-3">Portfolio Share</div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 rounded-full border border-[#16A34A]/40 text-[#16A34A] dark:text-[#22C55E] bg-white dark:bg-[#0B0F19] text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-[#16A34A]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Portfolio Link</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <div
              className={`lg:col-span-7 p-8 rounded-[32px] border backdrop-blur-xl shadow-xl ${
                isDarkMode ? "bg-[#111827]/80 border-slate-800" : "bg-white border-[#E2E8F0]"
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
                          ? "bg-[#0B0F19] border-slate-800 text-white focus:border-[#16A34A]"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] focus:border-[#16A34A] focus:bg-white"
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
                          ? "bg-[#0B0F19] border-slate-800 text-white focus:border-[#16A34A]"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] focus:border-[#16A34A] focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="Senior Engineering Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#0B0F19] border-slate-800 text-white focus:border-[#16A34A]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] focus:border-[#16A34A] focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hi, I reviewed your Prism Flow portfolio and would like to connect..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-[#0B0F19] border-slate-800 text-white focus:border-[#16A34A]"
                        : "bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] focus:border-[#16A34A] focus:bg-white"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING SOCIAL MEDIA DOCK */}
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
                ? "bg-[#111827]/90 border-slate-800 text-[#22C55E] hover:border-[#16A34A]"
                : "bg-white/95 border-[#E2E8F0] text-[#16A34A] hover:border-[#16A34A] shadow-md"
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
          isDarkMode ? "bg-[#0B0F19]/90 border-slate-800 text-slate-400" : "bg-white/90 border-[#E2E8F0] text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#16A34A] flex items-center justify-center text-white font-extrabold text-xs">
              PF
            </div>
            <span className="font-extrabold text-[#111827] dark:text-white">{profile?.fullName || "Prism Flow"}</span>
            <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-[#16A34A] transition-colors">
                {profile.email}
              </a>
            )}
            {profile?.mobileNumber && (
              <a href={`tel:${profile.mobileNumber}`} className="hover:text-[#16A34A] transition-colors">
                {profile.mobileNumber}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[#16A34A] dark:text-[#22C55E] hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateFifteen;

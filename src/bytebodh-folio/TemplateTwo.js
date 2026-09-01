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
  FileText,
  Send,
  Eye,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
  Code
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateTwo = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Ivory Elite defaults to clean white light theme
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

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
    toast.success("Portfolio link copied to clipboard!");
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
      const subjectLine = formData.subject.trim() || `Ivory Elite Inquiry from ${formData.name}`;
      const payload = {
        id: profile?.user?.id || profile?.userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: `Subject: ${subjectLine}\n\n${formData.message.trim()}`
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("🚀 Message sent successfully! I'll respond promptly.");
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
          category: skill.category || "Engineering"
        };
      }
      return {
        name: String(skill),
        proficiency: 85,
        category: "Engineering"
      };
    });
  }, [profile?.skills]);

  // Social Icon Helper
  const renderSocialIcon = (platform, className = "w-5 h-5") => {
    const p = (platform || "").toUpperCase();
    if (p.includes("LINKEDIN")) return <Linkedin className={className} />;
    if (p.includes("GITHUB")) return <Github className={className} />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className={className} />;
    return <Globe className={className} />;
  };

  // Navigation Items Configuration
  const navItems = [
    { id: "hero", label: "Overview", icon: User },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "contact", label: "Contact", icon: Mail }
  ];

  // Calculated Statistics
  const stats = [
    {
      label: "Projects Completed",
      value: profile?.projects?.length || 10,
      suffix: "+",
      icon: FolderGit2
    },
    {
      label: "Technical Skills",
      value: normalizedSkills.length || 16,
      suffix: "+",
      icon: Code
    },
    {
      label: "Certifications",
      value: profile?.certifications?.length || 3,
      suffix: "",
      icon: Award
    },
    {
      label: "Profile Views",
      value: profile?.viewsCount || 1520,
      suffix: "+",
      icon: Eye
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#DCFCE7] selection:text-[#16A34A] ${
        isDarkMode ? "bg-[#0B0F17] text-[#F9FAFB]" : "bg-[#FFFFFF] text-[#111827]"
      }`}
    >
      {/* Background Soft Mesh Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#16A34A]/15" : "bg-[#DCFCE7]/70"
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full blur-[150px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#22C55E]/10" : "bg-[#DCFCE7]/50"
          }`}
        />
      </div>

      {/* STICKY NAVIGATION BAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
          isDarkMode
            ? "bg-[#0B0F17]/80 border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-[#FFFFFF]/80 border-[#E5E7EB]/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A34A] to-[#22C55E] p-[2px] shadow-md shadow-[#16A34A]/20 group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-sm transition-colors ${
                  isDarkMode ? "bg-[#0B0F17] text-[#22C55E]" : "bg-white text-[#16A34A]"
                }`}
              >
                {profile?.fullName
                  ? profile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "IE"}
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                {profile?.fullName || "Ivory Elite"}
                <span className="inline-block w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              </span>
              <span className={`block text-[10px] uppercase font-mono tracking-widest ${isDarkMode ? "text-[#22C55E]" : "text-[#16A34A]"}`}>
                Recruiter Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-lg ${
              isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-[#F8FAFC] border-[#E5E7EB]"
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
                      layoutId="activeIvoryNav"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        isDarkMode
                          ? "bg-[#16A34A]/20 border border-[#16A34A]/40"
                          : "bg-[#DCFCE7] border border-[#16A34A]/30"
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
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-2xl border transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                  : "bg-[#F8FAFC] border-[#E5E7EB] text-slate-700 hover:bg-slate-100 hover:border-slate-300"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Copy Share Link */}
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-2xl border transition-all duration-300 shadow-sm hidden sm:flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-[#22C55E]"
                  : "bg-[#F8FAFC] border-[#E5E7EB] text-slate-700 hover:text-[#16A34A] hover:border-[#16A34A]/40"
              }`}
              title="Share Portfolio"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#16A34A]" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-2xl border transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-[#F8FAFC] border-[#E5E7EB] text-slate-800"
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
                isDarkMode ? "bg-[#0B0F17]/95 border-slate-800" : "bg-[#FFFFFF]/95 border-[#E5E7EB]"
              }`}
            >
              <div className="px-6 py-5 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      activeSection === item.id
                        ? isDarkMode
                          ? "bg-[#16A34A]/20 text-[#22C55E] border border-[#16A34A]/40"
                          : "bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/30 font-bold"
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-28">
        {/* HERO SECTION */}
        <section id="hero" className="pt-6 lg:pt-12 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Recruiter Briefing */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Recruiter Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                <span>Available for Full-time Roles & Remote Projects</span>
              </div>

              {/* Name & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                  Hi, I'm{" "}
                  <span className="bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-teal-600 bg-clip-text text-transparent">
                    {profile?.fullName || "Ivory Elite Candidate"}
                  </span>
                </h1>
                <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDarkMode ? "text-slate-300" : "text-[#111827]/80"}`}>
                  {profile?.headline || "Senior Software Engineer & Systems Architect"}
                </h2>
              </div>

              {/* Summary */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                {profile?.summary ||
                  "Passionate software engineering professional specialized in building robust web applications, optimizing high-throughput backend services, and delivering clean, maintainable user experiences."}
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {/* Primary CTA: View Resume */}
                <button
                  onClick={() => setResumeModalOpen(true)}
                  className="px-8 py-4 rounded-[24px] bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-[#15803D] hover:to-[#16A34A] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(22,163,74,0.3)] hover:shadow-[0_15px_35px_rgba(22,163,74,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>View Resume</span>
                </button>

                {/* Secondary CTA: Contact Me */}
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-8 py-4 rounded-[24px] font-extrabold text-sm border transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 text-slate-200 hover:border-[#16A34A]"
                      : "bg-[#F8FAFC] border-[#E5E7EB] text-[#111827] hover:border-[#16A34A] hover:bg-white"
                  }`}
                >
                  <Mail className="w-4 h-4 text-[#16A34A]" />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Quick Contact Chips */}
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

            {/* Right Column: Floating Circular Profile Image */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative group"
              >
                {/* Glowing Background Ring */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-teal-400 opacity-60 blur-2xl group-hover:opacity-90 transition duration-700" />

                {/* Main Circular Profile Image Frame */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2.5 bg-gradient-to-tr from-[#16A34A] to-[#DCFCE7] shadow-2xl">
                  {profile?.pictureUrl || profile?.photo ? (
                    <img
                      src={profile.pictureUrl || profile.photo}
                      alt={profile.fullName || "Profile"}
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-full flex flex-col items-center justify-center text-5xl font-extrabold ${
                        isDarkMode ? "bg-slate-900 text-[#22C55E]" : "bg-[#F8FAFC] text-[#16A34A]"
                      }`}
                    >
                      <span>{profile?.fullName?.[0] || "I"}</span>
                      <span className="text-xs font-mono tracking-widest uppercase mt-2 text-[#16A34A]">Ivory Elite</span>
                    </div>
                  )}
                </div>

                {/* Floating Recruiter Verified Badge */}
                <div
                  className={`absolute -bottom-4 right-2 sm:right-6 px-5 py-3 rounded-[20px] border backdrop-blur-xl shadow-xl flex items-center gap-3.5 ${
                    isDarkMode ? "bg-slate-900/90 border-slate-800 text-slate-200" : "bg-white/95 border-[#E5E7EB] text-[#111827]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold">Recruiter Ready</div>
                    <div className="text-[10px] text-[#16A34A] font-mono font-bold">100% Verified Candidate</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* QUICK STATISTICS CARDS (24px Radius) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-7 rounded-[24px] border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 group ${
                isDarkMode
                  ? "bg-slate-900/50 border-slate-800 hover:border-[#16A34A]/50 shadow-lg"
                  : "bg-[#F8FAFC] border-[#E5E7EB] hover:border-[#16A34A]/40 hover:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-[#DCFCE7] text-[#16A34A] shadow-sm">
                  <st.icon className="w-5 h-5" />
                </div>
                <Sparkles className="w-4 h-4 text-[#16A34A]/40 group-hover:text-[#16A34A] transition-colors" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                {st.value}
                <span className="text-[#16A34A]">{st.suffix}</span>
              </div>
              <div className={`text-xs font-semibold tracking-wide ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                {st.label}
              </div>
            </motion.div>
          ))}
        </section>

        {/* SKILLS SECTION (Rounded Pills) */}
        <section id="skills" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] text-[#16A34A] text-xs font-mono uppercase tracking-widest font-bold">
              <Code className="w-3.5 h-3.5" /> Core Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Skills & Expertise
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Technical competencies displayed as rounded animated pills.
            </p>
          </div>

          {/* Rounded Animated Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {normalizedSkills.map((sk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className={`px-6 py-3.5 rounded-full border backdrop-blur-xl shadow-sm transition-all duration-300 flex items-center gap-3.5 cursor-default group ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 hover:border-[#16A34A] text-slate-200"
                    : "bg-[#F8FAFC] border-[#E5E7EB] hover:border-[#16A34A] hover:bg-white text-[#111827] shadow-sm"
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-[#16A34A] group-hover:scale-125 transition-transform" />
                <span className="font-bold text-xs sm:text-sm tracking-wide">{sk.name}</span>
                {sk.proficiency && (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] text-[#16A34A] text-xs font-mono uppercase tracking-widest font-bold">
              <Briefcase className="w-3.5 h-3.5" /> Career Journey
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Work Experience
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Professional experience presented in a clean vertical timeline.
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {profile?.experience?.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-7 sm:p-9 rounded-[24px] border backdrop-blur-xl transition-all duration-300 hover:border-[#16A34A]/50 relative overflow-hidden group ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-800 shadow-md"
                    : "bg-[#F8FAFC] border-[#E5E7EB] hover:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl"
                }`}
              >
                {/* Accent Top Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] font-extrabold text-xl shrink-0 shadow-sm">
                      {exp.company?.[0] || "C"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-[#16A34A] transition-colors">
                        {exp.position || exp.role || "Software Engineer"}
                      </h3>
                      <div className="text-sm font-semibold text-[#16A34A] flex items-center gap-2 mt-0.5">
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
                    isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-[#E5E7EB] text-slate-700 shadow-sm"
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>
                      {exp.startDate || "2023"} - {exp.endDate || "Present"}
                    </span>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {exp.description}
                </p>
              </motion.div>
            ))}
            {(!profile?.experience || profile.experience.length === 0) && (
              <p className="text-center text-xs italic text-slate-500">No work experience listed yet.</p>
            )}
          </div>
        </section>

        {/* EDUCATION TIMELINE */}
        <section id="education" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] text-[#16A34A] text-xs font-mono uppercase tracking-widest font-bold">
              <GraduationCap className="w-3.5 h-3.5" /> Educational Background
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Education Timeline
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Academic qualifications structured in a 24px rounded card layout.
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
                {/* Glowing Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-5 h-5 rounded-full bg-white border-2 border-[#16A34A] flex items-center justify-center shadow-[0_0_10px_rgba(22,163,74,0.4)] group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                </div>

                <div
                  className={`p-7 rounded-[24px] border backdrop-blur-xl transition-all duration-300 hover:border-[#16A34A]/50 ${
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-[#F8FAFC] border-[#E5E7EB] hover:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#16A34A] tracking-wider uppercase">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#DCFCE7] border-[#16A34A]/30 text-[#16A34A]">
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

        {/* PROJECTS SHOWCASE */}
        <section id="projects" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] text-[#16A34A] text-xs font-mono uppercase tracking-widest font-bold">
              <FolderGit2 className="w-3.5 h-3.5" /> Featured Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Projects Showcase
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Premium card grid with rounded gradient buttons and arrow indicators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className={`rounded-[24px] border overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group ${
                    isDarkMode
                      ? "bg-slate-900/50 border-slate-800 hover:border-[#16A34A]/50 shadow-xl"
                      : "bg-[#F8FAFC] border-[#E5E7EB] hover:bg-white hover:border-[#16A34A]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl"
                  }`}
                >
                  {/* Project Image Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    {proj.imageUrl || proj.image ? (
                      <img
                        src={proj.imageUrl || proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex items-center justify-center p-6 text-center">
                        <Code className="w-12 h-12 text-[#16A34A]/40 mb-2 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-[#16A34A] transition-colors">
                        {proj.title}
                      </h3>
                      <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {techList.map((t, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Visit Project Button - Rounded 24px Gradient Hover Lift Arrow Icon */}
                      {(proj.link || proj.projectUrl || proj.githubUrl) && (
                        <a
                          href={proj.link || proj.projectUrl || proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-5 rounded-[24px] bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-[#15803D] hover:to-[#16A34A] text-white font-extrabold text-xs shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:shadow-[0_12px_28px_rgba(22,163,74,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
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

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] text-[#16A34A] text-xs font-mono uppercase tracking-widest font-bold">
              <Award className="w-3.5 h-3.5" /> Industry Credentials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Certifications
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Horizontal premium cards highlighting certified qualifications.
            </p>
          </div>

          <div className="grid gap-4 max-w-4xl mx-auto">
            {profile?.certifications?.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-6 rounded-[24px] border backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:border-[#16A34A]/50 ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-800 shadow-md"
                    : "bg-[#F8FAFC] border-[#E5E7EB] hover:bg-white shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  {cert.image ? (
                    <img src={cert.image} alt={cert.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] shrink-0 shadow-sm">
                      <Award className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {cert.name || cert.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#16A34A]">
                      {cert.issuingOrganization || cert.issuer || "Issuing Body"}
                    </div>
                    {cert.description && (
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {cert.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                    isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-[#E5E7EB] text-slate-700 shadow-sm"
                  }`}>
                    {cert.issueDate || cert.date || "2024"}
                  </span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-[#16A34A]/30 text-[#16A34A] hover:bg-[#DCFCE7] transition-colors"
                      title="Verify Credential"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
            {(!profile?.certifications || profile.certifications.length === 0) && (
              <p className="text-center text-xs italic text-slate-500">No certifications listed yet.</p>
            )}
          </div>
        </section>

        {/* RECRUITER CONTACT FORM SECTION */}
        <section id="contact" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#DCFCE7] text-[#16A34A] text-xs font-mono uppercase tracking-widest font-bold">
              <Mail className="w-3.5 h-3.5" /> Direct Contact
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Recruiter Contact Form
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Direct backend dispatch interface to connect with the profile owner instantly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Direct Contact Details */}
            <div
              className={`lg:col-span-5 p-8 rounded-[24px] border backdrop-blur-xl space-y-6 flex flex-col justify-between ${
                isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-[#F8FAFC] border-[#E5E7EB] shadow-md"
              }`}
            >
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Get in touch</h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Interested in discussing potential roles or projects? Fill out the form or reach out directly.
                </p>

                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] shrink-0 shadow-sm">
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
                      <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A] shrink-0 shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Mobile</div>
                        <a href={`tel:${profile.mobileNumber}`} className="text-sm font-bold hover:text-[#16A34A] transition-colors">
                          {profile.mobileNumber}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E5E7EB]/80 dark:border-slate-800">
                <div className="text-xs font-bold mb-3">Quick Share</div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 rounded-2xl border border-[#16A34A]/40 text-[#16A34A] bg-[#DCFCE7]/50 hover:bg-[#DCFCE7] text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Portfolio Link</span>
                </button>
              </div>
            </div>

            {/* Glassmorphic Contact Form */}
            <div
              className={`lg:col-span-7 p-8 rounded-[24px] border backdrop-blur-xl shadow-xl ${
                isDarkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-[#E5E7EB]"
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
                          ? "bg-slate-950 border-slate-800 text-white focus:border-[#16A34A]"
                          : "bg-[#F8FAFC] border-[#E5E7EB] text-[#111827] focus:border-[#16A34A] focus:bg-white"
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
                          ? "bg-slate-950 border-slate-800 text-white focus:border-[#16A34A]"
                          : "bg-[#F8FAFC] border-[#E5E7EB] text-[#111827] focus:border-[#16A34A] focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="Engineering Role Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-[#16A34A]"
                        : "bg-[#F8FAFC] border-[#E5E7EB] text-[#111827] focus:border-[#16A34A] focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hi, I reviewed your portfolio and would like to connect regarding..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-[#16A34A]"
                        : "bg-[#F8FAFC] border-[#E5E7EB] text-[#111827] focus:border-[#16A34A] focus:bg-white"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-[24px] bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-[#15803D] hover:to-[#16A34A] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(22,163,74,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
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
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full border shadow-lg backdrop-blur-xl flex items-center justify-center transition-all ${
              isDarkMode
                ? "bg-slate-900/90 border-slate-800 text-[#22C55E] hover:border-[#22C55E]"
                : "bg-white/95 border-[#E5E7EB] text-[#16A34A] hover:border-[#16A34A] shadow-md"
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
          isDarkMode ? "bg-[#0B0F17]/90 border-slate-800 text-slate-400" : "bg-white/90 border-[#E5E7EB] text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#16A34A] flex items-center justify-center text-white font-extrabold text-xs">
              IE
            </div>
            <span className="font-extrabold text-[#111827] dark:text-white">{profile?.fullName || "Ivory Elite"}</span>
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
              className="text-[#16A34A] hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* RESUME VIEWER MODAL */}
      <AnimatePresence>
        {resumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-2xl p-6 sm:p-8 rounded-[24px] border shadow-2xl space-y-6 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-[#E5E7EB] text-[#111827]"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#16A34A]" />
                  <div>
                    <h3 className="font-bold text-lg">{profile?.fullName || "Candidate"} — Resume</h3>
                    <div className="text-xs text-[#16A34A] font-mono">Recruiter Document Access</div>
                  </div>
                </div>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div className={`p-4 rounded-2xl border space-y-2 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-[#F8FAFC] border-[#E5E7EB]"}`}>
                  <div className="font-bold text-[#16A34A] uppercase tracking-widest text-[10px]">Executive Summary</div>
                  <p>{profile?.summary || "Comprehensive resume details available for official recruiter download."}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-[#F8FAFC] border-[#E5E7EB]"}`}>
                    <span className="font-bold block">Email:</span>
                    <span>{profile?.email || "N/A"}</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-[#F8FAFC] border-[#E5E7EB]"}`}>
                    <span className="font-bold block">Mobile:</span>
                    <span>{profile?.mobileNumber || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={profile?.resumeUrl || profile?.resume || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 rounded-[24px] bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-extrabold text-xs text-center shadow-md hover:opacity-95 transition-opacity"
                >
                  Open / Download PDF Resume
                </a>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="px-6 py-3.5 rounded-[24px] border border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateTwo;
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
  Eye,
  Copy,
  Check,
  MapPin,
  Calendar,
  Code,
  Download,
  Layers,
  ShieldCheck
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateFourteen = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Float UI defaults to crisp atmosphere light theme
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
      const offset = 90;
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
        subject: formData.subject.trim() || `Float UI Message from ${formData.name}`,
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
          proficiency: skill.proficiency || skill.level || 90,
          category: skill.category || "Design & Tech"
        };
      }
      return {
        name: String(skill),
        proficiency: 90,
        category: "Design & Tech"
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
    { id: "hero", label: "Profile", icon: User },
    { id: "skills", label: "Skills", icon: Code },
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
      value: profile?.certifications?.length || 5,
      suffix: "",
      icon: Award
    },
    {
      label: "Profile Views",
      value: profile?.viewsCount || 2890,
      suffix: "+",
      icon: Eye
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-700 overflow-x-hidden selection:bg-[#06B6D4]/30 selection:text-[#06B6D4] ${
        isDarkMode ? "bg-[#070A0F] text-[#F8FAFC]" : "bg-[#F4F6F9] text-[#0F172A]"
      }`}
    >
      {/* Floating Ambient Atmosphere Blur Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-65">
        <div
          className={`absolute top-10 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#06B6D4]/15" : "bg-[#06B6D4]/20"
          }`}
        />
        <div
          className={`absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#6366F1]/15" : "bg-[#6366F1]/20"
          }`}
        />
        <div
          className={`absolute -bottom-20 left-10 w-[500px] h-[500px] rounded-full blur-[170px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#10B981]/15" : "bg-[#10B981]/15"
          }`}
        />
      </div>

      {/* STICKY FLOATING CAPSULE NAVBAR */}
      <header className="sticky top-6 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className={`rounded-full backdrop-blur-2xl border transition-all duration-300 px-6 h-16 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.06)] ${
            isDarkMode
              ? "bg-[#0F172A]/80 border-slate-800/80 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
              : "bg-white/80 border-white/90"
          }`}
        >
          {/* Logo on Left: Float UI Capsule */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#06B6D4] via-[#6366F1] to-[#10B981] p-[2px] shadow-md shadow-[#06B6D4]/20 group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-full flex items-center justify-center font-extrabold text-xs transition-colors ${
                  isDarkMode ? "bg-[#070A0F] text-[#06B6D4]" : "bg-white text-[#6366F1]"
                }`}
              >
                <Layers className="w-4 h-4 animate-bounce" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 font-serif">
                {profile?.fullName || "Float UI"}
                <span className="inline-block w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
              </span>
              <span className="block text-[9px] uppercase font-mono tracking-widest text-[#06B6D4] font-bold">
                Floating Glass UI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 relative ${
                    isActive
                      ? isDarkMode
                        ? "text-[#06B6D4] font-bold"
                        : "text-[#6366F1] font-bold"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFloatNav"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        isDarkMode
                          ? "bg-[#06B6D4]/20 border border-[#06B6D4]/40"
                          : "bg-white border border-[#6366F1]/30 shadow-md"
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
                  ? "bg-[#0F172A] border-slate-800 text-amber-400 hover:border-[#06B6D4]"
                  : "bg-white border-slate-200 text-slate-800 hover:border-[#6366F1]"
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
                  ? "bg-[#0F172A] border-slate-800 text-slate-300 hover:text-[#06B6D4]"
                  : "bg-white border-slate-200 text-slate-800 hover:text-[#6366F1]"
              }`}
              title="Share Portfolio"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-full border transition-colors ${
                isDarkMode ? "bg-[#0F172A] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
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
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mt-3 md:hidden rounded-[28px] border overflow-hidden backdrop-blur-2xl p-4 space-y-2 shadow-2xl ${
                isDarkMode ? "bg-[#0F172A]/95 border-slate-800" : "bg-white/95 border-slate-200"
              }`}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                    activeSection === item.id
                      ? isDarkMode
                        ? "bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 font-bold"
                        : "bg-[#F4F6F9] text-[#6366F1] border border-[#6366F1]/30 font-bold"
                      : isDarkMode
                      ? "text-slate-300 hover:bg-slate-900"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[#06B6D4]" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN FLOATING CARDS CONTAINER (NOTHING TOUCHES EACH OTHER) */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* CARD 1: FLOATING PROFILE CARD (HERO) */}
        <section id="hero" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 sm:p-12 lg:p-14 rounded-[36px] sm:rounded-[40px] border backdrop-blur-2xl transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] ${
              isDarkMode
                ? "bg-[#0F172A]/75 border-slate-800/80 hover:border-[#06B6D4]/40"
                : "bg-white/75 border-white/80 hover:border-[#6366F1]/30"
            }`}
          >
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Floating Capsule Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/40 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-semibold tracking-wide shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Floating Glass UI Architecture</span>
                </div>

                {/* Name & Headline */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                    Hello, I'm{" "}
                    <span className="bg-gradient-to-r from-[#06B6D4] via-[#6366F1] to-[#10B981] bg-clip-text text-transparent">
                      {profile?.fullName || "Float UI"}
                    </span>
                  </h1>
                  <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    {profile?.headline || "Senior Staff Engineer & UI Product Architect"}
                  </h2>
                </div>

                {/* Summary */}
                <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {profile?.summary ||
                    "Crafting isolated, floating glassmorphic interfaces where every section lives in its own levitating capsule, surrounded by generous whitespace, soft drop shadows, and glowing interactions."}
                </p>

                {/* Two Glowing Hover CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  {/* Primary: View Resume */}
                  {profile?.resumeUrl ? (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-[#06B6D4] via-[#6366F1] to-[#10B981] hover:opacity-95 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                    >
                      <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      <span>View Resume</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-[#06B6D4] via-[#6366F1] to-[#10B981] hover:opacity-95 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                    >
                      <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      <span>View Resume</span>
                    </button>
                  )}

                  {/* Secondary: Contact Me */}
                  <button
                    onClick={() => scrollToSection("contact")}
                    className={`px-8 py-4 rounded-full font-extrabold text-sm border backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                      isDarkMode
                        ? "bg-[#070A0F]/80 border-[#06B6D4]/40 text-white hover:border-[#06B6D4] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        : "bg-white/80 border-[#6366F1]/30 text-[#0F172A] hover:border-[#6366F1] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    }`}
                  >
                    <Mail className="w-4 h-4 text-[#06B6D4]" />
                    <span>Contact Me</span>
                  </button>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500">
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-[#06B6D4] transition-colors">
                      <Mail className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile?.mobileNumber && (
                    <a href={`tel:${profile.mobileNumber}`} className="flex items-center gap-2 hover:text-[#06B6D4] transition-colors">
                      <Phone className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>{profile.mobileNumber}</span>
                    </a>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Profile Floating Capsule */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group">
                  {/* Glowing Ambient Glow Ring */}
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#06B6D4] via-[#6366F1] to-[#10B981] opacity-35 blur-2xl group-hover:opacity-60 transition duration-500 animate-pulse" />

                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-[#06B6D4] via-[#6366F1] to-[#10B981] shadow-2xl">
                    <div className="w-full h-full rounded-full p-1 bg-white dark:bg-[#070A0F]">
                      {profile?.pictureUrl || profile?.photo ? (
                        <img
                          src={profile.pictureUrl || profile.photo}
                          alt={profile.fullName || "Profile"}
                          className="w-full h-full rounded-full object-cover shadow-inner"
                        />
                      ) : (
                        <div
                          className={`w-full h-full rounded-full flex flex-col items-center justify-center font-extrabold text-5xl ${
                            isDarkMode ? "bg-[#0F172A] text-[#06B6D4]" : "bg-white text-[#6366F1]"
                          }`}
                        >
                          <span>{profile?.fullName?.[0] || "F"}</span>
                          <span className="text-[10px] font-mono tracking-widest uppercase mt-2 text-[#06B6D4]">FLOAT UI</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Distinction Badge */}
                  <div
                    className={`absolute -bottom-4 right-2 sm:right-6 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-xl flex items-center gap-3 ${
                      isDarkMode ? "bg-[#0F172A]/90 border-slate-800 text-white" : "bg-white/95 border-white text-[#0F172A]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#F4F6F9] dark:bg-slate-900 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold">Floating Capsules</div>
                      <div className="text-[10px] text-[#6366F1] font-mono">Apple Design Inspired</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CARD 2: FLOATING QUICK STATISTICS STRIP */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`p-6 rounded-[32px] border backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] ${
                isDarkMode ? "bg-[#0F172A]/75 border-slate-800/80 hover:border-[#06B6D4]/50" : "bg-white/75 border-white/80 hover:border-[#6366F1]/40"
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F4F6F9] dark:bg-slate-900 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] mb-3">
                <st.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-[#0F172A] dark:text-white mb-1">
                  {st.value}
                  <span className="text-[#6366F1]">{st.suffix}</span>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {st.label}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* CARD 3: FLOATING SKILLS CARD */}
        <section id="skills" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 sm:p-12 rounded-[36px] sm:rounded-[40px] border backdrop-blur-2xl transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] ${
              isDarkMode ? "bg-[#0F172A]/75 border-slate-800/80" : "bg-white/75 border-white/80"
            }`}
          >
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-mono uppercase tracking-widest font-bold">
                <Code className="w-3.5 h-3.5 text-[#06B6D4]" /> Technical Proficiency
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Skills & Capabilities Card
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Interactive skill pills with glowing borders and levitation hover animations.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {normalizedSkills.map((sk, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.06, y: -3 }}
                  className={`px-6 py-3.5 rounded-full border backdrop-blur-xl shadow-sm transition-all duration-300 flex items-center gap-3 cursor-default ${
                    isDarkMode
                      ? "bg-[#070A0F]/80 border-slate-800 text-slate-200 hover:border-[#06B6D4] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                      : "bg-white border-slate-200 text-[#0F172A] hover:border-[#6366F1] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-ping" />
                  <span className="font-bold text-xs sm:text-sm tracking-wide">{sk.name}</span>
                  {sk.proficiency && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#06B6D4]/15 text-[#06B6D4]">
                      {sk.proficiency}%
                    </span>
                  )}
                </motion.div>
              ))}
              {normalizedSkills.length === 0 && (
                <p className="text-xs italic text-slate-500">No skills listed yet.</p>
              )}
            </div>
          </motion.div>
        </section>

        {/* CARD 4: FLOATING EXPERIENCE CARD */}
        <section id="experience" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 sm:p-12 rounded-[36px] sm:rounded-[40px] border backdrop-blur-2xl transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] ${
              isDarkMode ? "bg-[#0F172A]/75 border-slate-800/80" : "bg-white/75 border-white/80"
            }`}
          >
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-mono uppercase tracking-widest font-bold">
                <Briefcase className="w-3.5 h-3.5 text-[#06B6D4]" /> Career Progression
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Experience Timeline Card
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Professional career timeline inside a floating glass container.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {profile?.experience?.map((exp, idx) => (
                <div
                  key={idx}
                  className={`p-7 rounded-[28px] border transition-all duration-300 hover:-translate-y-1 ${
                    isDarkMode ? "bg-[#070A0F]/60 border-slate-800" : "bg-[#F4F6F9] border-slate-200/80 hover:bg-white shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#06B6D4] to-[#6366F1] p-0.5 shadow-md shrink-0">
                        <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#070A0F] flex items-center justify-center text-[#06B6D4] font-bold text-lg">
                          {exp.company?.[0] || "C"}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {exp.position || exp.role || "Software Engineer"}
                        </h3>
                        <div className="text-sm font-semibold text-[#06B6D4] flex items-center gap-2 mt-0.5">
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
                      isDarkMode ? "bg-[#070A0F] border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800 shadow-sm"
                    }`}>
                      <Calendar className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>{exp.startDate || "2023"} - {exp.endDate || "Present"}</span>
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </div>
              ))}
              {(!profile?.experience || profile.experience.length === 0) && (
                <p className="text-center text-xs italic text-slate-500">No experience listed yet.</p>
              )}
            </div>
          </motion.div>
        </section>

        {/* CARD 5: FLOATING EDUCATION CARD */}
        <section id="education" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 sm:p-12 rounded-[36px] sm:rounded-[40px] border backdrop-blur-2xl transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] ${
              isDarkMode ? "bg-[#0F172A]/75 border-slate-800/80" : "bg-white/75 border-white/80"
            }`}
          >
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-mono uppercase tracking-widest font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-[#06B6D4]" /> Academics
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Education Card
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Degrees, fields of study, and academic honors.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {profile?.education?.map((edu, idx) => (
                <div
                  key={idx}
                  className={`p-7 rounded-[28px] border transition-all duration-300 hover:-translate-y-1 ${
                    isDarkMode ? "bg-[#070A0F]/60 border-slate-800" : "bg-[#F4F6F9] border-slate-200/80 hover:bg-white shadow-sm"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#06B6D4] tracking-wider uppercase">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#06B6D4]/10 border-[#06B6D4]/30 text-[#06B6D4]">
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
              ))}
              {(!profile?.education || profile.education.length === 0) && (
                <p className="text-center text-xs italic text-slate-500">No education entries listed.</p>
              )}
            </div>
          </motion.div>
        </section>

        {/* CARD 6: FLOATING PROJECTS CARD */}
        <section id="projects" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 sm:p-12 rounded-[36px] sm:rounded-[40px] border backdrop-blur-2xl transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] ${
              isDarkMode ? "bg-[#0F172A]/75 border-slate-800/80" : "bg-white/75 border-white/80"
            }`}
          >
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-mono uppercase tracking-widest font-bold">
                <FolderGit2 className="w-3.5 h-3.5 text-[#06B6D4]" /> Portfolio Products
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Projects Card Grid
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Visual project cards with screenshots, tech tags, and glowing action buttons.
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
                    whileHover={{ y: -5 }}
                    className={`rounded-[28px] border overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-500 shadow-md ${
                      isDarkMode
                        ? "bg-[#070A0F]/80 border-slate-800 hover:border-[#06B6D4]/50"
                        : "bg-[#F4F6F9] border-slate-200/80 hover:bg-white hover:border-[#6366F1]/40"
                    }`}
                  >
                    <div className="relative h-56 overflow-hidden bg-slate-900">
                      {proj.imageUrl || proj.image ? (
                        <img
                          src={proj.imageUrl || proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#070A0F] via-slate-950 to-indigo-950 flex items-center justify-center p-6 text-center">
                          <Code className="w-12 h-12 text-[#06B6D4]/40 mb-2" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight mb-2">
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
                              className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20"
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
                            className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#6366F1] hover:opacity-95 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
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
          </motion.div>
        </section>

        {/* CARD 7: FLOATING CERTIFICATION CARD */}
        <section id="certifications" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 sm:p-12 rounded-[36px] sm:rounded-[40px] border backdrop-blur-2xl transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] ${
              isDarkMode ? "bg-[#0F172A]/75 border-slate-800/80" : "bg-white/75 border-white/80"
            }`}
          >
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-mono uppercase tracking-widest font-bold">
                <Award className="w-3.5 h-3.5 text-[#06B6D4]" /> Credentials
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Certification Card
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Verified certifications and professional honors.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {profile?.certifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-[28px] border transition-all duration-300 hover:-translate-y-1 ${
                    isDarkMode ? "bg-[#070A0F]/60 border-slate-800" : "bg-[#F4F6F9] border-slate-200/80 hover:bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#06B6D4]">
                      {cert.issueDate || cert.date || "2024"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold tracking-tight mb-1">
                    {cert.name || cert.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#6366F1] mb-2">
                    {cert.issuingOrganization || cert.issuer || "Issuing Body"}
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#06B6D4] hover:underline pt-2"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
              {(!profile?.certifications || profile.certifications.length === 0) && (
                <p className="text-center text-xs italic text-slate-500 col-span-full">No certifications listed yet.</p>
              )}
            </div>
          </motion.div>
        </section>

        {/* CARD 8: FLOATING CONTACT CARD */}
        <section id="contact" className="scroll-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 sm:p-12 rounded-[36px] sm:rounded-[40px] border backdrop-blur-2xl transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] ${
              isDarkMode ? "bg-[#0F172A]/75 border-slate-800/80" : "bg-white/75 border-white/80"
            }`}
          >
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-mono uppercase tracking-widest font-bold">
                <Mail className="w-3.5 h-3.5 text-[#06B6D4]" /> Direct Contact
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Recruiter Contact Card
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Direct glassmorphic contact form connected to backend dispatch.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
              {/* Direct Info */}
              <div
                className={`lg:col-span-5 p-7 rounded-[28px] border backdrop-blur-xl space-y-6 flex flex-col justify-between ${
                  isDarkMode ? "bg-[#070A0F]/60 border-slate-800" : "bg-[#F4F6F9] border-slate-200/80"
                }`}
              >
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight mb-2">Connect Directly</h3>
                  <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Interested in discussing full-time roles, software architecture contracts, or executive leadership opportunities?
                  </p>

                  <div className="space-y-4">
                    {profile?.email && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Email</div>
                          <a href={`mailto:${profile.email}`} className="text-sm font-bold hover:text-[#06B6D4] transition-colors">
                            {profile.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile?.mobileNumber && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Mobile</div>
                          <a href={`tel:${profile.mobileNumber}`} className="text-sm font-bold hover:text-[#06B6D4] transition-colors">
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
                    className="w-full py-3 px-4 rounded-full border border-[#06B6D4]/40 text-[#06B6D4] bg-white dark:bg-[#070A0F] text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-[#06B6D4]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Portfolio Link</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div
                className={`lg:col-span-7 p-7 rounded-[28px] border backdrop-blur-xl shadow-xl ${
                  isDarkMode ? "bg-[#070A0F]/80 border-slate-800" : "bg-white border-slate-200/80"
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
                            ? "bg-[#0F172A] border-slate-800 text-white focus:border-[#06B6D4]"
                            : "bg-[#F4F6F9] border-slate-200 text-[#0F172A] focus:border-[#6366F1] focus:bg-white"
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
                            ? "bg-[#0F172A] border-slate-800 text-white focus:border-[#06B6D4]"
                            : "bg-[#F4F6F9] border-slate-200 text-[#0F172A] focus:border-[#6366F1] focus:bg-white"
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
                          ? "bg-[#0F172A] border-slate-800 text-white focus:border-[#06B6D4]"
                          : "bg-[#F4F6F9] border-slate-200 text-[#0F172A] focus:border-[#6366F1] focus:bg-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Hi, I reviewed your Float UI portfolio and would like to connect..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                        isDarkMode
                          ? "bg-[#0F172A] border-slate-800 text-white focus:border-[#06B6D4]"
                          : "bg-[#F4F6F9] border-slate-200 text-[#0F172A] focus:border-[#6366F1] focus:bg-white"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#6366F1] hover:opacity-95 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          </motion.div>
        </section>
      </main>

      {/* FLOATING CIRCULAR SOCIAL MEDIA DOCK */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {profile?.socialMediaLinks?.map((soc, idx) => (
          <motion.a
            key={idx}
            href={soc.url || soc.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full border shadow-xl backdrop-blur-2xl flex items-center justify-center transition-all ${
              isDarkMode
                ? "bg-[#0F172A]/90 border-slate-800 text-[#06B6D4] hover:border-[#06B6D4] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "bg-white/95 border-white text-[#6366F1] hover:border-[#6366F1] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] shadow-md"
            }`}
            title={soc.platform}
          >
            {renderSocialIcon(soc.platform)}
          </motion.a>
        ))}
      </div>

      {/* FLOATING FOOTER CARD */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div
          className={`rounded-full backdrop-blur-2xl border transition-all duration-300 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold shadow-lg ${
            isDarkMode ? "bg-[#0F172A]/80 border-slate-800/80 text-slate-400" : "bg-white/80 border-white/90 text-slate-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#06B6D4] flex items-center justify-center text-white font-extrabold text-xs">
              FL
            </div>
            <span className="font-extrabold text-[#0F172A] dark:text-white">{profile?.fullName || "Float UI"}</span>
            <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-[#06B6D4] transition-colors">
                {profile.email}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[#06B6D4] hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateFourteen;

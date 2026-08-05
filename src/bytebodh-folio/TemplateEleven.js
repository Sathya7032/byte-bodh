import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Mail,
  ArrowUpRight,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Send,
  Copy,
  Check,
  Code,
  Star,
  Compass,
  Trophy,
  Building
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateEleven = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Journey defaults to clean light porcelain theme
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
      const sections = ["hero", "education", "internships", "experience", "projects", "achievements", "certifications", "contact"];
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
      const offset = 70;
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
        subject: formData.subject.trim() || `Journey Portfolio Inquiry from ${formData.name}`,
        message: formData.message.trim()
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("✨ Journey message sent successfully! I will get back to you soon.");
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



  // Extract Internships vs Full-time Experience if specified
  const internships = useMemo(() => {
    if (!profile?.experience) return [];
    return profile.experience.filter((exp) => {
      const pos = (exp.position || exp.role || "").toLowerCase();
      const desc = (exp.description || "").toLowerCase();
      return pos.includes("intern") || pos.includes("trainee") || desc.includes("intern");
    });
  }, [profile?.experience]);

  const fulltimeExperience = useMemo(() => {
    if (!profile?.experience) return [];
    const filtered = profile.experience.filter((exp) => {
      const pos = (exp.position || exp.role || "").toLowerCase();
      const desc = (exp.description || "").toLowerCase();
      return !pos.includes("intern") && !pos.includes("trainee") && !desc.includes("intern");
    });
    // Fallback if filter leaves empty list but profile.experience has items
    return filtered.length > 0 ? filtered : profile.experience;
  }, [profile?.experience]);

  // Social Icon Helper
  const renderSocialIcon = (platform, className = "w-5 h-5") => {
    const p = (platform || "").toUpperCase();
    if (p.includes("LINKEDIN")) return <Linkedin className={className} />;
    if (p.includes("GITHUB")) return <Github className={className} />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className={className} />;
    return <Globe className={className} />;
  };

  // Nav Items Configuration (Chronological Storytelling Flow)
  const navItems = [
    { id: "hero", label: "01. Origin", icon: User },
    { id: "education", label: "02. Education", icon: GraduationCap },
    { id: "internships", label: "03. Internships", icon: Building },
    { id: "experience", label: "04. Experience", icon: Briefcase },
    { id: "projects", label: "05. Projects", icon: FolderGit2 },
    { id: "achievements", label: "06. Achievements", icon: Trophy },
    { id: "certifications", label: "07. Credentials", icon: Award },
    { id: "contact", label: "08. Next Chapter", icon: Mail }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-600 ${
        isDarkMode ? "bg-[#0A0D14] text-[#F8FAFC]" : "bg-[#FAFAFD] text-[#0F172A]"
      }`}
    >
      {/* Background Soft Mesh Ambient Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-indigo-950/20" : "bg-indigo-100/60"
          }`}
        />
        <div
          className={`absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[160px] transition-colors duration-700 ${
            isDarkMode ? "bg-purple-950/20" : "bg-purple-100/50"
          }`}
        />
        <div
          className={`absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] transition-colors duration-700 ${
            isDarkMode ? "bg-pink-950/15" : "bg-pink-100/40"
          }`}
        />
      </div>

      {/* STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
          isDarkMode
            ? "bg-[#0A0D14]/85 border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/85 border-indigo-100/80 shadow-[0_4px_20px_rgba(79,70,229,0.04)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo on Left */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-sm transition-colors ${
                  isDarkMode ? "bg-[#0A0D14] text-indigo-400" : "bg-white text-indigo-600"
                }`}
              >
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                {profile?.fullName || "Career Journey"}
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-indigo-500 font-bold">
                Storytelling Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Chapter Flow) */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-lg ${
              isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-indigo-50/60 border-indigo-100"
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 relative ${
                    isActive
                      ? isDarkMode
                        ? "text-indigo-400 font-bold"
                        : "text-indigo-600 font-bold"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeJourneyNav"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        isDarkMode
                          ? "bg-indigo-950/60 border border-indigo-800"
                          : "bg-white border border-indigo-200"
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
              className={`p-2.5 rounded-2xl border transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                  : "bg-white border-indigo-100 text-slate-700 hover:bg-indigo-50"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Share Link */}
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-2xl border transition-all duration-300 shadow-sm hidden sm:flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-indigo-400"
                  : "bg-white border-indigo-100 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
              title="Share Journey"
            >
              {copiedLink ? <Check className="w-4 h-4 text-indigo-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-2xl border transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-indigo-100 text-slate-800"
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
              className={`lg:hidden border-b overflow-hidden backdrop-blur-2xl ${
                isDarkMode ? "bg-[#0A0D14]/95 border-slate-800" : "bg-white/95 border-indigo-100"
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
                          ? "bg-indigo-950/40 text-indigo-400 border border-indigo-800"
                          : "bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-indigo-500" />
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

      {/* CONTINUOUS STORYTELLING TIMELINE WRAPPER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Continuous Vertical Timeline Spine */}
        <div className="absolute left-6 sm:left-10 top-24 bottom-24 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 via-pink-500 to-emerald-500 rounded-full opacity-30 dark:opacity-40" />

        <main className="space-y-32">
          
          {/* CHAPTER 01: HERO / THE ORIGIN */}
          <section id="hero" className="scroll-mt-28 relative pl-12 sm:pl-20">
            {/* Timeline Chapter Node Marker */}
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`p-8 sm:p-12 rounded-3xl border backdrop-blur-xl shadow-xl transition-all duration-300 ${
                isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100/80 shadow-[0_10px_30px_rgba(79,70,229,0.06)]"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Floating Profile Image */}
                <div className="relative group shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-2xl">
                    {profile?.pictureUrl || profile?.photo ? (
                      <img
                        src={profile.pictureUrl || profile.photo}
                        alt={profile.fullName || "Profile"}
                        className="w-full h-full rounded-full object-cover shadow-inner"
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-extrabold ${
                          isDarkMode ? "bg-slate-900 text-indigo-400" : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {profile?.fullName?.[0] || "J"}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-mono font-bold shadow-md">
                    CH. 01
                  </div>
                </div>

                {/* Hero Brief */}
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> Chapter 01 • The Origin
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    {profile?.fullName || "Career Journey"}
                  </h1>

                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {profile?.headline || "Software Engineer & Product Innovator"}
                  </h2>

                  <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {profile?.summary ||
                      "Welcome to my career journey. Explore every milestone, academic foundation, internship, professional role, and project built along the timeline."}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                    <button
                      onClick={() => scrollToSection("education")}
                      className="px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Begin Journey Timeline</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className={`px-7 py-3.5 rounded-full font-extrabold text-xs border transition-all shadow-sm cursor-pointer ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-600"
                          : "bg-white border-indigo-200 text-slate-800 hover:bg-indigo-50"
                      }`}
                    >
                      <span>Contact Candidate</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* CHAPTER 02: EDUCATION */}
          <section id="education" className="scroll-mt-28 relative pl-12 sm:pl-20 space-y-6">
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center font-bold text-xs">
              02
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-500">Chapter 02</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <GraduationCap className="w-7 h-7 text-indigo-600" />
                <span>Academic Foundation</span>
              </h2>
            </div>

            <div className="space-y-6">
              {profile?.education?.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`p-7 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 ${
                    isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold tracking-tight mb-1">
                    {edu.degree}
                  </h3>
                  <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    {edu.institution} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                  </div>

                  {edu.description && (
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {edu.description}
                    </p>
                  )}
                </motion.div>
              ))}
              {(!profile?.education || profile.education.length === 0) && (
                <p className="text-xs italic text-slate-500">No education entries listed.</p>
              )}
            </div>
          </section>

          {/* CHAPTER 03: INTERNSHIPS */}
          <section id="internships" className="scroll-mt-28 relative pl-12 sm:pl-20 space-y-6">
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center font-bold text-xs">
              03
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-purple-500">Chapter 03</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <Building className="w-7 h-7 text-purple-600" />
                <span>Internships & Early Steps</span>
              </h2>
            </div>

            <div className="space-y-6">
              {internships.map((intern, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`p-7 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 ${
                    isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">{intern.position || intern.role}</h3>
                      <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {intern.company} {intern.location && `• ${intern.location}`}
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
                      {intern.startDate} - {intern.endDate}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {intern.description}
                  </p>
                </motion.div>
              ))}
              {internships.length === 0 && (
                <div className={`p-6 rounded-3xl border text-xs leading-relaxed ${isDarkMode ? "bg-[#121826]/50 border-slate-800 text-slate-400" : "bg-indigo-50/50 border-indigo-100 text-slate-600"}`}>
                  Early internship experiences integrated within core career experience milestones below.
                </div>
              )}
            </div>
          </section>

          {/* CHAPTER 04: EXPERIENCE */}
          <section id="experience" className="scroll-mt-28 relative pl-12 sm:pl-20 space-y-6">
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-pink-600 text-white shadow-lg flex items-center justify-center font-bold text-xs">
              04
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-pink-500">Chapter 04</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-pink-600" />
                <span>Professional Milestones</span>
              </h2>
            </div>

            <div className="space-y-6">
              {fulltimeExperience.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`p-7 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-pink-500/40 ${
                    isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-md">
                        {exp.company?.[0] || "C"}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight">
                          {exp.position || exp.role || "Software Engineer"}
                        </h3>
                        <div className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800 self-start sm:self-auto">
                      {exp.startDate || "2022"} - {exp.endDate || "Present"}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </motion.div>
              ))}
              {fulltimeExperience.length === 0 && (
                <p className="text-xs italic text-slate-500">No work experience entries listed.</p>
              )}
            </div>
          </section>

          {/* CHAPTER 05: PROJECTS */}
          <section id="projects" className="scroll-mt-28 relative pl-12 sm:pl-20 space-y-6">
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-rose-600 text-white shadow-lg flex items-center justify-center font-bold text-xs">
              05
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-rose-500">Chapter 05</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <FolderGit2 className="w-7 h-7 text-rose-600" />
                <span>Featured Projects Built</span>
              </h2>
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
                    className={`rounded-3xl border overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group ${
                      isDarkMode ? "bg-[#121826]/80 border-slate-800 hover:border-rose-500/50 shadow-xl" : "bg-white/90 border-indigo-100 hover:border-rose-300 shadow-sm hover:shadow-xl"
                    }`}
                  >
                    <div className="relative h-52 overflow-hidden bg-slate-900">
                      {proj.imageUrl || proj.image ? (
                        <img
                          src={proj.imageUrl || proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-950 to-indigo-950 flex items-center justify-center p-6 text-center">
                          <Code className="w-12 h-12 text-indigo-500/40 mb-2 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
                              className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
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
                            className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
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

          {/* CHAPTER 06: ACHIEVEMENTS */}
          <section id="achievements" className="scroll-mt-28 relative pl-12 sm:pl-20 space-y-6">
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-amber-500 text-white shadow-lg flex items-center justify-center font-bold text-xs">
              06
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-500">Chapter 06</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-500" />
                <span>Achievements & Recognitions</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 rounded-3xl border backdrop-blur-xl space-y-2 ${
                  isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100 shadow-sm"
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">Top Performer Recognition</h3>
                <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Awarded for delivering critical microservices refactoring and reducing platform operational latency by 35%.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-3xl border backdrop-blur-xl space-y-2 ${
                  isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100 shadow-sm"
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3 font-bold">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">Hackathon Winner</h3>
                <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  First place out of 40+ teams building an interactive web analytics tool with real-time websocket synchronization.
                </p>
              </motion.div>
            </div>
          </section>

          {/* CHAPTER 07: CERTIFICATIONS */}
          <section id="certifications" className="scroll-mt-28 relative pl-12 sm:pl-20 space-y-6">
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-teal-600 text-white shadow-lg flex items-center justify-center font-bold text-xs">
              07
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-teal-500">Chapter 07</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <Award className="w-7 h-7 text-teal-600" />
                <span>Professional Credentials</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {profile?.certifications?.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between space-y-3 hover:shadow-md transition-all ${
                    isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100 shadow-sm"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold tracking-tight">
                      {cert.name || cert.title}
                    </h3>
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {cert.issuingOrganization || cert.issuer || "Issuing Authority"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {cert.issueDate || cert.date || "2024"}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline text-xs font-bold"
                      >
                        Verify Credential
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
              {(!profile?.certifications || profile.certifications.length === 0) && (
                <p className="text-center text-xs italic text-slate-500 col-span-full">No certifications listed yet.</p>
              )}
            </div>
          </section>

          {/* CHAPTER 08: CONTACT */}
          <section id="contact" className="scroll-mt-28 relative pl-12 sm:pl-20 space-y-6">
            <div className="absolute left-0 sm:left-4 top-1.5 w-9 h-9 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center font-bold text-xs">
              08
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-500">Chapter 08</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <Mail className="w-7 h-7 text-emerald-600" />
                <span>The Next Chapter</span>
              </h2>
            </div>

            <div
              className={`p-8 rounded-3xl border backdrop-blur-xl shadow-xl ${
                isDarkMode ? "bg-[#121826]/80 border-slate-800" : "bg-white/90 border-indigo-100"
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
                          ? "bg-slate-900 border-slate-800 text-white focus:border-indigo-500"
                          : "bg-indigo-50/50 border-indigo-100 text-[#0F172A] focus:border-indigo-500 focus:bg-white"
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
                          ? "bg-slate-900 border-slate-800 text-white focus:border-indigo-500"
                          : "bg-indigo-50/50 border-indigo-100 text-[#0F172A] focus:border-indigo-500 focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="New Opportunities / Career Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:border-indigo-500"
                        : "bg-indigo-50/50 border-indigo-100 text-[#0F172A] focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hi, I explored your career Journey timeline and would like to connect..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:border-indigo-500"
                        : "bg-indigo-50/50 border-indigo-100 text-[#0F172A] focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Dispatching Message...</span>
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
          </section>

        </main>
      </div>

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
                ? "bg-slate-900/90 border-slate-800 text-indigo-400 hover:border-indigo-600"
                : "bg-white/95 border-indigo-100 text-indigo-600 hover:border-indigo-400 shadow-md"
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
          isDarkMode ? "bg-[#0A0D14]/90 border-slate-800 text-slate-400" : "bg-white/90 border-indigo-100 text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
              J
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white">{profile?.fullName || "Journey Portfolio"}</span>
            <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 transition-colors">
                {profile.email}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateEleven;

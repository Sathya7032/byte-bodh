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
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
  Code
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateEighteen = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
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
      const payload = {
        recipientUsername: username,
        receiverId: profile?.user?.id || profile?.userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || `Portfolio Contact from ${formData.name}`,
        message: formData.message.trim()
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("🚀 Message sent successfully! I'll get back to you soon.");
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
          category: skill.category || "Development"
        };
      }
      return {
        name: String(skill),
        proficiency: 85,
        category: "Development"
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

  // Nav Items configuration
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
      value: profile?.projects?.length || 12,
      suffix: "+",
      icon: FolderGit2,
      color: "from-emerald-500 to-teal-400"
    },
    {
      label: "Technical Skills",
      value: normalizedSkills.length || 18,
      suffix: "+",
      icon: Code,
      color: "from-emerald-400 to-cyan-400"
    },
    {
      label: "Certifications",
      value: profile?.certifications?.length || 4,
      suffix: "",
      icon: Award,
      color: "from-teal-400 to-emerald-600"
    },
    {
      label: "Recruiter Views",
      value: profile?.viewsCount || 1480,
      suffix: "+",
      icon: Eye,
      color: "from-emerald-300 to-teal-500"
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300 ${
        isDarkMode ? "bg-[#030712] text-slate-100" : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      {/* Dynamic Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-25 transition-colors duration-700 ${
            isDarkMode ? "bg-emerald-500" : "bg-emerald-300"
          }`}
        />
        <div
          className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-[160px] opacity-20 transition-colors duration-700 ${
            isDarkMode ? "bg-teal-500" : "bg-teal-300"
          }`}
        />
        <div
          className={`absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-[150px] opacity-20 transition-colors duration-700 ${
            isDarkMode ? "bg-emerald-600" : "bg-emerald-200"
          }`}
        />
        {/* Subtle Mesh Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${isDarkMode ? "#10b981" : "#059669"} 1px, transparent 1px)`,
            backgroundSize: "32px 32px"
          }}
        />
      </div>

      {/* STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
          isDarkMode
            ? "bg-[#030712]/80 border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/80 border-slate-200/80 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center font-bold text-sm transition-colors ${
                  isDarkMode ? "bg-slate-950 text-emerald-400" : "bg-white text-emerald-600"
                }`}
              >
                {profile?.fullName
                  ? profile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "EE"}
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                {profile?.fullName || "Emerald Edge"}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className={`block text-[10px] uppercase font-mono tracking-widest ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                Recruiter Ready
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/40 p-1.5 rounded-full border border-slate-800/60 backdrop-blur-lg">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 relative ${
                    isActive
                      ? isDarkMode
                        ? "text-emerald-300 font-bold"
                        : "text-emerald-800 font-bold"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className={`absolute inset-0 rounded-full shadow-md ${
                        isDarkMode
                          ? "bg-emerald-500/20 border border-emerald-500/40"
                          : "bg-emerald-100 border border-emerald-300"
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
              className={`p-2.5 rounded-xl border transition-all duration-300 shadow-sm flex items-center justify-center ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-amber-400/50"
                  : "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Copy Share Link */}
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-xl border transition-all duration-300 shadow-sm hidden sm:flex items-center justify-center ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:text-emerald-600"
              }`}
              title="Share Portfolio Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-xl border transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-slate-100 border-slate-200 text-slate-800"
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
                isDarkMode ? "bg-[#030712]/95 border-slate-800" : "bg-white/95 border-slate-200"
              }`}
            >
              <div className="px-6 py-5 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeSection === item.id
                        ? isDarkMode
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-emerald-500" />
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
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Available for Full-time Roles & Projects</span>
              </div>

              {/* Name & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  Hi, I'm{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    {profile?.fullName || "Emerald Professional"}
                  </span>
                </h1>
                <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {profile?.headline || "Software Engineer & Systems Architect"}
                </h2>
              </div>

              {/* Summary */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                {profile?.summary ||
                  "Passionate software engineering professional dedicated to building scalable web applications, optimizing high-throughput distributed systems, and architecting robust digital products."}
              </p>

              {/* Two CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {/* Primary Button: View Resume */}
                <button
                  onClick={() => setResumeModalOpen(true)}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>View Resume</span>
                </button>

                {/* Secondary Button: Contact Me */}
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-7 py-3.5 rounded-2xl font-bold text-sm border transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-900/80 border-slate-700 text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800"
                      : "bg-white border-slate-300 text-slate-800 hover:border-emerald-500 hover:bg-slate-50"
                  }`}
                >
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span>Contact Me</span>
                </button>
              </div>

              {/* Quick Contact Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-400 font-medium">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile?.mobileNumber && (
                  <a href={`tel:${profile.mobileNumber}`} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{profile.mobileNumber}</span>
                  </a>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Large Circular Profile Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Glowing Outer Ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-75 blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

                {/* Main Circular Image Frame */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2 bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-2xl">
                  {profile?.pictureUrl || profile?.photo ? (
                    <img
                      src={profile.pictureUrl || profile.photo}
                      alt={profile.fullName || "Profile"}
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-full flex flex-col items-center justify-center text-5xl font-extrabold ${
                        isDarkMode ? "bg-slate-950 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <span>{profile?.fullName?.[0] || "E"}</span>
                      <span className="text-xs font-mono tracking-widest uppercase mt-2 text-emerald-500">Emerald</span>
                    </div>
                  )}
                </div>

                {/* Floating Recruiter Badge */}
                <div
                  className={`absolute -bottom-4 right-2 sm:right-6 px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-xl flex items-center gap-3 animate-bounce ${
                    isDarkMode ? "bg-slate-900/90 border-slate-700 text-slate-200" : "bg-white/95 border-slate-200 text-slate-800"
                  }`}
                  style={{ animationDuration: "3s" }}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">Verified Professional</div>
                    <div className="text-[10px] text-emerald-400 font-mono">100% Recruiter Approved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK STATISTICS CARDS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group ${
                isDarkMode
                  ? "bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  : "bg-white/80 border-slate-200/80 hover:border-emerald-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${st.color} text-slate-950 shadow-md`}>
                  <st.icon className="w-5 h-5" />
                </div>
                <Sparkles className="w-4 h-4 text-emerald-500/40 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                {st.value}
                <span className="text-emerald-400">{st.suffix}</span>
              </div>
              <div className={`text-xs font-semibold tracking-wide ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                {st.label}
              </div>
            </motion.div>
          ))}
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <Code className="w-3.5 h-3.5" /> Technical Competencies
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Skills & Expertise
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Core tech stack and engineering capabilities displayed as rounded animated pills.
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
                className={`px-5 py-3 rounded-full border backdrop-blur-xl shadow-md transition-all duration-300 flex items-center gap-3 cursor-default group ${
                  isDarkMode
                    ? "bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 text-slate-200"
                    : "bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-800"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 group-hover:scale-125 transition-transform" />
                <span className="font-semibold text-xs sm:text-sm tracking-wide">{sk.name}</span>
                {sk.proficiency && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {sk.proficiency}%
                  </span>
                )}
              </motion.div>
            ))}
            {normalizedSkills.length === 0 && (
              <p className="text-xs italic text-slate-500">No skills specified yet.</p>
            )}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <Briefcase className="w-3.5 h-3.5" /> Career Highlights
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Work Experience
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Premium company cards highlighting engineering impact and responsibilities.
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
                className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 relative overflow-hidden group ${
                  isDarkMode
                    ? "bg-slate-900/40 border-slate-800/80 shadow-lg"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {/* Accent Top Gradient */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg shrink-0">
                      {exp.company?.[0] || "C"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                        {exp.position || exp.role || "Software Engineer"}
                      </h3>
                      <div className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mt-0.5">
                        <span>{exp.company || "Company"}</span>
                        {exp.location && (
                          <span className={`text-xs font-normal ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                            • {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border shrink-0 ${
                    isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {exp.startDate || "2023"} - {exp.endDate || "Present"}
                    </span>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {exp.description}
                </p>

                {exp.highlights && Array.isArray(exp.highlights) && (
                  <ul className="mt-4 space-y-2">
                    {exp.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
            {(!profile?.experience || profile.experience.length === 0) && (
              <p className="text-center text-xs italic text-slate-500">No work experience listed yet.</p>
            )}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" /> Academic Qualifications
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Education
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Modern vertical timeline representing academic milestones.
            </p>
          </div>

          {/* Modern Vertical Timeline */}
          <div className="relative max-w-3xl mx-auto pl-6 sm:pl-8 border-l-2 border-emerald-500/30 space-y-10 my-6">
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
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.8)] group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>

                <div
                  className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 ${
                    isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        isDarkMode ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
                      }`}>
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1">
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

        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <FolderGit2 className="w-3.5 h-3.5" /> Featured Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Projects Showcase
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Responsive card grid featuring live applications and technical implementations.
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
                  className={`rounded-3xl border overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group ${
                    isDarkMode
                      ? "bg-slate-900/40 border-slate-800/80 hover:border-emerald-500/40 shadow-xl"
                      : "bg-white border-slate-200 hover:border-emerald-300 shadow-md"
                  }`}
                >
                  {/* Project Image Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    {proj.imageUrl || proj.image ? (
                      <img
                        src={proj.imageUrl || proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex items-center justify-center p-6 text-center">
                        <Code className="w-12 h-12 text-emerald-500/40 mb-2 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">
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
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border ${
                              isDarkMode
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                : "bg-emerald-50 border-emerald-200 text-emerald-800"
                            }`}
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Visit Project Button - Rounded Gradient Hover Lift Shadow Arrow Icon */}
                      {(proj.link || proj.projectUrl || proj.githubUrl) && (
                        <a
                          href={proj.link || proj.projectUrl || proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" /> Credentials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Certifications
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Horizontal premium cards highlighting industry recognitions.
            </p>
          </div>

          {/* Horizontal Premium Cards */}
          <div className="grid gap-4 max-w-4xl mx-auto">
            {profile?.certifications?.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:border-emerald-500/40 ${
                  isDarkMode
                    ? "bg-slate-900/40 border-slate-800/80 shadow-md"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  {cert.image ? (
                    <img src={cert.image} alt={cert.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Award className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {cert.name || cert.title}
                    </h3>
                    <div className={`text-xs font-semibold ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
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
                  <span className={`text-xs font-mono font-medium px-3 py-1 rounded-full border ${
                    isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                  }`}>
                    {cert.issueDate || cert.date || "2024"}
                  </span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest">
              <Mail className="w-3.5 h-3.5" /> Get in Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Recruiter Contact Form
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Direct backend message dispatching to get connected instantly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Direct Contact Info */}
            <div
              className={`lg:col-span-5 p-8 rounded-3xl border backdrop-blur-xl space-y-6 flex flex-col justify-between ${
                isDarkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-md"
              }`}
            >
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Let's build something great</h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Whether you have an open position, an exciting contract project, or just want to connect, feel free to send a message!
                </p>

                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500">Email Address</div>
                        <a href={`mailto:${profile.email}`} className="text-sm font-semibold hover:text-emerald-400 transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.mobileNumber && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500">Mobile Phone</div>
                        <a href={`tel:${profile.mobileNumber}`} className="text-sm font-semibold hover:text-emerald-400 transition-colors">
                          {profile.mobileNumber}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60">
                <div className="text-xs font-semibold mb-3">Recruiter Quick Action</div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Portfolio Link</span>
                </button>
              </div>
            </div>

            {/* Glassmorphic Contact Form */}
            <div
              className={`lg:col-span-7 p-8 rounded-3xl border backdrop-blur-xl shadow-xl ${
                isDarkMode ? "bg-slate-900/60 border-slate-800/90" : "bg-white border-slate-200"
              }`}
            >
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                        isDarkMode
                          ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="recruiter@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                        isDarkMode
                          ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="Software Engineer Role Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hi, I noticed your portfolio and would like to discuss..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-emerald-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-slate-950 font-extrabold text-sm shadow-[0_10px_25px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Recruiter Inbox</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING CIRCULAR SOCIAL ICONS DOCK */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {profile?.socialMediaLinks?.map((soc, idx) => (
          <motion.a
            key={idx}
            href={soc.url || soc.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`w-12 h-12 rounded-full border shadow-xl backdrop-blur-xl flex items-center justify-center transition-all ${
              isDarkMode
                ? "bg-slate-900/90 border-slate-800 text-emerald-400 hover:border-emerald-400 hover:bg-slate-800"
                : "bg-white/95 border-slate-200 text-emerald-600 hover:border-emerald-500 shadow-md"
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
          isDarkMode ? "bg-[#030712]/90 border-slate-800/80 text-slate-400" : "bg-white/90 border-slate-200 text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              EE
            </div>
            <span className="font-bold text-slate-200">{profile?.fullName || "Emerald Edge"}</span>
            <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-emerald-400 transition-colors">
                {profile.email}
              </a>
            )}
            {profile?.mobileNumber && (
              <a href={`tel:${profile.mobileNumber}`} className="hover:text-emerald-400 transition-colors">
                {profile.mobileNumber}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* RESUME VIEWER MODAL */}
      <AnimatePresence>
        {resumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-2xl p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-lg">{profile?.fullName || "Candidate"} — Resume</h3>
                    <div className="text-xs text-emerald-400 font-mono">Recruiter Access Document</div>
                  </div>
                </div>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Executive Brief</div>
                  <p>{profile?.summary || "Comprehensive resume details available for recruiter download."}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <span className="font-bold text-white block">Email:</span>
                    <span>{profile?.email || "N/A"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <span className="font-bold text-white block">Phone:</span>
                    <span>{profile?.mobileNumber || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={profile?.resumeUrl || profile?.resume || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs text-center shadow-md hover:opacity-95 transition-opacity"
                >
                  Open / Download Official PDF Resume
                </a>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-slate-700 text-xs font-semibold hover:bg-slate-800"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateEighteen;

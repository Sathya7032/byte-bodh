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
  Code,
  Grid
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateTen = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Bento Pro defaults to clean light theme
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
        subject: formData.subject.trim() || `Bento Pro Inquiry from ${formData.name}`,
        message: formData.message.trim()
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("⚡ Message delivered successfully! I will respond promptly.");
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

  // Nav Items Configuration
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
      value: profile?.projects?.length || 14,
      suffix: "+",
      icon: FolderGit2
    },
    {
      label: "Technical Skills",
      value: normalizedSkills.length || 20,
      suffix: "+",
      icon: Code
    },
    {
      label: "Certifications",
      value: profile?.certifications?.length || 4,
      suffix: "",
      icon: Award
    },
    {
      label: "Recruiter Views",
      value: profile?.viewsCount || 1890,
      suffix: "+",
      icon: Eye
    }
  ];

  // Color chips for skills (No card gradient, solid chips only)
  const chipColors = [
    "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 ${
        isDarkMode ? "bg-[#0B0F17] text-[#F9FAFB]" : "bg-[#F8FAFC] text-[#0F172A]"
      }`}
    >
      {/* Dynamic Background Noise / Subtle Dot Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${isDarkMode ? "#334155" : "#CBD5E1"} 1px, transparent 1px)`,
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      {/* STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
          isDarkMode
            ? "bg-[#0B0F17]/85 border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/85 border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center font-extrabold text-sm text-white dark:text-slate-900 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                {profile?.fullName || "Bento Pro"}
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500">
                Bento Grid Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-lg ${
              isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-100/80 border-slate-200"
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
                        ? "text-white font-bold"
                        : "text-slate-900 font-bold"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBentoNav"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        isDarkMode
                          ? "bg-slate-800 border border-slate-700"
                          : "bg-white border border-slate-200"
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
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-white"
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
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-white"
              }`}
              title="Share Portfolio"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-2xl border transition-colors ${
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
                isDarkMode ? "bg-[#0B0F17]/95 border-slate-800" : "bg-white/95 border-slate-200"
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
                          ? "bg-slate-800 text-white border border-slate-700 font-bold"
                          : "bg-slate-100 text-slate-900 border border-slate-300 font-bold"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
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

      {/* BENTO GRID HOMEPAGE LAYOUT */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-8">
        
        {/* ROW 1 BENTO GRID: HERO CARD (Large) + QUICK STATS */}
        <section id="hero" className="scroll-mt-28">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Bento Card 1: HERO CARD (Span 12 on mobile, Span 8 on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`col-span-12 lg:col-span-8 p-8 sm:p-10 rounded-[28px] border backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-300 ${
                isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
              }`}
            >
              <div className="space-y-6">
                {/* Header Status Chip */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Available for Senior Engineering Roles & Consultations</span>
                </div>

                {/* Avatar + Name + Headline */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Circular Profile Photo */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 border-2 border-slate-200 dark:border-slate-700 shadow-md">
                      {profile?.pictureUrl || profile?.photo ? (
                        <img
                          src={profile.pictureUrl || profile.photo}
                          alt={profile.fullName || "Profile"}
                          className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-extrabold ${
                            isDarkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          {profile?.fullName?.[0] || "B"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                      {profile?.fullName || "Bento Product Leader"}
                    </h1>
                    <p className="text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-400 mt-1">
                      {profile?.headline || "Senior Staff Product Engineer & Architect"}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {profile?.summary ||
                    "Designing and engineering high-impact digital applications inspired by Apple, Notion, and Linear. Focused on building elegant systems, intuitive product layouts, and performant user experiences."}
                </p>
              </div>

              {/* Two CTA Buttons (Only CTAs have gradient fills as requested) */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Primary CTA: View Projects */}
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-blue-600 dark:from-white dark:to-slate-200 dark:hover:from-slate-200 dark:hover:to-blue-400 text-white dark:text-slate-900 font-extrabold text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>View Projects</span>
                </button>

                {/* Secondary CTA: Contact Me */}
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-7 py-3.5 rounded-full font-extrabold text-xs border transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </button>
              </div>
            </motion.div>

            {/* Bento Card 2: QUICK STATS STRIP (Span 12 on mobile, Span 4 on desktop) */}
            <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
              {stats.map((st, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                  className={`p-6 rounded-[28px] border backdrop-blur-xl flex flex-col justify-between hover:shadow-lg transition-all duration-300 ${
                    isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 mb-4">
                    <st.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold tracking-tight mb-1">
                      {st.value}
                      <span className="text-blue-600 dark:text-blue-400">{st.suffix}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      {st.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ROW 2 BENTO GRID: SKILLS (Span 8) + EDUCATION MINI TIMELINE (Span 4) */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Bento Card: COLORFUL TECHNOLOGY CHIPS SKILLS (Span 12 on mobile, Span 8 on desktop) */}
          <motion.div
            id="skills"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`col-span-12 lg:col-span-8 p-8 rounded-[28px] border backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-6 ${
              isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Skills & Tech Stack</h2>
                  <p className="text-xs text-slate-500">Colorful technology chips</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                {normalizedSkills.length} Techs
              </span>
            </div>

            {/* Colorful Technology Chips */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {normalizedSkills.map((sk, idx) => {
                const chipStyle = chipColors[idx % chipColors.length];
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`px-4 py-2.5 rounded-full border text-xs font-bold font-mono tracking-wide transition-all shadow-sm cursor-default flex items-center gap-2 ${chipStyle}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current opacity-75" />
                    <span>{sk.name}</span>
                    {sk.proficiency && (
                      <span className="opacity-60 text-[10px]">({sk.proficiency}%)</span>
                    )}
                  </motion.div>
                );
              })}
              {normalizedSkills.length === 0 && (
                <p className="text-xs italic text-slate-500">No skills listed yet.</p>
              )}
            </div>
          </motion.div>

          {/* Bento Card: EDUCATION VERTICAL MINI TIMELINE (Span 12 on mobile, Span 4 on desktop) */}
          <motion.div
            id="education"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`col-span-12 lg:col-span-4 p-8 rounded-[28px] border backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-6 ${
              isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Education</h2>
                <p className="text-xs text-slate-500">Vertical mini timeline</p>
              </div>
            </div>

            {/* Vertical Mini Timeline */}
            <div className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-800 space-y-6 pt-1">
              {profile?.education?.map((edu, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 dark:bg-white border-2 border-white dark:border-slate-900 shadow-sm group-hover:scale-125 transition-transform" />
                  
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </div>
                    <h3 className="text-sm font-extrabold tracking-tight">
                      {edu.degree}
                    </h3>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {edu.institution} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                    </div>
                    {edu.gpa && (
                      <div className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 mt-1">
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {(!profile?.education || profile.education.length === 0) && (
                <p className="text-xs italic text-slate-500">No education entries listed.</p>
              )}
            </div>
          </motion.div>

        </div>

        {/* ROW 3 BENTO GRID: WORK EXPERIENCE (Modern Company Cards - Span 12) */}
        <section id="experience" className="scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 rounded-[28px] border backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-6 ${
              isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Work Experience</h2>
                  <p className="text-xs text-slate-500">Modern company cards</p>
                </div>
              </div>
            </div>

            {/* Modern Company Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {profile?.experience?.map((exp, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600 ${
                    isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-[#F8FAFC] border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm">
                        {exp.company?.[0] || "C"}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold tracking-tight">
                          {exp.position || exp.role || "Software Engineer"}
                        </h3>
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </div>
              ))}
              {(!profile?.experience || profile.experience.length === 0) && (
                <p className="text-xs italic text-slate-500 col-span-full">No work experience listed yet.</p>
              )}
            </div>
          </motion.div>
        </section>

        {/* ROW 4 BENTO GRID: PROJECTS (Large Visual Cards with Floating Tech Badges - Span 12) */}
        <section id="projects" className="scroll-mt-28 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Projects Showcase</h2>
                <p className="text-xs text-slate-500">Large visual cards with floating technology badges</p>
              </div>
            </div>
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
                  className={`rounded-[28px] border overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group ${
                    isDarkMode ? "bg-[#111827] border-slate-800 hover:border-slate-700 shadow-xl" : "bg-white border-slate-200 hover:shadow-xl shadow-sm"
                  }`}
                >
                  {/* Visual Screenshot with Floating Tech Badges */}
                  <div className="relative h-60 overflow-hidden bg-slate-900">
                    {proj.imageUrl || proj.image ? (
                      <img
                        src={proj.imageUrl || proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center p-6 text-center">
                        <Code className="w-12 h-12 text-slate-700 mb-2 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                    {/* Floating Technology Badges on Image */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {techList.slice(0, 3).map((t, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 text-white border border-slate-700 backdrop-blur-md shadow-md"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {proj.title}
                      </h3>
                      <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {proj.description}
                      </p>
                    </div>

                    {(proj.link || proj.projectUrl || proj.githubUrl) && (
                      <a
                        href={proj.link || proj.projectUrl || proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-blue-600 dark:from-white dark:to-slate-200 dark:hover:from-slate-200 dark:hover:to-blue-400 text-white dark:text-slate-900 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                      >
                        <span>Visit Project</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {(!profile?.projects || profile.projects.length === 0) && (
              <p className="text-center text-xs italic text-slate-500 col-span-full">No projects listed yet.</p>
            )}
          </div>
        </section>

        {/* ROW 5 BENTO GRID: CERTIFICATIONS (Compact Cards - Span 12) */}
        <section id="certifications" className="scroll-mt-28 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Certifications</h2>
              <p className="text-xs text-slate-500">Compact Bento cards</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile?.certifications?.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-6 rounded-[28px] border backdrop-blur-xl flex flex-col justify-between space-y-3 hover:shadow-lg transition-all ${
                  isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>

                  <h3 className="text-sm font-bold tracking-tight leading-snug">
                    {cert.name || cert.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-500">
                    {cert.issuingOrganization || cert.issuer || "Issuing Body"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {cert.issueDate || cert.date || "2024"}
                  </span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
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

        {/* ROW 6 BENTO GRID: RECRUITER CONTACT FORM */}
        <section id="contact" className="scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`p-8 sm:p-10 rounded-[28px] border backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300 ${
              isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Direct Info */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Recruiter Contact</h2>
                  </div>

                  <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Send a direct message regarding full-time engineering roles, design consultations, or project engagements.
                  </p>

                  <div className="space-y-4 text-xs">
                    {profile?.email && (
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-400">Email</div>
                          <a href={`mailto:${profile.email}`} className="font-bold hover:underline">
                            {profile.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile?.mobileNumber && (
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-slate-200 shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-400">Mobile</div>
                          <a href={`tel:${profile.mobileNumber}`} className="font-bold hover:underline">
                            {profile.mobileNumber}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-3 px-4 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Portfolio Link</span>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-7">
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
                            ? "bg-slate-950 border-slate-800 text-white focus:border-slate-600"
                            : "bg-[#F8FAFC] border-slate-200 text-[#0F172A] focus:border-slate-400 focus:bg-white"
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
                            ? "bg-slate-950 border-slate-800 text-white focus:border-slate-600"
                            : "bg-[#F8FAFC] border-slate-200 text-[#0F172A] focus:border-slate-400 focus:bg-white"
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
                          ? "bg-slate-950 border-slate-800 text-white focus:border-slate-600"
                          : "bg-[#F8FAFC] border-slate-200 text-[#0F172A] focus:border-slate-400 focus:bg-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Hi, I reviewed your Bento Pro portfolio and would like to connect..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                        isDarkMode
                          ? "bg-slate-950 border-slate-800 text-white focus:border-slate-600"
                          : "bg-[#F8FAFC] border-slate-200 text-[#0F172A] focus:border-slate-400 focus:bg-white"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-blue-600 dark:from-white dark:to-slate-200 dark:hover:from-slate-200 dark:hover:to-blue-400 text-white dark:text-slate-900 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
                ? "bg-slate-900/90 border-slate-800 text-white hover:border-slate-600"
                : "bg-white/95 border-slate-200 text-slate-900 hover:border-slate-400 shadow-md"
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
          isDarkMode ? "bg-[#0B0F17]/90 border-slate-800 text-slate-400" : "bg-white/90 border-slate-200 text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-extrabold text-xs">
              BP
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white">{profile?.fullName || "Bento Pro"}</span>
            <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:underline transition-colors">
                {profile.email}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-slate-900 dark:text-white hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateTen;

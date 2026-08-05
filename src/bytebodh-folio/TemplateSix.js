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
  Code
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateSix = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Coral Studio defaults to clean white light theme
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
      const sections = ["hero", "projects", "skills", "experience", "education", "certifications", "contact"];
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
        subject: formData.subject.trim() || `Coral Studio Inquiry from ${formData.name}`,
        message: formData.message.trim()
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("✨ Message sent successfully! I'll get back to you soon.");
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
          category: skill.category || "Design & Tech"
        };
      }
      return {
        name: String(skill),
        proficiency: 85,
        category: "Design & Tech"
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
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "contact", label: "Contact", icon: Mail }
  ];

  // Skill badge color palette rotation
  const badgeColors = [
    "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
    "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
    "bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]",
    "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400"
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#F97316]/20 selection:text-[#F97316] ${
        isDarkMode ? "bg-[#0F172A] text-[#F8FAFC]" : "bg-[#FFFFFF] text-[#1F2937]"
      }`}
    >
      {/* Abstract Background Blobs (Framer/Stripe style) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        <div
          className={`absolute -top-32 left-1/3 w-[550px] h-[550px] rounded-full blur-[170px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#F97316]/15" : "bg-[#FED7AA]/60"
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full blur-[160px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#FB923C]/10" : "bg-[#FFEDD5]/70"
          }`}
        />
        <div
          className={`absolute -bottom-40 left-10 w-[400px] h-[400px] rounded-full blur-[150px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#F97316]/10" : "bg-[#FED7AA]/50"
          }`}
        />
      </div>

      {/* STICKY NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 border-b ${
          isDarkMode
            ? "bg-[#0F172A]/85 border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            : "bg-white/85 border-[#FED7AA] shadow-[0_4px_20px_rgba(249,115,22,0.06)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F97316] to-[#FB923C] p-[2px] shadow-md shadow-[#F97316]/20 group-hover:scale-105 transition-transform duration-300">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-sm transition-colors ${
                  isDarkMode ? "bg-[#0F172A] text-[#FB923C]" : "bg-white text-[#F97316]"
                }`}
              >
                {profile?.fullName
                  ? profile.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "CS"}
              </div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5">
                {profile?.fullName || "Coral Studio"}
                <span className="inline-block w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              </span>
              <span className={`block text-[10px] uppercase font-mono tracking-widest ${isDarkMode ? "text-[#FB923C]" : "text-[#F97316]"}`}>
                Creative Portfolio
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-lg ${
              isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-[#FFF7F5] border-[#FED7AA]"
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
                        ? "text-[#FB923C] font-bold"
                        : "text-[#F97316] font-bold"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCoralNav"
                      className={`absolute inset-0 rounded-full shadow-sm ${
                        isDarkMode
                          ? "bg-[#F97316]/20 border border-[#F97316]/40"
                          : "bg-white border border-[#F97316]/30"
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
                  : "bg-[#FFF7F5] border-[#FED7AA] text-slate-700 hover:bg-white"
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
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-[#FB923C]"
                  : "bg-[#FFF7F5] border-[#FED7AA] text-slate-700 hover:text-[#F97316] hover:bg-white"
              }`}
              title="Share Portfolio"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#F97316]" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-2xl border transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-[#FFF7F5] border-[#FED7AA] text-slate-800"
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
                isDarkMode ? "bg-[#0F172A]/95 border-slate-800" : "bg-white/95 border-[#FED7AA]"
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
                          ? "bg-[#F97316]/20 text-[#FB923C] border border-[#F97316]/40"
                          : "bg-[#FFF7F5] text-[#F97316] border border-[#F97316]/30 font-bold"
                        : isDarkMode
                        ? "text-slate-300 hover:bg-slate-900"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#F97316]" />
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
        {/* HERO SECTION WITH ABSTRACT SHAPES */}
        <section id="hero" className="pt-6 lg:pt-12 scroll-mt-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Brief */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Creative Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#FFF7F5] text-[#F97316] text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Creative Studio • Available for Projects</span>
              </div>

              {/* Name & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                  Creative design & code by{" "}
                  <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-amber-500 bg-clip-text text-transparent">
                    {profile?.fullName || "Coral Creator"}
                  </span>
                </h1>
                <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDarkMode ? "text-slate-300" : "text-[#1F2937]/80"}`}>
                  {profile?.headline || "Senior Digital Product Designer & Developer"}
                </h2>
              </div>

              {/* Summary */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                {profile?.summary ||
                  "Crafting award-winning web applications, interactive visual identities, and seamless digital product experiences with pixel precision."}
              </p>

              {/* Two CTA Buttons: Explore Projects & Hire Me */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {/* Primary CTA: Explore Projects */}
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA580C] hover:to-[#F97316] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                >
                  <FolderGit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Explore Projects</span>
                </button>

                {/* Secondary CTA: Hire Me */}
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-8 py-4 rounded-full font-extrabold text-sm border transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 text-slate-200 hover:border-[#F97316]"
                      : "bg-[#FFF7F5] border-[#FED7AA] text-[#1F2937] hover:border-[#F97316] hover:bg-white"
                  }`}
                >
                  <Mail className="w-4 h-4 text-[#F97316]" />
                  <span>Hire Me</span>
                </button>
              </div>

              {/* Quick Contact Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-[#F97316] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile?.mobileNumber && (
                  <a href={`tel:${profile.mobileNumber}`} className="flex items-center gap-2 hover:text-[#F97316] transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{profile.mobileNumber}</span>
                  </a>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Floating Profile Image with Abstract Shapes */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Framer/Stripe Abstract Geometric Shapes & SVGs */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-2 border-dashed border-[#F97316]/30 pointer-events-none"
                />

                <motion.div
                  animate={{ y: [0, -12, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-8 w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#FB923C]/30 to-[#F97316]/20 blur-xl pointer-events-none"
                />

                {/* Main Floating Profile Circle */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-3 bg-gradient-to-tr from-[#F97316] via-[#FB923C] to-amber-400 shadow-2xl"
                >
                  {profile?.pictureUrl || profile?.photo ? (
                    <img
                      src={profile.pictureUrl || profile.photo}
                      alt={profile.fullName || "Profile"}
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-full flex flex-col items-center justify-center text-5xl font-extrabold ${
                        isDarkMode ? "bg-slate-900 text-[#FB923C]" : "bg-[#FFF7F5] text-[#F97316]"
                      }`}
                    >
                      <span>{profile?.fullName?.[0] || "C"}</span>
                      <span className="text-xs font-mono tracking-widest uppercase mt-2 text-[#F97316]">Coral Studio</span>
                    </div>
                  )}
                </motion.div>

                {/* Floating Abstract Badge */}
                <div
                  className={`absolute -bottom-4 right-2 sm:right-6 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-xl flex items-center gap-3 ${
                    isDarkMode ? "bg-slate-900/90 border-slate-800 text-slate-200" : "bg-white/95 border-[#FED7AA] text-[#1F2937]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FFF7F5] border border-[#FED7AA] flex items-center justify-center text-[#F97316] font-bold text-xs">
                    CS
                  </div>
                  <div>
                    <div className="text-xs font-extrabold">Award-Winning UI</div>
                    <div className="text-[10px] text-[#F97316] font-mono">Framer & Stripe Aesthetic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION (Masonry Layout with Hover Zoom) */}
        <section id="projects" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#FFF7F5] text-[#F97316] text-xs font-mono uppercase tracking-widest font-bold">
              <FolderGit2 className="w-3.5 h-3.5" /> Selected Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Featured Projects
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Masonry layout grid featuring smooth image hover zoom animations.
            </p>
          </div>

          {/* Masonry Card Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile?.projects?.map((proj, idx) => {
              const techList =
                proj.technologies ||
                (typeof proj.techStack === "string" ? proj.techStack.split(",") : []) ||
                [];

              // Staggered heights for masonry visual effect
              const heightClass = idx % 2 === 0 ? "h-56" : "h-64";

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`rounded-3xl border overflow-hidden backdrop-blur-xl flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 group ${
                    isDarkMode
                      ? "bg-[#1E293B]/70 border-slate-700 hover:border-[#F97316]/50 shadow-xl"
                      : "bg-[#FFF7F5] border-[#FED7AA] hover:bg-white hover:border-[#F97316]/40 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {/* Image Container with Hover Zoom */}
                  <div className={`relative ${heightClass} overflow-hidden bg-slate-900`}>
                    {proj.imageUrl || proj.image ? (
                      <img
                        src={proj.imageUrl || proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950 flex items-center justify-center p-6 text-center">
                        <Code className="w-12 h-12 text-[#F97316]/40 mb-2 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-[#F97316] transition-colors">
                        {proj.title}
                      </h3>
                      <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {techList.map((t, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Visit Project Button */}
                      {(proj.link || proj.projectUrl || proj.githubUrl) && (
                        <a
                          href={proj.link || proj.projectUrl || proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA580C] hover:to-[#F97316] text-white font-extrabold text-xs shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_12px_28px_rgba(249,115,22,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
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

        {/* SKILLS SECTION (Animated Colorful Badges) */}
        <section id="skills" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#FFF7F5] text-[#F97316] text-xs font-mono uppercase tracking-widest font-bold">
              <Code className="w-3.5 h-3.5" /> Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Skills & Expertise
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Animated colorful badges representing technical and design competencies.
            </p>
          </div>

          {/* Animated Colorful Badges */}
          <div className="flex flex-wrap justify-center gap-3.5 max-w-4xl mx-auto">
            {normalizedSkills.map((sk, idx) => {
              const colorStyle = badgeColors[idx % badgeColors.length];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className={`px-6 py-3.5 rounded-full border backdrop-blur-xl shadow-sm transition-all duration-300 flex items-center gap-3 cursor-default ${colorStyle}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
                  <span className="font-bold text-xs sm:text-sm tracking-wide">{sk.name}</span>
                  {sk.proficiency && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316]">
                      {sk.proficiency}%
                    </span>
                  )}
                </motion.div>
              );
            })}
            {normalizedSkills.length === 0 && (
              <p className="text-xs italic text-slate-500">No skills listed yet.</p>
            )}
          </div>
        </section>

        {/* EXPERIENCE SECTION (Modern Cards) */}
        <section id="experience" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#FFF7F5] text-[#F97316] text-xs font-mono uppercase tracking-widest font-bold">
              <Briefcase className="w-3.5 h-3.5" /> Experience
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Work Experience
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Modern cards highlighting professional contributions and achievements.
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
                className={`p-7 sm:p-9 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-[#F97316]/50 relative overflow-hidden group ${
                  isDarkMode
                    ? "bg-[#1E293B]/70 border-slate-700 shadow-md"
                    : "bg-[#FFF7F5] border-[#FED7AA] hover:bg-white shadow-sm hover:shadow-xl"
                }`}
              >
                {/* Top Accent Gradient */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#F97316] via-[#FB923C] to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] font-extrabold text-lg shrink-0 shadow-sm">
                      {exp.company?.[0] || "C"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-[#F97316] transition-colors">
                        {exp.position || exp.role || "Software Engineer"}
                      </h3>
                      <div className="text-sm font-semibold text-[#F97316] flex items-center gap-2 mt-0.5">
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
                    isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-[#FED7AA] text-slate-700 shadow-sm"
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{exp.startDate || "2023"} - {exp.endDate || "Present"}</span>
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

        {/* EDUCATION SECTION (Creative Timeline) */}
        <section id="education" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#FFF7F5] text-[#F97316] text-xs font-mono uppercase tracking-widest font-bold">
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Creative Timeline
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Academic qualifications structured in a creative timeline.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto pl-6 sm:pl-8 border-l-2 border-[#F97316]/40 space-y-10 my-6">
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
                <div className="absolute -left-[31px] sm:-left-[39px] top-2 w-5 h-5 rounded-full bg-white border-2 border-[#F97316] flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.4)] group-hover:scale-125 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                </div>

                <div
                  className={`p-7 rounded-3xl border backdrop-blur-xl transition-all duration-300 hover:border-[#F97316]/50 ${
                    isDarkMode ? "bg-[#1E293B]/70 border-slate-700" : "bg-[#FFF7F5] border-[#FED7AA] hover:bg-white shadow-sm hover:shadow-xl"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#F97316] tracking-wider uppercase">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]">
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

        {/* CERTIFICATIONS SECTION (Gallery Layout) */}
        <section id="certifications" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#FFF7F5] text-[#F97316] text-xs font-mono uppercase tracking-widest font-bold">
              <Award className="w-3.5 h-3.5" /> Credentials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Certifications Gallery
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Gallery layout grid showcasing recognized credentials and honors.
            </p>
          </div>

          {/* Gallery Layout Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {profile?.certifications?.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316]/50 ${
                  isDarkMode
                    ? "bg-[#1E293B]/70 border-slate-700 shadow-md"
                    : "bg-[#FFF7F5] border-[#FED7AA] hover:bg-white shadow-sm hover:shadow-xl"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] shrink-0 shadow-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${
                      isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-[#FED7AA] text-slate-700 shadow-sm"
                    }`}>
                      {cert.issueDate || cert.date || "2024"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold tracking-tight mb-1">
                      {cert.name || cert.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#F97316]">
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
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F97316] hover:underline pt-2"
                  >
                    <span>Verify Certificate</span>
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#FFF7F5] text-[#F97316] text-xs font-mono uppercase tracking-widest font-bold">
              <Mail className="w-3.5 h-3.5" /> Get in Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Recruiter Contact Form
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Direct message dispatching to get connected instantly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Direct Contact Info */}
            <div
              className={`lg:col-span-5 p-8 rounded-3xl border backdrop-blur-xl space-y-6 flex flex-col justify-between ${
                isDarkMode ? "bg-[#1E293B]/70 border-slate-700" : "bg-[#FFF7F5] border-[#FED7AA] shadow-md"
              }`}
            >
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Let's connect</h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Looking for a creative developer for full-time opportunities or project contracts? Fill out the form or reach out directly.
                </p>

                <div className="space-y-4">
                  {profile?.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF7F5] border border-[#FED7AA] flex items-center justify-center text-[#F97316] shrink-0 shadow-sm">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Email</div>
                        <a href={`mailto:${profile.email}`} className="text-sm font-bold hover:text-[#F97316] transition-colors">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.mobileNumber && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF7F5] border border-[#FED7AA] flex items-center justify-center text-[#F97316] shrink-0 shadow-sm">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Mobile</div>
                        <a href={`tel:${profile.mobileNumber}`} className="text-sm font-bold hover:text-[#F97316] transition-colors">
                          {profile.mobileNumber}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#FED7AA] dark:border-slate-800">
                <div className="text-xs font-bold mb-3">Quick Share</div>
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 px-4 rounded-full border border-[#F97316]/40 text-[#F97316] bg-white hover:bg-[#FFF7F5] text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Portfolio Link</span>
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className={`lg:col-span-7 p-8 rounded-3xl border backdrop-blur-xl shadow-xl ${
                isDarkMode ? "bg-[#1E293B]/80 border-slate-700" : "bg-white border-[#FED7AA]"
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
                          ? "bg-slate-900 border-slate-800 text-white focus:border-[#F97316]"
                          : "bg-[#FFF7F5] border-[#FED7AA] text-[#1F2937] focus:border-[#F97316] focus:bg-white"
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
                          ? "bg-slate-900 border-slate-800 text-white focus:border-[#F97316]"
                          : "bg-[#FFF7F5] border-[#FED7AA] text-[#1F2937] focus:border-[#F97316] focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Job Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:border-[#F97316]"
                        : "bg-[#FFF7F5] border-[#FED7AA] text-[#1F2937] focus:border-[#F97316] focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hi, I noticed your Coral Studio portfolio and would like to discuss..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:border-[#F97316]"
                        : "bg-[#FFF7F5] border-[#FED7AA] text-[#1F2937] focus:border-[#F97316] focus:bg-white"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA580C] hover:to-[#F97316] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                ? "bg-slate-900/90 border-slate-800 text-[#FB923C] hover:border-[#F97316]"
                : "bg-white/95 border-[#FED7AA] text-[#F97316] hover:border-[#F97316] shadow-md"
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
          isDarkMode ? "bg-[#0F172A]/90 border-slate-800 text-slate-400" : "bg-white/90 border-[#FED7AA] text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F97316] flex items-center justify-center text-white font-extrabold text-xs">
              CS
            </div>
            <span className="font-extrabold text-[#1F2937] dark:text-white">{profile?.fullName || "Coral Studio"}</span>
            <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-[#F97316] transition-colors">
                {profile.email}
              </a>
            )}
            {profile?.mobileNumber && (
              <a href={`tel:${profile.mobileNumber}`} className="hover:text-[#F97316] transition-colors">
                {profile.mobileNumber}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[#F97316] hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateSix;
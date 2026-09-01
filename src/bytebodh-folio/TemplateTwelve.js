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
  Code
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateTwelve = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Swiss One defaults to clean white background
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
      const sections = ["hero", "skills", "projects", "experience", "education", "certifications", "contact"];
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
      const subjectLine = formData.subject.trim() || `Swiss One Inquiry from ${formData.name}`;
      const payload = {
        id: profile?.user?.id || profile?.userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: `Subject: ${subjectLine}\n\n${formData.message.trim()}`
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("Message delivered successfully.");
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
  const renderSocialIcon = (platform, className = "w-4 h-4") => {
    const p = (platform || "").toUpperCase();
    if (p.includes("LINKEDIN")) return <Linkedin className={className} />;
    if (p.includes("GITHUB")) return <Github className={className} />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className={className} />;
    return <Globe className={className} />;
  };

  // Nav Items Configuration
  const navItems = [
    { id: "hero", label: "OVERVIEW", icon: User },
    { id: "skills", label: "SKILLS", icon: Code },
    { id: "projects", label: "PROJECTS", icon: FolderGit2 },
    { id: "experience", label: "EXPERIENCE", icon: Briefcase },
    { id: "education", label: "EDUCATION", icon: GraduationCap },
    { id: "certifications", label: "CREDENTIALS", icon: Award },
    { id: "contact", label: "CONTACT", icon: Mail }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#E60000] selection:text-white ${
        isDarkMode ? "bg-[#050505] text-[#FFFFFF]" : "bg-[#FFFFFF] text-[#000000]"
      }`}
    >
      {/* HEADER / NAVBAR */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 border-b ${
          isDarkMode ? "bg-[#050505]/90 border-[#1F1F1F]" : "bg-[#FFFFFF]/90 border-[#E5E5E5]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo on Left: Huge Swiss Typography */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E60000] text-white flex items-center justify-center font-extrabold text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform duration-300">
              CH
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tighter uppercase block">
                {profile?.fullName || "SWISS 01"}
              </span>
              <span className="block text-[9px] uppercase font-mono tracking-widest text-[#E60000] font-bold">
                Swiss International Style
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links with Animated Underline */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative py-1 text-xs font-extrabold tracking-widest uppercase transition-colors group/nav cursor-pointer"
                >
                  <span className={isActive ? "text-[#E60000]" : isDarkMode ? "text-white hover:text-[#E60000]" : "text-black hover:text-[#E60000]"}>
                    {item.label}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#E60000] transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Actions on Right */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-[#111111] border-[#222222] text-amber-400 hover:border-[#E60000]"
                  : "bg-[#F8F8F8] border-[#E5E5E5] text-black hover:border-[#E60000]"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Share Link */}
            <button
              onClick={handleCopyLink}
              className={`p-2.5 rounded-full border transition-all duration-300 hidden sm:flex items-center justify-center cursor-pointer ${
                isDarkMode
                  ? "bg-[#111111] border-[#222222] text-white hover:border-[#E60000]"
                  : "bg-[#F8F8F8] border-[#E5E5E5] text-black hover:border-[#E60000]"
              }`}
              title="Share Portfolio"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#E60000]" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-full border ${
                isDarkMode ? "bg-[#111111] border-[#222222] text-white" : "bg-[#F8F8F8] border-[#E5E5E5] text-black"
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
                isDarkMode ? "bg-[#050505]/95 border-[#1F1F1F]" : "bg-[#FFFFFF]/95 border-[#E5E5E5]"
              }`}
            >
              <div className="px-6 py-5 space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs font-extrabold tracking-widest uppercase transition-all ${
                      activeSection === item.id
                        ? "bg-[#E60000] text-white font-bold"
                        : isDarkMode
                        ? "text-white hover:bg-[#111111]"
                        : "text-black hover:bg-[#F8F8F8]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SWISS GRID MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-32">
        
        {/* HERO SECTION: HUGE TYPOGRAPHY */}
        <section id="hero" className="scroll-mt-28 pt-4">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Huge Typography */}
            <div className="lg:col-span-8 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E60000] bg-[#E60000]/10 text-[#E60000] text-xs font-mono font-bold tracking-widest uppercase">
                <span>SWISS INTERNATIONAL DESIGN • 01</span>
              </div>

              {/* Huge Luxury Title */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase leading-none">
                  {profile?.fullName || "DESIGNER & ENGINEER"}
                </h1>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#E60000] uppercase">
                  {profile?.headline || "SENIOR PRODUCT ARCHITECT"}
                </p>
              </div>

              {/* Summary */}
              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {profile?.summary ||
                  "Functional design inspired by Dieter Rams & Apple. Eliminating unnecessary complexity to craft grid-aligned, high-throughput digital systems."}
              </p>

              {/* Two Rounded Pill CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary: VIEW PROJECTS */}
                <button
                  onClick={() => scrollToSection("projects")}
                  className="px-8 py-4 rounded-full bg-[#E60000] hover:bg-[#CC0000] text-white font-extrabold text-xs tracking-widest uppercase shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  <span>VIEW PROJECTS</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {/* Secondary: GET IN TOUCH */}
                <button
                  onClick={() => scrollToSection("contact")}
                  className={`px-8 py-4 rounded-full font-extrabold text-xs tracking-widest uppercase border-2 transition-all duration-300 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "border-white text-white hover:border-[#E60000] hover:text-[#E60000]"
                      : "border-black text-black hover:border-[#E60000] hover:text-[#E60000]"
                  }`}
                >
                  <span>GET IN TOUCH</span>
                </button>
              </div>
            </div>

            {/* Right Minimal Circular Profile Photo */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 border-2 border-[#E60000] shadow-2xl relative">
                  {profile?.pictureUrl || profile?.photo ? (
                    <img
                      src={profile.pictureUrl || profile.photo}
                      alt={profile.fullName || "Profile"}
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center text-5xl font-extrabold uppercase ${
                        isDarkMode ? "bg-[#111111] text-white" : "bg-[#F8F8F8] text-black"
                      }`}
                    >
                      {profile?.fullName?.[0] || "S"}
                    </div>
                  )}
                  {/* Subtle Red Node Marker */}
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#E60000] border-2 border-white dark:border-black shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION: MINIMAL GRID BLOCKS */}
        <section id="skills" className="scroll-mt-28 space-y-8">
          <div className="flex items-center justify-between border-b pb-4 border-[#E5E5E5] dark:border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xs text-[#E60000]">/01</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase">
                CAPABILITIES & TECH STACK
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#E60000]">{normalizedSkills.length} ITEMS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {normalizedSkills.map((sk, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-2xl border transition-all ${
                  isDarkMode
                    ? "bg-[#111111] border-[#222222] hover:border-[#E60000]"
                    : "bg-[#F8F8F8] border-[#E5E5E5] hover:border-[#E60000]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#E60000]" />
                  {sk.proficiency && (
                    <span className="text-[10px] font-mono font-bold text-[#E60000]">{sk.proficiency}%</span>
                  )}
                </div>
                <h3 className="font-bold text-sm tracking-tight">{sk.name}</h3>
                {sk.category && (
                  <div className="text-[10px] font-mono text-slate-500 uppercase mt-1">{sk.category}</div>
                )}
              </motion.div>
            ))}
            {normalizedSkills.length === 0 && (
              <p className="text-xs italic text-slate-500 col-span-full">No capabilities listed yet.</p>
            )}
          </div>
        </section>

        {/* PROJECTS SECTION: DISPLAYED AS CLEAN HORIZONTAL ROWS */}
        <section id="projects" className="scroll-mt-28 space-y-8">
          <div className="flex items-center justify-between border-b pb-4 border-[#E5E5E5] dark:border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xs text-[#E60000]">/02</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase">
                SELECTED PROJECTS SHOWCASE
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#E60000]">CLEAN ROWS</span>
          </div>

          {/* Clean Horizontal Rows */}
          <div className="space-y-6">
            {profile?.projects?.map((proj, idx) => {
              const indexStr = String(idx + 1).padStart(2, "0");
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
                  className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 hover:border-[#E60000] group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                    isDarkMode ? "bg-[#111111] border-[#222222]" : "bg-[#F8F8F8] border-[#E5E5E5]"
                  }`}
                >
                  {/* Left Column: Index & Project Brief */}
                  <div className="flex items-start gap-6 flex-1">
                    <span className="font-mono font-extrabold text-2xl text-[#E60000] shrink-0">
                      {indexStr}
                    </span>

                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight group-hover:text-[#E60000] transition-colors">
                        {proj.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {proj.description}
                      </p>

                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {techList.map((t, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border border-[#E60000]/30 text-[#E60000] bg-[#E60000]/5"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Screenshot Thumbnail & Visit Button */}
                  <div className="flex items-center gap-6 shrink-0 self-end md:self-auto">
                    {proj.imageUrl || proj.image ? (
                      <img
                        src={proj.imageUrl || proj.image}
                        alt={proj.title}
                        className="w-24 h-24 sm:w-32 sm:h-20 rounded-2xl object-cover border border-[#E5E5E5] dark:border-[#222222]"
                      />
                    ) : (
                      <div className="w-24 h-20 rounded-2xl bg-black text-white flex items-center justify-center font-mono text-xs">
                        {indexStr}
                      </div>
                    )}

                    {(proj.link || proj.projectUrl || proj.githubUrl) && (
                      <a
                        href={proj.link || proj.projectUrl || proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative py-2 font-extrabold text-xs tracking-widest uppercase text-[#E60000] flex items-center gap-1 group/btn"
                      >
                        <span>VISIT</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E60000] transition-transform duration-300 origin-left scale-x-0 group-hover/btn:scale-x-100" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {(!profile?.projects || profile.projects.length === 0) && (
              <p className="text-center text-xs italic text-slate-500">No projects listed yet.</p>
            )}
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className="scroll-mt-28 space-y-8">
          <div className="flex items-center justify-between border-b pb-4 border-[#E5E5E5] dark:border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xs text-[#E60000]">/03</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase">
                EXPERIENCE TIMELINE
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#E60000]">CHRONOLOGICAL</span>
          </div>

          <div className="relative pl-6 border-l-2 border-[#E60000] space-y-8 my-4">
            {profile?.experience?.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Red Node Dot */}
                <div className="absolute -left-[31px] top-2 w-5 h-5 rounded-full bg-white dark:bg-black border-2 border-[#E60000] flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-[#E60000]" />
                </div>

                <div
                  className={`p-7 rounded-3xl border transition-all ${
                    isDarkMode ? "bg-[#111111] border-[#222222] hover:border-[#E60000]" : "bg-[#F8F8F8] border-[#E5E5E5] hover:border-[#E60000]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#E60000] uppercase tracking-wider">
                      {exp.startDate || "2022"} — {exp.endDate || "PRESENT"}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {exp.location || "REMOTE"}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold tracking-tight mb-1">
                    {exp.position || exp.role || "Software Engineer"}
                  </h3>
                  <div className="text-xs font-bold text-[#E60000] uppercase mb-3">
                    {exp.company}
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
            {(!profile?.experience || profile.experience.length === 0) && (
              <p className="text-xs italic text-slate-500">No experience listed yet.</p>
            )}
          </div>
        </section>

        {/* EDUCATION TIMELINE */}
        <section id="education" className="scroll-mt-28 space-y-8">
          <div className="flex items-center justify-between border-b pb-4 border-[#E5E5E5] dark:border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xs text-[#E60000]">/04</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase">
                EDUCATION TIMELINE
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#E60000]">ACADEMICS</span>
          </div>

          <div className="relative pl-6 border-l-2 border-[#E60000] space-y-8 my-4">
            {profile?.education?.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="absolute -left-[31px] top-2 w-5 h-5 rounded-full bg-white dark:bg-black border-2 border-[#E60000] flex items-center justify-center shadow-md">
                  <div className="w-2 h-2 rounded-full bg-[#E60000]" />
                </div>

                <div
                  className={`p-7 rounded-3xl border transition-all ${
                    isDarkMode ? "bg-[#111111] border-[#222222] hover:border-[#E60000]" : "bg-[#F8F8F8] border-[#E5E5E5] hover:border-[#E60000]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#E60000] uppercase tracking-wider">
                      {edu.startDate || "2020"} — {edu.endDate || "2024"}
                    </span>
                    {edu.gpa && (
                      <span className="text-xs font-bold text-slate-500">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold tracking-tight mb-1">
                    {edu.degree}
                  </h3>
                  <div className="text-xs font-bold uppercase mb-2">
                    {edu.institution} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                  </div>

                  {edu.description && (
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
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

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications" className="scroll-mt-28 space-y-8">
          <div className="flex items-center justify-between border-b pb-4 border-[#E5E5E5] dark:border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xs text-[#E60000]">/05</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase">
                RECOGNIZED CREDENTIALS
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#E60000]">VERIFIED</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {profile?.certifications?.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-3 transition-all ${
                  isDarkMode ? "bg-[#111111] border-[#222222] hover:border-[#E60000]" : "bg-[#F8F8F8] border-[#E5E5E5] hover:border-[#E60000]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#E60000] uppercase">
                      {cert.issueDate || cert.date || "2024"}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E60000] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold tracking-tight">
                    {cert.name || cert.title}
                  </h3>
                  <div className="text-xs font-bold uppercase text-slate-500">
                    {cert.issuingOrganization || cert.issuer || "Issuing Body"}
                  </div>
                </div>
              </motion.div>
            ))}
            {(!profile?.certifications || profile.certifications.length === 0) && (
              <p className="text-center text-xs italic text-slate-500 col-span-full">No certifications listed yet.</p>
            )}
          </div>
        </section>

        {/* RECRUITER CONTACT FORM SECTION */}
        <section id="contact" className="scroll-mt-28 space-y-8">
          <div className="flex items-center justify-between border-b pb-4 border-[#E5E5E5] dark:border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-xs text-[#E60000]">/06</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase">
                RECRUITER CONTACT FORM
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#E60000]">DIRECT DISPATCH</span>
          </div>

          <div
            className={`p-8 sm:p-10 rounded-3xl border shadow-lg ${
              isDarkMode ? "bg-[#111111] border-[#222222]" : "bg-[#F8F8F8] border-[#E5E5E5]"
            }`}
          >
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-full border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#050505] border-[#222222] text-white focus:border-[#E60000]"
                        : "bg-white border-[#E5E5E5] text-black focus:border-[#E60000]"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1.5">Your Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-full border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#050505] border-[#222222] text-white focus:border-[#E60000]"
                        : "bg-white border-[#E5E5E5] text-black focus:border-[#E60000]"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="Executive Software Engineering Opportunity"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={`w-full px-4 py-3 rounded-full border text-sm outline-none transition-all ${
                    isDarkMode
                      ? "bg-[#050505] border-[#222222] text-white focus:border-[#E60000]"
                      : "bg-white border-[#E5E5E5] text-black focus:border-[#E60000]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1.5">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Hi, I reviewed your Swiss One portfolio and would like to connect..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-4 py-3 rounded-3xl border text-sm outline-none transition-all resize-none ${
                    isDarkMode
                      ? "bg-[#050505] border-[#222222] text-white focus:border-[#E60000]"
                      : "bg-white border-[#E5E5E5] text-black focus:border-[#E60000]"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-full bg-[#E60000] hover:bg-[#CC0000] text-white font-extrabold text-xs tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>DISPATCHING...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND DIRECT MESSAGE</span>
                  </>
                )}
              </button>
            </form>
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
                ? "bg-[#111111]/90 border-[#222222] text-[#E60000] hover:border-[#E60000]"
                : "bg-white/95 border-[#E5E5E5] text-[#E60000] hover:border-[#E60000] shadow-md"
            }`}
            title={soc.platform}
          >
            {renderSocialIcon(soc.platform)}
          </motion.a>
        ))}
      </div>

      {/* FOOTER */}
      <footer
        className={`border-t py-12 relative z-10 ${
          isDarkMode ? "bg-[#050505] border-[#1F1F1F] text-slate-400" : "bg-white border-[#E5E5E5] text-slate-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#E60000] text-white flex items-center justify-center font-extrabold text-[10px]">
              CH
            </div>
            <span className="font-extrabold text-black dark:text-white">{profile?.fullName || "SWISS ONE"}</span>
            <span>• © {new Date().getFullYear()} ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-6">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="hover:text-[#E60000] transition-colors">
                {profile.email}
              </a>
            )}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[#E60000] hover:underline font-bold"
            >
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateTwelve;

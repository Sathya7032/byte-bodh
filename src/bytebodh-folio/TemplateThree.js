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
  FileText,
  Send,
  Eye,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Calendar,
  Code,
  Clock
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateThree = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Royal Sapphire light mode by default
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Meeting Schedule State
  const [meetingData, setMeetingData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    notes: ""
  });
  const [isScheduling, setIsScheduling] = useState(false);

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
      const sections = ["hero", "summary", "skills", "experience", "education", "projects", "certifications", "contact"];
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
      const offset = 40;
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
      const subjectLine = formData.subject.trim() || `Royal Sapphire Inquiry from ${formData.name}`;
      const payload = {
        id: profile?.user?.id || profile?.userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: `Subject: ${subjectLine}\n\n${formData.message.trim()}`
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("🚀 Message dispatched successfully! I will respond shortly.");
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

  // Meeting Schedule Request
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingData.name || !meetingData.email || !meetingData.date || !meetingData.time) {
      toast.error("Please fill in meeting date, time, and contact info.");
      return;
    }

    setIsScheduling(true);

    try {
      const payload = {
        id: profile?.user?.id || profile?.userId,
        name: meetingData.name,
        email: meetingData.email,
        message: `Subject: 📅 Meeting Schedule Request for ${meetingData.date} at ${meetingData.time}\n\nRequested Meeting Date: ${meetingData.date}\nTime: ${meetingData.time}\nNotes: ${meetingData.notes || "N/A"}`
      };

      await createContactMessage(payload);
      toast.success("🗓️ Meeting request sent! I will confirm via email.");
      setScheduleModalOpen(false);
      setMeetingData({ name: "", email: "", date: "", time: "", notes: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send meeting request. Please try again.");
    } finally {
      setIsScheduling(false);
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

  // Nav Items Configuration
  const navItems = [
    { id: "hero", label: "Overview", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
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
      icon: FolderGit2
    },
    {
      label: "Technical Skills",
      value: normalizedSkills.length || 18,
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
      value: profile?.viewsCount || 1650,
      suffix: "+",
      icon: Eye
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#2563EB]/20 selection:text-[#2563EB] ${
        isDarkMode ? "bg-[#0B132B] text-[#F9FAFB]" : "bg-[#FFFFFF] text-[#111827]"
      }`}
    >
      {/* Background Soft Mesh Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#2563EB]/15" : "bg-[#60A5FA]/20"
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full blur-[150px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#60A5FA]/10" : "bg-[#2563EB]/10"
          }`}
        />
      </div>

      {/* MOBILE TOP BAR NAVIGATION */}
      <header
        className={`lg:hidden sticky top-0 z-50 backdrop-blur-xl border-b p-4 flex items-center justify-between ${
          isDarkMode ? "bg-[#0B132B]/90 border-slate-800" : "bg-white/90 border-[#E5E7EB]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white font-extrabold text-xs shadow-md">
            RS
          </div>
          <span className="font-extrabold text-sm tracking-tight">{profile?.fullName || "Royal Sapphire"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-[#F9FAFB] border-[#E5E7EB] text-slate-700"
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-[#F9FAFB] border-[#E5E7EB] text-slate-800"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden fixed top-[61px] inset-x-0 z-40 border-b backdrop-blur-2xl p-6 space-y-3 ${
              isDarkMode ? "bg-[#0B132B]/95 border-slate-800" : "bg-white/95 border-[#E5E7EB]"
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeSection === item.id
                    ? isDarkMode
                      ? "bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40 font-bold"
                      : "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30 font-bold"
                    : isDarkMode
                    ? "text-slate-300 hover:bg-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-[#2563EB]" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DUAL COLUMN CONTAINER (Left Sidebar + Right Content Area) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12 flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* LEFT PROFILE SIDEBAR (Sticky on Desktop) */}
        <aside className="lg:w-[360px] shrink-0">
          <div
            className={`lg:sticky lg:top-8 p-7 rounded-3xl border backdrop-blur-xl shadow-[0_10px_30px_rgba(37,99,235,0.08)] space-y-7 transition-all duration-300 ${
              isDarkMode ? "bg-[#1C2541]/70 border-slate-800" : "bg-[#F9FAFB] border-[#E5E7EB]"
            }`}
          >
            {/* Header Controls inside Sidebar */}
            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-[#E5E7EB]/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                  RS
                </div>
                <span className="font-extrabold text-xs uppercase tracking-widest text-[#2563EB]">
                  Royal Sapphire
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className={`p-2 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-[#60A5FA]"
                      : "bg-white border-[#E5E7EB] text-slate-700 hover:text-[#2563EB]"
                  }`}
                  title="Copy Portfolio Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#2563EB]" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                      : "bg-white border-[#E5E7EB] text-slate-700 hover:bg-slate-100"
                  }`}
                  title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Floating Profile Image */}
            <div className="text-center">
              <div className="relative inline-block mb-4 group">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] opacity-75 blur-md group-hover:opacity-100 transition duration-500 animate-pulse" />
                <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] shadow-xl">
                  {profile?.pictureUrl || profile?.photo ? (
                    <img
                      src={profile.pictureUrl || profile.photo}
                      alt={profile.fullName || "Profile"}
                      className="w-full h-full rounded-full object-cover shadow-inner"
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-full flex flex-col items-center justify-center text-4xl font-extrabold ${
                        isDarkMode ? "bg-[#0B132B] text-[#60A5FA]" : "bg-white text-[#2563EB]"
                      }`}
                    >
                      <span>{profile?.fullName?.[0] || "R"}</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#2563EB] text-white shadow-md border-2 border-white dark:border-slate-900">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight mb-1">
                {profile?.fullName || "Royal Executive"}
              </h1>
              <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider leading-relaxed">
                {profile?.headline || "Executive Engineering Leader"}
              </p>
            </div>

            {/* Two Action Buttons in Sidebar */}
            <div className="space-y-3 pt-2">
              {/* Primary: Download Resume */}
              <button
                onClick={() => setResumeModalOpen(true)}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Resume</span>
              </button>

              {/* Secondary: Schedule Meeting */}
              <button
                onClick={() => setScheduleModalOpen(true)}
                className={`w-full py-3.5 px-5 rounded-2xl font-extrabold text-xs border transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 text-slate-200 hover:border-[#2563EB]"
                    : "bg-white border-[#E5E7EB] text-[#111827] hover:border-[#2563EB] hover:bg-slate-50"
                }`}
              >
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span>Schedule Meeting</span>
              </button>
            </div>

            {/* Recruiter Quick Details */}
            <div className="space-y-3 pt-4 border-t border-[#E5E7EB]/80 dark:border-slate-800 text-xs font-medium">
              {profile?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href={`mailto:${profile.email}`} className="truncate hover:text-[#2563EB] transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}

              {profile?.mobileNumber && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <a href={`tel:${profile.mobileNumber}`} className="hover:text-[#2563EB] transition-colors">
                    {profile.mobileNumber}
                  </a>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Desktop Navigation Links inside Sidebar */}
            <nav className="hidden lg:block space-y-1 pt-4 border-t border-[#E5E7EB]/80 dark:border-slate-800">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? isDarkMode
                          ? "bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/40 font-bold"
                          : "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30 font-bold"
                        : isDarkMode
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                  </button>
                );
              })}
            </nav>

            {/* Social Links inside Sidebar */}
            <div className="pt-4 border-t border-[#E5E7EB]/80 dark:border-slate-800 flex items-center justify-center gap-3">
              {profile?.socialMediaLinks?.map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url || soc.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-[#60A5FA] hover:border-[#2563EB]"
                      : "bg-white border-[#E5E7EB] text-[#2563EB] hover:border-[#2563EB] hover:bg-slate-50"
                  }`}
                  title={soc.platform}
                >
                  {renderSocialIcon(soc.platform, "w-4 h-4")}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 space-y-24 min-w-0">
          
          {/* HERO & EXECUTIVE BRIEFING */}
          <section id="hero" className="scroll-mt-12">
            <div
              className={`p-8 sm:p-10 rounded-3xl border backdrop-blur-xl shadow-[0_10px_30px_rgba(37,99,235,0.08)] space-y-6 ${
                isDarkMode ? "bg-[#1C2541]/70 border-slate-800" : "bg-[#F9FAFB] border-[#E5E7EB]"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                <span>Executive Recruiter Portfolio</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Architecting high-impact engineering solutions & leading tech teams.
              </h2>

              <p className={`text-base leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Welcome to my executive portfolio. I specialize in designing scalable cloud platforms, driving engineering velocity, and delivering mission-critical digital applications.
              </p>

              {/* Quick Statistics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {stats.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border backdrop-blur-xl ${
                      isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-[#E5E7EB] shadow-sm"
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] dark:text-[#60A5FA]">
                      {st.value}
                      <span>{st.suffix}</span>
                    </div>
                    <div className={`text-[11px] font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SUMMARY SECTION */}
          <section id="summary" className="scroll-mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Executive Summary
              </h2>
            </div>

            <div
              className={`p-8 rounded-3xl border backdrop-blur-xl space-y-4 leading-relaxed ${
                isDarkMode ? "bg-[#1C2541]/70 border-slate-800 text-slate-300" : "bg-[#F9FAFB] border-[#E5E7EB] text-slate-700 shadow-sm"
              }`}
            >
              <p className="text-sm sm:text-base">
                {profile?.summary ||
                  "Seasoned Software Engineering Professional with extensive experience in cloud architecture, full-stack microservices, and leading distributed engineering organizations. Proven track record of improving operational metrics and delivering enterprise products."}
              </p>
            </div>
          </section>

          {/* SKILLS SECTION */}
          <section id="skills" className="scroll-mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Technical Stack & Skills
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Core competencies displayed as rounded animated pills.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {normalizedSkills.map((sk, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  className={`px-5 py-3 rounded-full border backdrop-blur-xl shadow-sm transition-all flex items-center gap-3 cursor-default ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-[#2563EB]"
                      : "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] hover:border-[#2563EB] hover:bg-white shadow-sm"
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <span className="font-bold text-xs sm:text-sm">{sk.name}</span>
                  {sk.proficiency && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB]">
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
          <section id="experience" className="scroll-mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Work Experience
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Executive career journey and technical impact.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {profile?.experience?.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`p-7 rounded-3xl border backdrop-blur-xl transition-all hover:border-[#2563EB]/50 ${
                    isDarkMode
                      ? "bg-[#1C2541]/70 border-slate-800 shadow-md"
                      : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white shadow-[0_10px_30px_rgba(37,99,235,0.08)]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] font-extrabold text-lg shrink-0">
                        {exp.company?.[0] || "C"}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {exp.position || exp.role || "Software Engineer"}
                        </h3>
                        <div className="text-xs font-semibold text-[#2563EB] flex items-center gap-2 mt-0.5">
                          <span>{exp.company || "Company"}</span>
                          {exp.location && (
                            <span className={`font-normal ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                              • {exp.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border self-start sm:self-auto ${
                      isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-[#E5E7EB] text-slate-700 shadow-sm"
                    }`}>
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{exp.startDate || "2023"} - {exp.endDate || "Present"}</span>
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </motion.div>
              ))}
              {(!profile?.experience || profile.experience.length === 0) && (
                <p className="text-xs italic text-slate-500">No work experience listed yet.</p>
              )}
            </div>
          </section>

          {/* EDUCATION TIMELINE */}
          <section id="education" className="scroll-mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Education Timeline
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Academic qualifications and degree certifications.
                </p>
              </div>
            </div>

            <div className="relative pl-6 border-l-2 border-[#2563EB]/40 space-y-8 my-4">
              {profile?.education?.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -left-[31px] top-2 w-5 h-5 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  </div>

                  <div
                    className={`p-6 rounded-3xl border backdrop-blur-xl transition-all ${
                      isDarkMode ? "bg-[#1C2541]/70 border-slate-800" : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
                        {edu.startDate || "2020"} — {edu.endDate || "2024"}
                      </span>
                      {edu.gpa && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#2563EB]/10 border-[#2563EB]/30 text-[#2563EB]">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold tracking-tight mb-1">
                      {edu.degree}
                    </h3>
                    <div className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
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

          {/* PROJECTS SHOWCASE (ELEGANT HORIZONTAL CARDS) */}
          <section id="projects" className="scroll-mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Featured Projects
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Elegant horizontal project cards with technology tags and visit project buttons.
                </p>
              </div>
            </div>

            {/* Horizontal Project Cards Grid */}
            <div className="space-y-6">
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
                    className={`rounded-3xl border overflow-hidden backdrop-blur-xl flex flex-col md:flex-row items-stretch transition-all duration-300 hover:-translate-y-1 group ${
                      isDarkMode
                        ? "bg-[#1C2541]/70 border-slate-800 shadow-md"
                        : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white shadow-[0_10px_30px_rgba(37,99,235,0.08)]"
                    }`}
                  >
                    {/* Left Screenshot / Image Frame */}
                    <div className="md:w-2/5 relative h-52 md:h-auto overflow-hidden bg-slate-900 shrink-0">
                      {proj.imageUrl || proj.image ? (
                        <img
                          src={proj.imageUrl || proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0B132B] to-[#2563EB] flex items-center justify-center p-6 text-center">
                          <Code className="w-12 h-12 text-white/40 mb-2 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                    </div>

                    {/* Right Card Content */}
                    <div className="p-7 md:w-3/5 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-[#2563EB] transition-colors">
                          {proj.title}
                        </h3>
                        <p className={`text-xs leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {proj.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {techList.map((t, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20"
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
                            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.4)] transition-all duration-300 cursor-pointer group/btn"
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
                <p className="text-center text-xs italic text-slate-500">No projects listed yet.</p>
              )}
            </div>
          </section>

          {/* CERTIFICATIONS SECTION */}
          <section id="certifications" className="scroll-mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Certifications & Recognitions
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Horizontal premium cards highlighting industry credentials.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {profile?.certifications?.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#2563EB]/50 ${
                    isDarkMode
                      ? "bg-[#1C2541]/70 border-slate-800 shadow-md"
                      : "bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {cert.image ? (
                      <img src={cert.image} alt={cert.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shrink-0">
                        <Award className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold tracking-tight">
                        {cert.name || cert.title}
                      </h3>
                      <div className="text-xs font-semibold text-[#2563EB]">
                        {cert.issuingOrganization || cert.issuer || "Issuing Authority"}
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
                      isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-[#E5E7EB] text-slate-700 shadow-sm"
                    }`}>
                      {cert.issueDate || cert.date || "2024"}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
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
          <section id="contact" className="scroll-mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Recruiter Contact Form
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Direct backend dispatch interface to connect with the candidate.
                </p>
              </div>
            </div>

            <div
              className={`p-8 rounded-3xl border backdrop-blur-xl shadow-lg ${
                isDarkMode ? "bg-[#1C2541]/70 border-slate-800" : "bg-[#F9FAFB] border-[#E5E7EB]"
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
                          ? "bg-slate-900 border-slate-800 text-white focus:border-[#2563EB]"
                          : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]"
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
                          ? "bg-slate-900 border-slate-800 text-white focus:border-[#2563EB]"
                          : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="Executive Software Engineering Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:border-[#2563EB]"
                        : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Hi, I reviewed your executive portfolio and would like to discuss..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-white focus:border-[#2563EB]"
                        : "bg-white border-[#E5E7EB] text-[#111827] focus:border-[#2563EB]"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          </section>

          {/* FOOTER */}
          <footer
            className={`border-t backdrop-blur-xl py-10 ${
              isDarkMode ? "border-slate-800 text-slate-400" : "border-[#E5E7EB] text-slate-600"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
                  RS
                </div>
                <span className="font-extrabold text-[#111827] dark:text-white">{profile?.fullName || "Royal Sapphire"}</span>
                <span>• © {new Date().getFullYear()} All Rights Reserved.</span>
              </div>

              <div className="flex items-center gap-6">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="hover:text-[#2563EB] transition-colors">
                    {profile.email}
                  </a>
                )}
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-[#2563EB] hover:underline font-bold"
                >
                  Back to Top ↑
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* RESUME VIEWER MODAL */}
      <AnimatePresence>
        {resumeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-2xl p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-[#E5E7EB] text-[#111827]"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#2563EB]" />
                  <div>
                    <h3 className="font-bold text-lg">{profile?.fullName || "Executive"} — Official Resume</h3>
                    <div className="text-xs text-[#2563EB] font-mono">Recruiter Document Access</div>
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
                <div className={`p-4 rounded-2xl border space-y-2 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-[#F9FAFB] border-[#E5E7EB]"}`}>
                  <div className="font-bold text-[#2563EB] uppercase tracking-widest text-[10px]">Executive Summary Brief</div>
                  <p>{profile?.summary || "Executive resume details available for official download."}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-[#F9FAFB] border-[#E5E7EB]"}`}>
                    <span className="font-bold block">Email:</span>
                    <span>{profile?.email || "N/A"}</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-[#F9FAFB] border-[#E5E7EB]"}`}>
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
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-extrabold text-xs text-center shadow-md hover:opacity-95 transition-opacity"
                >
                  Download Official PDF Resume
                </a>
                <button
                  onClick={() => setResumeModalOpen(false)}
                  className="px-6 py-3.5 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SCHEDULE MEETING MODAL */}
      <AnimatePresence>
        {scheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-[#E5E7EB] text-[#111827]"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#2563EB]" />
                  <div>
                    <h3 className="font-bold text-lg">Schedule Recruiter Interview</h3>
                    <div className="text-xs text-[#2563EB] font-mono">Select preferred time slot</div>
                  </div>
                </div>
                <button
                  onClick={() => setScheduleModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Recruiter Name"
                      value={meetingData.name}
                      onChange={(e) => setMeetingData({ ...meetingData, name: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="recruiter@company.com"
                      value={meetingData.email}
                      onChange={(e) => setMeetingData({ ...meetingData, email: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={meetingData.date}
                      onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold mb-1">Preferred Time *</label>
                    <input
                      type="time"
                      required
                      value={meetingData.time}
                      onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1">Interview Topic / Agenda</label>
                  <textarea
                    rows={3}
                    placeholder="Role details, interview format..."
                    value={meetingData.notes}
                    onChange={(e) => setMeetingData({ ...meetingData, notes: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none resize-none ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isScheduling}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white font-extrabold text-xs shadow-md hover:opacity-95 cursor-pointer disabled:opacity-50"
                >
                  {isScheduling ? "Sending Request..." : "Request Meeting Slot"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateThree;
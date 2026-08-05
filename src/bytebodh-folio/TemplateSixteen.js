import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Send,
  Copy,
  Check,
  Code,
  Download,
  Compass,
  QrCode
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateSixteen = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Horizon Slides defaults to White (#FFFFFF) & Soft Gray (#F8FAFC)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const touchStartRef = useRef(0);
  const wheelLockRef = useRef(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSlides = 7;

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

  // Next & Previous Slide handlers
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Convert Vertical Wheel Scroll to Horizontal Slide Movement
  useEffect(() => {
    const handleWheel = (e) => {
      if (wheelLockRef.current) return;

      if (Math.abs(e.deltaY) > 25 || Math.abs(e.deltaX) > 25) {
        wheelLockRef.current = true;
        if (e.deltaY > 0 || e.deltaX > 0) {
          goToNextSlide();
        } else {
          goToPrevSlide();
        }

        setTimeout(() => {
          wheelLockRef.current = false;
        }, 600);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Keyboard Arrow Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goToNextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToPrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
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
        subject: formData.subject.trim() || `Horizon Slides Inquiry from ${formData.name}`,
        message: formData.message.trim()
      };

      const response = await createContactMessage(payload);

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success("Message delivered successfully!");
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
          category: skill.category || "Design & Development"
        };
      }
      return {
        name: String(skill),
        proficiency: 90,
        category: "Design & Development"
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

  // Nav Slide Items
  const slidesNav = [
    { id: 0, label: "HERO", icon: User, code: "01" },
    { id: 1, label: "SKILLS", icon: Code, code: "02" },
    { id: 2, label: "ACADEMICS", icon: GraduationCap, code: "03" },
    { id: 3, label: "EXPERIENCE", icon: Briefcase, code: "04" },
    { id: 4, label: "PROJECTS", icon: FolderGit2, code: "05" },
    { id: 5, label: "CREDENTIALS", icon: Award, code: "06" },
    { id: 6, label: "CONTACT", icon: Mail, code: "07" }
  ];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`h-screen w-screen overflow-hidden font-sans transition-colors duration-500 selection:bg-[#16A34A]/20 selection:text-[#16A34A] relative ${
        isDarkMode ? "bg-[#0B0F19] text-[#F8FAFC]" : "bg-[#FFFFFF] text-[#111827]"
      }`}
    >
      {/* Subtle Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <div
          className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#16A34A]/10" : "bg-[#16A34A]/15"
          }`}
        />
        <div
          className={`absolute bottom-0 right-10 w-[550px] h-[550px] rounded-full blur-[180px] transition-colors duration-700 ${
            isDarkMode ? "bg-[#2563EB]/10" : "bg-[#2563EB]/15"
          }`}
        />
      </div>

      {/* TOP HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 h-20 flex items-center justify-between pointer-events-auto">
        {/* Emblem Logo */}
        <div
          onClick={() => setCurrentSlide(0)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A34A] via-[#22C55E] to-[#2563EB] p-[2px] shadow-md group-hover:scale-105 transition-transform duration-300">
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
              {profile?.fullName || "Horizon Slides"}
            </span>
            <span className="block text-[9px] uppercase font-mono tracking-widest text-[#2563EB] dark:text-blue-400 font-bold">
              100vw Horizontal Storytelling
            </span>
          </div>
        </div>

        {/* Slide Counter Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-xs font-mono font-bold">
          <span className="text-[#16A34A]">SLIDE 0{currentSlide + 1}</span>
          <span className="text-slate-400">/</span>
          <span>07</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
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
        </div>
      </header>

      {/* LEFT STICKY FLOATING VERTICAL NAVIGATION DOCK */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 pointer-events-auto">
        <div
          className={`p-2 rounded-full border backdrop-blur-2xl shadow-xl flex flex-col gap-3 ${
            isDarkMode ? "bg-[#111827]/80 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
          }`}
        >
          {slidesNav.map((s) => {
            const isActive = currentSlide === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(s.id)}
                className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30 font-bold"
                    : isDarkMode
                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-black hover:bg-slate-100"
                }`}
                title={`Go to ${s.label}`}
              >
                <s.icon className="w-4 h-4" />
                {/* Tooltip Label */}
                <span className="absolute left-14 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest bg-slate-900 text-white dark:bg-white dark:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                  {s.code} • {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* HORIZONTAL SLIDES VIEWPORT CONTAINER (100VW x 100VH) */}
      <motion.div
        animate={{ x: `-${currentSlide * 100}vw` }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="flex h-full w-[700vw] relative z-10"
      >
        
        {/* SLIDE 1: HERO (100vw x 100vh) */}
        <section className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-6 lg:pl-28 lg:pr-12 pt-20 pb-16">
          <div className="max-w-6xl w-full grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Large Profile Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-3 rounded-[40px] bg-gradient-to-tr from-[#16A34A] via-[#22C55E] to-[#2563EB] opacity-25 blur-2xl group-hover:opacity-45 transition duration-500" />
                <div
                  className={`relative p-3 rounded-[36px] border backdrop-blur-xl shadow-2xl transition-all ${
                    isDarkMode ? "bg-[#111827] border-slate-800" : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <div className="w-full h-80 sm:h-96 rounded-[28px] overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
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
                        <span>{profile?.fullName?.[0] || "H"}</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase mt-3 text-[#2563EB]">HORIZON SLIDES</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Brief */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] dark:bg-slate-900/60 text-[#16A34A] dark:text-[#22C55E] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Horizontal Storytelling Experience</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
                  {profile?.fullName || "Horizon Candidate"}
                </h1>
                <h2 className={`text-xl sm:text-2xl font-semibold tracking-tight ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {profile?.headline || "Senior Staff Engineer & Interactive Product Lead"}
                </h2>
              </div>

              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                {profile?.summary ||
                  "Crafting 100vw × 100vh horizontal storytelling portfolios that feel handcrafted rather than AI generated, inspired by Apple product launches, Linear, and Framer."}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
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
                    onClick={() => setCurrentSlide(6)}
                    className="px-8 py-4 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-[0_10px_25px_rgba(22,163,74,0.3)] hover:shadow-[0_15px_35px_rgba(22,163,74,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
                  >
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    <span>View Resume</span>
                  </button>
                )}

                <button
                  onClick={() => setCurrentSlide(6)}
                  className={`px-8 py-4 rounded-full font-extrabold text-sm border-2 backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 shadow-sm cursor-pointer ${
                    isDarkMode
                      ? "border-[#2563EB] text-blue-400 hover:bg-[#2563EB]/15"
                      : "border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 2: SKILLS (FLOATING CHIPS) */}
        <section className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-6 lg:pl-28 lg:pr-12 pt-20 pb-16">
          <div className="max-w-5xl w-full text-center space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
                <Code className="w-3.5 h-3.5 text-[#16A34A]" /> SLIDE 02 • CAPABILITIES
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Floating Technology Chips
              </h2>
              <p className={`text-sm max-w-xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Interactive skills formatted as animated floating technology badges with subtle glow.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {normalizedSkills.map((sk, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className={`px-7 py-4 rounded-full border backdrop-blur-xl shadow-md transition-all duration-300 flex items-center gap-3 cursor-default ${
                    isDarkMode
                      ? "bg-[#111827] border-slate-800 text-slate-200 hover:border-[#16A34A]"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] hover:border-[#16A34A]"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-[#16A34A] animate-ping" />
                  <span className="font-extrabold text-sm tracking-wide">{sk.name}</span>
                  {sk.proficiency && (
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#16A34A]/15 text-[#16A34A] dark:text-[#22C55E]">
                      {sk.proficiency}%
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 3: EDUCATION (CENTERED VERTICAL TIMELINE) */}
        <section className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-6 lg:pl-28 lg:pr-12 pt-20 pb-16">
          <div className="max-w-4xl w-full space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-[#16A34A]" /> SLIDE 03 • ACADEMICS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Education & Academic Honors
              </h2>
            </div>

            <div className="relative pl-8 border-l-2 border-[#16A34A] space-y-8 max-w-2xl mx-auto">
              {profile?.education?.map((edu, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-white dark:bg-[#0B0F19] border-2 border-[#16A34A] flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  </div>

                  <div
                    className={`p-7 rounded-[28px] border backdrop-blur-xl transition-all ${
                      isDarkMode ? "bg-[#111827]/80 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0] shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider">
                        {edu.startDate || "2020"} — {edu.endDate || "2024"}
                      </span>
                      {edu.gpa && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#16A34A]/10 text-[#16A34A]">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mb-1">{edu.degree}</h3>
                    <div className="text-sm font-semibold text-slate-500">{edu.institution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 4: EXPERIENCE (DIAGONALLY STACKED CARDS) */}
        <section className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-6 lg:pl-28 lg:pr-12 pt-20 pb-16">
          <div className="max-w-4xl w-full space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
                <Briefcase className="w-3.5 h-3.5 text-[#16A34A]" /> SLIDE 04 • EXPERIENCE
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Modern Company Cards Stacked Diagonally
              </h2>
            </div>

            <div className="space-y-6">
              {profile?.experience?.map((exp, idx) => (
                <div
                  key={idx}
                  className={`p-7 rounded-[32px] border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] shadow-lg ${
                    isDarkMode ? "bg-[#111827]/80 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                  style={{ transform: `translateX(${idx * 16}px)` }}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold tracking-tight">{exp.position || exp.role}</h3>
                    <span className="text-xs font-mono font-bold text-[#16A34A]">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#2563EB] dark:text-blue-400 mb-3">{exp.company}</div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 5: PROJECTS SHOWCASE */}
        <section className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-6 lg:pl-28 lg:pr-12 pt-20 pb-16">
          <div className="max-w-5xl w-full space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
                <FolderGit2 className="w-3.5 h-3.5 text-[#16A34A]" /> SLIDE 05 • PROJECTS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Large Project Showcase
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {profile?.projects?.slice(0, 2).map((proj, idx) => {
                const techList =
                  proj.technologies ||
                  (typeof proj.techStack === "string" ? proj.techStack.split(",") : []) ||
                  [];

                return (
                  <div
                    key={idx}
                    className={`p-7 rounded-[32px] border backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-xl ${
                      isDarkMode ? "bg-[#111827]/80 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <div className="h-44 rounded-2xl overflow-hidden bg-slate-900">
                      {proj.imageUrl || proj.image ? (
                        <img src={proj.imageUrl || proj.image} alt={proj.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-mono text-xs">
                          {proj.title}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">{proj.title}</h3>
                      <p className={`text-xs line-clamp-3 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((t, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#16A34A]/10 text-[#16A34A]">
                          {t.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      {(proj.link || proj.projectUrl) && (
                        <a
                          href={proj.link || proj.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center gap-1"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>View Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SLIDE 6: CERTIFICATIONS */}
        <section className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-6 lg:pl-28 lg:pr-12 pt-20 pb-16">
          <div className="max-w-4xl w-full space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
                <Award className="w-3.5 h-3.5 text-[#16A34A]" /> SLIDE 06 • CREDENTIALS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Premium Horizontal Cards
              </h2>
            </div>

            <div className="space-y-4">
              {profile?.certifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-[28px] border backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isDarkMode ? "bg-[#111827]/80 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0] shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-[#16A34A]/30 flex items-center justify-center text-[#16A34A]">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">{cert.name || cert.title}</h3>
                      <div className="text-xs text-slate-500">{cert.issuingOrganization} • {cert.issueDate}</div>
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1">
                      <span>Verify Certificate</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 7: CONTACT & THANK YOU */}
        <section className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-6 lg:pl-28 lg:pr-12 pt-20 pb-16">
          <div className="max-w-5xl w-full grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Thank You & Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-widest">/ SLIDE 07 • CONTACT</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
                  Thank You for Viewing
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  I am available for senior engineering leadership, technical consulting, and advisory roles.
                </p>
              </div>

              {/* Direct Info */}
              <div className="space-y-3 pt-2">
                {profile?.email && (
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <Mail className="w-4 h-4 text-[#16A34A]" />
                    <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                  </div>
                )}
                {profile?.mobileNumber && (
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <Phone className="w-4 h-4 text-[#16A34A]" />
                    <a href={`tel:${profile.mobileNumber}`} className="hover:underline">{profile.mobileNumber}</a>
                  </div>
                )}
              </div>

              {/* Social Icons */}
              {profile?.socialMediaLinks && profile.socialMediaLinks.length > 0 && (
                <div className="flex items-center gap-3 pt-1">
                  {profile.socialMediaLinks.map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.url || soc.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-[#22C55E] hover:border-[#16A34A]"
                          : "bg-white border-slate-200 text-[#16A34A] hover:border-[#16A34A] shadow-sm"
                      }`}
                      title={soc.platform}
                    >
                      {renderSocialIcon(soc.platform)}
                    </a>
                  ))}
                </div>
              )}

              {/* QR Code Placeholder */}
              <div className="pt-2 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  <QrCode className="w-10 h-10 text-[#16A34A]" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  SCAN FOR DIRECT RECRUITER VCARD
                </span>
              </div>
            </div>

            {/* Right Recruiter Contact Form */}
            <div
              className={`lg:col-span-7 p-8 rounded-[32px] border backdrop-blur-xl shadow-2xl ${
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
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${
                        isDarkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-[#F8FAFC] border-[#E2E8F0] text-black"
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
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${
                        isDarkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-[#F8FAFC] border-[#E2E8F0] text-black"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Hi, I viewed Horizon Slides and would like to connect..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none resize-none ${
                      isDarkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-[#F8FAFC] border-[#E2E8F0] text-black"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          </div>
        </section>

      </motion.div>

      {/* BOTTOM SLIDE CONTROLS & PROGRESS BAR */}
      <div className="fixed bottom-6 left-6 right-6 z-40 flex items-center justify-between pointer-events-auto">
        {/* Slide Progress Bar */}
        <div className="w-36 sm:w-64 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-[#16A34A]"
            animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Prev / Next Slide Arrow Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 ${
              isDarkMode ? "bg-[#111827] border-slate-800 text-white hover:border-[#16A34A]" : "bg-white border-[#E2E8F0] text-black hover:border-[#16A34A] shadow-md"
            }`}
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextSlide}
            disabled={currentSlide === totalSlides - 1}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 ${
              isDarkMode ? "bg-[#111827] border-slate-800 text-white hover:border-[#16A34A]" : "bg-white border-[#E2E8F0] text-black hover:border-[#16A34A] shadow-md"
            }`}
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSixteen;

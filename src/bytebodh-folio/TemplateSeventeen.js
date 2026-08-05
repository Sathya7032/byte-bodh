import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
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
  Pin,
  LayoutGrid
} from "lucide-react";
import { toast } from "react-toastify";
import { createContactMessage } from "../api/profileService";

const TemplateSeventeen = ({ profile }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Metro Flow defaults to White (#FFFFFF) & Soft Light Gray (#F8FAFC)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePanel, setActivePanel] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const workspaceRef = useRef(null);

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

  // Convert Vertical Wheel Scroll to Horizontal Track Movement
  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.5;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Update Travel Progress Line
  const handleScroll = () => {
    const el = workspaceRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const progress = (el.scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);

      // Section indicator calculation
      const panelIndex = Math.min(6, Math.floor((el.scrollLeft / maxScroll) * 7));
      setActivePanel(panelIndex);
    }
  };

  // Scroll to Specific Workspace Panel
  const scrollToPanelIndex = (index) => {
    const el = workspaceRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const targetX = (maxScroll / 6) * index;
    el.scrollTo({ left: targetX, behavior: "smooth" });
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
        subject: formData.subject.trim() || `Metro Flow Inquiry from ${formData.name}`,
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
          proficiency: skill.proficiency || skill.level || 92,
          category: skill.category || "Fluent Systems"
        };
      }
      return {
        name: String(skill),
        proficiency: 92,
        category: "Fluent Systems"
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

  // Workspace Panel Navigation Config
  const panelNav = [
    { id: 0, label: "Welcome", icon: User },
    { id: 1, label: "Skills", icon: Code },
    { id: 2, label: "Projects", icon: FolderGit2 },
    { id: 3, label: "Education", icon: GraduationCap },
    { id: 4, label: "Experience", icon: Briefcase },
    { id: 5, label: "Certificates", icon: Award },
    { id: 6, label: "Contact", icon: Mail }
  ];

  return (
    <div
      className={`h-screen w-screen overflow-hidden font-sans transition-colors duration-500 selection:bg-[#16A34A]/20 selection:text-[#16A34A] relative ${
        isDarkMode ? "bg-[#0B0F19] text-[#F8FAFC]" : "bg-[#FFFFFF] text-[#111827]"
      }`}
    >
      {/* Fluent Subtle Background Orbs */}
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
          onClick={() => scrollToPanelIndex(0)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A34A] via-[#22C55E] to-[#2563EB] p-[2px] shadow-md group-hover:scale-105 transition-transform duration-300">
            <div
              className={`w-full h-full rounded-[14px] flex items-center justify-center font-extrabold text-sm transition-colors ${
                isDarkMode ? "bg-[#0B0F19] text-[#22C55E]" : "bg-white text-[#16A34A]"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5 font-serif">
              {profile?.fullName || "Metro Flow"}
            </span>
            <span className="block text-[9px] uppercase font-mono tracking-widest text-[#16A34A] font-bold">
              Microsoft Fluent Horizontal Workspace
            </span>
          </div>
        </div>

        {/* Panel Jump Links */}
        <nav
          className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-lg ${
            isDarkMode ? "bg-[#111827]/70 border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0]"
          }`}
        >
          {panelNav.map((p) => {
            const isActive = activePanel === p.id;
            return (
              <button
                key={p.id}
                onClick={() => scrollToPanelIndex(p.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? isDarkMode
                      ? "bg-[#16A34A]/20 text-[#22C55E] font-bold border border-[#16A34A]/40"
                      : "bg-white text-[#16A34A] font-bold shadow-sm border border-[#16A34A]/30"
                    : isDarkMode
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <p.icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </nav>

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

      {/* FLOATING SOCIAL LINKS DOCK (FOLLOWS VIEWPORT) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-auto">
        <div
          className={`p-2 rounded-full border backdrop-blur-2xl shadow-xl flex flex-col gap-3 ${
            isDarkMode ? "bg-[#111827]/80 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
          }`}
        >
          {profile?.socialMediaLinks?.map((soc, idx) => (
            <motion.a
              key={idx}
              href={soc.url || soc.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isDarkMode
                  ? "text-[#22C55E] hover:bg-slate-800"
                  : "text-[#16A34A] hover:bg-slate-100"
              }`}
              title={soc.platform}
            >
              {renderSocialIcon(soc.platform)}
            </motion.a>
          ))}
        </div>
      </div>

      {/* INFINITE HORIZONTAL WORKSPACE TRACK */}
      <div
        ref={workspaceRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-x-auto overflow-y-hidden flex items-center gap-16 px-6 lg:px-24 pt-20 pb-20 scrollbar-none relative z-10"
      >
        
        {/* PANEL 1: LARGE WELCOME PANEL */}
        <section className="w-[85vw] sm:w-[65vw] lg:w-[50vw] flex-shrink-0 h-[80vh] flex items-center">
          <div
            className={`w-full h-full p-8 sm:p-12 rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between transition-all shadow-xl ${
              isDarkMode ? "bg-[#111827]/75 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Large Square Profile Photo */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[28px] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[#16A34A]/30 shadow-lg shrink-0">
                {profile?.pictureUrl || profile?.photo ? (
                  <img
                    src={profile.pictureUrl || profile.photo}
                    alt={profile.fullName || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center font-extrabold text-4xl ${
                      isDarkMode ? "bg-[#111827] text-[#22C55E]" : "bg-[#F8FAFC] text-[#16A34A]"
                    }`}
                  >
                    <span>{profile?.fullName?.[0] || "M"}</span>
                    <span className="text-[9px] font-mono tracking-widest uppercase mt-2 text-[#2563EB]">METRO FLOW</span>
                  </div>
                )}
              </div>

              {/* Name & Headline */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] dark:bg-slate-900/60 text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Microsoft Fluent Workspace
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  {profile?.fullName || "Metro Candidate"}
                </h1>
                <h2 className={`text-base sm:text-lg font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {profile?.headline || "Principal Product Designer & Systems Engineer"}
                </h2>
              </div>
            </div>

            {/* Introduction Summary */}
            <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              {profile?.summary ||
                "Welcome to Metro Flow — an infinite horizontal workspace inspired by Microsoft Fluent Design, Vercel, and Notion. Scroll left-to-right to explore capabilities, project gallery, education, and connected dashboard modules."}
            </p>

            {/* CTAs with Gradient Borders */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {profile?.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#2563EB] text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              ) : (
                <button
                  onClick={() => scrollToPanelIndex(6)}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#2563EB] text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>View Resume</span>
                </button>
              )}

              <button
                onClick={() => scrollToPanelIndex(6)}
                className={`px-8 py-3.5 rounded-full font-extrabold text-xs tracking-wider uppercase border-2 transition-all flex items-center gap-2 ${
                  isDarkMode
                    ? "border-[#2563EB] text-blue-400 hover:bg-[#2563EB]/10"
                    : "border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10"
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </button>
            </div>
          </div>
        </section>

        {/* PANEL 2: SMALL SKILLS WIDGETS */}
        <section className="w-[75vw] sm:w-[50vw] lg:w-[35vw] flex-shrink-0 h-[80vh] flex items-center">
          <div
            className={`w-full h-full p-8 rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between shadow-xl ${
              isDarkMode ? "bg-[#111827]/75 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold mb-3">
                <Code className="w-3.5 h-3.5" /> SKILLS WIDGET
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">Capabilities & Stack</h2>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Circular floating pills with hover animations and proficiency meters.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 my-auto">
              {normalizedSkills.map((sk, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className={`px-4 py-2.5 rounded-full border backdrop-blur-xl transition-all flex items-center gap-2 cursor-default ${
                    isDarkMode
                      ? "bg-[#0B0F19] border-slate-800 text-slate-200 hover:border-[#16A34A]"
                      : "bg-[#F8FAFC] border-[#E2E8F0] text-[#111827] hover:border-[#16A34A] shadow-sm"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span className="font-bold text-xs">{sk.name}</span>
                  {sk.proficiency && (
                    <span className="text-[10px] font-mono font-bold text-[#16A34A] dark:text-[#22C55E]">
                      {sk.proficiency}%
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              CONTINUE SCROLLING RIGHT →
            </div>
          </div>
        </section>

        {/* PANEL 3: LARGE PROJECT GALLERY (OVERSIZED LANDSCAPE CARDS) */}
        <section className="w-[120vw] sm:w-[90vw] lg:w-[75vw] flex-shrink-0 h-[80vh] flex items-center">
          <div
            className={`w-full h-full p-8 rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between shadow-xl ${
              isDarkMode ? "bg-[#111827]/75 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold mb-2">
                <FolderGit2 className="w-3.5 h-3.5" /> OVERSIZED LANDSCAPE GALLERY
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Featured Projects Showcase</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 my-auto">
              {profile?.projects?.slice(0, 2).map((proj, idx) => {
                const techList =
                  proj.technologies ||
                  (typeof proj.techStack === "string" ? proj.techStack.split(",") : []) ||
                  [];

                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-[24px] border backdrop-blur-xl flex flex-col justify-between space-y-4 shadow-md transition-all hover:border-[#16A34A]/60 ${
                      isDarkMode ? "bg-[#0B0F19] border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <div className="h-44 rounded-xl overflow-hidden bg-slate-900 relative">
                      {proj.imageUrl || proj.image ? (
                        <img src={proj.imageUrl || proj.image} alt={proj.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-mono text-xs">
                          {proj.title}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-1">{proj.title}</h3>
                      <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
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

                    {(proj.link || proj.projectUrl || proj.githubUrl) && (
                      <a
                        href={proj.link || proj.projectUrl || proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#15803D] transition-colors"
                      >
                        <span>Visit Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">
              CONTINUE SCROLLING RIGHT →
            </div>
          </div>
        </section>

        {/* PANEL 4: EDUCATION TIMELINE (SUBTLE CURVED CONNECTORS) */}
        <section className="w-[85vw] sm:w-[60vw] lg:w-[45vw] flex-shrink-0 h-[80vh] flex items-center">
          <div
            className={`w-full h-full p-8 rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between shadow-xl ${
              isDarkMode ? "bg-[#111827]/75 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold mb-2">
                <GraduationCap className="w-3.5 h-3.5" /> ACADEMIC TIMELINE
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Floating Education Cards</h2>
            </div>

            <div className="relative pl-6 border-l-2 border-[#16A34A] space-y-6 my-auto">
              {profile?.education?.map((edu, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-2 w-4 h-4 rounded-full bg-white dark:bg-[#0B0F19] border-2 border-[#16A34A]" />

                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isDarkMode ? "bg-[#0B0F19] border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0] shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#16A34A]">
                        {edu.startDate} — {edu.endDate}
                      </span>
                      {edu.gpa && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#16A34A]/10 text-[#16A34A]">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold mb-1">{edu.degree}</h3>
                    <div className="text-xs text-slate-500">{edu.institution}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">
              CONTINUE SCROLLING RIGHT →
            </div>
          </div>
        </section>

        {/* PANEL 5: EXPERIENCE DASHBOARD MODULES */}
        <section className="w-[110vw] sm:w-[85vw] lg:w-[65vw] flex-shrink-0 h-[80vh] flex items-center">
          <div
            className={`w-full h-full p-8 rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between shadow-xl ${
              isDarkMode ? "bg-[#111827]/75 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold mb-2">
                <Briefcase className="w-3.5 h-3.5" /> FLUENT DASHBOARD MODULES
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Connected Experience Modules</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 my-auto">
              {profile?.experience?.map((exp, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-[24px] border backdrop-blur-xl transition-all hover:border-[#16A34A]/60 shadow-md ${
                    isDarkMode ? "bg-[#0B0F19] border-slate-800" : "bg-[#F8FAFC] border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#16A34A] to-[#2563EB] p-0.5">
                      <div className="w-full h-full rounded-[10px] bg-white dark:bg-[#0B0F19] flex items-center justify-center text-[#16A34A] font-bold text-xs">
                        {exp.company?.[0] || "C"}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-1">{exp.position || exp.role}</h3>
                  <div className="text-xs font-bold text-[#2563EB] mb-3">{exp.company}</div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">
              CONTINUE SCROLLING RIGHT →
            </div>
          </div>
        </section>

        {/* PANEL 6: CERTIFICATES WALL (PINNED STICKY NOTES BOARD) */}
        <section className="w-[85vw] sm:w-[60vw] lg:w-[45vw] flex-shrink-0 h-[80vh] flex items-center">
          <div
            className={`w-full h-full p-8 rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between shadow-xl ${
              isDarkMode ? "bg-[#111827]/75 border-slate-800" : "bg-white/85 border-[#E2E8F0]"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold mb-2">
                <Pin className="w-3.5 h-3.5" /> PINNED DIGITAL BOARD
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Certificates Sticky Wall</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 my-auto">
              {profile?.certifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border relative transition-all hover:rotate-1 shadow-md ${
                    isDarkMode ? "bg-[#0B0F19] border-slate-800" : "bg-[#FFFDF5] border-[#FED7AA]"
                  }`}
                >
                  <div className="absolute top-2 right-2 text-[#16A34A]">
                    <Pin className="w-4 h-4 rotate-45" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#16A34A] block mb-1">
                    {cert.issueDate || "2024"}
                  </span>
                  <h3 className="text-sm font-bold mb-1">{cert.name || cert.title}</h3>
                  <div className="text-[11px] text-slate-500 mb-2">{cert.issuingOrganization}</div>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">
              FINAL PANEL NEXT →
            </div>
          </div>
        </section>

        {/* PANEL 7: CONTACT PANEL (END) */}
        <section className="w-[100vw] sm:w-[75vw] lg:w-[55vw] flex-shrink-0 h-[80vh] flex items-center pr-12">
          <div
            className={`w-full h-full p-8 sm:p-10 rounded-[28px] border backdrop-blur-2xl flex flex-col justify-between shadow-2xl ${
              isDarkMode ? "bg-[#111827]/85 border-slate-800" : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#16A34A]/30 bg-[#F8FAFC] text-[#16A34A] dark:text-[#22C55E] text-xs font-mono uppercase tracking-widest font-bold mb-2">
                <Mail className="w-3.5 h-3.5" /> RECRUITER DISPATCH
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">Connect with Candidate</h2>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Send a direct backend message to complete your workspace tour.
              </p>
            </div>

            <form onSubmit={handleSubmitContact} className="space-y-3.5 my-auto">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      isDarkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-[#F8FAFC] border-[#E2E8F0] text-black"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      isDarkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-[#F8FAFC] border-[#E2E8F0] text-black"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold mb-1">Message *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Hi, I completed the Metro Flow workspace tour and would like to connect..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none resize-none ${
                    isDarkMode ? "bg-[#0B0F19] border-slate-800 text-white" : "bg-[#F8FAFC] border-[#E2E8F0] text-black"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs tracking-widest uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

            <div className="flex items-center justify-between text-[11px] font-bold">
              <span>© {new Date().getFullYear()} {profile?.fullName || "Metro Flow"}</span>
              <button
                onClick={() => scrollToPanelIndex(0)}
                className="text-[#16A34A] hover:underline"
              >
                ← BACK TO START
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* BOTTOM WORKSPACE TRAVEL PROGRESS LINE */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-2 bg-slate-200 dark:bg-slate-800 pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#2563EB]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};

export default TemplateSeventeen;

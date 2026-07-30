import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaGraduationCap,
  FaBriefcase,
  FaProjectDiagram,
  FaTools,
  FaHome,
  FaUser,
  FaCode,
  FaDatabase,
  FaCloud,
  FaServer,
  FaMobile,
  FaPalette,
  FaChevronRight,
  FaChevronUp,
  FaExternalLinkAlt,
  FaCertificate,
  FaShareAlt,
  FaDownload,
  FaCopy,
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn,
  FaFacebook,
  FaSun,
  FaMoon
} from "react-icons/fa";
import { 
  SiJavascript, 
  SiPython, 
  SiReact, 
  SiNodedotjs, 
  SiSpringboot,
  SiMysql,
  SiMongodb,
  SiDocker,
  SiKubernetes,
  SiGooglecloud,
  SiGit,
  SiLeetcode,
  SiTypescript,
  SiTailwindcss,
  SiAmazon
} from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";
import { createContactMessage } from "../api/profileService";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";

const TemplateThree = ({ profile }) => {
  const { username: routeUsername } = useParams();

  const getUsernameFromDomain = () => {
    const hostname = window.location.hostname;
    // For local development (e.g., username.localhost)
    if (hostname.endsWith(".localhost")) {
      const subdomain = hostname.replace(".localhost", "");
      return subdomain && subdomain !== "www" ? subdomain : null;
    }
    // For production (e.g., username.bytebodh.in)
    if (hostname.endsWith(".bytebodh.in")) {
      const subdomain = hostname.replace(".bytebodh.in", "");
      return subdomain && subdomain !== "www" ? subdomain : null;
    }
    return null;
  };

  const username = routeUsername || getUsernameFromDomain() || "user";
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [copied, setCopied] = useState(false);

  // Toggle Theme Mode
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Dynamic Color Palette
  const colors = useMemo(() => ({
    primary: {
      light: "#818cf8", // Indigo 400
      main: "#6366f1",  // Indigo 500
      dark: "#4f46e5",  // Indigo 600
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
    },
    secondary: {
      light: "#fdba74", // Orange 300
      main: "#f97316",  // Orange 500
      dark: "#ea580c",  // Orange 600
      gradient: "linear-gradient(135deg, #fdba74 0%, #f97316 100%)"
    },
    accent: {
      light: "#34d399", // Emerald 400
      main: "#10b981",  // Emerald 500
      dark: "#059669",  // Emerald 600
      gradient: "linear-gradient(135deg, #34d399 0%, #059669 100%)"
    }
  }), []);

  const sections = useMemo(() => [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "skills", label: "Skills", icon: <FaTools /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
    { id: "experience", label: "Experience", icon: <FaBriefcase /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
    { id: "contact", label: "Contact", icon: <FaUser /> },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Set current URL for QR code
    setQrCodeValue(window.location.href);

    // Observe sections for active navigation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [sections]);

  const getInitials = (fullName) => {
    if (!fullName) return "";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
        theme: isDarkMode ? "dark" : "light"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData = {
        id: profile?.user?.id,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        recipientUsername: username
      };

      const response = await createContactMessage(contactData);
      
      if (response.data?.success) {
        toast.success("Message sent successfully! I'll get back to you soon.", {
          position: "top-right",
          autoClose: 5000,
          theme: isDarkMode ? "dark" : "light"
        });

        setFormData({
          name: "",
          email: "",
          message: ""
        });
      } else {
        throw new Error(response.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      toast.error(
        error.response?.data?.message || 
        "Failed to send message. Please try again later.", 
        {
          position: "top-right",
          autoClose: 5000,
          theme: isDarkMode ? "dark" : "light"
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!", {
      position: "top-right",
      autoClose: 2000,
      theme: isDarkMode ? "dark" : "light"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        saveAs(blob, `${username}-portfolio-qr.png`);
      });
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${profile?.fullName}'s portfolio!`);
    
    let shareUrl = "";
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const getSkillIcon = (skill) => {
    if (!skill) return <FaCode className="w-6 h-6" />;
    
    const skillLower = skill.toLowerCase();
    const iconProps = { className: "w-6 h-6" };
    
    if (skillLower.includes("javascript")) return <SiJavascript {...iconProps} />;
    if (skillLower.includes("typescript")) return <SiTypescript {...iconProps} />;
    if (skillLower.includes("python")) return <SiPython {...iconProps} />;
    if (skillLower.includes("react")) return <SiReact {...iconProps} />;
    if (skillLower.includes("next")) return <TbBrandNextjs {...iconProps} />;
    if (skillLower.includes("node")) return <SiNodedotjs {...iconProps} />;
    if (skillLower.includes("spring")) return <SiSpringboot {...iconProps} />;
    if (skillLower.includes("mysql")) return <SiMysql {...iconProps} />;
    if (skillLower.includes("mongodb")) return <SiMongodb {...iconProps} />;
    if (skillLower.includes("docker")) return <SiDocker {...iconProps} />;
    if (skillLower.includes("kubernetes")) return <SiKubernetes {...iconProps} />;
    if (skillLower.includes("aws")) return <SiAmazon {...iconProps} />;
    if (skillLower.includes("gcp") || skillLower.includes("google cloud")) return <SiGooglecloud {...iconProps} />;
    if (skillLower.includes("git")) return <SiGit {...iconProps} />;
    if (skillLower.includes("tailwind")) return <SiTailwindcss {...iconProps} />;
    if (skillLower.includes("ui/ux") || skillLower.includes("design")) return <FaPalette {...iconProps} />;
    if (skillLower.includes("mobile")) return <FaMobile {...iconProps} />;
    if (skillLower.includes("database")) return <FaDatabase {...iconProps} />;
    if (skillLower.includes("cloud")) return <FaCloud {...iconProps} />;
    if (skillLower.includes("server")) return <FaServer {...iconProps} />;
    
    return <FaCode {...iconProps} />;
  };

  const iconByPlatform = (platform) => {
    switch (platform) {
      case "LINKEDIN":
        return <FaLinkedin className="w-5 h-5" />;
      case "GITHUB":
        return <FaGithub className="w-5 h-5" />;
      case "LEETCODE":
        return <SiLeetcode className="w-5 h-5" />;
      case "PORTFOLIO":
        return <FaGlobe className="w-5 h-5" />;
      default:
        return <FaGlobe className="w-5 h-5" />;
    }
  };

  const skills = profile?.skills || [];
  const socialMediaLinks = profile?.socialMediaLinks || [];
  const projects = profile?.projects || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const certifications = profile?.certifications || [];

  const getSkillCategory = (skill) => {
    if (!skill) return "Other";
    const skillLower = typeof skill === "object" ? (skill.name || "").toLowerCase() : skill.toLowerCase();
    
    const backendKeywords = [
      "java", "spring", "node", "express", "python", "django", "flask",
      "php", "laravel", "ruby", "rails", "c#", "dotnet", "asp.net",
      "go", "golang", "rust", "api", "rest", "graphql", "microservices",
      "serverless", "aws", "azure", "gcp", "docker", "kubernetes", "jenkins",
      "ci/cd", "nginx", "apache", "mysql", "mongodb", "postgresql", "redis",
      "elasticsearch", "kafka", "rabbitmq"
    ];
    
    const frontendKeywords = [
      "react", "angular", "vue", "next", "javascript", "typescript", "html",
      "css", "sass", "less", "tailwind", "bootstrap", "material-ui", "chakra",
      "redux", "zustand", "context", "jquery", "webpack", "vite", "babel",
      "figma", "photoshop", "illustrator", "ui/ux", "responsive", "mobile",
      "pwa", "spa", "webgl", "three.js", "gsap", "animation"
    ];
    
    for (const keyword of backendKeywords) {
      if (skillLower.includes(keyword)) return "Backend";
    }
    
    for (const keyword of frontendKeywords) {
      if (skillLower.includes(keyword)) return "Frontend";
    }
    
    return "Other";
  };

  const categorizedSkills = {
    Backend: [],
    Frontend: [],
    Other: []
  };

  skills.forEach(skillItem => {
    const skillName = typeof skillItem === "object" ? skillItem.name : skillItem;
    const category = getSkillCategory(skillName);
    categorizedSkills[category].push(skillName);
  });

  const filteredCategories = Object.fromEntries(
    Object.entries(categorizedSkills).filter(([_, skillList]) => skillList.length > 0)
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case "Backend":
        return { 
          bg: isDarkMode ? "from-red-950/30 to-orange-950/30" : "from-red-50 to-orange-50", 
          text: isDarkMode ? "text-red-400" : "text-red-600", 
          border: isDarkMode ? "border-red-900/40" : "border-red-200",
          gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)"
        };
      case "Frontend":
        return { 
          bg: isDarkMode ? "from-blue-950/30 to-cyan-950/30" : "from-blue-50 to-cyan-50", 
          text: isDarkMode ? "text-blue-400" : "text-blue-600", 
          border: isDarkMode ? "border-blue-900/40" : "border-blue-200",
          gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)"
        };
      default:
        return { 
          bg: isDarkMode ? "from-slate-900 to-slate-950" : "from-slate-100 to-slate-200", 
          text: isDarkMode ? "text-slate-400" : "text-slate-700", 
          border: isDarkMode ? "border-slate-800" : "border-slate-300",
          gradient: "linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(71, 85, 105, 0.2) 100%)"
        };
    }
  };

  // Share Modal Component
  const ShareModal = () => (
    <AnimatePresence>
      {showShareModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
                isDarkMode ? "bg-[#0d101a] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                    Share Portfolio
                  </h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center mb-8">
                  <div className={`p-4 rounded-xl border shadow-sm mb-4 ${isDarkMode ? "bg-white border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <QRCode
                      id="qr-code-svg"
                      value={qrCodeValue}
                      size={180}
                      level="H"
                      fgColor={colors.primary.dark}
                      bgColor="white"
                    />
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Scan to visit portfolio
                  </p>
                </div>

                {/* Share Links */}
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      Share Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={qrCodeValue}
                        className={`flex-1 px-4 py-2 border rounded-lg text-sm outline-none ${
                          isDarkMode ? "border-slate-800 bg-slate-950 text-slate-300" : "border-slate-300 bg-slate-50 text-slate-800"
                        }`}
                      />
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <FaCopy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      Share on Social Media
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { id: "twitter", name: "Twitter", icon: FaTwitter, iconColor: "text-blue-400" },
                        { id: "linkedin", name: "LinkedIn", icon: FaLinkedinIn, iconColor: "text-blue-600" },
                        { id: "facebook", name: "Facebook", icon: FaFacebook, iconColor: "text-blue-700" },
                        { id: "whatsapp", name: "WhatsApp", icon: FaWhatsapp, iconColor: "text-emerald-500" }
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => shareOnSocial(s.id)}
                          className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group ${
                            isDarkMode
                              ? "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <s.icon className={`w-5 h-5 mb-1 ${s.iconColor}`} />
                          <span className="text-[10px] font-semibold">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Download QR Code */}
                  <div className={`pt-4 border-t ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <button
                      onClick={downloadQRCode}
                      className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 selection:bg-indigo-500/20 selection:text-indigo-400 ${
        isDarkMode ? "bg-[#07090e] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      <ToastContainer position="bottom-right" theme={isDarkMode ? "dark" : "light"} />
      <ShareModal />

      {/* TOP BAR */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? "bg-[#090b14]/90 shadow-2xl border-b border-slate-800/80 backdrop-blur-md"
              : "bg-white/90 shadow-md border-b border-slate-200/80 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Name */}
            <div className="flex items-center gap-3">
              {profile?.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName || "User"}
                  className="w-10 h-10 rounded-full border-2 border-indigo-500/40 object-cover shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md" style={{ background: colors.primary.gradient }}>
                  {getInitials(profile?.fullName)}
                </div>
              )}
              <div>
                <h1 className={`text-base font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {profile?.fullName || "User Profile"}
                </h1>
                <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  @{profile?.user?.username || username}
                </p>
              </div>
            </div>

            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-white shadow-sm"
                          : isDarkMode
                            ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                      style={isActive ? { background: colors.primary.gradient } : {}}
                    >
                      <span className="text-sm">{section.icon}</span>
                      <span>{section.label}</span>
                    </a>
                  );
                })}
              </nav>
              
              {/* Light/Dark Mode Switcher */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800"
                    : "bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200 shadow-sm"
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-xs font-semibold shadow-md hover:shadow-lg text-white"
                style={{ background: colors.secondary.gradient }}
              >
                <FaShareAlt className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 text-amber-400"
                    : "bg-slate-100 border-slate-300 text-indigo-600 shadow-sm"
                }`}
              >
                {isDarkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg border ${
                  isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1">
                  <span className={`w-5 h-0.5 transition-all ${isDarkMode ? "bg-slate-300" : "bg-slate-700"} ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                  <span className={`w-5 h-0.5 transition-all ${isDarkMode ? "bg-slate-300" : "bg-slate-700"} ${isMenuOpen ? "opacity-0" : ""}`}></span>
                  <span className={`w-5 h-0.5 transition-all ${isDarkMode ? "bg-slate-300" : "bg-slate-700"} ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-b ${
                isDarkMode ? "bg-[#090b14] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-lg"
              }`}
            >
              <div className="px-4 py-3 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      activeSection === section.id
                        ? "text-white"
                        : isDarkMode
                          ? "text-slate-400 hover:bg-slate-800/50"
                          : "text-slate-600 hover:bg-slate-100"
                    }`}
                    style={activeSection === section.id ? { background: colors.primary.gradient } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <span>{section.icon}</span>
                      <span>{section.label}</span>
                    </div>
                    <FaChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
                
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-md mt-2"
                  style={{ background: colors.secondary.gradient }}
                >
                  <FaShareAlt className="w-3.5 h-3.5" />
                  <span>Share Portfolio</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, ${isDarkMode ? "#6366f133" : "#6366f120"} 1px, transparent 1px), linear-gradient(${isDarkMode ? "#6366f133" : "#6366f120"} 1px, transparent 1px)`,
              backgroundSize: "40px 40px"
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="relative group shrink-0">
              <div
                className="absolute -inset-2 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-xl"
                style={{ background: colors.primary.gradient }}
              ></div>
              <div className="relative">
                {profile?.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.fullName || "User Avatar"}
                    className={`w-56 h-56 lg:w-64 lg:h-64 rounded-full object-cover border-4 shadow-2xl ${
                      isDarkMode ? "border-slate-800 bg-slate-900" : "border-white bg-slate-100"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-56 h-56 lg:w-64 lg:h-64 rounded-full border-4 shadow-2xl flex items-center justify-center text-white ${
                      isDarkMode ? "border-slate-800" : "border-white"
                    }`}
                    style={{ background: colors.primary.gradient }}
                  >
                    <span className="text-6xl font-bold">
                      {getInitials(profile?.fullName)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Content */}
            <div className="flex-1 text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 border ${
                  isDarkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Available for opportunities</span>
              </div>

              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Hi, I'm{" "}
                <span
                  style={{
                    background: colors.primary.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {profile?.fullName || "Developer"}
                </span>
              </h1>

              <h2 className={`text-xl lg:text-2xl font-bold mb-5 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                {profile?.headline || "Full Stack Software Engineer"}
              </h2>

              <p className={`text-sm sm:text-base mb-8 max-w-2xl leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                {profile?.summary || "Passionate engineer producing performant code systems, modern applications, and scalable web solutions."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg hover:shadow-indigo-500/25 transition-all group"
                  style={{ background: colors.primary.gradient }}
                >
                  <span>View My Work</span>
                  <FaChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#contact"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold border transition-all ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800"
                      : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm"
                  }`}
                >
                  Get In Touch
                </a>
              </div>

              {/* Social Links */}
              {socialMediaLinks.length > 0 && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {socialMediaLinks.map((link, index) => (
                    <motion.a
                      key={link.id || index}
                      href={link.profileUrl || link.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                        isDarkMode
                          ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40"
                          : "bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-sm"
                      }`}
                      title={link.platform}
                    >
                      {iconByPlatform(link.platform)}
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      {skills.length > 0 && (
        <section id="skills" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-2xl lg:text-3xl font-extrabold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Technical Expertise
              </h2>
              <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Proficient in modern technologies, stacks, and developer tools
              </p>
            </div>

            <div className="space-y-10">
              {Object.entries(filteredCategories).map(([category, categorySkills]) => {
                const colorsCat = getCategoryColor(category);
                return (
                  <div key={category}>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${colorsCat.text}`}>
                      <div className="p-2 rounded-lg border" style={{ background: colorsCat.gradient, borderColor: colorsCat.border }}>
                        <FaTools className="w-4 h-4 text-white" />
                      </div>
                      {category} Stack
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categorySkills.map((skillName, index) => (
                        <motion.div
                          key={skillName + index}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -4 }}
                          className="group"
                        >
                          <div
                            className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                              isDarkMode
                                ? "bg-[#0d101a]/80 border-slate-800/80 hover:bg-[#121624] hover:border-indigo-500/30"
                                : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300"
                            }`}
                          >
                            <div
                              className="p-2.5 rounded-xl border shrink-0 text-white"
                              style={{ background: colorsCat.gradient, borderColor: colorsCat.border }}
                            >
                              {getSkillIcon(skillName)}
                            </div>
                            <span className={`text-xs font-bold truncate ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                              {skillName}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projects.length > 0 && (
        <section id="projects" className={`py-16 ${isDarkMode ? "bg-[#0a0d16]/50" : "bg-slate-100/60"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-2xl lg:text-3xl font-extrabold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Featured Projects
              </h2>
              <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Showcasing built products, architecture, and live projects
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <div
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col h-full ${
                      isDarkMode
                        ? "bg-[#0d101a] border-slate-800/90 hover:border-indigo-500/30"
                        : "bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300"
                    }`}
                  >
                    {/* Project Gradient Banner */}
                    <div
                      className="h-32 relative flex items-center justify-center p-4"
                      style={{ background: colors.primary.gradient }}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                      <h3 className="text-lg font-bold text-white text-center relative z-10 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl w-full truncate">
                        {project.title || "Project Title"}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {project.description || "No project description available."}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {(project.technologies || project.techStack?.split(",") || []).map((tech, i) => (
                            <span
                              key={i}
                              className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${
                                isDarkMode
                                  ? "bg-slate-900 border-slate-800 text-indigo-300"
                                  : "bg-indigo-50 border-indigo-200 text-indigo-700"
                              }`}
                            >
                              {typeof tech === "string" ? tech.trim() : tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {(project.projectUrl || project.link) && (
                        <a
                          href={project.projectUrl || project.link}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            isDarkMode
                              ? "bg-slate-950 border-slate-800 text-indigo-400 hover:bg-slate-900"
                              : "bg-slate-50 border-slate-200 text-indigo-600 hover:bg-slate-100"
                          }`}
                        >
                          <span>View Project</span>
                          <FaExternalLinkAlt className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EXPERIENCE SECTION */}
      {experience.length > 0 && (
        <section id="experience" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-2xl lg:text-3xl font-extrabold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Professional Experience
              </h2>
              <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Work history, engineering roles, and achievements
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className={`p-6 lg:p-8 rounded-2xl border transition-all ${
                    isDarkMode
                      ? "bg-[#0d101a] border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {exp.position || exp.jobTitle || "Engineer"}
                      </h3>
                      <div className={`text-xs font-bold mt-0.5 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-full border self-start sm:self-auto uppercase tracking-wider ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-400"
                          : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}
                    >
                      {exp.startDate || exp.startYear} — {exp.endDate || exp.endYear || "Present"}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed whitespace-pre-wrap ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION & CERTIFICATIONS */}
      {(education.length > 0 || certifications.length > 0) && (
        <section id="education" className={`py-16 ${isDarkMode ? "bg-[#0a0d16]/50" : "bg-slate-100/60"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Education Column */}
              {education.length > 0 && (
                <div>
                  <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <FaGraduationCap className="text-indigo-500" /> Education
                  </h3>

                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border transition-all ${
                          isDarkMode ? "bg-[#0d101a] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        <h4 className={`font-bold text-base ${isDarkMode ? "text-white" : "text-slate-900"}`}>{edu.degree}</h4>
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{edu.institution}</p>
                        {edu.fieldOfStudy && (
                          <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                            Field: {edu.fieldOfStudy}
                          </p>
                        )}
                        <div className={`mt-3 text-[10px] font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                          {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear} {edu.gpa && `• GPA: ${edu.gpa}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Column */}
              {certifications.length > 0 && (
                <div id="certifications">
                  <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <FaCertificate className="text-emerald-500" /> Certifications
                  </h3>

                  <div className="space-y-4">
                    {certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className={`p-6 rounded-2xl border transition-all ${
                          isDarkMode ? "bg-[#0d101a] border-slate-800" : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        <h4 className={`font-bold text-base ${isDarkMode ? "text-white" : "text-slate-900"}`}>{cert.name}</h4>
                        <p className={`text-xs mt-1 uppercase font-semibold ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                          {cert.issuingOrganization || cert.issuer}
                        </p>
                        {cert.issueDate && (
                          <p className={`text-[10px] mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                            Issued: {cert.issueDate}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-2xl lg:text-3xl font-extrabold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Get In Touch
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              Have a question or proposal? Send a message directly.
            </p>
          </div>

          <div
            className={`p-6 sm:p-10 rounded-3xl border shadow-xl ${
              isDarkMode ? "bg-[#0d101a] border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-500"
                    }`}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-500"
                    }`}
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all resize-none ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800 text-white focus:border-indigo-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-indigo-500"
                  }`}
                  placeholder="Hello, I'd like to talk about..."
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-xl font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-indigo-500/20"
                }`}
                style={{ background: colors.primary.gradient }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-10 border-t ${isDarkMode ? "bg-[#090b14] border-slate-900 text-slate-400" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-2">
          <p>© {new Date().getFullYear()} {profile?.fullName || "User Portfolio"}. All rights reserved.</p>
          <p className="text-slate-500">ByteBodh Portfolio Platform — Enhanced Mode</p>
        </div>
      </footer>

      {/* Back to Top Floating Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 w-11 h-11 text-white rounded-full shadow-2xl transition-all flex items-center justify-center z-40 ${
          isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        style={{ background: colors.primary.gradient }}
        title="Back to Top"
      >
        <FaChevronUp className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TemplateThree;
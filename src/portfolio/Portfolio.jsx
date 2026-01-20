import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaGraduationCap,
  FaBriefcase,
  FaProjectDiagram,
  FaTools,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
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
  FaFacebook
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
import { getPublicProfileByUsername, createContactMessage } from "../api/profileService";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";

const Portfolio = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [copied, setCopied] = useState(false);

  // Professional color scheme
  const colors = {
    primary: {
      light: "#667eea", // Indigo
      main: "#4f46e5", // Indigo 600
      dark: "#4338ca", // Indigo 700
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    secondary: {
      light: "#fbbf24", // Amber
      main: "#f59e0b", // Amber 500
      dark: "#d97706", // Amber 600
      gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
    },
    accent: {
      light: "#10b981", // Emerald
      main: "#059669", // Emerald 600
      dark: "#047857", // Emerald 700
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    },
    neutral: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a"
    }
  };

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

  useEffect(() => {
    getPublicProfileByUsername(username)
      .then((res) => setProfile(res.data.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [username]);

  const getInitials = (fullName) => {
    if (!fullName) return "";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sections = [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "skills", label: "Skills", icon: <FaTools /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
    { id: "experience", label: "Experience", icon: <FaBriefcase /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
    { id: "contact", label: "Contact", icon: <FaUser /> },
  ];

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
        theme: "colored"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData = {
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
          theme: "colored"
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
          theme: "colored"
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Share functionality
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
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
    
    if (skillLower.includes("java")) return <SiJavascript {...iconProps} />;
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">
            Loading {username}'s portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-red-600 font-bold">404</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Portfolio Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The portfolio for @{username} doesn't exist or isn't publicly available.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
          >
            ← Return Home
          </a>
        </div>
      </div>
    );
  }

  const skills = profile.skills || [];
  const socialMediaLinks = profile.socialMediaLinks || [];
  const projects = profile.projects || [];
  const experience = profile.experience || [];
  const education = profile.education || [];
  const certifications = profile.certifications || [];

  const getSkillCategory = (skill) => {
    if (!skill) return "Other";
    
    const skillLower = skill.toLowerCase();
    
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

  skills.forEach(skill => {
    const category = getSkillCategory(skill);
    categorizedSkills[category].push(skill);
  });

  const filteredCategories = Object.fromEntries(
    Object.entries(categorizedSkills).filter(([_, skills]) => skills.length > 0)
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case "Backend":
        return { 
          bg: "from-red-50 to-orange-50", 
          text: "text-red-600", 
          border: "border-red-200",
          gradient: "linear-gradient(135deg, #fecaca 0%, #fed7aa 100%)"
        };
      case "Frontend":
        return { 
          bg: "from-blue-50 to-cyan-50", 
          text: "text-blue-600", 
          border: "border-blue-200",
          gradient: "linear-gradient(135deg, #dbeafe 0%, #cffafe 100%)"
        };
      default:
        return { 
          bg: "from-gray-50 to-gray-100", 
          text: "text-gray-600", 
          border: "border-gray-200",
          gradient: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
        };
    }
  };

  // Share Modal Component
  // Update the ShareModal component to this:
const ShareModal = () => (
  <AnimatePresence>
    {showShareModal && (
      <>
        {/* Backdrop - separate from modal content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75"
          onClick={() => setShowShareModal(false)}
        />
        
        {/* Modal content - separate fixed positioning */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="portfolio-share-modal-content relative w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="portfolio-share-modal-title text-xl font-bold text-gray-900">
                  Share Portfolio
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-8">
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
                  <QRCode
                    id="qr-code-svg"
                    value={qrCodeValue}
                    size={180}
                    level="H"
                    fgColor={colors.primary.dark}
                    bgColor="white"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Scan to visit portfolio
                </p>
              </div>

              {/* Share Links */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={qrCodeValue}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <FaCopy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Share on Social Media
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    <button
                      onClick={() => shareOnSocial('twitter')}
                      className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                    >
                      <FaTwitter className="w-6 h-6 text-blue-500 mb-1" />
                      <span className="text-xs text-blue-600">Twitter</span>
                    </button>
                    
                    <button
                      onClick={() => shareOnSocial('linkedin')}
                      className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                    >
                      <FaLinkedinIn className="w-6 h-6 text-blue-700 mb-1" />
                      <span className="text-xs text-blue-700">LinkedIn</span>
                    </button>
                    
                    <button
                      onClick={() => shareOnSocial('facebook')}
                      className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                    >
                      <FaFacebook className="w-6 h-6 text-blue-600 mb-1" />
                      <span className="text-xs text-blue-600">Facebook</span>
                    </button>
                    
                    <button
                      onClick={() => shareOnSocial('whatsapp')}
                      className="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                    >
                      <FaWhatsapp className="w-6 h-6 text-green-500 mb-1" />
                      <span className="text-xs text-green-600">WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Download QR Code */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={downloadQRCode}
                    className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaDownload className="w-5 h-5" />
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
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)` }}>
      <ToastContainer />
      <ShareModal />

      {/* TOP BAR */}
      <div className={`portfolio-topbar fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg backdrop-blur-sm bg-white/90" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Name */}
            <div className="portfolio-topbar-logo flex items-center gap-3">
              {profile.user?.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName || "User"}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full" style={{ background: colors.primary.gradient }}>
                  <span className="portfolio-topbar-logo-name text-lg font-bold text-white flex items-center justify-center h-full">
                    {getInitials(profile.fullName)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="portfolio-topbar-logo-name text-xl font-bold text-gray-800">{profile.fullName || "User"}</h1>
                <p className="portfolio-topbar-logo-username text-xs text-gray-500">@{profile.user?.username || username}</p>
              </div>
            </div>

            {/* Desktop Navigation & Share Button */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeSection === section.id
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    style={activeSection === section.id ? { background: colors.primary.gradient } : {}}
                  >
                    <span className="text-sm">{section.icon}</span>
                    <span className="text-sm font-medium">{section.label}</span>
                  </a>
                ))}
              </nav>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md"
                style={{ background: colors.secondary.gradient, color: "white" }}
              >
                <FaShareAlt className="w-4 h-4" />
                <span className="font-medium">Share</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
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
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{section.icon}</span>
                      <span className="font-medium">{section.label}</span>
                    </div>
                    <FaChevronRight className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
                  style={{ background: colors.secondary.gradient, color: "white" }}
                >
                  <FaShareAlt className="w-4 h-4" />
                  <span className="font-medium">Share Portfolio</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="portfolio-section relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 50%, ${colors.neutral[50]} 100%)`
        }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, ${colors.primary.dark} 1px, transparent 1px), 
                            linear-gradient(${colors.primary.dark} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="portfolio-section-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="portfolio-hero-section flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full opacity-20 group-hover:opacity-40 transition duration-500" 
                   style={{ background: colors.primary.gradient, filter: 'blur(10px)' }}></div>
              <div className="relative">
                {profile.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.fullName || "User"}
                    className="portfolio-hero-image w-64 h-64 rounded-full border-8 border-white shadow-2xl"
                  />
                ) : (
                  <div className="portfolio-hero-image w-64 h-64 rounded-full border-8 border-white shadow-2xl flex items-center justify-center"
                       style={{ background: colors.primary.gradient }}>
                    <span className="text-7xl font-bold text-white">
                      {getInitials(profile.fullName)}
                    </span>
                  </div>
                )}
              </div>
              {/* Share button on image hover */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareModal(true)}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm"
                style={{ background: 'rgba(255, 255, 255, 0.9)' }}
              >
                <FaShareAlt className="w-5 h-5" style={{ color: colors.primary.dark }} />
              </motion.button>
            </div>

            {/* Hero Content */}
            <div className="portfolio-hero-content flex-1">
              {/* Status Badge */}
              <div className="portfolio-status-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                   style={{ 
                     background: `linear-gradient(135deg, ${colors.accent.light}15, ${colors.accent.main}15)`,
                     borderColor: `${colors.accent.light}40`
                   }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.accent.main }}></span>
                <span className="text-sm font-medium" style={{ color: colors.accent.dark }}>
                  Available for opportunities
                </span>
              </div>

              <h1 className="portfolio-hero-title text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
                Hi, I'm <span style={{ 
                  background: colors.primary.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{profile.fullName || "User"}</span>
              </h1>
              
              <h2 className="portfolio-hero-subtitle text-2xl lg:text-3xl font-semibold mb-6" style={{ color: colors.neutral[700] }}>
                {profile.headline || "Full Stack Developer"}
              </h2>

              <p className="text-lg mb-8 max-w-3xl leading-relaxed" style={{ color: colors.neutral[600] }}>
                {profile.summary || "Passionate developer with experience in building modern web applications."}
              </p>

              {/* CTA Buttons */}
              <div className="portfolio-contact-buttons flex flex-wrap gap-4 mb-8">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium group"
                  style={{ background: colors.primary.gradient, color: "white" }}
                >
                  <span>View My Work</span>
                  <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-lg hover:bg-gray-50 border transition-all duration-300 font-medium"
                  style={{ 
                    color: colors.primary.dark,
                    borderColor: colors.neutral[300]
                  }}
                >
                  Get In Touch
                </a>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {socialMediaLinks.map((link, index) => (
                  <motion.a
                    key={link.id || index}
                    href={link.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-30 transition duration-300"
                         style={{ background: colors.primary.gradient, filter: 'blur(8px)' }}></div>
                    <div className="relative w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 border"
                         style={{ 
                           color: colors.neutral[600],
                           borderColor: colors.neutral[200]
                         }}>
                      {iconByPlatform(link.platform)}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      {skills.length > 0 && (
        <section id="skills" className="portfolio-section py-20">
          <div className="portfolio-section-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="portfolio-section-title text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.neutral[900] }}>
                Technical Expertise
              </h2>
              <p className="portfolio-section-subtitle text-lg max-w-3xl mx-auto" style={{ color: colors.neutral[600] }}>
                Proficient in a wide range of modern technologies and frameworks
              </p>
            </div>

            <div className="portfolio-skills-grid space-y-12">
              {Object.entries(filteredCategories).map(([category, categorySkills]) => {
                const colorsCat = getCategoryColor(category);
                return (
                  <div key={category}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-2`} style={{ color: colorsCat.text }}>
                      <div className={`p-2 rounded-lg border`} style={{ 
                        background: colorsCat.gradient,
                        borderColor: colorsCat.border
                      }}>
                        <FaTools className="w-5 h-5" />
                      </div>
                      {category}
                    </h3>
                    <div className="portfolio-skill-item-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categorySkills.map((skill, index) => (
                        <motion.div
                          key={skill + index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                          className="group"
                        >
                          <div className="portfolio-skill-card rounded-xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border h-full flex flex-col items-center"
                               style={{ 
                                 background: `linear-gradient(135deg, ${colors.neutral[50]}, white)`,
                                 borderColor: colorsCat.border
                               }}>
                            <div className="mb-4">
                              <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 border`}
                                   style={{ 
                                     background: colorsCat.gradient,
                                     borderColor: colorsCat.border
                                   }}>
                                {getSkillIcon(skill)}
                              </div>
                            </div>
                            <h4 className="text-center font-semibold" style={{ color: colors.neutral[800] }}>{skill}</h4>
                            <div className="mt-3 h-1 w-full rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
                                 style={{ background: colorsCat.gradient }}></div>
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
        <section id="projects" className="portfolio-section py-20" style={{ background: colors.neutral[50] }}>
          <div className="portfolio-section-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="portfolio-section-title text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.neutral[900] }}>
                Featured Projects
              </h2>
              <p className="portfolio-section-subtitle text-lg max-w-3xl mx-auto" style={{ color: colors.neutral[600] }}>
                Showcasing innovative solutions and technical implementations
              </p>
            </div>

            <div className="portfolio-projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="portfolio-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border h-full flex flex-col"
                       style={{ 
                         background: `linear-gradient(135deg, white, ${colors.neutral[50]})`,
                         borderColor: colors.neutral[200]
                       }}>
                    {/* Project Header */}
                    <div className="portfolio-project-header h-48 relative overflow-hidden flex items-center justify-center p-4"
                         style={{ background: colors.primary.gradient }}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <h3 className="portfolio-project-title text-2xl font-bold text-white text-center relative z-10 px-4 py-6 bg-black/20 backdrop-blur-sm rounded-xl w-full">
                        {project.title || "Project Title"}
                      </h3>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full"
                              style={{ color: colors.primary.dark }}>
                          {(project.techStack || "").split(",")[0] || "Project"}
                        </span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="portfolio-project-content p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 rounded-lg" style={{ background: colors.primary.gradient + '20' }}>
                          <FaProjectDiagram className="w-5 h-5" style={{ color: colors.primary.dark }} />
                        </div>
                        <span className="text-xs font-medium px-3 py-1 rounded-full"
                              style={{ 
                                background: colors.neutral[100],
                                color: colors.neutral[600]
                              }}>
                          Project
                        </span>
                      </div>
                      
                      <p className="mb-6 line-clamp-3 flex-1" style={{ color: colors.neutral[600] }}>
                        {project.description || "Project description not available."}
                      </p>

                      {/* Tech Stack */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {(project.techStack || "").split(",").slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs font-medium rounded-full border"
                              style={{ 
                                background: colors.neutral[50],
                                color: colors.neutral[600],
                                borderColor: colors.neutral[200]
                              }}
                            >
                              {tech.trim()}
                            </span>
                          ))}
                          {(project.techStack || "").split(",").length > 3 && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full border"
                                  style={{ 
                                    background: colors.neutral[50],
                                    color: colors.neutral[600],
                                    borderColor: colors.neutral[200]
                                  }}>
                              +{(project.techStack || "").split(",").length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Project Link */}
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-between w-full px-4 py-2 rounded-lg group/link transition-all mt-auto"
                          style={{ 
                            background: `linear-gradient(135deg, ${colors.primary.light}15, ${colors.primary.dark}15)`,
                            color: colors.primary.dark
                          }}
                        >
                          <span className="font-medium">View Details</span>
                          <FaExternalLinkAlt className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
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
        <section id="experience" className="portfolio-section py-20">
          <div className="portfolio-section-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="portfolio-section-title text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.neutral[900] }}>
                Professional Experience
              </h2>
              <p className="portfolio-section-subtitle text-lg max-w-3xl mx-auto" style={{ color: colors.neutral[600] }}>
                A track record of delivering impactful solutions
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="portfolio-experience-timeline hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1"
                   style={{ background: `linear-gradient(to bottom, ${colors.primary.light}20, ${colors.primary.dark}20)` }}></div>

              <div className="space-y-12">
                {experience.map((exp, index) => (
                  <motion.div
                    key={exp.id || index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`portfolio-experience-item relative flex ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    {/* Timeline Dot */}
                    <div className="portfolio-experience-dot hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 rounded-full border-4 border-white shadow-lg"
                           style={{ background: colors.primary.gradient }}></div>
                    </div>

                    <div className="portfolio-experience-card lg:w-1/2 lg:px-12">
                      <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border h-full"
                           style={{ 
                             background: `linear-gradient(135deg, white, ${colors.neutral[50]})`,
                             borderColor: colors.neutral[200]
                           }}>
                        {/* Experience Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.neutral[800] }}>
                              {exp.jobTitle || "Job Title"}
                            </h3>
                            <p className="text-lg font-semibold mb-1" style={{ color: colors.primary.dark }}>
                              {exp.company || "Company"}
                            </p>
                            <div className="portfolio-experience-date flex flex-wrap items-center gap-4 text-sm" style={{ color: colors.neutral[500] }}>
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="w-4 h-4" />
                                <span>
                                  {exp.startYear && exp.startMonth
                                    ? new Date(exp.startYear, exp.startMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                    : "Date not specified"} -{" "}
                                  {exp.endMonth && exp.endYear
                                    ? new Date(exp.endYear, exp.endMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                    : "Present"}
                                </span>
                              </div>
                              {exp.location && (
                                <div className="flex items-center gap-2">
                                  <FaMapMarkerAlt className="w-4 h-4" />
                                  <span>{exp.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="p-3 rounded-xl" style={{ background: colors.primary.gradient + '20' }}>
                            <FaBriefcase className="w-6 h-6" style={{ color: colors.primary.dark }} />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="leading-relaxed" style={{ color: colors.neutral[600] }}>
                          {exp.description || "Experience description not available."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION SECTION */}
      {education.length > 0 && (
        <section id="education" className="portfolio-section py-20" style={{ background: colors.neutral[50] }}>
          <div className="portfolio-section-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="portfolio-section-title text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.neutral[900] }}>
                Education
              </h2>
              <p className="portfolio-section-subtitle text-lg max-w-3xl mx-auto" style={{ color: colors.neutral[600] }}>
                Academic background and qualifications
              </p>
            </div>

            <div className="portfolio-education-grid grid lg:grid-cols-2 gap-8">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="portfolio-education-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border h-full"
                       style={{ 
                         background: `linear-gradient(135deg, white, ${colors.neutral[50]})`,
                         borderColor: colors.neutral[200]
                       }}>
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h3 className="portfolio-education-header text-2xl font-bold mb-2" style={{ color: colors.neutral[800] }}>
                            {edu.institution || "Institution"}
                          </h3>
                          <div className="flex flex-col gap-3">
                            <span className="portfolio-education-degree text-lg font-semibold" style={{ color: colors.primary.dark }}>
                              {edu.degree || "Degree"}
                            </span>
                            <span style={{ color: colors.neutral[600] }}>{edu.fieldOfStudy || "Field of Study"}</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: colors.primary.gradient + '20' }}>
                          <FaGraduationCap className="w-8 h-8" style={{ color: colors.primary.dark }} />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="w-5 h-5" style={{ color: colors.primary.dark }} />
                            <span className="font-medium" style={{ color: colors.neutral[700] }}>
                              {edu.startYear || "Start"} - {edu.endYear || "End"}
                            </span>
                          </div>
                          {edu.cgpa && (
                            <div className="text-right">
                              <div className="text-sm mb-1" style={{ color: colors.neutral[500] }}>CGPA</div>
                              <div className="text-2xl font-bold" style={{ color: colors.primary.dark }}>{edu.cgpa}/10.0</div>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {edu.cgpa && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium" style={{ color: colors.neutral[600] }}>Academic Performance</span>
                              <span className="text-sm font-bold" style={{ color: colors.primary.dark }}>
                                {((edu.cgpa / 10) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full rounded-full h-2" style={{ background: colors.neutral[200] }}>
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${(edu.cgpa / 10) * 100}%`,
                                  background: colors.primary.gradient
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Achievements */}
                        {edu.achievements && (
                          <div className="pt-6 border-t" style={{ borderColor: colors.neutral[200] }}>
                            <p className="italic text-sm leading-relaxed" style={{ color: colors.neutral[600] }}>
                              "{edu.achievements}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATIONS SECTION */}
      {certifications.length > 0 && (
        <section id="certifications" className="portfolio-section py-20">
          <div className="portfolio-section-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="portfolio-section-title text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.neutral[900] }}>
                Certifications
              </h2>
              <p className="portfolio-section-subtitle text-lg max-w-3xl mx-auto" style={{ color: colors.neutral[600] }}>
                Professional certifications and completed courses
              </p>
            </div>

            <div className="portfolio-certifications-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="portfolio-certification-card rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border h-full"
                       style={{ 
                         background: `linear-gradient(135deg, white, ${colors.neutral[50]})`,
                         borderColor: colors.neutral[200]
                       }}>
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="p-4 rounded-xl" style={{ background: colors.accent.gradient + '20' }}>
                          <FaCertificate className="w-8 h-8" style={{ color: colors.accent.dark }} />
                        </div>
                        <span className="text-xs font-medium px-3 py-1 rounded-full"
                              style={{ 
                                background: colors.accent.gradient + '20',
                                color: colors.accent.dark
                              }}>
                          Certification
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.neutral[800] }}>
                            {cert.name || "Certification Name"}
                          </h3>
                          <p className="leading-relaxed" style={{ color: colors.neutral[600] }}>
                            {cert.description || "Certification description not available."}
                          </p>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                          {cert.startDate && (
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="w-5 h-5" style={{ color: colors.accent.dark }} />
                              <div>
                                <div className="text-sm" style={{ color: colors.neutral[500] }}>Start Date</div>
                                <div className="font-medium" style={{ color: colors.neutral[700] }}>
                                  {formatDate(cert.startDate)}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {cert.endDate && (
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="w-5 h-5" style={{ color: colors.primary.dark }} />
                              <div>
                                <div className="text-sm" style={{ color: colors.neutral[500] }}>End Date</div>
                                <div className="font-medium" style={{ color: colors.neutral[700] }}>
                                  {formatDate(cert.endDate)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Duration */}
                        {cert.startDate && cert.endDate && (
                          <div className="pt-6 border-t" style={{ borderColor: colors.neutral[200] }}>
                            <div className="text-center">
                              <div className="text-sm mb-2" style={{ color: colors.neutral[500] }}>Duration</div>
                              <div className="text-lg font-bold" style={{ color: colors.accent.dark }}>
                                {(() => {
                                  const start = new Date(cert.startDate);
                                  const end = new Date(cert.endDate);
                                  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                                  return months > 12 
                                    ? `${Math.floor(months/12)} years ${months%12} months`
                                    : `${months} months`;
                                })()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section id="contact" className="portfolio-section py-20">
        <div className="portfolio-section-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="portfolio-section-title text-3xl lg:text-4xl font-bold mb-4" style={{ color: colors.neutral[900] }}>
              Get In Touch
            </h2>
            <p className="portfolio-section-subtitle text-lg max-w-3xl mx-auto" style={{ color: colors.neutral[600] }}>
              Feel free to reach out for collaborations or just a friendly hello
            </p>
          </div>

          <div className="rounded-2xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto"
               style={{ 
                 background: `linear-gradient(135deg, white, ${colors.neutral[50]})`,
                 border: `1px solid ${colors.neutral[200]}`
               }}>
            <div className="portfolio-contact-container grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="portfolio-contact-info">
                <h3 className="text-2xl font-bold mb-8" style={{ color: colors.neutral[800] }}>
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  {profile.email && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg" style={{ background: colors.primary.gradient + '20' }}>
                        <FaEnvelope className="w-6 h-6" style={{ color: colors.primary.dark }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: colors.neutral[700] }}>Email</h4>
                        <a href={`mailto:${profile.email}`} 
                           className="hover:underline transition-all break-all"
                           style={{ color: colors.primary.dark }}>
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg" style={{ background: colors.primary.gradient + '20' }}>
                        <FaPhone className="w-6 h-6" style={{ color: colors.primary.dark }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: colors.neutral[700] }}>Phone</h4>
                        <a href={`tel:${profile.phone}`} 
                           className="hover:underline transition-all"
                           style={{ color: colors.primary.dark }}>
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg" style={{ background: colors.primary.gradient + '20' }}>
                        <FaMapMarkerAlt className="w-6 h-6" style={{ color: colors.primary.dark }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: colors.neutral[700] }}>Location</h4>
                        <p style={{ color: colors.neutral[600] }}>{profile.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="pt-6">
                    <h4 className="font-semibold mb-4" style={{ color: colors.neutral[700] }}>Connect with me</h4>
                    <div className="flex gap-4">
                      {socialMediaLinks.map((link, index) => (
                        <a
                          key={link.id || index}
                          href={link.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-12 h-12 rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-300 border"
                          style={{ 
                            background: colors.primary.gradient + '10',
                            color: colors.primary.dark,
                            borderColor: colors.neutral[200]
                          }}
                        >
                          {iconByPlatform(link.platform)}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="portfolio-contact-form">
                <h3 className="text-2xl font-bold mb-8" style={{ color: colors.neutral[800] }}>
                  Send a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.neutral[700] }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="portfolio-contact-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all"
                      style={{ 
                        borderColor: colors.neutral[300],
                        outline: 'none'
                      }}
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.neutral[700] }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="portfolio-contact-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all"
                      style={{ 
                        borderColor: colors.neutral[300],
                        outline: 'none'
                      }}
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.neutral[700] }}>
                      Message
                    </label>
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="portfolio-contact-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 transition-all resize-none"
                      style={{ 
                        borderColor: colors.neutral[300],
                        outline: 'none'
                      }}
                      placeholder="Your message here..."
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    style={{ background: colors.primary.gradient }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12" style={{ background: colors.neutral[900] }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Brand Info */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                {profile.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.fullName || "User"}
                    className="w-14 h-14 rounded-full border-2"
                    style={{ borderColor: `${colors.neutral[700]}` }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                       style={{ background: colors.primary.gradient }}>
                    <span className="text-xl font-bold text-white">
                      {getInitials(profile.fullName)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">{profile.fullName || "User"}</h3>
                  <p className="text-gray-400">@{profile.user?.username || username}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                {profile.headline || "Full Stack Developer"}
              </p>
              <div className="flex gap-4">
                {socialMediaLinks.map((link, index) => (
                  <a
                    key={link.id || index}
                    href={link.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  >
                    {iconByPlatform(link.platform)}
                  </a>
                ))}
                {/* Share button in footer */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-10 h-10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <FaShareAlt className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
              <div className="grid grid-cols-2 gap-4">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
                  >
                    <span className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: colors.primary.gradient }}></span>
                    <span>{section.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Contact Info</h4>
              <div className="space-y-4">
                {profile.email && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaEnvelope className="w-5 h-5" />
                    <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaPhone className="w-5 h-5" />
                    <a href={`tel:${profile.phone}`} className="hover:text-white transition-colors">
                      {profile.phone}
                    </a>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaMapMarkerAlt className="w-5 h-5" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: colors.neutral[700] }}>
            <p className="text-gray-400">
              © {new Date().getFullYear()} {profile.fullName || "User"}. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Crafted with React, Tailwind CSS, and Framer Motion
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 w-12 h-12 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ background: colors.primary.gradient }}
      >
        <FaChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </button>

      {/* Floating Share Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setShowShareModal(true)}
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group z-40"
        style={{ background: colors.secondary.gradient }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaShareAlt className="w-6 h-6 text-white" />
        <span className="absolute -top-8 bg-gray-900 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Share Portfolio
        </span>
      </motion.button>
    </div>
  );
};

export default Portfolio;
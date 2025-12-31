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
  FaCertificate
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
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
  }, []);

  useEffect(() => {
    getPublicProfileByUsername(username)
      .then((res) => setProfile(res.data.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [username]);

  // Function to get initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return "";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Navigation sections
  const sections = [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "skills", label: "Skills", icon: <FaTools /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
    { id: "experience", label: "Experience", icon: <FaBriefcase /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
    { id: "contact", label: "Contact", icon: <FaUser /> },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the contact message data
      const contactData = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        recipientUsername: username // The portfolio owner's username
      };

      // Make the API call
      const response = await createContactMessage(contactData);
      
      if (response.data?.success) {
        // Show success toast
        toast.success("Message sent successfully! I'll get back to you soon.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form
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
      
      // Show error toast
      toast.error(
        error.response?.data?.message || 
        "Failed to send message. Please try again later.", 
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icon mapping for skills
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

  // Format date for display
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
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
          >
            ← Return Home
          </a>
        </div>
      </div>
    );
  }

  // Get data with safety checks
  const skills = profile.skills || [];
  const socialMediaLinks = profile.socialMediaLinks || [];
  const projects = profile.projects || [];
  const experience = profile.experience || [];
  const education = profile.education || [];
  const certifications = profile.certifications || [];

  // Function to categorize skills as Backend or Frontend
  const getSkillCategory = (skill) => {
    if (!skill) return "Other";
    
    const skillLower = skill.toLowerCase();
    
    // Backend skills
    const backendKeywords = [
      "java", "spring", "node", "express", "python", "django", "flask",
      "php", "laravel", "ruby", "rails", "c#", "dotnet", "asp.net",
      "go", "golang", "rust", "api", "rest", "graphql", "microservices",
      "serverless", "aws", "azure", "gcp", "docker", "kubernetes", "jenkins",
      "ci/cd", "nginx", "apache", "mysql", "mongodb", "postgresql", "redis",
      "elasticsearch", "kafka", "rabbitmq"
    ];
    
    // Frontend skills
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

  // Categorize skills
  const categorizedSkills = {
    Backend: [],
    Frontend: [],
    Other: []
  };

  skills.forEach(skill => {
    const category = getSkillCategory(skill);
    categorizedSkills[category].push(skill);
  });

  // Remove empty categories
  const filteredCategories = Object.fromEntries(
    Object.entries(categorizedSkills).filter(([_, skills]) => skills.length > 0)
  );

  // Function to get color based on skill category
  const getCategoryColor = (category) => {
    switch (category) {
      case "Backend":
        return { bg: "from-red-50 to-orange-50", text: "text-red-600", border: "border-red-200" };
      case "Frontend":
        return { bg: "from-blue-50 to-cyan-50", text: "text-blue-600", border: "border-blue-200" };
      default:
        return { bg: "from-gray-50 to-gray-100", text: "text-gray-600", border: "border-gray-200" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      {/* ================= TOP BAR ================= */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Name */}
            <div className="flex items-center gap-3">
              {profile.user?.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName || "User"}
                  className="w-10 h-10 rounded-full border-2 border-blue-100"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {getInitials(profile.fullName)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-800">{profile.fullName || "User"}</h1>
                <p className="text-xs text-gray-500">@{profile.user?.username || username}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm">{section.icon}</span>
                  <span className="text-sm font-medium">{section.label}</span>
                </a>
              ))}
            </nav>

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
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600"
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
               
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative">
                {profile.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.fullName || "User"}
                    className="w-64 h-64 rounded-full border-8 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-64 h-64 rounded-full border-8 border-white shadow-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-7xl font-bold text-white">
                      {getInitials(profile.fullName)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full mb-6 border border-blue-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-blue-600">
                  Available for opportunities
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
                Hi, I'm <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{profile.fullName || "User"}</span>
              </h1>
              
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700 mb-6">
                {profile.headline || "Full Stack Developer"}
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed">
                {profile.summary || "Passionate developer with experience in building modern web applications."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium group"
                >
                  <span>View My Work</span>
                  <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 border border-gray-200 transition-all duration-300 font-medium"
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
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 hover:shadow-lg transition-all duration-300 border border-gray-100">
                      {iconByPlatform(link.platform)}
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SKILLS SECTION ================= */}
      {skills.length > 0 && (
        <section id="skills" className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Technical Expertise
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Proficient in a wide range of modern technologies and frameworks
              </p>
            </div>

            <div className="space-y-12">
              {Object.entries(filteredCategories).map(([category, categorySkills]) => {
                const colors = getCategoryColor(category);
                return (
                  <div key={category}>
                    <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${colors.text}`}>
                      <div className={`p-2 bg-gradient-to-r ${colors.bg} rounded-lg border ${colors.border}`}>
                        <FaTools className="w-5 h-5" />
                      </div>
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                          <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-lg p-6 transition-all duration-300 border ${colors.border}`}>
                            <div className="flex items-center justify-center mb-4">
                              <div className={`p-3 bg-gradient-to-br ${colors.bg} rounded-lg group-hover:scale-110 transition-transform duration-300 border ${colors.border}`}>
                                {getSkillIcon(skill)}
                              </div>
                            </div>
                            <h4 className="text-center font-semibold text-gray-800">{skill}</h4>
                            <div className={`mt-3 h-1 w-full bg-gradient-to-r ${category === 'Backend' ? 'from-red-400 to-orange-400' : category === 'Frontend' ? 'from-blue-400 to-cyan-400' : 'from-gray-400 to-gray-500'} rounded-full opacity-0 group-hover:opacity-100 transition duration-300`}></div>
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

      {/* ================= PROJECTS SECTION ================= */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Showcasing innovative solutions and technical implementations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                    {/* Project Title as Header */}
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-500 relative overflow-hidden flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <h3 className="text-2xl font-bold text-white text-center relative z-10 px-4 py-6 bg-black/20 backdrop-blur-sm rounded-xl w-full">
                        {project.title || "Project Title"}
                      </h3>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-blue-600 rounded-full">
                          {(project.techStack || "").split(",")[0] || "Project"}
                        </span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                          <FaProjectDiagram className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                          Project
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                        {project.description || "Project description not available."}
                      </p>

                      {/* Tech Stack */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {(project.techStack || "").split(",").slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                          {(project.techStack || "").split(",").length > 3 && (
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
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
                          className="inline-flex items-center justify-between w-full px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:text-blue-700 rounded-lg group/link transition-all mt-auto"
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

      {/* ================= EXPERIENCE SECTION ================= */}
      {experience.length > 0 && (
        <section id="experience" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Professional Experience
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A track record of delivering impactful solutions
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-indigo-200"></div>

              <div className="space-y-12">
                {experience.map((exp, index) => (
                  <motion.div
                    key={exp.id || index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`relative flex ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    {/* Timeline Dot */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-4 border-white shadow-lg"></div>
                    </div>

                    <div className="lg:w-1/2 lg:px-12">
                      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                        {/* Experience Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                              {exp.jobTitle || "Job Title"}
                            </h3>
                            <p className="text-lg font-semibold text-blue-600 mb-1">
                              {exp.company || "Company"}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
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
                          <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                            <FaBriefcase className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
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

      {/* ================= EDUCATION SECTION ================= */}
      {education.length > 0 && (
        <section id="education" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Education
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Academic background and qualifications
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
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
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {edu.institution || "Institution"}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-blue-600">
                              {edu.degree || "Degree"}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{edu.fieldOfStudy || "Field of Study"}</span>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                          <FaGraduationCap className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-gray-700">
                              {edu.startYear || "Start"} - {edu.endYear || "End"}
                            </span>
                          </div>
                          {edu.cgpa && (
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">CGPA</div>
                              <div className="text-2xl font-bold text-blue-600">{edu.cgpa}/10.0</div>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {edu.cgpa && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">Academic Performance</span>
                              <span className="text-sm font-bold text-blue-600">
                                {((edu.cgpa / 10) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(edu.cgpa / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Achievements */}
                        {edu.achievements && (
                          <div className="pt-6 border-t border-gray-100">
                            <p className="text-gray-600 italic text-sm leading-relaxed">
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

      {/* ================= CERTIFICATIONS SECTION ================= */}
      {certifications.length > 0 && (
        <section id="certifications" className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Certifications
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Professional certifications and completed courses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full">
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="p-4 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-xl">
                          <FaCertificate className="w-8 h-8 text-teal-600" />
                        </div>
                        <span className="text-xs font-medium px-3 py-1 bg-teal-100 text-teal-600 rounded-full">
                          Certification
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {cert.name || "Certification Name"}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {cert.description || "Certification description not available."}
                          </p>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                          {cert.startDate && (
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="w-5 h-5 text-teal-500" />
                              <div>
                                <div className="text-sm text-gray-500">Start Date</div>
                                <div className="font-medium text-gray-700">
                                  {formatDate(cert.startDate)}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {cert.endDate && (
                            <div className="flex items-center gap-3">
                              <FaCalendarAlt className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="text-sm text-gray-500">End Date</div>
                                <div className="font-medium text-gray-700">
                                  {formatDate(cert.endDate)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Duration */}
                        {cert.startDate && cert.endDate && (
                          <div className="pt-6 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-sm text-gray-500 mb-2">Duration</div>
                              <div className="text-lg font-bold text-teal-600">
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

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Feel free to reach out for collaborations or just a friendly hello
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-8">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  {profile.email && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                        <FaEnvelope className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Email</h4>
                        <a href={`mailto:${profile.email}`} className="text-blue-600 hover:text-blue-700">
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                        <FaPhone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Phone</h4>
                        <a href={`tel:${profile.phone}`} className="text-blue-600 hover:text-blue-700">
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                        <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Location</h4>
                        <p className="text-gray-600">{profile.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="pt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Connect with me</h4>
                    <div className="flex gap-4">
                      {socialMediaLinks.map((link, index) => (
                        <a
                          key={link.id || index}
                          href={link.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-12 h-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-blue-600 hover:text-blue-700 hover:shadow-lg transition-all duration-300 border border-blue-100"
                        >
                          {iconByPlatform(link.platform)}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-8">
                  Send a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="john@example.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Your message here..."
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
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

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Brand Info */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                {profile.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.fullName || "User"}
                    className="w-14 h-14 rounded-full border-2 border-white/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {getInitials(profile.fullName)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold">{profile.fullName || "User"}</h3>
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
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                  >
                    {iconByPlatform(link.platform)}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <div className="grid grid-cols-2 gap-4">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{section.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6">Contact Info</h4>
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

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
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
        className={`fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <FaChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
};

export default Portfolio;
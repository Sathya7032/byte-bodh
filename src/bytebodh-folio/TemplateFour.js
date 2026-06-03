import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Home,
  Briefcase,
  GraduationCap,
  Folder,
  Wrench,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Award,
  Send,
  Flame,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TemplateFour = ({ profile }) => {
  const { username: routeUsername } = useParams();

  // Extract username dynamically
  const getUsernameFromDomain = () => {
    const hostname = window.location.hostname;
    if (hostname.endsWith(".localhost")) {
      const subdomain = hostname.replace(".localhost", "");
      return subdomain && subdomain !== "www" ? subdomain : null;
    }
    if (hostname.endsWith(".bytebodh.in")) {
      const subdomain = hostname.replace(".bytebodh.in", "");
      return subdomain && subdomain !== "www" ? subdomain : null;
    }
    return null;
  };

  const username = profile.user?.username || routeUsername || getUsernameFromDomain() || "user";

  const [activeSection, setActiveSection] = useState("hero");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup intersection observer to track current visible section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const sections = ["hero", "experience", "education", "projects", "skills", "contact"];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Split headline for big styled hero header (Part 1 is solid white, Part 2 is outlined)
  const headlineParts = useMemo(() => {
    if (!profile.headline) return { part1: "SOFTWARE", part2: "ENGINEER" };
    const words = profile.headline.trim().split(/\s+/);
    if (words.length === 1) {
      return { part1: words[0].toUpperCase(), part2: "DEVELOPER" };
    }
    const mid = Math.ceil(words.length / 2);
    const part1 = words.slice(0, mid).join(" ").toUpperCase();
    const part2 = words.slice(mid).join(" ").toUpperCase();
    return { part1, part2 };
  }, [profile.headline]);

  // Calculate experience years
  const totalExperienceYears = useMemo(() => {
    if (!profile.experience || profile.experience.length === 0) return 5; // Default fallback
    let years = 0;
    profile.experience.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate && exp.endDate.toUpperCase() !== "PRESENT" ? new Date(exp.endDate) : new Date();
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        years += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      }
    });
    return Math.max(Math.ceil(years), 1);
  }, [profile.experience]);

  // Normalize skills list for consistent progress bar display
  const skillList = useMemo(() => {
    if (!profile.skills) return [];
    return profile.skills.map((skill) => {
      if (typeof skill === "object" && skill !== null) {
        return { name: skill.name, proficiency: skill.proficiency || 85 };
      }
      return { name: skill, proficiency: 85 };
    });
  }, [profile.skills]);

  // Handle contact form inputs
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit contact message
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
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
        toast.success("Message sent successfully! I will reach out soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(response.data?.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resolve social icon
  const getSocialIcon = (platform) => {
    const p = platform.toUpperCase();
    if (p.includes("GITHUB")) return <Github className="w-4 h-4" />;
    if (p.includes("LINKEDIN")) return <Linkedin className="w-4 h-4" />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const navItems = [
    { id: "hero", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <Folder className="w-4 h-4" /> },
    { id: "skills", label: "Skills", icon: <Wrench className="w-4 h-4" /> },
    { id: "contact", label: "Contact", icon: <Mail className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-orange-500/30 relative">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating Center Navbar (Fixed at top of window) */}
      <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] sm:w-auto bg-[#141416]/80 backdrop-blur-xl border border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex justify-between sm:justify-around gap-1 sm:gap-6 shadow-2xl transition-all duration-300 hover:border-orange-500/30">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
              setActiveSection(item.id);
            }}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 flex items-center justify-center relative group ${
              activeSection === item.id 
                ? "text-orange-500 bg-white/5" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title={item.label}
          >
            {item.icon}
            <span className="absolute bottom-[-32px] scale-0 group-hover:scale-100 transition-all duration-200 bg-[#16161a] text-white text-[10px] px-2.5 py-1 rounded border border-white/10 whitespace-nowrap shadow-xl">
              {item.label}
            </span>
          </a>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN - Sticky White Profile Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 self-start z-20 w-full">
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 text-[#111111] shadow-2xl relative overflow-hidden flex flex-col items-center text-center border border-slate-100">
              
              {/* Dotted/Dashed ornaments in background */}
              <svg className="absolute -top-6 -left-6 w-32 h-32 text-orange-500 opacity-20 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
              </svg>
              <svg className="absolute -bottom-6 -right-6 w-32 h-32 text-orange-500 opacity-20 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
              </svg>

              {/* Profile Image Frame */}
              <div className="relative w-full max-w-[200px] aspect-square sm:aspect-[4/5] mb-8 flex justify-center items-center">
                {/* Main image container */}
                <div className="relative w-full h-full rounded-[2rem] bg-gradient-to-br from-orange-600 to-orange-400 p-1.5 shadow-xl overflow-hidden">
                  {profile.pictureUrl ? (
                    <img 
                      src={profile.pictureUrl} 
                      alt={profile.fullName} 
                      className="w-full h-full object-cover rounded-[1.8rem]"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white text-5xl font-bold">
                      {profile.fullName?.[0] || "U"}
                    </div>
                  )}
                </div>

                {/* Orange Flame Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white p-2.5 rounded-full shadow-lg border-4 border-white flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-current text-white" />
                </div>
              </div>

              {/* Bio & Details */}
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {profile.fullName}
              </h2>
              <p className="text-xs font-black uppercase tracking-wider text-orange-600 mb-4 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                {profile.headline || "Professional"}
              </p>
              
              <div className="w-full h-[1px] bg-slate-100 my-4"></div>
              
              <p className="text-sm text-slate-500 leading-relaxed mb-6 italic">
                "{profile.summary || "Full stack developer crafting reliable web services and premium user interfaces."}"
              </p>

              {/* Quick Contact Rows */}
              <div className="w-full space-y-2.5 mb-6 text-left">
                {profile.email && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="truncate text-slate-700 font-semibold">{profile.email}</span>
                  </div>
                )}
                {profile.mobileNumber && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="truncate text-slate-700 font-semibold">{profile.mobileNumber}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="truncate text-slate-700 font-semibold">{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Social Media Link Buttons */}
              <div className="flex flex-wrap gap-2.5 justify-center mt-2">
                {profile.socialMediaLinks?.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-orange-600 text-white rounded-full transition-all hover:scale-105 shadow-md"
                    title={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN - Scrollable Portfolio Content */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-20 relative z-10 w-full">
            
            {/* HERO SECTION */}
            <div id="hero" className="scroll-mt-32 space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none flex flex-col uppercase break-words">
                <span className="text-white">{headlineParts.part1}</span>
                <span 
                  className="text-transparent" 
                  style={{ 
                    WebkitTextStroke: "2px rgba(255,255,255,0.12)",
                    color: "transparent"
                  }}
                >
                  {headlineParts.part2}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                Passionate about creating intuitive and engaging user experiences. Specialize in transforming ideas into beautifully crafted products.
              </p>

              {/* Numeric Stats Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 border-y border-white/10 py-6 sm:py-8 mt-8 sm:mt-12">
                <div>
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black text-white">+{totalExperienceYears}</div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-wider sm:tracking-widest mt-2">Years of Experience</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black text-white">+{Math.max(profile.projects?.length || 0, 12)}</div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-wider sm:tracking-widest mt-2">Projects Completed</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black text-white">+{Math.max(profile.certifications?.length || 0, 1) + 15}</div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-wider sm:tracking-widest mt-2">Worldwide Clients</div>
                </div>
              </div>
            </div>

            {/* WORK EXPERIENCE */}
            <section id="experience" className="scroll-mt-32 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Experience</h2>
              </div>
              
              <div className="space-y-8 relative pl-6 border-l border-white/10">
                {profile.experience?.map((exp, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-[#0a0a0c] border-2 border-orange-500 rounded-full group-hover:bg-orange-500 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {exp.position}
                      </h3>
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-orange-400 self-start sm:self-auto">
                        {exp.startDate} — {exp.endDate || "PRESENT"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-400 mb-3">{exp.company}</p>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-2xl whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
                {(!profile.experience || profile.experience.length === 0) && (
                  <p className="text-sm text-slate-500 italic">No professional experiences listed yet.</p>
                )}
              </div>
            </section>

            {/* EDUCATION */}
            <section id="education" className="scroll-mt-32 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Education</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {profile.education?.map((edu, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-orange-500/30 transition-all hover:bg-white/[0.08]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
                      <h3 className="font-bold text-lg text-white leading-snug">{edu.degree}</h3>
                      <span className="text-[9px] font-black text-orange-400 px-2.5 py-1 bg-orange-500/10 rounded-full shrink-0 border border-orange-500/20 whitespace-nowrap self-start sm:self-auto">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mb-2">{edu.institution}</p>
                    {edu.fieldOfStudy && (
                      <p className="text-xs text-slate-500 mb-3">Field: {edu.fieldOfStudy}</p>
                    )}
                    {edu.gpa && (
                      <div className="text-xs font-bold text-orange-400/90">GPA: {edu.gpa}</div>
                    )}
                  </div>
                ))}
                {(!profile.education || profile.education.length === 0) && (
                  <p className="text-sm text-slate-500 italic md:col-span-2">No educational history listed yet.</p>
                )}
              </div>
            </section>

            {/* PROJECTS */}
            <section id="projects" className="scroll-mt-32 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                  <Folder className="w-5 h-5" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Projects</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {profile.projects?.map((project, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all flex flex-col justify-between group">
                    <div>
                      <div className="w-10 h-10 bg-orange-600/15 text-orange-500 border border-orange-500/20 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        🚀
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-all">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 mb-5 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(project.technologies || project.techStack?.split(",") || []).map((tech, i) => (
                          <span key={i} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/10 rounded text-slate-300">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      
                      {(project.link || project.projectUrl) && (
                        <a 
                          href={project.link || project.projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-widest transition-colors"
                        >
                          Launch Prototype <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {(!profile.projects || profile.projects.length === 0) && (
                  <p className="text-sm text-slate-500 italic md:col-span-2">No projects listed yet.</p>
                )}
              </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="scroll-mt-32 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                  <Wrench className="w-5 h-5" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Skills</h2>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  {skillList.map((skill, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-300">{skill.name}</span>
                        <span className="text-orange-400">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {skillList.length === 0 && (
                    <p className="text-sm text-slate-500 italic sm:col-span-2">No skills listed yet.</p>
                  )}
                </div>
              </div>
            </section>

            {/* SERVICES */}
            {profile.services?.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Services</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {profile.services.map((svc, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all">
                      <h3 className="font-bold text-base text-white mb-2">{svc.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{svc.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CERTIFICATIONS */}
            {profile.certifications?.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                    <Award className="w-5 h-5" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Certifications</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-start gap-4 hover:border-white/20 transition-all">
                      <div className="p-2.5 bg-orange-500/15 text-orange-400 rounded-xl border border-orange-500/20">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{cert.name}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                          {cert.issuingOrganization}
                        </p>
                        {cert.issueDate && (
                          <p className="text-[9px] text-slate-600 mt-1">Date: {cert.issueDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* GALLERY & MEDIA */}
            {(profile.gallery?.length > 0 || profile.youtubeVideoLinks?.length > 0) && (
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Media</h2>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                  {profile.gallery?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {profile.gallery.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer relative group">
                          <img src={img.url} alt={img.caption} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                          {img.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/85 p-2.5 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                              {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {profile.youtubeVideoLinks?.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {profile.youtubeVideoLinks.map((vid, idx) => (
                        <div key={idx} className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                          <iframe 
                            src={vid.url?.replace("watch?v=", "embed/") || ""} 
                            title={vid.title} 
                            className="w-full h-full border-0" 
                            allowFullScreen
                          ></iframe>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* CONTACT FORM */}
            <section id="contact" className="scroll-mt-32 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600/10 rounded-xl border border-orange-500/20 text-orange-500">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Contact</h2>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleContactChange}
                        placeholder="John Doe" 
                        required
                        className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleContactChange}
                        placeholder="john@example.com" 
                        required
                        className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleContactChange}
                      rows="5" 
                      placeholder="Tell me about your project..." 
                      required
                      className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 text-white rounded-2xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="pt-8 border-t border-white/5 text-center sm:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
                © {new Date().getFullYear()} {profile.fullName} • Executive Portfolio 4.0
              </p>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFour;
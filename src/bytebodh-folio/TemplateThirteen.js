import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  Zap,
  ChevronLeft,
  ChevronRight,
  Box,
  Briefcase,
  GraduationCap,
  User
} from "lucide-react";
import { animate } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Thirteen: EXECUTIVE WHITE THEME 3D SQUARE CUBE
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-thirteen-white-theme-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    .t13-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%);
      color: #0f172a;
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Top Station Header */
    .t13-topbar {
      background: #ffffff;
      border-bottom: 2px solid #10b981;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 100;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .t13-brand {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 800;
      color: #059669;
      display: flex; align-items: center; gap: 8px;
    }

    /* Nav Tabs */
    .t13-nav-tabs {
      display: flex;
      gap: 5px;
      overflow-x: auto;
    }
    .t13-tab-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
      cursor: pointer;
      transition: all 0.25s;
      white-space: nowrap;
    }
    .t13-tab-btn.active, .t13-tab-btn:hover {
      background: #10b981;
      color: #ffffff;
      border-color: #10b981;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    /* 3D STAGE */
    .t13-stage-wrapper {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      perspective: 1200px;
      padding: 8px 16px;
      box-sizing: border-box;
      position: relative;
    }

    .t13-cube-viewport {
      width: 100%;
      max-width: 760px;
      height: 360px;
      position: relative;
      transform-style: preserve-3d;
    }

    /* The 3D Square Cube Container */
    .t13-cube-box {
      width: 100%;
      height: 100%;
      position: absolute;
      transform-style: preserve-3d;
      transition: transform 0.1s ease-out;
    }

    /* Individual 3D Square Faces */
    .t13-cube-face {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 18px;
      box-sizing: border-box;
      backface-visibility: hidden;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04);
      display: flex;
    }

    /* 4 Faces @ 380px translateZ for 760px box width */
    .t13-face-0 { transform: translateZ(380px); border-color: #10b981; }
    .t13-face-1 { transform: rotateY(90deg) translateZ(380px); border-color: #3b82f6; }
    .t13-face-2 { transform: rotateY(180deg) translateZ(380px); border-color: #f59e0b; }
    .t13-face-3 { transform: rotateY(270deg) translateZ(380px); border-color: #8b5cf6; }

    /* LEFT SIDE: Section Title Column */
    .t13-face-left-col {
      width: 220px;
      background: #f8fafc;
      border-right: 2px solid #f1f5f9;
      padding: 18px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .t13-sec-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; font-weight: 800; color: #059669;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 3px 8px; border-radius: 5px; width: fit-content;
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em;
    }
    .t13-sec-title {
      font-size: 1.25rem; font-weight: 800; color: #0f172a;
      line-height: 1.2; margin-bottom: 4px;
    }
    .t13-sec-subtitle {
      font-size: 0.78rem; font-weight: 600; color: #64748b;
    }
    .t13-sec-icon-box {
      width: 40px; height: 40px; border-radius: 10px;
      background: #10b981; color: #ffffff;
      display: flex; align-items: center; justify-content: center;
      margin-top: auto;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
    }

    /* RIGHT SIDE: Section Details Scrollable Column */
    .t13-face-right-col {
      flex: 1;
      padding: 18px;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .t13-face-right-col::-webkit-scrollbar { width: 4px; }
    .t13-face-right-col::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

    /* Content Components inside Details Panel */
    .t13-profile-grid { display: flex; gap: 14px; align-items: center; margin-bottom: 12px; }
    .t13-avatar-box {
      width: 58px; height: 58px; border-radius: 50%;
      padding: 2px; background: linear-gradient(135deg, #10b981, #f59e0b); flex-shrink: 0;
    }
    .t13-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #ffffff; }
    .t13-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%; background: #ecfdf5; color: #059669;
      font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
    }
    .t13-name { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 0; }
    .t13-headline { font-size: 0.8rem; font-weight: 600; color: #059669; }
    .t13-summary { font-size: 0.78rem; color: #475569; line-height: 1.45; margin-bottom: 12px; }

    .t13-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .t13-chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #334155;
      background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 8px; border-radius: 5px;
      text-decoration: none;
    }
    .t13-chip:hover { border-color: #10b981; color: #059669; background: #ecfdf5; }

    /* Skills Pill Cloud */
    .t13-skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .t13-skill-pill {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
      color: #1e293b; background: #f1f5f9; border: 1px solid #cbd5e1;
      padding: 4px 10px; border-radius: 5px; transition: all 0.2s;
    }
    .t13-skill-pill:hover { border-color: #10b981; background: #10b981; color: #ffffff; }

    /* Cards Grid */
    .t13-grid-card {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px;
    }
    .t13-card-title { font-size: 0.88rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
    .t13-card-sub { font-size: 0.75rem; font-weight: 600; color: #059669; margin-bottom: 3px; }
    .t13-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: #64748b;
      background: #e2e8f0; padding: 1px 5px; border-radius: 3px; display: inline-block; margin-bottom: 4px;
    }
    .t13-card-text { font-size: 0.75rem; color: #475569; line-height: 1.35; }
    .t13-gpa-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
      color: #0f172a; background: #fef08a; padding: 2px 5px; border-radius: 3px; display: inline-block; margin-top: 4px;
    }
    .t13-tech-chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
    .t13-tech-item {
      font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: #059669;
      background: #ecfdf5; padding: 1px 4px; border-radius: 3px; border: 1px solid #a7f3d0;
    }
    .t13-link {
      display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700;
      color: #059669; text-decoration: none;
    }
    .t13-link:hover { text-decoration: underline; }

    /* Form */
    .t13-input {
      width: 100%; box-sizing: border-box; background: #f8fafc; border: 1.5px solid #cbd5e1;
      padding: 8px 12px; border-radius: 6px; color: #0f172a; font-family: inherit; font-size: 11px;
      outline: none; margin-bottom: 8px;
    }
    .t13-input:focus { border-color: #10b981; background: #ffffff; }
    .t13-textarea { min-height: 60px; resize: vertical; }
    .t13-btn {
      background: #10b981; color: #ffffff; font-weight: 800; font-size: 11px;
      border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;
    }
    .t13-btn:hover { background: #059669; }

    /* Bottom Control Bar */
    .t13-control-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 50;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .t13-ctrl-btn {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid #10b981;
      color: #059669;
      display: flex; items-center; justify-content: center;
      cursor: pointer;
      transition: all 0.25s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
    .t13-ctrl-btn:hover { background: #10b981; color: #ffffff; transform: scale(1.08); }
    .t13-face-indicator {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 800;
      color: #059669;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 5px 14px;
      border-radius: 18px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t13-topbar { padding: 6px 12px; }
      .t13-cube-viewport { height: 400px; }
      .t13-cube-face { flex-direction: column; }
      .t13-face-left-col { width: 100%; padding: 10px 14px; flex-direction: row; align-items: center; height: auto; border-right: none; border-bottom: 2px solid #f1f5f9; }
      .t13-sec-icon-box { margin-top: 0; width: 32px; height: 32px; }
      .t13-face-0 { transform: translateZ(200px); }
      .t13-face-1 { transform: rotateY(90deg) translateZ(200px); }
      .t13-face-2 { transform: rotateY(180deg) translateZ(200px); }
      .t13-face-3 { transform: rotateY(270deg) translateZ(200px); }
    }
  `;
  document.head.appendChild(style);
}

const TemplateThirteen = ({ profile }) => {
  const [currentSecIdx, setCurrentSecIdx] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cubeRef = useRef(null);

  const getSkillName = (skill) => (typeof skill === "string" ? skill : skill?.name || "");
  const formatUrl = (url) => (url ? (url.startsWith("http") ? url : `https://${url}`) : "#");

  const getSocialIcon = (platform) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("github")) return <Github size={12} />;
    if (p.includes("linkedin")) return <Linkedin size={12} />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter size={12} />;
    return <Globe size={12} />;
  };

  // Build Sections list cleanly inside useMemo depending on profile, formData, isSubmitting
  const sectionsList = useMemo(() => {
    if (!profile) return [];

    const skills = profile?.skills || [];
    const experience = profile?.experience || [];
    const education = profile?.education || [];
    const projects = profile?.projects || [];
    const certifications = profile?.certifications || [];
    const socialLinks = profile?.socialMediaLinks || [];
    const services = profile?.services || [];

    const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await createContactMessage({
          receiverUsername: profile.username || profile.fullName,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });
        toast.success("Message dispatched to developer!");
        setFormData({ name: "", email: "", message: "" });
      } catch (err) {
        toast.info("Thank you for your message!");
        setFormData({ name: "", email: "", message: "" });
      } finally {
        setIsSubmitting(false);
      }
    };

    return [
      {
        id: "profile",
        title: "PROFILE & BIO",
        subtitle: "Passenger Suite",
        icon: <User size={18} />,
        renderDetails: () => (
          <div>
            <div className="t13-profile-grid">
              <div className="t13-avatar-box">
                {profile.pictureUrl ? (
                  <img src={profile.pictureUrl} alt={profile.fullName} className="t13-avatar-img" />
                ) : (
                  <div className="t13-avatar-fallback">{profile.fullName?.[0] || "U"}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h1 className="t13-name">{profile.fullName || "Developer Name"}</h1>
                <p className="t13-headline">{profile.headline || "Full Stack Software Engineer"}</p>
              </div>
            </div>

            {profile.summary && <p className="t13-summary">{profile.summary}</p>}

            <div className="t13-chips" style={{ marginBottom: "8px" }}>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="t13-chip">
                  <Mail size={11} /> {profile.email}
                </a>
              )}
              {profile.mobileNumber && (
                <span className="t13-chip"><Phone size={11} /> {profile.mobileNumber}</span>
              )}
              {profile.location && (
                <span className="t13-chip"><MapPin size={11} /> {profile.location}</span>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="t13-chips">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={formatUrl(link.profileUrl || link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t13-chip"
                  >
                    {getSocialIcon(link.platform)} {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      },
      {
        id: "skills",
        title: "TECHNICAL STACK",
        subtitle: "Skills Matrix & Services",
        icon: <Zap size={18} />,
        renderDetails: () => (
          <div>
            {skills.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <h4 style={{ fontSize: "10px", fontWeight: 700, color: "#059669", marginBottom: "6px", fontFamily: "JetBrains Mono" }}>
                  DEPENDENCIES & SKILLS
                </h4>
                <div className="t13-skills-grid">
                  {skills.map((skill, i) => (
                    <span key={i} className="t13-skill-pill">{getSkillName(skill)}</span>
                  ))}
                </div>
              </div>
            )}

            {services.length > 0 && (
              <div>
                <h4 style={{ fontSize: "10px", fontWeight: 700, color: "#059669", marginBottom: "6px", fontFamily: "JetBrains Mono" }}>
                  SERVICES OFFERED
                </h4>
                {services.map((svc, idx) => (
                  <div key={idx} className="t13-grid-card">
                    <div className="t13-card-title">{svc.title}</div>
                    <p className="t13-card-text">{svc.description}</p>
                    {svc.price && <div className="t13-gpa-badge">RATE: {svc.price}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      },
      {
        id: "projects",
        title: "FEATURED PROJECTS",
        subtitle: "Project Freight",
        icon: <Globe size={18} />,
        renderDetails: () => (
          <div>
            {projects.length > 0 ? (
              projects.map((proj, i) => (
                <div key={i} className="t13-grid-card">
                  <div className="t13-card-title">{proj.title}</div>
                  {proj.description && <p className="t13-card-text">{proj.description}</p>}
                  {proj.techStack && (
                    <div className="t13-tech-chips">
                      {proj.techStack.split(",").map((tech, idx) => (
                        <span key={idx} className="t13-tech-item">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  {(proj.projectUrl || proj.link) && (
                    <a
                      href={formatUrl(proj.projectUrl || proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t13-link"
                    >
                      Project Demo <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b", fontSize: "11px" }}>No projects listed.</p>
            )}
          </div>
        )
      },
      {
        id: "experience",
        title: "WORK JOURNEY",
        subtitle: "Career Experience Log",
        icon: <Briefcase size={18} />,
        renderDetails: () => (
          <div>
            {experience.length > 0 ? (
              experience.map((exp, i) => (
                <div key={i} className="t13-grid-card">
                  <div className="t13-card-title">{exp.position}</div>
                  <div className="t13-card-sub">{exp.company}</div>
                  <div className="t13-card-date">{exp.startDate} — {exp.endDate || "Present"}</div>
                  {exp.description && <p className="t13-card-text">{exp.description}</p>}
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b", fontSize: "11px" }}>No experience log listed.</p>
            )}
          </div>
        )
      },
      {
        id: "education",
        title: "ACADEMICS & CREDENTIALS",
        subtitle: "Education & Certifications",
        icon: <GraduationCap size={18} />,
        renderDetails: () => (
          <div>
            {education.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <h4 style={{ fontSize: "10px", fontWeight: 700, color: "#059669", marginBottom: "6px", fontFamily: "JetBrains Mono" }}>
                  EDUCATION
                </h4>
                {education.map((edu, i) => (
                  <div key={i} className="t13-grid-card">
                    <div className="t13-card-title">{edu.degree}</div>
                    <div className="t13-card-sub">{edu.institution}</div>
                    <div className="t13-card-date">{edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}</div>
                    {(edu.gpa || edu.cgpa) && <div className="t13-gpa-badge">SCORE: {edu.gpa || edu.cgpa}</div>}
                  </div>
                ))}
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h4 style={{ fontSize: "10px", fontWeight: 700, color: "#059669", marginBottom: "6px", fontFamily: "JetBrains Mono" }}>
                  CERTIFICATIONS
                </h4>
                {certifications.map((cert, i) => (
                  <div key={i} className="t13-grid-card">
                    <div className="t13-card-title">{cert.name}</div>
                    <div className="t13-card-sub">{cert.issuingOrganization}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      },
      {
        id: "contact",
        title: "CONTACT CONSOLE",
        subtitle: "Caboose Dispatcher",
        icon: <Mail size={18} />,
        renderDetails: () => (
          <div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="t13-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="t13-input"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message..."
                value={formData.message}
                onChange={handleChange}
                className="t13-input t13-textarea"
                required
              />
              <button type="submit" className="t13-btn" disabled={isSubmitting}>
                <Zap size={12} /> {isSubmitting ? "Sending..." : "Dispatch Message"}
              </button>
            </form>
          </div>
        )
      }
    ];
  }, [profile, formData, isSubmitting]);

  const rotateToSection = (index) => {
    if (index < 0 || index >= sectionsList.length) return;
    const targetAngle = -index * 90;
    setCurrentSecIdx(index);

    if (cubeRef.current) {
      animate(cubeRef.current, {
        rotateY: targetAngle,
        duration: 750,
        easing: "easeOutCubic"
      });
    }
  };

  const nextSection = () => {
    if (sectionsList.length === 0) return;
    rotateToSection((currentSecIdx + 1) % sectionsList.length);
  };

  const prevSection = () => {
    if (sectionsList.length === 0) return;
    rotateToSection((currentSecIdx - 1 + sectionsList.length) % sectionsList.length);
  };

  useEffect(() => {
    injectStyles();

    let isScrolling = false;
    const handleWheel = (e) => {
      const faceSlotIdx = currentSecIdx % 4;
      const activeFaceEl = cubeRef.current?.children[faceSlotIdx]?.querySelector(".t13-face-right-col");
      if (activeFaceEl) {
        const { scrollTop, scrollHeight, clientHeight } = activeFaceEl;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
        const isAtTop = scrollTop <= 5;

        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
          return;
        }
      }

      if (isScrolling) return;
      if (Math.abs(e.deltaY) > 25 && sectionsList.length > 0) {
        isScrolling = true;
        const targetIdx = e.deltaY > 0
          ? (currentSecIdx + 1) % sectionsList.length
          : (currentSecIdx - 1 + sectionsList.length) % sectionsList.length;
        
        setCurrentSecIdx(targetIdx);
        if (cubeRef.current) {
          animate(cubeRef.current, {
            rotateY: -targetIdx * 90,
            duration: 750,
            easing: "easeOutCubic"
          });
        }
        setTimeout(() => {
          isScrolling = false;
        }, 750);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentSecIdx, sectionsList.length]);

  if (!profile) return null;

  const getSectionForFace = (faceSlot) => {
    if (sectionsList.length === 0) return null;
    const baseGroup = Math.floor(currentSecIdx / 4) * 4;
    let targetSecIdx = baseGroup + faceSlot;
    if (targetSecIdx >= sectionsList.length) {
      targetSecIdx = targetSecIdx % sectionsList.length;
    }
    return sectionsList[targetSecIdx] || sectionsList[0];
  };

  return (
    <div className="t13-root">
      <ToastContainer position="bottom-right" theme="light" />

      {/* Top Station Header & Face Tabs */}
      <header className="t13-topbar">
        <div className="t13-brand">
          <Box size={15} /> BYTEBODH 3D WHITE SQUARE · TEMPLATE 13
        </div>

        <div className="t13-nav-tabs">
          {sectionsList.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => rotateToSection(idx)}
              className={`t13-tab-btn ${currentSecIdx === idx ? "active" : ""}`}
            >
              {idx + 1}. {sec.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </header>

      {/* Main 3D Viewport Stage (Fits 100% Zoom Screen) */}
      <main className="t13-stage-wrapper">
        <div className="t13-cube-viewport">
          <div className="t13-cube-box" ref={cubeRef}>
            {[0, 1, 2, 3].map((faceSlot) => {
              const sec = getSectionForFace(faceSlot);
              if (!sec) return null;
              return (
                <div key={faceSlot} className={`t13-cube-face t13-face-${faceSlot}`}>
                  {/* LEFT COLUMN: Section Title */}
                  <div className="t13-face-left-col">
                    <div>
                      <div className="t13-sec-tag">SECTION 0{currentSecIdx + 1} / 0{sectionsList.length}</div>
                      <h2 className="t13-sec-title">{sec.title}</h2>
                      <p className="t13-sec-subtitle">{sec.subtitle}</p>
                    </div>

                    <div className="t13-sec-icon-box">
                      {sec.icon}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Section Details */}
                  <div className="t13-face-right-col">
                    {sec.renderDetails()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Bottom 3D Controls */}
        <div className="t13-control-bar">
          <button onClick={prevSection} className="t13-ctrl-btn" title="Previous Section">
            <ChevronLeft size={18} />
          </button>

          <div className="t13-face-indicator">
            SECTION {currentSecIdx + 1} OF {sectionsList.length} : {sectionsList[currentSecIdx]?.title}
          </div>

          <button onClick={nextSection} className="t13-ctrl-btn" title="Next Section">
            <ChevronRight size={18} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "8px", textAlign: "center", fontFamily: "JetBrains Mono", fontSize: "10px", color: "#64748b", background: "#ffffff", flexShrink: 0 }}>
        BYTEBODH FOLIO · TEMPLATE 13 (WHITE EXECUTIVE SQUARE)
      </footer>
    </div>
  );
};

export default TemplateThirteen;

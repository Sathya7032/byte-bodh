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
  Triangle,
  Briefcase,
  GraduationCap,
  User
} from "lucide-react";
import { animate } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Fourteen: 3D TRIANGLE PRISM (Fits 100% Zoom Screen)
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-fourteen-3d-triangle-fit-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    .t14-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at center, #0c1a30 0%, #060c18 100%);
      color: #f8fafc;
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Flight Header Bar */
    .t14-topbar {
      background: rgba(12, 26, 48, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 2px solid #38bdf8;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 100;
      flex-shrink: 0;
    }
    .t14-brand {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 800;
      color: #38bdf8;
      display: flex; align-items: center; gap: 8px;
    }

    /* Nav Tabs */
    .t14-nav-tabs {
      display: flex;
      gap: 5px;
      overflow-x: auto;
    }
    .t14-tab-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #1e3a8a;
      background: #0c1a30;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.25s;
      white-space: nowrap;
    }
    .t14-tab-btn.active, .t14-tab-btn:hover {
      background: #38bdf8;
      color: #0c1a30;
      border-color: #38bdf8;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
    }

    /* 3D STAGE */
    .t14-stage-wrapper {
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

    .t14-prism-viewport {
      width: 100%;
      max-width: 760px;
      height: 360px;
      position: relative;
      transform-style: preserve-3d;
    }

    /* The 3D Triangular Prism Container */
    .t14-prism-box {
      width: 100%;
      height: 100%;
      position: absolute;
      transform-style: preserve-3d;
      transition: transform 0.1s ease-out;
    }

    /* Individual 3D Triangle Faces (3 Faces @ 120 deg apart) */
    .t14-triangle-face {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #101f38;
      border: 2px solid #1e3a8a;
      border-radius: 18px;
      box-sizing: border-box;
      backface-visibility: hidden;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
      display: flex;
    }

    /* 3 Faces translateZ ~220px */
    .t14-face-0 { transform: rotateY(0deg) translateZ(220px); border-color: #38bdf8; }
    .t14-face-1 { transform: rotateY(120deg) translateZ(220px); border-color: #fbbf24; }
    .t14-face-2 { transform: rotateY(240deg) translateZ(220px); border-color: #34d399; }

    /* LEFT SIDE: Section Title Column */
    .t14-face-left-col {
      width: 220px;
      background: #081226;
      border-right: 2px solid #1e3a8a;
      padding: 18px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .t14-sec-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px; font-weight: 800; color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 8px; border-radius: 5px; width: fit-content;
      margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em;
    }
    .t14-sec-title {
      font-size: 1.25rem; font-weight: 800; color: #ffffff;
      line-height: 1.2; margin-bottom: 4px;
    }
    .t14-sec-subtitle {
      font-size: 0.78rem; font-weight: 600; color: #94a3b8;
    }
    .t14-sec-icon-box {
      width: 40px; height: 40px; border-radius: 10px;
      background: #38bdf8; color: #0c1a30;
      display: flex; align-items: center; justify-content: center;
      margin-top: auto;
      box-shadow: 0 4px 10px rgba(56, 189, 248, 0.3);
    }

    /* RIGHT SIDE: Section Details Scrollable Column */
    .t14-face-right-col {
      flex: 1;
      padding: 18px;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .t14-face-right-col::-webkit-scrollbar { width: 4px; }
    .t14-face-right-col::-webkit-scrollbar-thumb { background: #1e3a8a; border-radius: 3px; }

    /* Content Components inside Details Panel */
    .t14-profile-grid { display: flex; gap: 14px; align-items: center; margin-bottom: 12px; }
    .t14-avatar-box {
      width: 58px; height: 58px; border-radius: 50%;
      padding: 2px; background: linear-gradient(135deg, #38bdf8, #fbbf24); flex-shrink: 0;
    }
    .t14-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #101f38; }
    .t14-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%; background: #1e3a8a; color: #38bdf8;
      font-size: 1.4rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
    }
    .t14-name { font-size: 1.2rem; font-weight: 800; color: #ffffff; margin: 0; }
    .t14-headline { font-size: 0.8rem; font-weight: 600; color: #38bdf8; }
    .t14-summary { font-size: 0.78rem; color: #cbd5e1; line-height: 1.45; margin-bottom: 12px; }

    .t14-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .t14-chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #cbd5e1;
      background: #081226; border: 1px solid #1e3a8a; padding: 4px 8px; border-radius: 5px;
      text-decoration: none;
    }
    .t14-chip:hover { border-color: #38bdf8; color: #38bdf8; }

    /* Skills Pill Cloud */
    .t14-skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .t14-skill-pill {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
      color: #f8fafc; background: #081226; border: 1px solid #1e3a8a;
      padding: 4px 10px; border-radius: 5px; transition: all 0.2s;
    }
    .t14-skill-pill:hover { border-color: #38bdf8; background: #38bdf8; color: #0c1a30; }

    /* Cards Grid */
    .t14-grid-card {
      background: #081226; border: 1px solid #1e3a8a; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px;
    }
    .t14-card-title { font-size: 0.88rem; font-weight: 700; color: #ffffff; margin-bottom: 2px; }
    .t14-card-sub { font-size: 0.75rem; font-weight: 600; color: #38bdf8; margin-bottom: 3px; }
    .t14-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: #94a3b8;
      background: #1e3a8a; padding: 1px 5px; border-radius: 3px; display: inline-block; margin-bottom: 4px;
    }
    .t14-card-text { font-size: 0.75rem; color: #cbd5e1; line-height: 1.35; }
    .t14-gpa-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
      color: #0c1a30; background: #fbbf24; padding: 2px 5px; border-radius: 3px; display: inline-block; margin-top: 4px;
    }
    .t14-tech-chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
    .t14-tech-item {
      font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: #38bdf8;
      background: #101f38; padding: 1px 4px; border-radius: 3px; border: 1px solid #1e3a8a;
    }
    .t14-link {
      display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700;
      color: #38bdf8; text-decoration: none;
    }
    .t14-link:hover { text-decoration: underline; }

    /* Form */
    .t14-input {
      width: 100%; box-sizing: border-box; background: #081226; border: 1.5px solid #1e3a8a;
      padding: 8px 12px; border-radius: 6px; color: #ffffff; font-family: inherit; font-size: 11px;
      outline: none; margin-bottom: 8px;
    }
    .t14-input:focus { border-color: #38bdf8; }
    .t14-textarea { min-height: 60px; resize: vertical; }
    .t14-btn {
      background: #38bdf8; color: #0c1a30; font-weight: 800; font-size: 11px;
      border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;
    }

    /* Bottom Control Bar */
    .t14-control-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 50;
      flex-shrink: 0;
      margin-top: 4px;
    }
    .t14-ctrl-btn {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: #0c1a30;
      border: 2px solid #38bdf8;
      color: #38bdf8;
      display: flex; items-center; justify-content: center;
      cursor: pointer;
      transition: all 0.25s;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
    }
    .t14-ctrl-btn:hover { background: #38bdf8; color: #0c1a30; transform: scale(1.08); }
    .t14-side-indicator {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 800;
      color: #fbbf24;
      background: #0c1a30;
      border: 1px solid #1e3a8a;
      padding: 5px 14px;
      border-radius: 18px;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t14-topbar { padding: 6px 12px; }
      .t14-prism-viewport { height: 400px; }
      .t14-triangle-face { flex-direction: column; }
      .t14-face-left-col { width: 100%; padding: 10px 14px; flex-direction: row; align-items: center; height: auto; border-right: none; border-bottom: 2px solid #1e3a8a; }
      .t14-sec-icon-box { margin-top: 0; width: 32px; height: 32px; }
      .t14-face-0 { transform: rotateY(0deg) translateZ(160px); }
      .t14-face-1 { transform: rotateY(120deg) translateZ(160px); }
      .t14-face-2 { transform: rotateY(240deg) translateZ(160px); }
    }
  `;
  document.head.appendChild(style);
}

const TemplateFourteen = ({ profile }) => {
  const [currentSecIdx, setCurrentSecIdx] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const prismRef = useRef(null);

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
        toast.success("Flight Dispatch Message Transmitted!");
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
        title: "COMMANDER PROFILE",
        subtitle: "Flight Cabin Bio & Overview",
        icon: <User size={18} />,
        renderDetails: () => (
          <div>
            <div className="t14-profile-grid">
              <div className="t14-avatar-box">
                {profile.pictureUrl ? (
                  <img src={profile.pictureUrl} alt={profile.fullName} className="t14-avatar-img" />
                ) : (
                  <div className="t14-avatar-fallback">{profile.fullName?.[0] || "U"}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h1 className="t14-name">{profile.fullName || "Developer Name"}</h1>
                <p className="t14-headline">{profile.headline || "Flight Software Engineer"}</p>
              </div>
            </div>

            {profile.summary && <p className="t14-summary">{profile.summary}</p>}

            <div className="t14-chips" style={{ marginBottom: "8px" }}>
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="t14-chip">
                  <Mail size={11} /> {profile.email}
                </a>
              )}
              {profile.mobileNumber && (
                <span className="t14-chip"><Phone size={11} /> {profile.mobileNumber}</span>
              )}
              {profile.location && (
                <span className="t14-chip"><MapPin size={11} /> {profile.location}</span>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="t14-chips">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={formatUrl(link.profileUrl || link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t14-chip"
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
        title: "TECH ARSENAL",
        subtitle: "Skill Matrix & Core Tools",
        icon: <Zap size={18} />,
        renderDetails: () => (
          <div>
            {skills.length > 0 ? (
              <div className="t14-skills-grid">
                {skills.map((skill, i) => (
                  <span key={i} className="t14-skill-pill">{getSkillName(skill)}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "11px" }}>No skills listed.</p>
            )}
          </div>
        )
      },
      {
        id: "projects",
        title: "FEATURED PROJECTS",
        subtitle: "Aircraft Fleet Projects",
        icon: <Globe size={18} />,
        renderDetails: () => (
          <div>
            {projects.length > 0 ? (
              projects.map((proj, i) => (
                <div key={i} className="t14-grid-card">
                  <div className="t14-card-title">{proj.title}</div>
                  {proj.description && <p className="t14-card-text">{proj.description}</p>}
                  {proj.techStack && (
                    <div className="t14-tech-chips">
                      {proj.techStack.split(",").map((tech, idx) => (
                        <span key={idx} className="t14-tech-item">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  {(proj.projectUrl || proj.link) && (
                    <a
                      href={formatUrl(proj.projectUrl || proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t14-link"
                    >
                      Launch Project <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "11px" }}>No projects listed.</p>
            )}
          </div>
        )
      },
      {
        id: "experience",
        title: "FLIGHT LOG",
        subtitle: "Career & Internship Jet",
        icon: <Briefcase size={18} />,
        renderDetails: () => (
          <div>
            {experience.length > 0 ? (
              experience.map((exp, i) => (
                <div key={i} className="t14-grid-card">
                  <div className="t14-card-title">{exp.position}</div>
                  <div className="t14-card-sub">{exp.company}</div>
                  <div className="t14-card-date">{exp.startDate} — {exp.endDate || "Present"}</div>
                  {exp.description && <p className="t14-card-text">{exp.description}</p>}
                </div>
              ))
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "11px" }}>No flight log entries listed.</p>
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
                <h4 style={{ fontSize: "10px", fontWeight: 700, color: "#38bdf8", marginBottom: "6px", fontFamily: "JetBrains Mono" }}>
                  EDUCATION
                </h4>
                {education.map((edu, i) => (
                  <div key={i} className="t14-grid-card">
                    <div className="t14-card-title">{edu.degree}</div>
                    <div className="t14-card-sub">{edu.institution}</div>
                    <div className="t14-card-date">{edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}</div>
                    {(edu.gpa || edu.cgpa) && <div className="t14-gpa-badge">SCORE: {edu.gpa || edu.cgpa}</div>}
                  </div>
                ))}
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h4 style={{ fontSize: "10px", fontWeight: 700, color: "#38bdf8", marginBottom: "6px", fontFamily: "JetBrains Mono" }}>
                  CERTIFICATIONS
                </h4>
                {certifications.map((cert, i) => (
                  <div key={i} className="t14-grid-card">
                    <div className="t14-card-title">{cert.name}</div>
                    <div className="t14-card-sub">{cert.issuingOrganization}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      },
      {
        id: "contact",
        title: "DISPATCH CONSOLE",
        subtitle: "Flight Message Dispatch",
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
                className="t14-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="t14-input"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message..."
                value={formData.message}
                onChange={handleChange}
                className="t14-input t14-textarea"
                required
              />
              <button type="submit" className="t14-btn" disabled={isSubmitting}>
                <Zap size={12} /> {isSubmitting ? "Transmitting..." : "Transmit Message"}
              </button>
            </form>
          </div>
        )
      }
    ];
  }, [profile, formData, isSubmitting]);

  const rotateToSection = (index) => {
    if (index < 0 || index >= sectionsList.length) return;
    const targetAngle = -index * 120;
    setCurrentSecIdx(index);

    if (prismRef.current) {
      animate(prismRef.current, {
        rotateY: targetAngle,
        duration: 750,
        easing: "easeInOutQuint"
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
      const faceSlotIdx = currentSecIdx % 3;
      const activeFaceEl = prismRef.current?.children[faceSlotIdx]?.querySelector(".t14-face-right-col");
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
        if (prismRef.current) {
          animate(prismRef.current, {
            rotateY: -targetIdx * 120,
            duration: 750,
            easing: "easeInOutQuint"
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
    const baseGroup = Math.floor(currentSecIdx / 3) * 3;
    let targetSecIdx = baseGroup + faceSlot;
    if (targetSecIdx >= sectionsList.length) {
      targetSecIdx = targetSecIdx % sectionsList.length;
    }
    return sectionsList[targetSecIdx] || sectionsList[0];
  };

  return (
    <div className="t14-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Top Flight Bar & Side Tabs */}
      <header className="t14-topbar">
        <div className="t14-brand">
          <Triangle size={15} /> BYTEBODH 3D TRIANGLE · TEMPLATE 14
        </div>

        <div className="t14-nav-tabs">
          {sectionsList.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => rotateToSection(idx)}
              className={`t14-tab-btn ${currentSecIdx === idx ? "active" : ""}`}
            >
              {idx + 1}. {sec.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </header>

      {/* Main 3D Viewport Stage (Fits 100% Zoom Screen) */}
      <main className="t14-stage-wrapper">
        <div className="t14-prism-viewport">
          <div className="t14-prism-box" ref={prismRef}>
            {[0, 1, 2].map((faceSlot) => {
              const sec = getSectionForFace(faceSlot);
              if (!sec) return null;
              return (
                <div key={faceSlot} className={`t14-triangle-face t14-face-${faceSlot}`}>
                  {/* LEFT COLUMN: Section Title */}
                  <div className="t14-face-left-col">
                    <div>
                      <div className="t14-sec-tag">SECTION 0{currentSecIdx + 1} / 0{sectionsList.length}</div>
                      <h2 className="t14-sec-title">{sec.title}</h2>
                      <p className="t14-sec-subtitle">{sec.subtitle}</p>
                    </div>

                    <div className="t14-sec-icon-box">
                      {sec.icon}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Section Details */}
                  <div className="t14-face-right-col">
                    {sec.renderDetails()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Bottom 3D Controls */}
        <div className="t14-control-bar">
          <button onClick={prevSection} className="t14-ctrl-btn" title="Previous Section">
            <ChevronLeft size={18} />
          </button>

          <div className="t14-side-indicator">
            SECTION {currentSecIdx + 1} OF {sectionsList.length} : {sectionsList[currentSecIdx]?.title}
          </div>

          <button onClick={nextSection} className="t14-ctrl-btn" title="Next Section">
            <ChevronRight size={18} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e3a8a", padding: "8px", textAlign: "center", fontFamily: "JetBrains Mono", fontSize: "10px", color: "#64748b", background: "#0c1a30", flexShrink: 0 }}>
        BYTEBODH FOLIO · TEMPLATE 14 (3D TRIANGLE ROTATOR)
      </footer>
    </div>
  );
};

export default TemplateFourteen;

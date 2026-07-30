import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Send,
  Briefcase,
  GraduationCap,
  Zap,
  Code,
  Layers,
  Palette,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Seventeen: VIBRANT COLOR VECTOR ART PORTFOLIO
   Modern 2D/3D Color Vector Illustrations, Rich Gradients & Alive Palette.
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-seventeen-color-vector-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Outfit:wght@600;800&family=JetBrains+Mono:wght@600;800&display=swap');

    .t17-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 50%, #020617 100%);
      color: #f8fafc;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Ambient Glow Particles */
    .t17-root::before {
      content: '';
      position: fixed;
      top: 10%; right: 10%;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
      pointer-events: none; z-index: 0;
    }
    .t17-root::after {
      content: '';
      position: fixed;
      bottom: 10%; left: 10%;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
      pointer-events: none; z-index: 0;
    }

    /* Topbar Header */
    .t17-topbar {
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(16px);
      border-bottom: 2px solid rgba(168, 85, 247, 0.3);
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }
    .t17-brand {
      font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 800;
      background: linear-gradient(135deg, #a855f7, #38bdf8, #f43f5e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex; align-items: center; gap: 8px;
      letter-spacing: 0.04em;
    }

    .t17-nav { display: flex; gap: 6px; flex-wrap: wrap; }
    .t17-nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700;
      color: #cbd5e1;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
      transition: all 0.25s;
    }
    .t17-nav-link:hover {
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      border-color: rgba(56, 189, 248, 0.3);
    }

    .t17-badge-status {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(168, 85, 247, 0.15);
      border: 1.5px solid #a855f7;
      border-radius: 100px;
      padding: 5px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 800;
      color: #e9d5ff;
      box-shadow: 0 0 12px rgba(168, 85, 247, 0.3);
    }

    /* Hero Section */
    .t17-hero {
      padding: 56px 24px 40px;
      position: relative; z-index: 1;
    }
    .t17-container { max-width: 1100px; margin: 0 auto; }

    .t17-hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .t17-hero-card {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(12px);
      border: 2px solid rgba(168, 85, 247, 0.3);
      border-radius: 24px;
      padding: 36px;
      position: relative;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
      transition: transform 0.3s;
    }
    .t17-hero-card:hover {
      transform: translateY(-4px);
      border-color: rgba(56, 189, 248, 0.5);
    }

    .t17-profile-header {
      display: flex; gap: 20px; align-items: center; margin-bottom: 20px;
    }
    .t17-avatar-box {
      width: 84px; height: 84px; border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #a855f7, #38bdf8, #f43f5e);
      flex-shrink: 0;
      box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4);
    }
    .t17-avatar {
      width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #0f172a;
    }
    .t17-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%; background: #0f172a; color: #a855f7;
      font-size: 2.2rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif;
    }

    .t17-name {
      font-family: 'Outfit', sans-serif;
      font-size: 2.3rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.1;
    }
    .t17-headline {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem; font-weight: 700; color: #38bdf8; margin-top: 4px;
    }
    .t17-summary { font-size: 0.9rem; color: #cbd5e1; line-height: 1.65; margin-bottom: 20px; }

    .t17-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
    .t17-chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #cbd5e1;
      background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(168, 85, 247, 0.3);
      padding: 6px 12px; border-radius: 8px; text-decoration: none; transition: all 0.2s;
    }
    .t17-chip:hover { border-color: #38bdf8; color: #38bdf8; background: rgba(56, 189, 248, 0.15); }

    .t17-social-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .t17-social-btn {
      width: 40px; height: 40px; border-radius: 12px;
      background: rgba(15, 23, 42, 0.8); border: 1.5px solid rgba(168, 85, 247, 0.4);
      color: #e9d5ff; display: flex; align-items: center; justify-content: justify;
      text-decoration: none; transition: all 0.25s; justify-content: center;
    }
    .t17-social-btn:hover {
      background: linear-gradient(135deg, #a855f7, #38bdf8);
      color: #ffffff; border-color: transparent; transform: translateY(-3px) rotate(8deg);
      box-shadow: 0 8px 18px rgba(168, 85, 247, 0.4);
    }

    /* Color Vector Artwork Container */
    .t17-vector-box {
      background: rgba(30, 41, 59, 0.6); border: 2px solid rgba(56, 189, 248, 0.3); border-radius: 24px;
      padding: 32px; text-align: center; display: flex; flex-direction: column;
      align-items: center; justify-content: center; position: relative; overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .t17-vector-img {
      width: 100%; max-width: 380px; height: auto;
      transition: transform 0.3s;
    }
    .t17-vector-img:hover { transform: scale(1.04); }

    /* Stats Strip */
    .t17-stats-section { padding: 0 24px 40px; position: relative; z-index: 1; }
    .t17-stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px;
    }
    .t17-stat-card {
      background: rgba(30, 41, 59, 0.8); border: 2px solid rgba(168, 85, 247, 0.3); border-radius: 16px;
      padding: 20px; text-align: center; transition: all 0.25s;
    }
    .t17-stat-card:hover { border-color: #38bdf8; transform: translateY(-3px); }
    .t17-stat-num {
      font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800;
      background: linear-gradient(135deg, #a855f7, #38bdf8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .t17-stat-lbl {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
      color: #cbd5e1; text-transform: uppercase; margin-top: 4px; letter-spacing: 0.1em;
    }

    /* Main Grid */
    .t17-main { max-width: 1100px; margin: 0 auto; padding: 0 24px 60px; position: relative; z-index: 1; }
    .t17-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .t17-sec-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid rgba(168, 85, 247, 0.3);
    }
    .t17-sec-title {
      font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: #ffffff;
      display: flex; align-items: center; gap: 10px;
    }

    /* Color Card */
    .t17-color-card {
      background: rgba(30, 41, 59, 0.8); border: 2px solid rgba(168, 85, 247, 0.25); border-radius: 18px;
      padding: 24px; position: relative; margin-bottom: 18px; transition: all 0.25s;
    }
    .t17-color-card:hover {
      border-color: #38bdf8; box-shadow: 0 12px 30px rgba(56, 189, 248, 0.15); transform: translateY(-3px);
    }
    .t17-card-title { font-size: 1.1rem; font-weight: 800; color: #ffffff; margin-bottom: 4px; }
    .t17-card-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 700; color: #a855f7; margin-bottom: 6px; }
    .t17-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #38bdf8;
      background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); padding: 3px 8px; border-radius: 4px;
      display: inline-block; margin-bottom: 10px;
    }
    .t17-card-text { font-size: 0.85rem; color: #cbd5e1; line-height: 1.6; }

    /* Skills Pill Grid */
    .t17-skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .t17-skill-pill {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #f8fafc; background: rgba(15, 23, 42, 0.9); border: 1.5px solid rgba(168, 85, 247, 0.4);
      padding: 6px 14px; border-radius: 8px; transition: all 0.25s;
    }
    .t17-skill-pill:hover {
      background: linear-gradient(135deg, #a855f7, #38bdf8); color: #ffffff; border-color: transparent;
    }

    /* Project Cards with Color Vector Banners */
    .t17-proj-banner {
      width: 100%; height: 160px; object-fit: contain; background: rgba(15, 23, 42, 0.6);
      border-radius: 12px; margin-bottom: 14px; padding: 12px; box-sizing: border-box;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    .t17-tech-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #38bdf8;
      background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); padding: 2px 7px; border-radius: 4px; margin-right: 4px;
    }
    .t17-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #a855f7; text-decoration: none; margin-top: 12px;
    }
    .t17-link:hover { text-decoration: underline; color: #38bdf8; }

    /* Form */
    .t17-input {
      width: 100%; box-sizing: border-box; background: rgba(15, 23, 42, 0.9); border: 1.5px solid rgba(168, 85, 247, 0.4);
      padding: 12px 16px; border-radius: 8px; color: #ffffff; font-family: inherit; font-size: 12px;
      outline: none; margin-bottom: 12px;
    }
    .t17-input:focus { border-color: #38bdf8; }
    .t17-textarea { min-height: 90px; resize: vertical; }
    .t17-btn {
      background: linear-gradient(135deg, #a855f7, #38bdf8); color: #ffffff;
      font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px;
      border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px; transition: all 0.25s;
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
    }
    .t17-btn:hover { opacity: 0.95; transform: translateY(-2px); }

    /* Footer */
    .t17-footer {
      border-top: 2px solid rgba(168, 85, 247, 0.3); padding: 24px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #cbd5e1; background: #0f172a;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t17-hero-grid { grid-template-columns: 1fr; }
      .t17-grid-2 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

const TemplateSeventeen = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  const getSkillName = (skill) => (typeof skill === "string" ? skill : skill?.name || "");
  const formatUrl = (url) => (url ? (url.startsWith("http") ? url : `https://${url}`) : "#");

  const skills = profile?.skills || [];
  const experience = profile?.experience || [];
  const education = profile?.education || [];
  const projects = profile?.projects || [];
  const certifications = profile?.certifications || [];
  const socialLinks = profile?.socialMediaLinks || [];
  const services = profile?.services || [];

  const getSocialIcon = (platform) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("github")) return <Github size={15} />;
    if (p.includes("linkedin")) return <Linkedin size={15} />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter size={15} />;
    return <Globe size={15} />;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);
    try {
      await createContactMessage({
        receiverUsername: profile.username || profile.fullName,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      toast.success("Message Transmitted to Developer!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="t17-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Topbar Header */}
      <header className="t17-topbar">
        <a href="#hero" className="t17-brand">
          <Palette size={16} /> BYTEBODH COLOR VECTOR · TEMPLATE 17
        </a>

        <nav className="t17-nav">
          <a href="#skills" className="t17-nav-link">Skills Deck</a>
          <a href="#projects" className="t17-nav-link">Projects</a>
          <a href="#experience" className="t17-nav-link">Experience</a>
          <a href="#contact" className="t17-nav-link">Contact</a>
        </nav>

        <div className="t17-badge-status">
          <CheckCircle2 size={13} /> OPEN TO OPPORTUNITIES
        </div>
      </header>

      {/* HERO SECTION WITH VIBRANT COLOR VECTOR ARTWORK */}
      <section id="hero" className="t17-hero">
        <div className="t17-container">
          <div className="t17-hero-grid">
            {/* Left Column: Profile Card */}
            <div className="t17-hero-card">
              <div className="t17-profile-header">
                <div className="t17-avatar-box">
                  {profile.pictureUrl ? (
                    <img src={profile.pictureUrl} alt={profile.fullName} className="t17-avatar" />
                  ) : (
                    <div className="t17-avatar-fallback">{profile.fullName?.[0] || "V"}</div>
                  )}
                </div>
                <div>
                  <h1 className="t17-name">{profile.fullName || "Developer Name"}</h1>
                  <div className="t17-headline">{profile.headline || "Full Stack Software Engineer"}</div>
                </div>
              </div>

              {profile.summary && <p className="t17-summary">{profile.summary}</p>}

              <div className="t17-chips">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="t17-chip">
                    <Mail size={12} /> {profile.email}
                  </a>
                )}
                {profile.mobileNumber && (
                  <span className="t17-chip"><Phone size={12} /> {profile.mobileNumber}</span>
                )}
                {profile.location && (
                  <span className="t17-chip"><MapPin size={12} /> {profile.location}</span>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="t17-social-row">
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={formatUrl(link.profileUrl || link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t17-social-btn"
                      title={link.platform}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Colorful Hero Vector Artwork */}
            <div className="t17-vector-box">
              <img
                src="https://illustrations.popsy.co/amber/keynote.svg"
                alt="Colorful Developer Vector Illustration"
                className="t17-vector-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="t17-stats-section">
        <div className="t17-container">
          <div className="t17-stats-grid">
            <div className="t17-stat-card">
              <div className="t17-stat-num">{experience.length || 3}+</div>
              <div className="t17-stat-lbl">Years Experience</div>
            </div>

            <div className="t17-stat-card">
              <div className="t17-stat-num">{projects.length || 8}+</div>
              <div className="t17-stat-lbl">Projects Built</div>
            </div>

            <div className="t17-stat-card">
              <div className="t17-stat-num">{skills.length || 12}+</div>
              <div className="t17-stat-lbl">Skills Mastered</div>
            </div>

            <div className="t17-stat-card">
              <div className="t17-stat-num">{certifications.length || 4}+</div>
              <div className="t17-stat-lbl">Certifications</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="t17-main">
        {/* SKILLS */}
        {skills.length > 0 && (
          <section id="skills" style={{ marginBottom: "44px" }}>
            <div className="t17-sec-header">
              <h2 className="t17-sec-title"><Layers size={18} /> TECHNICAL SKILLS & TOOLS</h2>
            </div>

            <div className="t17-color-card">
              <div className="t17-skills-grid">
                {skills.map((skill, i) => (
                  <span key={i} className="t17-skill-pill">{getSkillName(skill)}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED PROJECTS */}
        {projects.length > 0 && (
          <section id="projects" style={{ marginBottom: "44px" }}>
            <div className="t17-sec-header">
              <h2 className="t17-sec-title"><Code size={18} /> FEATURED PROJECTS</h2>
            </div>

            <div className="t17-grid-2">
              {projects.map((proj, i) => {
                const vectorList = [
                  "https://illustrations.popsy.co/amber/app-launch.svg",
                  "https://illustrations.popsy.co/amber/design-thinking.svg",
                  "https://illustrations.popsy.co/amber/developer.svg",
                  "https://illustrations.popsy.co/amber/workspace.svg"
                ];
                const vectorUrl = vectorList[i % vectorList.length];

                return (
                  <div key={i} className="t17-color-card">
                    <img src={vectorUrl} alt={proj.title} className="t17-proj-banner" />
                    <h3 className="t17-card-title">{proj.title}</h3>
                    {proj.description && <p className="t17-card-text">{proj.description}</p>}
                    {proj.techStack && (
                      <div style={{ marginTop: "10px" }}>
                        {proj.techStack.split(",").map((tech, idx) => (
                          <span key={idx} className="t17-tech-badge">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {(proj.projectUrl || proj.link) && (
                      <a
                        href={formatUrl(proj.projectUrl || proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t17-link"
                      >
                        LAUNCH DEMO <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {experience.length > 0 && (
          <section id="experience" style={{ marginBottom: "44px" }}>
            <div className="t17-sec-header">
              <h2 className="t17-sec-title"><Briefcase size={18} /> EXPERIENCE LOG</h2>
            </div>

            <div className="t17-grid-2">
              {experience.map((exp, i) => (
                <div key={i} className="t17-color-card">
                  <h3 className="t17-card-title">{exp.position}</h3>
                  <div className="t17-card-sub">{exp.company}</div>
                  <div className="t17-card-date">{exp.startDate} — {exp.endDate || "Present"}</div>
                  {exp.description && <p className="t17-card-text">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION & CERTIFICATIONS */}
        {(education.length > 0 || certifications.length > 0) && (
          <section style={{ marginBottom: "44px" }}>
            <div className="t17-sec-header">
              <h2 className="t17-sec-title"><GraduationCap size={18} /> ACADEMICS & CERTIFICATIONS</h2>
            </div>

            <div className="t17-grid-2">
              {education.map((edu, i) => (
                <div key={i} className="t17-color-card">
                  <h3 className="t17-card-title">{edu.degree}</h3>
                  <div className="t17-card-sub">{edu.institution}</div>
                  <div className="t17-card-date">{edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}</div>
                  {(edu.gpa || edu.cgpa) && <div className="t17-card-text" style={{ fontWeight: 700, color: "#38bdf8" }}>SCORE: {edu.gpa || edu.cgpa}</div>}
                </div>
              ))}

              {certifications.map((cert, i) => (
                <div key={i} className="t17-color-card">
                  <h3 className="t17-card-title">{cert.name}</h3>
                  <div className="t17-card-sub">{cert.issuingOrganization}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES OFFERED */}
        {services.length > 0 && (
          <section style={{ marginBottom: "44px" }}>
            <div className="t17-sec-header">
              <h2 className="t17-sec-title"><Zap size={18} /> SERVICES OFFERED</h2>
            </div>

            <div className="t17-grid-2">
              {services.map((svc, i) => (
                <div key={i} className="t17-color-card">
                  <h3 className="t17-card-title">{svc.title}</h3>
                  <p className="t17-card-text">{svc.description}</p>
                  {svc.price && <div style={{ marginTop: "8px", fontWeight: 700, fontSize: "11px", color: "#a855f7", fontFamily: "JetBrains Mono" }}>RATE: {svc.price}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT FORM WITH COLOR VECTOR ARTWORK */}
        <section id="contact">
          <div className="t17-sec-header">
            <h2 className="t17-sec-title"><Mail size={18} /> DISPATCH MESSAGE</h2>
          </div>

          <div className="t17-grid-2">
            <div className="t17-color-card">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="t17-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="t17-input"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={handleChange}
                  className="t17-input t17-textarea"
                  required
                />
                <button type="submit" className="t17-btn" disabled={isSubmitting}>
                  <Send size={13} /> {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
                </button>
              </form>
            </div>

            <div className="t17-vector-box" style={{ padding: "20px" }}>
              <img
                src="https://illustrations.popsy.co/amber/surfer.svg"
                alt="Colorful Contact Vector Artwork"
                className="t17-vector-img"
                style={{ maxHeight: "200px" }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="t17-footer">
        BYTEBODH FOLIO · TEMPLATE 17 (VIBRANT COLOR VECTOR ARTWORK)
      </footer>
    </div>
  );
};

export default TemplateSeventeen;

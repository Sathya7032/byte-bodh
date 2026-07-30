import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Award,
  Send,
  Briefcase,
  GraduationCap,
  Code2,
  FolderOpen,
  Navigation,
  Compass,
  Zap,
  ExternalLink,
} from "lucide-react";
import { animate, stagger } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Twelve: CAREER ROADMAP 12.0 (Interactive Station Journey)
   Palette: Dark Slate, Neon Yellow, Amber Brown, Crisp White
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-twelve-roadmap-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

    .t12-root {
      font-family: 'Space Grotesk', sans-serif;
      background: #0f172a; /* Dark Slate Base */
      color: #f8fafc;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Top Station Bar */
    .t12-topbar {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 2px solid #f59e0b;
      padding: 12px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .t12-brand {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: #f59e0b;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .t12-station-nav {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .t12-nav-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      background: #1e293b;
      border: 1px solid #334155;
      padding: 5px 12px;
      border-radius: 20px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .t12-nav-btn:hover {
      color: #f59e0b;
      border-color: #f59e0b;
      background: #78350f;
    }

    /* Roadmap Container */
    .t12-roadmap-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 50px 24px 80px;
      position: relative;
    }

    /* Vertical Station Line Track */
    .t12-track-line {
      position: absolute;
      top: 90px;
      bottom: 120px;
      left: 60px;
      width: 4px;
      background: linear-gradient(180deg, #f59e0b 0%, #78350f 50%, #f59e0b 100%);
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
      z-index: 0;
    }
    @media (max-width: 640px) {
      .t12-track-line {
        left: 28px;
      }
    }

    /* Station Item Block */
    .t12-station-block {
      position: relative;
      z-index: 1;
      margin-bottom: 50px;
      padding-left: 100px;
    }
    @media (max-width: 640px) {
      .t12-station-block {
        padding-left: 56px;
      }
    }

    /* Station Badge Node */
    .t12-node-circle {
      position: absolute;
      left: 36px;
      top: 0;
      width: 52px; height: 52px;
      border-radius: 50%;
      background: #1e293b;
      border: 3px solid #f59e0b;
      color: #f59e0b;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
    }
    @media (max-width: 640px) {
      .t12-node-circle {
        left: 8px;
        width: 42px; height: 42px;
        font-size: 12px;
      }
    }

    /* Station Card Container */
    .t12-station-card {
      background: #1e293b;
      border: 1.5px solid #334155;
      border-top: 3px solid #f59e0b;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      transition: all 0.25s;
    }
    .t12-station-card:hover {
      border-color: #f59e0b;
      transform: translateY(-2px);
    }
    .t12-station-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .t12-station-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #ffffff;
      display: flex; align-items: center; gap: 10px;
    }
    .t12-station-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 700;
      color: #f59e0b; background: #78350f;
      padding: 3px 10px; border-radius: 4px;
    }

    /* Profile Station */
    .t12-profile-wrap {
      display: flex; gap: 24px; align-items: center; flex-wrap: wrap;
    }
    .t12-avatar-box {
      width: 110px; height: 110px; border-radius: 50%;
      padding: 3px; background: linear-gradient(135deg, #f59e0b, #78350f);
      flex-shrink: 0;
    }
    .t12-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid #1e293b; }
    .t12-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%; background: #78350f; color: #f59e0b;
      font-size: 2.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
      border: 3px solid #1e293b;
    }
    .t12-name { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; color: #ffffff; margin: 0 0 6px 0; }
    .t12-headline { font-size: 1.05rem; font-weight: 600; color: #f59e0b; margin-bottom: 12px; }
    .t12-summary { font-size: 0.9rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 16px; }

    .t12-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .t12-chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #f8fafc;
      background: #0f172a; border: 1px solid #334155; padding: 6px 12px; border-radius: 6px;
      text-decoration: none;
    }
    .t12-chip:hover { border-color: #f59e0b; color: #f59e0b; }

    /* Skills Grid */
    .t12-skills-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
    .t12-skill-pill {
      font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
      color: #f8fafc; background: #0f172a; border: 1px solid #78350f;
      padding: 8px 16px; border-radius: 8px; transition: all 0.2s;
    }
    .t12-skill-pill:hover { border-color: #f59e0b; background: #78350f; color: #fef08a; }

    /* Cards Grid */
    .t12-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .t12-inner-card {
      background: #0f172a; border: 1px solid #334155; border-left: 4px solid #78350f;
      padding: 20px; border-radius: 10px; transition: all 0.2s;
    }
    .t12-inner-card:hover { border-left-color: #f59e0b; transform: translateY(-2px); }
    .t12-card-role { font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
    .t12-card-org { font-size: 0.9rem; font-weight: 600; color: #f59e0b; margin-bottom: 8px; }
    .t12-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #94a3b8;
      background: #1e293b; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px;
    }
    .t12-card-text { font-size: 0.85rem; color: #cbd5e1; line-height: 1.6; }
    .t12-gpa-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #0f172a; background: #f59e0b; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 10px;
    }
    .t12-tech-tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
    .t12-tech-item {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #f59e0b;
      background: #1e293b; padding: 2px 6px; border-radius: 4px; border: 1px solid #334155;
    }
    .t12-link {
      display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700;
      color: #f59e0b; text-decoration: none;
    }
    .t12-link:hover { text-decoration: underline; }

    /* Contact Form */
    .t12-input {
      width: 100%; box-sizing: border-box; background: #0f172a; border: 1.5px solid #334155;
      padding: 12px 16px; border-radius: 8px; color: #ffffff; font-family: inherit; font-size: 13px;
      outline: none; margin-bottom: 14px;
    }
    .t12-input:focus { border-color: #f59e0b; }
    .t12-textarea { min-height: 100px; resize: vertical; }
    .t12-btn {
      background: #f59e0b; color: #0f172a; font-weight: 800; font-size: 13px;
      border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .t12-btn:hover { background: #ffffff; }

    /* Footer */
    .t12-footer {
      border-top: 1px solid #1e293b; padding: 24px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; background: #0f172a;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t12-topbar { padding: 10px 14px; flex-direction: column; gap: 8px; align-items: flex-start; }
      .t12-roadmap-container { padding: 30px 14px 60px; }
      .t12-station-card { padding: 18px 14px; }
      .t12-grid-2 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

const TemplateTwelve = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Anime.js v4 station node pop & card stagger
    animate(".t12-node-circle", {
      scale: [0.8, 1],
      opacity: [0, 1],
      delay: stagger(100),
      duration: 600,
    });

    animate(".t12-station-card", {
      translateY: [30, 0],
      opacity: [0, 1],
      delay: stagger(120),
      duration: 700,
    });
  }, []);

  if (!profile) return null;

  const getSkillName = (skill) => (typeof skill === "string" ? skill : skill?.name || "");
  const formatUrl = (url) => (url ? (url.startsWith("http") ? url : `https://${url}`) : "#");

  const skills = profile.skills || [];
  const experience = profile.experience || [];
  const education = profile.education || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];
  const socialLinks = profile.socialMediaLinks || [];

  const getSocialIcon = (platform) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("github")) return <Github size={14} />;
    if (p.includes("linkedin")) return <Linkedin size={14} />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter size={14} />;
    return <Globe size={14} />;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      toast.success("Destination Reached! Message Transmitted.");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for connecting!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="t12-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Top Station Bar */}
      <header className="t12-topbar">
        <div className="t12-brand">
          <Navigation size={16} /> CAREER ROADMAP v12.0
        </div>
        <nav className="t12-station-nav">
          <a href="#station-1" className="t12-nav-btn">Stn 01: Profile</a>
          <a href="#station-2" className="t12-nav-btn">Stn 02: Skills</a>
          <a href="#station-3" className="t12-nav-btn">Stn 03: Experience</a>
          <a href="#station-4" className="t12-nav-btn">Stn 04: Education</a>
          <a href="#station-5" className="t12-nav-btn">Stn 05: Projects</a>
          <a href="#station-6" className="t12-nav-btn">Stn 06: Contact</a>
        </nav>
      </header>

      {/* Main Roadmap Container */}
      <main className="t12-roadmap-container">
        {/* Continuous Line Track */}
        <div className="t12-track-line" />

        {/* STATION 01: PROFILE */}
        <div id="station-1" className="t12-station-block">
          <div className="t12-node-circle">01</div>
          <div className="t12-station-card">
            <div className="t12-station-header">
              <div className="t12-station-title"><Compass size={18} /> Departure (Profile)</div>
              <span className="t12-station-tag">STATION 01</span>
            </div>
            <div className="t12-profile-wrap">
              <div className="t12-avatar-box">
                {profile.pictureUrl ? (
                  <img src={profile.pictureUrl} alt={profile.fullName} className="t12-avatar-img" />
                ) : (
                  <div className="t12-avatar-fallback">{profile.fullName?.[0] || "S"}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h1 className="t12-name">{profile.fullName}</h1>
                <p className="t12-headline">{profile.headline}</p>
                {profile.summary && <p className="t12-summary">{profile.summary}</p>}

                <div className="t12-chips">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="t12-chip">
                      <Mail size={14} /> {profile.email}
                    </a>
                  )}
                  {profile.mobileNumber && (
                    <span className="t12-chip"><Phone size={14} /> {profile.mobileNumber}</span>
                  )}
                  {profile.location && (
                    <span className="t12-chip"><MapPin size={14} /> {profile.location}</span>
                  )}
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={formatUrl(link.profileUrl || link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t12-chip"
                    >
                      {getSocialIcon(link.platform)} {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATION 02: SKILLS */}
        {skills.length > 0 && (
          <div id="station-2" className="t12-station-block">
            <div className="t12-node-circle">02</div>
            <div className="t12-station-card">
              <div className="t12-station-header">
                <div className="t12-station-title"><Code2 size={18} /> Skill Junction</div>
                <span className="t12-station-tag">STATION 02</span>
              </div>
              <div className="t12-skills-wrap">
                {skills.map((skill, i) => (
                  <span key={i} className="t12-skill-pill">
                    {getSkillName(skill)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATION 03: EXPERIENCE */}
        {experience.length > 0 && (
          <div id="station-3" className="t12-station-block">
            <div className="t12-node-circle">03</div>
            <div className="t12-station-card">
              <div className="t12-station-header">
                <div className="t12-station-title"><Briefcase size={18} /> Internship Express</div>
                <span className="t12-station-tag">STATION 03</span>
              </div>
              <div className="t12-grid-2">
                {experience.map((exp, i) => (
                  <div key={i} className="t12-inner-card">
                    <div className="t12-card-role">{exp.position}</div>
                    <div className="t12-card-org">{exp.company}</div>
                    <div className="t12-card-date">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </div>
                    {exp.description && <p className="t12-card-text">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATION 04: EDUCATION */}
        {education.length > 0 && (
          <div id="station-4" className="t12-station-block">
            <div className="t12-node-circle">04</div>
            <div className="t12-station-card">
              <div className="t12-station-header">
                <div className="t12-station-title"><GraduationCap size={18} /> Academic Academy</div>
                <span className="t12-station-tag">STATION 04</span>
              </div>
              <div className="t12-grid-2">
                {education.map((edu, i) => (
                  <div key={i} className="t12-inner-card">
                    <div className="t12-card-role">{edu.degree}</div>
                    <div className="t12-card-org">{edu.institution}</div>
                    <div className="t12-card-date">
                      {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                    </div>
                    {edu.fieldOfStudy && <p className="t12-card-text">Major: {edu.fieldOfStudy}</p>}
                    {(edu.gpa || edu.percentage || edu.cgpa) && (
                      <div className="t12-gpa-badge">SCORE: {edu.gpa || edu.percentage || edu.cgpa}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATION 05: PROJECTS & CERTIFICATIONS */}
        {projects.length > 0 && (
          <div id="station-5" className="t12-station-block">
            <div className="t12-node-circle">05</div>
            <div className="t12-station-card">
              <div className="t12-station-header">
                <div className="t12-station-title"><FolderOpen size={18} /> Project Terminus</div>
                <span className="t12-station-tag">STATION 05</span>
              </div>
              <div className="t12-grid-2">
                {projects.map((proj, i) => (
                  <div key={i} className="t12-inner-card">
                    <div className="t12-card-role">{proj.title}</div>
                    {proj.description && <p className="t12-card-text">{proj.description}</p>}
                    {proj.techStack && (
                      <div className="t12-tech-tags">
                        {proj.techStack.split(",").map((tech, idx) => (
                          <span key={idx} className="t12-tech-item">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {(proj.projectUrl || proj.link) && (
                      <a
                        href={formatUrl(proj.projectUrl || proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t12-link"
                      >
                        Project Console <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {certifications.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div className="t12-station-header" style={{ borderBottom: "none", marginBottom: 12 }}>
                    <div className="t12-station-title" style={{ fontSize: "1.1rem" }}>
                      <Award size={16} /> Honors & Certifications
                    </div>
                  </div>
                  <div className="t12-grid-2">
                    {certifications.map((cert, i) => (
                      <div key={i} className="t12-inner-card">
                        <div className="t12-card-role">{cert.name}</div>
                        <div className="t12-card-org">{cert.issuingOrganization}</div>
                        {cert.issueDate && <div className="t12-card-date">{cert.issueDate}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATION 06: CONTACT */}
        <div id="station-6" className="t12-station-block">
          <div className="t12-node-circle">06</div>
          <div className="t12-station-card">
            <div className="t12-station-header">
              <div className="t12-station-title"><Send size={18} /> Destination (Contact)</div>
              <span className="t12-station-tag">STATION 06</span>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="YOUR NAME"
                value={formData.name}
                onChange={handleChange}
                className="t12-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="YOUR EMAIL"
                value={formData.email}
                onChange={handleChange}
                className="t12-input"
                required
              />
              <textarea
                name="message"
                placeholder="YOUR MESSAGE..."
                value={formData.message}
                onChange={handleChange}
                className="t12-input t12-textarea"
                required
              />
              <button type="submit" className="t12-btn" disabled={isSubmitting}>
                <Zap size={14} /> {isSubmitting ? "SENDING..." : "DISPATCH MESSAGE"}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="t12-footer">
        BYTEBODH FOLIO // TEMPLATE TWELVE (CAREER ROADMAP)
      </footer>
    </div>
  );
};

export default TemplateTwelve;

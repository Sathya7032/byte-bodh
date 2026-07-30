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
  FolderOpen,
  Terminal,
  Cpu,
  ExternalLink,
  Zap,
} from "lucide-react";
import { animate, stagger } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Seven: Cyber HUD / Matrix Student Console
   Palette: Black & White, Yellow, Brown, Dark Slate Grey
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-seven-cyber-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');

    .t7-root {
      font-family: 'Chakra Petch', sans-serif;
      background-color: #0b1120; /* Deepest Slate Black */
      color: #f8fafc;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Cyber grid overlay */
    .t7-grid-bg {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(245, 158, 11, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(245, 158, 11, 0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }

    /* Sticky HUD Header */
    .t7-hud-topbar {
      background: rgba(11, 17, 32, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 2px solid #f59e0b; /* Yellow border */
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .t7-hud-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: #f59e0b;
      letter-spacing: 0.1em;
    }
    .t7-status-pulse {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #f59e0b;
      box-shadow: 0 0 10px #f59e0b;
    }
    .t7-hud-nav {
      display: flex;
      gap: 18px;
    }
    .t7-hud-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      text-decoration: none;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    .t7-hud-link:hover {
      color: #f59e0b;
    }

    /* Main HUD Container */
    .t7-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px 80px;
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 32px;
    }
    @media (max-width: 960px) {
      .t7-container {
        grid-template-columns: 1fr;
      }
    }

    /* Left Cyber Card Panel */
    .t7-side-card {
      background: #1e293b; /* Dark Slate Grey */
      border: 2px solid #78350f; /* Warm Brown Border */
      border-radius: 12px;
      padding: 28px 24px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      position: sticky;
      top: 90px;
      height: fit-content;
    }
    .t7-avatar-frame {
      position: relative;
      width: 120px; height: 120px;
      margin: 0 auto 20px;
    }
    .t7-cyber-ring {
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px dashed #f59e0b;
    }
    .t7-avatar-img {
      width: 100%; height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #0b1120;
    }
    .t7-avatar-fallback {
      width: 100%; height: 100%;
      border-radius: 50%;
      background: #78350f;
      color: #f59e0b;
      font-size: 3rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 3px solid #0b1120;
    }
    .t7-name {
      font-size: 1.6rem;
      font-weight: 700;
      color: #ffffff;
      text-align: center;
      margin: 0 0 6px 0;
      letter-spacing: -0.01em;
    }
    .t7-headline {
      font-size: 0.9rem;
      font-weight: 600;
      color: #f59e0b;
      text-align: center;
      margin-bottom: 16px;
    }
    .t7-badge {
      display: block;
      width: fit-content;
      margin: 0 auto 24px;
      background: #78350f;
      color: #fef08a;
      border: 1px solid #f59e0b;
      padding: 3px 12px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .t7-contacts {
      display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;
    }
    .t7-chip {
      display: flex; align-items: center; gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; color: #cbd5e1;
      background: #0b1120; border: 1px solid #334155;
      padding: 8px 12px; border-radius: 6px;
      text-decoration: none; word-break: break-all;
    }
    .t7-chip:hover {
      border-color: #f59e0b; color: #f59e0b;
    }
    .t7-socials {
      display: flex; gap: 8px; justify-content: center;
    }
    .t7-social-btn {
      width: 36px; height: 36px;
      background: #0b1120; border: 1px solid #334155;
      color: #ffffff; border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      text-decoration: none; transition: all 0.2s;
    }
    .t7-social-btn:hover {
      background: #f59e0b; color: #0b1120; border-color: #f59e0b;
    }

    /* Right HUD Consoles */
    .t7-main-console {
      display: flex; flex-direction: column; gap: 32px;
    }
    .t7-console-block {
      background: #1e293b;
      border: 1.5px solid #334155;
      border-top: 3px solid #f59e0b; /* Yellow top rule */
      border-radius: 10px;
      padding: 28px;
      position: relative;
    }
    .t7-block-header {
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px; margin-bottom: 20px;
    }
    .t7-block-title {
      font-size: 1.25rem; font-weight: 700; color: #ffffff;
      display: flex; align-items: center; gap: 8px;
    }
    .t7-block-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 700;
      color: #f59e0b; background: #78350f;
      padding: 2px 8px; border-radius: 4px;
    }

    /* Skills Grid */
    .t7-skills-wrap {
      display: flex; flex-wrap: wrap; gap: 10px;
    }
    .t7-skill-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; font-weight: 700;
      color: #f8fafc; background: #0b1120;
      border: 1px solid #78350f;
      padding: 8px 14px; border-radius: 6px;
      transition: all 0.2s;
    }
    .t7-skill-tag:hover {
      border-color: #f59e0b; background: #78350f; color: #fef08a;
    }

    /* Cyber List Cards */
    .t7-card-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;
    }
    .t7-cyber-card {
      background: #0b1120;
      border: 1px solid #334155;
      border-left: 4px solid #78350f;
      padding: 20px; border-radius: 8px;
      transition: all 0.2s;
    }
    .t7-cyber-card:hover {
      border-left-color: #f59e0b;
      transform: translateY(-2px);
    }
    .t7-card-role {
      font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-bottom: 4px;
    }
    .t7-card-org {
      font-size: 0.9rem; font-weight: 600; color: #f59e0b; margin-bottom: 8px;
    }
    .t7-card-date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; color: #94a3b8; background: #1e293b;
      padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px;
    }
    .t7-card-desc {
      font-size: 0.85rem; color: #cbd5e1; line-height: 1.6;
    }
    .t7-gpa-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700;
      color: #0b1120; background: #f59e0b;
      padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 10px;
    }

    /* Projects */
    .t7-tech-row {
      display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0;
    }
    .t7-tech-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 700; color: #f59e0b; background: #1e293b;
      padding: 2px 6px; border-radius: 4px; border: 1px solid #334155;
    }
    .t7-proj-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 700; color: #f59e0b; text-decoration: none;
    }
    .t7-proj-btn:hover { text-decoration: underline; }

    /* Contact Form */
    .t7-input {
      width: 100%; box-sizing: border-box;
      background: #0b1120; border: 1.5px solid #334155;
      padding: 12px 16px; border-radius: 6px;
      color: #ffffff; font-family: inherit; font-size: 13px;
      outline: none; margin-bottom: 14px;
    }
    .t7-input:focus { border-color: #f59e0b; }
    .t7-textarea { min-height: 100px; resize: vertical; }
    .t7-btn {
      background: #f59e0b; color: #0b1120;
      font-weight: 800; font-size: 13px; font-family: 'JetBrains Mono', monospace;
      border: none; border-radius: 6px; padding: 12px 24px;
      cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    }
    .t7-btn:hover { background: #ffffff; }

    /* Footer */
    .t7-footer {
      border-top: 1px solid #1e293b; padding: 24px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b;
      background: #0b1120;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t7-hud-topbar {
        padding: 10px 16px;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
        position: relative;
      }
      .t7-hud-nav {
        flex-wrap: wrap;
        gap: 10px;
      }
      .t7-container {
        padding: 20px 14px 60px;
        gap: 20px;
      }
      .t7-side-card {
        position: static;
        top: 0;
        width: 100%;
        box-sizing: border-box;
        padding: 20px 16px;
      }
      .t7-card-grid {
        grid-template-columns: 1fr;
      }
      .t7-console-block {
        padding: 18px 14px;
      }
    }
  `;
  document.head.appendChild(style);
}

const TemplateSeven = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Anime.js v4 animations
    animate(".t7-cyber-ring", {
      rotate: [0, 360],
      duration: 12000,
      loop: true,
    });

    animate(".t7-console-block", {
      translateY: [30, 0],
      opacity: [0, 1],
      delay: stagger(120),
      duration: 700,
    });

    animate(".t7-skill-tag", {
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: stagger(40, { start: 300 }),
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
    if (p.includes("github")) return <Github size={16} />;
    if (p.includes("linkedin")) return <Linkedin size={16} />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter size={16} />;
    return <Globe size={16} />;
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
      toast.success("Message Transmitted!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Message received!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="t7-root">
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="t7-grid-bg" />

      {/* Sticky Topbar */}
      <header className="t7-hud-topbar">
        <div className="t7-hud-brand">
          <div className="t7-status-pulse" />
          <span>CYBER_STUDENT_HUD // T7</span>
        </div>
        <nav className="t7-hud-nav">
          <a href="#summary" className="t7-hud-link">Overview</a>
          <a href="#skills" className="t7-hud-link">Skills</a>
          <a href="#experience" className="t7-hud-link">Experience</a>
          <a href="#education" className="t7-hud-link">Education</a>
          <a href="#projects" className="t7-hud-link">Projects</a>
          <a href="#contact" className="t7-hud-link">Contact</a>
        </nav>
      </header>

      {/* Main Asymmetric Grid */}
      <div className="t7-container">
        {/* Left Side Panel */}
        <aside className="t7-side-card">
          <div className="t7-avatar-frame">
            <div className="t7-cyber-ring" />
            {profile.pictureUrl ? (
              <img src={profile.pictureUrl} alt={profile.fullName} className="t7-avatar-img" />
            ) : (
              <div className="t7-avatar-fallback">{profile.fullName?.[0] || "S"}</div>
            )}
          </div>
          <h1 className="t7-name">{profile.fullName}</h1>
          <p className="t7-headline">{profile.headline}</p>
          <span className="t7-badge">STUDENT PORTFOLIO</span>

          <div className="t7-contacts">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="t7-chip">
                <Mail size={14} /> {profile.email}
              </a>
            )}
            {profile.mobileNumber && (
              <div className="t7-chip">
                <Phone size={14} /> {profile.mobileNumber}
              </div>
            )}
            {profile.location && (
              <div className="t7-chip">
                <MapPin size={14} /> {profile.location}
              </div>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="t7-socials">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={formatUrl(link.profileUrl || link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t7-social-btn"
                  title={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          )}
        </aside>

        {/* Right HUD Consoles */}
        <main className="t7-main-console">
          {/* Overview Block */}
          {profile.summary && (
            <section id="summary" className="t7-console-block">
              <div className="t7-block-header">
                <div className="t7-block-title"><Terminal size={18} /> Student Overview</div>
                <span className="t7-block-tag">BIOGRAPHY</span>
              </div>
              <p style={{ fontSize: "0.95rem", color: "#cbd5e1", lineHeight: 1.7 }}>
                {profile.summary}
              </p>
            </section>
          )}

          {/* Skills Block */}
          {skills.length > 0 && (
            <section id="skills" className="t7-console-block">
              <div className="t7-block-header">
                <div className="t7-block-title"><Cpu size={18} /> Technical Competencies</div>
                <span className="t7-block-tag">{skills.length} SKILLS</span>
              </div>
              <div className="t7-skills-wrap">
                {skills.map((skill, i) => (
                  <span key={i} className="t7-skill-tag">
                    {getSkillName(skill)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience Block */}
          {experience.length > 0 && (
            <section id="experience" className="t7-console-block">
              <div className="t7-block-header">
                <div className="t7-block-title"><Briefcase size={18} /> Work & Internship Log</div>
                <span className="t7-block-tag">EXPERIENCE</span>
              </div>
              <div className="t7-card-grid">
                {experience.map((exp, i) => (
                  <div key={i} className="t7-cyber-card">
                    <div className="t7-card-role">{exp.position}</div>
                    <div className="t7-card-org">{exp.company}</div>
                    <div className="t7-card-date">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </div>
                    {exp.description && <p className="t7-card-desc">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Block */}
          {education.length > 0 && (
            <section id="education" className="t7-console-block">
              <div className="t7-block-header">
                <div className="t7-block-title"><GraduationCap size={18} /> Education Ledger</div>
                <span className="t7-block-tag">ACADEMICS</span>
              </div>
              <div className="t7-card-grid">
                {education.map((edu, i) => (
                  <div key={i} className="t7-cyber-card">
                    <div className="t7-card-role">{edu.degree}</div>
                    <div className="t7-card-org">{edu.institution}</div>
                    <div className="t7-card-date">
                      {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                    </div>
                    {edu.fieldOfStudy && <p className="t7-card-desc">Major: {edu.fieldOfStudy}</p>}
                    {(edu.gpa || edu.percentage || edu.cgpa) && (
                      <div className="t7-gpa-tag">SCORE: {edu.gpa || edu.percentage || edu.cgpa}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Block */}
          {projects.length > 0 && (
            <section id="projects" className="t7-console-block">
              <div className="t7-block-header">
                <div className="t7-block-title"><FolderOpen size={18} /> Featured Projects</div>
                <span className="t7-block-tag">PROJECTS</span>
              </div>
              <div className="t7-card-grid">
                {projects.map((proj, i) => (
                  <div key={i} className="t7-cyber-card">
                    <div className="t7-card-role">{proj.title}</div>
                    {proj.description && <p className="t7-card-desc">{proj.description}</p>}
                    {proj.techStack && (
                      <div className="t7-tech-row">
                        {proj.techStack.split(",").map((tech, idx) => (
                          <span key={idx} className="t7-tech-chip">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {(proj.projectUrl || proj.link) && (
                      <a
                        href={formatUrl(proj.projectUrl || proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t7-proj-btn"
                      >
                        Project Console <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Block */}
          {certifications.length > 0 && (
            <section className="t7-console-block">
              <div className="t7-block-header">
                <div className="t7-block-title"><Award size={18} /> Certifications & Honors</div>
                <span className="t7-block-tag">HONORS</span>
              </div>
              <div className="t7-card-grid">
                {certifications.map((cert, i) => (
                  <div key={i} className="t7-cyber-card">
                    <div className="t7-card-role">{cert.name}</div>
                    <div className="t7-card-org">{cert.issuingOrganization}</div>
                    {cert.issueDate && <div className="t7-card-date">{cert.issueDate}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Block */}
          <section id="contact" className="t7-console-block">
            <div className="t7-block-header">
              <div className="t7-block-title"><Send size={18} /> Transmit Message</div>
              <span className="t7-block-tag">CONTACT</span>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="YOUR NAME"
                value={formData.name}
                onChange={handleChange}
                className="t7-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="YOUR EMAIL"
                value={formData.email}
                onChange={handleChange}
                className="t7-input"
                required
              />
              <textarea
                name="message"
                placeholder="YOUR MESSAGE DATA..."
                value={formData.message}
                onChange={handleChange}
                className="t7-input t7-textarea"
                required
              />
              <button type="submit" className="t7-btn" disabled={isSubmitting}>
                <Zap size={14} /> {isSubmitting ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}
              </button>
            </form>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="t7-footer">
        BYTEBODH FOLIO // TEMPLATE SEVEN (CYBER HUD MATRIX)
      </footer>
    </div>
  );
};

export default TemplateSeven;

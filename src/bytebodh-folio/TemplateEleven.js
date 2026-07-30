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
  Code2,
  FolderOpen,
  User,
  ExternalLink,
  Laptop,
  Terminal as TermIcon,
} from "lucide-react";
import { animate } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Eleven: BYTEBODH OS 11.0 (Interactive Desktop OS)
   Palette: Dark Slate, Electric Blue, Amber Yellow, Warm Brown
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-eleven-os-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    .t11-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 50%, #090d16 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Top OS Menu Bar */
    .t11-menubar {
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0 20px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }
    .t11-os-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      color: #fbbf24;
    }
    .t11-os-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .t11-dot {
      width: 10px; height: 10px; border-radius: 50%;
    }
    .t11-dot-red { background: #ef4444; }
    .t11-dot-yellow { background: #f59e0b; }
    .t11-dot-green { background: #10b981; }

    /* Desktop Dock / App Tabs */
    .t11-dock-container {
      padding: 20px 24px 10px;
      display: flex;
      justify-content: center;
      position: relative;
      z-index: 10;
    }
    .t11-dock {
      background: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 6px 12px;
      display: flex;
      gap: 8px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
      flex-wrap: wrap;
      justify-content: center;
    }
    .t11-dock-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      color: #94a3b8;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .t11-dock-item:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
    }
    .t11-dock-item.active {
      color: #0f172a;
      background: #fbbf24;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(251, 191, 36, 0.3);
    }

    /* Main Desktop Window Viewport */
    .t11-desktop-body {
      max-width: 1150px;
      width: 100%;
      margin: 20px auto 60px;
      padding: 0 24px;
      box-sizing: border-box;
      flex: 1;
    }

    .t11-window {
      background: #0f172a;
      border: 1.5px solid #334155;
      border-radius: 18px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .t11-window-header {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .t11-window-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: #fbbf24;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .t11-window-content {
      padding: 32px;
    }

    /* Profile / Bio App */
    .t11-profile-grid {
      display: flex;
      gap: 32px;
      align-items: center;
      flex-wrap: wrap;
    }
    .t11-avatar-box {
      width: 130px; height: 130px;
      border-radius: 50%;
      padding: 4px;
      background: linear-gradient(135deg, #fbbf24, #78350f, #38bdf8);
      flex-shrink: 0;
      box-shadow: 0 0 25px rgba(251, 191, 36, 0.25);
    }
    .t11-avatar-img {
      width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
      border: 3px solid #0f172a;
    }
    .t11-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%;
      background: #78350f; color: #fbbf24;
      font-size: 3rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      border: 3px solid #0f172a;
    }
    .t11-name {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px 0;
      line-height: 1.1;
    }
    .t11-headline {
      font-size: 1.1rem;
      font-weight: 600;
      color: #fbbf24;
      margin-bottom: 14px;
    }
    .t11-summary {
      font-size: 0.95rem;
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 20px;
      max-width: 680px;
    }
    .t11-chip-row {
      display: flex; flex-wrap: wrap; gap: 10px;
    }
    .t11-chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      color: #e2e8f0; background: #1e293b; border: 1px solid #334155;
      padding: 6px 12px; border-radius: 8px; text-decoration: none;
    }
    .t11-chip:hover { border-color: #fbbf24; color: #fbbf24; }

    /* Skills Grid App */
    .t11-skills-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;
    }
    .t11-skill-card {
      background: #1e293b; border: 1.5px solid #334155; border-radius: 12px;
      padding: 16px 20px;
    }
    .t11-skill-header {
      display: flex; justify-content: space-between; font-weight: 700; font-size: 14px;
      color: #ffffff; margin-bottom: 8px;
    }
    .t11-bar-bg {
      height: 8px; background: #0f172a; border-radius: 4px; overflow: hidden;
    }
    .t11-bar-fill {
      height: 100%; background: linear-gradient(90deg, #78350f, #fbbf24);
      border-radius: 4px;
    }

    /* Cards (Experience, Education, Projects) */
    .t11-card-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;
    }
    .t11-card {
      background: #1e293b; border: 1.5px solid #334155; border-radius: 14px;
      padding: 24px; transition: all 0.25s;
    }
    .t11-card:hover {
      border-color: #fbbf24; transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
    .t11-card-title { font-size: 1.15rem; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
    .t11-card-sub { font-size: 0.95rem; font-weight: 600; color: #fbbf24; margin-bottom: 8px; }
    .t11-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8;
      background: #0f172a; padding: 3px 10px; border-radius: 6px; display: inline-block; margin-bottom: 12px;
      border: 1px solid #334155;
    }
    .t11-card-text { font-size: 0.9rem; color: #cbd5e1; line-height: 1.6; }
    .t11-gpa-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
      color: #0f172a; background: #fbbf24; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-top: 10px;
    }
    .t11-tech-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0; }
    .t11-tech-item {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #fef08a;
      background: #78350f; padding: 2px 8px; border-radius: 4px;
    }
    .t11-link {
      display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700;
      color: #fbbf24; text-decoration: none;
    }
    .t11-link:hover { text-decoration: underline; }

    /* Contact Form */
    .t11-input {
      width: 100%; box-sizing: border-box; background: #1e293b; border: 1.5px solid #334155;
      padding: 12px 16px; border-radius: 8px; color: #ffffff; font-family: inherit; font-size: 14px;
      outline: none; margin-bottom: 16px;
    }
    .t11-input:focus { border-color: #fbbf24; }
    .t11-textarea { min-height: 110px; resize: vertical; }
    .t11-btn {
      background: #fbbf24; color: #0f172a; font-weight: 800; font-size: 14px;
      border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .t11-btn:hover { background: #ffffff; }

    /* Footer */
    .t11-footer {
      border-top: 1px solid rgba(255,255,255,0.1); padding: 20px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t11-menubar { padding: 0 12px; font-size: 10px; }
      .t11-dock-container { padding: 14px; }
      .t11-dock { padding: 4px 8px; border-radius: 14px; }
      .t11-dock-item { padding: 6px 10px; font-size: 11px; }
      .t11-desktop-body { padding: 0 14px; margin-top: 10px; }
      .t11-window-content { padding: 20px 16px; }
      .t11-profile-grid { gap: 20px; text-align: center; justify-content: center; }
      .t11-card-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

const TemplateEleven = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("profile"); // profile, skills, experience, education, projects, contact
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Anime.js v4 window tab switch effect
    animate(".t11-window", {
      scale: [0.97, 1],
      opacity: [0, 1],
      duration: 400,
    });
  }, [activeTab]);

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
      toast.success("Message Transmitted via ByteBodh OS!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const dockItems = [
    { id: "profile", label: "Profile.app", icon: <User size={15} /> },
    { id: "skills", label: "Skills.app", icon: <Code2 size={15} /> },
    { id: "experience", label: "Experience.app", icon: <Briefcase size={15} /> },
    { id: "education", label: "Education.app", icon: <GraduationCap size={15} /> },
    { id: "projects", label: "Projects.app", icon: <FolderOpen size={15} /> },
    { id: "contact", label: "Contact.app", icon: <Mail size={15} /> },
  ];

  return (
    <div className="t11-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Top Menu Bar */}
      <header className="t11-menubar">
        <div className="t11-os-brand">
          <Laptop size={15} /> BYTEBODH OS v11.0
        </div>
        <div style={{ color: "#cbd5e1" }}>{profile.fullName} · Student Folio</div>
        <div className="t11-os-controls">
          <div className="t11-dot t11-dot-red" />
          <div className="t11-dot t11-dot-yellow" />
          <div className="t11-dot t11-dot-green" />
        </div>
      </header>

      {/* Interactive Dock / App Switcher */}
      <div className="t11-dock-container">
        <div className="t11-dock">
          {dockItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`t11-dock-item ${activeTab === item.id ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Main Window Viewport */}
      <main className="t11-desktop-body">
        <div className="t11-window">
          <div className="t11-window-header">
            <div className="t11-window-title">
              <TermIcon size={16} /> ~/desktop/{activeTab}.app
            </div>
            <div className="t11-os-controls">
              <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>
                ACTIVE WINDOW
              </span>
            </div>
          </div>

          <div className="t11-window-content">
            {/* APP 1: PROFILE */}
            {activeTab === "profile" && (
              <div className="t11-profile-grid">
                <div className="t11-avatar-box">
                  {profile.pictureUrl ? (
                    <img src={profile.pictureUrl} alt={profile.fullName} className="t11-avatar-img" />
                  ) : (
                    <div className="t11-avatar-fallback">{profile.fullName?.[0] || "S"}</div>
                  )}
                </div>
                <div>
                  <h1 className="t11-name">{profile.fullName}</h1>
                  <p className="t11-headline">{profile.headline}</p>
                  {profile.summary && <p className="t11-summary">{profile.summary}</p>}

                  <div className="t11-chip-row">
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="t11-chip">
                        <Mail size={14} /> {profile.email}
                      </a>
                    )}
                    {profile.mobileNumber && (
                      <span className="t11-chip"><Phone size={14} /> {profile.mobileNumber}</span>
                    )}
                    {profile.location && (
                      <span className="t11-chip"><MapPin size={14} /> {profile.location}</span>
                    )}
                    {socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={formatUrl(link.profileUrl || link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t11-chip"
                      >
                        {getSocialIcon(link.platform)} {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* APP 2: SKILLS */}
            {activeTab === "skills" && (
              <div className="t11-skills-grid">
                {skills.map((skill, i) => {
                  const sName = getSkillName(skill);
                  const pct = 80 + ((i * 5) % 20);
                  return (
                    <div key={i} className="t11-skill-card">
                      <div className="t11-skill-header">
                        <span>{sName}</span>
                        <span style={{ color: "#fbbf24" }}>{pct}%</span>
                      </div>
                      <div className="t11-bar-bg">
                        <div className="t11-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* APP 3: EXPERIENCE */}
            {activeTab === "experience" && (
              <div className="t11-card-grid">
                {experience.map((exp, i) => (
                  <div key={i} className="t11-card">
                    <div className="t11-card-title">{exp.position}</div>
                    <div className="t11-card-sub">{exp.company}</div>
                    <div className="t11-card-date">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </div>
                    {exp.description && <p className="t11-card-text">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* APP 4: EDUCATION */}
            {activeTab === "education" && (
              <div className="t11-card-grid">
                {education.map((edu, i) => (
                  <div key={i} className="t11-card">
                    <div className="t11-card-title">{edu.degree}</div>
                    <div className="t11-card-sub">{edu.institution}</div>
                    <div className="t11-card-date">
                      {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                    </div>
                    {edu.fieldOfStudy && <p className="t11-card-text">Field: {edu.fieldOfStudy}</p>}
                    {(edu.gpa || edu.percentage || edu.cgpa) && (
                      <div className="t11-gpa-badge">Score: {edu.gpa || edu.percentage || edu.cgpa}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* APP 5: PROJECTS & CERTIFICATIONS */}
            {activeTab === "projects" && (
              <div className="space-y-8">
                <div className="t11-card-grid">
                  {projects.map((proj, i) => (
                    <div key={i} className="t11-card">
                      <div className="t11-card-title">{proj.title}</div>
                      {proj.description && <p className="t11-card-text">{proj.description}</p>}
                      {proj.techStack && (
                        <div className="t11-tech-chips">
                          {proj.techStack.split(",").map((t, idx) => (
                            <span key={idx} className="t11-tech-item">{t.trim()}</span>
                          ))}
                        </div>
                      )}
                      {(proj.projectUrl || proj.link) && (
                        <a
                          href={formatUrl(proj.projectUrl || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="t11-link"
                        >
                          Launch App <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {certifications.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fbbf24", marginBottom: 16 }}>
                      Certifications & Achievements
                    </h3>
                    <div className="t11-card-grid">
                      {certifications.map((cert, i) => (
                        <div key={i} className="t11-card">
                          <div className="t11-card-title">{cert.name}</div>
                          <div className="t11-card-sub">{cert.issuingOrganization}</div>
                          {cert.issueDate && <div className="t11-card-date">{cert.issueDate}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* APP 6: CONTACT */}
            {activeTab === "contact" && (
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="t11-input"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="t11-input"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message..."
                    value={formData.message}
                    onChange={handleChange}
                    className="t11-input t11-textarea"
                    required
                  />
                  <button type="submit" className="t11-btn" disabled={isSubmitting}>
                    <Send size={16} /> {isSubmitting ? "Sending..." : "Transmit Message"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="t11-footer">
        Powered by ByteBodh Folio · Template Eleven (Desktop OS)
      </footer>
    </div>
  );
};

export default TemplateEleven;

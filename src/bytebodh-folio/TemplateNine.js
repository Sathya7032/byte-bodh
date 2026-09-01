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
  ExternalLink,
} from "lucide-react";
import { animate, stagger } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Nine Scoped CSS
   Palette: Black & White, Yellow, Brown, Dark Slate Grey
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-nine-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=JetBrains+Mono:wght@700&display=swap');

    .t9-root {
      font-family: 'Space Grotesk', sans-serif;
      background-color: #ffffff; /* White base */
      color: #000000; /* Pure Black typography */
      min-height: 100vh;
    }

    /* Top Ticker Marquee */
    .t9-ticker {
      background: #ffd700; /* Vibrant Yellow */
      color: #000000;
      border-bottom: 3px solid #000000;
      overflow: hidden;
      white-space: nowrap;
      padding: 8px 0;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 13px;
    }
    .t9-ticker-inner {
      display: inline-block;
    }

    /* Topbar */
    .t9-topbar {
      background: #ffffff;
      border-bottom: 3px solid #000000;
      padding: 14px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .t9-brand {
      font-size: 1.3rem;
      font-weight: 800;
      color: #000000;
      text-decoration: none;
      background: #ffd700;
      border: 3px solid #000000;
      padding: 4px 12px;
      box-shadow: 3px 3px 0px #000000;
    }
    .t9-nav {
      display: flex;
      gap: 16px;
    }
    .t9-nav-link {
      font-size: 13px;
      font-weight: 700;
      color: #000000;
      text-decoration: none;
      padding: 4px 8px;
      border: 2px solid transparent;
      transition: all 0.15s;
    }
    .t9-nav-link:hover {
      background: #1e293b; /* Dark Slate */
      color: #ffd700; /* Yellow */
      border-color: #000000;
    }

    /* Hero Section */
    .t9-hero {
      padding: 50px 24px;
      background: #f8fafc;
      border-bottom: 3px solid #000000;
    }
    .t9-hero-container {
      max-width: 1050px;
      margin: 0 auto;
      display: flex;
      gap: 40px;
      align-items: center;
      flex-wrap: wrap;
    }
    .t9-avatar-box {
      width: 150px; height: 150px;
      background: #ffd700;
      border: 4px solid #000000;
      box-shadow: 6px 6px 0px #000000;
      flex-shrink: 0;
      overflow: hidden;
    }
    .t9-avatar-img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .t9-avatar-fallback {
      width: 100%; height: 100%;
      background: #78350f; /* Warm Brown */
      color: #ffd700;
      font-size: 4rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }
    .t9-hero-content {
      flex: 1; min-width: 280px;
    }
    .t9-student-tag {
      display: inline-block;
      background: #78350f; /* Warm Brown */
      color: #ffffff;
      border: 2px solid #000000;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 3px 3px 0px #000000;
      margin-bottom: 12px;
    }
    .t9-title {
      font-size: clamp(2.4rem, 5vw, 3.8rem);
      font-weight: 800;
      color: #000000;
      line-height: 1;
      margin: 0 0 10px 0;
    }
    .t9-title-hl {
      background: #ffd700;
      padding: 0 8px;
      border: 2px solid #000000;
    }
    .t9-headline {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1e293b; /* Dark Slate */
      margin-bottom: 14px;
    }
    .t9-bio {
      font-size: 0.95rem;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 20px;
      max-width: 650px;
      font-weight: 500;
    }
    .t9-contact-row {
      display: flex; flex-wrap: wrap; gap: 10px;
    }
    .t9-chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 700;
      color: #000000; background: #ffffff;
      border: 2px solid #000000;
      padding: 6px 12px;
      box-shadow: 3px 3px 0px #000000;
      text-decoration: none;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .t9-chip:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px #000000;
      background: #ffd700;
    }

    /* Main Area */
    .t9-main {
      max-width: 1050px;
      margin: 0 auto;
      padding: 50px 24px 80px;
    }
    .t9-section {
      margin-bottom: 50px;
    }
    .t9-section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .t9-section-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #000000;
      background: #ffd700;
      border: 3px solid #000000;
      padding: 6px 16px;
      box-shadow: 4px 4px 0px #000000;
      margin: 0;
    }

    /* Skills Grid */
    .t9-skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .t9-skill-badge {
      background: #1e293b; /* Dark Slate */
      color: #ffffff;
      border: 2px solid #000000;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      box-shadow: 3px 3px 0px #000000;
      transition: all 0.15s;
    }
    .t9-skill-badge:hover {
      background: #ffd700;
      color: #000000;
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px #000000;
    }

    /* Brutalist Cards */
    .t9-grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 24px;
    }
    .t9-brutal-box {
      background: #ffffff;
      border: 3px solid #000000;
      padding: 24px;
      box-shadow: 5px 5px 0px #000000;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .t9-brutal-box:hover {
      transform: translate(-3px, -3px);
      box-shadow: 8px 8px 0px #000000;
    }
    .t9-card-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #000000;
      margin-bottom: 4px;
    }
    .t9-card-sub {
      font-size: 0.95rem;
      font-weight: 700;
      color: #78350f; /* Warm Brown */
      margin-bottom: 10px;
    }
    .t9-card-date {
      display: inline-block;
      background: #1e293b;
      color: #ffd700;
      border: 2px solid #000000;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      margin-bottom: 12px;
    }
    .t9-card-text {
      font-size: 0.9rem;
      color: #1e293b;
      line-height: 1.6;
      font-weight: 500;
    }

    /* Score Badge */
    .t9-score-badge {
      display: inline-block;
      background: #ffd700;
      color: #000000;
      border: 2px solid #000000;
      font-size: 12px;
      font-weight: 800;
      padding: 4px 10px;
      margin-top: 10px;
      box-shadow: 2px 2px 0px #000000;
    }

    /* Tech Stack */
    .t9-tech-wrap {
      display: flex; flex-wrap: wrap; gap: 6px; margin: 12px 0;
    }
    .t9-tech-tag {
      background: #f1f5f9;
      border: 1.5px solid #000000;
      font-size: 11px; font-weight: 700;
      padding: 2px 8px; color: #000000;
    }
    .t9-link-btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 800;
      color: #000000; background: #ffd700;
      border: 2px solid #000000;
      padding: 6px 12px;
      text-decoration: none;
      box-shadow: 3px 3px 0px #000000;
      transition: transform 0.15s;
    }
    .t9-link-btn:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px #000000;
    }

    /* Contact Form */
    .t9-form-box {
      background: #1e293b; /* Dark Slate background */
      border: 3px solid #000000;
      padding: 30px;
      box-shadow: 6px 6px 0px #000000;
    }
    .t9-input {
      width: 100%;
      box-sizing: border-box;
      background: #ffffff;
      border: 3px solid #000000;
      padding: 12px 16px;
      font-size: 14px;
      font-family: inherit;
      font-weight: 700;
      color: #000000;
      outline: none;
      margin-bottom: 16px;
    }
    .t9-input:focus {
      background: #fffbeb;
    }
    .t9-textarea {
      min-height: 110px;
      resize: vertical;
    }
    .t9-submit-btn {
      background: #ffd700;
      color: #000000;
      font-size: 15px;
      font-weight: 800;
      border: 3px solid #000000;
      padding: 12px 24px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 4px 4px 0px #000000;
      transition: transform 0.15s;
    }
    .t9-submit-btn:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px #000000;
    }

    /* Footer */
    .t9-footer {
      background: #000000;
      color: #ffffff;
      border-top: 3px solid #000000;
      text-align: center;
      padding: 24px;
      font-weight: 700;
      font-size: 13px;
    }
    .t9-footer-accent {
      color: #ffd700;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t9-topbar {
        padding: 10px 16px;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        position: relative;
      }
      .t9-nav {
        flex-wrap: wrap;
        gap: 8px;
      }
      .t9-hero {
        padding: 30px 16px;
      }
      .t9-hero-container {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
      }
      .t9-avatar-box {
        width: 110px;
        height: 110px;
      }
      .t9-main {
        padding: 30px 16px 60px;
      }
      .t9-grid-2 {
        grid-template-columns: 1fr;
      }
      .t9-form-box {
        padding: 20px 16px;
      }
    }
  `;
  document.head.appendChild(style);
}

const TemplateNine = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Ticker continuous marquee animation with Anime.js
    animate(".t9-ticker-inner", {
      translateX: ["0%", "-50%"],
      duration: 16000,
      loop: true,
    });

    // Stagger pop for cards
    animate(".t9-brutal-box", {
      scale: [0.85, 1],
      opacity: [0, 1],
      delay: stagger(80),
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
        id: profile?.user?.id,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      toast.success("Message Sent Successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for getting in touch!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="t9-root">
      <ToastContainer position="bottom-right" />

      {/* Top Ticker Bar */}
      <div className="t9-ticker">
        <div className="t9-ticker-inner">
          ✦ STUDENT PORTFOLIO ✦ BYTEBODH FOLIO ✦ {profile.fullName?.toUpperCase()} ✦ READY FOR INTERNSHIPS & ROLES ✦ SKILLS & PROJECTS SHOWCASE ✦ STUDENT PORTFOLIO ✦ BYTEBODH FOLIO ✦ {profile.fullName?.toUpperCase()} ✦
        </div>
      </div>

      {/* Topbar */}
      <header className="t9-topbar">
        <a href="#hero" className="t9-brand">
          T9 // {profile.fullName || "Folio"}
        </a>
        <nav className="t9-nav">
          <a href="#skills" className="t9-nav-link">Skills</a>
          <a href="#experience" className="t9-nav-link">Experience</a>
          <a href="#education" className="t9-nav-link">Education</a>
          <a href="#projects" className="t9-nav-link">Projects</a>
          <a href="#contact" className="t9-nav-link">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="t9-hero">
        <div className="t9-hero-container">
          <div className="t9-avatar-box">
            {profile.pictureUrl ? (
              <img src={profile.pictureUrl} alt={profile.fullName} className="t9-avatar-img" />
            ) : (
              <div className="t9-avatar-fallback">{profile.fullName?.[0] || "S"}</div>
            )}
          </div>
          <div className="t9-hero-content">
            <span className="t9-student-tag">STUDENT FOLIO</span>
            <h1 className="t9-title">
              <span className="t9-title-hl">{profile.fullName}</span>
            </h1>
            <p className="t9-headline">{profile.headline}</p>
            {profile.summary && <p className="t9-bio">{profile.summary}</p>}

            <div className="t9-contact-row">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="t9-chip">
                  <Mail size={14} /> {profile.email}
                </a>
              )}
              {profile.mobileNumber && (
                <span className="t9-chip">
                  <Phone size={14} /> {profile.mobileNumber}
                </span>
              )}
              {profile.location && (
                <span className="t9-chip">
                  <MapPin size={14} /> {profile.location}
                </span>
              )}
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={formatUrl(link.profileUrl || link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t9-chip"
                >
                  {getSocialIcon(link.platform)} {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="t9-main">
        {/* Skills */}
        {skills.length > 0 && (
          <section id="skills" className="t9-section">
            <div className="t9-section-header">
              <h2 className="t9-section-title">SKILLS & TECH</h2>
            </div>
            <div className="t9-skills-grid">
              {skills.map((skill, i) => (
                <span key={i} className="t9-skill-badge">
                  {getSkillName(skill)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section id="experience" className="t9-section">
            <div className="t9-section-header">
              <h2 className="t9-section-title">EXPERIENCE</h2>
            </div>
            <div className="t9-grid-2">
              {experience.map((exp, i) => (
                <div key={i} className="t9-brutal-box">
                  <div className="t9-card-title">{exp.position}</div>
                  <div className="t9-card-sub">{exp.company}</div>
                  <div className="t9-card-date">
                    {exp.startDate} — {exp.endDate || "Present"}
                  </div>
                  {exp.description && <p className="t9-card-text">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section id="education" className="t9-section">
            <div className="t9-section-header">
              <h2 className="t9-section-title">EDUCATION</h2>
            </div>
            <div className="t9-grid-2">
              {education.map((edu, i) => (
                <div key={i} className="t9-brutal-box">
                  <div className="t9-card-title">{edu.degree}</div>
                  <div className="t9-card-sub">{edu.institution}</div>
                  <div className="t9-card-date">
                    {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                  </div>
                  {edu.fieldOfStudy && <p className="t9-card-text">Field: {edu.fieldOfStudy}</p>}
                  {(edu.gpa || edu.percentage || edu.cgpa) && (
                    <div className="t9-score-badge">SCORE: {edu.gpa || edu.percentage || edu.cgpa}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section id="projects" className="t9-section">
            <div className="t9-section-header">
              <h2 className="t9-section-title">PROJECTS</h2>
            </div>
            <div className="t9-grid-2">
              {projects.map((proj, i) => (
                <div key={i} className="t9-brutal-box">
                  <div className="t9-card-title">{proj.title}</div>
                  {proj.description && <p className="t9-card-text">{proj.description}</p>}
                  {proj.techStack && (
                    <div className="t9-tech-wrap">
                      {proj.techStack.split(",").map((tech, idx) => (
                        <span key={idx} className="t9-tech-tag">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  {(proj.projectUrl || proj.link) && (
                    <a
                      href={formatUrl(proj.projectUrl || proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t9-link-btn"
                    >
                      VIEW PROJECT <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="t9-section">
            <div className="t9-section-header">
              <h2 className="t9-section-title">CERTIFICATIONS</h2>
            </div>
            <div className="t9-grid-2">
              {certifications.map((cert, i) => (
                <div key={i} className="t9-brutal-box">
                  <div className="t9-card-title">{cert.name}</div>
                  <div className="t9-card-sub">{cert.issuingOrganization}</div>
                  {cert.issueDate && <div className="t9-card-date">{cert.issueDate}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="contact" className="t9-section">
          <div className="t9-section-header">
            <h2 className="t9-section-title">CONTACT ME</h2>
          </div>
          <div className="t9-form-box">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="YOUR NAME"
                value={formData.name}
                onChange={handleChange}
                className="t9-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="YOUR EMAIL"
                value={formData.email}
                onChange={handleChange}
                className="t9-input"
                required
              />
              <textarea
                name="message"
                placeholder="YOUR MESSAGE..."
                value={formData.message}
                onChange={handleChange}
                className="t9-input t9-textarea"
                required
              />
              <button type="submit" className="t9-submit-btn" disabled={isSubmitting}>
                <Send size={16} /> {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="t9-footer">
        CRAFTED WITH <span className="t9-footer-accent">BYTEBODH FOLIO</span> · TEMPLATE NINE (NEO-BRUTALIST TECH)
      </footer>
    </div>
  );
};

export default TemplateNine;

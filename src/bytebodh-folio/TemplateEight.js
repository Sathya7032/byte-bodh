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
  Newspaper,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { animate, stagger } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Eight: The Student Chronicle (Gazette Magazine Layout)
   Palette: Black & White, Yellow, Brown, Dark Slate Grey
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-eight-gazette-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;0,900;1,600&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@500;600;700&display=swap');

    .t8-root {
      font-family: 'Source Serif 4', Georgia, serif;
      background-color: #fcfaf7; /* Off-white newspaper parchment */
      color: #0a0a0a; /* Pitch black ink text */
      min-height: 100vh;
      padding-bottom: 60px;
    }

    /* Newspaper Banner Header */
    .t8-masthead {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px 24px 10px;
      text-align: center;
    }
    .t8-issue-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #78350f;
      border-bottom: 1px solid #78350f;
      padding: 6px 12px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #78350f;
      margin-bottom: 16px;
    }
    .t8-main-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.8rem, 6vw, 4.5rem);
      font-weight: 900;
      color: #0a0a0a;
      letter-spacing: -0.02em;
      line-height: 1;
      text-transform: uppercase;
      margin: 0 0 10px 0;
    }
    .t8-sub-bar {
      border-top: 4px double #78350f; /* Double newspaper rule */
      border-bottom: 2px solid #0a0a0a;
      padding: 8px 0;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .t8-sub-item {
      display: inline-flex; align-items: center; gap: 6px;
    }

    /* 3-Column Newspaper Grid Layout */
    .t8-newspaper-grid {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 280px 1fr 340px;
      gap: 30px;
    }
    @media (max-width: 1024px) {
      .t8-newspaper-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Column Dividers */
    .t8-column {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .t8-col-border {
      border-right: 1px solid #d6d3d1;
      padding-right: 28px;
    }
    @media (max-width: 1024px) {
      .t8-col-border {
        border-right: none;
        padding-right: 0;
        border-bottom: 2px solid #78350f;
        padding-bottom: 28px;
      }
    }

    /* Left Column Elements */
    .t8-portrait-frame {
      border: 3px solid #78350f;
      outline: 2px solid #0a0a0a;
      outline-offset: 4px;
      background: #ffffff;
      padding: 8px;
      margin-bottom: 16px;
      text-align: center;
    }
    .t8-portrait-img {
      width: 100%; height: 220px; object-fit: cover; filter: grayscale(20%);
    }
    .t8-portrait-fallback {
      width: 100%; height: 220px; background: #78350f; color: #fef08a;
      font-family: 'Playfair Display', serif; font-size: 4rem; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
    }
    .t8-caption {
      font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 600; color: #475569;
      margin-top: 6px; font-style: italic;
    }
    .t8-news-box {
      background: #ffffff;
      border: 1px solid #e7e5e4;
      border-top: 3px solid #78350f;
      padding: 18px;
    }
    .t8-box-header {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem; font-weight: 800; color: #0a0a0a;
      border-bottom: 1px solid #78350f; padding-bottom: 6px; margin-bottom: 12px;
    }
    .t8-contact-list {
      display: flex; flex-direction: column; gap: 8px; font-family: 'Inter', sans-serif; font-size: 12px;
    }
    .t8-contact-item {
      display: flex; align-items: center; gap: 8px; color: #1e293b; text-decoration: none; word-break: break-all;
    }
    .t8-contact-item:hover { color: #78350f; text-decoration: underline; }

    /* Skills Pill List */
    .t8-skills-grid {
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    .t8-skill-pill {
      font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 700; color: #0a0a0a;
      background: #fef08a; /* Yellow highlighter */
      border: 1px solid #eab308;
      padding: 4px 10px; border-radius: 2px;
    }

    /* Center Lead Article */
    .t8-headline-article {
      background: #ffffff;
      border: 1px solid #e7e5e4;
      padding: 24px;
    }
    .t8-article-kicker {
      font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 800; color: #78350f;
      text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px;
    }
    .t8-article-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      font-weight: 900; color: #0a0a0a;
      line-height: 1.1; margin-bottom: 10px;
    }
    .t8-article-sub {
      font-family: 'Inter', sans-serif;
      font-size: 1rem; font-weight: 600; color: #475569;
      margin-bottom: 16px; font-style: italic;
    }
    .t8-dropcap-text {
      font-size: 0.95rem; color: #1c1917; line-height: 1.7;
    }
    .t8-dropcap-text::first-letter {
      font-family: 'Playfair Display', serif;
      font-size: 3.4rem; font-weight: 900; color: #78350f;
      float: left; line-height: 0.8; padding-right: 8px; padding-top: 4px;
    }

    /* Experience Story Cards */
    .t8-story-card {
      border-top: 2px solid #78350f;
      padding-top: 16px; margin-top: 20px;
    }
    .t8-story-role {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem; font-weight: 800; color: #0a0a0a;
    }
    .t8-story-company {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem; font-weight: 700; color: #78350f; margin-bottom: 4px;
    }
    .t8-story-date {
      font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 700; color: #1e293b;
      background: #fef08a; border: 1px solid #eab308;
      padding: 2px 6px; display: inline-block; margin-bottom: 8px;
    }
    .t8-story-text {
      font-size: 0.9rem; color: #334155; line-height: 1.6;
    }

    /* Right Column Cards */
    .t8-right-card {
      background: #ffffff;
      border: 1px solid #e7e5e4;
      border-left: 4px solid #78350f;
      padding: 18px; margin-bottom: 16px;
    }
    .t8-right-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem; font-weight: 800; color: #0a0a0a; margin-bottom: 4px;
    }
    .t8-right-sub {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem; font-weight: 700; color: #78350f; margin-bottom: 6px;
    }
    .t8-right-date {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 700; color: #475569; margin-bottom: 8px;
    }
    .t8-gpa-badge {
      font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 800; color: #ffffff;
      background: #78350f; padding: 2px 8px; display: inline-block; margin-top: 6px;
    }
    .t8-tech-tags {
      display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0;
    }
    .t8-tech-item {
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 700; color: #0a0a0a;
      background: #fef08a; border: 1px solid #eab308; padding: 1px 6px;
    }
    .t8-link {
      font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 800; color: #78350f; text-decoration: none;
      display: inline-flex; align-items: center; gap: 3px;
    }
    .t8-link:hover { text-decoration: underline; }

    /* Contact Form */
    .t8-form-container {
      background: #ffffff; border: 2px solid #78350f; padding: 24px; margin-top: 40px; max-width: 1200px; margin-left: auto; margin-right: auto;
    }
    .t8-input {
      width: 100%; box-sizing: border-box; background: #fcfaf7;
      border: 1.5px solid #d6d3d1; padding: 12px 14px;
      font-family: 'Inter', sans-serif; font-size: 13px; color: #0a0a0a;
      outline: none; margin-bottom: 12px;
    }
    .t8-input:focus { border-color: #78350f; background: #ffffff; }
    .t8-textarea { min-height: 100px; resize: vertical; }
    .t8-btn {
      background: #78350f; color: #ffffff;
      font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 800;
      border: none; padding: 12px 24px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .t8-btn:hover { background: #0a0a0a; }

    /* Footer */
    .t8-footer {
      border-top: 2px solid #78350f; text-align: center;
      padding: 20px; font-family: 'Inter', sans-serif; font-size: 12px; color: #475569;
      margin-top: 50px;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t8-masthead {
        padding: 16px 12px 6px;
      }
      .t8-issue-bar {
        flex-direction: column;
        gap: 4px;
        text-align: center;
      }
      .t8-sub-bar {
        flex-direction: column;
        gap: 6px;
        font-size: 10px;
        padding: 6px 0;
      }
      .t8-newspaper-grid {
        grid-template-columns: 1fr;
        padding: 0 14px;
        gap: 20px;
      }
      .t8-headline-article {
        padding: 16px;
      }
      .t8-form-container {
        padding: 18px 14px;
        margin-top: 24px;
        margin-left: 14px;
        margin-right: 14px;
      }
    }
  `;
  document.head.appendChild(style);
}

const TemplateEight = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Anime.js v4 animations
    animate(".t8-column", {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: stagger(120),
      duration: 800,
    });

    animate(".t8-story-card", {
      opacity: [0, 1],
      translateX: [-15, 0],
      delay: stagger(90, { start: 200 }),
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
      toast.success("Dispatch Sent Successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for writing!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="t8-root">
      <ToastContainer position="bottom-right" />

      {/* Newspaper Masthead */}
      <header className="t8-masthead">
        <div className="t8-issue-bar">
          <span>VOL. I ... NO. 1</span>
          <span>SPECIAL STUDENT EDITION</span>
          <span>PRICE: $0.00 / FREE</span>
        </div>
        <h1 className="t8-main-title">The Student Chronicle</h1>
        <div className="t8-sub-bar">
          <span className="t8-sub-item"><Newspaper size={14} /> ACADEMIC & CAREER GAZETTE</span>
          <span>•</span>
          <span className="t8-sub-item"><BookOpen size={14} /> FEATURING: {profile.fullName?.toUpperCase()}</span>
        </div>
      </header>

      {/* 3-Column Newspaper Grid Layout */}
      <div className="t8-newspaper-grid">
        {/* Column 1: Portrait & Quick Details */}
        <div className="t8-column t8-col-border">
          <div className="t8-portrait-frame">
            {profile.pictureUrl ? (
              <img src={profile.pictureUrl} alt={profile.fullName} className="t8-portrait-img" />
            ) : (
              <div className="t8-portrait-fallback">{profile.fullName?.[0] || "S"}</div>
            )}
            <div className="t8-caption">Figure 1.1: {profile.fullName}</div>
          </div>

          <div className="t8-news-box">
            <div className="t8-box-header">Editorial Contact</div>
            <div className="t8-contact-list">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="t8-contact-item">
                  <Mail size={14} /> {profile.email}
                </a>
              )}
              {profile.mobileNumber && (
                <div className="t8-contact-item">
                  <Phone size={14} /> {profile.mobileNumber}
                </div>
              )}
              {profile.location && (
                <div className="t8-contact-item">
                  <MapPin size={14} /> {profile.location}
                </div>
              )}
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="t8-news-box">
              <div className="t8-box-header">Social Media Links</div>
              <div className="t8-contact-list">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={formatUrl(link.profileUrl || link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t8-contact-item"
                  >
                    {getSocialIcon(link.platform)} {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="t8-news-box">
              <div className="t8-box-header">Core Competencies</div>
              <div className="t8-skills-grid">
                {skills.map((skill, i) => (
                  <span key={i} className="t8-skill-pill">
                    {getSkillName(skill)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Center Lead Story & Experience */}
        <div className="t8-column t8-col-border">
          <article className="t8-headline-article">
            <div className="t8-article-kicker">FRONT PAGE LEAD STORY</div>
            <h2 className="t8-article-title">{profile.fullName}</h2>
            <div className="t8-article-sub">{profile.headline}</div>

            {profile.summary && (
              <p className="t8-dropcap-text">
                {profile.summary}
              </p>
            )}
          </article>

          {experience.length > 0 && (
            <div className="t8-headline-article">
              <div className="t8-article-kicker">EXPERIENCE & INTERNSHIPS</div>
              {experience.map((exp, i) => (
                <div key={i} className="t8-story-card">
                  <div className="t8-story-role">{exp.position}</div>
                  <div className="t8-story-company">{exp.company}</div>
                  <div className="t8-story-date">
                    {exp.startDate} — {exp.endDate || "Present"}
                  </div>
                  {exp.description && <p className="t8-story-text">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Education & Projects Digest */}
        <div className="t8-column">
          {education.length > 0 && (
            <div>
              <div className="t8-box-header">Academic Digest</div>
              {education.map((edu, i) => (
                <div key={i} className="t8-right-card">
                  <div className="t8-right-title">{edu.degree}</div>
                  <div className="t8-right-sub">{edu.institution}</div>
                  <div className="t8-right-date">
                    {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                  </div>
                  {edu.fieldOfStudy && <p style={{ fontSize: "12px" }}>Major: {edu.fieldOfStudy}</p>}
                  {(edu.gpa || edu.percentage || edu.cgpa) && (
                    <div className="t8-gpa-badge">SCORE: {edu.gpa || edu.percentage || edu.cgpa}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <div className="t8-box-header">Project Features</div>
              {projects.map((proj, i) => (
                <div key={i} className="t8-right-card">
                  <div className="t8-right-title">{proj.title}</div>
                  {proj.description && (
                    <p style={{ fontSize: "12px", color: "#334155", lineHeight: 1.5 }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.techStack && (
                    <div className="t8-tech-tags">
                      {proj.techStack.split(",").map((tech, idx) => (
                        <span key={idx} className="t8-tech-item">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                  {(proj.projectUrl || proj.link) && (
                    <a
                      href={formatUrl(proj.projectUrl || proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t8-link"
                    >
                      READ FULL ARTICLE <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <div className="t8-box-header">Certifications</div>
              {certifications.map((cert, i) => (
                <div key={i} className="t8-right-card">
                  <div className="t8-right-title">{cert.name}</div>
                  <div className="t8-right-sub">{cert.issuingOrganization}</div>
                  {cert.issueDate && <div className="t8-right-date">{cert.issueDate}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Section Form */}
      <div className="t8-form-container">
        <div className="t8-box-header" style={{ fontSize: "1.3rem", marginBottom: 16 }}>
          Write to the Editor / Contact Student
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="YOUR FULL NAME"
            value={formData.name}
            onChange={handleChange}
            className="t8-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="YOUR EMAIL ADDRESS"
            value={formData.email}
            onChange={handleChange}
            className="t8-input"
            required
          />
          <textarea
            name="message"
            placeholder="YOUR LETTER / MESSAGE..."
            value={formData.message}
            onChange={handleChange}
            className="t8-input t8-textarea"
            required
          />
          <button type="submit" className="t8-btn" disabled={isSubmitting}>
            <Send size={14} /> {isSubmitting ? "DISPATCHING..." : "DISPATCH LETTER"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="t8-footer">
        CRAFTED WITH BYTEBODH FOLIO // TEMPLATE EIGHT (VINTAGE GAZETTE EDITION)
      </footer>
    </div>
  );
};

export default TemplateEight;

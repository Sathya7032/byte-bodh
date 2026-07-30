import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Train,
  ExternalLink,
  Zap,
} from "lucide-react";
import { animate, stagger } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Thirteen: TRAIN BOGIE EXPRESS (Each Section is a Train Box)
   Palette: Dark Slate, Deep Emerald, Amber Gold, Midnight Steel
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-thirteen-bogie-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    .t13-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #0b1329; /* Deep Slate Night */
      color: #f8fafc;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Top Station Header */
    .t13-topbar {
      background: rgba(11, 19, 41, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 2px solid #10b981;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .t13-brand {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px; font-weight: 700;
      color: #10b981;
      display: flex; align-items: center; gap: 8px;
    }

    /* Main Train Track Layout Container */
    .t13-train-container {
      max-width: 950px;
      margin: 40px auto 80px;
      padding: 0 24px;
      position: relative;
    }

    /* Vertical Railway Track Grid behind Train Boxes */
    .t13-rail-line {
      position: absolute;
      top: 0; bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 8px;
      background: #334155;
      border-left: 2px dashed #f59e0b;
      border-right: 2px dashed #f59e0b;
      z-index: 0;
    }

    /* Train Locomotive Engine Header Box */
    .t13-engine-header {
      background: linear-gradient(135deg, #10b981, #047857);
      border: 3px solid #f59e0b;
      border-radius: 24px 24px 12px 12px;
      padding: 24px 32px;
      text-align: center;
      position: relative;
      z-index: 10;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
      margin-bottom: 30px;
    }
    .t13-engine-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.2rem; font-weight: 800; color: #0b1329;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      text-transform: uppercase; tracking: 0.1em;
    }

    /* Train Bogie / Carriage Box Frame */
    .t13-bogie-box {
      background: #111c38;
      border: 2.5px solid #334155;
      border-top: 4px solid #10b981;
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 40px;
      position: relative;
      z-index: 10;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      transition: all 0.3s;
    }
    .t13-bogie-box:hover {
      border-color: #10b981;
      box-shadow: 0 20px 45px rgba(16, 185, 129, 0.25);
    }

    /* Bogie Top Window & Roof Ridge */
    .t13-bogie-roof {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0b1329;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 8px 16px;
      margin-bottom: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
    }
    .t13-bogie-windows {
      display: flex; gap: 6px;
    }
    .t13-window-pane {
      width: 14px; height: 10px;
      background: #f59e0b; border-radius: 2px;
    }

    /* Train Coupling Joint (Connection between Bogies) */
    .t13-coupler {
      width: 20px; height: 20px;
      background: #f59e0b;
      border: 3px solid #0b1329;
      border-radius: 50%;
      margin: -25px auto 15px;
      position: relative;
      z-index: 20;
      box-shadow: 0 0 10px #f59e0b;
    }

    /* Train Carriage Wheels at Bottom of Each Box */
    .t13-bogie-wheels {
      display: flex;
      justify-content: space-around;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 2px dashed #334155;
    }
    .t13-wheel {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: #1e293b;
      border: 3px solid #f59e0b;
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
      position: relative;
      animation: t13-spin-wheel 6s linear infinite;
    }
    .t13-wheel::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #10b981;
    }
    @keyframes t13-spin-wheel {
      to { transform: rotate(360deg); }
    }

    /* Content Elements inside Bogie Boxes */
    .t13-profile-grid {
      display: flex; gap: 28px; align-items: center; flex-wrap: wrap;
    }
    .t13-avatar-box {
      width: 110px; height: 110px; border-radius: 50%;
      padding: 3px; background: linear-gradient(135deg, #10b981, #f59e0b); flex-shrink: 0;
    }
    .t13-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid #111c38; }
    .t13-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%; background: #1e293b; color: #10b981;
      font-size: 2.5rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
      border: 3px solid #111c38;
    }
    .t13-name { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; color: #ffffff; margin: 0 0 4px 0; }
    .t13-headline { font-size: 1.05rem; font-weight: 600; color: #10b981; margin-bottom: 10px; }
    .t13-summary { font-size: 0.9rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px; }

    .t13-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .t13-chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #cbd5e1;
      background: #0b1329; border: 1px solid #334155; padding: 6px 12px; border-radius: 6px;
      text-decoration: none;
    }
    .t13-chip:hover { border-color: #10b981; color: #10b981; }

    /* Skills Pill Cloud */
    .t13-skills-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .t13-skill-pill {
      font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
      color: #f8fafc; background: #0b1329; border: 1px solid #334155;
      padding: 8px 16px; border-radius: 8px; transition: all 0.2s;
    }
    .t13-skill-pill:hover { border-color: #10b981; background: #10b981; color: #0b1329; }

    /* Cards Grid Inside Bogie */
    .t13-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .t13-card {
      background: #0b1329; border: 1px solid #334155; border-radius: 12px; padding: 20px;
    }
    .t13-card-title { font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
    .t13-card-sub { font-size: 0.9rem; font-weight: 600; color: #10b981; margin-bottom: 6px; }
    .t13-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #94a3b8;
      background: #111c38; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px;
    }
    .t13-card-text { font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; }
    .t13-gpa-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #0b1329; background: #f59e0b; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;
    }
    .t13-tech-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
    .t13-tech-item {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #10b981;
      background: #111c38; padding: 2px 6px; border-radius: 4px; border: 1px solid #334155;
    }
    .t13-link {
      display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700;
      color: #10b981; text-decoration: none;
    }
    .t13-link:hover { text-decoration: underline; }

    /* Contact Form */
    .t13-input {
      width: 100%; box-sizing: border-box; background: #0b1329; border: 1.5px solid #334155;
      padding: 12px 16px; border-radius: 8px; color: #ffffff; font-family: inherit; font-size: 13px;
      outline: none; margin-bottom: 14px;
    }
    .t13-input:focus { border-color: #10b981; }
    .t13-textarea { min-height: 100px; resize: vertical; }
    .t13-btn {
      background: #10b981; color: #0b1329; font-weight: 800; font-size: 13px;
      border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .t13-btn:hover { background: #ffffff; }

    /* Footer */
    .t13-footer {
      border-top: 1px solid #1e293b; padding: 24px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; background: #0b1329;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t13-topbar { padding: 10px 14px; }
      .t13-train-container { padding: 0 14px; margin-top: 20px; }
      .t13-bogie-box { padding: 20px 16px; }
      .t13-profile-grid { flex-direction: column; text-align: center; justify-content: center; }
      .t13-grid-2 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

const TemplateThirteen = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Anime.js v4 Scroll/Stagger animation for each Train Bogie Box
    animate(".t13-bogie-box", {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(150),
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
      toast.success("Train Carriage Message Dispatched!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="t13-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Top Station Header */}
      <header className="t13-topbar">
        <div className="t13-brand">
          <Train size={18} /> BYTEBODH TRAIN EXPRESS · TEMPLATE 13
        </div>
        <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700 }}>
          EACH BOGIE BOX = 1 SECTION
        </div>
      </header>

      <main className="t13-train-container">
        {/* Railway Track Background Line */}
        <div className="t13-rail-line" />

        {/* 🚂 TRAIN LOCOMOTIVE ENGINE HEADER */}
        <div className="t13-engine-header">
          <div className="t13-engine-title">
            <Train size={28} /> LOCOMOTIVE ENGINE #13 · {profile.fullName}
          </div>
        </div>

        {/* 🚃 TRAIN BOGIE 01: PASSENGER SUITE (PROFILE & BIO) */}
        <div className="t13-coupler" />
        <section className="t13-bogie-box">
          <div className="t13-bogie-roof">
            <span>CARRIAGE 01 · PASSENGER SUITE (BIO & PROFILE)</span>
            <div className="t13-bogie-windows">
              <div className="t13-window-pane" />
              <div className="t13-window-pane" />
              <div className="t13-window-pane" />
            </div>
          </div>

          <div className="t13-profile-grid">
            <div className="t13-avatar-box">
              {profile.pictureUrl ? (
                <img src={profile.pictureUrl} alt={profile.fullName} className="t13-avatar-img" />
              ) : (
                <div className="t13-avatar-fallback">{profile.fullName?.[0] || "S"}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="t13-name">{profile.fullName}</h1>
              <p className="t13-headline">{profile.headline}</p>
              {profile.summary && <p className="t13-summary">{profile.summary}</p>}

              <div className="t13-chips">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="t13-chip">
                    <Mail size={14} /> {profile.email}
                  </a>
                )}
                {profile.mobileNumber && (
                  <span className="t13-chip"><Phone size={14} /> {profile.mobileNumber}</span>
                )}
                {profile.location && (
                  <span className="t13-chip"><MapPin size={14} /> {profile.location}</span>
                )}
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
            </div>
          </div>

          <div className="t13-bogie-wheels">
            <div className="t13-wheel" />
            <div className="t13-wheel" />
          </div>
        </section>

        {/* 🚃 TRAIN BOGIE 02: SKILL CARGO (TECHNICAL SKILLS) */}
        {skills.length > 0 && (
          <>
            <div className="t13-coupler" />
            <section className="t13-bogie-box">
              <div className="t13-bogie-roof">
                <span>CARRIAGE 02 · SKILL CARGO (TECHNICAL MATRIX)</span>
                <div className="t13-bogie-windows">
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                </div>
              </div>

              <div className="t13-skills-cloud">
                {skills.map((skill, i) => (
                  <span key={i} className="t13-skill-pill">{getSkillName(skill)}</span>
                ))}
              </div>

              <div className="t13-bogie-wheels">
                <div className="t13-wheel" />
                <div className="t13-wheel" />
              </div>
            </section>
          </>
        )}

        {/* 🚃 TRAIN BOGIE 03: WORK & INTERNSHIP EXPRESS */}
        {experience.length > 0 && (
          <>
            <div className="t13-coupler" />
            <section className="t13-bogie-box">
              <div className="t13-bogie-roof">
                <span>CARRIAGE 03 · WORK & INTERNSHIP EXPRESS</span>
                <div className="t13-bogie-windows">
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                </div>
              </div>

              <div className="t13-grid-2">
                {experience.map((exp, i) => (
                  <div key={i} className="t13-card">
                    <div className="t13-card-title">{exp.position}</div>
                    <div className="t13-card-sub">{exp.company}</div>
                    <div className="t13-card-date">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </div>
                    {exp.description && <p className="t13-card-text">{exp.description}</p>}
                  </div>
                ))}
              </div>

              <div className="t13-bogie-wheels">
                <div className="t13-wheel" />
                <div className="t13-wheel" />
              </div>
            </section>
          </>
        )}

        {/* 🚃 TRAIN BOGIE 04: ACADEMIC COACH (EDUCATION & GPA) */}
        {education.length > 0 && (
          <>
            <div className="t13-coupler" />
            <section className="t13-bogie-box">
              <div className="t13-bogie-roof">
                <span>CARRIAGE 04 · ACADEMIC COACH (EDUCATION & GPA)</span>
                <div className="t13-bogie-windows">
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                </div>
              </div>

              <div className="t13-grid-2">
                {education.map((edu, i) => (
                  <div key={i} className="t13-card">
                    <div className="t13-card-title">{edu.degree}</div>
                    <div className="t13-card-sub">{edu.institution}</div>
                    <div className="t13-card-date">
                      {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                    </div>
                    {edu.fieldOfStudy && <p className="t13-card-text">Field: {edu.fieldOfStudy}</p>}
                    {(edu.gpa || edu.percentage || edu.cgpa) && (
                      <div className="t13-gpa-badge">SCORE: {edu.gpa || edu.percentage || edu.cgpa}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="t13-bogie-wheels">
                <div className="t13-wheel" />
                <div className="t13-wheel" />
              </div>
            </section>
          </>
        )}

        {/* 🚃 TRAIN BOGIE 05: PROJECT FREIGHT (FEATURED PROJECTS) */}
        {projects.length > 0 && (
          <>
            <div className="t13-coupler" />
            <section className="t13-bogie-box">
              <div className="t13-bogie-roof">
                <span>CARRIAGE 05 · PROJECT FREIGHT (FEATURED REPOS)</span>
                <div className="t13-bogie-windows">
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                </div>
              </div>

              <div className="t13-grid-2">
                {projects.map((proj, i) => (
                  <div key={i} className="t13-card">
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
                        Project Demo <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="t13-bogie-wheels">
                <div className="t13-wheel" />
                <div className="t13-wheel" />
              </div>
            </section>
          </>
        )}

        {/* 🚃 TRAIN BOGIE 06: CERTIFICATIONS VAULT */}
        {certifications.length > 0 && (
          <>
            <div className="t13-coupler" />
            <section className="t13-bogie-box">
              <div className="t13-bogie-roof">
                <span>CARRIAGE 06 · CERTIFICATIONS VAULT</span>
                <div className="t13-bogie-windows">
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                  <div className="t13-window-pane" />
                </div>
              </div>

              <div className="t13-grid-2">
                {certifications.map((cert, i) => (
                  <div key={i} className="t13-card">
                    <div className="t13-card-title">{cert.name}</div>
                    <div className="t13-card-sub">{cert.issuingOrganization}</div>
                    {cert.issueDate && <div className="t13-card-date">{cert.issueDate}</div>}
                  </div>
                ))}
              </div>

              <div className="t13-bogie-wheels">
                <div className="t13-wheel" />
                <div className="t13-wheel" />
              </div>
            </section>
          </>
        )}

        {/* 🚃 TRAIN BOGIE 07: CABOOSE (CONTACT MESSAGE CONSOLE) */}
        <div className="t13-coupler" />
        <section className="t13-bogie-box">
          <div className="t13-bogie-roof">
            <span>CARRIAGE 07 · CABOOSE (CONTACT MESSAGE CONSOLE)</span>
            <div className="t13-bogie-windows">
              <div className="t13-window-pane" />
              <div className="t13-window-pane" />
              <div className="t13-window-pane" />
            </div>
          </div>

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
              <Zap size={14} /> {isSubmitting ? "Sending..." : "Dispatch Message"}
            </button>
          </form>

          <div className="t13-bogie-wheels">
            <div className="t13-wheel" />
            <div className="t13-wheel" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="t13-footer">
        BYTEBODH FOLIO · TEMPLATE THIRTEEN (TRAIN BOGIE CARRIAGES)
      </footer>
    </div>
  );
};

export default TemplateThirteen;

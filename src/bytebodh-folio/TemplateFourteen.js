import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Plane,
  ExternalLink,
  Zap,
} from "lucide-react";
import { animate, stagger } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Fourteen: AIRPLANE AIRCRAFT FLEET (Each Section = 1 Plane Box)
   Palette: Sky Blue, Navy Slate, Cloud White, Gold Accent
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-fourteen-plane-box-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    .t14-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #0c1a30; /* Deep Sky Navy */
      color: #f8fafc;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Top Flight Bar */
    .t14-topbar {
      background: rgba(12, 26, 48, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 2px solid #38bdf8;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .t14-brand {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px; font-weight: 700;
      color: #38bdf8;
      display: flex; align-items: center; gap: 8px;
    }

    /* Sky Flight Corridor Container */
    .t14-sky-container {
      max-width: 950px;
      margin: 40px auto 80px;
      padding: 0 24px;
      position: relative;
    }

    /* Sky Air Current Line */
    .t14-air-corridor {
      position: absolute;
      top: 0; bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.3) 0%, rgba(251, 191, 36, 0.3) 100%);
      z-index: 0;
    }

    /* Lead Flagship Jet Header */
    .t14-lead-jet {
      background: linear-gradient(135deg, #0284c7, #1e3a8a);
      border: 3px solid #38bdf8;
      border-radius: 40px 40px 16px 16px;
      padding: 24px 32px;
      text-align: center;
      position: relative;
      z-index: 10;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
      margin-bottom: 35px;
    }
    .t14-lead-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.2rem; font-weight: 800; color: #ffffff;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      text-transform: uppercase; tracking: 0.1em;
    }

    /* Aircraft Plane Box Frame */
    .t14-plane-box {
      background: #172a46;
      border: 2.5px solid #1e3a8a;
      border-top: 4px solid #38bdf8;
      border-radius: 24px;
      padding: 32px;
      margin-bottom: 45px;
      position: relative;
      z-index: 10;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      transition: all 0.3s;
    }
    .t14-plane-box:hover {
      border-color: #38bdf8;
      box-shadow: 0 20px 45px rgba(56, 189, 248, 0.25);
    }

    /* Airplane Cockpit & Cabin Roof Bar */
    .t14-plane-cockpit {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0c1a30;
      border: 1px solid #1e3a8a;
      border-radius: 12px;
      padding: 8px 18px;
      margin-bottom: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
    }
    .t14-portholes {
      display: flex; gap: 6px;
    }
    .t14-porthole {
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #fbbf24; border: 1.5px solid #38bdf8;
    }

    /* Airplane Jet Engine & Tail Assembly Base */
    .t14-plane-tail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 14px;
      border-top: 2px dashed #1e3a8a;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #94a3b8;
    }
    .t14-jet-engine {
      display: flex; align-items: center; gap: 6px; color: #fbbf24; font-weight: 700;
    }

    /* Porthole Content Elements */
    .t14-profile-grid {
      display: flex; gap: 28px; align-items: center; flex-wrap: wrap;
    }
    .t14-avatar-box {
      width: 110px; height: 110px; border-radius: 50%;
      padding: 3px; background: linear-gradient(135deg, #38bdf8, #fbbf24); flex-shrink: 0;
    }
    .t14-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid #172a46; }
    .t14-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%; background: #1e3a8a; color: #38bdf8;
      font-size: 2.5rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
      border: 3px solid #172a46;
    }
    .t14-name { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; color: #ffffff; margin: 0 0 4px 0; }
    .t14-headline { font-size: 1.05rem; font-weight: 600; color: #38bdf8; margin-bottom: 10px; }
    .t14-summary { font-size: 0.9rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px; }

    .t14-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .t14-chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #cbd5e1;
      background: #0c1a30; border: 1px solid #1e3a8a; padding: 6px 12px; border-radius: 6px;
      text-decoration: none;
    }
    .t14-chip:hover { border-color: #38bdf8; color: #38bdf8; }

    /* Skills Pill Cloud */
    .t14-skills-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .t14-skill-pill {
      font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700;
      color: #f8fafc; background: #0c1a30; border: 1px solid #1e3a8a;
      padding: 8px 16px; border-radius: 8px; transition: all 0.2s;
    }
    .t14-skill-pill:hover { border-color: #38bdf8; background: #38bdf8; color: #0c1a30; }

    /* Cards Grid Inside Aircraft Box */
    .t14-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .t14-card {
      background: #0c1a30; border: 1px solid #1e3a8a; border-radius: 12px; padding: 20px;
    }
    .t14-card-title { font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
    .t14-card-sub { font-size: 0.9rem; font-weight: 600; color: #38bdf8; margin-bottom: 6px; }
    .t14-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #94a3b8;
      background: #172a46; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px;
    }
    .t14-card-text { font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; }
    .t14-gpa-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #0c1a30; background: #fbbf24; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 8px;
    }
    .t14-tech-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
    .t14-tech-item {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #38bdf8;
      background: #172a46; padding: 2px 6px; border-radius: 4px; border: 1px solid #1e3a8a;
    }
    .t14-link {
      display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700;
      color: #38bdf8; text-decoration: none;
    }
    .t14-link:hover { text-decoration: underline; }

    /* Contact Form */
    .t14-input {
      width: 100%; box-sizing: border-box; background: #0c1a30; border: 1.5px solid #1e3a8a;
      padding: 12px 16px; border-radius: 8px; color: #ffffff; font-family: inherit; font-size: 13px;
      outline: none; margin-bottom: 14px;
    }
    .t14-input:focus { border-color: #38bdf8; }
    .t14-textarea { min-height: 100px; resize: vertical; }
    .t14-btn {
      background: #38bdf8; color: #0c1a30; font-weight: 800; font-size: 13px;
      border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .t14-btn:hover { background: #ffffff; }

    /* Footer */
    .t14-footer {
      border-top: 1px solid #1e3a8a; padding: 24px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; background: #0c1a30;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t14-topbar { padding: 10px 14px; }
      .t14-sky-container { padding: 0 14px; margin-top: 20px; }
      .t14-plane-box { padding: 20px 16px; }
      .t14-profile-grid { flex-direction: column; text-align: center; justify-content: center; }
      .t14-grid-2 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

const TemplateFourteen = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Anime.js v4 Scroll/Stagger flight animation for each Aircraft Box
    animate(".t14-plane-box", {
      opacity: [0, 1],
      translateY: [45, 0],
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
      toast.success("Flight Dispatch Message Transmitted!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="t14-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Top Flight Bar */}
      <header className="t14-topbar">
        <div className="t14-brand">
          <Plane size={18} /> BYTEBODH AIRPLANE FLEET · TEMPLATE 14
        </div>
        <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 700 }}>
          EACH AIRCRAFT BOX = 1 SECTION
        </div>
      </header>

      <main className="t14-sky-container">
        {/* Air Current Guideline */}
        <div className="t14-air-corridor" />

        {/* ✈️ FLAGSHIP JET HEADER */}
        <div className="t14-lead-jet">
          <div className="t14-lead-title">
            <Plane size={28} style={{ transform: "rotate(15deg)" }} /> FLAGSHIP JET #14 · {profile.fullName}
          </div>
        </div>

        {/* ✈️ AIRCRAFT PLANE 01: PROFILE JET (BIO & OVERVIEW) */}
        <section className="t14-plane-box">
          <div className="t14-plane-cockpit">
            <span>AIRCRAFT 01 · FLAGSHIP CABIN (BIO & OVERVIEW)</span>
            <div className="t14-portholes">
              <div className="t14-porthole" />
              <div className="t14-porthole" />
              <div className="t14-porthole" />
            </div>
          </div>

          <div className="t14-profile-grid">
            <div className="t14-avatar-box">
              {profile.pictureUrl ? (
                <img src={profile.pictureUrl} alt={profile.fullName} className="t14-avatar-img" />
              ) : (
                <div className="t14-avatar-fallback">{profile.fullName?.[0] || "S"}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="t14-name">{profile.fullName}</h1>
              <p className="t14-headline">{profile.headline}</p>
              {profile.summary && <p className="t14-summary">{profile.summary}</p>}

              <div className="t14-chips">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="t14-chip">
                    <Mail size={14} /> {profile.email}
                  </a>
                )}
                {profile.mobileNumber && (
                  <span className="t14-chip"><Phone size={14} /> {profile.mobileNumber}</span>
                )}
                {profile.location && (
                  <span className="t14-chip"><MapPin size={14} /> {profile.location}</span>
                )}
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
            </div>
          </div>

          <div className="t14-plane-tail">
            <div className="t14-jet-engine"><Zap size={14} /> TWIN TURBOJET ACTIVE</div>
            <span>ALTITUDE: 35,000 FT</span>
          </div>
        </section>

        {/* ✈️ AIRCRAFT PLANE 02: SKILL AIR CARRIER (SKILLS MATRIX) */}
        {skills.length > 0 && (
          <section className="t14-plane-box">
            <div className="t14-plane-cockpit">
              <span>AIRCRAFT 02 · SKILL AIR CARRIER (TECHNICAL MATRIX)</span>
              <div className="t14-portholes">
                <div className="t14-porthole" />
                <div className="t14-porthole" />
                <div className="t14-porthole" />
              </div>
            </div>

            <div className="t14-skills-cloud">
              {skills.map((skill, i) => (
                <span key={i} className="t14-skill-pill">{getSkillName(skill)}</span>
              ))}
            </div>

            <div className="t14-plane-tail">
              <div className="t14-jet-engine"><Zap size={14} /> TWIN TURBOJET ACTIVE</div>
              <span>ALTITUDE: 36,000 FT</span>
            </div>
          </section>
        )}

        {/* ✈️ AIRCRAFT PLANE 03: INTERNSHIP JET (WORK EXPERIENCE) */}
        {experience.length > 0 && (
          <section className="t14-plane-box">
            <div className="t14-plane-cockpit">
              <span>AIRCRAFT 03 · INTERNSHIP & WORK JET</span>
              <div className="t14-portholes">
                <div className="t14-porthole" />
                <div className="t14-porthole" />
                <div className="t14-porthole" />
              </div>
            </div>

            <div className="t14-grid-2">
              {experience.map((exp, i) => (
                <div key={i} className="t14-card">
                  <div className="t14-card-title">{exp.position}</div>
                  <div className="t14-card-sub">{exp.company}</div>
                  <div className="t14-card-date">
                    {exp.startDate} — {exp.endDate || "Present"}
                  </div>
                  {exp.description && <p className="t14-card-text">{exp.description}</p>}
                </div>
              ))}
            </div>

            <div className="t14-plane-tail">
              <div className="t14-jet-engine"><Zap size={14} /> TWIN TURBOJET ACTIVE</div>
              <span>ALTITUDE: 37,000 FT</span>
            </div>
          </section>
        )}

        {/* ✈️ AIRCRAFT PLANE 04: ACADEMIC TRANSPORT (EDUCATION & GPA) */}
        {education.length > 0 && (
          <section className="t14-plane-box">
            <div className="t14-plane-cockpit">
              <span>AIRCRAFT 04 · ACADEMIC TRANSPORT (EDUCATION & GPA)</span>
              <div className="t14-portholes">
                <div className="t14-porthole" />
                <div className="t14-porthole" />
                <div className="t14-porthole" />
              </div>
            </div>

            <div className="t14-grid-2">
              {education.map((edu, i) => (
                <div key={i} className="t14-card">
                  <div className="t14-card-title">{edu.degree}</div>
                  <div className="t14-card-sub">{edu.institution}</div>
                  <div className="t14-card-date">
                    {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                  </div>
                  {edu.fieldOfStudy && <p className="t14-card-text">Field: {edu.fieldOfStudy}</p>}
                  {(edu.gpa || edu.percentage || edu.cgpa) && (
                    <div className="t14-gpa-badge">SCORE: {edu.gpa || edu.percentage || edu.cgpa}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="t14-plane-tail">
              <div className="t14-jet-engine"><Zap size={14} /> TWIN TURBOJET ACTIVE</div>
              <span>ALTITUDE: 38,000 FT</span>
            </div>
          </section>
        )}

        {/* ✈️ AIRCRAFT PLANE 05: PROJECT SKY FREIGHT */}
        {projects.length > 0 && (
          <section className="t14-plane-box">
            <div className="t14-plane-cockpit">
              <span>AIRCRAFT 05 · PROJECT SKY FREIGHT (FEATURED REPOS)</span>
              <div className="t14-portholes">
                <div className="t14-porthole" />
                <div className="t14-porthole" />
                <div className="t14-porthole" />
              </div>
            </div>

            <div className="t14-grid-2">
              {projects.map((proj, i) => (
                <div key={i} className="t14-card">
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
                      Project Demo <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="t14-plane-tail">
              <div className="t14-jet-engine"><Zap size={14} /> TWIN TURBOJET ACTIVE</div>
              <span>ALTITUDE: 39,000 FT</span>
            </div>
          </section>
        )}

        {/* ✈️ AIRCRAFT PLANE 06: CERTIFICATIONS AIR VAULT */}
        {certifications.length > 0 && (
          <section className="t14-plane-box">
            <div className="t14-plane-cockpit">
              <span>AIRCRAFT 06 · CERTIFICATIONS AIR VAULT</span>
              <div className="t14-portholes">
                <div className="t14-porthole" />
                <div className="t14-porthole" />
                <div className="t14-porthole" />
              </div>
            </div>

            <div className="t14-grid-2">
              {certifications.map((cert, i) => (
                <div key={i} className="t14-card">
                  <div className="t14-card-title">{cert.name}</div>
                  <div className="t14-card-sub">{cert.issuingOrganization}</div>
                  {cert.issueDate && <div className="t14-card-date">{cert.issueDate}</div>}
                </div>
              ))}
            </div>

            <div className="t14-plane-tail">
              <div className="t14-jet-engine"><Zap size={14} /> TWIN TURBOJET ACTIVE</div>
              <span>ALTITUDE: 40,000 FT</span>
            </div>
          </section>
        )}

        {/* ✈️ AIRCRAFT PLANE 07: FLIGHT DISPATCH (CONTACT CONSOLE) */}
        <section className="t14-plane-box">
          <div className="t14-plane-cockpit">
            <span>AIRCRAFT 07 · FLIGHT DISPATCH (CONTACT CONSOLE)</span>
            <div className="t14-portholes">
              <div className="t14-porthole" />
              <div className="t14-porthole" />
              <div className="t14-porthole" />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              className="t14-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
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
              <Zap size={14} /> {isSubmitting ? "Sending..." : "Transmit Flight Message"}
            </button>
          </form>

          <div className="t14-plane-tail">
            <div className="t14-jet-engine"><Zap size={14} /> TWIN TURBOJET ACTIVE</div>
            <span>TOUCHDOWN READY</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="t14-footer">
        BYTEBODH FOLIO · TEMPLATE FOURTEEN (AIRPLANE AIRCRAFT FLEET)
      </footer>
    </div>
  );
};

export default TemplateFourteen;

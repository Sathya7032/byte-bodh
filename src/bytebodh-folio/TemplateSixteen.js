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
  Terminal,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Sixteen: MONOCHROME BLACK & WHITE VECTOR ART PORTFOLIO
   High-contrast Noir Vector Line Art, Stark White & Obsidian Dark Theme.
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-sixteen-bw-vector-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap');

    .t16-root {
      font-family: 'Space Grotesk', sans-serif;
      background: #09090b;
      color: #fafafa;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Subtle Monochrome Grid Overlay */
    .t16-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 0;
    }

    /* Topbar Header */
    .t16-topbar {
      background: rgba(9, 9, 11, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 2px solid #27272a;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .t16-brand {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px; font-weight: 800;
      color: #ffffff;
      display: flex; align-items: center; gap: 8px;
      letter-spacing: 0.05em; text-transform: uppercase;
    }

    .t16-nav { display: flex; gap: 6px; flex-wrap: wrap; }
    .t16-nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700;
      color: #a1a1aa;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .t16-nav-link:hover {
      color: #ffffff;
      background: #18181b;
      border-color: #3f3f46;
    }

    .t16-badge-status {
      display: inline-flex; align-items: center; gap: 6px;
      background: #18181b;
      border: 1.5px solid #fafafa;
      border-radius: 100px;
      padding: 5px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 800;
      color: #ffffff;
    }

    /* Hero Section */
    .t16-hero {
      padding: 56px 24px 40px;
      position: relative; z-index: 1;
    }
    .t16-container { max-width: 1100px; margin: 0 auto; }

    .t16-hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .t16-hero-card {
      background: #18181b;
      border: 2px solid #27272a;
      border-radius: 24px;
      padding: 36px;
      position: relative;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
    }
    .t16-hero-card::after {
      content: '';
      position: absolute; inset: -2px; border-radius: 24px;
      border: 1px solid #52525b; pointer-events: none;
    }

    .t16-profile-header {
      display: flex; gap: 20px; align-items: center; margin-bottom: 20px;
    }
    .t16-avatar-box {
      width: 80px; height: 80px; border-radius: 50%;
      padding: 3px; background: #ffffff; flex-shrink: 0;
    }
    .t16-avatar {
      width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #18181b;
    }
    .t16-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%; background: #09090b; color: #ffffff;
      font-size: 2rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace;
    }

    .t16-name {
      font-size: 2.2rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.1;
    }
    .t16-headline {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem; font-weight: 700; color: #a1a1aa; margin-top: 4px;
    }
    .t16-summary { font-size: 0.9rem; color: #d4d4d8; line-height: 1.65; margin-bottom: 20px; }

    .t16-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
    .t16-chip {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #d4d4d8;
      background: #09090b; border: 1px solid #3f3f46; padding: 6px 12px; border-radius: 8px;
      text-decoration: none; transition: all 0.2s;
    }
    .t16-chip:hover { border-color: #ffffff; color: #ffffff; background: #27272a; }

    .t16-social-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .t16-social-btn {
      width: 40px; height: 40px; border-radius: 10px;
      background: #09090b; border: 1.5px solid #3f3f46;
      color: #ffffff; display: flex; align-items: center; justify-content: center;
      text-decoration: none; transition: all 0.2s;
    }
    .t16-social-btn:hover { background: #ffffff; color: #09090b; border-color: #ffffff; transform: translateY(-2px); }

    /* Vector Artwork Container */
    .t16-vector-box {
      background: #18181b; border: 2px solid #27272a; border-radius: 24px;
      padding: 32px; text-align: center; display: flex; flex-direction: column;
      align-items: center; justify-content: center; position: relative; overflow: hidden;
    }
    .t16-vector-img {
      width: 100%; max-width: 380px; height: auto;
      filter: grayscale(100%) contrast(120%);
      transition: transform 0.3s;
    }
    .t16-vector-img:hover { transform: scale(1.03); }

    /* Stats Strip */
    .t16-stats-section { padding: 0 24px 40px; position: relative; z-index: 1; }
    .t16-stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px;
    }
    .t16-stat-card {
      background: #18181b; border: 2px solid #27272a; border-radius: 16px;
      padding: 20px; text-align: center; transition: all 0.2s;
    }
    .t16-stat-card:hover { border-color: #ffffff; transform: translateY(-3px); }
    .t16-stat-num {
      font-family: 'JetBrains Mono', monospace; font-size: 2.2rem; font-weight: 800; color: #ffffff;
    }
    .t16-stat-lbl {
      font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
      color: #a1a1aa; text-transform: uppercase; margin-top: 4px; letter-spacing: 0.1em;
    }

    /* Main Grid */
    .t16-main { max-width: 1100px; margin: 0 auto; padding: 0 24px 60px; position: relative; z-index: 1; }
    .t16-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .t16-sec-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid #27272a;
    }
    .t16-sec-title {
      font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #ffffff;
      display: flex; align-items: center; gap: 10px;
    }

    /* Monochrome Card */
    .t16-bw-card {
      background: #18181b; border: 2px solid #27272a; border-radius: 18px;
      padding: 24px; position: relative; margin-bottom: 18px; transition: all 0.25s;
    }
    .t16-bw-card:hover {
      border-color: #ffffff; box-shadow: 0 12px 30px rgba(255, 255, 255, 0.05); transform: translateY(-3px);
    }
    .t16-card-title { font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
    .t16-card-sub { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; font-weight: 700; color: #a1a1aa; margin-bottom: 6px; }
    .t16-card-date {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #71717a;
      background: #09090b; border: 1px solid #27272a; padding: 3px 8px; border-radius: 4px;
      display: inline-block; margin-bottom: 10px;
    }
    .t16-card-text { font-size: 0.85rem; color: #d4d4d8; line-height: 1.6; }

    /* Skills Pill Grid */
    .t16-skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .t16-skill-pill {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #ffffff; background: #09090b; border: 1.5px solid #3f3f46;
      padding: 6px 14px; border-radius: 8px; transition: all 0.2s;
    }
    .t16-skill-pill:hover { background: #ffffff; color: #09090b; border-color: #ffffff; }

    /* Project Cards with Vector Banners */
    .t16-proj-banner {
      width: 100%; height: 160px; object-fit: contain; background: #09090b;
      border-radius: 12px; margin-bottom: 14px; padding: 12px; box-sizing: border-box;
      filter: grayscale(100%); border: 1px solid #27272a;
    }
    .t16-tech-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #ffffff;
      background: #09090b; border: 1px solid #3f3f46; padding: 2px 7px; border-radius: 4px; margin-right: 4px;
    }
    .t16-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #ffffff; text-decoration: none; margin-top: 12px;
    }
    .t16-link:hover { text-decoration: underline; }

    /* Form */
    .t16-input {
      width: 100%; box-sizing: border-box; background: #09090b; border: 1.5px solid #3f3f46;
      padding: 12px 16px; border-radius: 8px; color: #ffffff; font-family: inherit; font-size: 12px;
      outline: none; margin-bottom: 12px;
    }
    .t16-input:focus { border-color: #ffffff; }
    .t16-textarea { min-height: 90px; resize: vertical; }
    .t16-btn {
      background: #ffffff; color: #09090b; font-family: 'JetBrains Mono', monospace;
      font-weight: 800; font-size: 12px; border: none; border-radius: 8px;
      padding: 12px 24px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;
    }
    .t16-btn:hover { background: #e4e4e7; transform: translateY(-2px); }

    /* Footer */
    .t16-footer {
      border-top: 2px solid #27272a; padding: 24px; text-align: center;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #71717a; background: #09090b;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t16-hero-grid { grid-template-columns: 1fr; }
      .t16-grid-2 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

const TemplateSixteen = ({ profile }) => {
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
    <div className="t16-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Topbar Header */}
      <header className="t16-topbar">
        <a href="#hero" className="t16-brand">
          <Code size={16} /> BYTEBODH MONOCHROME VECTOR · TEMPLATE 16
        </a>

        <nav className="t16-nav">
          <a href="#skills" className="t16-nav-link">{"// Skills"}</a>
          <a href="#projects" className="t16-nav-link">{"// Projects"}</a>
          <a href="#experience" className="t16-nav-link">{"// Experience"}</a>
          <a href="#contact" className="t16-nav-link">{"// Contact"}</a>
        </nav>

        <div className="t16-badge-status">
          <CheckCircle2 size={13} /> OPEN FOR WORK
        </div>
      </header>

      {/* HERO SECTION WITH BLACK & WHITE VECTOR ARTWORK */}
      <section id="hero" className="t16-hero">
        <div className="t16-container">
          <div className="t16-hero-grid">
            {/* Left Column: Profile Card */}
            <div className="t16-hero-card">
              <div className="t16-profile-header">
                <div className="t16-avatar-box">
                  {profile.pictureUrl ? (
                    <img src={profile.pictureUrl} alt={profile.fullName} className="t16-avatar" />
                  ) : (
                    <div className="t16-avatar-fallback">{profile.fullName?.[0] || "U"}</div>
                  )}
                </div>
                <div>
                  <h1 className="t16-name">{profile.fullName || "Developer Name"}</h1>
                  <div className="t16-headline">{profile.headline || "Full Stack Software Engineer"}</div>
                </div>
              </div>

              {profile.summary && <p className="t16-summary">{profile.summary}</p>}

              <div className="t16-chips">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="t16-chip">
                    <Mail size={12} /> {profile.email}
                  </a>
                )}
                {profile.mobileNumber && (
                  <span className="t16-chip"><Phone size={12} /> {profile.mobileNumber}</span>
                )}
                {profile.location && (
                  <span className="t16-chip"><MapPin size={12} /> {profile.location}</span>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="t16-social-row">
                  {socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={formatUrl(link.profileUrl || link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t16-social-btn"
                      title={link.platform}
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Hero Vector Artwork */}
            <div className="t16-vector-box">
              <img
                src="https://illustrations.popsy.co/white/work-from-home.svg"
                alt="Developer Vector Illustration"
                className="t16-vector-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="t16-stats-section">
        <div className="t16-container">
          <div className="t16-stats-grid">
            <div className="t16-stat-card">
              <div className="t16-stat-num">{experience.length || 3}+</div>
              <div className="t16-stat-lbl">Years Experience</div>
            </div>

            <div className="t16-stat-card">
              <div className="t16-stat-num">{projects.length || 8}+</div>
              <div className="t16-stat-lbl">Projects Built</div>
            </div>

            <div className="t16-stat-card">
              <div className="t16-stat-num">{skills.length || 12}+</div>
              <div className="t16-stat-lbl">Skills Mastered</div>
            </div>

            <div className="t16-stat-card">
              <div className="t16-stat-num">{certifications.length || 4}+</div>
              <div className="t16-stat-lbl">Certifications</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="t16-main">
        {/* SKILLS */}
        {skills.length > 0 && (
          <section id="skills" style={{ marginBottom: "44px" }}>
            <div className="t16-sec-header">
              <h2 className="t16-sec-title"><Layers size={18} /> {"// TECHNICAL SKILLS & TOOLS"}</h2>
            </div>

            <div className="t16-bw-card">
              <div className="t16-skills-grid">
                {skills.map((skill, i) => (
                  <span key={i} className="t16-skill-pill">{getSkillName(skill)}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED PROJECTS */}
        {projects.length > 0 && (
          <section id="projects" style={{ marginBottom: "44px" }}>
            <div className="t16-sec-header">
              <h2 className="t16-sec-title"><Terminal size={18} /> {"// FEATURED PROJECTS"}</h2>
            </div>

            <div className="t16-grid-2">
              {projects.map((proj, i) => {
                const vectorList = [
                  "https://illustrations.popsy.co/white/launching.svg",
                  "https://illustrations.popsy.co/white/web-design.svg",
                  "https://illustrations.popsy.co/white/code.svg",
                  "https://illustrations.popsy.co/white/product-launch.svg"
                ];
                const vectorUrl = vectorList[i % vectorList.length];

                return (
                  <div key={i} className="t16-bw-card">
                    <img src={vectorUrl} alt={proj.title} className="t16-proj-banner" />
                    <h3 className="t16-card-title">{proj.title}</h3>
                    {proj.description && <p className="t16-card-text">{proj.description}</p>}
                    {proj.techStack && (
                      <div style={{ marginTop: "10px" }}>
                        {proj.techStack.split(",").map((tech, idx) => (
                          <span key={idx} className="t16-tech-badge">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {(proj.projectUrl || proj.link) && (
                      <a
                        href={formatUrl(proj.projectUrl || proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t16-link"
                      >
                        VIEW REPOSITORY <ArrowUpRight size={13} />
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
            <div className="t16-sec-header">
              <h2 className="t16-sec-title"><Briefcase size={18} /> {"// EXPERIENCE LOG"}</h2>
            </div>

            <div className="t16-grid-2">
              {experience.map((exp, i) => (
                <div key={i} className="t16-bw-card">
                  <h3 className="t16-card-title">{exp.position}</h3>
                  <div className="t16-card-sub">{exp.company}</div>
                  <div className="t16-card-date">{exp.startDate} — {exp.endDate || "Present"}</div>
                  {exp.description && <p className="t16-card-text">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION & CERTIFICATIONS */}
        {(education.length > 0 || certifications.length > 0) && (
          <section style={{ marginBottom: "44px" }}>
            <div className="t16-sec-header">
              <h2 className="t16-sec-title"><GraduationCap size={18} /> {"// ACADEMICS & CERTIFICATIONS"}</h2>
            </div>

            <div className="t16-grid-2">
              {education.map((edu, i) => (
                <div key={i} className="t16-bw-card">
                  <h3 className="t16-card-title">{edu.degree}</h3>
                  <div className="t16-card-sub">{edu.institution}</div>
                  <div className="t16-card-date">{edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}</div>
                  {(edu.gpa || edu.cgpa) && <div className="t16-card-text" style={{ fontWeight: 700 }}>SCORE: {edu.gpa || edu.cgpa}</div>}
                </div>
              ))}

              {certifications.map((cert, i) => (
                <div key={i} className="t16-bw-card">
                  <h3 className="t16-card-title">{cert.name}</h3>
                  <div className="t16-card-sub">{cert.issuingOrganization}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES OFFERED */}
        {services.length > 0 && (
          <section style={{ marginBottom: "44px" }}>
            <div className="t16-sec-header">
              <h2 className="t16-sec-title"><Zap size={18} /> {"// SERVICES OFFERED"}</h2>
            </div>

            <div className="t16-grid-2">
              {services.map((svc, i) => (
                <div key={i} className="t16-bw-card">
                  <h3 className="t16-card-title">{svc.title}</h3>
                  <p className="t16-card-text">{svc.description}</p>
                  {svc.price && <div style={{ marginTop: "8px", fontWeight: 700, fontSize: "11px", fontFamily: "JetBrains Mono" }}>RATE: {svc.price}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT FORM WITH VECTOR ARTWORK */}
        <section id="contact">
          <div className="t16-sec-header">
            <h2 className="t16-sec-title"><Mail size={18} /> {"// DISPATCH MESSAGE"}</h2>
          </div>

          <div className="t16-grid-2">
            <div className="t16-bw-card">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="t16-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="t16-input"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={handleChange}
                  className="t16-input t16-textarea"
                  required
                />
                <button type="submit" className="t16-btn" disabled={isSubmitting}>
                  <Send size={13} /> {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
                </button>
              </form>
            </div>

            <div className="t16-vector-box" style={{ padding: "20px" }}>
              <img
                src="https://illustrations.popsy.co/white/paper-plane.svg"
                alt="Send Message Vector Artwork"
                className="t16-vector-img"
                style={{ maxHeight: "200px" }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="t16-footer">
        BYTEBODH FOLIO · TEMPLATE 16 (MONOCHROME VECTOR ARTWORK)
      </footer>
    </div>
  );
};

export default TemplateSixteen;

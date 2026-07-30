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
  ExternalLink,
} from "lucide-react";
import { animate, stagger } from "animejs";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Ten Scoped CSS
   Palette: Black & White, Yellow, Brown, Dark Slate Grey
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-ten-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    .t10-root {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .t10-container {
      display: flex;
      flex-direction: row;
      min-height: 100vh;
      flex-wrap: wrap;
    }

    /* ── Left Sidebar Panel (Dark Slate & Brown) ── */
    .t10-sidebar {
      width: 340px;
      background: #1e293b; /* Dark Slate */
      color: #ffffff;
      padding: 40px 28px;
      border-right: 3px solid #78350f; /* Warm Cocoa Brown border */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      box-sizing: border-box;
      overflow-y: auto;
    }
    @media (max-width: 900px) {
      .t10-sidebar {
        width: 100%;
        height: auto;
        position: relative;
        border-right: none;
        border-bottom: 3px solid #78350f;
      }
    }

    .t10-avatar-wrapper {
      text-align: center;
      margin-bottom: 24px;
    }
    .t10-avatar-ring {
      width: 110px; height: 110px;
      margin: 0 auto 16px;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #f59e0b, #78350f, #ffffff);
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
    }
    .t10-avatar-img {
      width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
      border: 3px solid #1e293b;
    }
    .t10-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%;
      background: #78350f; color: #f59e0b;
      font-size: 2.6rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      border: 3px solid #1e293b;
    }
    .t10-name {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .t10-headline {
      font-size: 0.9rem;
      font-weight: 600;
      color: #f59e0b; /* Yellow accent */
      margin-bottom: 16px;
    }
    .t10-badge {
      display: inline-block;
      background: #78350f;
      color: #fef08a;
      border: 1px solid #f59e0b;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .t10-bio {
      font-size: 0.85rem;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    /* Sidebar Contacts & Socials */
    .t10-sidebar-contact {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }
    .t10-sidebar-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #e2e8f0;
      background: #0f172a;
      border: 1px solid #334155;
      padding: 8px 12px;
      border-radius: 8px;
      text-decoration: none;
      word-break: break-all;
    }
    .t10-sidebar-chip:hover {
      border-color: #f59e0b;
      color: #f59e0b;
    }
    .t10-sidebar-socials {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    .t10-social-btn {
      width: 36px; height: 36px;
      border-radius: 8px;
      background: #0f172a;
      border: 1px solid #334155;
      color: #ffffff;
      display: flex; align-items: center; justify-content: center;
      text-decoration: none;
      transition: all 0.2s;
    }
    .t10-social-btn:hover {
      background: #f59e0b;
      color: #0f172a;
      border-color: #f59e0b;
    }

    /* ── Right Content Area ── */
    .t10-content {
      flex: 1;
      padding: 50px 40px;
      max-width: 900px;
      box-sizing: border-box;
    }
    @media (max-width: 600px) {
      .t10-content {
        padding: 30px 20px;
      }
    }

    .t10-section {
      margin-bottom: 48px;
    }
    .t10-section-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 22px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }
    .t10-section-icon {
      width: 36px; height: 36px;
      background: #78350f;
      color: #f59e0b;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .t10-section-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #0f172a;
    }

    /* Skills Progress Bars */
    .t10-skills-list {
      display: flex; flex-direction: column; gap: 14px;
    }
    .t10-skill-item {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .t10-skill-header {
      display: flex; justify-content: space-between;
      font-size: 13px; font-weight: 700; color: #0f172a;
      margin-bottom: 6px;
    }
    .t10-progress-bg {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .t10-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #78350f, #f59e0b);
      border-radius: 4px;
      width: 0%;
    }

    /* Cards */
    .t10-grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .t10-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 22px;
      transition: all 0.25s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .t10-card:hover {
      border-color: #f59e0b;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      transform: translateY(-3px);
    }
    .t10-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .t10-card-sub {
      font-size: 0.95rem;
      font-weight: 600;
      color: #78350f;
      margin-bottom: 8px;
    }
    .t10-card-date {
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      background: #fef08a;
      border: 1px solid #f59e0b;
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .t10-card-text {
      font-size: 0.9rem;
      color: #475569;
      line-height: 1.6;
    }
    .t10-gpa {
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
      background: #1e293b;
      padding: 3px 10px;
      border-radius: 4px;
      display: inline-block;
      margin-top: 10px;
    }

    /* Projects */
    .t10-tech-tags {
      display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0;
    }
    .t10-tech-pill {
      font-size: 11px; font-weight: 700;
      color: #78350f; background: #fffbebf;
      border: 1px solid #f59e0b;
      padding: 2px 8px; border-radius: 4px;
    }
    .t10-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 13px; font-weight: 700; color: #f59e0b;
      text-decoration: none;
    }
    .t10-link:hover {
      text-decoration: underline;
    }

    /* Contact Form */
    .t10-form-card {
      background: #ffffff;
      border: 2px solid #78350f;
      border-radius: 12px;
      padding: 28px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.05);
    }
    .t10-input {
      width: 100%;
      box-sizing: border-box;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      color: #0f172a;
      outline: none;
      margin-bottom: 16px;
    }
    .t10-input:focus {
      border-color: #f59e0b;
      background: #ffffff;
    }
    .t10-textarea {
      min-height: 110px;
      resize: vertical;
    }
    .t10-submit-btn {
      background: #1e293b;
      color: #f59e0b;
      font-weight: 800;
      font-size: 14px;
      border: 2px solid #78350f;
      border-radius: 8px;
      padding: 12px 24px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .t10-submit-btn:hover {
      background: #f59e0b;
      color: #0f172a;
      border-color: #f59e0b;
    }

    /* Footer */
    .t10-footer {
      border-top: 1px solid #e2e8f0;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      background: #ffffff;
    }

    /* Mobile Responsiveness */
    @media (max-width: 900px) {
      .t10-container {
        flex-direction: column;
      }
      .t10-sidebar {
        width: 100%;
        height: auto;
        position: relative;
        border-right: none;
        border-bottom: 3px solid #78350f;
        padding: 28px 20px;
      }
      .t10-content {
        padding: 30px 16px 60px;
        width: 100%;
      }
      .t10-grid-2 {
        grid-template-columns: 1fr;
      }
      .t10-form-card {
        padding: 20px 16px;
      }
    }
  `;
  document.head.appendChild(style);
}

const TemplateTen = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();

    // Sidebar anime entrance
    animate(".t10-sidebar", {
      translateX: [-80, 0],
      opacity: [0, 1],
      duration: 800,
    });

    // Content cards stagger
    animate(".t10-card", {
      translateY: [30, 0],
      opacity: [0, 1],
      delay: stagger(90, { start: 200 }),
      duration: 700,
    });

    // Skill progress bar animation
    animate(".t10-progress-fill", {
      width: (el) => el.getAttribute("data-width") || "85%",
      duration: 1200,
      delay: stagger(100, { start: 400 }),
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
      toast.success("Message Sent!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="t10-root">
      <ToastContainer position="bottom-right" />

      <div className="t10-container">
        {/* Left Sticky Sidebar */}
        <aside className="t10-sidebar">
          <div>
            <div className="t10-avatar-wrapper">
              <div className="t10-avatar-ring">
                {profile.pictureUrl ? (
                  <img src={profile.pictureUrl} alt={profile.fullName} className="t10-avatar-img" />
                ) : (
                  <div className="t10-avatar-fallback">{profile.fullName?.[0] || "S"}</div>
                )}
              </div>
              <h1 className="t10-name">{profile.fullName}</h1>
              <p className="t10-headline">{profile.headline}</p>
              <span className="t10-badge">STUDENT PORTFOLIO</span>
            </div>

            {profile.summary && <p className="t10-bio">{profile.summary}</p>}

            {/* Sidebar Contact Info */}
            <div className="t10-sidebar-contact">
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="t10-sidebar-chip">
                  <Mail size={14} /> {profile.email}
                </a>
              )}
              {profile.mobileNumber && (
                <div className="t10-sidebar-chip">
                  <Phone size={14} /> {profile.mobileNumber}
                </div>
              )}
              {profile.location && (
                <div className="t10-sidebar-chip">
                  <MapPin size={14} /> {profile.location}
                </div>
              )}
            </div>

            {/* Social Buttons */}
            {socialLinks.length > 0 && (
              <div className="t10-sidebar-socials">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={formatUrl(link.profileUrl || link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t10-social-btn"
                    title={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
            Template Ten · Dual-Column Slate
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="t10-content">
          {/* Skills Section */}
          {skills.length > 0 && (
            <section id="skills" className="t10-section">
              <div className="t10-section-title-row">
                <div className="t10-section-icon"><Code2 size={20} /></div>
                <h2 className="t10-section-title">Core Skills & Proficiency</h2>
              </div>
              <div className="t10-skills-list">
                {skills.map((skill, i) => {
                  const sName = getSkillName(skill);
                  const pct = 80 + ((i * 7) % 20); // Dynamic percentage 80-95%
                  return (
                    <div key={i} className="t10-skill-item">
                      <div className="t10-skill-header">
                        <span>{sName}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="t10-progress-bg">
                        <div className="t10-progress-fill" data-width={`${pct}%`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <section id="experience" className="t10-section">
              <div className="t10-section-title-row">
                <div className="t10-section-icon"><Briefcase size={20} /></div>
                <h2 className="t10-section-title">Experience & Internships</h2>
              </div>
              <div className="t10-grid-2">
                {experience.map((exp, i) => (
                  <div key={i} className="t10-card">
                    <div className="t10-card-title">{exp.position}</div>
                    <div className="t10-card-sub">{exp.company}</div>
                    <div className="t10-card-date">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </div>
                    {exp.description && <p className="t10-card-text">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <section id="education" className="t10-section">
              <div className="t10-section-title-row">
                <div className="t10-section-icon"><GraduationCap size={20} /></div>
                <h2 className="t10-section-title">Education</h2>
              </div>
              <div className="t10-grid-2">
                {education.map((edu, i) => (
                  <div key={i} className="t10-card">
                    <div className="t10-card-title">{edu.degree}</div>
                    <div className="t10-card-sub">{edu.institution}</div>
                    <div className="t10-card-date">
                      {edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}
                    </div>
                    {edu.fieldOfStudy && <p className="t10-card-text">Major: {edu.fieldOfStudy}</p>}
                    {(edu.gpa || edu.percentage || edu.cgpa) && (
                      <div className="t10-gpa">GPA: {edu.gpa || edu.percentage || edu.cgpa}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <section id="projects" className="t10-section">
              <div className="t10-section-title-row">
                <div className="t10-section-icon"><FolderOpen size={20} /></div>
                <h2 className="t10-section-title">Featured Projects</h2>
              </div>
              <div className="t10-grid-2">
                {projects.map((proj, i) => (
                  <div key={i} className="t10-card">
                    <div className="t10-card-title">{proj.title}</div>
                    {proj.description && <p className="t10-card-text">{proj.description}</p>}
                    {proj.techStack && (
                      <div className="t10-tech-tags">
                        {proj.techStack.split(",").map((tech, idx) => (
                          <span key={idx} className="t10-tech-pill">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {(proj.projectUrl || proj.link) && (
                      <a
                        href={formatUrl(proj.projectUrl || proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t10-link"
                      >
                        Project Link <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <section className="t10-section">
              <div className="t10-section-title-row">
                <div className="t10-section-icon"><Award size={20} /></div>
                <h2 className="t10-section-title">Certifications & Honors</h2>
              </div>
              <div className="t10-grid-2">
                {certifications.map((cert, i) => (
                  <div key={i} className="t10-card">
                    <div className="t10-card-title">{cert.name}</div>
                    <div className="t10-card-sub">{cert.issuingOrganization}</div>
                    {cert.issueDate && <div className="t10-card-date">{cert.issueDate}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section id="contact" className="t10-section">
            <div className="t10-section-title-row">
              <div className="t10-section-icon"><Mail size={20} /></div>
              <h2 className="t10-section-title">Get In Touch</h2>
            </div>
            <div className="t10-form-card">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="t10-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="t10-input"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="t10-input t10-textarea"
                  required
                />
                <button type="submit" className="t10-submit-btn" disabled={isSubmitting}>
                  <Send size={16} />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="t10-footer">
            Powered by ByteBodh Folio · Template Ten
          </footer>
        </main>
      </div>
    </div>
  );
};

export default TemplateTen;

import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  Zap,
  Crown
} from "lucide-react";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Template Fifteen: PLAYING CARDS & CASINO DECK THEME
   Palette: Deep Poker Green Felt (#092317), Linen White Card Stock (#fdfbf7),
   Gold Foil Borders (#d4af37), Crimson Red (#dc2626), Obsidian Black (#0f172a).
   Suits: Spades ♠, Hearts ♥, Diamonds ♦, Clubs ♣.
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-fifteen-playing-cards-styles";

function injectStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Cinzel:wght@700;900&family=JetBrains+Mono:wght@600;800&display=swap');

    .t15-root {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: radial-gradient(circle at center, #0e3020 0%, #06170e 100%);
      color: #f8fafc;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* Subtle Playing Card Suit Background Pattern */
    .t15-root::before {
      content: '♠  ♥  ♦  ♣  ♠  ♥  ♦  ♣  ♠  ♥  ♦  ♣';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      font-family: 'Cinzel', serif;
      font-size: 28px;
      color: rgba(255, 255, 255, 0.02);
      letter-spacing: 40px;
      line-height: 80px;
      word-break: break-all;
      pointer-events: none;
      z-index: 0;
    }

    /* ── Topbar (Casino Felt Bar) ── */
    .t15-topbar {
      background: #05160e;
      border-bottom: 2px solid #d4af37;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    }
    .t15-brand {
      font-family: 'Cinzel', serif;
      font-size: 15px; font-weight: 900;
      color: #d4af37;
      display: flex; align-items: center; gap: 8px;
      letter-spacing: 0.1em;
    }

    .t15-nav {
      display: flex; gap: 4px; flex-wrap: wrap;
    }
    .t15-nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700;
      color: #cbd5e1;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .t15-nav-link:hover {
      color: #d4af37;
      border-color: #d4af37;
      background: rgba(212, 175, 55, 0.1);
    }

    .t15-badge-royal {
      display: inline-flex; align-items: center; gap: 6px;
      background: #172615;
      border: 1.5px solid #d4af37;
      border-radius: 100px;
      padding: 5px 14px;
      font-size: 11px; font-weight: 800;
      color: #d4af37;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
    }

    /* ── PLAYING CARD WRAPPER & CONTAINER ── */
    .t15-hero {
      padding: 48px 24px 40px;
      position: relative; z-index: 1;
    }
    .t15-container {
      max-width: 1050px; margin: 0 auto;
    }

    /* ── Ace Profile Card (Hero Card) ── */
    .t15-hero-card {
      background: #fdfbf7;
      border: 3.5px solid #d4af37;
      border-radius: 24px;
      padding: 36px;
      color: #0f172a;
      position: relative;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(212, 175, 55, 0.15);
      transition: transform 0.3s;
    }
    .t15-hero-card:hover {
      transform: translateY(-4px) rotate(-0.5deg);
    }

    /* Corner Card Indices */
    .t15-card-index {
      position: absolute;
      font-family: 'Cinzel', serif;
      font-weight: 900;
      line-height: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    }
    .t15-index-top-left { top: 14px; left: 16px; font-size: 16px; }
    .t15-index-bottom-right { bottom: 14px; right: 16px; font-size: 16px; transform: rotate(180deg); }
    .t15-suit-black { color: #0f172a; }
    .t15-suit-red { color: #dc2626; }

    .t15-hero-inner {
      display: flex; gap: 36px; align-items: center; flex-wrap: wrap;
    }
    .t15-avatar-wrap { position: relative; flex-shrink: 0; }
    .t15-avatar-gold-frame {
      width: 120px; height: 120px; border-radius: 50%;
      padding: 4px;
      background: linear-gradient(135deg, #d4af37, #fef08a, #b45309);
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
    }
    .t15-avatar {
      width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid #ffffff;
    }
    .t15-avatar-fallback {
      width: 100%; height: 100%; border-radius: 50%;
      background: linear-gradient(135deg, #05160e, #0e3020);
      color: #d4af37; font-size: 2.8rem; font-weight: 900; font-family: 'Cinzel', serif;
      display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff;
    }

    .t15-hero-content { flex: 1; min-width: 240px; }
    .t15-card-rank-tag {
      font-family: 'Cinzel', serif;
      font-size: 11px; font-weight: 900;
      color: #854d0e; background: #fef9c3;
      border: 1px solid #fde047;
      padding: 3px 10px; border-radius: 6px;
      display: inline-block; margin-bottom: 8px;
    }
    .t15-name {
      font-size: clamp(2rem, 4.5vw, 3rem); font-weight: 900;
      color: #0f172a; margin: 0 0 6px 0; font-family: 'Cinzel', serif;
    }
    .t15-name-gold { color: #854d0e; }
    .t15-headline { font-size: 1.05rem; font-weight: 700; color: #059669; margin-bottom: 12px; }
    .t15-summary { font-size: 0.9rem; color: #334155; line-height: 1.65; margin-bottom: 18px; }

    .t15-contact-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .t15-chip-item {
      display: inline-flex; align-items: center; gap: 5px;
      font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #334155;
      background: #f1f5f9; border: 1px solid #cbd5e1; padding: 5px 11px; border-radius: 6px;
      text-decoration: none;
    }
    .t15-chip-item:hover { border-color: #d4af37; color: #854d0e; background: #fefcbf; }

    /* Casino Chips Social Media Buttons */
    .t15-chip-btns { display: flex; gap: 10px; flex-wrap: wrap; }
    .t15-casino-chip {
      width: 40px; height: 40px; border-radius: 50%;
      background: #05160e; border: 3px dashed #d4af37;
      color: #d4af37; display: flex; align-items: center; justify-content: center;
      text-decoration: none; transition: all 0.25s;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .t15-casino-chip:hover {
      background: #d4af37; color: #05160e; border-color: #05160e;
      transform: translateY(-3px) rotate(15deg);
      box-shadow: 0 8px 18px rgba(212, 175, 55, 0.4);
    }

    /* ── STATS STRIP (THE WINNING HAND) ── */
    .t15-stats-section { padding: 0 24px 40px; relative; z-index: 1; }
    .t15-stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px;
    }
    .t15-stat-card {
      background: #fdfbf7; border: 2px solid #d4af37; border-radius: 16px;
      padding: 16px; text-align: center; color: #0f172a; position: relative;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4); transition: transform 0.2s;
    }
    .t15-stat-card:hover { transform: translateY(-4px); border-color: #059669; }
    .t15-stat-val { font-family: 'Cinzel', serif; font-size: 1.8rem; font-weight: 900; color: #854d0e; }
    .t15-stat-lbl { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #64748b; margin-top: 4px; text-transform: uppercase; }

    /* ── SECTIONS & CARDS ── */
    .t15-main { max-width: 1050px; margin: 0 auto; padding: 0 24px 60px; relative; z-index: 1; }
    .t15-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .t15-sec-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #d4af37;
    }
    .t15-sec-icon-suit {
      font-size: 20px; color: #d4af37;
    }
    .t15-sec-title { font-family: 'Cinzel', serif; font-size: 1.25rem; font-weight: 900; color: #f8fafc; letter-spacing: 0.05em; }

    /* Generic Playing Card */
    .t15-playing-card {
      background: #fdfbf7; border: 2px solid #d4af37; border-radius: 16px;
      padding: 22px; color: #0f172a; position: relative; margin-bottom: 16px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.5); transition: all 0.25s;
    }
    .t15-playing-card:hover {
      transform: translateY(-4px) rotate(-0.5deg);
      border-color: #059669; box-shadow: 0 18px 40px rgba(0,0,0,0.6);
    }
    .t15-pcard-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
    .t15-pcard-sub { font-size: 0.85rem; font-weight: 700; color: #059669; margin-bottom: 6px; }
    .t15-pcard-date {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #64748b;
      background: #e2e8f0; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 8px;
    }
    .t15-pcard-text { font-size: 0.85rem; color: #334155; line-height: 1.5; }

    /* Skills Pill Grid */
    .t15-skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .t15-skill-chip {
      font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
      color: #0f172a; background: #ffffff; border: 1.5px solid #d4af37;
      padding: 6px 12px; border-radius: 8px; transition: all 0.2s;
    }
    .t15-skill-chip:hover { background: #d4af37; color: #05160e; }

    /* Tech Badges */
    .t15-tech-badge {
      font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #059669;
      background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px; margin-right: 4px;
    }

    /* Links */
    .t15-link {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 800; color: #854d0e; text-decoration: none; margin-top: 10px;
    }
    .t15-link:hover { text-decoration: underline; color: #059669; }

    /* Form inside Dealer Card */
    .t15-input {
      width: 100%; box-sizing: border-box; background: #ffffff; border: 1.5px solid #cbd5e1;
      padding: 10px 14px; border-radius: 8px; color: #0f172a; font-family: inherit; font-size: 12px;
      outline: none; margin-bottom: 10px;
    }
    .t15-input:focus { border-color: #d4af37; }
    .t15-textarea { min-height: 80px; resize: vertical; }
    .t15-btn-deal {
      background: linear-gradient(135deg, #d4af37, #b45309); color: #05160e;
      font-family: 'Cinzel', serif; font-weight: 900; font-size: 12px;
      border: none; border-radius: 8px; padding: 12px 24px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 8px; transition: all 0.25s;
      box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
    }
    .t15-btn-deal:hover { background: #059669; color: #ffffff; }

    /* Footer */
    .t15-footer {
      border-top: 2px solid #d4af37; padding: 20px; text-align: center;
      font-family: 'Cinzel', serif; font-size: 11px; color: #d4af37; background: #05160e;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .t15-topbar { padding: 10px 14px; }
      .t15-hero { padding: 24px 14px; }
      .t15-hero-card { padding: 24px 18px; }
      .t15-hero-inner { flex-direction: column; text-align: center; justify-content: center; }
      .t15-contact-chips { justify-content: center; }
      .t15-chip-btns { justify-content: center; }
      .t15-grid-2 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

const TemplateFifteen = ({ profile }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  const getSkillName = (skill) => (typeof skill === "string" ? skill : skill?.name || "");
  const formatUrl = (url) => (url ? (url.startsWith("http") ? url : `https://${url}`) : "#");

  const skills = useMemo(() => profile?.skills || [], [profile?.skills]);
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
      toast.success("Message Dealt to Developer!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.info("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group Skills by Suit for Cards theme
  const categorizedSkills = useMemo(() => {
    const categories = {
      "♠ Backend & Core Systems": [],
      "♥ Frontend & Interface": [],
      "♦ Cloud, Data & DevOps": [],
      "♣ Tools & Architectures": []
    };

    skills.forEach((skillItem, idx) => {
      const name = getSkillName(skillItem);
      const mod = idx % 4;
      if (mod === 0) categories["♠ Backend & Core Systems"].push(name);
      else if (mod === 1) categories["♥ Frontend & Interface"].push(name);
      else if (mod === 2) categories["♦ Cloud, Data & DevOps"].push(name);
      else categories["♣ Tools & Architectures"].push(name);
    });

    return categories;
  }, [skills]);

  if (!profile) return null;

  return (
    <div className="t15-root">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Topbar: Casino Felt Station */}
      <header className="t15-topbar">
        <a href="#hero" className="t15-brand">
          ♠ BYTEBODH CASINO FOLIO · TEMPLATE 15
        </a>

        <nav className="t15-nav">
          <a href="#skills" className="t15-nav-link">♠ Tech Deck</a>
          <a href="#projects" className="t15-nav-link">♥ Projects</a>
          <a href="#experience" className="t15-nav-link">♦ Experience</a>
          <a href="#contact" className="t15-nav-link">♣ Contact</a>
        </nav>

        <div className="t15-badge-royal">
          <Crown size={14} /> ROYAL HAND: OPEN TO OPPORTUNITIES
        </div>
      </header>

      {/* HERO SECTION: ACE OF SPADES PROFILE CARD */}
      <section id="hero" className="t15-hero">
        <div className="t15-container">
          <div className="t15-hero-card">
            {/* Top-Left Rank Index */}
            <div className="t15-card-index t15-index-top-left t15-suit-black">
              <span>A</span>
              <span>♠</span>
            </div>

            {/* Bottom-Right Rank Index */}
            <div className="t15-card-index t15-index-bottom-right t15-suit-black">
              <span>A</span>
              <span>♠</span>
            </div>

            <div className="t15-hero-inner">
              <div className="t15-avatar-wrap">
                <div className="t15-avatar-gold-frame">
                  {profile.pictureUrl ? (
                    <img src={profile.pictureUrl} alt={profile.fullName} className="t15-avatar" />
                  ) : (
                    <div className="t15-avatar-fallback">{profile.fullName?.[0] || "A"}</div>
                  )}
                </div>
              </div>

              <div className="t15-hero-content">
                <div className="t15-card-rank-tag">
                  ACE OF SPADES · MASTER DEVELOPER
                </div>
                <h1 className="t15-name">
                  {profile.fullName || "Developer Name"}
                </h1>
                <p className="t15-headline">{profile.headline || "Full Stack Software Engineer"}</p>
                
                {profile.summary && <p className="t15-summary">{profile.summary}</p>}

                <div className="t15-contact-chips">
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="t15-chip-item">
                      <Mail size={12} /> {profile.email}
                    </a>
                  )}
                  {profile.mobileNumber && (
                    <span className="t15-chip-item"><Phone size={12} /> {profile.mobileNumber}</span>
                  )}
                  {profile.location && (
                    <span className="t15-chip-item"><MapPin size={12} /> {profile.location}</span>
                  )}
                </div>

                {/* Casino Chip Social Links */}
                {socialLinks.length > 0 && (
                  <div className="t15-chip-btns">
                    {socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={formatUrl(link.profileUrl || link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t15-casino-chip"
                        title={link.platform}
                      >
                        {getSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP: THE WINNING HAND */}
      <section className="t15-stats-section">
        <div className="t15-container">
          <div className="t15-stats-grid">
            <div className="t15-stat-card">
              <div className="t15-card-index t15-index-top-left t15-suit-red"><span>A</span><span>♥</span></div>
              <div className="t15-stat-val">{experience.length || 3}+</div>
              <div className="t15-stat-lbl">Years Experience</div>
            </div>

            <div className="t15-stat-card">
              <div className="t15-card-index t15-index-top-left t15-suit-black"><span>K</span><span>♠</span></div>
              <div className="t15-stat-val">{projects.length || 10}+</div>
              <div className="t15-stat-lbl">Completed Projects</div>
            </div>

            <div className="t15-stat-card">
              <div className="t15-card-index t15-index-top-left t15-suit-red"><span>Q</span><span>♦</span></div>
              <div className="t15-stat-val">{skills.length || 15}+</div>
              <div className="t15-stat-lbl">Skills Mastered</div>
            </div>

            <div className="t15-stat-card">
              <div className="t15-card-index t15-index-top-left t15-suit-black"><span>J</span><span>♣</span></div>
              <div className="t15-stat-val">{certifications.length || 5}+</div>
              <div className="t15-stat-lbl">Credentials Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SECTIONS GRID */}
      <main className="t15-main">
        {/* SKILLS DECK */}
        {skills.length > 0 && (
          <section id="skills" style={{ marginBottom: "40px" }}>
            <div className="t15-sec-header">
              <span className="t15-sec-icon-suit">♠</span>
              <h2 className="t15-sec-title">THE DECK OF SKILLS</h2>
            </div>

            <div className="t15-grid-2">
              {Object.entries(categorizedSkills).map(([catName, catSkills], idx) => {
                if (catSkills.length === 0) return null;
                const isRed = catName.includes("♥") || catName.includes("♦");
                return (
                  <div key={idx} className="t15-playing-card">
                    <div className={`t15-card-index t15-index-top-left ${isRed ? "t15-suit-red" : "t15-suit-black"}`}>
                      <span>10</span>
                      <span>{catName[0]}</span>
                    </div>

                    <h3 className="t15-pcard-title" style={{ marginLeft: "14px", marginBottom: "12px" }}>
                      {catName}
                    </h3>
                    <div className="t15-skills-grid">
                      {catSkills.map((sk, i) => (
                        <span key={i} className="t15-skill-chip">{sk}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FEATURED PROJECTS (ROYAL FLUSH) */}
        {projects.length > 0 && (
          <section id="projects" style={{ marginBottom: "40px" }}>
            <div className="t15-sec-header">
              <span className="t15-sec-icon-suit">♥</span>
              <h2 className="t15-sec-title">FEATURED PROJECTS (ROYAL FLUSH)</h2>
            </div>

            <div className="t15-grid-2">
              {projects.map((proj, i) => {
                const ranks = ["K", "Q", "J", "10", "A"];
                const suits = ["♠", "♥", "♦", "♣"];
                const rank = ranks[i % ranks.length];
                const suit = suits[i % suits.length];
                const isRed = suit === "♥" || suit === "♦";

                return (
                  <div key={i} className="t15-playing-card">
                    <div className={`t15-card-index t15-index-top-left ${isRed ? "t15-suit-red" : "t15-suit-black"}`}>
                      <span>{rank}</span>
                      <span>{suit}</span>
                    </div>

                    <div style={{ marginLeft: "14px" }}>
                      <h3 className="t15-pcard-title">{proj.title}</h3>
                      {proj.description && <p className="t15-pcard-text">{proj.description}</p>}
                      {proj.techStack && (
                        <div style={{ marginTop: "8px" }}>
                          {proj.techStack.split(",").map((tech, idx) => (
                            <span key={idx} className="t15-tech-badge">{tech.trim()}</span>
                          ))}
                        </div>
                      )}
                      {(proj.projectUrl || proj.link) && (
                        <a
                          href={formatUrl(proj.projectUrl || proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="t15-link"
                        >
                          View Project {suit} <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* WORK EXPERIENCE (CAREER DECK) */}
        {experience.length > 0 && (
          <section id="experience" style={{ marginBottom: "40px" }}>
            <div className="t15-sec-header">
              <span className="t15-sec-icon-suit">♦</span>
              <h2 className="t15-sec-title">CAREER EXPERIENCE DECK</h2>
            </div>

            <div className="t15-grid-2">
              {experience.map((exp, i) => (
                <div key={i} className="t15-playing-card">
                  <div className="t15-card-index t15-index-top-left t15-suit-red">
                    <span>9</span>
                    <span>♦</span>
                  </div>

                  <div style={{ marginLeft: "14px" }}>
                    <h3 className="t15-pcard-title">{exp.position}</h3>
                    <div className="t15-pcard-sub">{exp.company}</div>
                    <div className="t15-card-date">{exp.startDate} — {exp.endDate || "Present"}</div>
                    {exp.description && <p className="t15-pcard-text">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION & CERTIFICATIONS (HONORS CARDS) */}
        {(education.length > 0 || certifications.length > 0) && (
          <section style={{ marginBottom: "40px" }}>
            <div className="t15-sec-header">
              <span className="t15-sec-icon-suit">♣</span>
              <h2 className="t15-sec-title">ACADEMICS & CERTIFICATIONS</h2>
            </div>

            <div className="t15-grid-2">
              {education.map((edu, i) => (
                <div key={i} className="t15-playing-card">
                  <div className="t15-card-index t15-index-top-left t15-suit-black">
                    <span>8</span>
                    <span>♣</span>
                  </div>

                  <div style={{ marginLeft: "14px" }}>
                    <h3 className="t15-pcard-title">{edu.degree}</h3>
                    <div className="t15-pcard-sub">{edu.institution}</div>
                    <div className="t15-card-date">{edu.startDate || edu.startYear} — {edu.endDate || edu.endYear}</div>
                    {(edu.gpa || edu.cgpa) && <div className="t15-pcard-text" style={{ fontWeight: 700, color: "#854d0e" }}>SCORE: {edu.gpa || edu.cgpa}</div>}
                  </div>
                </div>
              ))}

              {certifications.map((cert, i) => (
                <div key={i} className="t15-playing-card">
                  <div className="t15-card-index t15-index-top-left t15-suit-black">
                    <span>7</span>
                    <span>♣</span>
                  </div>

                  <div style={{ marginLeft: "14px" }}>
                    <h3 className="t15-pcard-title">{cert.name}</h3>
                    <div className="t15-pcard-sub">{cert.issuingOrganization}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SERVICES OFFERED */}
        {services.length > 0 && (
          <section style={{ marginBottom: "40px" }}>
            <div className="t15-sec-header">
              <span className="t15-sec-icon-suit">♠</span>
              <h2 className="t15-sec-title">HIGH ROLLER SERVICE PACKAGES</h2>
            </div>

            <div className="t15-grid-2">
              {services.map((svc, i) => (
                <div key={i} className="t15-playing-card">
                  <div className="t15-card-index t15-index-top-left t15-suit-black"><span>K</span><span>♠</span></div>
                  <div style={{ marginLeft: "14px" }}>
                    <h3 className="t15-pcard-title">{svc.title}</h3>
                    <p className="t15-pcard-text">{svc.description}</p>
                    {svc.price && <div style={{ marginTop: "6px", fontWeight: 800, color: "#059669", fontSize: "11px" }}>RATE: {svc.price}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT CONSOLE (DEAL A MESSAGE) */}
        <section id="contact">
          <div className="t15-sec-header">
            <span className="t15-sec-icon-suit">♥</span>
            <h2 className="t15-sec-title">DEAL A MESSAGE TO DEVELOPER</h2>
          </div>

          <div className="t15-playing-card" style={{ padding: "28px" }}>
            <div className="t15-card-index t15-index-top-left t15-suit-red"><span>A</span><span>♥</span></div>

            <form onSubmit={handleSubmit} style={{ marginLeft: "14px" }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="t15-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="t15-input"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message..."
                value={formData.message}
                onChange={handleChange}
                className="t15-input t15-textarea"
                required
              />
              <button type="submit" className="t15-btn-deal" disabled={isSubmitting}>
                <Zap size={14} /> {isSubmitting ? "Dealing Message..." : "DEAL MESSAGE ♠"}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="t15-footer">
        ♠ ♥ ♦ ♣ BYTEBODH CASINO FOLIO · TEMPLATE 15 (PLAYING CARDS THEME) ♣ ♦ ♥ ♠
      </footer>
    </div>
  );
};

export default TemplateFifteen;

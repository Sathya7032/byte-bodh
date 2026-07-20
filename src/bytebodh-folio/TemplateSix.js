import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
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
  Sparkles,
  ArrowUpRight,
  Leaf,
  Zap,
  Star,
} from "lucide-react";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ─────────────────────────────────────────────────────────────
   Scoped CSS injected once into the document head
───────────────────────────────────────────────────────────── */
const STYLE_ID = "template-six-styles";

function injectStyles() {
  // Always refresh to ensure white theme styles are active
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    .t6-root {
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      background: #ffffff;
      min-height: 100vh;
      color: #1a1a1a;
      overflow-x: hidden;
    }

    /* ── Topbar ── */
    .t6-topbar {
      background: #ffffff;
      border-bottom: 2px solid #16a34a;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 16px rgba(22,163,74,0.08);
      min-height: 60px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .t6-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #16a34a;
      text-transform: uppercase;
      text-decoration: none;
    }
    .t6-nav {
      display: flex;
      gap: 2px;
      flex-wrap: wrap;
    }
    .t6-nav-link {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #4b5563;
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .t6-nav-link:hover { color: #16a34a; background: #f0fdf4; }
    .t6-badge-open {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      border-radius: 100px;
      padding: 5px 14px;
      font-size: 11px;
      font-weight: 700;
      color: #16a34a;
    }
    .t6-pulse-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #22c55e;
      animation: t6-pulse 2s ease infinite;
    }
    @keyframes t6-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.5; transform: scale(0.75); }
    }

    /* ── Hero ── */
    .t6-hero {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #ffffff 100%);
      border-bottom: 1px solid #bbf7d0;
      padding: 56px 24px 48px;
    }
    .t6-hero-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 40px;
      flex-wrap: wrap;
    }
    .t6-avatar-wrap { position: relative; flex-shrink: 0; }
    .t6-avatar-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, #16a34a, #4ade80, #86efac, #16a34a);
      animation: t6-spin 6s linear infinite;
      z-index: 0;
    }
    @keyframes t6-spin { to { transform: rotate(360deg); } }
    .t6-avatar {
      position: relative; z-index: 1;
      width: 110px; height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #ffffff;
    }
    .t6-avatar-fallback {
      position: relative; z-index: 1;
      width: 110px; height: 110px;
      border-radius: 50%;
      background: linear-gradient(135deg, #16a34a, #4ade80);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.4rem; font-weight: 900; color: #ffffff;
      border: 4px solid #ffffff;
    }
    .t6-hero-content { flex: 1; min-width: 220px; }
    .t6-hero-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: #16a34a;
      background: #dcfce7;
      border: 1px solid #86efac;
      border-radius: 6px;
      padding: 3px 10px;
      margin-bottom: 12px;
    }
    .t6-name {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.05;
      color: #111827;
      margin-bottom: 8px;
    }
    .t6-name-accent { color: #16a34a; }
    .t6-headline {
      font-size: clamp(0.95rem, 2vw, 1.15rem);
      font-weight: 600; color: #374151; margin-bottom: 14px;
    }
    .t6-bio {
      font-size: 0.9rem; color: #4b5563;
      line-height: 1.75; margin-bottom: 20px; max-width: 580px;
    }
    .t6-contact-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .t6-contact-chip {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 500; color: #374151;
      background: #ffffff; border: 1.5px solid #d1fae5;
      border-radius: 8px; padding: 5px 11px;
      text-decoration: none; transition: all 0.2s;
    }
    .t6-contact-chip:hover { border-color: #4ade80; color: #16a34a; background: #f0fdf4; }
    .t6-social-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .t6-social-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 12px;
      background: #ffffff; border: 1.5px solid #bbf7d0;
      color: #16a34a; text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 1px 4px rgba(22,163,74,0.08);
    }
    .t6-social-btn:hover {
      background: #16a34a; border-color: #16a34a; color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(22,163,74,0.22);
    }

    /* ── Stats Strip ── */
    .t6-stats-strip { background: #16a34a; padding: 20px 24px; }
    .t6-stats-inner {
      max-width: 1100px; margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 4px;
    }
    .t6-stat {
      display: flex; flex-direction: column;
      align-items: center; padding: 10px 0;
    }
    .t6-stat-value {
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 900; color: #ffffff; line-height: 1;
    }
    .t6-stat-label {
      font-size: 11px; font-weight: 600;
      color: rgba(255,255,255,0.75);
      text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;
      text-align: center;
    }

    /* ── Main Layout ── */
    .t6-main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 60px; }
    .t6-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .t6-section { margin-bottom: 40px; }
    .t6-section-header {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 20px; padding-bottom: 12px;
      border-bottom: 2px solid #dcfce7;
    }
    .t6-section-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: linear-gradient(135deg, #16a34a, #4ade80);
      display: flex; align-items: center; justify-content: center;
      color: #ffffff; flex-shrink: 0;
    }
    .t6-section-title { font-size: 16px; font-weight: 800; color: #111827; }
    .t6-section-count {
      margin-left: auto; font-size: 11px; font-weight: 700;
      color: #16a34a; background: #dcfce7;
      border: 1px solid #86efac; border-radius: 100px; padding: 2px 10px;
    }

    /* ── Card ── */
    .t6-card {
      background: #ffffff; border: 1.5px solid #e5e7eb;
      border-radius: 16px; padding: 24px;
      transition: all 0.25s; position: relative; overflow: hidden;
    }
    .t6-card:hover {
      border-color: #86efac;
      box-shadow: 0 8px 32px rgba(22,163,74,0.10);
      transform: translateY(-2px);
    }
    .t6-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #16a34a, #4ade80);
      border-radius: 16px 16px 0 0;
      opacity: 0; transition: opacity 0.25s;
    }
    .t6-card:hover::before { opacity: 1; }

    /* ── Timeline ── */
    .t6-timeline-item { position: relative; padding-left: 24px; padding-bottom: 24px; }
    .t6-timeline-item:last-child { padding-bottom: 0; }
    .t6-timeline-item::before {
      content: ''; position: absolute;
      left: 6px; top: 14px; bottom: 0;
      width: 1.5px;
      background: linear-gradient(to bottom, #4ade80, #dcfce7);
    }
    .t6-timeline-item:last-child::before { display: none; }
    .t6-timeline-dot {
      position: absolute; left: 0; top: 6px;
      width: 14px; height: 14px; border-radius: 50%;
      background: #ffffff; border: 2.5px solid #16a34a;
      box-shadow: 0 0 0 3px #dcfce7;
    }
    .t6-tl-role { font-size: 14px; font-weight: 700; color: #111827; }
    .t6-tl-org  { font-size: 13px; font-weight: 600; color: #16a34a; margin-top: 2px; }
    .t6-tl-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
    .t6-tl-tag {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; color: #6b7280;
      background: #f9fafb; border: 1px solid #e5e7eb;
      border-radius: 6px; padding: 2px 8px;
    }
    .t6-tl-desc { font-size: 12.5px; color: #4b5563; line-height: 1.7; margin-top: 8px; }
    .t6-gpa-badge {
      display: inline-block; margin-top: 8px; padding: 3px 12px;
      border-radius: 100px; background: #dcfce7;
      border: 1px solid #86efac; font-size: 11px;
      font-weight: 700; color: #16a34a;
    }

    /* ── Skill bars ── */
    .t6-skill-row { display: flex; flex-direction: column; gap: 12px; }
    .t6-skill-item { display: flex; flex-direction: column; gap: 5px; }
    .t6-skill-meta { display: flex; justify-content: space-between; align-items: center; }
    .t6-skill-name { font-size: 13px; font-weight: 600; color: #111827; }
    .t6-skill-pct  { font-size: 11px; font-weight: 700; color: #16a34a; }
    .t6-bar-bg {
      height: 6px; background: #f0fdf4; border-radius: 100px;
      overflow: hidden; border: 1px solid #bbf7d0;
    }
    .t6-bar-fill {
      height: 100%; border-radius: 100px;
      background: linear-gradient(90deg, #16a34a, #4ade80);
      transition: width 1.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .t6-pill-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
    .t6-pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600; color: #166534;
      background: #f0fdf4; border: 1.5px solid #bbf7d0;
      border-radius: 100px; padding: 5px 14px; transition: all 0.2s;
    }
    .t6-pill:hover { background: #dcfce7; border-color: #4ade80; transform: scale(1.04); color: #15803d; }

    /* ── Projects ── */
    .t6-project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
    .t6-project-card {
      background: #f9fafb; border: 1.5px solid #e5e7eb;
      border-radius: 14px; padding: 18px;
      transition: all 0.25s; display: flex; flex-direction: column;
    }
    .t6-project-card:hover {
      border-color: #4ade80; background: #f0fdf4;
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(22,163,74,0.12);
    }
    .t6-project-title-row {
      display: flex; justify-content: space-between;
      align-items: flex-start; gap: 8px;
    }
    .t6-project-title { font-size: 14px; font-weight: 700; color: #111827; line-height: 1.3; }
    .t6-project-link {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 8px;
      background: #dcfce7; border: 1px solid #86efac;
      color: #16a34a; text-decoration: none; flex-shrink: 0; transition: all 0.2s;
    }
    .t6-project-link:hover { background: #16a34a; color: #ffffff; border-color: #16a34a; }
    .t6-project-desc { font-size: 12px; color: #6b7280; line-height: 1.65; margin-top: 8px; flex: 1; }
    .t6-tech-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 12px; }
    .t6-tech-tag {
      font-size: 10px; font-weight: 700;
      color: #16a34a; background: #dcfce7;
      border: 1px solid #86efac; border-radius: 6px; padding: 2px 8px;
      text-transform: uppercase; letter-spacing: 0.04em;
    }

    /* ── Certifications ── */
    .t6-cert-list { display: flex; flex-direction: column; gap: 10px; }
    .t6-cert-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 14px; background: #f9fafb;
      border: 1.5px solid #e5e7eb; border-radius: 12px; transition: all 0.2s;
    }
    .t6-cert-item:hover { border-color: #4ade80; background: #f0fdf4; }
    .t6-cert-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: linear-gradient(135deg, #16a34a, #4ade80);
      display: flex; align-items: center; justify-content: center;
      color: #ffffff; flex-shrink: 0;
    }
    .t6-cert-name { font-size: 13px; font-weight: 700; color: #111827; line-height: 1.3; }
    .t6-cert-org  { font-size: 11px; color: #16a34a; font-weight: 600; margin-top: 2px; }
    .t6-cert-date { font-size: 11px; color: #9ca3af; margin-top: 1px; }

    /* ── Contact ── */
    .t6-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
    .t6-contact-info { display: flex; flex-direction: column; gap: 14px; }
    .t6-contact-info-item { display: flex; align-items: center; gap: 12px; }
    .t6-contact-info-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: #f0fdf4; border: 1.5px solid #bbf7d0;
      display: flex; align-items: center; justify-content: center;
      color: #16a34a; flex-shrink: 0;
    }
    .t6-contact-info-label {
      font-size: 11px; color: #9ca3af; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.06em;
    }
    .t6-contact-info-value {
      font-size: 13px; color: #111827; font-weight: 600; text-decoration: none;
    }
    .t6-contact-info-value:hover { color: #16a34a; }
    .t6-form { display: flex; flex-direction: column; gap: 12px; }
    .t6-input {
      width: 100%; background: #ffffff;
      border: 1.5px solid #e5e7eb; border-radius: 12px;
      padding: 11px 14px; color: #111827; font-size: 13px;
      font-family: inherit; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .t6-input::placeholder { color: #9ca3af; }
    .t6-input:focus { border-color: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,0.15); }
    .t6-textarea { resize: vertical; min-height: 100px; }
    .t6-submit-btn {
      display: inline-flex; align-items: center; justify-content: center;
      gap: 8px; padding: 12px 26px; border-radius: 12px;
      background: linear-gradient(135deg, #15803d, #16a34a);
      color: #ffffff; font-size: 14px; font-weight: 700;
      border: none; cursor: pointer; transition: all 0.2s;
      width: 100%; font-family: inherit;
    }
    .t6-submit-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #14532d, #15803d);
      box-shadow: 0 8px 24px rgba(22,163,74,0.28);
      transform: translateY(-1px);
    }
    .t6-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    /* ── Footer ── */
    .t6-footer {
      background: #f9fafb; border-top: 2px solid #dcfce7;
      text-align: center; padding: 24px;
      font-size: 12px; font-weight: 600; color: #9ca3af;
      letter-spacing: 0.08em; text-transform: uppercase;
    }
    .t6-footer-accent { color: #16a34a; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .t6-grid-2 { grid-template-columns: 1fr; }
      .t6-nav { display: none; }
      .t6-topbar { padding: 10px 16px; }
      .t6-hero { padding: 32px 16px 28px; }
      .t6-hero-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
      .t6-main { padding: 24px 16px 48px; }
      .t6-contact-grid { grid-template-columns: 1fr; }
      .t6-project-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 500px) {
      .t6-stats-inner { grid-template-columns: 1fr 1fr; }
      .t6-avatar { width: 88px; height: 88px; }
      .t6-avatar-fallback { width: 88px; height: 88px; font-size: 1.8rem; }
      .t6-badge-open { display: none; }
    }

    /* ── Animations ── */
    .t6-reveal { animation: t6-reveal-in 0.55s ease both; }
    @keyframes t6-reveal-in {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .t6-d1 { animation-delay: 0.05s; }
    .t6-d2 { animation-delay: 0.12s; }
    .t6-d3 { animation-delay: 0.18s; }
    .t6-d4 { animation-delay: 0.25s; }
    .t6-d5 { animation-delay: 0.32s; }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const TemplateSix = ({ profile }) => {
  const { username: routeUsername } = useParams();

  useEffect(() => {
    injectStyles();
  }, []);

  const getUsernameFromDomain = () => {
    const hostname = window.location.hostname;
    if (hostname.endsWith(".localhost")) {
      const sub = hostname.replace(".localhost", "");
      return sub && sub !== "www" ? sub : null;
    }
    if (hostname.endsWith(".bytebodh.in")) {
      const sub = hostname.replace(".bytebodh.in", "");
      return sub && sub !== "www" ? sub : null;
    }
    return null;
  };

  const username =
    profile.user?.username || routeUsername || getUsernameFromDomain() || "user";

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const skillList = useMemo(() => {
    if (!profile.skills) return [];
    return profile.skills.map((skill) => {
      if (typeof skill === "object" && skill !== null)
        return { name: skill.name, proficiency: skill.proficiency || 80 };
      return { name: skill, proficiency: 80 };
    });
  }, [profile.skills]);

  const totalExpYears = useMemo(() => {
    if (!profile.experience?.length) return 1;
    let y = 0;
    profile.experience.forEach((exp) => {
      const s = new Date(exp.startDate);
      const e =
        exp.endDate && exp.endDate.toUpperCase() !== "PRESENT"
          ? new Date(exp.endDate)
          : new Date();
      if (!isNaN(s) && !isNaN(e)) y += (e - s) / (1000 * 60 * 60 * 24 * 365.25);
    });
    return Math.max(Math.ceil(y), 1);
  }, [profile.experience]);

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const getSocialIcon = (platform) => {
    const p = platform.toUpperCase();
    if (p.includes("GITHUB")) return <Github style={{ width: 16, height: 16 }} />;
    if (p.includes("LINKEDIN")) return <Linkedin style={{ width: 16, height: 16 }} />;
    if (p.includes("TWITTER") || p.includes(" X"))
      return <Twitter style={{ width: 16, height: 16 }} />;
    return <Globe style={{ width: 16, height: 16 }} />;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createContactMessage({
        id: profile?.user?.id,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        recipientUsername: username,
      });
      if (res.data?.success) {
        toast.success("Message sent! 🌿");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(res.data?.message || "Unknown error");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const experience = profile.experience || [];
  const education = profile.education || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];

  // Split name for green accent on last word
  const nameParts = (profile.fullName || "").trim().split(/\s+/);
  const nameFirst = nameParts.slice(0, -1).join(" ");
  const nameLast = nameParts[nameParts.length - 1] || "";

  return (
    <div className="t6-root">
      <ToastContainer position="bottom-right" autoClose={2800} theme="light" />

      {/* ── TOPBAR ── */}
      <header className="t6-topbar">
        <a className="t6-brand" href="#t6-about">
          <Leaf style={{ width: 18, height: 18 }} />
          ByteBodh Folio
        </a>

        <nav className="t6-nav">
          {["About", "Experience", "Projects", "Skills", "Contact"].map((n) => (
            <a key={n} href={`#t6-${n.toLowerCase()}`} className="t6-nav-link">
              {n}
            </a>
          ))}
        </nav>

        <div className="t6-badge-open">
          <span className="t6-pulse-dot" />
          Open to Work
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="t6-hero t6-reveal t6-d1" id="t6-about">
        <div className="t6-hero-inner">
          {/* Avatar */}
          <div className="t6-avatar-wrap">
            <div className="t6-avatar-ring" />
            {profile.pictureUrl ? (
              <img
                src={profile.pictureUrl}
                alt={profile.fullName}
                className="t6-avatar"
              />
            ) : (
              <div className="t6-avatar-fallback">{profile.fullName?.[0]}</div>
            )}
          </div>

          {/* Content */}
          <div className="t6-hero-content">
            <div className="t6-hero-label">
              <Sparkles style={{ width: 11, height: 11 }} />
              Portfolio · {username}.bytebodh.in
            </div>

            <h1 className="t6-name">
              {nameFirst && <>{nameFirst} </>}
              <span className="t6-name-accent">{nameLast}</span>
            </h1>

            <p className="t6-headline">{profile.headline}</p>
            <p className="t6-bio">{profile.summary}</p>

            {/* Contact chips */}
            {(profile.email || profile.mobileNumber || profile.location) && (
              <div className="t6-contact-row">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="t6-contact-chip">
                    <Mail style={{ width: 12, height: 12, color: "#16a34a" }} />
                    {profile.email}
                  </a>
                )}
                {profile.mobileNumber && (
                  <span className="t6-contact-chip">
                    <Phone style={{ width: 12, height: 12, color: "#16a34a" }} />
                    {profile.mobileNumber}
                  </span>
                )}
                {profile.location && (
                  <span className="t6-contact-chip">
                    <MapPin style={{ width: 12, height: 12, color: "#16a34a" }} />
                    {profile.location}
                  </span>
                )}
              </div>
            )}

            {/* Social links */}
            {profile.socialMediaLinks?.length > 0 && (
              <div className="t6-social-row">
                {profile.socialMediaLinks.map((link, i) => (
                  <a
                    key={i}
                    href={formatUrl(link.profileUrl || link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t6-social-btn"
                    title={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="t6-stats-strip t6-reveal t6-d2">
        <div className="t6-stats-inner">
          <div className="t6-stat">
            <span className="t6-stat-value">{totalExpYears}+</span>
            <span className="t6-stat-label">Years Experience</span>
          </div>
          <div className="t6-stat">
            <span className="t6-stat-value">{projects.length || "∞"}</span>
            <span className="t6-stat-label">Projects Built</span>
          </div>
          <div className="t6-stat">
            <span className="t6-stat-value">{skillList.length || "∞"}</span>
            <span className="t6-stat-label">Skills</span>
          </div>
          <div className="t6-stat">
            <span className="t6-stat-value">{certifications.length || "∞"}</span>
            <span className="t6-stat-label">Certifications</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="t6-main">

        {/* ── EXPERIENCE + EDUCATION (2-col) ── */}
        <div className="t6-grid-2 t6-section">

          {/* Experience */}
          <div id="t6-experience" className="t6-reveal t6-d3">
            <div className="t6-section-header">
              <div className="t6-section-icon">
                <Briefcase style={{ width: 16, height: 16 }} />
              </div>
              <h2 className="t6-section-title">Experience</h2>
              {experience.length > 0 && (
                <span className="t6-section-count">{experience.length}</span>
              )}
            </div>
            <div className="t6-card">
              {experience.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 13 }}>No experience listed yet.</p>
              ) : (
                experience.map((exp, i) => (
                  <div key={i} className="t6-timeline-item">
                    <div className="t6-timeline-dot" />
                    <div className="t6-tl-role">{exp.position}</div>
                    <div className="t6-tl-org">{exp.company}</div>
                    <div className="t6-tl-meta">
                      <span className="t6-tl-tag">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                      {exp.location && (
                        <span className="t6-tl-tag">
                          <MapPin style={{ width: 10, height: 10 }} /> {exp.location}
                        </span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="t6-tl-desc">{exp.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Education */}
          <div id="t6-education" className="t6-reveal t6-d3">
            <div className="t6-section-header">
              <div className="t6-section-icon">
                <GraduationCap style={{ width: 16, height: 16 }} />
              </div>
              <h2 className="t6-section-title">Education</h2>
              {education.length > 0 && (
                <span className="t6-section-count">{education.length}</span>
              )}
            </div>
            <div className="t6-card">
              {education.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 13 }}>No education listed yet.</p>
              ) : (
                education.map((edu, i) => (
                  <div key={i} className="t6-timeline-item">
                    <div className="t6-timeline-dot" />
                    <div className="t6-tl-role">{edu.degree}</div>
                    <div className="t6-tl-org">{edu.institution}</div>
                    <div className="t6-tl-meta">
                      <span className="t6-tl-tag">
                        {edu.startDate} — {edu.endDate || "Present"}
                      </span>
                      {edu.fieldOfStudy && (
                        <span className="t6-tl-tag">{edu.fieldOfStudy}</span>
                      )}
                    </div>
                    {edu.gpa && (
                      <span className="t6-gpa-badge">GPA: {edu.gpa}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <div className="t6-section t6-reveal t6-d4" id="t6-projects">
          <div className="t6-section-header">
            <div className="t6-section-icon">
              <FolderOpen style={{ width: 16, height: 16 }} />
            </div>
            <h2 className="t6-section-title">Projects</h2>
            {projects.length > 0 && (
              <span className="t6-section-count">{projects.length}</span>
            )}
          </div>

          {projects.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>No projects listed yet.</p>
          ) : (
            <div className="t6-project-grid">
              {projects.map((proj, i) => (
                <div key={i} className="t6-project-card">
                  <div className="t6-project-title-row">
                    <div className="t6-project-title">{proj.title}</div>
                    {(proj.link || proj.projectUrl) && (
                      <a
                        href={formatUrl(proj.link || proj.projectUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t6-project-link"
                      >
                        <ArrowUpRight style={{ width: 13, height: 13 }} />
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="t6-project-desc">{proj.description}</p>
                  )}
                  {((proj.technologies && proj.technologies.length > 0) ||
                    proj.techStack) && (
                    <div className="t6-tech-tags">
                      {(proj.technologies || proj.techStack?.split(",") || []).map(
                        (t, ti) => (
                          <span key={ti} className="t6-tech-tag">
                            {typeof t === "string" ? t.trim() : t}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SKILLS + CERTS (2-col) ── */}
        <div className="t6-grid-2 t6-section t6-reveal t6-d4">

          {/* Skills */}
          <div id="t6-skills">
            <div className="t6-section-header">
              <div className="t6-section-icon">
                <Code2 style={{ width: 16, height: 16 }} />
              </div>
              <h2 className="t6-section-title">Skills</h2>
              {skillList.length > 0 && (
                <span className="t6-section-count">{skillList.length}</span>
              )}
            </div>
            <div className="t6-card" style={{ paddingBottom: 20 }}>
              {skillList.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 13 }}>No skills listed yet.</p>
              ) : (
                <>
                  {/* Bars for top 6 with proficiency numbers */}
                  <div className="t6-skill-row" style={{ marginBottom: 20 }}>
                    {skillList.slice(0, 6).map((skill, i) => (
                      <div key={i} className="t6-skill-item">
                        <div className="t6-skill-meta">
                          <span className="t6-skill-name">{skill.name}</span>
                          <span className="t6-skill-pct">{skill.proficiency}%</span>
                        </div>
                        <div className="t6-bar-bg">
                          <div
                            className="t6-bar-fill"
                            style={{
                              width: barsVisible ? `${skill.proficiency}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Remaining as pills */}
                  {skillList.length > 6 && (
                    <div className="t6-pill-cloud">
                      {skillList.slice(6).map((skill, i) => (
                        <span key={i} className="t6-pill">
                          <Zap style={{ width: 10, height: 10 }} />
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="t6-section-header">
              <div className="t6-section-icon">
                <Award style={{ width: 16, height: 16 }} />
              </div>
              <h2 className="t6-section-title">Certifications</h2>
              {certifications.length > 0 && (
                <span className="t6-section-count">{certifications.length}</span>
              )}
            </div>
            <div className="t6-cert-list">
              {certifications.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 13 }}>None listed yet.</p>
              ) : (
                certifications.map((cert, i) => (
                  <div key={i} className="t6-cert-item">
                    <div className="t6-cert-icon">
                      <Star style={{ width: 15, height: 15 }} />
                    </div>
                    <div>
                      <div className="t6-cert-name">{cert.name}</div>
                      {cert.issuingOrganization && (
                        <div className="t6-cert-org">{cert.issuingOrganization}</div>
                      )}
                      {cert.issueDate && (
                        <div className="t6-cert-date">{cert.issueDate}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className="t6-section t6-reveal t6-d5" id="t6-contact">
          <div className="t6-section-header">
            <div className="t6-section-icon">
              <Mail style={{ width: 16, height: 16 }} />
            </div>
            <h2 className="t6-section-title">Get in Touch</h2>
          </div>

          <div className="t6-card">
            <div className="t6-contact-grid">
              {/* Contact info */}
              <div className="t6-contact-info">
                {profile.email && (
                  <div className="t6-contact-info-item">
                    <div className="t6-contact-info-icon">
                      <Mail style={{ width: 15, height: 15 }} />
                    </div>
                    <div>
                      <div className="t6-contact-info-label">Email</div>
                      <a href={`mailto:${profile.email}`} className="t6-contact-info-value">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
                {profile.mobileNumber && (
                  <div className="t6-contact-info-item">
                    <div className="t6-contact-info-icon">
                      <Phone style={{ width: 15, height: 15 }} />
                    </div>
                    <div>
                      <div className="t6-contact-info-label">Phone</div>
                      <span className="t6-contact-info-value">{profile.mobileNumber}</span>
                    </div>
                  </div>
                )}
                {profile.location && (
                  <div className="t6-contact-info-item">
                    <div className="t6-contact-info-icon">
                      <MapPin style={{ width: 15, height: 15 }} />
                    </div>
                    <div>
                      <div className="t6-contact-info-label">Location</div>
                      <span className="t6-contact-info-value">{profile.location}</span>
                    </div>
                  </div>
                )}
                {/* Social links repeated in contact section */}
                {profile.socialMediaLinks?.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: 4 }}>
                    {profile.socialMediaLinks.map((link, i) => (
                      <a
                        key={i}
                        href={formatUrl(link.profileUrl || link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t6-social-btn"
                        title={link.platform}
                      >
                        {getSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Form */}
              <form className="t6-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="t6-input"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="t6-input"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="t6-input t6-textarea"
                  required
                />
                <button type="submit" className="t6-submit-btn" disabled={isSubmitting}>
                  <Send style={{ width: 15, height: 15 }} />
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="t6-footer">
        <Leaf
          style={{
            width: 13,
            height: 13,
            display: "inline",
            verticalAlign: "middle",
            marginRight: 6,
            color: "#16a34a",
          }}
        />
        Crafted with <span className="t6-footer-accent">ByteBodh Folio</span> · Template Six — Nature Green
      </footer>
    </div>
  );
};

export default TemplateSix;
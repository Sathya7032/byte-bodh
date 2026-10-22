import React, { useState } from "react";
import { resolveImageUrl } from "../api/portfolioApiService";
import { getPortfolioUrl } from "../config/api";
import {
  FaGlobe,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSpotify,
  FaDiscord,
  FaTiktok,
  FaTwitch,
  FaTelegram,
  FaEnvelope,
  FaArrowRight,
  FaCopy,
  FaCheck,
  FaTimes,
  FaWhatsapp,
  FaEye,
  FaShieldAlt,
  FaHeart,
  FaCoffee,
  FaBolt,
  FaPhone
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

/**
 * Universal icon resolver for social platforms
 */
export const getSocialIcon = (platform) => {
  const p = platform?.toLowerCase() || "";
  if (p.includes("github")) return <FaGithub />;
  if (p.includes("linkedin")) return <FaLinkedin />;
  if (p.includes("twitter") || p.includes("x.com") || p === "x" || p.includes("twitter_x")) return <FaTwitter />;
  if (p.includes("instagram")) return <FaInstagram />;
  if (p.includes("youtube")) return <FaYoutube />;
  if (p.includes("spotify")) return <FaSpotify />;
  if (p.includes("discord")) return <FaDiscord />;
  if (p.includes("tiktok")) return <FaTiktok />;
  if (p.includes("twitch")) return <FaTwitch />;
  if (p.includes("telegram")) return <FaTelegram />;
  if (p.includes("whatsapp")) return <FaWhatsapp />;
  if (p.includes("mail") || p.includes("email") || p.includes("contact")) return <FaEnvelope />;
  if (p.includes("phone")) return <FaPhone />;
  if (p.includes("coffee") || p.includes("tip") || p.includes("donation")) return <FaCoffee />;
  return <FaGlobe />;
};

/**
 * Determines whether a link is currently scheduled to be visible
 */
export const isLinkScheduledVisible = (link) => {
  if (link.isActive === false) return false;
  const now = new Date().getTime();
  if (link.scheduleStart) {
    const start = new Date(link.scheduleStart).getTime();
    if (!isNaN(start) && now < start) return false;
  }
  if (link.scheduleEnd) {
    const end = new Date(link.scheduleEnd).getTime();
    if (!isNaN(end) && now > end) return false;
  }
  return true;
};

/**
 * Sorts links: pinned links first, then by displayOrder ascending
 */
export const sortLinks = (links = []) => {
  return [...links].sort((a, b) => {
    if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
      return a.isPinned ? -1 : 1;
    }
    const orderA = a.displayOrder ?? 0;
    const orderB = b.displayOrder ?? 0;
    return orderA - orderB;
  });
};

/**
 * Direct Portfolio Website Jump Banner
 */
export const PortfolioJumpBanner = ({ username, templateStyle = "dark" }) => {
  const portfolioUrl = getPortfolioUrl(username);
  if (!portfolioUrl) return null;

  if (templateStyle === "brutalist") {
    return (
      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-4 rounded-2xl bg-[#A7F3D0] text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-between font-black text-sm group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🌐</span>
          <div className="text-left">
            <div className="text-[10px] font-extrabold uppercase tracking-wider">Full Experience</div>
            <div className="text-sm font-black">Explore My Portfolio Website</div>
          </div>
        </div>
        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
      </a>
    );
  }

  if (templateStyle === "light") {
    return (
      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-between font-bold text-sm group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
            🌐
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-emerald-100 font-bold">Interactive Folio</div>
            <div className="text-sm font-black">Visit Full Portfolio Website</div>
          </div>
        </div>
        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
      </a>
    );
  }

  return (
    <a
      href={portfolioUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-white shadow-xl shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-between font-bold text-sm group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg shadow-md">
          🌐
        </div>
        <div className="text-left">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Interactive Portfolio</div>
          <div className="text-sm font-black text-white">Visit Full Portfolio Website</div>
        </div>
      </div>
      <FaArrowRight className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
    </a>
  );
};

/**
 * Universal Share & QR Code Modal
 */
export const LinktreeShareModal = ({ isOpen, onClose, username, fullName, url }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const shareUrl = url || window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Check out ${fullName || username}'s links on ByteBodh: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareTwitter = () => {
    const text = `Connect with ${fullName || username} via ByteBodh Links:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn text-left">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          <FaTimes size={16} />
        </button>

        <h3 className="text-lg font-black text-center mb-1">Share Linktree</h3>
        <p className="text-xs text-slate-400 text-center mb-5">@{username}</p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl flex items-center justify-center mx-auto w-48 h-48 shadow-inner mb-5">
          <QRCode value={shareUrl} size={160} />
        </div>

        {/* Quick share actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-xl text-xs font-bold transition border border-[#25D366]/30 cursor-pointer"
          >
            <FaWhatsapp size={14} /> WhatsApp
          </button>
          <button
            onClick={handleShareTwitter}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-xl text-xs font-bold transition border border-sky-500/30 cursor-pointer"
          >
            <FaTwitter size={14} /> Twitter / X
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1.5 pl-3">
          <span className="text-xs text-slate-400 truncate flex-1 font-mono">{shareUrl}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copied ? <FaCheck size={11} /> : <FaCopy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Universal High-Fidelity Link Card
 * Renders all LinktreeLink entity fields:
 * - title, subtitle, url
 * - type: CLASSIC, HEADER, FEATURED_HERO, CONTACT_FORM, PAYMENT_DONATION
 * - platform icon / thumbnail image
 * - animation: NONE, PULSE, BOUNCE, GLOW, SHAKE, POP
 * - buttonColor, textColor
 * - isPinned, isFeatured, isSensitive (18+ blur confirmation)
 * - clickCount
 */
export const LinktreeLinkCard = ({ link, theme = "cyber-dark", onLinkClick }) => {
  const [sensitiveRevealed, setSensitiveRevealed] = useState(false);

  if (!link) return null;

  const {
    title,
    subtitle,
    url,
    type = "CLASSIC",
    platform = "CUSTOM",
    thumbnailUrl,
    animation = "NONE",
    buttonColor,
    textColor,
    isPinned = false,
    isFeatured = false,
    isSensitive = false,
    clickCount = 0,
  } = link;

  // Custom inline style overrides
  const customStyle = {};
  if (buttonColor) customStyle.backgroundColor = buttonColor;
  if (textColor) customStyle.color = textColor;

  // Attention animations
  const getAnimationClass = () => {
    switch (animation) {
      case "PULSE":
        return "animate-pulse";
      case "BOUNCE":
        return "hover:animate-bounce";
      case "GLOW":
        return "ring-2 ring-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.35)]";
      case "SHAKE":
        return "hover:-rotate-1 active:rotate-1";
      case "POP":
        return "hover:scale-[1.04] active:scale-[0.98]";
      default:
        return "hover:scale-[1.02] active:scale-[0.99]";
    }
  };

  const animClass = getAnimationClass();

  // Resolved thumbnail image or platform icon
  const resolvedThumb = thumbnailUrl ? resolveImageUrl(thumbnailUrl) : null;
  const iconElement = resolvedThumb ? (
    <img src={resolvedThumb} alt="" className="w-full h-full object-cover" />
  ) : (
    getSocialIcon(platform || title)
  );

  // 1. SENSITIVE GATE OVERLAY (18+ content confirmation)
  if (isSensitive && !sensitiveRevealed) {
    const isBrutalist = theme === "neo-brutalist";
    const isLight = theme === "minimal-ivory";

    return (
      <div
        className={`w-full p-4 rounded-2xl text-center flex flex-col items-center justify-center gap-2 transition-all ${
          isBrutalist
            ? "bg-[#FECDD3] text-black border-3 border-black shadow-[4px_4px_0px_#000]"
            : isLight
            ? "bg-rose-50 border border-rose-200 text-rose-900 shadow-sm"
            : "bg-slate-900/90 border border-red-500/40 text-slate-200 backdrop-blur-md shadow-xl"
        }`}
      >
        <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-wider">
          <FaShieldAlt size={14} />
          <span>18+ Sensitive Content</span>
        </div>
        <p className="text-[11px] opacity-80 max-w-xs leading-snug">
          This link may contain sensitive or age-restricted content.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSensitiveRevealed(true);
          }}
          className={`mt-1 px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
            isBrutalist
              ? "bg-black text-white hover:bg-slate-800 border-2 border-black"
              : isLight
              ? "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              : "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40"
          }`}
        >
          <FaEye size={12} />
          <span>Click to View Link</span>
        </button>
      </div>
    );
  }

  // 2. HEADER TYPE (Section Divider)
  if (type === "HEADER") {
    if (theme === "neo-brutalist") {
      return (
        <div className="w-full pt-4 pb-1 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-[#FEF08A] border-2 border-black rounded-xl font-black uppercase text-xs shadow-[3px_3px_0px_#000]">
            {resolvedThumb && (
              <img src={resolvedThumb} alt="" className="w-4 h-4 rounded object-cover" />
            )}
            <span>{title}</span>
          </div>
          {subtitle && (
            <p className="text-[11px] font-bold text-black opacity-80 mt-1">{subtitle}</p>
          )}
        </div>
      );
    }

    if (theme === "minimal-ivory") {
      return (
        <div className="w-full pt-5 pb-1 text-center">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-slate-300" />
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600">
              {resolvedThumb && (
                <img src={resolvedThumb} alt="" className="w-4 h-4 rounded-full object-cover" />
              )}
              <span>{title}</span>
            </div>
            <div className="flex-1 h-[1px] bg-slate-300" />
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 font-medium mt-1">{subtitle}</p>
          )}
        </div>
      );
    }

    const headerColor =
      theme === "aurora-glass"
        ? "text-purple-300"
        : theme === "bento-grid"
        ? "text-cyan-400"
        : theme === "sunset-glow"
        ? "text-amber-300"
        : "text-emerald-400";

    return (
      <div className="w-full pt-5 pb-1 text-center">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-white/15" />
          <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${headerColor}`}>
            {resolvedThumb && (
              <img src={resolvedThumb} alt="" className="w-4 h-4 rounded-full object-cover" />
            )}
            <span>{title}</span>
          </div>
          <div className="flex-1 h-[1px] bg-white/15" />
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 font-medium mt-1">{subtitle}</p>
        )}
      </div>
    );
  }

  // 3. FEATURED HERO CARD
  if (type === "FEATURED_HERO" || isFeatured) {
    if (theme === "neo-brutalist") {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onLinkClick?.(link)}
          style={customStyle}
          className={`group w-full rounded-2xl bg-[#A7F3D0] text-black border-3 border-black shadow-[5px_5px_0px_#000] p-4 flex flex-col gap-3 text-left transition-all ${animClass}`}
        >
          {resolvedThumb && (
            <div className="w-full h-36 rounded-xl overflow-hidden border-2 border-black bg-white">
              <img src={resolvedThumb} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 bg-black text-[#A7F3D0] rounded-md font-black text-[10px] uppercase">
              ⭐ Featured Showcase
            </span>
            {isPinned && (
              <span className="px-2 py-0.5 bg-white border border-black rounded-md font-black text-[10px]">
                📌 Pinned
              </span>
            )}
          </div>
          <div>
            <h4 className="font-black text-base leading-tight group-hover:underline">{title}</h4>
            {subtitle && <p className="text-xs font-bold mt-1 text-slate-800">{subtitle}</p>}
          </div>
          <div className="pt-1 flex items-center justify-between border-t-2 border-black/20 text-xs font-black">
            <span className="flex items-center gap-1.5">
              <span>Explore Now</span>
              <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
            {clickCount > 0 && (
              <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-black">
                👁️ {clickCount} views
              </span>
            )}
          </div>
        </a>
      );
    }

    if (theme === "minimal-ivory") {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onLinkClick?.(link)}
          style={customStyle}
          className={`group w-full rounded-2xl bg-white border border-slate-300 shadow-md hover:shadow-lg p-4 flex flex-col gap-3 text-left transition-all text-slate-900 ${animClass}`}
        >
          {resolvedThumb && (
            <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={resolvedThumb} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-wider">
              ⭐ Featured
            </span>
            {isPinned && (
              <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-full font-bold text-[10px]">
                📌 Pinned
              </span>
            )}
          </div>
          <div>
            <h4 className="font-black text-base leading-tight group-hover:text-emerald-600 transition">
              {title}
            </h4>
            {subtitle && <p className="text-xs text-slate-600 font-medium mt-1">{subtitle}</p>}
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-900 group-hover:text-emerald-600">
              <span>View Resource</span>
              <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
            {clickCount > 0 && (
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                <FaEye size={9} className="inline mr-1" /> {clickCount}
              </span>
            )}
          </div>
        </a>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 p-4 flex flex-col gap-3 text-left transition-all shadow-xl hover:shadow-emerald-500/10 text-white ${animClass}`}
      >
        {resolvedThumb && (
          <div className="w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/40">
            <img src={resolvedThumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
            <FaBolt size={9} /> Featured
          </span>
          {isPinned && (
            <span className="px-2 py-0.5 bg-white/10 border border-white/15 text-slate-300 rounded-full font-bold text-[10px]">
              📌 Pinned
            </span>
          )}
        </div>
        <div>
          <h4 className="font-black text-base text-white group-hover:text-emerald-300 transition leading-tight">
            {title}
          </h4>
          {subtitle && <p className="text-xs text-slate-400 font-medium mt-1 leading-snug">{subtitle}</p>}
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5 text-emerald-400 group-hover:text-emerald-300">
            <span>Explore Now</span>
            <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </span>
          {clickCount > 0 && (
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-slate-400 font-mono">
              <FaEye size={9} className="inline mr-1" /> {clickCount}
            </span>
          )}
        </div>
      </a>
    );
  }

  // 4. PAYMENT / DONATION LINK TYPE
  if (type === "PAYMENT_DONATION") {
    const isBrutalist = theme === "neo-brutalist";
    const isLight = theme === "minimal-ivory";

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-200 text-left ${animClass} ${
          isBrutalist
            ? "bg-[#FED7AA] text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
            : isLight
            ? "bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200 text-amber-950 shadow-xs"
            : "bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-slate-900 border border-amber-500/30 hover:border-amber-400/60 text-white shadow-lg"
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden ${
              isBrutalist
                ? "bg-white border-2 border-black text-black"
                : isLight
                ? "bg-amber-100 text-amber-700"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}
          >
            {iconElement}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black truncate">{title}</span>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                  isBrutalist
                    ? "bg-black text-white"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                Tip Jar
              </span>
            </div>
            {subtitle && (
              <div className="text-[11px] opacity-75 truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <FaHeart className="text-rose-500 group-hover:scale-125 transition-transform" />
        </div>
      </a>
    );
  }

  // 5. CONTACT FORM TYPE
  if (type === "CONTACT_FORM") {
    const isBrutalist = theme === "neo-brutalist";
    const isLight = theme === "minimal-ivory";

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-200 text-left ${animClass} ${
          isBrutalist
            ? "bg-[#BAE6FD] text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
            : isLight
            ? "bg-sky-50/80 hover:bg-sky-100/70 border border-sky-200 text-sky-950 shadow-xs"
            : "bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-slate-900 border border-sky-500/30 hover:border-sky-400/60 text-white shadow-lg"
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden ${
              isBrutalist
                ? "bg-white border-2 border-black text-black"
                : isLight
                ? "bg-sky-100 text-sky-700"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
            }`}
          >
            {iconElement}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black truncate">{title}</span>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                  isBrutalist
                    ? "bg-black text-white"
                    : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                }`}
              >
                Inquiry
              </span>
            </div>
            {subtitle && (
              <div className="text-[11px] opacity-75 truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <FaEnvelope className="text-sky-400 group-hover:scale-125 transition-transform" />
        </div>
      </a>
    );
  }

  // 6. CLASSIC BUTTON LINK
  if (theme === "neo-brutalist") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full p-4 rounded-2xl bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-between text-left font-black ${animClass}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#FDE047] border-2 border-black flex items-center justify-center text-lg shrink-0 overflow-hidden">
            {iconElement}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black truncate">{title}</span>
              {isPinned && (
                <span className="px-1.5 py-0.5 bg-black text-white text-[9px] rounded font-bold uppercase">
                  Pin
                </span>
              )}
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-700 font-bold truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {clickCount > 0 && (
            <span className="text-[10px] bg-slate-100 border border-black px-2 py-0.5 rounded font-bold">
              {clickCount}
            </span>
          )}
          <FaExternalLinkAlt className="text-black text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </a>
    );
  }

  if (theme === "minimal-ivory") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 transition-all flex items-center justify-between text-left shadow-2xs hover:shadow-xs ${animClass}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg shrink-0 overflow-hidden">
            {iconElement}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 truncate">{title}</span>
              {isPinned && (
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[9px] rounded-md font-bold uppercase">
                  Pin
                </span>
              )}
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-500 font-medium truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {clickCount > 0 && (
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
              <FaEye size={9} className="inline mr-1" />
              {clickCount}
            </span>
          )}
          <FaExternalLinkAlt className="text-slate-400 group-hover:text-slate-900 text-xs transition" />
        </div>
      </a>
    );
  }

  if (theme === "aurora-glass") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-purple-400/50 text-white transition-all flex items-center justify-between text-left shadow-lg ${animClass}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-lg shrink-0 overflow-hidden">
            {iconElement}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white group-hover:text-purple-200 truncate">{title}</span>
              {isPinned && (
                <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] rounded-md font-bold uppercase">
                  Pin
                </span>
              )}
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-300 truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {clickCount > 0 && (
            <span className="text-[10px] text-purple-300 bg-black/30 px-2 py-0.5 rounded-md font-mono">
              <FaEye size={9} className="inline mr-1" />
              {clickCount}
            </span>
          )}
          <FaExternalLinkAlt className="text-slate-400 group-hover:text-purple-300 text-xs transition" />
        </div>
      </a>
    );
  }

  if (theme === "bento-grid") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-slate-100 transition-all flex items-center justify-between text-left shadow-md ${animClass}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-lg shrink-0 overflow-hidden">
            {iconElement}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white group-hover:text-cyan-300 truncate">{title}</span>
              {isPinned && (
                <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] rounded-md font-bold uppercase">
                  Pin
                </span>
              )}
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-400 truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {clickCount > 0 && (
            <span className="text-[10px] text-cyan-400 bg-black/40 px-2 py-0.5 rounded-md font-mono">
              <FaEye size={9} className="inline mr-1" />
              {clickCount}
            </span>
          )}
          <FaExternalLinkAlt className="text-slate-400 group-hover:text-cyan-400 text-xs transition" />
        </div>
      </a>
    );
  }

  if (theme === "sunset-glow") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onLinkClick?.(link)}
        style={customStyle}
        className={`group w-full p-4 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/20 hover:border-amber-400/50 text-amber-50 transition-all flex items-center justify-between text-left shadow-md ${animClass}`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-lg shrink-0 overflow-hidden">
            {iconElement}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-amber-50 group-hover:text-amber-200 truncate">{title}</span>
              {isPinned && (
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] rounded-md font-bold uppercase">
                  Pin
                </span>
              )}
            </div>
            {subtitle && (
              <div className="text-[11px] text-rose-200/80 truncate">{subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {clickCount > 0 && (
            <span className="text-[10px] text-amber-300 bg-black/40 px-2 py-0.5 rounded-md font-mono">
              <FaEye size={9} className="inline mr-1" />
              {clickCount}
            </span>
          )}
          <FaExternalLinkAlt className="text-rose-300/60 group-hover:text-amber-300 text-xs transition" />
        </div>
      </a>
    );
  }

  // Fallback: Cyber Dark Classic
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick?.(link)}
      style={customStyle}
      className={`group w-full p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-emerald-500/50 transition-all duration-200 flex items-center justify-between shadow-lg text-left relative ${animClass}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg shrink-0 transition overflow-hidden">
          {iconElement}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white group-hover:text-emerald-300 transition truncate">
              {title}
            </span>
            {isPinned && (
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] rounded-md font-bold uppercase">
                Pin
              </span>
            )}
          </div>
          {subtitle && (
            <div className="text-[11px] text-slate-400 group-hover:text-slate-300 truncate">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {clickCount > 0 && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded-md font-mono">
            <FaEye size={9} /> {clickCount}
          </span>
        )}
        <FaExternalLinkAlt className="text-slate-400 group-hover:text-emerald-400 text-xs transition" />
      </div>
    </a>
  );
};

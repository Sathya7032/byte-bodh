import React, { useState } from "react";
import { resolveImageUrl } from "../api/portfolioApiService";
import { getPortfolioUrl } from "../config/api";
import {
  FaGlobe,
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
  FaCopy,
  FaCheck,
  FaTimes,
  FaWhatsapp,
  FaHeart,
  FaCoffee,
  FaPhone,
  FaLock,
  FaThumbtack,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import { getLinktreeTheme } from "./linktreeThemes";

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
 * Portfolio website link, styled as a regular link button of the active theme.
 * `templateStyle` is the legacy prop ("dark" | "light" | "brutalist").
 */
const LEGACY_STYLE_TO_THEME = { dark: "cyber-dark", light: "minimal-ivory", brutalist: "neo-brutalist" };

export const PortfolioJumpBanner = ({ username, theme, templateStyle = "dark" }) => {
  const portfolioUrl = getPortfolioUrl(username);
  if (!portfolioUrl) return null;

  let host = portfolioUrl;
  try {
    host = new URL(portfolioUrl).host;
  } catch (e) {
    // keep raw url
  }

  return (
    <LinktreeLinkCard
      theme={theme || LEGACY_STYLE_TO_THEME[templateStyle] || "cyber-dark"}
      link={{ id: "portfolio-website", title: "View my portfolio", subtitle: host, url: portfolioUrl, platform: "website" }}
    />
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
 * Universal link card. Renders every LinktreeLink type in the active theme's single style:
 * - type: CLASSIC, HEADER, FEATURED_HERO, CONTACT_FORM, PAYMENT_DONATION
 * - platform icon / thumbnail image
 * - animation: NONE, PULSE, BOUNCE, GLOW, SHAKE, POP
 * - buttonColor, textColor overrides
 * - isPinned, isFeatured, isSensitive (confirmation gate)
 *
 * `layout="tile"` renders a square tile (used by the Bento Grid template).
 */
const hashString = (value) => {
  const str = String(value ?? "");
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const getAnimationClass = (animation) => {
  switch (animation) {
    case "PULSE":
      return "animate-soft-pulse";
    case "BOUNCE":
      return "hover:-translate-y-1";
    case "SHAKE":
      return "hover:animate-wiggle";
    case "POP":
      return "hover:scale-[1.03] active:scale-[0.98]";
    default:
      return "hover:scale-[1.015] active:scale-[0.99]";
  }
};

export const LinktreeLinkCard = ({ link, theme = "cyber-dark", onLinkClick, layout = "row" }) => {
  const [sensitiveRevealed, setSensitiveRevealed] = useState(false);

  if (!link) return null;

  const t = getLinktreeTheme(theme);
  const {
    id,
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
  } = link;

  const isPill = t.radius === "rounded-full";
  const blockRadius = isPill ? "rounded-3xl" : t.radius;
  const iconRadius = isPill ? "rounded-full" : t.radius === "rounded-xl" ? "rounded-lg" : "rounded-xl";

  const customStyle = {};
  if (buttonColor) customStyle.backgroundColor = buttonColor;
  if (textColor) customStyle.color = textColor;
  if (animation === "GLOW") {
    const glow = t.accent || "#10B981";
    customStyle.boxShadow = `0 0 0 2px ${glow}66, 0 0 26px ${glow}55`;
  }

  const animClass = getAnimationClass(animation);
  const fill = t.fills ? t.fills[hashString(id ?? title) % t.fills.length] : "";

  const resolvedThumb = thumbnailUrl ? resolveImageUrl(thumbnailUrl) : null;
  const fallbackIcon =
    type === "PAYMENT_DONATION" && (!platform || platform === "CUSTOM") ? (
      <FaHeart />
    ) : type === "CONTACT_FORM" && (!platform || platform === "CUSTOM") ? (
      <FaEnvelope />
    ) : (
      getSocialIcon(platform || title)
    );
  const iconElement = resolvedThumb ? (
    <img src={resolvedThumb} alt="" className="w-full h-full object-cover" />
  ) : (
    fallbackIcon
  );

  const handleClick = () => onLinkClick?.(link);
  const trailing = isPinned ? (
    <FaThumbtack size={12} className={t.arrow} title="Pinned" />
  ) : (
    <FiArrowUpRight
      size={18}
      className={`${t.arrow} opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`}
    />
  );

  // 1. Sensitive content gate
  if (isSensitive && !sensitiveRevealed) {
    return (
      <div className={`w-full p-5 ${blockRadius} ${t.gate} text-center flex flex-col items-center gap-2`}>
        <FaLock size={14} className="opacity-70" />
        <p className="text-sm font-semibold">Sensitive content</p>
        <p className="text-xs opacity-65 max-w-xs leading-relaxed">
          This link may contain content that isn't suitable for everyone.
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSensitiveRevealed(true);
          }}
          className={`mt-1 px-5 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${t.gateButton}`}
        >
          Continue
        </button>
      </div>
    );
  }

  // 2. Section header
  if (type === "HEADER") {
    return (
      <div className="w-full pt-5 pb-1 text-center">
        <h3 className={`text-sm font-semibold tracking-wide ${t.header}`}>{title}</h3>
        {subtitle && <p className={`text-xs mt-1 opacity-70 ${t.header}`}>{subtitle}</p>}
      </div>
    );
  }

  // 3. Featured card with large media
  if (type === "FEATURED_HERO" || isFeatured) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        style={customStyle}
        className={`group block w-full overflow-hidden text-left transition-all duration-200 ${blockRadius} ${t.featured} ${animClass}`}
      >
        {resolvedThumb && (
          <div className={`w-full aspect-[16/9] overflow-hidden ${t.featuredMedia}`}>
            <img
              src={resolvedThumb}
              alt=""
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        )}
        <div className="flex items-center gap-3 p-4">
          {!resolvedThumb && (
            <span className={`w-12 h-12 ${iconRadius} flex items-center justify-center text-xl shrink-0 ${t.icon}`}>
              {fallbackIcon}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] opacity-55">Featured</span>
            <h4 className="text-base font-semibold leading-snug line-clamp-2 mt-0.5">{title}</h4>
            {subtitle && <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${t.subText}`}>{subtitle}</p>}
          </div>
          <span className="shrink-0">{trailing}</span>
        </div>
      </a>
    );
  }

  // 4. Square tile (Bento Grid)
  if (layout === "tile") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        style={customStyle}
        className={`group relative w-full h-full min-h-[150px] p-4 flex flex-col justify-between gap-4 text-left transition-all duration-200 ${t.radius} ${fill} ${t.button} ${animClass}`}
      >
        <div className="flex items-start justify-between">
          <span className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg overflow-hidden shrink-0 ${t.icon}`}>
            {iconElement}
          </span>
          {isPinned ? (
            <FaThumbtack size={12} className={t.arrow} />
          ) : (
            <FiArrowUpRight size={18} className={`${t.arrow} group-hover:text-white transition`} />
          )}
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-semibold leading-snug line-clamp-2">{title}</span>
          {subtitle && <span className={`block text-xs mt-1 line-clamp-2 ${t.subText}`}>{subtitle}</span>}
        </div>
      </a>
    );
  }

  // 5. Classic / contact / payment button row
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={customStyle}
      className={`group relative w-full min-h-[60px] p-2 flex items-center gap-2 transition-all duration-200 ${t.radius} ${fill} ${t.button} ${animClass}`}
    >
      <span className={`w-11 h-11 ${iconRadius} flex items-center justify-center text-lg overflow-hidden shrink-0 ${t.icon}`}>
        {iconElement}
      </span>
      <span className="flex-1 min-w-0 text-center px-1">
        <span className="block text-[15px] font-semibold leading-snug line-clamp-2">{title}</span>
        {subtitle && <span className={`block text-xs mt-0.5 truncate ${t.subText}`}>{subtitle}</span>}
      </span>
      <span className="w-11 h-11 shrink-0 flex items-center justify-center">{trailing}</span>
    </a>
  );
};

import React from "react";
import { resolveImageUrl } from "../api/portfolioApiService";
import { FaShareAlt, FaCheckCircle, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { LinktreeLinkCard, PortfolioJumpBanner, getSocialIcon, isLinkScheduledVisible, sortLinks } from "./LinktreeCard";

/** Normalised profile data shared by every template. */
export const getLinktreeProfile = (user, links = [], fallbackAccent = "#10B981") => {
  const username = user?.username || "creator";
  const name = user?.fullName || username;
  return {
    username,
    name,
    initial: name.charAt(0).toUpperCase(),
    avatar: resolveImageUrl(user?.avatarUrl || user?.pictureUrl),
    banner: resolveImageUrl(user?.bannerUrl),
    accent: user?.themeAccentColor || fallbackAccent,
    verified: Boolean(user?.hasActiveSubscription || user?.isProfilePublic),
    visibleLinks: sortLinks((links || []).filter(isLinkScheduledVisible)),
  };
};

export const Avatar = ({ src, name, initial, className = "", style }) => (
  <div className={`overflow-hidden flex items-center justify-center shrink-0 ${className}`} style={style}>
    {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <span>{initial}</span>}
  </div>
);

export const VerifiedTick = ({ show, className = "", style }) =>
  show ? <FaCheckCircle className={`shrink-0 ${className}`} style={style} title="Verified" aria-label="Verified" /> : null;

export const ShareButton = ({ onShare, className = "" }) =>
  onShare ? (
    <button
      type="button"
      onClick={onShare}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition cursor-pointer ${className}`}
      title="Share"
      aria-label="Share profile"
    >
      <FaShareAlt size={14} />
    </button>
  ) : null;

export const SocialIcons = ({ socialLinks = [], className = "", itemClassName = "" }) =>
  socialLinks.length > 0 ? (
    <div className={`flex flex-wrap items-center justify-center ${className}`}>
      {socialLinks.map((s, idx) => (
        <a
          key={s.id || idx}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          title={s.title || s.platform}
          aria-label={s.title || s.platform}
          className={`flex items-center justify-center transition ${itemClassName}`}
        >
          {getSocialIcon(s.platform || s.title)}
        </a>
      ))}
    </div>
  ) : null;

export const ProfileMeta = ({ user, className = "", itemClassName = "" }) => {
  if (!user?.location && !user?.contactEmail) return null;
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 ${className}`}>
      {user?.location && (
        <span className={`inline-flex items-center gap-1.5 ${itemClassName}`}>
          <FaMapMarkerAlt size={11} /> {user.location}
        </span>
      )}
      {user?.contactEmail && (
        <a href={`mailto:${user.contactEmail}`} className={`inline-flex items-center gap-1.5 hover:underline ${itemClassName}`}>
          <FaEnvelope size={11} /> {user.contactEmail}
        </a>
      )}
    </div>
  );
};

/** Vertical stack of links: portfolio link first, then the user's links. */
export const LinkStack = ({ username, links, theme, onLinkClick, emptyClassName = "", className = "" }) => (
  <div className={`w-full space-y-3 ${className}`}>
    <PortfolioJumpBanner username={username} theme={theme} />
    {links.length === 0 ? (
      <p className={`text-center text-sm py-6 ${emptyClassName}`}>No links yet.</p>
    ) : (
      links.map((link) => <LinktreeLinkCard key={link.id} link={link} theme={theme} onLinkClick={onLinkClick} />)
    )}
  </div>
);

export const PoweredBy = ({ className = "" }) => (
  <a href="/" className={`inline-flex items-center gap-2 text-xs font-semibold transition ${className}`}>
    <span className="w-5 h-5 rounded-md bg-emerald-500 text-[9px] font-black text-white flex items-center justify-center">BB</span>
    ByteBodh
  </a>
);

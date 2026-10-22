import React from "react";
import { resolveImageUrl } from "../api/portfolioApiService";
import {
  LinktreeLinkCard,
  PortfolioJumpBanner,
  getSocialIcon,
  isLinkScheduledVisible,
  sortLinks,
} from "./LinktreeCard";
import {
  FaShareAlt,
  FaStar,
  FaMapPin,
  FaEnvelope,
} from "react-icons/fa";

/**
 * LINKTREE TEMPLATE 4: AURORA GLASS (Frosted Acrylic Iridescent)
 * Frosted acrylic glass cards with floating ambient iridescent gradients and glowing accents.
 */
export const LinktreeTemplateFour = ({
  user,
  links = [],
  socialLinks = [],
  onLinkClick,
  onShare,
}) => {
  const username = user?.username || "creator";
  const avatar = resolveImageUrl(user?.avatarUrl || user?.pictureUrl);
  const banner = resolveImageUrl(user?.bannerUrl);

  const visibleLinks = sortLinks(links.filter(isLinkScheduledVisible));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Floating Aurora Glow Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-indigo-500/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top share bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 z-10">
        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          Aurora Bio
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition cursor-pointer"
            title="Share Profile"
          >
            <FaShareAlt size={14} />
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 z-10">
        {/* Avatar with optional banner */}
        <div className="relative w-full flex flex-col items-center">
          {banner && (
            <div className="w-full h-28 rounded-2xl overflow-hidden mb-[-44px] shadow-2xl border border-white/20 backdrop-blur-md">
              <img
                src={banner}
                alt="Cover"
                className="w-full h-full object-cover opacity-75"
              />
            </div>
          )}

          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-indigo-400 to-pink-500 shadow-2xl shadow-indigo-500/40 backdrop-blur-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900/80 border-2 border-white/30 flex items-center justify-center text-3xl font-black">
              {avatar ? (
                <img
                  src={avatar}
                  alt={user?.fullName || username}
                  className="w-full h-full object-cover"
                />
              ) : (
                (user?.fullName || username).charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </div>

        {/* Identity Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-black tracking-tight">
              {user?.fullName || username}
            </h1>
            <FaStar className="text-amber-300 text-sm animate-pulse" />
          </div>
          <p className="text-xs text-indigo-300 font-bold">@{username}</p>
          {user?.headline && (
            <p className="text-sm text-slate-200 font-medium max-w-sm pt-0.5 leading-snug">
              {user.headline}
            </p>
          )}
          {user?.bio && (
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed pt-1">
              {user.bio}
            </p>
          )}

          {/* Quick info chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-300">
            {user?.location && (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <FaMapPin className="text-indigo-400" /> {user.location}
              </span>
            )}
            {user?.contactEmail && (
              <a
                href={`mailto:${user.contactEmail}`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-slate-200 transition"
              >
                <FaEnvelope className="text-indigo-400" /> {user.contactEmail}
              </a>
            )}
          </div>
        </div>

        {/* Social Icons Dock */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {socialLinks.map((s, idx) => (
              <a
                key={s.id || idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 active:scale-95 transition-all text-base shadow-sm"
                title={s.title || s.platform}
              >
                {getSocialIcon(s.platform || s.title)}
              </a>
            ))}
          </div>
        )}

        {/* Direct Portfolio Website Jump Banner */}
        <PortfolioJumpBanner username={username} templateStyle="dark" />

        {/* Bio Links Stack */}
        <div className="w-full space-y-3 pt-2">
          {visibleLinks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-300 text-xs">
              No bio links added yet.
            </div>
          ) : (
            visibleLinks.map((link) => (
              <LinktreeLinkCard
                key={link.id}
                link={link}
                theme="aurora-glass"
                onLinkClick={onLinkClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full max-w-md pt-12 pb-4 text-center z-10">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white">
            BB
          </div>
          <span>Powered by ByteBodh Linktree</span>
        </a>
      </div>
    </div>
  );
};

export default LinktreeTemplateFour;

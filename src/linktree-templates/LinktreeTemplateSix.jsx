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
  FaMapPin,
  FaEnvelope,
} from "react-icons/fa";

/**
 * LINKTREE TEMPLATE 6: SUNSET GLOW (Rich Dusk Twilight & Golden Amber)
 * Warm dusk gradients with golden amber buttons, luxury accents & cinematic mood.
 */
export const LinktreeTemplateSix = ({
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
    <div className="min-h-screen bg-gradient-to-b from-[#180828] via-[#2A0E3C] to-[#120420] text-white flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-rose-500/30 relative overflow-hidden">
      {/* Ambient dusk gradient orbs */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-600/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Top share bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 z-10">
        <div className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Sunset Bio
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-amber-200 hover:text-white transition cursor-pointer"
            title="Share Profile"
          >
            <FaShareAlt size={14} />
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 z-10">
        {/* Avatar */}
        <div className="relative w-full flex flex-col items-center">
          {banner && (
            <div className="w-full h-28 rounded-2xl overflow-hidden mb-[-44px] shadow-2xl border border-rose-500/20">
              <img
                src={banner}
                alt=""
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          )}

          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-2xl shadow-rose-500/30">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-slate-950 flex items-center justify-center text-3xl font-black">
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
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 bg-clip-text text-transparent">
            {user?.fullName || username}
          </h1>
          <p className="text-xs text-rose-300 font-bold">@{username}</p>
          {user?.headline && (
            <p className="text-sm text-slate-200 font-medium max-w-sm pt-0.5 leading-snug">
              {user.headline}
            </p>
          )}
          {user?.bio && (
            <p className="text-xs text-rose-100/70 max-w-xs leading-relaxed pt-1">
              {user.bio}
            </p>
          )}

          {/* Quick info chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-rose-200">
            {user?.location && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <FaMapPin className="text-amber-400" /> {user.location}
              </span>
            )}
            {user?.contactEmail && (
              <a
                href={`mailto:${user.contactEmail}`}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 text-rose-100 transition"
              >
                <FaEnvelope className="text-amber-400" /> {user.contactEmail}
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
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rose-500/20 border border-white/15 flex items-center justify-center text-amber-200 hover:text-white transition-all text-base shadow-sm"
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
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-rose-200/60 text-xs">
              No bio links added yet.
            </div>
          ) : (
            visibleLinks.map((link) => (
              <LinktreeLinkCard
                key={link.id}
                link={link}
                theme="sunset-glow"
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-rose-200/80 hover:text-white transition"
        >
          <div className="w-4 h-4 rounded bg-gradient-to-r from-amber-400 to-rose-500 flex items-center justify-center text-[10px] font-black text-slate-950">
            BB
          </div>
          <span>Powered by ByteBodh Linktree</span>
        </a>
      </div>
    </div>
  );
};

export default LinktreeTemplateSix;

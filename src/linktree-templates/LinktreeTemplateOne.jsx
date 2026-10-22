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
  FaCheckCircle,
  FaCrown,
  FaMapPin,
  FaEnvelope,
} from "react-icons/fa";

/**
 * LINKTREE TEMPLATE 1: CYBER DARK (Obsidian Neon Glow)
 * Deep obsidian dark with glowing emerald/teal neon accents & glassmorphic cards.
 */
export const LinktreeTemplateOne = ({
  user,
  links = [],
  socialLinks = [],
  onLinkClick,
  onShare,
}) => {
  const username = user?.username || "creator";
  const avatar = resolveImageUrl(user?.avatarUrl || user?.pictureUrl);
  const banner = resolveImageUrl(user?.bannerUrl);
  const accentColor = user?.themeAccentColor || "#10B981";

  const visibleLinks = sortLinks(links.filter(isLinkScheduledVisible));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070B14] via-[#0C1222] to-[#070B14] text-white flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top share bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 z-10">
        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          ByteBodh Folio Bio
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 hover:text-white transition shadow-sm cursor-pointer"
            title="Share Profile"
          >
            <FaShareAlt size={14} />
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 z-10">
        {/* Profile Avatar Card with Optional Banner */}
        <div className="relative w-full flex flex-col items-center">
          {banner && (
            <div className="w-full h-28 rounded-2xl overflow-hidden mb-[-44px] shadow-lg border border-slate-800">
              <img
                src={banner}
                alt="Cover"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1222] via-transparent to-transparent" />
            </div>
          )}

          {/* Glowing Avatar Frame */}
          <div className="relative group">
            <div
              className="w-24 h-24 rounded-full p-1 shadow-2xl transition duration-500"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #2DD4BF)`,
                boxShadow: `0 0 35px ${accentColor}40`,
              }}
            >
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
            {(user?.hasActiveSubscription || user?.isProfilePublic) && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-slate-950">
                <FaCheckCircle size={12} />
              </div>
            )}
          </div>
        </div>

        {/* Identity Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {user?.fullName || username}
            </h1>
            {user?.hasActiveSubscription && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <FaCrown size={9} /> PRO
              </span>
            )}
          </div>
          <p className="text-xs text-emerald-400 font-bold">@{username}</p>
          {user?.headline && (
            <p className="text-sm text-slate-300 font-medium max-w-sm pt-0.5 leading-snug">
              {user.headline}
            </p>
          )}
          {user?.bio && (
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed pt-1">
              {user.bio}
            </p>
          )}

          {/* Quick info chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-semibold text-slate-400">
            {user?.location && (
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <FaMapPin className="text-emerald-400" /> {user.location}
              </span>
            )}
            {user?.contactEmail && (
              <a
                href={`mailto:${user.contactEmail}`}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/10 text-slate-300 transition"
              >
                <FaEnvelope className="text-emerald-400" /> Email
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
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:scale-110 active:scale-95 transition-all text-base shadow-sm"
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
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs">
              No bio links added yet.
            </div>
          ) : (
            visibleLinks.map((link) => (
              <LinktreeLinkCard
                key={link.id}
                link={link}
                theme="cyber-dark"
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-[10px] font-black text-slate-950">
            BB
          </div>
          <span>Powered by ByteBodh Linktree</span>
        </a>
      </div>
    </div>
  );
};

export default LinktreeTemplateOne;

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
  FaMapPin,
  FaEnvelope,
} from "react-icons/fa";

/**
 * LINKTREE TEMPLATE 5: BENTO GRID (Modular Apple Bento Blocks)
 * Modern Apple-inspired modular Bento card blocks with stats, chips & high-utility layout.
 */
export const LinktreeTemplateFive = ({
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-cyan-500/20">
      {/* Top share bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-5">
        <div className="text-xs font-black tracking-tight flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Bento Bio / @{username}</span>
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
            title="Share Profile"
          >
            <FaShareAlt size={13} />
          </button>
        )}
      </div>

      {/* Main Bento Blocks Container */}
      <div className="w-full max-w-md space-y-4">
        {/* BENTO CARD 1: HERO PROFILE BLOCK */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl overflow-hidden relative text-left">
          {banner && (
            <div className="absolute inset-0 h-24 overflow-hidden">
              <img
                src={banner}
                alt=""
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>
          )}

          <div className="relative z-10 flex items-center gap-4 pt-2">
            <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md bg-slate-800 shrink-0 flex items-center justify-center text-2xl font-black">
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                (user?.fullName || username).charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-black truncate">
                  {user?.fullName || username}
                </h1>
                <FaCheckCircle className="text-cyan-400 text-xs shrink-0" />
              </div>
              <p className="text-xs text-cyan-400 font-bold">@{username}</p>
              {user?.headline && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {user.headline}
                </p>
              )}
            </div>
          </div>

          {user?.bio && (
            <p className="relative z-10 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Quick info tags */}
          {(user?.location || user?.contactEmail) && (
            <div className="relative z-10 flex items-center gap-2 mt-3 pt-2 text-[11px] text-slate-400">
              {user?.location && (
                <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700/50">
                  <FaMapPin size={9} className="text-cyan-400" /> {user.location}
                </span>
              )}
              {user?.contactEmail && (
                <a
                  href={`mailto:${user.contactEmail}`}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-700/50 transition text-slate-300"
                >
                  <FaEnvelope size={9} className="text-cyan-400" /> Email
                </a>
              )}
            </div>
          )}
        </div>

        {/* BENTO CARD 2: SOCIAL DOCK */}
        {socialLinks.length > 0 && (
          <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 flex items-center justify-around">
            {socialLinks.map((s, idx) => (
              <a
                key={s.id || idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition"
                title={s.title || s.platform}
              >
                {getSocialIcon(s.platform || s.title)}
              </a>
            ))}
          </div>
        )}

        {/* Direct Portfolio Website Jump Banner */}
        <PortfolioJumpBanner username={username} templateStyle="dark" />

        {/* BENTO BIO LINKS LIST */}
        <div className="space-y-3 pt-1">
          {visibleLinks.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs text-center">
              No bio links added yet.
            </div>
          ) : (
            visibleLinks.map((link) => (
              <LinktreeLinkCard
                key={link.id}
                link={link}
                theme="bento-grid"
                onLinkClick={onLinkClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full max-w-md pt-10 pb-4 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <div className="w-4 h-4 rounded bg-cyan-400 flex items-center justify-center text-[10px] font-black text-slate-950">
            BB
          </div>
          <span>Powered by ByteBodh Linktree</span>
        </a>
      </div>
    </div>
  );
};

export default LinktreeTemplateFive;

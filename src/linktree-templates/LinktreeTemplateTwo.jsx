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
 * LINKTREE TEMPLATE 2: MINIMAL IVORY (Clean White & Editorial)
 * Crisp white minimalist aesthetic with refined slate typography and calm spatial balance.
 */
export const LinktreeTemplateTwo = ({
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-slate-200">
      {/* Top share bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
          @{username}
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="p-2.5 bg-white hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition shadow-xs border border-slate-200 cursor-pointer"
            title="Share Profile"
          >
            <FaShareAlt size={14} />
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
        {/* Avatar with optional banner */}
        <div className="relative w-full flex flex-col items-center">
          {banner && (
            <div className="w-full h-24 rounded-2xl overflow-hidden mb-[-36px] border border-slate-200 shadow-xs">
              <img
                src={banner}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="w-24 h-24 rounded-3xl p-1 bg-white border border-slate-200 shadow-md">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-700">
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
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {user?.fullName || username}
            </h1>
            <FaCheckCircle className="text-emerald-600 text-sm" />
          </div>
          {user?.headline && (
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {user.headline}
            </p>
          )}
          {user?.bio && (
            <p className="text-xs text-slate-600 max-w-xs leading-relaxed pt-1">
              {user.bio}
            </p>
          )}

          {/* Quick info chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-500">
            {user?.location && (
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                <FaMapPin className="text-slate-400" /> {user.location}
              </span>
            )}
            {user?.contactEmail && (
              <a
                href={`mailto:${user.contactEmail}`}
                className="flex items-center gap-1 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-slate-700 transition shadow-2xs"
              >
                <FaEnvelope className="text-slate-400" /> {user.contactEmail}
              </a>
            )}
          </div>
        </div>

        {/* Social Icons Dock */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {socialLinks.map((s, idx) => (
              <a
                key={s.id || idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 flex items-center justify-center transition-all text-sm shadow-2xs"
                title={s.title || s.platform}
              >
                {getSocialIcon(s.platform || s.title)}
              </a>
            ))}
          </div>
        )}

        {/* Direct Portfolio Website Jump Banner */}
        <PortfolioJumpBanner username={username} templateStyle="light" />

        {/* Bio Links Stack */}
        <div className="w-full space-y-3 pt-2">
          {visibleLinks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs">
              No bio links added yet.
            </div>
          ) : (
            visibleLinks.map((link) => (
              <LinktreeLinkCard
                key={link.id}
                link={link}
                theme="minimal-ivory"
                onLinkClick={onLinkClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full max-w-md pt-12 pb-4 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-900 transition shadow-2xs"
        >
          <div className="w-4 h-4 rounded bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
            BB
          </div>
          <span>Powered by ByteBodh Linktree</span>
        </a>
      </div>
    </div>
  );
};

export default LinktreeTemplateTwo;

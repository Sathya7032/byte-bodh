import React from "react";
import { resolveImageUrl } from "../api/portfolioApiService";
import {
  LinktreeLinkCard,
  PortfolioJumpBanner,
  getSocialIcon,
  isLinkScheduledVisible,
  sortLinks,
} from "./LinktreeCard";
import { FaShareAlt } from "react-icons/fa";

/**
 * LINKTREE TEMPLATE 3: NEO BRUTALIST (Retro Bold Pop)
 * Bold high-contrast pop aesthetic with #FEF08A canvas, solid black 3px borders & hard offset shadows.
 */
export const LinktreeTemplateThree = ({
  user,
  links = [],
  socialLinks = [],
  onLinkClick,
  onShare,
}) => {
  const username = user?.username || "creator";
  const avatar = resolveImageUrl(user?.avatarUrl || user?.pictureUrl);

  const visibleLinks = sortLinks(links.filter(isLinkScheduledVisible));

  return (
    <div className="min-h-screen bg-[#FEF08A] text-black flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-black selection:text-[#FEF08A]">
      {/* Top share bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="px-3.5 py-1 bg-black text-[#FEF08A] font-black uppercase text-xs rounded-lg shadow-[3px_3px_0px_#000]">
          @{username}
        </div>
        {onShare && (
          <button
            onClick={onShare}
            className="p-2.5 bg-white border-2 border-black rounded-xl text-black hover:bg-black hover:text-white transition shadow-[3px_3px_0px_#000] cursor-pointer"
            title="Share Profile"
          >
            <FaShareAlt size={14} />
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-2xl bg-white border-3 border-black shadow-[5px_5px_0px_#000] overflow-hidden flex items-center justify-center text-4xl font-black">
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

        {/* Identity Details */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">
            {user?.fullName || username}
          </h1>
          {user?.headline && (
            <span className="inline-block px-3 py-1 bg-white border-2 border-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_#000]">
              {user.headline}
            </span>
          )}
          {user?.bio && (
            <p className="text-xs font-bold max-w-xs leading-relaxed pt-1">
              {user.bio}
            </p>
          )}

          {/* Quick info chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-black">
            {user?.location && (
              <span className="flex items-center gap-1 bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                📍 {user.location}
              </span>
            )}
            {user?.contactEmail && (
              <a
                href={`mailto:${user.contactEmail}`}
                className="flex items-center gap-1 bg-white hover:bg-black hover:text-white px-3 py-1 border-2 border-black transition shadow-[2px_2px_0px_#000]"
              >
                ✉️ {user.contactEmail}
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
                className="w-10 h-10 rounded-xl bg-white text-black border-2 border-black flex items-center justify-center hover:bg-black hover:text-[#FEF08A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-base shadow-[3px_3px_0px_#000]"
                title={s.title || s.platform}
              >
                {getSocialIcon(s.platform || s.title)}
              </a>
            ))}
          </div>
        )}

        {/* Direct Portfolio Website Jump Banner */}
        <PortfolioJumpBanner username={username} templateStyle="brutalist" />

        {/* Bio Links Stack */}
        <div className="w-full space-y-3 pt-2">
          {visibleLinks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border-3 border-black text-black font-bold text-xs shadow-[4px_4px_0px_#000]">
              No bio links added yet.
            </div>
          ) : (
            visibleLinks.map((link) => (
              <LinktreeLinkCard
                key={link.id}
                link={link}
                theme="neo-brutalist"
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition"
        >
          <div className="w-4 h-4 rounded bg-[#FEF08A] border border-black flex items-center justify-center text-[10px] font-black text-black">
            BB
          </div>
          <span>Powered by ByteBodh Linktree</span>
        </a>
      </div>
    </div>
  );
};

export default LinktreeTemplateThree;

import React from "react";
import { getLinktreeProfile, Avatar, VerifiedTick, ShareButton, SocialIcons, ProfileMeta, LinkStack, PoweredBy } from "./LinktreeParts";

/**
 * LINKTREE TEMPLATE 1: CYBER DARK
 * Obsidian background with a soft accent glow, solid dark pill buttons.
 */
export const LinktreeTemplateOne = ({ user, links = [], socialLinks = [], onLinkClick, onShare }) => {
  const p = getLinktreeProfile(user, links, "#10B981");

  return (
    <div className="min-h-screen w-full bg-[#0B0D10] text-white relative overflow-hidden font-sans">
      <div
        className="absolute inset-x-0 top-0 h-[460px] pointer-events-none"
        style={{ background: `radial-gradient(60% 70% at 50% 0%, ${p.accent}33 0%, transparent 70%)` }}
      />

      <main className="relative mx-auto w-full max-w-[580px] px-4 pt-14 pb-10 flex flex-col items-center">
        <ShareButton onShare={onShare} className="absolute top-4 right-4 bg-white/[0.06] hover:bg-white/[0.12] text-white/80" />

        <Avatar
          src={p.avatar}
          name={p.name}
          initial={p.initial}
          className="w-24 h-24 rounded-full bg-[#16191F] text-3xl font-bold ring-1 ring-white/10"
          style={{ boxShadow: `0 0 0 4px #0B0D10, 0 0 0 5px ${p.accent}80` }}
        />

        <div className="mt-5 flex items-center gap-1.5">
          <h1 className="text-xl font-bold tracking-tight">{p.name}</h1>
          <VerifiedTick show={p.verified} className="text-[15px]" />
        </div>
        <p className="text-sm text-white/45 mt-0.5">@{p.username}</p>
        {user?.headline && <p className="text-sm text-white/80 font-medium text-center mt-3 max-w-sm">{user.headline}</p>}
        {user?.bio && <p className="text-sm text-white/55 text-center mt-2 max-w-sm leading-relaxed">{user.bio}</p>}
        <ProfileMeta user={user} className="mt-3 text-xs text-white/45" />

        <SocialIcons
          socialLinks={socialLinks}
          className="gap-5 mt-5"
          itemClassName="text-[22px] text-white/70 hover:text-white hover:-translate-y-0.5"
        />

        <LinkStack
          username={p.username}
          links={p.visibleLinks}
          theme="cyber-dark"
          onLinkClick={onLinkClick}
          className="mt-8"
          emptyClassName="text-white/40"
        />

        <PoweredBy className="mt-12 text-white/40 hover:text-white/80" />
      </main>
    </div>
  );
};

export default LinktreeTemplateOne;

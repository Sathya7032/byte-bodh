import React from "react";
import { getLinktreeProfile, Avatar, VerifiedTick, ShareButton, SocialIcons, ProfileMeta, LinkStack, PoweredBy } from "./LinktreeParts";

/**
 * LINKTREE TEMPLATE 4: AURORA GLASS
 * Soft blurred colour field with frosted glass buttons.
 */
export const LinktreeTemplateFour = ({ user, links = [], socialLinks = [], onLinkClick, onShare }) => {
  const p = getLinktreeProfile(user, links, "#A78BFA");

  return (
    <div className="min-h-screen w-full bg-[#24124A] text-white relative overflow-hidden font-sans">
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#7C3AED] blur-[110px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full bg-[#EC4899] blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] rounded-full bg-[#0EA5E9] blur-[120px] opacity-40 pointer-events-none" />

      <main className="relative mx-auto w-full max-w-[580px] px-4 pt-14 pb-10 flex flex-col items-center">
        <ShareButton
          onShare={onShare}
          className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/25 text-white"
        />

        <Avatar
          src={p.avatar}
          name={p.name}
          initial={p.initial}
          className="w-24 h-24 rounded-full bg-white/20 text-3xl font-semibold ring-4 ring-white/25 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
        />

        <div className="mt-5 flex items-center gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{p.name}</h1>
          <VerifiedTick show={p.verified} className="text-[15px] text-white/90" />
        </div>
        <p className="text-sm text-white/60 mt-0.5">@{p.username}</p>
        {user?.headline && <p className="text-sm text-white/90 font-medium text-center mt-3 max-w-sm">{user.headline}</p>}
        {user?.bio && <p className="text-sm text-white/70 text-center mt-2 max-w-sm leading-relaxed">{user.bio}</p>}
        <ProfileMeta user={user} className="mt-3 text-xs text-white/60" />

        <SocialIcons
          socialLinks={socialLinks}
          className="gap-2.5 mt-5"
          itemClassName="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xl border border-white/20 text-lg text-white"
        />

        <LinkStack
          username={p.username}
          links={p.visibleLinks}
          theme="aurora-glass"
          onLinkClick={onLinkClick}
          className="mt-8"
          emptyClassName="text-white/50"
        />

        <PoweredBy className="mt-12 text-white/55 hover:text-white" />
      </main>
    </div>
  );
};

export default LinktreeTemplateFour;

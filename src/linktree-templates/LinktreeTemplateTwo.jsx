import React from "react";
import { getLinktreeProfile, Avatar, VerifiedTick, ShareButton, SocialIcons, ProfileMeta, LinkStack, PoweredBy } from "./LinktreeParts";

/**
 * LINKTREE TEMPLATE 2: MINIMAL IVORY
 * Warm paper background, serif display name, black outline pills that fill on hover.
 */
export const LinktreeTemplateTwo = ({ user, links = [], socialLinks = [], onLinkClick, onShare }) => {
  const p = getLinktreeProfile(user, links, "#111111");

  return (
    <div className="min-h-screen w-full bg-[#F6F4EF] text-[#1A1A1A] font-sans">
      <main className="relative mx-auto w-full max-w-[580px] px-5 pt-6 pb-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-between h-10">
          <span className="text-xs font-medium tracking-wide text-[#1A1A1A]/50">@{p.username}</span>
          <ShareButton onShare={onShare} className="border border-[#1A1A1A]/15 hover:border-[#1A1A1A] text-[#1A1A1A]" />
        </div>

        <Avatar
          src={p.avatar}
          name={p.name}
          initial={p.initial}
          className="mt-8 w-[88px] h-[88px] rounded-full bg-[#ECE9E2] text-3xl font-serif"
        />

        <div className="mt-5 flex items-center gap-2">
          <h1 className="font-serif text-[32px] leading-none tracking-tight">{p.name}</h1>
          <VerifiedTick show={p.verified} className="text-sm text-[#1A1A1A]/70" />
        </div>
        {user?.headline && (
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1A1A1A]/60 text-center max-w-sm">
            {user.headline}
          </p>
        )}
        {user?.bio && <p className="mt-4 text-[15px] text-[#1A1A1A]/70 text-center max-w-sm leading-relaxed">{user.bio}</p>}
        <ProfileMeta user={user} className="mt-3 text-xs text-[#1A1A1A]/50" />

        <SocialIcons
          socialLinks={socialLinks}
          className="gap-5 mt-6"
          itemClassName="text-xl text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
        />

        <div className="w-10 h-px bg-[#1A1A1A]/20 my-8" />

        <LinkStack
          username={p.username}
          links={p.visibleLinks}
          theme="minimal-ivory"
          onLinkClick={onLinkClick}
          emptyClassName="text-[#1A1A1A]/40"
        />

        <PoweredBy className="mt-12 text-[#1A1A1A]/45 hover:text-[#1A1A1A]" />
      </main>
    </div>
  );
};

export default LinktreeTemplateTwo;

import React from "react";
import { getLinktreeProfile, Avatar, VerifiedTick, ShareButton, SocialIcons, ProfileMeta, LinkStack, PoweredBy } from "./LinktreeParts";

/**
 * LINKTREE TEMPLATE 3: NEO BRUTALIST
 * Dotted cream background, a bordered profile card, pastel buttons with hard offset shadows.
 */
export const LinktreeTemplateThree = ({ user, links = [], socialLinks = [], onLinkClick, onShare }) => {
  const p = getLinktreeProfile(user, links, "#000000");

  return (
    <div
      className="min-h-screen w-full bg-[#FFF6E0] text-black font-sans"
      style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.09) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
    >
      <main className="relative mx-auto w-full max-w-[580px] px-4 pt-8 pb-10 flex flex-col items-center">
        <section className="relative w-full bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0_#000] p-5 flex flex-col items-center text-center">
          <ShareButton
            onShare={onShare}
            className="absolute top-3 right-3 bg-[#FDE68A] border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-black"
          />

          <Avatar
            src={p.avatar}
            name={p.name}
            initial={p.initial}
            className="w-24 h-24 rounded-xl border-2 border-black bg-[#A7F3D0] text-4xl font-black"
          />

          <div className="mt-4 flex items-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none">{p.name}</h1>
            <VerifiedTick show={p.verified} className="text-base" />
          </div>
          <span className="mt-2 px-2.5 py-0.5 bg-black text-white text-xs font-bold rounded-md">@{p.username}</span>
          {user?.headline && <p className="mt-3 text-sm font-bold max-w-sm">{user.headline}</p>}
          {user?.bio && <p className="mt-2 text-sm text-black/70 font-medium max-w-sm leading-relaxed">{user.bio}</p>}
          <ProfileMeta user={user} className="mt-3 text-xs font-bold text-black/70" />
        </section>

        <SocialIcons
          socialLinks={socialLinks}
          className="gap-2.5 mt-6"
          itemClassName="w-11 h-11 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-lg text-black"
        />

        <LinkStack
          username={p.username}
          links={p.visibleLinks}
          theme="neo-brutalist"
          onLinkClick={onLinkClick}
          className="mt-7 space-y-4"
          emptyClassName="font-bold text-black/50"
        />

        <PoweredBy className="mt-12 px-3 py-1.5 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0_#000] text-black" />
      </main>
    </div>
  );
};

export default LinktreeTemplateThree;

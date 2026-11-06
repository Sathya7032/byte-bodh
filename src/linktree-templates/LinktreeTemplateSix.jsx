import React from "react";
import { getLinktreeProfile, Avatar, VerifiedTick, ShareButton, SocialIcons, ProfileMeta, LinkStack, PoweredBy } from "./LinktreeParts";

/**
 * LINKTREE TEMPLATE 6: SUNSET GLOW
 * Full-bleed cover photo fading into warm dusk, cream pill buttons.
 */
export const LinktreeTemplateSix = ({ user, links = [], socialLinks = [], onLinkClick, onShare }) => {
  const p = getLinktreeProfile(user, links, "#FB923C");
  const cover = p.banner || p.avatar;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2A130B] via-[#1A0D08] to-[#120806] text-white font-sans">
      <main className="mx-auto w-full max-w-[580px] pb-10 flex flex-col items-center">
        {/* Cover */}
        <section className="relative w-full h-[340px] overflow-hidden sm:rounded-b-[32px]">
          {cover ? (
            <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FDBA74] via-[#F43F5E] to-[#7C2D12] flex items-center justify-center">
              <span className="text-[120px] font-bold text-white/25 leading-none">{p.initial}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#1A0D08]" />

          <ShareButton
            onShare={onShare}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/20"
          />

          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 flex flex-col items-center text-center">
            {p.banner && p.avatar && (
              <Avatar src={p.avatar} name={p.name} initial={p.initial} className="w-16 h-16 rounded-full ring-2 ring-[#FFEBD6] mb-3" />
            )}
            <div className="flex items-center gap-1.5">
              <h1 className="text-3xl font-bold tracking-tight drop-shadow">{p.name}</h1>
              <VerifiedTick show={p.verified} className="text-base text-[#FFD9B8]" />
            </div>
            {user?.headline && <p className="mt-1.5 text-sm text-[#FFD9B8] font-medium max-w-sm">{user.headline}</p>}
          </div>
        </section>

        <div className="w-full px-4 flex flex-col items-center">
          {user?.bio && <p className="mt-4 text-sm text-white/70 text-center max-w-sm leading-relaxed">{user.bio}</p>}
          <ProfileMeta user={user} className="mt-3 text-xs text-white/50" />

          <SocialIcons
            socialLinks={socialLinks}
            className="gap-5 mt-5"
            itemClassName="text-[22px] text-[#FFD9B8]/80 hover:text-[#FFEBD6] hover:-translate-y-0.5"
          />

          <LinkStack
            username={p.username}
            links={p.visibleLinks}
            theme="sunset-glow"
            onLinkClick={onLinkClick}
            className="mt-8"
            emptyClassName="text-white/40"
          />

          <PoweredBy className="mt-12 text-[#FFD9B8]/50 hover:text-[#FFD9B8]" />
        </div>
      </main>
    </div>
  );
};

export default LinktreeTemplateSix;

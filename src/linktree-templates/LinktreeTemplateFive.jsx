import React from "react";
import { getLinktreeProfile, Avatar, VerifiedTick, ShareButton, SocialIcons, ProfileMeta, PoweredBy } from "./LinktreeParts";
import { LinktreeLinkCard, PortfolioJumpBanner } from "./LinktreeCard";

const isWide = (link) => link.type === "HEADER" || link.type === "FEATURED_HERO" || link.isFeatured || link.isSensitive;

/**
 * LINKTREE TEMPLATE 5: BENTO GRID
 * Profile card on top, links laid out as a two-column grid of tiles.
 */
export const LinktreeTemplateFive = ({ user, links = [], socialLinks = [], onLinkClick, onShare }) => {
  const p = getLinktreeProfile(user, links, "#22D3EE");
  const tile = "bg-[#141416] border border-white/[0.07] rounded-3xl";

  return (
    <div className="min-h-screen w-full bg-[#0A0A0B] text-white font-sans">
      <main className="mx-auto w-full max-w-[580px] px-3 sm:px-4 pt-4 pb-10 grid grid-cols-2 grid-flow-row-dense gap-3">
        {/* Profile card */}
        <section className={`col-span-2 relative overflow-hidden ${tile}`}>
          {p.banner ? (
            <div className="h-28 w-full overflow-hidden">
              <img src={p.banner} alt="" className="w-full h-full object-cover opacity-80" />
            </div>
          ) : (
            <div
              className="h-28 w-full"
              style={{ background: `linear-gradient(135deg, ${p.accent}40, transparent 70%)` }}
            />
          )}
          <ShareButton onShare={onShare} className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 backdrop-blur text-white" />

          <div className="relative px-5 pb-5 -mt-10">
            <Avatar
              src={p.avatar}
              name={p.name}
              initial={p.initial}
              className="w-20 h-20 rounded-2xl bg-[#1F1F23] text-2xl font-bold border-4 border-[#141416]"
            />
            <div className="mt-3 flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight">{p.name}</h1>
              <VerifiedTick show={p.verified} className="text-sm" style={{ color: p.accent }} />
            </div>
            <p className="text-sm text-white/45">@{p.username}</p>
            {user?.headline && <p className="mt-3 text-sm text-white/85 font-medium">{user.headline}</p>}
            {user?.bio && <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{user.bio}</p>}
            <ProfileMeta user={user} className="mt-3 !justify-start text-xs text-white/45" />
          </div>
        </section>

        {/* Socials */}
        {socialLinks.length > 0 && (
          <section className={`col-span-2 p-3 ${tile}`}>
            <SocialIcons
              socialLinks={socialLinks}
              className="gap-2 !justify-start"
              itemClassName="w-12 h-12 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-xl text-white/80 hover:text-white"
            />
          </section>
        )}

        <div className="col-span-2">
          <PortfolioJumpBanner username={p.username} theme="bento-grid" />
        </div>

        {p.visibleLinks.length === 0 ? (
          <p className="col-span-2 text-center text-sm text-white/40 py-6">No links yet.</p>
        ) : (
          p.visibleLinks.map((link) => (
            <div key={link.id} className={isWide(link) ? "col-span-2" : "col-span-1"}>
              <LinktreeLinkCard link={link} theme="bento-grid" layout="tile" onLinkClick={onLinkClick} />
            </div>
          ))
        )}

        <div className="col-span-2 flex justify-center mt-8">
          <PoweredBy className="text-white/40 hover:text-white/80" />
        </div>
      </main>
    </div>
  );
};

export default LinktreeTemplateFive;

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TemplateRenderer from "./TemplateRenderer";
import { getMockProfileForTemplate } from "./mockProfiles";
import { getPublicProfileByUsername } from "../api/profileService";
import { resolveImageUrl } from "../api/portfolioApiService";
import PageNotFound from "../pages/PageNotFound";
import { getUsernameFromDomain, getLinktreeUrl } from "../config/api";

function PublicPortfolioPage({ isPreview }) {
  const { username: urlUsername, templateId: previewTemplateId } = useParams();
  const [searchParams] = useSearchParams();
  const isCardThumb = searchParams.get("card") === "true" || searchParams.get("thumb") === "true";

  const [profile, setProfile] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPreview) {
      const tId = Number(previewTemplateId) || 1;
      setTemplateId(tId);
      setProfile(getMockProfileForTemplate(tId));
      setLoading(false);
      return;
    }

    const username = urlUsername || getUsernameFromDomain();

    if (!username) {
      setError("Invalid domain format");
      setLoading(false);
      return;
    }

    getPublicProfileByUsername(username)
      .then((res) => {
        console.log("Fetched public profile data in PublicPortfolioPage:", res.data);
        
        const profileData = res.data?.data || res.data;
        if (!profileData) {
          throw new Error("Profile data not found");
        }

        // Normalize avatar and banner URLs across all templates for seamless rendering
        const rawAvatar = profileData.avatarUrl || profileData.pictureUrl || profileData.photo || profileData.user?.avatarUrl || profileData.user?.pictureUrl || "";
        const resolvedAvatar = resolveImageUrl(rawAvatar);
        profileData.avatarUrl = resolvedAvatar;
        profileData.pictureUrl = resolvedAvatar;
        profileData.photo = resolvedAvatar;

        const rawBanner = profileData.bannerUrl || profileData.user?.bannerUrl || "";
        profileData.bannerUrl = resolveImageUrl(rawBanner);

        // Normalize sub-entity image URLs
        if (Array.isArray(profileData.projects)) {
          profileData.projects = profileData.projects.map((p) => ({
            ...p,
            imageUrl: resolveImageUrl(p.imageUrl || p.image || p.coverImage),
          }));
        }
        if (Array.isArray(profileData.skills)) {
          profileData.skills = profileData.skills.map((s) => ({
            ...s,
            iconUrl: resolveImageUrl(s.iconUrl || s.icon || s.imageUrl),
          }));
        }
        if (Array.isArray(profileData.certifications)) {
          profileData.certifications = profileData.certifications.map((c) => ({
            ...c,
            certificateImageUrl: resolveImageUrl(c.certificateImageUrl || c.imageUrl || c.image),
          }));
        }
        if (Array.isArray(profileData.achievements)) {
          profileData.achievements = profileData.achievements.map((a) => ({
            ...a,
            badgeImageUrl: resolveImageUrl(a.badgeImageUrl || a.imageUrl || a.image),
          }));
        }
        if (Array.isArray(profileData.education)) {
          profileData.education = profileData.education.map((e) => ({
            ...e,
            institutionLogoUrl: resolveImageUrl(e.institutionLogoUrl || e.logoUrl || e.logo),
          }));
        }
        if (Array.isArray(profileData.socialMediaLinks)) {
          profileData.socialMediaLinks = profileData.socialMediaLinks.map((l) => ({
            ...l,
            iconUrl: resolveImageUrl(l.iconUrl || l.icon || l.thumbnailUrl),
          }));
        }

        // Determine active template ID (1 - 18)
        let resolvedTplId = profileData.templateId;
        if (!resolvedTplId && profileData.activeTemplate?.templateCode) {
          const match = String(profileData.activeTemplate.templateCode).match(/\d+/);
          if (match) resolvedTplId = Number(match[0]);
        }
        if (!resolvedTplId && profileData.activeTemplate?.displayOrder) {
          resolvedTplId = profileData.activeTemplate.displayOrder;
        }
        if (!resolvedTplId && profileData.user?.activeTemplateCode) {
          const match = String(profileData.user.activeTemplateCode).match(/\d+/);
          if (match) resolvedTplId = Number(match[0]);
        }
        if (!resolvedTplId && profileData.user?.userTemplates) {
          const activeUserTpl = profileData.user.userTemplates.find(ut => ut.active);
          if (activeUserTpl?.template?.id) resolvedTplId = activeUserTpl.template.id;
        }
        if (!resolvedTplId) {
          resolvedTplId = 1; // Fallback to template 1 (Academic Minimalist)
        }

        setProfile(profileData);
        setTemplateId(resolvedTplId);
      })
      .catch((err) => {
        console.error("Error fetching public profile:", err);
        setError(err.message || "Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlUsername, isPreview, previewTemplateId]);

  // Dynamically update document title & meta tags for SEO when public portfolio loads
  useEffect(() => {
    if (profile?.fullName) {
      const pageTitle = isPreview
        ? `${profile.fullName} — Template #${templateId} Preview | ByteBodh`
        : `${profile.fullName} | ${profile.headline || "Professional Portfolio"}`;
      
      document.title = pageTitle;

      const descText = profile.summary || profile.headline || `${profile.fullName}'s interactive portfolio showcasing skills, projects, and career experience on ByteBodh.`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", descText);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", descText);
        document.head.appendChild(metaDesc);
      }

      // OpenGraph social sharing meta tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", pageTitle);
      } else {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        ogTitle.setAttribute("content", pageTitle);
        document.head.appendChild(ogTitle);
      }

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", descText);
      } else {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        ogDesc.setAttribute("content", descText);
        document.head.appendChild(ogDesc);
      }

      if (profile.pictureUrl) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute("content", profile.pictureUrl);
        } else {
          ogImage = document.createElement("meta");
          ogImage.setAttribute("property", "og:image");
          ogImage.setAttribute("content", profile.pictureUrl);
          document.head.appendChild(ogImage);
        }
      }
    }
  }, [profile, isPreview, templateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute w-8 h-8 bg-emerald-500/10 rounded-full animate-pulse"></div>
        </div>
        <p className="mt-6 text-slate-400 font-semibold text-sm tracking-wide">
          Loading portfolio...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    const is404 = !error || error.includes("404") || error.toLowerCase().includes("not found") || error.includes("Failed to load");
    return (
      <PageNotFound
        statusCode="404"
        title={is404 ? "Portfolio Not Found" : "Unable to Load Portfolio"}
        message={
          is404
            ? "The portfolio you are looking for doesn't exist, is private, or the handle is incorrect."
            : "We encountered an issue retrieving this profile. Please verify the URL or try again later."
        }
        errorDetails={error || "Profile data unavailable"}
        showHeaderFooter={true}
      />
    );
  }

  const PreviewHeader = () => (
    <div className="bg-slate-950 border-b border-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md text-xs font-bold font-sans">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>BYTEBODH TEMPLATE PREVIEW: {profile.fullName} (Template #{templateId})</span>
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <span className="hidden sm:inline">💡 Previewing complete sample layout based on Template component</span>
        <button 
          onClick={() => window.close()} 
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg transition-colors border border-slate-800"
        >
          Exit Preview
        </button>
      </div>
    </div>
  );

  const activeTemplateComponent = (
    <TemplateRenderer templateId={templateId} profile={profile} />
  );

  if (isPreview) {
    if (isCardThumb) {
      return (
        <div className="w-[1280px] h-[800px] overflow-hidden bg-white select-none pointer-events-none">
          {activeTemplateComponent}
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen">
        <PreviewHeader />
        <div className="flex-1">
          {activeTemplateComponent}
        </div>
      </div>
    );
  }

  const currentUsername = profile?.username || urlUsername || getUsernameFromDomain();
  const linktreeUrl = currentUsername ? getLinktreeUrl(currentUsername) : "";

  return (
    <>
      {activeTemplateComponent}
      {!isPreview && linktreeUrl && (
        <a
          href={linktreeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-40 bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700/80 hover:border-emerald-500/50 backdrop-blur-md px-3.5 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 group"
          title="Visit Linktree Bio Page"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
          <span className="text-slate-300 group-hover:text-white">Bio Links</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
            bytebodh.in/{currentUsername}
          </span>
        </a>
      )}
    </>
  );
}

export default PublicPortfolioPage;

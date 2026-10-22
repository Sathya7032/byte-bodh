import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { linktreeApi } from "../api/portfolioApiService";
import { getUsernameFromDomain, getLinktreeUrl } from "../config/api";
import LinktreeTemplateRenderer, { LinktreeShareModal } from "./LinktreeTemplates";

export default function PublicLinktree() {
  const { username: paramUsername } = useParams();
  const username = paramUsername || getUsernameFromDomain();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchBio = async () => {
      try {
        setLoading(true);
        const res = await linktreeApi.getPublicBio(username);
        if (res.data) {
          const payload = res.data?.data || res.data;
          setData(payload);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Public Linktree load error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, [username]);

  const handleLinkClick = (link) => {
    if (link.id) {
      linktreeApi.recordClick(link.id).catch(() => {});
    }
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-mono tracking-wider">Loading Linktree...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-4 shadow-xl">
          🔍
        </div>
        <h1 className="text-2xl font-black mb-2">Page Not Found</h1>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          The link in bio for <span className="text-emerald-400 font-bold">@{username || "user"}</span> doesn't exist or is currently private.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-full font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
        >
          Create your ByteBodh bio
        </Link>
      </div>
    );
  }

  const user = data.user || {};
  const links = data.links || [];
  const socialLinks = data.socialLinks || [];
  const activeCode = data.activeTemplateCode || user.activeLinktreeTemplateCode || user.activeLinktreeTemplate || "cyber-dark";
  const defaultTemplate = activeCode.toLowerCase().replace(/_/g, "-");

  return (
    <>
      <LinktreeTemplateRenderer
        templateId={defaultTemplate}
        user={user}
        links={links}
        socialLinks={socialLinks}
        onLinkClick={handleLinkClick}
        onShare={handleShare}
        showTemplateSwitcher={true}
      />
      <LinktreeShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        username={user.username || username}
        fullName={user.fullName}
        url={getLinktreeUrl(user.username || username)}
      />
    </>
  );
}

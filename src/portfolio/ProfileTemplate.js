import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfile } from "../api/profileService";
import { getPortfolioUrl } from "../config/api";
import TemplateRenderer, { getTemplateNumber } from "../bytebodh-folio/TemplateRenderer";
import { Sparkles, Palette, Edit3, ExternalLink, RefreshCw } from "lucide-react";

const ProfileTemplate = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data?.data || response.data);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
        <p className="text-sm text-slate-400 font-semibold">Loading your active portfolio template...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Unable to Load Portfolio Template</h2>
        <p className="text-sm text-slate-500 mb-4">{error || "Profile data is unavailable."}</p>
        <Link
          to="/portfolio-templates"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          Explore Templates
        </Link>
      </div>
    );
  }

  const tplId = getTemplateNumber(
    profile.activeTemplate ||
    profile.activeTemplateCode ||
    profile.templateId ||
    profile.user?.activeTemplateCode ||
    1
  );

  return (
    <div className="relative min-h-screen">
      {/* Floating User Bar */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white p-2 px-3 rounded-2xl border border-slate-700/60 shadow-2xl text-xs font-bold">
        <span className="flex items-center gap-1.5 text-emerald-400 mr-2">
          <Sparkles size={14} /> Active: Template #{tplId}
        </span>
        <Link
          to="/portfolio-templates"
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1"
        >
          <Palette size={13} /> Change Template
        </Link>
        <Link
          to="/profile"
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1"
        >
          <Edit3 size={13} /> Edit Profile
        </Link>
        {profile.username && (
          <a
            href={getPortfolioUrl(profile.username)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Open Public Portfolio (Subdomain)"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Render the User's Active Template */}
      <TemplateRenderer templateId={tplId} profile={profile} />
    </div>
  );
};

export default ProfileTemplate;

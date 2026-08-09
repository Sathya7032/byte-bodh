import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaFolder,
  FaDownload,
  FaRocket,
  FaSpinner,
  FaPalette,
  FaEye,
  FaExclamationTriangle,
  FaBookOpen,
  FaLock,
  FaCrown
} from "react-icons/fa";
import DashboardLayout from "./components/DashboardLayout";
import {
  getAllTemplates,
  getUserTemplates,
  activateTemplate,
} from "../api/templateService";
import { getSubscriptionStatus } from "../api/subscriptionService";
import { getMyProfile } from "../api/profileService";

const PortfolioTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [userTemplates, setUserTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [processingId, setProcessingId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState({ active: false });

  // Fallback mock images if previewImageUrl is empty
  const mockImageMap = {
    1: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80", // Resume/Minimal
    2: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80", // Monospace/Monochrome
    3: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80", // Creative/Gallery
    4: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", // Executive
    18: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"  // Emerald Edge Glass
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [allRes, userRes, profileRes, subRes] = await Promise.all([
        getAllTemplates(),
        getUserTemplates(),
        getMyProfile().catch(() => ({ data: null })),
        getSubscriptionStatus().catch(() => ({ data: null })),
      ]);

      if (allRes.data?.success) {
        setTemplates(allRes.data.data || []);
      } else {
        setTemplates(allRes.data || []); // Fallback in case of direct array
      }

      if (userRes.data?.success) {
        setUserTemplates(userRes.data.data || []);
      } else {
        setUserTemplates(userRes.data || []);
      }

      if (profileRes?.data) {
        setProfile(profileRes.data);
      }

      if (subRes?.data?.success) {
        setSubscription(subRes.data.data || { active: false });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch templates. Please check if server is active.");
      toast.error("Error loading templates database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActivate = async (templateId) => {
    try {
      setProcessingId(templateId);
      const res = await activateTemplate(templateId);
      if (res.data?.success) {
        toast.success(res.data.message || "Template activated successfully!");
        fetchData();
      } else {
        toast.error(res.data?.message || "Failed to activate template");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;
      if (err.response?.status === 402 || (msg && msg.toLowerCase().includes("subscription"))) {
        toast.error(msg || "An active subscription is required to use this template.");
        navigate("/subscription");
      } else {
        toast.error(msg || "Error activating template. Please try again.");
      }
    } finally {
      setProcessingId(null);
    }
  };

  const checkIsExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const exp = new Date(expiryDate);
    if (isNaN(exp.getTime())) return false;
    exp.setHours(23, 59, 59, 999);
    return exp < new Date();
  };

  const subscriptionIsExpired = (() => {
    if (!subscription.expiryDate) return false;
    const exp = new Date(subscription.expiryDate);
    if (isNaN(exp.getTime())) return false;
    exp.setHours(23, 59, 59, 999);
    return exp < new Date();
  })();
  const hasActiveSubscription = subscription.active && !subscriptionIsExpired;

  const categories = ["All", ...new Set(templates.map((t) => t.category).filter(Boolean))];

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  const isProfileComplete = profile && (
    profile.fullName &&
    profile.headline &&
    profile.summary &&
    profile.skills?.length > 0 &&
    profile.education?.length > 0 &&
    (profile.isFresher || profile.experience?.length > 0)
  );

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn">
      {!loading && !isProfileComplete && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-left">
          <div className="p-2 bg-amber-100 rounded-full text-amber-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <h3 className="text-amber-800 font-bold text-sm">Your profile is incomplete!</h3>
            <p className="text-amber-700 text-xs mt-0.5">Please add your full name, headline, summary, education, skills, and experience (if applicable) in "My Portfolio" before activating a template.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FaPalette className="text-emerald-600" /> Portfolio Templates
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Choose a professional template to represent your online resume.
          </p>
        </div>
      </div>

      {/* Subscription status banner */}
      {!loading && !hasActiveSubscription && (
        <div className="p-5 bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaCrown className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm">Unlock all premium templates</h3>
              <p className="text-slate-400 text-xs font-semibold mt-0.5">
                Subscribe once to activate any paid template, plus blogs and portfolio messaging.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/subscription")}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <FaCrown /> Subscribe Now
          </button>
        </div>
      )}

      {/* Categories filter tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200/50 max-w-2xl text-left">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-gray-500 hover:text-gray-800 hover:bg-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
          <div className="relative inline-block">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <FaSpinner className="absolute inset-0 m-auto text-emerald-600 text-lg animate-spin" />
          </div>
          <p className="text-gray-500 mt-6 font-semibold">Loading portfolios catalog...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty list */}
      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">📂</div>
          <p className="text-gray-500 font-semibold">No templates found in this category.</p>
        </div>
      )}

      {/* Template Catalog Grid */}
      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            const userTemplate = userTemplates.find((ut) => ut.templateId === template.id);
            const isOwned = !!userTemplate;
            const isExpired = isOwned ? checkIsExpired(userTemplate.expiryDate) : false;
            const isActive = (userTemplate?.active || false) && !isExpired;
            const previewUrl = template.previewImageUrl || mockImageMap[template.id] || mockImageMap[1];
            const isLocked = !template.isFree && !hasActiveSubscription;

            return (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Preview Banner */}
                  <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden border-b border-gray-100">
                    <img
                      src={previewUrl}
                      alt={template.templateName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => window.open(`/templates/preview/${template.id}`, '_blank')}
                        className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FaEye /> Live Preview
                      </button>
                    </div>

                    {/* Price/Status Tag */}
                    <div className="absolute top-4 right-4">
                      {template.isFree ? (
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md bg-white border border-gray-100 text-emerald-600">
                          FREE
                        </span>
                      ) : isLocked ? (
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md bg-slate-900 text-white flex items-center gap-1.5">
                          <FaLock size={10} /> SUBSCRIPTION
                        </span>
                      ) : isActive ? (
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md bg-emerald-500 text-white flex items-center gap-1.5">
                          <FaCheckCircle /> ACTIVE
                        </span>
                      ) : (
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md bg-emerald-600 text-white flex items-center gap-1.5">
                          <FaCheckCircle /> UNLOCKED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      {template.category && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wide">
                          <FaFolder size={9} /> {template.category}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold tracking-wide">
                        <FaDownload size={9} /> {template.downloadsCount || 0} Uses
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                      {template.templateName}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {template.description || "Beautiful portfolio outline to present details, timeline and responsive references."}
                    </p>

                    {/* Feature checklist — always visible */}
                    <div className="mt-4 grid grid-cols-1 gap-2">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider ${
                        template.hasBlogsFeature
                          ? "bg-violet-50 border-violet-100 text-violet-700"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                        {template.hasBlogsFeature ? (
                          <FaCheckCircle size={12} className="text-violet-500 flex-shrink-0" />
                        ) : (
                          <FaTimesCircle size={12} className="text-slate-300 flex-shrink-0" />
                        )}
                        <span className="flex items-center gap-1">
                          <FaBookOpen size={9} /> Blogs
                        </span>
                      </div>
                    </div>

                    {userTemplate?.expiryDate && (
                      <div className="mt-3 text-[11px] font-bold flex items-center gap-1.5">
                        <span className={isExpired ? "text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100" : "text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100"}>
                          {isExpired ? `Expired on: ${userTemplate.expiryDate}` : `Expires on: ${userTemplate.expiryDate}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 text-left border-t border-gray-50 mt-4">
                  {isLocked ? (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaLock size={11} /> Subscribe to Unlock
                    </button>
                  ) : (
                    <button
                      disabled={isActive || processingId === template.id}
                      onClick={() => handleActivate(template.id)}
                      className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${isActive
                          ? "bg-slate-100 text-slate-400 cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/15 hover:shadow-lg hover:shadow-emerald-600/30"
                        }`}
                    >
                      {processingId === template.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {isExpired ? "Reactivating..." : "Activating..."}
                        </>
                      ) : isActive ? (
                        "Currently Active Theme"
                      ) : (
                        <>
                          <FaRocket /> {template.isFree ? "Get Template (Free)" : isExpired ? "Reactivate Layout" : "Activate Layout"}
                        </>
                      )}
                    </button>
                  )}

                  {isExpired && isOwned && (
                    <p className="text-[10px] text-rose-500 font-bold text-center mt-2 flex items-center justify-center gap-1">
                      <FaExclamationTriangle /> This template's access period has expired.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PortfolioTemplates;

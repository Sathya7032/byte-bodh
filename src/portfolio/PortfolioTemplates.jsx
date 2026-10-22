import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaFolder,
  FaRocket,
  FaSpinner,
  FaPalette,
  FaEye,
  FaLock,
  FaCrown,
  FaUndo
} from "react-icons/fa";
import DashboardLayout from "./components/DashboardLayout";
import {
  getAllTemplates,
  activateTemplate,
  deactivateTemplate,
  getMyActiveTemplate,
} from "../api/templateService";
import { getSubscriptionStatus } from "../api/subscriptionService";
import { getMyProfile } from "../api/profileService";
import { TemplatePreviewModal, TemplateCardThumbnail } from "../bytebodh-folio/TemplateRenderer";

const PortfolioTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [processingId, setProcessingId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState({ active: false });
  const [previewingTemplate, setPreviewingTemplate] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [allRes, activeRes, profileRes, subRes] = await Promise.all([
        getAllTemplates(),
        getMyActiveTemplate().catch(() => ({ data: null })),
        getMyProfile().catch(() => ({ data: null })),
        getSubscriptionStatus().catch(() => ({ data: null })),
      ]);

      const tplList = allRes.data?.data || (Array.isArray(allRes.data) ? allRes.data : []);
      setTemplates(tplList);

      if (activeRes?.data) {
        setActiveTemplate(activeRes.data?.data || activeRes.data);
      }

      if (profileRes?.data) {
        const p = profileRes.data?.data || profileRes.data;
        setProfile(p);
      }

      if (subRes?.data) {
        const subData = subRes.data?.data || subRes.data;
        const isActive = Boolean(
          subData.active ||
          subData.isActive ||
          subData.hasActiveSubscription ||
          subData.status === "ACTIVE"
        );
        setSubscription({ ...subData, active: isActive });
      }
    } catch (err) {
      console.error("Error loading templates:", err);
      setError("Failed to fetch templates catalog. Please try again.");
      toast.error("Error loading templates catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActivate = async (templateId, isPremium) => {
    if (isPremium && !hasActiveSubscription) {
      toast.info("This is a Pro template. Please subscribe to unlock all premium templates.");
      navigate("/subscription");
      return;
    }

    try {
      setProcessingId(templateId);
      const res = await activateTemplate(templateId);
      toast.success(res.data?.message || "Template activated! Your public portfolio now renders this layout.");
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;
      if (err.response?.status === 400 && msg?.toLowerCase().includes("subscription")) {
        toast.error(msg);
        navigate("/subscription");
      } else {
        toast.error(msg || "Error activating template. Please try again.");
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeactivate = async () => {
    try {
      setProcessingId("deactivating");
      await deactivateTemplate();
      toast.success("Template deactivated. Reverted to default Academic Minimalist layout.");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to deactivate template");
    } finally {
      setProcessingId(null);
    }
  };

  const subscriptionIsExpired = (() => {
    if (!subscription.expiryDate) return false;
    const exp = new Date(subscription.expiryDate);
    if (isNaN(exp.getTime())) return false;
    exp.setHours(23, 59, 59, 999);
    return exp < new Date();
  })();
  const hasActiveSubscription = Boolean(
    (subscription.active ||
      subscription.isActive ||
      subscription.status === "ACTIVE" ||
      profile?.hasActiveSubscription ||
      profile?.user?.hasActiveSubscription) &&
    !subscriptionIsExpired
  );

  // Determine if a given template is currently active
  const isTemplateActive = (template) => {
    if (activeTemplate?.id && activeTemplate.id === template.id) return true;
    if (profile?.activeTemplateId && profile.activeTemplateId === template.id) return true;
    if (profile?.user?.activeTemplateId && profile.user.activeTemplateId === template.id) return true;
    if (profile?.activeTemplateCode && profile.activeTemplateCode === template.templateCode) return true;
    if (profile?.user?.activeTemplateCode && profile.user.activeTemplateCode === template.templateCode) return true;

    // Fallback default: if user has no template set, TEMPLATE_1 / displayOrder 1 is default
    const hasAnyActive = Boolean(
      activeTemplate?.id ||
      profile?.activeTemplateId ||
      profile?.user?.activeTemplateId ||
      profile?.activeTemplateCode ||
      profile?.user?.activeTemplateCode
    );
    if (!hasAnyActive && (template.templateCode === "TEMPLATE_1" || template.displayOrder === 1)) {
      return true;
    }
    return false;
  };

  const categories = ["All", ...new Set(templates.map((t) => t.category).filter(Boolean))];

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
            <FaPalette className="text-emerald-500" /> Layout Showcase
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Portfolio Website Templates
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Activate whichever template you prefer. Your public portfolio will immediately render with all your projects, skills, education, and credentials.
          </p>
        </div>
      </div>

      {/* Templates Category Switcher: Portfolio vs Linktree */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-left">
        <button
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <FaPalette className="text-emerald-400" />
          <span>Portfolio Website Templates</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">username.bytebodh.in</span>
        </button>
        <button
          onClick={() => navigate("/linktree-templates")}
          className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-transparent hover:border-emerald-200"
        >
          <span>⚡ Linktree Bio Templates</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">bytebodh.in/:username</span>
        </button>
      </div>

      {/* Subscription status banner */}
      {!loading && !hasActiveSubscription && (
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <FaCrown className="text-slate-950 text-lg" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm">Unlock All Pro & Executive Templates</h3>
              <p className="text-slate-300 text-xs font-medium mt-0.5">
                Free templates can be activated by any user anytime. Subscribe to a Pro plan to unlock all 18 templates with premium layouts.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/subscription")}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <FaCrown /> View Pro Plans
          </button>
        </div>
      )}

      {/* Categories filter tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 max-w-2xl text-left">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200/80 font-black"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-20 text-center shadow-sm">
          <div className="relative inline-block">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <FaSpinner className="absolute inset-0 m-auto text-emerald-600 text-lg animate-spin" />
          </div>
          <p className="text-slate-500 mt-6 font-semibold text-sm">Loading portfolio templates catalog...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200/70 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">⚠️</div>
          <h3 className="text-base font-bold text-slate-900 mb-1">{error}</h3>
          <button
            onClick={fetchData}
            className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty list */}
      {!loading && !error && filteredTemplates.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-16 text-center shadow-sm">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">📂</div>
          <p className="text-slate-500 font-semibold text-sm">No templates found in this category.</p>
        </div>
      )}

      {/* Template Catalog Grid */}
      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isPremium = Boolean(template.isPremium);
            const isFree = !isPremium;
            const isLocked = isPremium && !hasActiveSubscription;
            const isActive = isTemplateActive(template);
            const orderNum = template.displayOrder || Number(String(template.templateCode).replace(/\D/g, "")) || 1;

            return (
              <div
                key={template.id}
                className={`bg-white border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                  isActive
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                    : "border-slate-200/80"
                }`}
              >
                <div>
                  {/* Live Template Component Scaled Preview (Same as website) */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-100">
                    <TemplateCardThumbnail
                      templateId={template}
                      title={template.name || template.templateName}
                    />

                    {/* Hover Overlay with Live Preview button */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-20">
                      <button
                        onClick={() => setPreviewingTemplate(template)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FaEye /> Live Preview
                      </button>
                      <button
                        onClick={() => window.open(`/templates/preview/${orderNum}`, "_blank")}
                        className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                        title="Open in new window"
                      >
                        <FaRocket />
                      </button>
                    </div>

                    {/* Price/Status Tag */}
                    <div className="absolute top-3.5 right-3.5 z-20">
                      {isActive ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-md bg-emerald-500 text-white flex items-center gap-1">
                          <FaCheckCircle /> ACTIVE
                        </span>
                      ) : isFree ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-md bg-white border border-slate-200 text-emerald-600">
                          FREE
                        </span>
                      ) : isLocked ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-md bg-slate-900 text-amber-400 border border-slate-800 flex items-center gap-1">
                          <FaLock size={9} /> PRO
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-md bg-amber-500 text-slate-950 flex items-center gap-1">
                          <FaCrown size={9} /> UNLOCKED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      {template.category && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wide">
                          <FaFolder size={9} className="text-slate-400" /> {template.category}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400">
                        Layout #{orderNum}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-snug mb-1.5">
                      {template.name || template.templateName}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {template.description || "Interactive portfolio layout displaying all user achievements, projects, and contact channels."}
                    </p>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-6 pt-0 text-left border-t border-slate-100 mt-4">
                  {isLocked ? (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FaLock size={11} className="text-amber-400" /> Subscribe to Unlock
                    </button>
                  ) : isActive ? (
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-1 py-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-black text-emerald-700 flex items-center justify-center gap-1.5">
                        <FaCheckCircle /> Currently Active
                      </div>
                      {orderNum !== 1 && (
                        <button
                          disabled={processingId === "deactivating"}
                          onClick={handleDeactivate}
                          className="px-3 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl text-xs font-bold transition-all border border-slate-200/60 cursor-pointer flex items-center gap-1"
                          title="Revert to default layout"
                        >
                          <FaUndo size={11} /> Reset
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      disabled={processingId === template.id}
                      onClick={() => handleActivate(template.id, isPremium)}
                      className="w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      {processingId === template.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Activating...</span>
                        </>
                      ) : (
                        <>
                          <FaRocket /> {isFree ? "Activate Template (Free)" : "Activate Layout (Pro)"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Interactive Template Component Preview Modal */}
      {previewingTemplate && (
        <TemplatePreviewModal
          isOpen={Boolean(previewingTemplate)}
          onClose={() => setPreviewingTemplate(null)}
          template={previewingTemplate}
          userProfile={profile}
          onActivate={handleActivate}
          isActive={isTemplateActive(previewingTemplate)}
          isLocked={
            Boolean(previewingTemplate.isPremium) && !hasActiveSubscription
          }
          isAdmin={false}
        />
      )}
    </DashboardLayout>
  );
};

export default PortfolioTemplates;

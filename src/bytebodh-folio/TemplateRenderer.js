import React, { useState, useEffect } from "react";
import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree";
import TemplateFour from "./TemplateFour";
import TemplateFive from "./TemplateFive";
import TemplateSix from "./TemplateSix";
import TemplateSeven from "./TemplateSeven";
import TemplateEight from "./TemplateEight";
import TemplateNine from "./TemplateNine";
import TemplateTen from "./TemplateTen";
import TemplateEleven from "./TemplateEleven";
import TemplateTwelve from "./TemplateTwelve";
import TemplateThirteen from "./TemplateThirteen";
import TemplateFourteen from "./TemplateFourteen";
import TemplateFifteen from "./TemplateFifteen";
import TemplateSixteen from "./TemplateSixteen";
import TemplateSeventeen from "./TemplateSeventeen";
import TemplateEighteen from "./TemplateEighteen";
import { getMockProfileForTemplate } from "./mockProfiles";
import {
  Monitor,
  Tablet,
  Smartphone,
  X,
  ExternalLink,
  CheckCircle2,
  Crown,
  Sparkles,
  Check
} from "lucide-react";

/**
 * Extracts numeric template ID (1 through 18) from various template representation formats
 */
export const getTemplateNumber = (templateOrId) => {
  if (!templateOrId) return 1;
  if (typeof templateOrId === "number") return templateOrId;
  if (typeof templateOrId === "string" && !isNaN(Number(templateOrId))) {
    return Number(templateOrId);
  }

  // Object checks
  if (templateOrId.displayOrder && Number(templateOrId.displayOrder) >= 1 && Number(templateOrId.displayOrder) <= 18) {
    return Number(templateOrId.displayOrder);
  }
  if (templateOrId.templateCode) {
    const match = String(templateOrId.templateCode).match(/\d+/);
    if (match) return Number(match[0]);
  }
  if (templateOrId.id && !isNaN(Number(templateOrId.id))) {
    return Number(templateOrId.id);
  }
  return 1;
};

/**
 * Live Scaling Iframe Card Thumbnail for User and Admin Dashboards (Same like website)
 */
export const TemplateCardThumbnail = ({ templateId, title, className = "" }) => {
  const tId = getTemplateNumber(templateId);
  const containerRef = React.useRef(null);
  const [scale, setScale] = useState(0.28);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width > 0) {
          setScale(width / 1280);
        }
      }
    };
    updateScale();

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(containerRef.current);
    } else {
      window.addEventListener("resize", updateScale);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[16/10] bg-slate-950 overflow-hidden ${className}`}
    >
      {/* Background loading spinner / placeholder */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 z-0">
          <div className="w-7 h-7 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-2" />
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
            Rendering Template #{tId}
          </span>
        </div>
      )}

      {/* Scaled Live Iframe Preview */}
      <iframe
        src={`/templates/preview/${tId}?card=true`}
        title={title || `Template #${tId} Live Preview`}
        onLoad={() => setLoaded(true)}
        style={{
          width: "1280px",
          height: "800px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}
        className="border-0 pointer-events-none select-none z-10"
        loading="lazy"
        tabIndex="-1"
      />
    </div>
  );
};

/**
 * Maps template ID to its respective component
 */
export const TemplateRenderer = ({ templateId, profile }) => {
  const tId = Number(templateId) || 1;
  const activeProfile = profile || getMockProfileForTemplate(tId);

  switch (tId) {
    case 1:
      return <TemplateOne profile={activeProfile} />;
    case 2:
      return <TemplateTwo profile={activeProfile} />;
    case 3:
      return <TemplateThree profile={activeProfile} />;
    case 4:
      return <TemplateFour profile={activeProfile} />;
    case 5:
      return <TemplateFive profile={activeProfile} />;
    case 6:
      return <TemplateSix profile={activeProfile} />;
    case 7:
      return <TemplateSeven profile={activeProfile} />;
    case 8:
      return <TemplateEight profile={activeProfile} />;
    case 9:
      return <TemplateNine profile={activeProfile} />;
    case 10:
      return <TemplateTen profile={activeProfile} />;
    case 11:
      return <TemplateEleven profile={activeProfile} />;
    case 12:
      return <TemplateTwelve profile={activeProfile} />;
    case 13:
      return <TemplateThirteen profile={activeProfile} />;
    case 14:
      return <TemplateFourteen profile={activeProfile} />;
    case 15:
      return <TemplateFifteen profile={activeProfile} />;
    case 16:
      return <TemplateSixteen profile={activeProfile} />;
    case 17:
      return <TemplateSeventeen profile={activeProfile} />;
    case 18:
      return <TemplateEighteen profile={activeProfile} />;
    default:
      return <TemplateOne profile={activeProfile} />;
  }
};

/**
 * Universal Template Preview Modal for User Dashboard and Admin Dashboard
 */
export const TemplatePreviewModal = ({
  isOpen,
  onClose,
  template,
  userProfile = null,
  onActivate = null,
  isActive = false,
  isLocked = false,
  isAdmin = false
}) => {
  const [deviceView, setDeviceView] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [useUserData, setUseUserData] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !template) return null;

  const tplNum = getTemplateNumber(template);
  const templateName = template.name || template.templateName || `Template #${tplNum}`;
  const isPremium = template.isPremium !== undefined ? template.isPremium : !template.isFree;
  const mockProfile = getMockProfileForTemplate(tplNum);
  const activeProfile = useUserData && userProfile ? userProfile : mockProfile;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-fadeIn text-left">
      
      {/* Top Preview Control Bar */}
      <div className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0 z-50 text-white">
        
        {/* Left: Template Identification */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20 flex-shrink-0">
            #{tplNum}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white truncate">
                {templateName}
              </h2>
              <span
                className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isPremium
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {isPremium ? "Pro Tier" : "Free Tier"}
              </span>
              {isActive && (
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <Check size={10} /> Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              {template.category ? `${template.category} • ` : ""}
              Based on template file: <code className="text-emerald-400 font-mono">Template{getWordNumber(tplNum)}.js</code>
            </p>
          </div>
        </div>

        {/* Center: Device Viewport Controls */}
        <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceView === "desktop"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Desktop 100% Canvas"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceView === "tablet"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              deviceView === "mobile"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobile Device (390px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Data Switcher & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* User vs Demo Data Switcher (Only in User Dashboard when user profile exists) */}
          {userProfile && !isAdmin && (
            <div className="hidden lg:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => setUseUserData(false)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  !useUserData ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Sample Data
              </button>
              <button
                onClick={() => setUseUserData(true)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  useUserData ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                My Portfolio Data
              </button>
            </div>
          )}

          {/* Activate Button (User Dashboard) */}
          {onActivate && !isAdmin && (
            <button
              onClick={() => onActivate(template.id, isPremium)}
              disabled={isActive}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : isLocked
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 active:scale-95"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20 active:scale-95"
              }`}
            >
              {isActive ? (
                <>
                  <CheckCircle2 size={14} /> Active
                </>
              ) : isLocked ? (
                <>
                  <Crown size={14} /> Unlock with Pro
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Activate Template
                </>
              )}
            </button>
          )}

          {/* Open full page in new tab */}
          <a
            href={`/templates/preview/${tplNum}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors hidden sm:inline-flex"
            title="Open in full browser window"
          >
            <ExternalLink size={17} />
          </a>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Close Preview (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 overflow-y-auto bg-slate-900/60 p-0 sm:p-4 flex items-center justify-center">
        {deviceView === "desktop" ? (
          <div className="w-full h-full bg-white shadow-2xl overflow-y-auto min-h-screen">
            <TemplateRenderer templateId={tplNum} profile={activeProfile} />
          </div>
        ) : deviceView === "tablet" ? (
          <div className="w-full max-w-[768px] h-[92vh] bg-white rounded-3xl border-[10px] border-slate-800 shadow-2xl overflow-y-auto relative my-auto">
            {/* Tablet Camera dot */}
            <div className="sticky top-2 z-50 flex justify-center pointer-events-none mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            </div>
            <TemplateRenderer templateId={tplNum} profile={activeProfile} />
          </div>
        ) : (
          <div className="w-full max-w-[400px] h-[850px] bg-white rounded-[44px] border-[10px] border-slate-800 shadow-2xl overflow-y-auto relative my-auto">
            {/* Mobile Notch / Dynamic Island */}
            <div className="sticky top-2 z-50 flex justify-center pointer-events-none mb-2">
              <span className="w-24 h-4 rounded-full bg-slate-900"></span>
            </div>
            <TemplateRenderer templateId={tplNum} profile={activeProfile} />
          </div>
        )}
      </div>

    </div>
  );
};

// Helper: 1 -> One, 2 -> Two, etc.
function getWordNumber(num) {
  const words = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen"
  ];
  return words[num] || "One";
}

export default TemplateRenderer;

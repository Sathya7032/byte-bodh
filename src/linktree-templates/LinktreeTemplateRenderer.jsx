import React, { useState, useEffect, useRef } from "react";
import LinktreeTemplateOne from "./LinktreeTemplateOne";
import LinktreeTemplateTwo from "./LinktreeTemplateTwo";
import LinktreeTemplateThree from "./LinktreeTemplateThree";
import LinktreeTemplateFour from "./LinktreeTemplateFour";
import LinktreeTemplateFive from "./LinktreeTemplateFive";
import LinktreeTemplateSix from "./LinktreeTemplateSix";
import { getMockLinktreeForTemplate } from "./mockLinktreeProfiles";
import {
  Monitor,
  Tablet,
  Smartphone,
  X,
  CheckCircle2,
  Crown,
  Sparkles,
  Check,
  Palette
} from "lucide-react";

/**
 * Standard catalog of Linktree templates
 */
export const LINKTREE_TEMPLATES = [
  {
    id: "cyber-dark",
    templateCode: "CYBER_DARK",
    numericId: 1,
    name: "Cyber Dark",
    icon: "⚡",
    description: "Deep obsidian dark with glowing neon accents & glassmorphic cards",
    accentColor: "#10B981",
    isFree: true,
  },
  {
    id: "minimal-ivory",
    templateCode: "MINIMAL_IVORY",
    numericId: 2,
    name: "Minimal Ivory",
    icon: "🕊️",
    description: "Crisp white minimalist aesthetic with refined slate typography",
    accentColor: "#0F172A",
    isFree: true,
  },
  {
    id: "neo-brutalist",
    templateCode: "NEO_BRUTALIST",
    numericId: 3,
    name: "Neo Brutalist",
    icon: "🎨",
    description: "Bold high-contrast pop colors with solid black borders & hard shadows",
    accentColor: "#FEF08A",
    isFree: true,
  },
  {
    id: "aurora-glass",
    templateCode: "AURORA_GLASS",
    numericId: 4,
    name: "Aurora Glass",
    icon: "🔮",
    description: "Frosted acrylic glass cards with floating ambient iridescent gradients",
    accentColor: "#8B5CF6",
    isFree: false,
  },
  {
    id: "bento-grid",
    templateCode: "BENTO_GRID",
    numericId: 5,
    name: "Bento Grid",
    icon: "🍱",
    description: "Modern Apple-style modular Bento card blocks with stats & contact chips",
    accentColor: "#06B6D4",
    isFree: false,
  },
  {
    id: "sunset-glow",
    templateCode: "SUNSET_GLOW",
    numericId: 6,
    name: "Sunset Glow",
    icon: "🌅",
    description: "Warm rich dusk gradients with golden amber buttons & luxury accents",
    accentColor: "#F59E0B",
    isFree: false,
  },
];

/**
 * Extracts numeric template ID (1 through 6) from various template representation formats
 * (Identical architectural pattern to getTemplateNumber in bytebodh-folio/TemplateRenderer.js)
 */
export const getLinktreeTemplateNumber = (templateOrId) => {
  if (!templateOrId) return 1;

  // Direct number
  if (typeof templateOrId === "number") {
    if (templateOrId >= 1 && templateOrId <= 6) return templateOrId;
    return 1;
  }

  // String numeric
  if (typeof templateOrId === "string" && !isNaN(Number(templateOrId))) {
    const num = Number(templateOrId);
    if (num >= 1 && num <= 6) return num;
    return 1;
  }

  // String code mapping
  if (typeof templateOrId === "string") {
    const s = templateOrId.toLowerCase().replace(/_/g, "-");
    if (s.includes("cyber") || s.includes("dark") || s === "1") return 1;
    if (s.includes("minimal") || s.includes("ivory") || s === "2") return 2;
    if (s.includes("brutalist") || s.includes("neo") || s === "3") return 3;
    if (s.includes("aurora") || s.includes("glass") || s === "4") return 4;
    if (s.includes("bento") || s === "5") return 5;
    if (s.includes("sunset") || s.includes("glow") || s === "6") return 6;
  }

  // Object checks
  if (typeof templateOrId === "object") {
    if (templateOrId.displayOrder && Number(templateOrId.displayOrder) >= 1 && Number(templateOrId.displayOrder) <= 6) {
      return Number(templateOrId.displayOrder);
    }
    if (templateOrId.templateCode) {
      return getLinktreeTemplateNumber(templateOrId.templateCode);
    }
    if (templateOrId.id) {
      return getLinktreeTemplateNumber(templateOrId.id);
    }
  }

  return 1;
};

/**
 * Normalizes template representation to slug code for backward compatibility
 */
export const normalizeTemplateCode = (codeOrId) => {
  const num = getLinktreeTemplateNumber(codeOrId);
  switch (num) {
    case 2:
      return "minimal-ivory";
    case 3:
      return "neo-brutalist";
    case 4:
      return "aurora-glass";
    case 5:
      return "bento-grid";
    case 6:
      return "sunset-glow";
    case 1:
    default:
      return "cyber-dark";
  }
};

/**
 * Live Scaling Preview Thumbnail for User and Admin Dashboards
 */
export const LinktreeCardThumbnail = ({ templateId, title, className = "" }) => {
  const tId = getLinktreeTemplateNumber(templateId);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width > 0) {
          setScale(width / 420);
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

  const mockData = getMockLinktreeForTemplate(tId);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[9/14] bg-slate-950 overflow-hidden rounded-xl border border-slate-800 ${className}`}
    >
      <div
        className="absolute top-0 left-0 pointer-events-none select-none origin-top-left"
        style={{
          width: "420px",
          height: "650px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <LinktreeTemplateRenderer
          templateId={tId}
          user={mockData.user}
          links={mockData.links}
          socialLinks={mockData.socialLinks}
          showTemplateSwitcher={false}
        />
      </div>
    </div>
  );
};

/**
 * MASTER LINKTREE TEMPLATE RENDERER
 * Maps template numeric IDs 1..6 and slug/codes to LinktreeTemplateOne through Six.
 */
export const LinktreeTemplateRenderer = ({
  templateId = 1,
  user,
  links = [],
  socialLinks = [],
  onLinkClick,
  onShare,
  showTemplateSwitcher = false,
  onTemplateChange,
}) => {
  const initialNumber = getLinktreeTemplateNumber(templateId);
  const [activeNumber, setActiveNumber] = useState(initialNumber);

  useEffect(() => {
    setActiveNumber(getLinktreeTemplateNumber(templateId));
  }, [templateId]);

  const handleSelectTemplate = (num) => {
    setActiveNumber(num);
    onTemplateChange?.(num);
  };

  // If no user data is provided, fallback to the template's mock profile
  const mockData = getMockLinktreeForTemplate(activeNumber);
  const activeUser = user || mockData.user;
  const activeLinks = (links && links.length > 0) ? links : mockData.links;
  const activeSocialLinks = (socialLinks && socialLinks.length > 0) ? socialLinks : mockData.socialLinks;

  const renderActiveTemplate = () => {
    switch (activeNumber) {
      case 2:
        return (
          <LinktreeTemplateTwo
            user={activeUser}
            links={activeLinks}
            socialLinks={activeSocialLinks}
            onLinkClick={onLinkClick}
            onShare={onShare}
          />
        );
      case 3:
        return (
          <LinktreeTemplateThree
            user={activeUser}
            links={activeLinks}
            socialLinks={activeSocialLinks}
            onLinkClick={onLinkClick}
            onShare={onShare}
          />
        );
      case 4:
        return (
          <LinktreeTemplateFour
            user={activeUser}
            links={activeLinks}
            socialLinks={activeSocialLinks}
            onLinkClick={onLinkClick}
            onShare={onShare}
          />
        );
      case 5:
        return (
          <LinktreeTemplateFive
            user={activeUser}
            links={activeLinks}
            socialLinks={activeSocialLinks}
            onLinkClick={onLinkClick}
            onShare={onShare}
          />
        );
      case 6:
        return (
          <LinktreeTemplateSix
            user={activeUser}
            links={activeLinks}
            socialLinks={activeSocialLinks}
            onLinkClick={onLinkClick}
            onShare={onShare}
          />
        );
      case 1:
      default:
        return (
          <LinktreeTemplateOne
            user={activeUser}
            links={activeLinks}
            socialLinks={activeSocialLinks}
            onLinkClick={onLinkClick}
            onShare={onShare}
          />
        );
    }
  };

  return (
    <div className="relative w-full">
      {/* Optional Floating Template Switcher Bar */}
      {showTemplateSwitcher && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-1.5 max-w-[95vw] overflow-x-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 pr-1 hidden sm:inline-flex items-center gap-1">
            <Palette size={11} className="text-emerald-400" /> Templates:
          </span>
          {LINKTREE_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t.numericId)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeNumber === t.numericId
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{t.icon}</span>
              <span className="text-[11px]">{t.name}</span>
            </button>
          ))}
        </div>
      )}

      {renderActiveTemplate()}
    </div>
  );
};

/**
 * Universal Template Preview Modal for User Dashboard and Admin Dashboard
 * (Matches the architecture of TemplatePreviewModal in bytebodh-folio/TemplateRenderer.js)
 */
export const LinktreeTemplatePreviewModal = ({
  isOpen,
  onClose,
  template,
  user = null,
  links = [],
  socialLinks = [],
  onActivate = null,
  isActive = false,
  isLocked = false,
  isAdmin = false,
}) => {
  const [deviceView, setDeviceView] = useState("mobile"); // 'mobile' | 'tablet' | 'desktop'
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

  const tplNum = getLinktreeTemplateNumber(template);
  const templateName = template.name || template.templateName || `Linktree #${tplNum}`;
  const isPremium = template.isPremium !== undefined ? template.isPremium : !template.isFree;
  const mockData = getMockLinktreeForTemplate(tplNum);

  const activeUser = useUserData && user ? user : mockData.user;
  const activeLinks = useUserData && links && links.length > 0 ? links : mockData.links;
  const activeSocialLinks = useUserData && socialLinks && socialLinks.length > 0 ? socialLinks : mockData.socialLinks;

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
            <p className="text-xs text-slate-400 truncate hidden md:block">
              {template.description || "Linktree bio link experience"}
            </p>
          </div>
        </div>

        {/* Center: Device Simulation Controls */}
        <div className="hidden sm:flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setDeviceView("mobile")}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              deviceView === "mobile"
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobile View"
          >
            <Smartphone size={14} />
            <span className="hidden lg:inline">Mobile</span>
          </button>
          <button
            onClick={() => setDeviceView("tablet")}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              deviceView === "tablet"
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tablet View"
          >
            <Tablet size={14} />
            <span className="hidden lg:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView("desktop")}
            className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              deviceView === "desktop"
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
            title="Desktop View"
          >
            <Monitor size={14} />
            <span className="hidden lg:inline">Full</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {user && (
            <button
              onClick={() => setUseUserData(!useUserData)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                useUserData
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Sparkles size={13} />
              <span className="hidden md:inline">
                {useUserData ? "My Real Bio" : "Mock Data"}
              </span>
            </button>
          )}

          {onActivate && !isAdmin && (
            <button
              onClick={() => onActivate(template)}
              disabled={isActive || isLocked}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : isLocked
                  ? "bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md shadow-amber-500/20"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/20"
              }`}
            >
              {isActive ? (
                <>
                  <CheckCircle2 size={14} /> Current
                </>
              ) : isLocked ? (
                <>
                  <Crown size={14} /> Upgrade to Apply
                </>
              ) : (
                <>
                  <Check size={14} /> Use This Template
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 bg-slate-950 overflow-y-auto flex items-start justify-center p-2 sm:p-6">
        <div className={`w-full overflow-y-auto transition-all duration-300 ${getDeviceViewClass(deviceView)}`}>
          <LinktreeTemplateRenderer
            templateId={tplNum}
            user={activeUser}
            links={activeLinks}
            socialLinks={activeSocialLinks}
            showTemplateSwitcher={false}
          />
        </div>
      </div>
    </div>
  );
};

const getDeviceViewClass = (deviceView) => {
  switch (deviceView) {
    case "mobile":
      return "max-w-[430px] rounded-[36px] shadow-2xl border-[6px] border-slate-800 my-4 h-[840px]";
    case "tablet":
      return "max-w-[640px] rounded-[28px] shadow-2xl border-[6px] border-slate-800 my-4 h-[860px]";
    case "desktop":
    default:
      return "w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-800 my-4 min-h-[860px]";
  }
};

export default LinktreeTemplateRenderer;

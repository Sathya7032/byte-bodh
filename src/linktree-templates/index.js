import LinktreeTemplateRenderer from "./LinktreeTemplateRenderer";

export { LinktreeTemplateOne } from "./LinktreeTemplateOne";
export { LinktreeTemplateTwo } from "./LinktreeTemplateTwo";
export { LinktreeTemplateThree } from "./LinktreeTemplateThree";
export { LinktreeTemplateFour } from "./LinktreeTemplateFour";
export { LinktreeTemplateFive } from "./LinktreeTemplateFive";
export { LinktreeTemplateSix } from "./LinktreeTemplateSix";

// Backward-compatible named aliases
export { LinktreeTemplateOne as LinktreeCyberDark } from "./LinktreeTemplateOne";
export { LinktreeTemplateTwo as LinktreeMinimalIvory } from "./LinktreeTemplateTwo";
export { LinktreeTemplateThree as LinktreeNeoBrutalist } from "./LinktreeTemplateThree";
export { LinktreeTemplateFour as LinktreeAuroraGlass } from "./LinktreeTemplateFour";
export { LinktreeTemplateFive as LinktreeBentoGrid } from "./LinktreeTemplateFive";
export { LinktreeTemplateSix as LinktreeSunsetGlow } from "./LinktreeTemplateSix";

// Central template mapping engine and previews
export {
  LinktreeTemplateRenderer,
  LinktreeCardThumbnail,
  LinktreeTemplatePreviewModal,
  getLinktreeTemplateNumber,
  normalizeTemplateCode,
  LINKTREE_TEMPLATES,
} from "./LinktreeTemplateRenderer";

// Universal Linktree Card & UI Helpers
export {
  LinktreeLinkCard,
  PortfolioJumpBanner,
  LinktreeShareModal,
  getSocialIcon,
  isLinkScheduledVisible,
  sortLinks,
} from "./LinktreeCard";

// Mock profiles
export {
  getMockLinktreeForTemplate,
  mockCyberDarkProfile,
  mockMinimalIvoryProfile,
  mockNeoBrutalistProfile,
  mockAuroraGlassProfile,
  mockBentoGridProfile,
  mockSunsetGlowProfile,
} from "./mockLinktreeProfiles";

export default LinktreeTemplateRenderer;

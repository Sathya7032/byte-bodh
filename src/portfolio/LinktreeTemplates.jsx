/**
 * LinktreeTemplates re-export proxy
 *
 * Linktree templates have been modularized into separate files in /src/linktree-templates/
 * (same architecture as /src/bytebodh-folio/ for portfolio templates):
 * - LinktreeTemplateOne.jsx (Cyber Dark)
 * - LinktreeTemplateTwo.jsx (Minimal Ivory)
 * - LinktreeTemplateThree.jsx (Neo Brutalist)
 * - LinktreeTemplateFour.jsx (Aurora Glass)
 * - LinktreeTemplateFive.jsx (Bento Grid)
 * - LinktreeTemplateSix.jsx (Sunset Glow)
 * - LinktreeTemplateRenderer.jsx (Template engine & live scaling preview cards)
 * - LinktreeCard.jsx (Universal link cards, jump banner, share modal)
 * - mockLinktreeProfiles.js (Mock data for each of the 6 templates)
 *
 * This file maintains 100% backward compatibility for existing imports across the application.
 */

import LinktreeTemplateRenderer from "../linktree-templates";

export * from "../linktree-templates";
export default LinktreeTemplateRenderer;

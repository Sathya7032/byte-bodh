/**
 * Design tokens for each Linktree template.
 * Every template has exactly one look; the link card and shared parts read
 * their styling from here so a template stays visually consistent.
 */

const base = {
  radius: "rounded-full",
  layout: "row",
};

export const LINKTREE_THEMES = {
  // 1. Obsidian dark, solid pill buttons, user accent colour
  "cyber-dark": {
    ...base,
    accent: "#10B981",
    button:
      "bg-[#16191F] border border-white/[0.08] text-white hover:bg-[#1C2027] hover:border-white/20 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
    subText: "text-white/55",
    icon: "bg-white/[0.06] text-white/90",
    arrow: "text-white/40",
    featured: "bg-[#16191F] border border-white/[0.08] text-white hover:border-white/20",
    featuredMedia: "bg-black/40",
    header: "text-white/60",
    gate: "bg-[#16191F] border border-white/[0.08] text-white",
    gateButton: "bg-white text-black hover:bg-white/90",
  },

  // 2. Warm paper, black outline pills that fill on hover, serif display type
  "minimal-ivory": {
    ...base,
    accent: "#111111",
    button:
      "bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F6F4EF]",
    subText: "opacity-60",
    icon: "bg-[#1A1A1A]/[0.06] text-current",
    arrow: "opacity-50",
    featured: "bg-white border border-[#1A1A1A]/15 text-[#1A1A1A] hover:border-[#1A1A1A] shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
    featuredMedia: "bg-[#ECE9E2]",
    header: "text-[#1A1A1A]/55",
    gate: "bg-white border border-[#1A1A1A]/15 text-[#1A1A1A]",
    gateButton: "bg-[#1A1A1A] text-white hover:bg-black",
  },

  // 3. Cream with hard black borders and offset shadows, rotating pastel fills
  "neo-brutalist": {
    ...base,
    radius: "rounded-xl",
    accent: "#000000",
    button:
      "border-2 border-black text-black shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px]",
    fills: ["bg-[#FDE68A]", "bg-[#A7F3D0]", "bg-[#BFDBFE]", "bg-[#FBCFE8]", "bg-[#DDD6FE]"],
    subText: "text-black/65",
    icon: "bg-white border-2 border-black text-black",
    arrow: "text-black",
    featured:
      "bg-white border-2 border-black text-black shadow-[6px_6px_0_#000] hover:shadow-[3px_3px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px]",
    featuredMedia: "bg-[#FDE68A] border-b-2 border-black",
    header: "text-black font-black uppercase tracking-wider",
    gate: "bg-white border-2 border-black text-black shadow-[4px_4px_0_#000]",
    gateButton: "bg-black text-white hover:bg-black/85",
  },

  // 4. Frosted glass over a soft colour field
  "aurora-glass": {
    ...base,
    radius: "rounded-2xl",
    accent: "#A78BFA",
    button:
      "bg-white/[0.14] backdrop-blur-xl border border-white/25 text-white hover:bg-white/[0.22] shadow-[0_8px_24px_-12px_rgba(30,0,60,0.45)]",
    subText: "text-white/70",
    icon: "bg-white/20 text-white",
    arrow: "text-white/60",
    featured: "bg-white/[0.14] backdrop-blur-xl border border-white/25 text-white hover:bg-white/[0.2]",
    featuredMedia: "bg-white/10",
    header: "text-white/75",
    gate: "bg-white/[0.14] backdrop-blur-xl border border-white/25 text-white",
    gateButton: "bg-white text-[#3B1A6B] hover:bg-white/90",
  },

  // 5. Dark bento tiles in a two-column grid
  "bento-grid": {
    ...base,
    radius: "rounded-3xl",
    layout: "tile",
    accent: "#22D3EE",
    button: "bg-[#141416] border border-white/[0.07] text-white hover:border-white/20 hover:bg-[#18181B]",
    subText: "text-white/50",
    icon: "bg-white/[0.06] text-white",
    arrow: "text-white/35",
    featured: "bg-[#141416] border border-white/[0.07] text-white hover:border-white/20",
    featuredMedia: "bg-white/[0.04]",
    header: "text-white/45",
    gate: "bg-[#141416] border border-white/[0.07] text-white",
    gateButton: "bg-white text-black hover:bg-white/90",
  },

  // 6. Full-bleed cover photo fading into warm dusk, cream pills
  "sunset-glow": {
    ...base,
    accent: "#FB923C",
    button: "bg-[#FFEBD6] text-[#2B140B] hover:bg-white shadow-[0_6px_20px_-10px_rgba(0,0,0,0.6)]",
    subText: "text-[#2B140B]/60",
    icon: "bg-[#2B140B]/[0.08] text-[#2B140B]",
    arrow: "text-[#2B140B]/50",
    featured: "bg-[#FFEBD6] text-[#2B140B] hover:bg-white",
    featuredMedia: "bg-[#2B140B]/10",
    header: "text-[#FFD9B8]/80",
    gate: "bg-[#FFEBD6] text-[#2B140B]",
    gateButton: "bg-[#2B140B] text-[#FFEBD6] hover:bg-black",
  },
};

export const getLinktreeTheme = (theme) => LINKTREE_THEMES[theme] || LINKTREE_THEMES["cyber-dark"];

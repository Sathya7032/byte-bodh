// Mock profiles and sample bio links for Linktree template previews (same pattern as portfolio mockProfiles.js)

export const mockCyberDarkProfile = {
  user: {
    fullName: "Aryan Sharma",
    username: "aryansharma",
    headline: "Cloud Native Engineer & AI Researcher @ ByteBodh",
    bio: "Obsessed with distributed systems, Kubernetes operators, and high-throughput microservices. Coffee into code.",
    location: "Bengaluru, India",
    contactEmail: "aryan@bytebodh.in",
    hasActiveSubscription: true,
    isProfilePublic: true,
    themeAccentColor: "#10B981",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
  links: [
    {
      id: "mock-1",
      title: "🚀 Open Source eFolio Architecture",
      subtitle: "Over 12,000 GitHub stars and 200+ enterprise contributors",
      url: "https://github.com/bytebodh/efolio",
      type: "FEATURED_HERO",
      platform: "GITHUB",
      isPinned: true,
      isFeatured: true,
      animation: "PULSE",
      clickCount: 14200,
    },
    {
      id: "mock-header-1",
      title: "⚡ Core Projects & Frameworks",
      type: "HEADER",
    },
    {
      id: "mock-2",
      title: "Distributed Microservices in Go & Spring Boot",
      subtitle: "Read my latest deep-dive architectural handbook",
      url: "https://bytebodh.in",
      type: "CLASSIC",
      platform: "CUSTOM",
      clickCount: 3820,
    },
    {
      id: "mock-3",
      title: "DevOps & Cloud Automation Workshop",
      subtitle: "Free 4-week cohort on Terraform and Kubernetes",
      url: "https://youtube.com",
      type: "CLASSIC",
      platform: "YOUTUBE",
      animation: "GLOW",
      clickCount: 2910,
    },
    {
      id: "mock-4",
      title: "Support Independent Open Source",
      subtitle: "Buy me a coffee to keep research libraries ad-free",
      url: "https://bytebodh.in",
      type: "PAYMENT_DONATION",
      platform: "COFFEE",
      clickCount: 1240,
    },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "youtube", url: "https://youtube.com" },
  ],
};

export const mockMinimalIvoryProfile = {
  user: {
    fullName: "Elena Rostova",
    username: "elenarostova",
    headline: "Minimalist Product Designer & Design Systems Lead",
    bio: "Focusing on clean spatial hierarchies, Swiss typography, and calm digital interfaces.",
    location: "Zurich, Switzerland",
    contactEmail: "elena@designstudio.ch",
    hasActiveSubscription: true,
    isProfilePublic: true,
    themeAccentColor: "#0F172A",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  links: [
    {
      id: "min-1",
      title: "Minimal Design System 2026",
      subtitle: "Figma UI kit crafted with pure token architecture",
      url: "https://figma.com",
      type: "FEATURED_HERO",
      platform: "CUSTOM",
      isPinned: true,
      isFeatured: true,
      clickCount: 8900,
    },
    {
      id: "min-head",
      title: "Selected Case Studies",
      type: "HEADER",
    },
    {
      id: "min-2",
      title: "Fintech Dashboard Redesign",
      subtitle: "Reduced task completion times by 38%",
      url: "https://bytebodh.in",
      type: "CLASSIC",
      platform: "CUSTOM",
      clickCount: 4210,
    },
    {
      id: "min-3",
      title: "Schedule a 1-on-1 Design Consultation",
      subtitle: "Book 45 minutes for product strategy or portfolio reviews",
      url: "https://bytebodh.in",
      type: "CONTACT_FORM",
      platform: "EMAIL",
      clickCount: 960,
    },
  ],
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "instagram", url: "https://instagram.com" },
  ],
};

export const mockNeoBrutalistProfile = {
  user: {
    fullName: "Marcus 'Vex' Sterling",
    username: "vexcreator",
    headline: "Creative Technologist • WebGL Artist • Indie Hacker",
    bio: "Loud designs, fast code, and unapologetic software. No corporate fluff.",
    location: "Berlin, Germany",
    contactEmail: "vex@rawpixels.de",
    hasActiveSubscription: true,
    isProfilePublic: true,
    themeAccentColor: "#FDE047",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  links: [
    {
      id: "brutal-1",
      title: "⚡ RETRO SYNTH SHADER PACK",
      subtitle: "100+ GPU shaders ready for Three.js and WebGL games",
      url: "https://bytebodh.in",
      type: "FEATURED_HERO",
      platform: "CUSTOM",
      isPinned: true,
      isFeatured: true,
      animation: "POP",
      clickCount: 15400,
    },
    {
      id: "brutal-head",
      title: "STUFF I BUILT",
      type: "HEADER",
    },
    {
      id: "brutal-2",
      title: "Indie Hacker Revenue Dashboard",
      subtitle: "Real-time MRR tracking for bootstrapped SaaS founders",
      url: "https://bytebodh.in",
      type: "CLASSIC",
      platform: "CUSTOM",
      clickCount: 6800,
    },
    {
      id: "brutal-3",
      title: "Buy Me A Pizza & Monster Energy",
      subtitle: "Fuel more open-source experiments and crazy prototypes",
      url: "https://bytebodh.in",
      type: "PAYMENT_DONATION",
      platform: "COFFEE",
      clickCount: 2190,
    },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "youtube", url: "https://youtube.com" },
    { platform: "discord", url: "https://discord.com" },
  ],
};

export const mockAuroraGlassProfile = {
  user: {
    fullName: "Seraphina Lin",
    username: "seraphina_lin",
    headline: "Web3 Protocol Engineer & Generative Art Director",
    bio: "Exploring iridescent glass interfaces, smart contract formal verification, and algorithmic aesthetics.",
    location: "Singapore",
    contactEmail: "seraphina@aurora.io",
    hasActiveSubscription: true,
    isProfilePublic: true,
    themeAccentColor: "#A855F7",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
  },
  links: [
    {
      id: "aurora-1",
      title: "🔮 Generative Ether Soundscapes",
      subtitle: "Interactive spatial audio generated live in your browser",
      url: "https://bytebodh.in",
      type: "FEATURED_HERO",
      platform: "SPOTIFY",
      isPinned: true,
      isFeatured: true,
      animation: "GLOW",
      clickCount: 11200,
    },
    {
      id: "aurora-head",
      title: "Research Papers & Releases",
      type: "HEADER",
    },
    {
      id: "aurora-2",
      title: "Zero-Knowledge Rollup Compression",
      subtitle: "Read the peer-reviewed specification published in 2026",
      url: "https://github.com",
      type: "CLASSIC",
      platform: "GITHUB",
      clickCount: 5400,
    },
    {
      id: "aurora-3",
      title: "Private Discord Community",
      subtitle: "Join 3,500+ builders discussing crypto and creative tech",
      url: "https://discord.com",
      type: "CLASSIC",
      platform: "DISCORD",
      clickCount: 3800,
    },
  ],
  socialLinks: [
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "github", url: "https://github.com" },
    { platform: "spotify", url: "https://spotify.com" },
    { platform: "discord", url: "https://discord.com" },
  ],
};

export const mockBentoGridProfile = {
  user: {
    fullName: "Karan Patel",
    username: "karanpatel",
    headline: "Staff iOS & Mobile Architect @ ByteBodh",
    bio: "Specializing in Swift, SwiftUI, offline-first sync engines, and Apple Design Award winning user experiences.",
    location: "Cupertino, CA",
    contactEmail: "karan@bytebodh.in",
    hasActiveSubscription: true,
    isProfilePublic: true,
    themeAccentColor: "#06B6D4",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
  },
  links: [
    {
      id: "bento-1",
      title: "📱 PocketFolio iOS 18",
      subtitle: "Featured App of the Day with over 500,000 active creators",
      url: "https://bytebodh.in",
      type: "FEATURED_HERO",
      platform: "CUSTOM",
      isPinned: true,
      isFeatured: true,
      animation: "PULSE",
      clickCount: 18900,
    },
    {
      id: "bento-head",
      title: "Bento Modular Collections",
      type: "HEADER",
    },
    {
      id: "bento-2",
      title: "SwiftUI Architecture Mastery",
      subtitle: "Comprehensive video course with 40+ hours of video",
      url: "https://youtube.com",
      type: "CLASSIC",
      platform: "YOUTUBE",
      clickCount: 7800,
    },
    {
      id: "bento-3",
      title: "Get In Touch for Speaking Engagements",
      subtitle: "Keynote talks on mobile performance and offline sync",
      url: "mailto:karan@bytebodh.in",
      type: "CONTACT_FORM",
      platform: "EMAIL",
      clickCount: 1420,
    },
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "youtube", url: "https://youtube.com" },
    { platform: "linkedin", url: "https://linkedin.com" },
  ],
};

export const mockSunsetGlowProfile = {
  user: {
    fullName: "Aaliyah Chen",
    username: "aaliyahchen",
    headline: "Travel Photographer & Cinematographer",
    bio: "Capturing golden hour light across 40+ countries. Sony Artisan of Imagery & Adobe Lightroom Ambassador.",
    location: "Tokyo / Vancouver",
    contactEmail: "aaliyah@visuals.art",
    hasActiveSubscription: true,
    isProfilePublic: true,
    themeAccentColor: "#F59E0B",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  links: [
    {
      id: "sunset-1",
      title: "🌅 Kyoto Dusk 2026 Print Collection",
      subtitle: "Limited museum-grade fine art prints on Hahnemühle paper",
      url: "https://bytebodh.in",
      type: "FEATURED_HERO",
      platform: "CUSTOM",
      isPinned: true,
      isFeatured: true,
      animation: "PULSE",
      clickCount: 16700,
    },
    {
      id: "sunset-head",
      title: "Presets & Creative Tools",
      type: "HEADER",
    },
    {
      id: "sunset-2",
      title: "Golden Hour Lightroom Presets",
      subtitle: "The exact color grading pack I use for editorial spreads",
      url: "https://bytebodh.in",
      type: "CLASSIC",
      platform: "CUSTOM",
      clickCount: 9200,
    },
    {
      id: "sunset-3",
      title: "Support Independent Visual Storytelling",
      subtitle: "Join my monthly photography dispatch and Patreon",
      url: "https://bytebodh.in",
      type: "PAYMENT_DONATION",
      platform: "COFFEE",
      clickCount: 3100,
    },
  ],
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "youtube", url: "https://youtube.com" },
    { platform: "twitter", url: "https://twitter.com" },
  ],
};

/**
 * Returns mock profile and links by template numeric ID (1-6)
 */
export const getMockLinktreeForTemplate = (templateNumber) => {
  switch (Number(templateNumber)) {
    case 2:
      return mockMinimalIvoryProfile;
    case 3:
      return mockNeoBrutalistProfile;
    case 4:
      return mockAuroraGlassProfile;
    case 5:
      return mockBentoGridProfile;
    case 6:
      return mockSunsetGlowProfile;
    case 1:
    default:
      return mockCyberDarkProfile;
  }
};

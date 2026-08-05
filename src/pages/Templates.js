import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaPalette,
  FaPlay,
  FaExternalLinkAlt,
  FaRocket,
  FaFilter,
  FaArrowRight
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";

const ALL_TEMPLATES = [
  {
    id: 1,
    name: "Academic Minimalist",
    category: "Students & Freshers",
    tagCategory: "Minimal & Academic",
    desc: "A clean, ATS-friendly minimalist layout emphasizing education, publications, research, and technical skills.",
    badge: "Free • Academic",
    tags: ["ATS Friendly", "Minimalist", "Clean Typography", "Publication Grid"]
  },
  {
    id: 2,
    name: "Ivory Elite",
    category: "Recruiter Ready & Professionals",
    tagCategory: "Executive & Professional",
    desc: "A clean white theme with emerald green accents, 24px rounded cards, glassmorphism, Apple + Linear aesthetic, experience & education timelines, animated skill pills, project cards with gradient buttons, and recruiter contact form.",
    badge: "Ivory White • Emerald Accents",
    tags: ["White Theme", "Emerald Accents", "24px Cards", "Timelines", "Glassmorphism", "Dark/Light Toggle"]
  },
  {
    id: 3,
    name: "Royal Sapphire",
    category: "Executive Leaders & Directors",
    tagCategory: "Executive & Professional",
    desc: "A premium dual-column executive portfolio featuring a sticky profile sidebar, horizontal project cards, download resume & schedule meeting modals, and recruiter contact form.",
    badge: "Royal Sapphire • Executive",
    tags: ["Royal Blue", "Left Sidebar", "Horizontal Projects", "Schedule Meeting", "Timelines", "Glassmorphism"]
  },
  {
    id: 4,
    name: "Executive Brand",
    category: "Product Managers & Leads",
    tagCategory: "Executive & Professional",
    desc: "A premium corporate layout with timeline progress tracking, corporate KPIs, and executive project briefs.",
    badge: "Executive • Premium",
    tags: ["Corporate KPIs", "Timeline Progress", "Leadership", "Clean Grid"]
  },
  {
    id: 5,
    name: "Developer IDE Studio",
    category: "Software Engineers",
    tagCategory: "Developers & IDE",
    desc: "A fully immersive VS Code styled portfolio layout featuring file explorer, code tabs, and a live compiler mode.",
    badge: "VS Code IDE • Interactive",
    tags: ["IDE Studio", "Code Explorer", "Interactive Tabs", "Live Compiler"]
  },
  {
    id: 6,
    name: "Coral Studio",
    category: "Designers & Creative Developers",
    tagCategory: "Creative & Vector",
    desc: "A modern creative portfolio inspired by Framer and Stripe with coral orange accents, abstract shape hero, masonry project grid with hover zoom, animated skill badges, and gallery certifications.",
    badge: "Coral Studio • Framer/Stripe UI",
    tags: ["Coral Theme", "Abstract Shapes", "Masonry Grid", "Hover Zoom", "Skill Badges", "Minimal Illustrations"]
  },
  {
    id: 7,
    name: "Cyber HUD Matrix",
    category: "Tech & Cyber Freshers",
    tagCategory: "3D & Interactive",
    desc: "Futuristic Cyber HUD Console with matrix grid background, glowing status ring, & Anime.js v4 animations.",
    badge: "Cyber HUD • 4-Color",
    tags: ["Cyberpunk HUD", "Matrix Grid", "Glowing Badges", "Anime.js v4"]
  },
  {
    id: 8,
    name: "Vintage Gazette",
    category: "Academic Chronicle",
    tagCategory: "Minimal & Academic",
    desc: "Classic Newspaper Frontpage layout with 3-column editorial grid, serif drop caps, & double border rules.",
    badge: "Gazette Chronicle",
    tags: ["Newspaper Grid", "Vintage Typography", "Editorial Cards", "Drop Caps"]
  },
  {
    id: 9,
    name: "Neo-Brutalist Tech",
    category: "High-Contrast Student",
    tagCategory: "Creative & Vector",
    desc: "Bold Neo-Brutalist Black, White & Yellow showcase with Anime.js continuous live ticker & heavy drop shadows.",
    badge: "Neo-Brutalist • Anime.js",
    tags: ["Neo-Brutalist", "High Contrast", "Continuous Ticker", "Heavy Shadows"]
  },
  {
    id: 10,
    name: "Bento Pro",
    category: "Senior Product Designers & Architects",
    tagCategory: "Executive & Professional",
    desc: "An Apple, Notion & Linear inspired Bento Grid portfolio featuring 28px rounded cards, colorful technology chips, vertical mini timeline education, visual project cards with floating badges, and dark mode.",
    badge: "Bento Pro • Apple + Notion UI",
    tags: ["Bento Grid", "Apple UI", "Notion Style", "Tech Chips", "28px Rounded", "Dark Mode"]
  },
  {
    id: 11,
    name: "Journey",
    category: "Storytelling Professionals & Engineers",
    tagCategory: "Creative & Vector",
    desc: "A storytelling portfolio telling your career like a continuous vertical timeline connecting Hero → Education → Internships → Experience → Projects → Achievements → Certifications → Contact.",
    badge: "Journey • Career Timeline",
    tags: ["Storytelling", "Vertical Timeline", "Internships Chapter", "Achievements", "Soft Gradients", "Dark Mode"]
  },
  {
    id: 12,
    name: "Swiss One",
    category: "Senior Product Architects & Engineers",
    tagCategory: "Executive & Professional",
    desc: "An ultra-minimal Swiss International typographic portfolio inspired by Dieter Rams & Apple adhering strictly to a 3-color palette (White, Black, Red), huge luxury typography, and clean horizontal row projects.",
    badge: "Swiss One • Minimal 3-Color",
    tags: ["Swiss Style", "3-Color Palette", "Dieter Rams UI", "Clean Rows", "Huge Typography", "Animated Underlines"]
  },
  {
    id: 13,
    name: "Golden Frame",
    category: "Executive Leaders & Directors",
    tagCategory: "Executive & Professional",
    desc: "A luxury brand-inspired executive portfolio featuring a white premium background, soft golden borders (#D4AF37), gold gradients, large profile photo with gold frame ring, and floating glass buttons.",
    badge: "Golden Frame • Luxury Glass",
    tags: ["Golden Frame", "Luxury Brand", "Gold Accents", "Glassmorphism", "Timelines", "Dark Mode"]
  },
  {
    id: 14,
    name: "Float UI",
    category: "Senior Staff Product Architects",
    tagCategory: "Executive & Professional",
    desc: "An Apple-inspired floating glass portfolio where nothing touches each other. Every section lives in an isolated floating glass capsule with glowing hover buttons, levitation animations, and 36-40px rounded corners.",
    badge: "Float UI • Floating Glass",
    tags: ["Float UI", "Apple Design", "Floating Glass Cards", "Levitation UI", "Glowing Buttons", "Dark Mode"]
  },
  {
    id: 15,
    name: "Prism Flow",
    category: "Senior UI/UX Designers & Engineers",
    tagCategory: "Executive & Professional",
    desc: "An Apple, Stripe, Framer & Linear inspired handcrafted portfolio featuring an asymmetrical layout, white background (#FFFFFF), soft gray surfaces (#F8FAFC), emerald & indigo accents, and 24-32px rounded cards.",
    badge: "Prism Flow • Apple & Linear",
    tags: ["Apple Design", "Stripe Aesthetic", "Asymmetrical Grid", "Emerald & Indigo", "24-32px Radius", "Dark Mode"]
  },
  {
    id: 16,
    name: "Horizon Slides",
    category: "Senior Interactive & UI/UX Engineers",
    tagCategory: "Executive & Professional",
    desc: "An Apple, Linear & Framer inspired 100vw x 100vh horizontal storytelling portfolio featuring 7 full-screen slides traversed via mousewheel, touch swipe, or left vertical navigation dock.",
    badge: "Horizon Slides • 100vw Storytelling",
    tags: ["Horizontal Scroll", "100vw x 100vh", "Apple Design", "Linear UI", "Vertical Dock Nav", "Dark Mode"]
  },
  {
    id: 17,
    name: "Metro Flow",
    category: "Principal Product Designers & Architects",
    tagCategory: "Executive & Professional",
    desc: "A Microsoft Fluent Design, Vercel & Notion inspired infinite horizontal workspace portfolio featuring asymmetrical left-to-right sections (Welcome → Skills → Projects → Education → Experience → Certificates Wall → Contact).",
    badge: "Metro Flow • Fluent Canvas",
    tags: ["Microsoft Fluent", "Infinite Workspace", "Horizontal Track", "Sticky Certificates", "Progress Line", "Dark Mode"]
  },
  {
    id: 18,
    name: "Emerald Edge",
    category: "Recruiter Ready & Professionals",
    tagCategory: "Executive & Professional",
    desc: "A recruiter-friendly portfolio template featuring glassmorphism, animated skill pills, vertical timeline education, premium experience cards, project grid, horizontal certifications, floating social links, and direct contact dispatching.",
    badge: "Recruiter Ready • Emerald Glass",
    tags: ["Recruiter Friendly", "Glassmorphism", "Animated Skills", "Vertical Timeline", "Project Grid", "Dark/Light Toggle"]
  }
];

const CATEGORIES = [
  "All Templates",
  "Developers & IDE",
  "3D & Interactive",
  "Creative & Vector",
  "Executive & Professional",
  "Minimal & Academic"
];

const Templates = () => {
  useSEO({
    title: "Portfolio Templates Catalog | ByteBodh - 17+ Modern Designs",
    description: "Browse 17+ interactive developer, academic, 3D, and vector illustration portfolio templates. 1-click preview and instant deployment.",
    keywords: "portfolio templates, developer portfolio, 3D portfolio templates, hacker terminal resume, vector art portfolio, ATS CV maker, bytebodh templates"
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");

  const filteredTemplates = useMemo(() => {
    return ALL_TEMPLATES.filter((tpl) => {
      const matchesCategory =
        selectedCategory === "All Templates" || tpl.tagCategory === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q) ||
        tpl.desc.toLowerCase().includes(q) ||
        tpl.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600 flex flex-col">
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 border-b border-slate-100">
        <div className="absolute top-[15%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
            <FaPalette className="text-emerald-500" size={13} />
            <span>Official Templates Directory</span>
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-slate-900 tracking-tight">
            Templates Designed for <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Every Career</span>
          </h1>

          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Choose from 17+ engineered portfolio designs. Featuring interactive 3D geometry, VS Code IDE compilers, CLI terminals, and vector art illustration showcases.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <FaSearch className="text-slate-400 ml-4 mr-2" size={16} />
              <input
                type="text"
                placeholder="Search templates by name, keyword (e.g. 3D, Terminal, Vector, IDE)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 py-3 px-2 text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg mr-2 font-bold transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES SHOWCASE GRID SECTION */}
      <section className="py-16 bg-slate-50/50 flex-1 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8 border-b border-slate-200/80 pb-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <FaFilter className="text-emerald-500" />
              Showing <span className="text-emerald-600 font-extrabold">{filteredTemplates.length}</span> of {ALL_TEMPLATES.length} Portfolio Templates
            </div>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border border-slate-200/90 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Live Iframe Preview Header */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-200">
                    <iframe
                      src={`/templates/preview/${template.id}`}
                      title={`${template.name} Live Preview`}
                      className="w-[1280px] h-[800px] origin-top-left transform scale-[0.28] sm:scale-[0.34] md:scale-[0.35] border-0 pointer-events-none select-none"
                      loading="lazy"
                    />

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <a
                        href={`/templates/preview/${template.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105"
                      >
                        <FaPlay size={10} /> Live Preview #{template.id}
                      </a>
                    </div>

                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-md text-[10px] font-black text-slate-800 uppercase tracking-wider shadow-sm">
                      Template #{template.id}
                    </div>

                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-emerald-50 backdrop-blur-md border border-emerald-200 rounded-md text-[10px] font-bold text-emerald-700 uppercase tracking-wider shadow-sm">
                      {template.badge}
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
                        {template.name}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                        {template.category}
                      </span>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                        {template.desc}
                      </p>
                    </div>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {template.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                      <a
                        href={`/templates/preview/${template.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                      >
                        Live Preview <FaExternalLinkAlt size={10} />
                      </a>
                      <Link
                        to="/register"
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                      >
                        Use Template <FaArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <FaPalette className="mx-auto text-slate-300 mb-4" size={40} />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No templates found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                No templates matched your query "{searchQuery}". Try searching for another keyword or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Templates");
                }}
                className="px-6 py-2.5 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors shadow-md"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

        {/* BOTTOM CTA SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-10 md:p-14 shadow-xl text-center space-y-6 relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Ready to Launch Your Live Portfolio in 2 Minutes?
              </h2>
              <p className="text-emerald-100 text-sm md:text-base font-medium">
                Join thousands of software engineers, freshers, and tech professionals displaying their background with ByteBodh.
              </p>
            </div>

            <div className="flex justify-center items-center gap-4 flex-wrap relative z-10 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2"
              >
                <FaRocket size={14} /> Get Started Free
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl border border-emerald-400/40 transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>

      <Footer />
    </div>
  );
};

export default Templates;

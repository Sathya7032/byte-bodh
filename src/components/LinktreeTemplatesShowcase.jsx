import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaExternalLinkAlt, FaLink, FaMobileAlt } from "react-icons/fa";
import { LINKTREE_TEMPLATES, LinktreeCardThumbnail } from "../linktree-templates";

/**
 * Public showcase of the Linktree (link-in-bio) templates.
 * Each card renders the real template with demo data, scaled into a phone frame.
 */
const LinktreeTemplatesShowcase = ({
  id = "linktree-templates",
  className = "",
  heading = (
    <>
      Link-in-Bio <span className="text-emerald-500">Linktree Templates</span>
    </>
  ),
  subheading = "One link for your Instagram, LinkedIn or YouTube bio. Pick a design, add your links, and share bytebodh.in/yourname.",
}) => (
  <section id={id} className={`py-24 relative overflow-hidden ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
          <FaLink size={11} /> {LINKTREE_TEMPLATES.length} Bio Link Designs
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{heading}</h2>
        <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto">{subheading}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
        {LINKTREE_TEMPLATES.map((t, idx) => {
          const previewUrl = `/templates/linktree/${t.numericId}`;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.06 }}
              className="group bg-white border border-slate-200/90 hover:border-emerald-500/40 rounded-3xl p-3 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Phone frame with live scaled template */}
              <div className="relative mx-auto w-full max-w-[260px] rounded-[28px] sm:rounded-[34px] bg-slate-900 p-1.5 sm:p-2 shadow-lg">
                <LinktreeCardThumbnail templateId={t.numericId} title={t.name} className="!rounded-[22px] sm:!rounded-[26px] !border-0" />

                <div className="absolute inset-1.5 sm:inset-2 rounded-[22px] sm:rounded-[26px] bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <FaMobileAlt size={12} /> Live Preview
                  </a>
                </div>
              </div>

              <div className="pt-4 sm:pt-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                    {t.name}
                  </h3>
                  <span
                    className={`shrink-0 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      t.isFree
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {t.isFree ? "Free" : "Pro"}
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-slate-500 leading-relaxed mt-1.5 font-medium">{t.description}</p>

                <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] sm:text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    Preview <FaExternalLinkAlt size={9} />
                  </a>
                  <Link
                    to="/register"
                    className="flex-1 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Use Template <FaArrowRight size={9} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default LinktreeTemplatesShowcase;

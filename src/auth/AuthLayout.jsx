import React from "react";
import { Link } from "react-router-dom";

/**
 * Two-column auth shell: brand panel on the left (desktop), form on the right.
 * Shared by Login, Register, Forgot password and Reset password.
 */
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-700">
    {/* Brand panel */}
    <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-emerald-50/40 via-white to-teal-50/40 p-16 flex-col justify-between relative overflow-hidden border-r border-slate-200/50 text-left">
      <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
      <div>
        <Link to="/" className="flex items-center space-x-3 relative z-10 w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
            BB
          </div>
          <div>
            <span className="text-xl font-black text-slate-900">ByteBodh</span>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">AI Portfolio & Linktree</p>
          </div>
        </Link>

        <div className="max-w-md mt-28 relative z-10 space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Create a Site
            <br />
            That Gets You
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Hired.</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed font-medium">
            Join thousands of students and working professionals deploying fast, responsive portfolios and bio link pages on ByteBodh.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["⚡ Ready in minutes", "🌐 Custom Domain URL", "📱 Mobile Ready"].map((t) => (
              <span key={t} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="text-slate-400 text-xs font-semibold relative z-10">© {new Date().getFullYear()} ByteBodh. All rights reserved.</div>
    </aside>

    {/* Form panel */}
    <main className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:p-10 md:p-14 bg-white">
      <div className="w-full max-w-[380px]">
        <div className="lg:hidden flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
              BB
            </div>
            <span className="text-xl font-black text-slate-900">ByteBodh</span>
          </Link>
        </div>

        <div className="space-y-2 mb-7 text-center">
          <h2 className="text-[28px] font-black text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-slate-500 text-sm font-medium">{subtitle}</p>}
        </div>

        {children}

        {footer && <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </main>
  </div>
);

export default AuthLayout;

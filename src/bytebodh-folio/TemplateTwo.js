import React, { useState, useMemo } from "react";
import {
  Terminal,
  Cpu,
  Activity,
  Phone,
  Mail,
  FolderOpen,
  ExternalLink,
  Globe,
  Award,
  Github,
  Linkedin,
  Twitter,
  Sun,
  Moon,
  Copy,
  Check
} from "lucide-react";

const TemplateTwo = ({ profile }) => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);

  // Toggle Theme Function
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Copy Profile Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Nav Item Component for Sidebar
  const NavItem = ({ id, label, icon: Icon }) => {
    const isActive = activeSection === id;
    return (
      <button
        onClick={() => setActiveSection(id)}
        className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-300 font-mono text-xs font-semibold border ${
          isActive
            ? isDarkMode
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
            : isDarkMode
              ? "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200"
              : "text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? (isDarkMode ? "text-emerald-400" : "text-emerald-600") : isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
        <span className="tracking-wider uppercase">{label}</span>
      </button>
    );
  };

  // Parse social platform to icons
  const getSocialIcon = (platform) => {
    const p = (platform || "").toUpperCase();
    if (p.includes("GITHUB")) return <Github className="w-4 h-4" />;
    if (p.includes("LINKEDIN")) return <Linkedin className="w-4 h-4" />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Convert skills structure to consistent layout
  const skillList = useMemo(() => {
    if (!profile?.skills) return [];
    return profile.skills.map((skill) => {
      if (typeof skill === "object" && skill !== null) {
        return { 
          name: skill.name || "Skill", 
          proficiency: skill.proficiency || 80,
          yoe: skill.yearsOfExperience || 2
        };
      }
      return { name: skill, proficiency: 80, yoe: 2 };
    });
  }, [profile?.skills]);

  return (
    <div
      className={`min-h-screen font-mono transition-colors duration-500 overflow-x-hidden relative ${
        isDarkMode
          ? "bg-[#07080d] text-slate-300 selection:bg-emerald-500/20 selection:text-emerald-300"
          : "bg-[#f8fafc] text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-900"
      }`}
    >
      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 bg-[size:40px_40px] pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage: isDarkMode
            ? "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)"
            : "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)"
        }}
      ></div>

      <div className="flex flex-col lg:flex-row min-h-screen relative z-10">
        {/* SIDEBAR NAVIGATION - IDE Workspace Style */}
        <aside
          className={`lg:w-80 border-b lg:border-b-0 lg:border-r p-6 flex flex-col sticky top-0 z-50 h-auto lg:h-screen backdrop-blur-xl transition-colors duration-500 ${
            isDarkMode
              ? "bg-[#0c0d14]/95 border-slate-800/80"
              : "bg-white/95 border-slate-200/90 shadow-lg shadow-slate-200/40"
          }`}
        >
          {/* Workspace Title bar */}
          <div className={`flex items-center justify-between gap-2 mb-6 border-b pb-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
            <div className="flex items-center gap-2">
              <Terminal className={`w-4 h-4 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"} animate-pulse`} />
              <span className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                workspace.env
              </span>
            </div>

            {/* Controls: OS Dots & Light/Dark Theme Switcher */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800"
                    : "bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200 shadow-sm"
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              </div>
            </div>
          </div>

          {/* User profile avatar section */}
          <div className="mb-6 text-center lg:text-left">
            <div className="relative inline-block mb-3">
              {profile?.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName || "User Avatar"}
                  className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border p-1 shadow-xl transition-colors ${
                    isDarkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
                  }`}
                />
              ) : (
                <div
                  className={`w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center text-3xl font-bold border shadow-xl ${
                    isDarkMode
                      ? "bg-slate-950 border-slate-800 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
                >
                  {profile?.fullName?.[0] || "U"}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span
                  className={`relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 ${
                    isDarkMode ? "border-[#0c0d14]" : "border-white"
                  }`}
                ></span>
              </span>
            </div>

            <h1 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              {profile?.fullName || "Developer Name"}
            </h1>
            <p className={`text-xs font-bold uppercase tracking-widest leading-relaxed ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
              {profile?.headline || "Full-Stack Software Engineer"}
            </p>
          </div>

          {/* Terminal details block */}
          <div
            className={`p-3.5 rounded-xl border text-[11px] space-y-1 font-mono mb-6 hidden lg:block ${
              isDarkMode
                ? "bg-slate-950/80 border-slate-800 text-emerald-400"
                : "bg-slate-900 border-slate-800 text-emerald-300"
            }`}
          >
            <div className="text-slate-500">$ system_status</div>
            <div className="text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> COMPILER_ONLINE
            </div>
            <div className="text-slate-500 mt-2">$ user_id</div>
            <div className="text-slate-300 font-semibold uppercase truncate">
              {profile?.user?.username || profile?.fullName?.replace(/\s+/g, "_").toLowerCase() || "guest_user"}
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="flex-1 space-y-1.5 hidden lg:block">
            <NavItem id="overview" label="Overview" icon={Terminal} />
            <NavItem id="skills" label="Tech Stack" icon={Cpu} />
            <NavItem id="experience" label="Journey" icon={Activity} />
            <NavItem id="projects" label="Projects" icon={FolderOpen} />
          </nav>

          {/* Mobile Nav Menu */}
          <div className="flex lg:hidden overflow-x-auto gap-2.5 pb-2 mb-3 no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: Terminal },
              { id: "skills", label: "Tech", icon: Cpu },
              { id: "experience", label: "Journey", icon: Activity },
              { id: "projects", label: "Projects", icon: FolderOpen }
            ].map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-3.5 py-2 rounded-lg whitespace-nowrap text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                    isActive
                      ? isDarkMode
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                      : isDarkMode
                        ? "bg-slate-900 border-slate-800 text-slate-400"
                        : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Actions & Footer details inside sidebar */}
          <div className={`pt-4 border-t mt-auto hidden lg:block ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
            <div className="space-y-2 text-[10px] font-semibold">
              {profile?.email && (
                <div className={`flex items-center gap-2 truncate ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-emerald-500 transition-colors truncate">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile?.mobileNumber && (
                <div className={`flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{profile.mobileNumber}</span>
                </div>
              )}
            </div>

            {/* Social Grid & Copy Link */}
            <div className="flex items-center justify-between gap-2 mt-4">
              <div className="flex flex-wrap gap-2">
                {profile?.socialMediaLinks?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400"
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:border-emerald-500/50 hover:text-emerald-600"
                    }`}
                    title={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>

              <button
                onClick={handleCopyLink}
                className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] font-bold ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    : isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
                title="Copy Profile Link"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY PORT - IDE Code Editor Style */}
        <main
          className={`flex-1 p-6 lg:p-12 overflow-y-auto transition-colors duration-500 ${
            isDarkMode
              ? "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#0f121d] via-[#07080d] to-[#07080d]"
              : "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-[#f8fafc] to-[#f8fafc]"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {/* OVERVIEW TAB */}
            {activeSection === "overview" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Command run banner */}
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                    <span>cat profile_overview.json</span>
                  </div>

                  {/* Styled Codeblock Card */}
                  <div
                    className={`border rounded-2xl p-6 md:p-8 font-mono shadow-2xl relative overflow-hidden backdrop-blur-xl transition-colors ${
                      isDarkMode
                        ? "bg-[#0b0d14]/90 border-slate-800/90 text-slate-200"
                        : "bg-slate-900 border-slate-800 text-emerald-300 shadow-slate-300/40"
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-bl-full blur-xl pointer-events-none"></div>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap italic relative z-10">
                      "{profile?.summary || "Full stack developer crafting high-performance, robust web and software systems."}"
                    </p>
                  </div>
                </div>

                {/* Sub grid for education and certifications */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Education column */}
                  <div className="space-y-4">
                    <div className={`flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                      <span>list-education</span>
                    </div>

                    <div className="space-y-5">
                      {profile?.education?.map((edu, idx) => (
                        <div
                          key={idx}
                          className={`relative pl-5 border-l py-1 group ${
                            isDarkMode ? "border-slate-800/80" : "border-slate-300"
                          }`}
                        >
                          <div
                            className={`absolute left-[-4.5px] top-3 w-2 h-2 rounded-full border transition-colors ${
                              isDarkMode
                                ? "bg-slate-900 border-emerald-400 group-hover:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                : "bg-white border-emerald-600 group-hover:bg-emerald-600 shadow-sm"
                            }`}
                          ></div>
                          <h4
                            className={`font-bold text-sm md:text-base leading-snug transition-colors ${
                              isDarkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"
                            }`}
                          >
                            {edu.degree}
                          </h4>
                          <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{edu.institution}</p>
                          {edu.fieldOfStudy && (
                            <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                              Field: {edu.fieldOfStudy}
                            </p>
                          )}
                          <div className={`flex items-center gap-3 mt-2 text-[10px] font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                            <span>{edu.startDate} — {edu.endDate}</span>
                            {edu.gpa && <span>• GPA: {edu.gpa}</span>}
                          </div>
                        </div>
                      ))}
                      {(!profile?.education || profile.education.length === 0) && (
                        <p className={`text-xs italic ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                          No education modules registered.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Certifications column */}
                  <div className="space-y-4">
                    <div className={`flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                      <span>verify-credentials</span>
                    </div>

                    <div className="grid gap-3">
                      {profile?.certifications?.map((cert, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${
                            isDarkMode
                              ? "bg-[#0b0d14]/70 border-slate-800/80 hover:border-emerald-500/30"
                              : "bg-white border-slate-200/90 shadow-sm hover:border-emerald-500/40 hover:shadow-md"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg border shrink-0 ${
                              isDarkMode
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <h4
                              className={`font-bold text-sm leading-snug transition-colors ${
                                isDarkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"
                              }`}
                            >
                              {cert.name}
                            </h4>
                            <p className={`text-[10px] font-semibold uppercase tracking-wider mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                              {cert.issuingOrganization}
                            </p>
                            {cert.issueDate && (
                              <p className={`text-[9px] mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                Issued: {cert.issueDate}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!profile?.certifications || profile.certifications.length === 0) && (
                        <p className={`text-xs italic ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                          No certified credentials registered.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TECH STACK TAB */}
            {activeSection === "skills" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                    <span>check-dependency-versions</span>
                  </div>

                  <div
                    className={`grid md:grid-cols-2 gap-6 p-6 md:p-8 rounded-2xl border transition-colors ${
                      isDarkMode
                        ? "bg-[#0b0d14]/70 border-slate-800/80"
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    {skillList.map((skill, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-end text-xs font-bold">
                          <span className={isDarkMode ? "text-white" : "text-slate-900"}>{skill.name}</span>
                          <span className={`text-[10px] tracking-widest ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className={`h-2 w-full rounded-full overflow-hidden border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
                          <div
                            className={`h-full transition-all duration-1000 rounded-full ${
                              isDarkMode
                                ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                                : "bg-emerald-600 shadow-sm"
                            }`}
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {skillList.length === 0 && (
                      <p className={`text-xs italic md:col-span-2 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                        No stack dependencies loaded.
                      </p>
                    )}
                  </div>
                </div>

                {/* Offerings/Services */}
                {profile?.services?.length > 0 && (
                  <div className="space-y-4">
                    <div className={`flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                      <span>list-service-packages.py</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {profile.services.map((svc, idx) => (
                        <div
                          key={idx}
                          className={`p-6 rounded-2xl border transition-all flex flex-col justify-between group ${
                            isDarkMode
                              ? "bg-[#0b0d14]/70 border-slate-800/80 hover:border-emerald-500/30"
                              : "bg-white border-slate-200 shadow-sm hover:border-emerald-500/40 hover:shadow-md"
                          }`}
                        >
                          <div>
                            <div
                              className={`text-xs font-bold border px-2.5 py-1 rounded w-fit mb-3 ${
                                isDarkMode
                                  ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                                  : "text-emerald-700 border-emerald-300 bg-emerald-50"
                              }`}
                            >
                              PKG_MODULE_0{idx + 1}
                            </div>
                            <h4
                              className={`font-bold text-lg mb-2 transition-colors ${
                                isDarkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"
                              }`}
                            >
                              {svc.title}
                            </h4>
                            <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                              {svc.description}
                            </p>
                          </div>
                          {svc.price && (
                            <div
                              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border w-fit ${
                                isDarkMode
                                  ? "text-emerald-400 bg-slate-900 border-slate-800"
                                  : "text-emerald-700 bg-slate-100 border-slate-200"
                              }`}
                            >
                              RATE: {svc.price}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeSection === "experience" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className={`flex items-center gap-2 text-xs font-semibold mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                  <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                  <span>git log --graph --oneline --decorate</span>
                </div>

                <div className={`space-y-8 relative pl-7 border-l ${isDarkMode ? "border-slate-800/80" : "border-slate-300"}`}>
                  {profile?.experience?.map((exp, idx) => (
                    <div key={idx} className="relative group">
                      {/* Git Graph Node */}
                      <div className="absolute -left-[39px] top-1 flex flex-col items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
                            isDarkMode
                              ? "bg-[#07080d] border-emerald-400 group-hover:bg-emerald-400"
                              : "bg-white border-emerald-600 group-hover:bg-emerald-600"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? "bg-emerald-400 group-hover:bg-slate-900" : "bg-emerald-600 group-hover:bg-white"}`}></div>
                        </div>
                      </div>

                      <div
                        className={`border p-6 md:p-8 rounded-2xl transition-all relative ${
                          isDarkMode
                            ? "bg-[#0b0d14]/70 border-slate-800/80 group-hover:border-emerald-500/30"
                            : "bg-white border-slate-200 shadow-sm group-hover:border-emerald-500/40 group-hover:shadow-md"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <h3
                              className={`text-lg md:text-xl font-bold transition-colors ${
                                isDarkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"
                              }`}
                            >
                              {exp.position}
                            </h3>
                            <div className={`font-bold text-xs mt-0.5 uppercase tracking-wider ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                              {exp.company} {exp.location && `• ${exp.location}`}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold border px-3 py-1 rounded-full self-start sm:self-auto uppercase tracking-widest whitespace-nowrap ${
                              isDarkMode
                                ? "bg-slate-900 border-slate-800 text-slate-400"
                                : "bg-slate-100 border-slate-200 text-slate-600"
                            }`}
                          >
                            {exp.startDate} — {exp.endDate || "Present"}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed whitespace-pre-wrap ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!profile?.experience || profile.experience.length === 0) && (
                    <p className={`text-xs italic ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                      No log entries found in developer journey.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeSection === "projects" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                    <span>dir --list-projects</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {profile?.projects?.map((project, idx) => (
                      <div
                        key={idx}
                        className={`group border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                          isDarkMode
                            ? "bg-[#0b0d14]/70 border-slate-800/80 hover:border-emerald-500/30"
                            : "bg-white border-slate-200 shadow-sm hover:border-emerald-500/40 hover:shadow-md"
                        }`}
                      >
                        {/* Repository header bar */}
                        <div
                          className={`px-5 py-3 border-b flex justify-between items-center text-[10px] font-bold ${
                            isDarkMode ? "bg-slate-950 border-slate-900 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className={`flex items-center gap-2 truncate ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            repo: {project.title?.toLowerCase().replace(/\s+/g, "-")}
                          </span>
                          <span>public_src</span>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3
                              className={`text-lg font-bold mb-2 transition-colors ${
                                isDarkMode ? "text-white group-hover:text-emerald-400" : "text-slate-900 group-hover:text-emerald-600"
                              }`}
                            >
                              {project.title}
                            </h3>
                            <p className={`text-xs mb-4 leading-relaxed line-clamp-3 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                              {project.description}
                            </p>
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {(project.technologies || project.techStack?.split(",") || []).map((tech, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${
                                    isDarkMode
                                      ? "bg-slate-900 text-emerald-400/90 border-emerald-500/20"
                                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  }`}
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>

                            {(project.link || project.projectUrl) && (
                              <a
                                href={project.link || project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-bold inline-flex items-center gap-1.5 text-xs group/link uppercase tracking-widest transition-colors ${
                                  isDarkMode ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-700 hover:text-emerald-800"
                                }`}
                              >
                                EXECUTE_BIN <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!profile?.projects || profile.projects.length === 0) && (
                      <p className={`text-xs italic md:col-span-2 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                        No repository folders listed.
                      </p>
                    )}
                  </div>
                </div>

                {/* Gallery */}
                {(profile?.gallery?.length > 0 || profile?.youtubeVideoLinks?.length > 0) && (
                  <div className="space-y-4 mt-10">
                    <div className={`flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      <span className={isDarkMode ? "text-emerald-400" : "text-emerald-600"}>guest@bytebodh:~$</span>
                      <span>load-media-assets --grid</span>
                    </div>

                    <div
                      className={`p-6 md:p-8 rounded-2xl border space-y-6 ${
                        isDarkMode ? "bg-[#0b0d14]/70 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                      }`}
                    >
                      {profile?.gallery?.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {profile.gallery.map((img, idx) => (
                            <div
                              key={idx}
                              className={`aspect-square rounded-xl overflow-hidden border cursor-pointer relative group transition-all ${
                                isDarkMode ? "bg-slate-950 border-slate-800 hover:border-emerald-500/40" : "bg-slate-100 border-slate-200 hover:border-emerald-500/50 shadow-sm"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={img.caption || "Media item"}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500 transform group-hover:scale-105"
                              />
                              {img.caption && (
                                <div
                                  className={`absolute inset-x-0 bottom-0 border-t p-2 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity truncate ${
                                    isDarkMode ? "bg-slate-950/90 border-slate-800 text-slate-300" : "bg-white/95 border-slate-200 text-slate-700"
                                  }`}
                                >
                                  {img.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {profile?.youtubeVideoLinks?.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-6">
                          {profile.youtubeVideoLinks.map((vid, idx) => (
                            <div
                              key={idx}
                              className={`aspect-video rounded-2xl overflow-hidden border shadow-xl ${
                                isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-900 border-slate-800"
                              }`}
                            >
                              <iframe
                                src={vid.url?.replace("watch?v=", "embed/") || ""}
                                title={vid.title || "Video Showcase"}
                                className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SYSTEM STATUS FOOTER */}
            <div
              className={`mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-widest uppercase ${
                isDarkMode ? "border-slate-800/80 text-slate-500" : "border-slate-200 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-emerald-400" : "bg-emerald-600"}`}></span>
                HOST: BYTEBODH_TER_V2.0 ({isDarkMode ? "DARK_MODE" : "LIGHT_MODE"})
              </div>
              <div>SYSTEM_DATE: {new Date().getFullYear()}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TemplateTwo;
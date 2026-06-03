import React, { useState, useMemo } from "react";
import {
  Terminal,
  Cpu,
  Layers,
  Activity,
  Phone,
  Mail,
  FolderOpen,
  ExternalLink,
  Globe,
  MapPin,
  Award,
  GraduationCap,
  Sparkles,
  FileCode,
  Github,
  Linkedin,
  Twitter,
  ChevronRight,
  Briefcase
} from "lucide-react";

const TemplateTwo = ({ profile }) => {
  const [activeSection, setActiveSection] = useState("overview");

  // Nav Item Component for Sidebar
  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-4 w-full px-5 py-3.5 rounded-xl transition-all duration-300 font-mono text-sm border ${
        activeSection === id
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          : "text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-slate-200"
      }`}
    >
      <Icon className={`w-4 h-4 ${activeSection === id ? "text-emerald-400" : "text-slate-500"}`} />
      <span className="font-semibold tracking-wider uppercase">{label}</span>
    </button>
  );

  // Parse social platform to icons
  const getSocialIcon = (platform) => {
    const p = platform.toUpperCase();
    if (p.includes("GITHUB")) return <Github className="w-4 h-4" />;
    if (p.includes("LINKEDIN")) return <Linkedin className="w-4 h-4" />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Convert skills structure to consistent layout
  const skillList = useMemo(() => {
    if (!profile.skills) return [];
    return profile.skills.map((skill) => {
      if (typeof skill === "object" && skill !== null) {
        return { 
          name: skill.name, 
          proficiency: skill.proficiency || 80,
          yoe: skill.yearsOfExperience || 2
        };
      }
      return { name: skill, proficiency: 80, yoe: 2 };
    });
  }, [profile.skills]);

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-300 font-mono selection:bg-emerald-500/20 selection:text-emerald-300 overflow-x-hidden relative">
      
      {/* Subtle Matrix-style Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      
      <div className="flex flex-col lg:flex-row min-h-screen relative z-10">
        
        {/* SIDEBAR NAVIGATION - IDE Workspace Style */}
        <aside className="lg:w-80 bg-[#0c0d12]/95 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-6 flex flex-col sticky top-0 z-50 h-auto lg:h-screen backdrop-blur-xl">
          
          {/* Workspace Title bar */}
          <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-4 justify-between lg:justify-start">
            <div className="flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">workspace.env</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
            </div>
          </div>

          {/* User profile avatar section */}
          <div className="mb-8 text-center lg:text-left">
            <div className="relative inline-block mb-4">
              {profile.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName}
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border border-slate-800 shadow-2xl p-1 bg-slate-950"
                />
              ) : (
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl font-bold border border-slate-800 text-emerald-400">
                  {profile.fullName?.[0]}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0c0d12]"></span>
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1">{profile.fullName}</h1>
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
              {profile.headline}
            </p>
          </div>

          {/* Terminal details block */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-[11px] space-y-1 font-mono text-emerald-400 mb-6 hidden lg:block">
            <div className="text-slate-500">$ system_status</div>
            <div className="text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> COMPILER_ONLINE
            </div>
            <div className="text-slate-500 mt-2">$ user_id</div>
            <div className="text-slate-300 font-semibold uppercase truncate">
              {profile.user?.username || profile.fullName?.replace(/\s+/g, "_").toLowerCase()}
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
          <div className="flex lg:hidden overflow-x-auto gap-3 pb-3 mb-2 no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: Terminal },
              { id: "skills", label: "Tech", icon: Cpu },
              { id: "experience", label: "Journey", icon: Activity },
              { id: "projects", label: "Projects", icon: FolderOpen }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                  activeSection === tab.id 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Footer details inside sidebar */}
          <div className="pt-4 border-t border-slate-800/80 mt-auto hidden lg:block">
            <div className="space-y-2 text-[10px] text-slate-500 font-semibold">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">{profile.email}</span>
              </div>
              {profile.mobileNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{profile.mobileNumber}</span>
                </div>
              )}
            </div>
            
            {/* Social Grid */}
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.socialMediaLinks?.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 flex items-center justify-center bg-slate-950 border border-slate-800 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 rounded-lg transition-all"
                  title={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

        </aside>

        {/* MAIN DISPLAY PORT - IDE Code Editor Style */}
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#0f1118] via-[#07080a] to-[#07080a]">
          
          <div className="max-w-4xl mx-auto">
            
            {/* OVERVIEW TAB */}
            {activeSection === "overview" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Command run banner */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="text-emerald-500">guest@bytebodh:~$</span>
                    <span>cat profile_overview.json</span>
                  </div>
                  
                  {/* Styled Codeblock Card */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 md:p-8 font-mono shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full blur-xl"></div>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap italic relative z-10">
                      "{profile.summary || "Full stack developer producing robust code systems."}"
                    </p>
                  </div>
                </div>

                {/* Sub grid for education and certifications */}
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Education column */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                      <span className="text-emerald-500">guest@bytebodh:~$</span>
                      <span>list-education</span>
                    </div>

                    <div className="space-y-6">
                      {profile.education?.map((edu, idx) => (
                        <div key={idx} className="relative pl-6 border-l border-slate-800/80 py-1 group">
                          <div className="absolute left-[-4.5px] top-3 w-2 h-2 rounded-full bg-slate-900 border border-emerald-500 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                          <h4 className="text-white font-bold text-base leading-snug group-hover:text-emerald-400 transition-colors">
                            {edu.degree}
                          </h4>
                          <p className="text-slate-400 text-xs mt-1">{edu.institution}</p>
                          {edu.fieldOfStudy && (
                            <p className="text-[11px] text-slate-500 mt-0.5">Field: {edu.fieldOfStudy}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-emerald-500/80">
                            <span>{edu.startDate} — {edu.endDate}</span>
                            {edu.gpa && <span>• GPA: {edu.gpa}</span>}
                          </div>
                        </div>
                      ))}
                      {(!profile.education || profile.education.length === 0) && (
                        <p className="text-xs text-slate-600 italic">No education modules registered.</p>
                      )}
                    </div>
                  </div>

                  {/* Certifications column */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                      <span className="text-emerald-500">guest@bytebodh:~$</span>
                      <span>verify-credentials</span>
                    </div>

                    <div className="grid gap-3">
                      {profile.certifications?.map((cert, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex items-start gap-3.5 group">
                          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 shrink-0">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm leading-snug group-hover:text-emerald-400 transition-colors">
                              {cert.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
                              {cert.issuingOrganization}
                            </p>
                            {cert.issueDate && (
                              <p className="text-[9px] text-slate-600 mt-0.5">Issued: {cert.issueDate}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!profile.certifications || profile.certifications.length === 0) && (
                        <p className="text-xs text-slate-600 italic">No certified credentials registered.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TECH STACK TAB */}
            {activeSection === "skills" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="text-emerald-500">guest@bytebodh:~$</span>
                    <span>check-dependency-versions</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 bg-slate-950/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl">
                    {skillList.map((skill, idx) => (
                      <div key={idx} className="space-y-2.5">
                        <div className="flex justify-between items-end text-xs font-bold">
                          <span className="text-white font-mono">{skill.name}</span>
                          <span className="text-emerald-400 font-mono text-[10px] tracking-widest">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                          <div 
                            className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-1000 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {skillList.length === 0 && (
                      <p className="text-xs text-slate-600 italic md:col-span-2">No stack dependencies loaded.</p>
                    )}
                  </div>
                </div>

                {/* Offerings/Services */}
                {profile.services?.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="text-emerald-500">guest@bytebodh:~$</span>
                      <span>list-service-packages.py</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {profile.services.map((svc, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/20 transition-all flex flex-col justify-between group">
                          <div>
                            <div className="text-emerald-400 text-xs font-bold border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded w-fit mb-4">
                              PKG_MODULE_0{idx + 1}
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                              {svc.title}
                            </h4>
                            <p className="text-slate-400 text-xs leading-relaxed mb-4">
                              {svc.description}
                            </p>
                          </div>
                          {svc.price && (
                            <div className="text-xs font-bold text-emerald-400 bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-800/80 w-fit">
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
                
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
                  <span className="text-emerald-500">guest@bytebodh:~$</span>
                  <span>git log --graph --oneline --decorate</span>
                </div>

                <div className="space-y-10 relative pl-8 border-l border-slate-800/80">
                  {profile.experience?.map((exp, idx) => (
                    <div key={idx} className="relative group">
                      
                      {/* Git Graph Node */}
                      <div className="absolute -left-[43px] top-1 flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-[#07080a] border-2 border-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-slate-900"></div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 border border-slate-800/80 p-6 md:p-8 rounded-3xl group-hover:border-emerald-500/20 transition-all relative">
                        <div className="absolute top-4 -left-2 w-3.5 h-3.5 bg-slate-950 border-b border-l border-slate-800/80 rotate-45 hidden md:block"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {exp.position}
                            </h3>
                            <div className="text-emerald-500/80 font-bold text-xs mt-1 uppercase tracking-wider">
                              {exp.company} {exp.location && `• ${exp.location}`}
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full self-start sm:self-auto uppercase tracking-widest whitespace-nowrap">
                            {exp.startDate} — {exp.endDate || "Present"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!profile.experience || profile.experience.length === 0) && (
                    <p className="text-xs text-slate-600 italic">No log entries found in developer journey.</p>
                  )}
                </div>

              </div>
            )}

            {/* PROJECTS TAB */}
            {activeSection === "projects" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="text-emerald-500">guest@bytebodh:~$</span>
                    <span>dir --list-projects</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {profile.projects?.map((project, idx) => (
                      <div key={idx} className="group bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                        
                        {/* Repository header bar */}
                        <div className="bg-slate-950 px-5 py-3 border-b border-slate-900 flex justify-between items-center text-[10px] font-bold text-slate-500">
                          <span className="flex items-center gap-2 text-emerald-400 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            repo: {project.title?.toLowerCase().replace(/\s+/g, "-")}
                          </span>
                          <span>public_src</span>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-slate-400 text-xs mb-4 leading-relaxed line-clamp-3">
                              {project.description}
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-5">
                              {(project.technologies || project.techStack?.split(",") || []).map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-900 text-[9px] font-bold text-emerald-500/70 border border-emerald-500/10 rounded uppercase">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                            
                            {(project.link || project.projectUrl) && (
                              <a 
                                href={project.link || project.projectUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-emerald-400 font-bold inline-flex items-center gap-1.5 text-xs group/link uppercase tracking-widest hover:text-emerald-300 transition-colors"
                              >
                                EXECUTE_BIN <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                    {(!profile.projects || profile.projects.length === 0) && (
                      <p className="text-xs text-slate-600 italic md:col-span-2">No repository folders listed.</p>
                    )}
                  </div>
                </div>

                {/* Gallery */}
                {(profile.gallery?.length > 0 || profile.youtubeVideoLinks?.length > 0) && (
                  <div className="space-y-6 mt-12">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="text-emerald-500">guest@bytebodh:~$</span>
                      <span>load-media-assets --grid</span>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-800/80 p-6 md:p-8 rounded-2xl space-y-6">
                      {profile.gallery?.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {profile.gallery.map((img, idx) => (
                            <div key={idx} className="aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer relative group">
                              <img src={img.url} alt={img.caption} className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                              {img.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 border-t border-slate-850 p-2 text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                  {img.caption}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {profile.youtubeVideoLinks?.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-6">
                          {profile.youtubeVideoLinks.map((vid, idx) => (
                            <div key={idx} className="aspect-video rounded-2xl overflow-hidden border border-slate-850 bg-slate-950 shadow-2xl">
                              <iframe 
                                src={vid.url?.replace("watch?v=", "embed/") || ""} 
                                title={vid.title} 
                                className="w-full h-full opacity-80 hover:opacity-100 transition-opacity" 
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
            <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] font-bold tracking-widest uppercase">
              <div>HOST: BYTEBODH_TER_V2.0</div>
              <div>SYSTEM_DATE: {new Date().getFullYear()}</div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TemplateTwo;
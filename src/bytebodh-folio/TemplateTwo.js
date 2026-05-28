import React, { useState } from "react";

const TemplateTwo = ({ profile }) => {
  const [activeSection, setActiveSection] = useState("overview");

  const NavItem = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-4 w-full px-6 py-4 rounded-xl transition-all duration-300 ${
        activeSection === id
          ? "bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Sidebar Navigation */}
        <aside className="lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-8 flex flex-col sticky top-0 z-50 h-auto lg:h-screen">
          <div className="mb-12 text-center lg:text-left">
            <div className="relative inline-block mb-6">
              {profile.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName}
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover ring-2 ring-emerald-500/50 ring-offset-4 ring-offset-slate-900 shadow-2xl shadow-emerald-500/20"
                />
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl border-2 border-emerald-500/30">
                  {profile.fullName?.[0]}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{profile.fullName}</h1>
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest">{profile.headline}</p>
          </div>

          <nav className="flex-1 space-y-2 mb-8 hidden lg:block">
            <NavItem id="overview" label="Overview" icon="📁" />
            <NavItem id="skills" label="Tech Stack" icon="⚡" />
            <NavItem id="experience" label="Journey" icon="🚀" />
            <NavItem id="projects" label="Projects" icon="🛠️" />
          </nav>

          {/* Mobile Nav */}
          <div className="flex lg:hidden overflow-x-auto gap-4 pb-4 mb-4 no-scrollbar">
            {["overview", "skills", "experience", "projects"].map((id) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-all ${
                  activeSection === id ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-800">
            <div className="space-y-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-emerald-500">@</span>
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-500">#</span>
                <span>{profile.mobileNumber}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              {profile.socialMediaLinks?.map((link, idx) => (
                <a key={idx} href={link.url} className="text-slate-500 hover:text-emerald-400 transition-colors text-lg" title={link.platform}>
                  ◈
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          
          <div className="max-w-5xl mx-auto">
            
            {activeSection === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-12">
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 flex items-center gap-4">
                    <span className="text-emerald-500">01.</span> Overview
                  </h2>
                  <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
                    <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap italic">
                      " {profile.summary} "
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-emerald-500"></span> Education
                    </h3>
                    {profile.education?.map((edu, idx) => (
                      <div key={idx} className="relative pl-6 border-l border-slate-800 py-2">
                        <div className="absolute left-[-5px] top-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <h4 className="text-white font-bold text-lg">{edu.degree}</h4>
                        <p className="text-emerald-400 text-sm mb-2">{edu.institution}</p>
                        <span className="text-xs text-slate-500 font-bold">{edu.startDate} - {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-emerald-500"></span> Certifications
                    </h3>
                    <div className="grid gap-4">
                      {profile.certifications?.map((cert, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all group">
                          <h4 className="text-white font-bold group-hover:text-emerald-400 transition-colors">{cert.name}</h4>
                          <p className="text-xs text-slate-500">{cert.issuingOrganization}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "skills" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-12 flex items-center gap-4">
                  <span className="text-emerald-500">02.</span> Tech Stack
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.skills?.map((skill, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800/50 transition-all">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-white font-bold text-lg">{skill.name}</span>
                        <span className="text-emerald-500 text-xs font-bold tracking-tighter">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000"
                          style={{ width: `${skill.proficiency || 80}%` }}
                        ></div>
                      </div>
                      <p className="mt-3 text-xs text-slate-500 font-bold uppercase tracking-widest">{skill.yearsOfExperience}+ years exp</p>
                    </div>
                  ))}
                </div>
                
                {profile.services?.length > 0 && (
                  <div className="mt-20">
                    <h3 className="text-2xl font-bold text-white mb-8">Service Modules</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {profile.services?.map((svc, idx) => (
                        <div key={idx} className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
                          <div className="text-2xl mb-4">▣</div>
                          <h4 className="text-emerald-400 font-bold text-xl mb-2">{svc.title}</h4>
                          <p className="text-slate-400 text-sm mb-4 leading-relaxed">{svc.description}</p>
                          {svc.price && <span className="text-white font-mono font-bold px-3 py-1 bg-slate-800 rounded-lg">{svc.price}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === "experience" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-12 flex items-center gap-4">
                  <span className="text-emerald-500">03.</span> Journey
                </h2>
                <div className="space-y-12">
                  {profile.experience?.map((exp, idx) => (
                    <div key={idx} className="group relative grid md:grid-cols-[200px_1fr] gap-8">
                      <div className="text-slate-500 font-bold text-sm pt-2">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group-hover:border-emerald-500/30 transition-all relative">
                        <div className="absolute top-8 -left-2 w-4 h-4 bg-emerald-500 rotate-45 hidden md:block"></div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{exp.position}</h3>
                        <div className="text-emerald-500/70 font-bold mb-6 tracking-widest uppercase text-xs">{exp.company}</div>
                        <p className="text-slate-400 leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "projects" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-12 flex items-center gap-4">
                  <span className="text-emerald-500">04.</span> Projects
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {profile.projects?.map((project, idx) => (
                    <div key={idx} className="group flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                      <div className="h-48 bg-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                          {project.technologies?.map((tech, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-950 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 rounded uppercase">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed">{project.description}</p>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold inline-flex items-center gap-2 group/link">
                            EXECUTE_PROJECT <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {profile.gallery?.length > 0 && (
                  <div className="mt-20">
                    <h3 className="text-2xl font-bold text-white mb-8">Visual Repository</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                      {profile.gallery?.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-slate-800 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer border border-slate-700">
                          <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    {profile.youtubeVideoLinks?.length > 0 && (
                      <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {profile.youtubeVideoLinks.map((vid, idx) => (
                          <div key={idx} className="aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                             <iframe 
                               src={vid.url?.replace("watch?v=", "embed/") || ""} 
                               title={vid.title} 
                               className="w-full h-full opacity-80 hover:opacity-100 transition-opacity" 
                               frameBorder="0" 
                               allowFullScreen
                             ></iframe>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Footer Placeholder for mobile visibility */}
            <div className="mt-20 pt-12 border-t border-slate-800 text-center lg:text-left">
               <p className="text-slate-600 text-xs font-bold tracking-[0.2em] uppercase">
                System Status: Online | User: {profile.fullName?.replace(" ", "_").toUpperCase()}
               </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default TemplateTwo;
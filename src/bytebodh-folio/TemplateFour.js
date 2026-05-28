import React from "react";

const TemplateFour = ({ profile }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Premium Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0a0a0c]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Profile Header Card */}
        <header className="mb-12 md:mb-20">
           <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                {profile.pictureUrl ? (
                  <img src={profile.pictureUrl} alt={profile.fullName} className="relative w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-white/10 shadow-2xl" />
                ) : (
                  <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-slate-800 flex items-center justify-center text-7xl font-bold border-4 border-white/10">
                    {profile.fullName?.[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                   {profile.fullName}
                 </h1>
                 <p className="text-xl md:text-2xl font-bold text-indigo-400 mb-6 uppercase tracking-widest">{profile.headline}</p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <a href={`mailto:${profile.email}`} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-indigo-500 hover:text-white transition-all">
                      Contact Me
                    </a>
                    <div className="flex gap-3">
                       {profile.socialMediaLinks?.map((link, idx) => (
                         <a key={idx} href={link.url} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/20 transition-all" title={link.platform}>
                            <span className="text-sm font-bold opacity-70">{link.platform[0]}</span>
                         </a>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Main Grid Content */}
        <div className="grid lg:grid-cols-3 gap-8">
           
           {/* Left Column - Stats & About */}
           <div className="lg:col-span-1 space-y-8">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Expertise</h3>
                 <div className="space-y-6">
                    {profile.skills?.map((skill, idx) => (
                      <div key={idx}>
                         <div className="flex justify-between text-sm font-bold mb-2">
                           <span>{skill.name}</span>
                           <span className="opacity-50">{skill.proficiency}%</span>
                         </div>
                         <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${skill.proficiency}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-6">Quick Links</h3>
                 <div className="space-y-4 font-bold text-sm">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                       <span className="text-xl">📧</span>
                       <span className="truncate opacity-70">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                       <span className="text-xl">📱</span>
                       <span className="opacity-70">{profile.mobileNumber}</span>
                    </div>
                 </div>
              </div>

              {profile.certifications?.length > 0 && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8">
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Verified</h3>
                   <div className="grid gap-4">
                      {profile.certifications?.map((cert, idx) => (
                        <div key={idx} className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                           <p className="font-bold text-sm">{cert.name}</p>
                           <p className="text-[10px] opacity-50 font-black uppercase tracking-widest mt-1">{cert.issuingOrganization}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>

           {/* Right Column - Timeline & Projects */}
           <div className="lg:col-span-2 space-y-8">
              
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-10">Summary</h3>
                 <p className="text-2xl font-bold leading-tight text-white/80 italic">
                   "{profile.summary}"
                 </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 {profile.projects?.map((project, idx) => (
                   <div key={idx} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-all group">
                      <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">🚀</div>
                      <h4 className="text-2xl font-black mb-3">{project.title}</h4>
                      <p className="text-sm text-white/60 mb-6 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.technologies?.map((tech, i) => (
                          <span key={i} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5">{tech}</span>
                        ))}
                      </div>
                      {project.link && (
                        <a href={project.link} className="inline-flex items-center gap-2 font-black text-xs text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                          Launch Prototype →
                        </a>
                      )}
                   </div>
                 ))}
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-10">Experience</h3>
                 <div className="space-y-12">
                    {profile.experience?.map((exp, idx) => (
                      <div key={idx} className="relative pl-8 border-l border-white/10 py-2">
                         <div className="absolute left-[-1px] top-0 w-[2px] h-full bg-gradient-to-b from-indigo-500 to-transparent"></div>
                         <div className="mb-2 flex flex-wrap justify-between items-center gap-4">
                            <h4 className="text-2xl font-black">{exp.position}</h4>
                            <span className="text-[10px] font-black px-3 py-1 bg-white/10 rounded-full text-indigo-400">{exp.startDate} — {exp.endDate || "PRESENT"}</span>
                         </div>
                         <p className="text-lg font-bold text-white/50 mb-4">{exp.company}</p>
                         <p className="text-sm text-white/60 leading-relaxed max-w-2xl">{exp.description}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">Education</h3>
                    <div className="space-y-6">
                       {profile.education?.map((edu, idx) => (
                         <div key={idx} className="group">
                            <h4 className="font-black text-lg mb-1 group-hover:text-indigo-400 transition-colors">{edu.degree}</h4>
                            <p className="text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">{edu.institution}</p>
                            <p className="text-[10px] font-black text-indigo-500/70">{edu.startDate} — {edu.endDate}</p>
                         </div>
                       ))}
                    </div>
                 </div>
                 {profile.services?.length > 0 && (
                   <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-8">Offerings</h3>
                      <div className="space-y-6">
                         {profile.services?.map((svc, idx) => (
                           <div key={idx}>
                              <p className="font-black mb-1">{svc.title}</p>
                              <p className="text-xs text-white/50">{svc.description}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

           </div>
        </div>

        {/* Gallery & Media Section */}
        {(profile.gallery?.length > 0 || profile.youtubeVideoLinks?.length > 0) && (
          <section className="mt-8 space-y-8">
             <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-10">Media Artifacts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
                   {profile.gallery?.map((img, idx) => (
                     <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer">
                        <img src={img.url} alt={img.caption} className="w-full h-full object-cover hover:scale-110 transition duration-700" />
                     </div>
                   ))}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {profile.youtubeVideoLinks?.map((vid, idx) => (
                     <div key={idx} className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <iframe src={vid.url?.replace("watch?v=", "embed/") || ""} title={vid.title} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                     </div>
                   ))}
                </div>
             </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
             © {new Date().getFullYear()} {profile.fullName} • Executive Portfolio 2.0
           </p>
        </footer>

      </div>
    </div>
  );
};

export default TemplateFour;
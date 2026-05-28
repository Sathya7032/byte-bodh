import React from "react";

const TemplateOne = ({ profile }) => {
  const getSkillName = (skill) => {
    if (typeof skill === "string") return skill;
    return skill?.name || "";
  };


  const formatUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const skills = profile.skills || [];
  const experience = profile.experience || [];
  const education = profile.education || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-700 flex justify-center items-start relative z-0">
      
      {/* Resume Card Container */}
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-none p-8 md:p-16 border border-slate-200/60 relative overflow-hidden">
        
        {/* Diagonal Watermark Background */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden opacity-[0.02] z-0">
          <div className="text-[12rem] font-black uppercase tracking-[0.2em] rotate-[-30deg]">
            ByteBodh
          </div>
        </div>

        {/* Small Watermark Label at top right */}
        <div className="absolute top-4 right-4 bg-slate-50 border border-slate-200/80 rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400 select-none z-10 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          ByteBodh Folio
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header Block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                {profile.fullName}
              </h1>
              <p className="text-lg font-bold text-indigo-600 tracking-wide uppercase text-xs">
                {profile.headline}
              </p>
              
              {/* Contact Grid */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs font-semibold text-slate-500">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="hover:text-indigo-600 transition-colors">
                    {profile.email}
                  </a>
                )}
                {profile.mobileNumber && (
                  <>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span>{profile.mobileNumber}</span>
                  </>
                )}
                {profile.location && (
                  <>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span>{profile.location}</span>
                  </>
                )}
              </div>

              {/* Social Links List */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs font-bold text-indigo-600">
                {profile.socialMediaLinks?.map((link, idx) => (
                  <a
                    key={idx}
                    href={formatUrl(link.profileUrl || link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {profile.pictureUrl ? (
                <img
                  src={profile.pictureUrl}
                  alt={profile.fullName}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-none border border-slate-300 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl font-black text-slate-300">
                  {profile.fullName?.[0]}
                </div>
              )}
            </div>
          </div>

          {/* Objective / Summary */}
          {profile.summary && (
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Professional Summary
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {profile.summary}
              </p>
            </div>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-50 border border-slate-200/80 rounded text-xs font-semibold text-slate-700 hover:border-indigo-500 hover:bg-indigo-50/20 transition-all duration-300"
                  >
                    {getSkillName(skill)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b border-slate-100 pb-1">
                Work Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="font-bold text-slate-800">
                        {exp.position} <span className="font-medium text-slate-400">@</span> {exp.company}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-xs text-slate-400 font-semibold">{exp.location}</p>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b border-slate-100 pb-1">
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="font-bold text-slate-800">
                        {edu.degree} {edu.fieldOfStudy && <>in {edu.fieldOfStudy}</>}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        {edu.startDate || edu.startYear} - {edu.endDate || edu.endYear}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                      <span>{edu.institution}</span>
                      {(edu.gpa || edu.percentage || edu.cgpa) && (
                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          Score: {edu.gpa || edu.percentage || edu.cgpa}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b border-slate-100 pb-1">
                Key Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50/50 border border-slate-200/60 hover:border-indigo-400 transition-all rounded duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{project.title}</h3>
                      <p className="text-slate-500 text-[11px] leading-relaxed mb-3 line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {(project.techStack || "").split(",").slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-slate-100 text-[8px] font-bold text-slate-500 uppercase rounded"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      {project.projectUrl || project.link ? (
                        <a
                          href={formatUrl(project.projectUrl || project.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-black text-indigo-600 hover:underline"
                        >
                          Link ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 border-b border-slate-100 pb-1">
                Certifications & Achievements
              </h2>
              <div className="grid md:grid-cols-2 gap-2 text-xs">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded"
                  >
                    <span className="text-base select-none">🎖️</span>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{cert.name}</p>
                      {cert.issuingOrganization && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {cert.issuingOrganization} {cert.issueDate ? `• ${cert.issueDate}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Watermark Branding stamp at bottom */}
          <div className="pt-8 border-t border-slate-200/80 text-center select-none">
            <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase flex items-center justify-center gap-1.5">
              <span>Powered By</span>
              <span className="text-indigo-500 font-extrabold">ByteBodh Folio</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateOne;

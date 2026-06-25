import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaArrowLeft, FaSpinner } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getJobNotificationById } from "../api/jobNotifications";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract actual ID from slug (slug format: "job-title-123" -> extract 123)
  const extractIdFromSlug = (slug) => {
    const parts = slug.split("-");
    return parts[parts.length - 1]; // Get the last part which is the ID
  };

  const actualId = extractIdFromSlug(id);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await getJobNotificationById(actualId);
        let jobData = res.data.data;
        
        jobData = {
          id: jobData.id,
          title: jobData.jobTitle,
          company: jobData.companyName,
          location: jobData.location,
          description: jobData.jobDescription,
          jobLink: jobData.jobLink,
          applicationDeadline: jobData.applicationDeadline,
          employmentType: jobData.employmentType,
          experienceRequired: jobData.experienceRequired,
          requiredSkills: jobData.requiredSkills,
          requirements: jobData.requirements,
          isActive: jobData.isActive
        };
        
        setJob(jobData);
        setError(null);
      } catch (err) {
        setError("Failed to load job details. Please try again later.");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [actualId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-emerald-500 text-4xl mb-4" />
          <p className="text-slate-500 font-semibold">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center max-w-2xl mx-auto px-6 text-center space-y-6">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">
            Job Details Not Found
          </h3>
          <p className="text-slate-500 font-medium">
            {error || "The requested job opening could not be found."}
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all"
          >
            <FaArrowLeft />
            Back to Jobs
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-left space-y-6">
          <div>
            <button 
              onClick={() => navigate("/jobs")}
              className="inline-flex items-center text-slate-500 hover:text-emerald-500 font-bold text-sm transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Jobs
            </button>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-600 text-xs font-black uppercase tracking-wider">
            <span>{job.employmentType || "Job Opportunity"}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {job.title}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-slate-400 text-xs font-semibold uppercase tracking-wider border-t border-slate-200/50 pt-4">
            <div className="flex items-center gap-1.5">
              <FaBriefcase className="text-emerald-500" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-emerald-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-emerald-500" />
              <span>Apply by {formatDate(job.applicationDeadline)}</span>
            </div>
          </div>

          {job.jobLink && (
            <div className="pt-4">
              <a 
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all"
              >
                Apply Now
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Job Content Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Sidebar - Job Details */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50/50 border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-sm sticky top-24 space-y-6">
                <h3 className="text-xl font-black text-slate-900 border-b border-slate-200/60 pb-3">Job Details</h3>
                
                {/* Experience Level */}
                {job.experienceRequired !== undefined && job.experienceRequired !== null && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Experience Required</p>
                    <p className="text-base font-bold text-slate-700">
                      {job.experienceRequired === 0 ? "Fresher" : `${job.experienceRequired} Years`}
                    </p>
                  </div>
                )}

                {/* Company */}
                {job.company && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Company</p>
                    <p className="text-base font-bold text-slate-700">{job.company}</p>
                  </div>
                )}

                {/* Location */}
                {job.location && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Location</p>
                    <div className="flex items-center gap-2 text-base font-bold text-slate-700">
                      <FaMapMarkerAlt className="text-emerald-500" />
                      {job.location}
                    </div>
                  </div>
                )}

                {/* Employment Type */}
                {job.employmentType && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Employment Type</p>
                    <p className="text-base font-bold text-slate-700">{job.employmentType}</p>
                  </div>
                )}

                {/* Application Deadline */}
                {job.applicationDeadline && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Apply By</p>
                    <div className="flex items-center gap-2 text-base font-bold text-slate-700">
                      <FaCalendarAlt className="text-emerald-500" />
                      {formatDate(job.applicationDeadline)}
                    </div>
                  </div>
                )}

                {/* Skills Required */}
                {job.requiredSkills && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Required Skills</p>
                    <p className="text-sm font-semibold text-slate-500 leading-relaxed">{job.requiredSkills}</p>
                  </div>
                )}

                {/* Apply Button */}
                {job.jobLink && (
                  <div className="pt-2">
                    <a 
                      href={job.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center block bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all"
                    >
                      Apply Now
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - Description & Requirements */}
            <div className="lg:col-span-2 space-y-12">
              {/* Job Description */}
              {job.description && (
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Job Description</h3>
                  <div 
                    className="prose prose-lg max-w-none 
                               prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium
                               prose-headings:text-slate-900 prose-headings:font-black
                               prose-strong:text-slate-800 prose-strong:font-bold
                               prose-ul:text-slate-500 prose-ul:font-medium
                               prose-li:text-slate-500 prose-li:font-medium
                               prose-a:text-emerald-500 hover:prose-a:text-emerald-600"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Requirements</h3>
                  <div 
                    className="prose prose-lg max-w-none 
                               prose-p:text-slate-500 prose-p:leading-relaxed prose-p:font-medium
                               prose-headings:text-slate-900 prose-headings:font-black
                               prose-strong:text-slate-800 prose-strong:font-bold
                               prose-ul:text-slate-500 prose-ul:font-medium
                               prose-li:text-slate-500 prose-li:font-medium
                               prose-a:text-emerald-500 hover:prose-a:text-emerald-600"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              )}

              {/* Application CTA */}
              <div className="bg-gradient-to-tr from-emerald-500 via-emerald-600 to-emerald-500 rounded-[2rem] p-8 md:p-12 text-center text-white shadow-xl shadow-emerald-500/20">
                <h4 className="text-2xl font-black mb-4">Ready to Apply?</h4>
                <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-lg mx-auto mb-6">
                  Don't miss this opportunity to join the team. Click the button below to apply directly.
                </p>
                {job.jobLink && (
                  <a 
                    href={job.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-emerald-600 font-extrabold py-3.5 px-8 rounded-xl shadow-md hover:bg-emerald-50 transition-all"
                  >
                    Apply for this Position
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default JobDetail;
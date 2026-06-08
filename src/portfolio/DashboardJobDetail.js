import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaArrowLeft } from 'react-icons/fa';
import DashboardLayout from './components/DashboardLayout';
import { getJobNotificationById } from '../api/jobNotifications';

export default function DashboardJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractIdFromSlug = (slug) => {
    const parts = slug.split('-');
    return parts[parts.length - 1];
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
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [actualId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout containerClassName="w-full">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 font-semibold">Loading job details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !job) {
    return (
      <DashboardLayout containerClassName="w-full">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Job Not Found
          </h3>
          <p className="text-slate-600 mb-6">
            {error || "The requested job could not be found."}
          </p>
          <button
            onClick={() => navigate('/dashboard-jobs')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard Jobs
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout containerClassName="w-full text-left space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm font-semibold text-slate-500 mb-2">
        <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <span className="mx-2">/</span>
        <Link to="/dashboard-jobs" className="hover:text-indigo-600 transition-colors">Jobs</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800 truncate max-w-xs" title={job.title}>{job.title}</span>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-[#6C63FF]/10 blur-[50px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <button 
              onClick={() => navigate('/dashboard-jobs')}
              className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-6 text-sm font-semibold"
            >
              <FaArrowLeft className="mr-2" /> Back to Jobs
            </button>
            
            <div className="mb-4">
              <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {job.employmentType}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-slate-300 text-xs md:text-sm font-semibold">
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-indigo-400" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-indigo-400" />
                <span>Apply by {formatDate(job.applicationDeadline)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Job Details */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-black text-slate-800 mb-6">Job Details</h3>
                
                {job.experienceRequired !== undefined && job.experienceRequired !== null && (
                  <div className="mb-4 pb-4 border-b border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Experience Level</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {job.experienceRequired === 0 ? 'Fresher' : `${job.experienceRequired} Years`}
                    </p>
                  </div>
                )}

                {job.company && (
                  <div className="mb-4 pb-4 border-b border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company</p>
                    <p className="text-sm font-semibold text-slate-700">{job.company}</p>
                  </div>
                )}

                {job.location && (
                  <div className="mb-4 pb-4 border-b border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-semibold text-slate-700">{job.location}</p>
                  </div>
                )}

                {job.employmentType && (
                  <div className="mb-4 pb-4 border-b border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employment Type</p>
                    <p className="text-sm font-semibold text-slate-700">{job.employmentType}</p>
                  </div>
                )}

                {job.applicationDeadline && (
                  <div className="mb-4 pb-4 border-b border-slate-200/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Apply By</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(job.applicationDeadline)}</p>
                  </div>
                )}

                {job.requiredSkills && (
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</p>
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed">{job.requiredSkills}</p>
                  </div>
                )}

                {job.jobLink && (
                  <a 
                    href={job.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm"
                  >
                    Apply Externally
                  </a>
                )}
              </div>
            </div>

            {/* Right Content - Description & Requirements */}
            <div className="lg:col-span-2">
              {job.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-800 mb-4">Job Description</h3>
                  <div 
                    className="prose prose-sm md:prose-base max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-li:text-slate-600"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              )}

              {job.requirements && (
                <div className="mb-8 pt-8 border-t border-slate-100">
                  <h3 className="text-xl font-black text-slate-800 mb-4">Requirements</h3>
                  <div 
                    className="prose prose-sm md:prose-base max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-li:text-slate-600"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              )}

              {job.jobLink && (
                <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100 mt-8">
                  <h4 className="text-lg font-black text-slate-800 mb-2">Ready to Apply?</h4>
                  <p className="text-slate-600 text-sm mb-6 font-semibold">
                    Don't miss this opportunity to join the team. Click the button below to apply directly.
                  </p>
                  <a 
                    href={job.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm shadow-indigo-200"
                  >
                    Apply for this Position
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

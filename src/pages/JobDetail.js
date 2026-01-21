// src/pages/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getJobNotificationById } from '../api/jobNotifications';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        // Use new API
        const res = await getJobNotificationById(id);
        let jobData = res.data.data;
        
        // Transform data to match UI expectations
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
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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
      <>
        <Header />
        <div className="bytebodh-job-detail-page bg-gray-50 min-h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Header />
        <div className="bytebodh-job-detail-page bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
              <p className="mb-4">{error || 'Job not found'}</p>
              <button 
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all inline-flex items-center gap-2"
              >
                <FaArrowLeft /> Back to Jobs
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <FaArrowLeft /> Back to Jobs
            </button>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-full mb-4 border border-blue-400/30">
              <span className="text-sm font-semibold">{job.employmentType}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {job.title}
            </h1>
            
            <div className="space-y-3 mb-6 text-lg">
              <div className="flex items-center gap-3">
                <FaBriefcase className="text-yellow-300" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-yellow-300" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-yellow-300" />
                <span>Apply by {formatDate(job.applicationDeadline)}</span>
              </div>
            </div>

            {job.jobLink && (
              <a 
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all"
              >
                Apply Now
              </a>
            )}
          </div>
        </section>

        {/* Job Content Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar - Job Details */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-20">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Job Details</h3>
                  
                  {/* Experience Level */}
                  {job.experienceRequired && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Experience Level</p>
                      <p className="text-lg font-medium text-slate-900">{job.experienceRequired}</p>
                    </div>
                  )}

                  {/* Company */}
                  {job.company && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Company</p>
                      <p className="text-lg font-medium text-slate-900">{job.company}</p>
                    </div>
                  )}

                  {/* Location */}
                  {job.location && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</p>
                      <div className="flex items-center gap-2 text-lg font-medium text-slate-900">
                        <FaMapMarkerAlt className="text-blue-600" />
                        {job.location}
                      </div>
                    </div>
                  )}

                  {/* Employment Type */}
                  {job.employmentType && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Employment Type</p>
                      <p className="text-lg font-medium text-slate-900">{job.employmentType}</p>
                    </div>
                  )}

                  {/* Application Deadline */}
                  {job.applicationDeadline && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Apply By</p>
                      <div className="flex items-center gap-2 text-lg font-medium text-slate-900">
                        <FaCalendarAlt className="text-blue-600" />
                        {formatDate(job.applicationDeadline)}
                      </div>
                    </div>
                  )}

                  {/* Skills Required */}
                  {job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-500 uppercase mb-3">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Apply Button */}
                  {job.jobLink && (
                    <a 
                      href={job.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all mt-4"
                    >
                      Apply Now
                    </a>
                  )}
                </div>
              </div>

              {/* Right Content - Description & Requirements */}
              <div className="lg:col-span-2">
                {/* Job Description */}
                {job.description && (
                  <div className="mb-10">
                    <h3 className="text-3xl font-bold text-slate-900 mb-6">Job Description</h3>
                    <div 
                      className="rich-text-content prose prose-lg max-w-none text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </div>
                )}

                {/* Requirements */}
                {job.requirements && (
                  <div className="mb-10 pt-8 border-t border-gray-200">
                    <h3 className="text-3xl font-bold text-slate-900 mb-6">Requirements</h3>
                    <div 
                      className="rich-text-content prose prose-lg max-w-none text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: job.requirements }}
                    />
                  </div>
                )}

                {/* Application CTA */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border border-blue-200 mt-12">
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">Ready to Apply?</h4>
                  <p className="text-gray-600 text-lg mb-6">
                    Don't miss this opportunity to join our team. Click the button below to apply directly.
                  </p>
                  {job.jobLink && (
                    <a 
                      href={job.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                    >
                      Apply for this Position
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default JobDetail;
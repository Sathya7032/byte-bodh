import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { Link } from 'react-router-dom';
import { getJobNotifications } from '../api/jobNotifications';
import {
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  RefreshCw,
  Building,
  Target,
  AlertTriangle,
  Loader
} from "lucide-react";

export default function DashboardJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getJobNotifications();
      let jobsArray = res.data.data || [];
      
      jobsArray = jobsArray.map(job => ({
        id: job.id,
        title: job.jobTitle,
        company: job.companyName,
        location: job.location,
        description: job.jobDescription,
        jobLink: job.jobLink,
        applicationDeadline: job.applicationDeadline,
        employmentType: job.employmentType,
        isActive: job.isActive !== false
      }));
      
      setJobs(jobsArray);
    } catch (err) {
      setError('Unable to load job notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location?.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesFilter = filter === 'ALL' || 
                          (filter === 'ACTIVE' && job.isActive) ||
                          (filter === 'REMOTE' && job.location?.toLowerCase().includes('remote'));
                          
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.isActive).length,
    remote: jobs.filter(j => j.location?.toLowerCase().includes('remote')).length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-[#6C63FF]/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-[#6C63FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-sans">Job Notifications</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Stay updated with the newest job openings from top companies. Find your next career opportunity here.
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all cursor-pointer text-white active:scale-95 flex items-center justify-center self-start sm:self-center"
            title="Refresh jobs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-650 flex-shrink-0" />
          <p className="text-xs text-red-700 font-semibold">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-650 hover:text-red-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Jobs", val: stats.total, color: "text-slate-800", bg: "bg-slate-50 border-slate-100", icon: <Target className="w-5 h-5 text-slate-400" /> },
          { label: "Active Postings", val: stats.active, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", icon: <Briefcase className="w-5 h-5 text-emerald-500" /> },
          { label: "Remote Options", val: stats.remote, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100", icon: <Building className="w-5 h-5 text-indigo-500" /> },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
              <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.val}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.bg}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-[#6C63FF] rounded-xl text-xs font-semibold focus:ring-4 focus:ring-[#6C63FF]/10 transition-all placeholder-slate-400"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All Jobs", activeClass: "bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/15 border-transparent" },
              { id: "ACTIVE", label: "Active", activeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { id: "REMOTE", label: "Remote", activeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === btn.id 
                    ? btn.activeClass 
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Content List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm">
            <Loader className="w-8 h-8 text-[#6C63FF] animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Fetching latest job notifications...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
              💼
            </div>
            <h3 className="text-lg font-black text-slate-800">No jobs found</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm text-center">
              Try adjusting your search queries or selected filter tags to find more opportunities.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building className="w-5 h-5 text-[#6C63FF]" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-bold leading-tight text-slate-800">
                          {job.title || 'Job Title Not Provided'}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                            job.isActive !== false ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}>
                            {job.isActive !== false ? "Active" : "Closed"}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs font-bold text-indigo-600 mb-2">{job.company || 'Company: Not Available'}</p>
                      <p className="text-xs text-slate-500 font-semibold mb-3 leading-relaxed line-clamp-2">
                        {job.description || "No description provided."}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-450">
                        <div className="flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.location || 'Location Not Mentioned'}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.employmentType || 'Not Provided'}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: <span className="text-slate-700">{formatDate(job.applicationDeadline)}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      to={`/dashboard-jobs/${job.id}`}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      View Details
                    </Link>
                    <a 
                      href={job.jobLink || '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-[#6C63FF] border border-indigo-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      Apply Now
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

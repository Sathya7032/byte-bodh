import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaSearch, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getJobNotifications } from "../api/jobNotifications";

// Helper function to create URL-friendly slug
const createSlug = (title, id) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  return `${slug}-${id}`;
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
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
          experienceRequired: job.experienceRequired,
          requiredSkills: job.requiredSkills,
          requirements: job.requirements,
          isActive: job.isActive
        }));
        
        console.log("Fetched jobs data:", jobsArray);
        setJobs(jobsArray);
        setError(null);
      } catch (err) {
        setError("Unable to load job notifications. Please try again later.");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        {/* Soft glowing ambient circles */}
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-600 text-xs font-black uppercase tracking-wider">
            <span>Job Alerts</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black leading-[1.1] text-slate-900 tracking-tight">
            Latest <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Job Notifications</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Stay updated with the newest job openings from top companies across India. Explore opportunities, check eligibility, and apply directly.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-xl p-2 group focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <FaSearch className="text-slate-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search jobs by title, company name, or location..."
                className="flex-1 py-3 px-2 text-slate-800 focus:outline-none bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-16 bg-white border border-slate-200/50 rounded-3xl shadow-sm">
              <FaSpinner className="animate-spin text-emerald-500 text-4xl mx-auto mb-4" />
              <p className="text-slate-500 font-semibold">Fetching latest job notifications...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white border border-slate-200/50 rounded-3xl shadow-sm space-y-4 max-w-2xl mx-auto">
              <div className="text-red-500 text-4xl mx-auto">⚠️</div>
              <p className="text-slate-600 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Jobs Count */}
              <div className="mb-10 text-left">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                  {filteredJobs.length} Job Openings Found
                </h4>
              </div>

              {/* Jobs Grid */}
              {filteredJobs.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200/50 rounded-3xl shadow-sm max-w-2xl mx-auto">
                  <h5 className="text-xl font-black text-slate-900 tracking-tight">No Job Notifications Found</h5>
                  <p className="text-slate-500 mt-2 font-medium">Try different keywords or visit again soon for updated company job announcements.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredJobs.map((job) => (
                    <Link key={job.id} to={`/jobs/${createSlug(job.title, job.id)}`} className="block group">
                      <div className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1 h-full flex flex-col justify-between">
                        <div>
                          <div className="mb-4">
                            <h5 className="text-xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors mb-3 leading-snug">
                              {job.title || "Job Title Not Provided"}
                            </h5>
                            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-black px-3.5 py-1.5 rounded-xl border border-emerald-500/10">
                              {job.company || "Company: Not Available"}
                            </span>
                          </div>

                          <div className="space-y-3 mb-6 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2.5">
                              <FaMapMarkerAlt className="text-emerald-500 flex-shrink-0" />
                              <span>{job.location || "Location: Not Mentioned"}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <FaBriefcase className="text-emerald-500 flex-shrink-0" />
                              <span>{job.employmentType || "Experience: Not Provided"}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <FaCalendarAlt className="text-emerald-500 flex-shrink-0" />
                              <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg">
                            View Details
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Jobs;
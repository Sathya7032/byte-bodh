// src/pages/Jobs.js
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getJobNotifications } from '../api/jobNotifications';

// Helper function to create URL-friendly slug
const createSlug = (title, id) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  return `${slug}-${id}`;
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Try new API first
        const res = await getJobNotifications();
        let jobsArray = res.data.data || [];
        
        // Transform data to match UI expectations
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
        
        console.log('Fetched jobs data:', jobsArray);
        setJobs(jobsArray);
        setError(null);
      } catch (err) {
        setError('Unable to load job notifications. Please try again later.');
        console.error('Error fetching jobs:', err);
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
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-full mb-6 border border-blue-400/30">
                <span className="text-sm font-semibold">Job Alerts</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Latest <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Job Notifications</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Stay updated with the newest job openings from top companies across India.
                Explore opportunities, check eligibility, and apply directly to the companies you prefer.
              </p>

              {/* Search Box */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, company name, or location..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs List Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Fetching latest job notifications...</p>
              </div>
            ) : error ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
                  <p className="mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Jobs Count */}
                <div className="mb-8">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {filteredJobs.length} Latest Job Notifications
                  </h4>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <h5 className="text-xl font-semibold text-gray-800">No Job Notifications Found</h5>
                      <p className="text-gray-600 mt-2">Try different keywords or visit again soon for updated company job announcements.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                      <Link key={job.id} to={`/jobs/${createSlug(job.title, job.id)}`}>
                        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow h-full overflow-hidden">
                          <div className="p-6 flex flex-col h-full">

                            <div className="mb-4">
                              <div className="mb-3">
                                <h5 className="text-lg font-bold text-gray-800">
                                  {job.title || 'Job Title Not Provided'}
                                </h5>
                                <span className="inline-block mt-2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded">
                                  {job.company || 'Company: Not Available'}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4 flex-grow">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FaMapMarkerAlt className="text-blue-500" />
                                <span>{job.location || 'Location: Not Mentioned'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FaBriefcase className="text-blue-500" />
                                <span>{job.employmentType || 'Experience: Not Provided'}</span>
                              </div>
                            </div>

                            <div className="space-y-1 mb-4 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-500" />
                                <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                              </div>
                            </div>

                            <div className="mt-auto">
                              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all">
                                View Details
                              </button>
                            </div>

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
      </div>

      <Footer />
    </>
  );
}

export default Jobs;
// src/pages/Jobs.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://bytebodh.codewithsathya.info/api/jobs/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jobsData = await response.json();
        console.log('Fetched jobs data:', jobsData);
        
        let jobsArray = [];
        
        if (Array.isArray(jobsData)) {
          jobsArray = jobsData;
        } else if (jobsData && typeof jobsData === 'object') {
          if (jobsData.results) {
            jobsArray = jobsData.results;
          } else if (jobsData.data) {
            jobsArray = jobsData.data;
          } else if (jobsData.jobs) {
            jobsArray = jobsData.jobs;
          } else {
            jobsArray = [jobsData];
          }
        }
        
        console.log('Processed jobs array:', jobsArray);        
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
      <div className="bytebodh-jobs-page">

        {/* Hero Section */}
        <section className="bytebodh-jobs-hero">
          <Container>
            <Row className="text-center py-5">
              <Col lg={8} className="mx-auto">

                {/* UPDATED TEXT */}
                <Badge bg="primary" className="bytebodh-hero-badge mb-3">
                  Job Alerts
                </Badge>

                <h1 className="bytebodh-hero-title mb-3">
                  Latest <span className="bytebodh-hero-gradient">Job Notifications</span>
                </h1>

                <p className="bytebodh-hero-description">
                  Stay updated with the newest job openings from top companies across India.
                  Explore opportunities, check eligibility, and apply directly to the companies you prefer.
                </p>

                {/* Search Box */}
                <div className="bytebodh-search-box mt-4">
                  <div className="bytebodh-search-input">
                    <FaSearch className="bytebodh-search-icon" />
                    <input
                      type="text"
                      placeholder="Search jobs by title, company name, or location..."
                      className="bytebodh-search-field"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

              </Col>
            </Row>
          </Container>
        </section>

        {/* Jobs List Section */}
        <section className="bytebodh-jobs-list-section py-5">
          <Container>
            {loading ? (
              <Row className="text-center">
                <Col>
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading jobs...</span>
                  </Spinner>
                  <p className="mt-3">Fetching latest job notifications...</p>
                </Col>
              </Row>
            ) : error ? (
              <Row>
                <Col lg={8} className="mx-auto">
                  <Alert variant="danger" className="text-center">
                    {error}
                    <div className="mt-3">
                      <Button variant="outline-danger" onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </div>
                  </Alert>
                </Col>
              </Row>
            ) : (
              <>
                {/* Jobs Count */}
                <Row className="mb-4">
                  <Col>
                    <h4 className="bytebodh-jobs-count">
                      {filteredJobs.length} Latest Job Notifications
                    </h4>
                  </Col>
                </Row>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                  <Row>
                    <Col className="text-center">
                      <div className="bytebodh-no-jobs">
                        <h5>No Job Notifications Found</h5>
                        <p>Try different keywords or visit again soon for updated company job announcements.</p>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row className="g-4">
                    {filteredJobs.map((job) => (
                      <Col key={job.id} lg={6}>
                        <Card className="bytebodh-job-card h-100">
                          <Card.Body className="d-flex flex-column">

                            <div className="bytebodh-job-header mb-3">
                              <div className="bytebodh-job-title-section">

                                {/* UPDATED FALLBACK TEXTS */}
                                <h5 className="bytebodh-job-title">
                                  {job.title || 'Job Title Not Provided'}
                                </h5>

                                <Badge bg="light" text="dark" className="bytebodh-company-badge">
                                  {job.company || 'Company: Not Available'}
                                </Badge>
                              </div>
                            </div>

                            <div className="bytebodh-job-details mb-3">
                              <div className="bytebodh-job-detail-item">
                                <FaMapMarkerAlt className="bytebodh-detail-icon" />
                                <span>{job.location || 'Location: Not Mentioned'}</span>
                              </div>
                              <div className="bytebodh-job-detail-item">
                                <FaBriefcase className="bytebodh-detail-icon" />
                                <span>{job.experience_level || 'Experience: Not Provided'}</span>
                              </div>
                            </div>

                            <div className="bytebodh-job-dates mb-3">
                              <div className="bytebodh-date-item">
                                <FaCalendarAlt className="bytebodh-date-icon" />
                                <small className="text-muted">
                                  Posted On: {formatDate(job.posted_on)}
                                </small>
                              </div>
                              <div className="bytebodh-date-item">
                                <FaCalendarAlt className="bytebodh-date-icon" />
                                <small className="text-muted">
                                  Last Date to Apply: {formatDate(job.last_date)}
                                </small>
                              </div>
                            </div>

                            <div className="mt-auto d-flex gap-2">
                              <Link 
                                to={`/jobs/${job.id}`}
                                className="bytebodh-view-btn"
                              >
                                View Details
                              </Link>
                            </div>

                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            )}
          </Container>
        </section>
      </div>

      <Footer />

      {/* STYLES KEEP SAME */}
      <style jsx>{`
        .bytebodh-jobs-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .bytebodh-jobs-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 4rem 0;
        }

        .bytebodh-hero-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 50px;
        }

        .bytebodh-hero-title {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.2;
          color: #f8fafc;
          margin-bottom: 1rem;
        }

        .bytebodh-hero-gradient {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bytebodh-hero-description {
          font-size: 1.2rem;
          color: #cbd5e1;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .bytebodh-search-box {
          max-width: 500px;
          margin: 0 auto;
        }

        .bytebodh-search-input {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border-radius: 12px;
          padding: 0.5rem 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .bytebodh-search-icon {
          color: #64748b;
          margin-right: 0.5rem;
          font-size: 1.1rem;
        }

        .bytebodh-search-field {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.75rem 0;
          font-size: 1rem;
          background: transparent;
        }

        .bytebodh-jobs-list-section {
          background: white;
        }

        .bytebodh-jobs-count {
          color: #0f172a;
          font-weight: 600;
        }

        .bytebodh-job-card {
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          background: white;
        }

        .bytebodh-job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .bytebodh-job-title {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .bytebodh-company-badge {
          background: #f1f5f9 !important;
          color: #475569 !important;
          font-weight: 500;
          border-radius: 8px;
        }

        .bytebodh-job-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .bytebodh-job-detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .bytebodh-detail-icon {
          color: #0284c7;
          font-size: 0.875rem;
        }

        .bytebodh-job-dates {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .bytebodh-date-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .bytebodh-date-icon {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        .bytebodh-view-btn {
          display: inline-block;
          background: transparent;
          color: #0284c7;
          border: 2px solid #0284c7;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          flex: 1;
          transition: all 0.3s ease;
        }

        .bytebodh-view-btn:hover {
          background: #0284c7;
          color: white;
          text-decoration: none;
        }

        .bytebodh-apply-btn {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          flex: 1;
          transition: all 0.3s ease;
        }

        .bytebodh-apply-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
        }

        .bytebodh-apply-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .bytebodh-no-jobs {
          padding: 3rem 1rem;
          color: #64748b;
        }

        .bytebodh-no-jobs h5 {
          color: #475569;
          margin-bottom: 1rem;
        }

        .bytebodh-jobs-cta {
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 768px) {
          .bytebodh-hero-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-job-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .bytebodh-view-btn,
          .bytebodh-apply-btn {
            flex: none;
            width: 100%;
          }
          
          .d-flex.gap-2 {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default Jobs;
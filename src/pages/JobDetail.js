// src/pages/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
        const response = await fetch(`https://bytebodh.codewithsathya.info/api/jobs/${id}/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jobData = await response.json();
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
        <div className="bytebodh-job-detail-page">
          <Container>
            <Row className="text-center py-5">
              <Col>
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading job details...</span>
                </Spinner>
                <p className="mt-3">Loading job details...</p>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Header />
        <div className="bytebodh-job-detail-page">
          <Container>
            <Row>
              <Col lg={8} className="mx-auto">
                <Alert variant="danger" className="text-center">
                  {error || 'Job not found'}
                  <div className="mt-3">
                    <Button variant="outline-danger" onClick={() => navigate('/jobs')}>
                      Back to Jobs
                    </Button>
                  </div>
                </Alert>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bytebodh-job-detail-page">
        {/* Hero Section */}
        <section className="bytebodh-job-detail-hero">
          <Container>
            <Row className="py-5">
              <Col lg={12}>
                
                
                <Badge bg="primary" className="bytebodh-hero-badge mb-3">
                  {job.experience_level}
                </Badge>
                
                <h1 className="bytebodh-hero-title mb-3">
                  {job.title}
                </h1>
                
                <div className="bytebodh-job-meta">
                  <div className="bytebodh-meta-item">
                    <FaBriefcase className="bytebodh-meta-icon" />
                    <span>{job.company}</span>
                  </div>
                  <div className="bytebodh-meta-item">
                    <FaMapMarkerAlt className="bytebodh-meta-icon" />
                    <span>{job.location}</span>
                  </div>
                  <div className="bytebodh-meta-item">
                    <FaCalendarAlt className="bytebodh-meta-icon" />
                    <span>Apply by {formatDate(job.last_date)}</span>
                  </div>
                </div>

                {job.apply_link && (
                  <div className="bytebodh-hero-actions mt-4">
                    <Button 
                      variant="primary" 
                      className="bytebodh-apply-btn-large"
                      as="a"
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </section>

        {/* Job Content Section */}
        <section className="bytebodh-job-content-section py-5">
          <Container>
            <Row>
              <Col lg={8} className="mx-auto">
                {/* Job Description */}
                <div className="bytebodh-job-section mb-5">
                  <h3 className="bytebodh-section-title">Job Description</h3>
                  <div 
                    className="bytebodh-job-content"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>

                {/* Job Requirements */}
                <div className="bytebodh-job-section mb-5">
                  <h3 className="bytebodh-section-title">Requirements</h3>
                  <div 
                    className="bytebodh-job-content"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>

                {/* Application CTA */}
                <div className="bytebodh-job-cta text-center">
                  <h4 className="mb-3">Ready to Apply?</h4>
                  <p className="bytebodh-cta-description mb-4">
                    Don't miss this opportunity to join our team. Click the button below to apply directly.
                  </p>
                  {job.apply_link && (
                    <Button 
                      variant="primary" 
                      className="bytebodh-apply-btn-large"
                      as="a"
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="lg"
                    >
                      Apply for this Position
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      <Footer />

      <style jsx>{`
        .bytebodh-job-detail-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .bytebodh-job-detail-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 2rem 0;
        }

        .bytebodh-back-link {
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 2rem;
          display: inline-block;
          transition: color 0.3s ease;
        }

        .bytebodh-back-link:hover {
          color: white;
          text-decoration: none;
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

        .bytebodh-job-meta {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .bytebodh-meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #cbd5e1;
          font-size: 1.1rem;
        }

        .bytebodh-meta-icon {
          color: #0284c7;
        }

        .bytebodh-hero-actions {
          display: flex;
          gap: 1rem;
        }

        .bytebodh-apply-btn-large {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          border: none;
          border-radius: 12px;
          padding: 1rem 2.5rem;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .bytebodh-apply-btn-large:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(2, 132, 199, 0.4);
        }

        .bytebodh-job-content-section {
          background: white;
        }

        .bytebodh-job-section {
          padding: 2rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .bytebodh-section-title {
          color: #0f172a;
          font-size: 1.75rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .bytebodh-job-content {
          color: #475569;
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .bytebodh-job-content h1,
        .bytebodh-job-content h2,
        .bytebodh-job-content h3,
        .bytebodh-job-content h4,
        .bytebodh-job-content h5,
        .bytebodh-job-content h6 {
          color: #0f172a;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .bytebodh-job-content p {
          margin-bottom: 1rem;
        }

        .bytebodh-job-content strong {
          color: #0f172a;
          font-weight: 600;
        }

        .bytebodh-job-content code {
          background: #f1f5f9;
          color: #dc2626;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.875em;
        }

        .bytebodh-job-content ul,
        .bytebodh-job-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .bytebodh-job-content li {
          margin-bottom: 0.5rem;
        }

        .bytebodh-job-cta {
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }

        .bytebodh-job-cta h4 {
          color: #0f172a;
          font-weight: 600;
        }

        .bytebodh-cta-description {
          color: #64748b;
          font-size: 1.1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .bytebodh-hero-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-job-meta {
            flex-direction: column;
            gap: 1rem;
          }
          
          .bytebodh-hero-actions {
            flex-direction: column;
          }
          
          .bytebodh-apply-btn-large {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

export default JobDetail;
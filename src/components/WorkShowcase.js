// src/components/WorkShowcase.js
import React, { useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaExternalLinkAlt, FaMobile, FaLaptop, FaCode, FaServer, FaDatabase } from 'react-icons/fa';

function WorkShowcase() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack online store with payment gateway integration and inventory management",
      type: "website",
      category: "fullstack",
      url: "https://bytebodh.in",
      image: "/images/ecommerce-preview.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      budget: "₹15,000",
      status: "completed"
    },
    {
      id: 2,
      title: "Creative Agency Portfolio",
      description: "Modern portfolio website with smooth animations and CMS integration",
      type: "website",
      category: "frontend",
      url: "https://satyanarayana8179.pythonanywhere.com/",
      image: "/images/portfolio-preview.jpg",
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
      budget: "₹8,000",
      status: "completed"
    },
    {
      id: 3,
      title: "Fitness Tracker App",
      description: "Cross-platform mobile application for workout tracking and progress monitoring",
      type: "mobile",
      category: "mobile",
      image: "/images/mobile-app-preview.jpg",
      technologies: ["React Native", "Firebase", "Redux"],
      budget: "₹12,000",
      status: "completed"
    },
    
  ];

  const filters = [
    { key: 'all', label: 'All Projects', count: projects.length },
    { key: 'website', label: 'Websites', count: projects.filter(p => p.type === 'website').length },
    { key: 'mobile', label: 'Mobile Apps', count: projects.filter(p => p.type === 'mobile').length },
    { key: 'fullstack', label: 'Full Stack', count: projects.filter(p => p.category === 'fullstack').length }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => 
        project.type === activeFilter || project.category === activeFilter
      );

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'frontend': return <FaCode />;
      case 'backend': return <FaServer />;
      case 'database': return <FaDatabase />;
      case 'mobile': return <FaMobile />;
      default: return <FaLaptop />;
    }
  };

  return (
    <section className="bytebodh-work-showcase-v2">
      <Container>
        {/* Header Section */}
        <Row className="text-center mb-5">
          <Col lg={8} className="mx-auto">
            <div className="bytebodh-section-badge">
              <span className="bytebodh-badge-dot"></span>
              Our Creative Work
            </div>
            <h2 className="bytebodh-section-title">
              Crafting Digital <span className="bytebodh-title-highlight">Experiences</span>
            </h2>
            <p className="bytebodh-section-subtitle">
              From concept to deployment, we build solutions that drive results. 
              Each project tells a story of innovation and technical excellence.
            </p>
          </Col>
        </Row>

        {/* Filter Tabs */}
        <Row className="mb-5">
          <Col className="text-center">
            <div className="bytebodh-filter-tabs">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  className={`bytebodh-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {filter.label}
                  <span className="bytebodh-filter-count">{filter.count}</span>
                </button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Projects Grid */}
        <Row className="g-4">
          {filteredProjects.map((project) => (
            <Col key={project.id} lg={4} md={6}>
              <div className="bytebodh-project-card-v2">
                {/* Project Status Ribbon */}
                {project.status === 'in-progress' && (
                  <div className="bytebodh-project-ribbon">
                    <span>In Progress</span>
                  </div>
                )}

                {/* Project Preview */}
                <div className="bytebodh-project-preview-v2">
                  {project.url ? (
                    <div className="bytebodh-preview-frame">
                      <div className="bytebodh-frame-header">
                        <div className="bytebodh-frame-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="bytebodh-frame-url">{project.url.replace('https://', '')}</div>
                      </div>
                      <div className="bytebodh-frame-content">
                        <div className="bytebodh-frame-overlay">
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bytebodh-preview-action"
                          >
                            <FaExternalLinkAlt />
                            View Live
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bytebodh-mobile-preview">
                      <div className="bytebodh-mobile-frame">
                        <div className="bytebodh-mobile-notch"></div>
                        <div className="bytebodh-mobile-content">
                          <FaMobile className="bytebodh-mobile-icon" />
                          <span>Mobile App Preview</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="bytebodh-project-info">
                  <div className="bytebodh-project-meta">
                    <div className="bytebodh-project-category">
                      {getCategoryIcon(project.category)}
                      <span>{project.category === 'fullstack' ? 'Full Stack' : project.category}</span>
                    </div>
                    <Badge bg="success" className="bytebodh-project-price">
                      {project.budget}
                    </Badge>
                  </div>

                  <h3 className="bytebodh-project-title-v2">{project.title}</h3>
                  <p className="bytebodh-project-description-v2">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="bytebodh-tech-stack">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bytebodh-tech-item">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Project Actions */}
                  <div className="bytebodh-project-actions">
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bytebodh-action-btn primary"
                      >
                        <FaExternalLinkAlt />
                        Visit Website
                      </a>
                    )}
                    <button className="bytebodh-action-btn secondary">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        
      </Container>

      <style jsx>{`
        .bytebodh-work-showcase-v2 {
          background: linear-gradient(135deg, #0a0f2d 0%, #1a1f3c 50%, #0a0f2d 100%);
          color: #e2e8f0;
          padding: 6rem 0;
          position: relative;
          overflow: hidden;
        }

        .bytebodh-work-showcase-v2::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .bytebodh-section-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .bytebodh-badge-dot {
          width: 8px;
          height: 8px;
          background: #6366f1;
          border-radius: 50%;
          margin-right: 0.75rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .bytebodh-section-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          color: #f8fafc;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bytebodh-title-highlight {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
        }

        .bytebodh-title-highlight::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 2px;
        }

        .bytebodh-section-subtitle {
          font-size: 1.2rem;
          color: #94a3b8;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Filter Tabs */
        .bytebodh-filter-tabs {
          display: inline-flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .bytebodh-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .bytebodh-filter-btn:hover,
        .bytebodh-filter-btn.active {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          transform: translateY(-2px);
        }

        .bytebodh-filter-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        /* Project Cards */
        .bytebodh-project-card-v2 {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          transition: all 0.4s ease;
          backdrop-filter: blur(20px);
          position: relative;
        }

        .bytebodh-project-card-v2:hover {
          transform: translateY(-12px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .bytebodh-project-ribbon {
          position: absolute;
          top: 1rem;
          right: -2rem;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 0.5rem 3rem;
          transform: rotate(45deg);
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 2;
        }

        /* Project Preview */
        .bytebodh-project-preview-v2 {
          padding: 1.5rem 1.5rem 0;
        }

        .bytebodh-preview-frame {
          background: #1e293b;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .bytebodh-frame-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #0f172a;
          border-bottom: 1px solid #334155;
        }

        .bytebodh-frame-dots {
          display: flex;
          gap: 0.5rem;
        }

        .bytebodh-frame-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #475569;
        }

        .bytebodh-frame-dots span:nth-child(1) { background: #ef4444; }
        .bytebodh-frame-dots span:nth-child(2) { background: #f59e0b; }
        .bytebodh-frame-dots span:nth-child(3) { background: #10b981; }

        .bytebodh-frame-url {
          color: #64748b;
          font-size: 0.75rem;
          font-family: monospace;
        }

        .bytebodh-frame-content {
          height: 200px;
          background: linear-gradient(135deg, #334155 0%, #475569 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bytebodh-frame-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .bytebodh-preview-frame:hover .bytebodh-frame-overlay {
          opacity: 1;
        }

        .bytebodh-preview-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .bytebodh-preview-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          color: white;
        }

        .bytebodh-mobile-preview {
          display: flex;
          justify-content: center;
          padding: 1rem;
        }

        .bytebodh-mobile-frame {
          width: 200px;
          height: 300px;
          background: #1e293b;
          border-radius: 24px;
          border: 8px solid #0f172a;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .bytebodh-mobile-notch {
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 8px;
          background: #0f172a;
          border-radius: 0 0 8px 8px;
        }

        .bytebodh-mobile-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
          gap: 1rem;
        }

        .bytebodh-mobile-icon {
          font-size: 3rem;
          color: #475569;
        }

        /* Project Info */
        .bytebodh-project-info {
          padding: 1.5rem;
        }

        .bytebodh-project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .bytebodh-project-category {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .bytebodh-project-price {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          border: none;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: 20px;
        }

        .bytebodh-project-title-v2 {
          color: #f8fafc;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }

        .bytebodh-project-description-v2 {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        /* Tech Stack */
        .bytebodh-tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .bytebodh-tech-item {
          background: rgba(99, 102, 241, 0.1);
          color: #a5b4fc;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
        }

        .bytebodh-tech-item:hover {
          background: rgba(99, 102, 241, 0.2);
          transform: translateY(-2px);
        }

        /* Project Actions */
        .bytebodh-project-actions {
          display: flex;
          gap: 0.75rem;
        }

        .bytebodh-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          flex: 1;
          justify-content: center;
        }

        .bytebodh-action-btn.primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }

        .bytebodh-action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .bytebodh-action-btn.secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bytebodh-action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          transform: translateY(-2px);
        }

        /* CTA Section */
        .bytebodh-work-cta-v2 {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          padding: 4rem;
          border-radius: 32px;
          border: 1px solid rgba(99, 102, 241, 0.2);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .bytebodh-work-cta-v2::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
        }

        .bytebodh-cta-title {
          color: #f8fafc;
          font-weight: 700;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          position: relative;
        }

        .bytebodh-cta-text {
          color: #cbd5e1;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .bytebodh-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          position: relative;
        }

        .bytebodh-cta-btn {
          padding: 1rem 2.5rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .bytebodh-cta-btn.primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }

        .bytebodh-cta-btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
          color: white;
        }

        .bytebodh-cta-btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .bytebodh-cta-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .bytebodh-section-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .bytebodh-work-showcase-v2 {
            padding: 4rem 0;
          }

          .bytebodh-section-title {
            font-size: 2rem;
          }

          .bytebodh-filter-tabs {
            flex-wrap: wrap;
            justify-content: center;
          }

          .bytebodh-project-actions {
            flex-direction: column;
          }

          .bytebodh-work-cta-v2 {
            padding: 2rem;
          }

          .bytebodh-cta-title {
            font-size: 2rem;
          }

          .bytebodh-cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .bytebodh-cta-btn {
            width: 100%;
            max-width: 300px;
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .bytebodh-section-title {
            font-size: 1.75rem;
          }

          .bytebodh-section-subtitle {
            font-size: 1rem;
          }

          .bytebodh-work-cta-v2 {
            padding: 1.5rem;
          }

          .bytebodh-cta-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}

export default WorkShowcase;
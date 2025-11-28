import React, { useState } from "react";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import {
  FaGooglePlay,
  FaStar,
  FaDownload,
  FaMobile,
  FaCheckCircle,
  FaUsers,
  FaRocket,
} from "react-icons/fa";

function AppShowcase() {
  const [activeApp, setActiveApp] = useState("bytebodh");

  const apps = {
    bytebodh: {
      name: "ByteBodh",
      tagline: "Learn IT Skills the Smart Way",
      description:
        "ByteBodh helps you learn full-stack development, mobile app development, cloud computing, databases, and modern IT skills — all through a beautifully designed, easy-to-understand mobile learning experience.",
      downloads: "5,000+",
      rating: "4.8",
      reviews: "2.5K+ reviews",
      link: "https://play.google.com/store/apps/details?id=com.sathichary581.codewithsathya",
      features: [
        "Web Development",
        "Mobile App Development",
        "Cloud Computing",
        "Data Analytics",
      ],
      logo: "B",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },

    javify: {
      name: "Javify",
      tagline: "Master Java & Build Real Projects",
      description:
        "Javify is designed for anyone who wants to master Java from basics to advanced — including OOP, DSA, Spring Boot, and real industry-level project patterns. Perfect for beginners, students, and job-seekers.",
      downloads: "1,000+",
      rating: "4.9",
      reviews: "1.1K+ reviews",
      link: "https://play.google.com/store/apps/details?id=com.bytebodh.javify",
      features: [
        "Java Basics to Advanced",
        "Object-Oriented Programming",
        "DSA Problem Solving",
        "Spring Boot Essentials",
      ],
      logo: "J",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
  };

  const app = apps[activeApp];

  const ratings = [
    { stars: 5, percentage: 87 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 0 },
  ];

  const stats = [
    { icon: <FaUsers />, label: "Active Learners", value: "6,000+" },
    { icon: <FaRocket />, label: "Courses", value: "50+" },
    { icon: <FaStar />, label: "Rating", value: app.rating },
  ];

  return (
    <section className="app-showcase">
      <Container>
        <Row className="align-items-center py-5 my-4">
          {/* LEFT CONTENT */}
          <Col lg={6} className="app-content">
            <Badge bg="primary" className="app-badge mb-4">
              <FaMobile className="me-2" />
              Now Available on Google Play
            </Badge>

            {/* App Switch Tabs */}
            <div className="app-tabs mb-4">
              {Object.keys(apps).map((appKey) => (
                <button
                  key={appKey}
                  className={`app-tab ${activeApp === appKey ? "active" : ""}`}
                  onClick={() => setActiveApp(appKey)}
                  style={{
                    background: activeApp === appKey ? apps[appKey].color : "transparent",
                  }}
                >
                  {apps[appKey].name}
                </button>
              ))}
            </div>

            <h1 className="app-title mb-3">
              {app.tagline} with{" "}
              <span 
                className="app-gradient"
                style={{ backgroundImage: app.color }}
              >
                {app.name}
              </span>
            </h1>

            <p className="app-description mb-4">{app.description}</p>

            {/* Stats */}
            <div className="app-stats mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="app-stat">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* RATINGS */}
            <div className="app-ratings mb-4">
              <div className="rating-overview d-flex align-items-center mb-3">
                <div className="rating-score me-4">
                  <div className="rating-number">{app.rating}</div>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-warning" />
                    ))}
                  </div>
                  <div className="rating-count">{app.reviews}</div>
                </div>

                <div className="rating-bars flex-grow-1">
                  {ratings.map((rating, index) => (
                    <div
                      key={index}
                      className="rating-bar d-flex align-items-center mb-2"
                    >
                      <span className="rating-star-count">
                        {rating.stars}
                      </span>
                      <FaStar className="rating-star-icon me-2" />
                      <div className="rating-progress flex-grow-1">
                        <div
                          className="rating-progress-bar"
                          style={{ width: `${rating.percentage}%` }}
                        ></div>
                      </div>
                      <span className="rating-percentage">
                        {rating.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="download-actions">
              <Button
                className="playstore-btn btn-lg"
                onClick={() => window.open(app.link, "_blank")}
                style={{ backgroundImage: app.color }}
              >
                <FaGooglePlay className="me-2" size={24} />
                <div className="btn-text">
                  <small>GET IT ON</small>
                  <strong>Google Play</strong>
                </div>
              </Button>

              <div className="download-stats mt-3">
                <FaDownload className="text-primary me-2" />
                <span>{app.downloads} Downloads</span>
              </div>
            </div>
          </Col>

          {/* RIGHT SIDE PHONE MOCKUP */}
          <Col lg={6} className="app-visual">
            <div className="phone-mockup">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="app-screen">
                    <div 
                      className="app-header"
                      style={{ backgroundImage: app.color }}
                    >
                      <div className="app-logo">
                        <div 
                          className="app-logo-icon"
                          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                        >
                          {app.logo}
                        </div>
                        <span>{app.name}</span>
                      </div>
                    </div>

                    <div className="app-content-preview">
                      {app.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="app-feature-preview"
                        >
                          <FaCheckCircle className="text-success me-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="app-bottom-nav">
                      <div className="nav-item active">Learn</div>
                      <div className="nav-item">Practice</div>
                      <div className="nav-item">Projects</div>
                      <div className="nav-item">Profile</div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="app-floating element-1"
                style={{ backgroundImage: app.color }}
              >
                <FaStar className="floating-icon" />
                <span>{app.rating} Rating</span>
              </div>

              <div 
                className="app-floating element-2"
                style={{ backgroundImage: app.color }}
              >
                <FaDownload className="floating-icon" />
                <span>{app.downloads}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Enhanced CSS */}
      <style jsx>{`
        .app-showcase {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .app-showcase::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .app-showcase::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
        }

        .app-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .app-tabs {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .app-tab {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #cbd5e1;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
        }

        .app-tab.active {
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }

        .app-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          color: #f8fafc;
          margin-bottom: 1.5rem;
        }

        .app-gradient {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .app-description {
          font-size: 1.125rem;
          color: #cbd5e1;
          line-height: 1.7;
          max-width: 90%;
          margin-bottom: 2rem;
        }

        /* Stats Styles */
        .app-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .app-stat {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .stat-icon {
          color: #0284c7;
          font-size: 1.5rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #94a3b8;
        }

        /* Ratings Styles */
        .app-ratings {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          margin-bottom: 2rem;
        }

        .rating-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #f8fafc;
          line-height: 1;
        }

        .rating-stars {
          color: #fbbf24;
          margin: 0.5rem 0;
        }

        .rating-count {
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .rating-bar {
          font-size: 0.875rem;
        }

        .rating-star-count {
          color: #cbd5e1;
          width: 20px;
          font-weight: 600;
        }

        .rating-star-icon {
          color: #fbbf24;
          font-size: 0.75rem;
        }

        .rating-progress {
          background: rgba(255, 255, 255, 0.1);
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          margin: 0 0.75rem;
        }

        .rating-progress-bar {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .rating-percentage {
          color: #94a3b8;
          width: 30px;
          text-align: right;
          font-weight: 500;
        }

        /* Download Button */
        .playstore-btn {
          border: none;
          padding: 1.25rem 2.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }

        .playstore-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .playstore-btn:hover::before {
          left: 100%;
        }

        .playstore-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }

        .btn-text {
          text-align: left;
          line-height: 1.2;
        }

        .btn-text small {
          font-size: 0.75rem;
          opacity: 0.9;
          display: block;
          font-weight: 500;
        }

        .btn-text strong {
          font-size: 1.1rem;
          display: block;
          font-weight: 700;
        }

        .download-stats {
          color: #cbd5e1;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        /* Phone Mockup */
        .phone-mockup {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 600px;
        }

        .phone-frame {
          width: 320px;
          height: 640px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 40px;
          padding: 14px;
          position: relative;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 2;
        }

        .phone-screen {
          background: white;
          height: 100%;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .app-screen {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .app-header {
          color: white;
          padding: 2rem 1rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .app-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
        }

        .app-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          position: relative;
          z-index: 1;
        }

        .app-logo-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          backdrop-filter: blur(10px);
        }

        .app-content-preview {
          flex: 1;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .app-feature-preview {
          display: flex;
          align-items: center;
          padding: 1.25rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          color: #334155;
          font-weight: 600;
          transition: transform 0.2s ease;
        }

        .app-feature-preview:hover {
          transform: translateX(5px);
        }

        .app-bottom-nav {
          display: flex;
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 1rem 0;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        }

        .nav-item {
          flex: 1;
          text-align: center;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.5rem;
          transition: color 0.2s ease;
        }

        .nav-item.active {
          color: #0284c7;
        }

        /* Floating Elements */
        .app-floating {
          position: absolute;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 0.875rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          animation: app-float 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 3;
        }

        .floating-icon {
          font-size: 1.1rem;
        }

        .element-1 {
          top: 15%;
          right: 5%;
          animation-delay: 0s;
        }

        .element-2 {
          bottom: 25%;
          left: 3%;
          animation-delay: 1.5s;
        }

        @keyframes app-float {
          0%, 100% { 
            transform: translateY(0px) scale(1) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) scale(1.05) rotate(2deg); 
          }
        }

        /* Responsive Design */
        @media (max-width: 1199.98px) {
          .app-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 991.98px) {
          .app-title {
            font-size: 2.25rem;
          }
          
          .app-description {
            max-width: 100%;
          }
          
          .phone-mockup {
            margin-top: 3rem;
            min-height: 500px;
          }
          
          .phone-frame {
            transform: scale(0.9);
          }

          .app-stats {
            flex-direction: column;
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .app-title {
            font-size: 2rem;
          }
          
          .app-tabs {
            flex-direction: column;
          }

          .rating-overview {
            flex-direction: column;
            text-align: center;
          }
          
          .rating-score {
            margin-bottom: 1.5rem;
            margin-right: 0;
          }
        }

        @media (max-width: 576px) {
          .app-title {
            font-size: 1.75rem;
          }
          
          .phone-frame {
            transform: scale(0.8);
          }
          
          .app-floating {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

export default AppShowcase;
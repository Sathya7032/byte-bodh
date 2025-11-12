// src/components/YouTubeShowcase.js
import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';

function YouTubeShowcase() {
  const videos = [
    {
      id: "video1",
      title: "Web Development Tutorial for Beginners",
      embedId: "qz0aGYrrlhU" // FreeCodeCamp HTML Crash Course
    },
    {
      id: "video2", 
      title: "React JS Crash Course 2024",
      embedId: "w7ejDZ8SWv8" // Traversy Media React Crash Course
    },
    {
      id: "video3",
      title: "Python for Beginners - Full Course",
      embedId: "rfscVS0vtbw" // FreeCodeCamp Python Tutorial
    },
    {
      id: "video4",
      title: "JavaScript Programming - Full Course",
      embedId: "jS4aFq5-91M" // FreeCodeCamp JavaScript Tutorial
    }
  ];

  return (
    <section className="bytebodh-youtube-showcase">
      <Container>
        <Row className="text-center mb-5">
          <Col lg={8} className="mx-auto">
            <Badge bg="primary" className="bytebodh-youtube-badge mb-3">
              Free Learning Resources
            </Badge>
            <h2 className="bytebodh-youtube-title mb-3">
              Master IT Skills with Our <span className="bytebodh-youtube-gradient">Free Tutorials</span>
            </h2>
            <p className="bytebodh-youtube-description">
              Access high-quality, free tutorials covering essential IT skills for startups and small businesses. 
              Learn at your own pace and build your technical expertise without any cost.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {videos.map((video) => (
            <Col key={video.id} lg={3} className="mb-4">
              <div className="bytebodh-video-card">
                <div className="bytebodh-video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="bytebodh-video-iframe"
                  ></iframe>
                </div>
                <h5 className="bytebodh-video-title mt-3">
                  {video.title}
                </h5>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="text-center mt-5">
          <Col>
            <a 
              href="https://www.youtube.com/@ByteBodh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bytebodh-yt-channel-btn"
            >
              Subscribe for More Free Tutorials
            </a>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .bytebodh-youtube-showcase {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          padding: 5rem 0;
          position: relative;
        }

        .bytebodh-youtube-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.05) 0%, transparent 70%);
          border-radius: 50%;
        }

        .bytebodh-youtube-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 50px;
        }

        .bytebodh-youtube-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .bytebodh-youtube-gradient {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bytebodh-youtube-description {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .bytebodh-video-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 0;
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .bytebodh-video-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .bytebodh-video-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          background: #000;
        }

        .bytebodh-video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 16px 16px 0 0;
          transition: transform 0.3s ease;
        }

        .bytebodh-video-card:hover .bytebodh-video-iframe {
          transform: scale(1.02);
        }

        .bytebodh-video-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.1rem;
          padding: 1.5rem 1.5rem 1.5rem;
          margin: 0;
          line-height: 1.4;
          background: white;
        }

        .bytebodh-yt-channel-btn {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          font-size: 1.1rem;
          position: relative;
          overflow: hidden;
        }

        .bytebodh-yt-channel-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .bytebodh-yt-channel-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(2, 132, 199, 0.4);
          color: white;
          text-decoration: none;
        }

        .bytebodh-yt-channel-btn:hover::before {
          left: 100%;
        }

        /* Stats Section */
        .bytebodh-youtube-stats {
          background: rgba(2, 132, 199, 0.05);
          padding: 2rem;
          border-radius: 16px;
          margin-top: 3rem;
          border: 1px solid rgba(2, 132, 199, 0.1);
        }

        .bytebodh-stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #0284c7;
          line-height: 1;
        }

        .bytebodh-stat-label {
          color: #64748b;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .bytebodh-youtube-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-youtube-showcase {
            padding: 4rem 0;
          }
          
          .bytebodh-video-title {
            padding: 1.25rem 1.25rem 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .bytebodh-youtube-title {
            font-size: 2rem;
          }
          
          .bytebodh-youtube-description {
            font-size: 1rem;
          }
          
          .bytebodh-yt-channel-btn {
            padding: 0.875rem 2rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .bytebodh-youtube-title {
            font-size: 1.75rem;
          }
          
          .bytebodh-youtube-showcase {
            padding: 3rem 0;
          }
          
          .bytebodh-video-card:hover {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </section>
  );
}

export default YouTubeShowcase;
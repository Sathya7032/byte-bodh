// src/components/FAQSection.js
import React, { useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of projects do you work on?",
      answer: "We specialize in helping solo entrepreneurs, startups, and small businesses with web development, mobile apps, e-commerce solutions, and custom software. Our focus is on affordable, scalable solutions for businesses with limited budgets."
    },
    {
      question: "How much do your services cost?",
      answer: "Our services start from as low as ₹999 for basic tutorials and go up to ₹50,000 for complete website development. We offer flexible pricing models including one-time projects, monthly retainers, and pay-as-you-go options to fit any budget."
    },
    {
      question: "How long does it take to complete a project?",
      answer: "Most small projects (like basic websites) take 1-2 weeks. Medium projects (e-commerce sites, mobile apps) take 3-6 weeks. Complex projects may take 2-3 months. We provide clear timelines upfront and keep you updated throughout the process."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes! We offer 30 days of free support after project delivery. After that, we have affordable monthly maintenance plans starting from ₹1,999/month that include updates, security patches, and technical support."
    },
    {
      question: "Can I see examples of your previous work?",
      answer: "Absolutely! Check out our portfolio section above where you can see live websites and projects we've delivered. We also provide case studies and client testimonials upon request."
    },
    {
      question: "What technologies do you work with?",
      answer: "We work with modern technologies including React, Next.js, Node.js, Python, MongoDB, Firebase, and more. We choose the best technology stack based on your project requirements and budget constraints."
    },
    {
      question: "Do you work with clients outside India?",
      answer: "Yes, we work with clients worldwide. We've successfully delivered projects for clients in the US, UK, Canada, Australia, and Europe. We're comfortable working across different time zones."
    },
    {
      question: "How do I get started with my project?",
      answer: "Simply contact us through our contact form or schedule a free consultation call. We'll discuss your requirements, provide a detailed quote, and create a project timeline. No upfront payment is required until we agree on the scope."
    }
  ];

  return (
    <section className="bytebodh-faq-section" id="faq">
      <Container>
        <Row className="text-center mb-5">
          <Col lg={8} className="mx-auto">
            <Badge bg="primary" className="bytebodh-faq-badge mb-3">
              <FaQuestionCircle className="me-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="bytebodh-faq-title mb-3">
              Get Answers to <span className="bytebodh-faq-gradient">Common Questions</span>
            </h2>
            <p className="bytebodh-faq-description">
              Find quick answers to the most common questions about our services, pricing, 
              and process. Can't find what you're looking for? Contact us directly.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="bytebodh-faq-container">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`bytebodh-faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  <button 
                    className="bytebodh-faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <div className="bytebodh-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>

       
      </Container>

      <style jsx>{`
        .bytebodh-faq-section {
          background: white;
          padding: 5rem 0;
          position: relative;
        }

        .bytebodh-faq-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
        }

        .bytebodh-faq-badge {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%) !important;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 50px;
        }

        .bytebodh-faq-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .bytebodh-faq-gradient {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bytebodh-faq-description {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .bytebodh-faq-container {
          background: white;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .bytebodh-faq-item {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .bytebodh-faq-item:last-child {
          border-bottom: none;
        }

        .bytebodh-faq-item.active {
          background: #f8fafc;
        }

        .bytebodh-faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 1.5rem 2rem;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #0f172a;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .bytebodh-faq-question:hover {
          background: #f8fafc;
          color: #0284c7;
        }

        .bytebodh-faq-question span {
          flex: 1;
          margin-right: 1rem;
        }

        .bytebodh-faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background: white;
        }

        .bytebodh-faq-item.active .bytebodh-faq-answer {
          max-height: 500px;
        }

        .bytebodh-faq-answer p {
          padding: 0 2rem 1.5rem;
          margin: 0;
          color: #64748b;
          line-height: 1.6;
          font-size: 1rem;
        }

        .bytebodh-faq-cta {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 3rem;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
        }

        .bytebodh-cta-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.5rem;
        }

        .bytebodh-cta-description {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .bytebodh-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .bytebodh-cta-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .bytebodh-cta-btn.primary {
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          color: white;
        }

        .bytebodh-cta-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.3);
          color: white;
          text-decoration: none;
        }

        .bytebodh-cta-btn.secondary {
          background: transparent;
          color: #0284c7;
          border-color: #0284c7;
        }

        .bytebodh-cta-btn.secondary:hover {
          background: #0284c7;
          color: white;
          transform: translateY(-2px);
          text-decoration: none;
        }

        /* Animation for FAQ items */
        @keyframes bytebodh-faqSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bytebodh-faq-item.active .bytebodh-faq-answer p {
          animation: bytebodh-faqSlideDown 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 991.98px) {
          .bytebodh-faq-title {
            font-size: 2.25rem;
          }
          
          .bytebodh-faq-section {
            padding: 4rem 0;
          }
          
          .bytebodh-faq-question {
            padding: 1.25rem 1.5rem;
            font-size: 1rem;
          }
          
          .bytebodh-faq-answer p {
            padding: 0 1.5rem 1.25rem;
          }
        }

        @media (max-width: 768px) {
          .bytebodh-faq-title {
            font-size: 2rem;
          }
          
          .bytebodh-faq-description {
            font-size: 1rem;
          }
          
          .bytebodh-cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .bytebodh-cta-btn {
            width: 200px;
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .bytebodh-faq-title {
            font-size: 1.75rem;
          }
          
          .bytebodh-faq-section {
            padding: 3rem 0;
          }
          
          .bytebodh-faq-question {
            padding: 1rem 1.25rem;
          }
          
          .bytebodh-faq-answer p {
            padding: 0 1.25rem 1rem;
          }
          
          .bytebodh-faq-cta {
            padding: 2rem;
          }
        }
      `}</style>
    </section>
  );
}

export default FAQSection;
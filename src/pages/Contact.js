// src/pages/Contact.js
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaWhatsapp,
  FaHeadset,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    project_type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://bytebodh.codewithsathya.info/api/contact/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message ||
            "Thank you for contacting us! We'll get back to you soon.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        );
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          budget: "",
          project_type: "",
          message: "",
        });
      } else {
        // Handle validation errors
        const errorMessage =
          data.detail ||
          Object.values(data).flat().join(", ") ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error(
        "Network error. Please check your connection and try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description:
        "Round-the-clock assistance for all your queries and concerns",
    },
    {
      icon: <FaClock />,
      title: "Quick Response",
      description: "Get responses within 2 hours during business hours",
    },
    {
      icon: <FaCheckCircle />,
      title: "Expert Consultation",
      description: "Free technical consultation for your project requirements",
    },
  ];

  return (
    <>
      <Header />
      <div className="bytebodh-contact-page">
        {/* Hero Section */}
        <section className="bytebodh-contact-hero">
          <Container>
            <Row className="text-center py-5">
              <Col lg={8} className="mx-auto">
                <Badge bg="primary" className="bytebodh-hero-badge mb-3">
                  Get In Touch
                </Badge>
                <h1 className="bytebodh-hero-title mb-3">
                  Let's Build Something{" "}
                  <span className="bytebodh-hero-gradient">
                    Amazing Together
                  </span>
                </h1>
                <p className="bytebodh-hero-description">
                  Ready to start your project? We're here to help transform your
                  ideas into reality. Get a free consultation and quote for your
                  project.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Contact Form & Info */}
        <section className="bytebodh-contact-main py-5">
          <Container>
            <Row className="g-5 align-items-start">
              {/* Left Side - Contact Information */}
              <Col lg={6}>
                <div className="bytebodh-contact-content">
                  <h2 className="bytebodh-content-title mb-4">
                    We're Always Available at Your Service
                  </h2>
                  <p className="bytebodh-content-description mb-4">
                    At ByteBodh, we believe in being accessible whenever you
                    need us. Whether you're a solo entrepreneur with a big idea
                    or a small business looking to scale, we're here to provide
                    the technical expertise and support you need to succeed.
                  </p>
                  <p className="bytebodh-content-description mb-5">
                    Our remote-first approach means we can collaborate
                    seamlessly from anywhere, ensuring you get the same
                    high-quality service regardless of your location. Let's
                    discuss your project and find the perfect solution for your
                    needs.
                  </p>

                  {/* Contact Methods */}
                  <div className="bytebodh-contact-methods mb-5">
                    <div className="bytebodh-contact-method">
                      <div className="bytebodh-method-icon">
                        <FaEnvelope />
                      </div>
                      <div className="bytebodh-method-details">
                        <h5>Email Us</h5>
                        <p>info@bytebodh.in</p>
                        <span>Professional responses within 24 hours</span>
                      </div>
                    </div>

                    <div className="bytebodh-contact-method">
                      <div className="bytebodh-method-icon">
                        <FaPhone />
                      </div>
                      <div className="bytebodh-method-details">
                        <h5>Call Us</h5>
                        <p>+91 8519965746</p>
                        <span>Mon-Fri: 9:00 AM - 6:00 PM IST</span>
                      </div>
                    </div>

                    <div className="bytebodh-contact-method">
                      <div className="bytebodh-method-icon">
                        <FaWhatsapp />
                      </div>
                      <div className="bytebodh-method-details">
                        <h5>WhatsApp</h5>
                        <p>+91 8519965746</p>
                        <span>Quick chat for instant support</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="bytebodh-contact-features">
                    <h5 className="bytebodh-features-title mb-4">
                      Why Choose Us?
                    </h5>
                    <Row>
                      {features.map((feature, index) => (
                        <Col key={index} md={12} className="mb-3">
                          <div className="bytebodh-feature-item">
                            <div className="bytebodh-feature-icon">
                              {feature.icon}
                            </div>
                            <div className="bytebodh-feature-content">
                              <h6>{feature.title}</h6>
                              <p>{feature.description}</p>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </Col>

              {/* Right Side - Contact Form */}
              <Col lg={6}>
                <Card className="bytebodh-contact-card">
                  <Card.Body className="p-4">
                    <div className="bytebodh-form-header text-center mb-4">
                      <h3 className="bytebodh-form-title mb-2">
                        Start Your Project
                      </h3>
                      <p className="bytebodh-form-subtitle">
                        Fill out the form below and we'll get back to you within
                        24 hours
                      </p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="bytebodh-form-label">
                              Full Name *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              className="bytebodh-form-control"
                              required
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="bytebodh-form-label">
                              Email Address *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              className="bytebodh-form-control"
                              required
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="bytebodh-form-label">
                              Phone Number
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Enter your phone number"
                              className="bytebodh-form-control"
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="bytebodh-form-label">
                              Project Budget
                            </Form.Label>
                            <Form.Select
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              className="bytebodh-form-select"
                              disabled={loading}
                            >
                              <option value="">Select budget range</option>
                              <option value="5k-15k">₹5,000 - ₹15,000</option>
                              <option value="15k-30k">₹15,000 - ₹30,000</option>
                              <option value="30k-50k">₹30,000 - ₹50,000</option>
                              <option value="50k+">₹50,000+</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label className="bytebodh-form-label">
                              Project Type
                            </Form.Label>
                            <Form.Select
                              name="project_type"
                              value={formData.project_type}
                              onChange={handleChange}
                              className="bytebodh-form-select"
                              disabled={loading}
                            >
                              <option value="">Select project type</option>
                              <option value="website">
                                Website Development
                              </option>
                              <option value="mobile">Mobile App</option>
                              <option value="ecommerce">
                                E-commerce Store
                              </option>
                              <option value="consultation">
                                IT Consultation
                              </option>
                              <option value="other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label className="bytebodh-form-label">
                              Project Details *
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={6}
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              placeholder="Tell us about your project requirements, timeline, goals, and any specific features you need. The more details you provide, the better we can assist you."
                              className="bytebodh-form-control"
                              required
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <div className="bytebodh-form-footer">
                            <Button
                              type="submit"
                              className="bytebodh-submit-btn w-100"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                  />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <FaPaperPlane className="me-2" />
                                  Send Message & Get Free Quote
                                </>
                              )}
                            </Button>
                            <p className="bytebodh-form-note text-center mt-3">
                              We respect your privacy. Your information is safe
                              with us.
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      <Footer />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <style jsx>{`
        .bytebodh-contact-page {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          min-height: 100vh;
        }

        .bytebodh-contact-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 4rem 0 2rem;
        }

        .bytebodh-hero-badge {
          background: linear-gradient(
            135deg,
            #0284c7 0%,
            #6366f1 100%
          ) !important;
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

        .bytebodh-contact-content {
          padding-right: 2rem;
        }

        .bytebodh-content-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .bytebodh-content-description {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.7;
        }

        .bytebodh-contact-methods {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
        }

        .bytebodh-contact-method {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 1.5rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .bytebodh-contact-method:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .bytebodh-contact-method:first-child {
          padding-top: 0;
        }

        .bytebodh-method-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .bytebodh-method-details h5 {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .bytebodh-method-details p {
          color: #0284c7;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .bytebodh-method-details span {
          color: #64748b;
          font-size: 0.9rem;
        }

        .bytebodh-features-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .bytebodh-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .bytebodh-feature-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .bytebodh-feature-icon {
          width: 50px;
          height: 50px;
          background: rgba(2, 132, 199, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0284c7;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .bytebodh-feature-content h6 {
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .bytebodh-feature-content p {
          color: #64748b;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        /* Form Styles */
        .bytebodh-contact-card {
          border: none;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          background: white;
          position: sticky;
          top: 2rem;
        }

        .bytebodh-form-header {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1.5rem;
        }

        .bytebodh-form-title {
          color: #0f172a;
          font-weight: 700;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .bytebodh-form-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .bytebodh-form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bytebodh-form-control,
        .bytebodh-form-select {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.875rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .bytebodh-form-control:focus,
        .bytebodh-form-select:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
          background: white;
          outline: none;
        }

        .bytebodh-form-control:disabled,
        .bytebodh-form-select:disabled {
          background-color: #f8fafc;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .bytebodh-form-control::placeholder {
          color: #9ca3af;
        }

        .bytebodh-submit-btn {
          background: linear-gradient(
            135deg,
            #0284c7 0%,
            #6366f1 100%
          ) !important;
          border: none;
          padding: 1rem 2rem;
          font-weight: 600;
          border-radius: 12px;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .bytebodh-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.4);
        }

        .bytebodh-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .bytebodh-submit-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .bytebodh-submit-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .bytebodh-form-note {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0;
        }

        .bytebodh-form-footer {
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        @media (max-width: 991.98px) {
          .bytebodh-contact-content {
            padding-right: 0;
            margin-bottom: 3rem;
          }

          .bytebodh-content-title {
            font-size: 2rem;
          }

          .bytebodh-hero-title {
            font-size: 2.25rem;
          }

          .bytebodh-contact-card {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .bytebodh-hero-title {
            font-size: 2rem;
          }

          .bytebodh-hero-description {
            font-size: 1.1rem;
          }

          .bytebodh-content-title {
            font-size: 1.75rem;
          }

          .bytebodh-contact-method {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .bytebodh-method-icon {
            align-self: center;
          }
        }

        @media (max-width: 576px) {
          .bytebodh-hero-title {
            font-size: 1.75rem;
          }

          .bytebodh-content-title {
            font-size: 1.5rem;
          }

          .bytebodh-contact-methods {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default Contact;
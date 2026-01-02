// src/pages/Contact.js
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaWhatsapp,
  FaHeadset,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaInfoCircle
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API_BASE_URL from "../config/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    // Email validation (optional but must be valid if provided)
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format mobile number as user types
    let formattedValue = value;
    if (name === "mobileNumber") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, '');
      // Limit to 10 digits
      formattedValue = digits.slice(0, 10);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare data according to your API structure
      const contactData = {
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber.replace(/\D/g, ''),
        email: formData.email.trim() || null, // Send null if empty
        message: formData.message.trim(),
      };

      // Make API call using axios
      const response = await api.post("/api/contacts", contactData);
      console.log(response.data)

      toast.success("Thank you for contacting us! We'll get back to you soon.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      
      // Reset form
      setFormData({
        name: "",
        mobileNumber: "",
        email: "",
        message: "",
      });
      setErrors({});
      
    } catch (error) {
      console.error("Contact form submission error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { data, status } = error.response;
        
        if (status === 400) {
          // Handle validation errors from backend
          if (data.errors) {
            errorMessage = Object.values(data.errors).flat().join(", ");
          } else if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.message) {
            errorMessage = data.message;
          }
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaHeadset className="text-xl" />,
      title: "24/7 Support",
      description:
        "Round-the-clock assistance for all your queries and concerns",
    },
    {
      icon: <FaClock className="text-xl" />,
      title: "Quick Response",
      description: "Get responses within 2 hours during business hours",
    },
    {
      icon: <FaCheckCircle className="text-xl" />,
      title: "Expert Consultation",
      description: "Free technical consultation for your project requirements",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-medium mb-6">
                <FaEnvelope className="mr-2" />
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Let's Build Something{" "}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Amazing Together
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Ready to start your project? We're here to help transform your
                ideas into reality. Get a free consultation and quote for your
                project.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Side - Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    We're Always Available at Your Service
                  </h2>
                  <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                    At ByteBodh, we believe in being accessible whenever you
                    need us. Whether you're a solo entrepreneur with a big idea
                    or a small business looking to scale, we're here to provide
                    the technical expertise and support you need to succeed.
                  </p>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Our remote-first approach means we can collaborate
                    seamlessly from anywhere, ensuring you get the same
                    high-quality service regardless of your location. Let's
                    discuss your project and find the perfect solution for your
                    needs.
                  </p>
                </div>

                {/* Contact Methods */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-white text-lg" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900">Email Us</h5>
                      <p className="text-blue-600 font-semibold">info@bytebodh.in</p>
                      <p className="text-sm text-gray-500">Professional responses within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-white text-lg" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900">Call Us</h5>
                      <p className="text-green-600 font-semibold">+91 8519965746</p>
                      <p className="text-sm text-gray-500">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp className="text-white text-lg" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900">WhatsApp</h5>
                      <p className="text-green-700 font-semibold">+91 8519965746</p>
                      <p className="text-sm text-gray-500">Quick chat for instant support</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h5 className="text-xl font-bold text-gray-900 mb-6">
                    Why Choose Us?
                  </h5>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <div className="text-blue-600">
                              {feature.icon}
                            </div>
                          </div>
                          <div>
                            <h6 className="font-bold text-gray-900 mb-1">{feature.title}</h6>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="sticky top-6">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Get in Touch
                    </h3>
                    <p className="text-gray-600">
                      Fill out the form below and we'll get back to you within 24 hours
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.name ? 'border-red-500' : 'border-gray-200'
                        }`}
                        disabled={loading}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfoCircle className="mr-1" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter your 10-digit mobile number"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.mobileNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                        disabled={loading}
                      />
                      {errors.mobileNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfoCircle className="mr-1" /> {errors.mobileNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                        disabled={loading}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfoCircle className="mr-1" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Tell us about your project, questions, or concerns. We're here to help!"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.message ? 'border-red-500' : 'border-gray-200'
                        }`}
                        disabled={loading}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <FaInfoCircle className="mr-1" /> {errors.message}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        Maximum 1000 characters
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            <span>Send Message</span>
                            <FaArrowRight />
                          </>
                        )}
                      </button>
                      <p className="mt-4 text-center text-sm text-gray-500">
                        We respect your privacy. Your information is safe with us.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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
    </>
  );
}

export default Contact;
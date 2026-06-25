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
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === "mobileNumber") {
      const digits = value.replace(/\D/g, "");
      formattedValue = digits.slice(0, 10);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    
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
      const contactData = {
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
        email: formData.email.trim() || null,
        message: formData.message.trim(),
      };

      const response = await api.post("/api/contacts", contactData);
      console.log(response.data);

      toast.success("Thank you for contacting us! We'll get back to you soon.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      
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
        const { data, status } = error.response;
        if (status === 400) {
          if (data.errors) {
            errorMessage = Object.values(data.errors).flat().join(", ");
          } else if (typeof data === "string") {
            errorMessage = data;
          } else if (data.message) {
            errorMessage = data.message;
          }
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
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
      description: "Round-the-clock assistance for all your queries and concerns",
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
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-600">
            <FaEnvelope className="text-emerald-500" />
            <span>Get In Touch</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black leading-[1.1] text-slate-900 tracking-tight">
            Let's Build Something <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Amazing Together</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Ready to start your project? We're here to help transform your ideas into reality. Get a free consultation and quote for your project.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Contact Information */}
            <div className="space-y-8 text-left">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                  We're Always Available at Your Service
                </h2>
                <p className="text-base text-slate-500 font-medium leading-relaxed mb-4">
                  At ByteBodh, we believe in being accessible whenever you need us. Whether you're a solo entrepreneur with a big idea or a small business looking to scale, we're here to provide the technical expertise and support you need to succeed.
                </p>
                <p className="text-base text-slate-500 font-medium leading-relaxed">
                  Our remote-first approach means we can collaborate seamlessly from anywhere, ensuring you get the same high-quality service regardless of your location. Let's discuss your project and find the perfect solution for your needs.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-emerald-500/20">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-base">Email Us</h5>
                    <p className="text-emerald-500 font-bold text-sm">info@bytebodh.in</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Professional responses within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-emerald-500/20">
                    <FaPhone className="text-lg" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-base">Call Us</h5>
                    <p className="text-emerald-500 font-bold text-sm">+91 8519965746</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-emerald-500/20">
                    <FaWhatsapp className="text-lg" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-base">WhatsApp</h5>
                    <p className="text-emerald-500 font-bold text-sm">+91 8519965746</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Quick chat for instant support</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <h5 className="text-xl font-black text-slate-900 tracking-tight">
                  Why Choose Us?
                </h5>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <div className="text-emerald-600">
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <h6 className="font-bold text-slate-900 text-base mb-1">{feature.title}</h6>
                          <p className="text-slate-500 text-sm font-medium">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="sticky top-24 lg:w-full">
              <div className="bg-white rounded-[2.5rem] border border-slate-200/50 p-8 shadow-2xl space-y-6 text-left">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    Get in Touch
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition-all duration-200 ${
                        errors.name ? "border-red-500" : "border-slate-200/80"
                      }`}
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center font-bold">
                        <FaInfoCircle className="mr-1" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit mobile number"
                      className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition-all duration-200 ${
                        errors.mobileNumber ? "border-red-500" : "border-slate-200/80"
                      }`}
                      disabled={loading}
                    />
                    {errors.mobileNumber && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center font-bold">
                        <FaInfoCircle className="mr-1" /> {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition-all duration-200 ${
                        errors.email ? "border-red-500" : "border-slate-200/80"
                      }`}
                      disabled={loading}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center font-bold">
                        <FaInfoCircle className="mr-1" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Tell us about your project, questions, or concerns."
                      className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition-all duration-200 ${
                        errors.message ? "border-red-500" : "border-slate-200/80"
                      }`}
                      disabled={loading}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center font-bold">
                        <FaInfoCircle className="mr-1" /> {errors.message}
                      </p>
                    )}
                    <p className="mt-2 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                      Maximum 1000 characters
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
                          <FaArrowRight size={12} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-400 font-medium">
                      We respect your privacy. Your information is safe with us.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
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
    </div>
  );
}

export default Contact;
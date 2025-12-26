import React, { useState } from 'react';
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
    <section className="bg-white py-16 relative" id="faq">
      <div className="container mx-auto px-4">
        {/* FAQ Title Section */}
        <div className="text-center mb-12">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 text-sm font-medium rounded-full inline-flex items-center mb-3">
            <FaQuestionCircle className="mr-2" />
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Get Answers to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Common Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find quick answers to the most common questions about our services, pricing, and process. Can't find what you're looking for? Contact us directly.
          </p>
        </div>

        {/* FAQ List with Increased Width */}
        <div className="mx-auto max-w-5xl">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${
                activeIndex === index ? 'ring-2 ring-blue-100 shadow-md' : ''
              }`}
            >
              <button
                className="w-full text-left py-5 px-8 flex justify-between items-center focus:outline-none rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg md:text-xl font-semibold text-gray-800 pr-4">{faq.question}</span>
                {activeIndex === index ? (
                  <FaChevronUp className="text-blue-500 flex-shrink-0" size={20} />
                ) : (
                  <FaChevronDown className="text-gray-500 flex-shrink-0" size={20} />
                )}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="py-4 px-8 pb-6 text-gray-600">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4"></div>
                  <p className="text-base md:text-lg leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional CTA Section */}
        <div className="mt-12 max-w-5xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-10 border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're here to help you with any questions you might have about our services or how we can assist with your project.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
              Contact Us Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
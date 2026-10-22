import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Byte Bodh?",
      answer: "Byte Bodh is an all-in-one personal branding platform. It provides a portfolio website builder, Linktree bio link engine with 6 modular themes, Instagram Comment-to-DM lead automation, and dynamic QR analytics."
    },
    {
      question: "What IT technologies does Byte Bodh cover?",
      answer: "Byte Bodh covers a wide range of developer templates including Hacker Terminal, VS Code IDE Studio, Ivory Elite, Academic Minimalist, and more."
    },
    {
      question: "How does Linktree & Instagram Automation work?",
      answer: "You can create dynamic link-in-bio pages at bytebodh.in/yourname with scheduled links and custom themes. Connect your Instagram Professional account to automatically send direct messages whenever users comment specific keywords on your reels or posts."
    },
    {
      question: "Can I build an online portfolio with Byte Bodh?",
      answer: "Yes! Byte Bodh includes an online portfolio builder where you can create a professional profile showcasing your skills, projects, and experience. You can share your portfolio link with recruiters and download your resume in PDF format."
    },
    {
      question: "Where can I download the Byte Bodh app?",
      answer: "Byte Bodh is available on the Google Play Store. Simply search for 'Byte Bodh' or use the download link on this website. The app is free to download and get started."
    },
    {
      question: "Is Byte Bodh suitable for beginners?",
      answer: "Absolutely! Byte Bodh is built with students in mind. Whether you're just starting with Java or looking to advance your Android development skills, the tutorials are designed to be easy to follow with practical examples."
    },
    {
      question: "What tools are available on the Byte Bodh website?",
      answer: "The Byte Bodh website offers an all-in-one portfolio website builder, 6 modular Linktree bio templates, Instagram Comment-to-DM automation, and dynamic QR Code generation to help you stand out to recruiters and clients."
    },
    {
      question: "How do I create an account?",
      answer: "You can register for free on the Byte Bodh website. Sign up with your email or use Google Sign-In for a quick start. Once registered, you'll have access to your portfolio, Linktree bio, and automation features."
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
            Find quick answers to the most common questions about Byte Bodh, portfolio templates, Linktree pages, and automation features. Can't find what you're looking for? Contact us directly.
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
              We're here to help you with any questions about Byte Bodh, portfolio features, Linktree pages, or Instagram automation.
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
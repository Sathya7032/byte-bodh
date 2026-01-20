import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp, 
  FaQuestionCircle, 
  FaSearch, 
  FaLightbulb,
  FaUser,
  FaQrcode,
  FaGlobe,
  FaArrowRight,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Questions' },
    { id: 'qr', name: 'QR Code Generators' },
    { id: 'portfolio', name: 'Online Portfolio' },
    { id: 'account', name: 'Account & Username' },
    { id: 'technical', name: 'Technical Issues' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'qr',
      question: 'How do I create a QR code?',
      answer: 'Navigate to the QR Code Generator section, select the type of QR code you want (URL, Text, WiFi, etc.), enter your content, customize the design, and click "Generate". You can then download or share your QR code.'
    },
    {
      id: 2,
      category: 'qr',
      question: 'Can I customize the design of my QR code?',
      answer: 'Yes! Our QR code generator allows you to customize colors, add logos, change the pattern style, and adjust the frame. All customizations maintain QR code scannability.'
    },
    {
      id: 3,
      category: 'portfolio',
      question: 'How do I set up my online portfolio?',
      answer: 'After creating an account, go to "My Portfolio", choose a template, add your personal information, projects, skills, and social links. Your portfolio will be accessible at bytebodh.in/yourusername'
    },
    {
      id: 4,
      category: 'portfolio',
      question: 'Can I change my portfolio URL/username?',
      answer: 'Username can be changed once every 30 days from your account settings. Your portfolio URL will automatically update to reflect the new username.'
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I recover my account?',
      answer: 'Click "Forgot Password" on the login page, enter your registered email, and follow the instructions sent to your inbox. If you need further assistance, contact our support team.'
    },
    {
      id: 6,
      category: 'technical',
      question: 'The QR code is not scanning properly. What should I do?',
      answer: 'Ensure the QR code has sufficient contrast, is not too small for scanning, and doesn\'t have too much design interference in the critical scanning areas. Try using our "Test Scan" feature.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    activeCategory === 'all' || faq.category === activeCategory
  ).filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resources = [
    {
      icon: <FaQrcode className="text-2xl" />,
      title: 'QR Code Guide',
      description: 'Complete guide to creating and using QR codes effectively',
      link: '/guides/qr-code-guide'
    },
    {
      icon: <FaUser className="text-2xl" />,
      title: 'Portfolio Setup',
      description: 'Step-by-step tutorial for building your online portfolio',
      link: '/guides/portfolio-setup'
    },
    {
      icon: <FaGlobe className="text-2xl" />,
      title: 'Custom Domains',
      description: 'Learn how to connect your custom domain to ByteBodh',
      link: '/guides/custom-domains'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Help & Support Center
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get help with QR Code Generators, Online Portfolios, and all ByteBodh features
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FaQrcode className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold">QR Code Generator</h3>
            </div>
            <p className="text-gray-600 mb-4">Create custom QR codes for any purpose</p>
            <a href="/qr-generator" className="text-blue-600 font-medium hover:text-blue-700 flex items-center">
              Generate Now <FaArrowRight className="ml-2" />
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <FaUser className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold">My Portfolio</h3>
            </div>
            <p className="text-gray-600 mb-4">Build and customize your online portfolio</p>
            <a href="/portfolio" className="text-purple-600 font-medium hover:text-purple-700 flex items-center">
              Manage Portfolio <FaArrowRight className="ml-2" />
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FaLightbulb className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold">Coming Soon</h3>
            </div>
            <p className="text-gray-600 mb-4">New features and tools in development</p>
            <button className="text-green-600 font-medium hover:text-green-700 flex items-center">
              View Roadmap <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {faqCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map(faq => (
              <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    const element = document.getElementById(`answer-${faq.id}`);
                    if (element) {
                      element.classList.toggle('hidden');
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <FaQuestionCircle className="text-blue-500" />
                  </div>
                </button>
                <div id={`answer-${faq.id}`} className="hidden px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact Our Support Team</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bytebodh-contact-method bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bytebodh-method-icon bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaEnvelope className="text-blue-600 text-2xl" />
              </div>
              <div className="bytebodh-method-details">
                <h5 className="text-xl font-semibold mb-2">Email Us</h5>
                <p className="text-lg text-blue-600 mb-2">info@bytebodh.in</p>
                <span className="text-gray-600 text-sm">Professional responses within 24 hours</span>
              </div>
            </div>

            <div className="bytebodh-contact-method bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bytebodh-method-icon bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaPhone className="text-green-600 text-2xl" />
              </div>
              <div className="bytebodh-method-details">
                <h5 className="text-xl font-semibold mb-2">Call Us</h5>
                <p className="text-lg text-green-600 mb-2">+91 8519965746</p>
                <span className="text-gray-600 text-sm">Mon-Fri: 9:00 AM - 6:00 PM IST</span>
              </div>
            </div>

            <div className="bytebodh-contact-method bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bytebodh-method-icon bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FaWhatsapp className="text-green-600 text-2xl" />
              </div>
              <div className="bytebodh-method-details">
                <h5 className="text-xl font-semibold mb-2">WhatsApp</h5>
                <p className="text-lg text-green-600 mb-2">+91 8519965746</p>
                <span className="text-gray-600 text-sm">Quick chat for instant support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Helpful Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    {resource.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{resource.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <span className="text-blue-600 font-medium flex items-center">
                  Read Guide <FaArrowRight className="ml-2" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Community & Social */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Connect with other ByteBodh users, share your creations, and get inspired
            </p>
            
            <div className="flex justify-center space-x-6">
              <a href="/" className="text-blue-600 hover:text-blue-700">
                <FaFacebook size={28} />
              </a>
              <a href="/" className="text-blue-400 hover:text-blue-500">
                <FaTwitter size={28} />
              </a>
              <a href="/" className="text-pink-600 hover:text-pink-700">
                <FaInstagram size={28} />
              </a>
              <a href="/" className="text-blue-700 hover:text-blue-800">
                <FaLinkedin size={28} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">
            &copy; {new Date().getFullYear()} ByteBodh. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="/privacy" className="hover:text-blue-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-blue-300">Terms of Service</a>
            <a href="/cookies" className="hover:text-blue-300">Cookie Policy</a>
            <a href="/sitemap" className="hover:text-blue-300">Sitemap</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
import React from 'react';
import { FaUser, FaRocket, FaChartLine, FaUsers } from 'react-icons/fa';

function AboutSection() {
  return (
    <section className="bytebodh-about bg-gradient-to-br from-white to-gray-100 relative py-20 px-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="bytebodh-about-badge inline-flex items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white py-2 px-6 rounded-full mb-6">
            <FaUser className="mr-2" />
            About Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Empowering Your Digital Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Building powerful tools for businesses and students to succeed
          </p>
        </div>

        {/* Main Content - Image & Text Side by Side */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Side */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Team collaboration" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20"></div>
            </div>
          </div>

          {/* Text Side */}
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="text-3xl font-bold text-gray-800 leading-tight">
              Smart Digital Tools for Modern Challenges
            </h3>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              At <strong className="text-blue-600">ByteBodh</strong>, we create powerful, easy-to-use digital tools designed for both growing businesses and ambitious students. Whether you're an entrepreneur streamlining workflows or a student enhancing productivity, our solutions are built to simplify tasks, improve efficiency, and support your long-term goals.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              We build practical, affordable, and scalable tools that solve real problems — from business automation to student-friendly utilities that boost learning and project management. No complexity, no high costs — just tools that help you work smarter, stay organized, and grow confidently.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaRocket className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Fast & Efficient</h4>
                  <p className="text-sm text-gray-600">Streamlined workflows</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <FaChartLine className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Scalable</h4>
                  <p className="text-sm text-gray-600">Grow with your needs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaUsers className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">User-Friendly</h4>
                  <p className="text-sm text-gray-600">Easy to use</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <FaUser className="text-pink-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">For Everyone</h4>
                  <p className="text-sm text-gray-600">Students & businesses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>

      <style jsx>{`
        .bytebodh-about::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230284c7' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>
    </section>
  );
}

export default AboutSection;

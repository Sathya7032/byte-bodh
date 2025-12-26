import React from 'react';
import { FaUser } from 'react-icons/fa';

function AboutSection() {
  return (
    <section className="bytebodh-about bg-gradient-to-br from-white to-gray-100 relative py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-center py-20">
          <div className="lg:w-10/12 text-center">
            <div className="bytebodh-about-badge inline-flex items-center bg-gradient-to-br from-blue-600 to-indigo-500 text-white py-2 px-6 rounded-full mb-6">
              <FaUser className="mr-2" />
              About Us
            </div>

            <h2 className="bytebodh-about-title text-4xl font-bold leading-tight text-gray-800 mb-6">
              Empowering Businesses and Students Through Smart Digital Tools
            </h2>

            <p className="bytebodh-about-description text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-6">
              At <strong>ByteBodh</strong>, we create powerful, easy-to-use digital tools designed for both growing businesses and ambitious students. Whether you're an entrepreneur streamlining workflows or a student enhancing productivity, our solutions are built to simplify tasks, improve efficiency, and support your long-term goals.
            </p>

            <p className="bytebodh-about-description text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
              We build practical, affordable, and scalable tools that solve real problems — from business automation to student-friendly utilities that boost learning and project management. No complexity, no high costs — just tools that help you work smarter, stay organized, and grow confidently.
            </p>

            <div className="bytebodh-cta bg-gradient-to-br from-blue-600 to-indigo-500 text-white py-10 px-6 rounded-lg mt-12">
              <p className="bytebodh-cta-text text-xl leading-relaxed">
                <strong>Ready to take the next step?</strong> Let ByteBodh empower your journey with smart tools made for both business growth and student success.
              </p>
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

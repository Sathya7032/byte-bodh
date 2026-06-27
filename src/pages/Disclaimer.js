import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";

function Disclaimer() {
  useSEO({
    title: "Disclaimer | ByteBodh - AI Portfolio & Career Hub",
    description: "Read the legal disclaimer for ByteBodh. Learn about our terms of information liability, external links, job aggregation, and developer tool usage.",
    keywords: "disclaimer, bytebodh disclaimer, legal disclaimer, job board terms, portfolio builder terms"
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600 flex flex-col justify-between">
      <Header />
      
      <div className="flex-grow pt-36 pb-20 bg-gradient-to-br from-emerald-50/10 via-white to-teal-50/10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Disclaimer
            </h1>
            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl border border-slate-200/50 p-8 sm:p-10 shadow-sm space-y-8 text-left">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                1. General Information Disclaimer
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                The information provided by ByteBodh ("we," "us," or "our") on <a href="https://bytebodh.in" className="text-emerald-500 hover:underline">https://bytebodh.in</a> (the "Site") is for general informational and educational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
              </p>
              <div className="bg-emerald-50/50 border border-emerald-500/10 rounded-2xl p-4 mt-4">
                <p className="text-emerald-800 font-bold mb-1">Important Notice:</p>
                <p className="text-emerald-700 text-xs font-semibold leading-relaxed">
                  Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                2. Job Notifications & Employment Disclaimer
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">
                ByteBodh acts as an information aggregator that lists and summarizes job openings, placement notifications, and career drives. Please note the following regarding our job notification features:
              </p>
              <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2 mb-4">
                <li>We are <span className="font-bold text-slate-700">not a recruitment agency</span>, hiring firm, or representative of any employers listed on our Site.</li>
                <li>We do not guarantee the validity, accuracy, or active status of any job post listed. Users must verify details directly with the official employer or recruitment page before applying.</li>
                <li>ByteBodh <span className="font-bold text-slate-700">never charges candidates money</span> for job applications, screening, or interview placement support. We strongly advise users to never pay money to any entity claiming to represent recruiters.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                3. Online Developer Tools & Services Disclaimer
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                Our suite of digital utilities (including the Online Code Editor, Image Compressor, QR Code Generator, and Invoice Generator) is provided on an "as is" and "as available" basis without any warranty of performance, security, or utility.
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <span className="font-bold text-slate-800 block text-xs">Code Editor & Compilers</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed block">
                    Execution of user code is sandbox-simulated and intended for learning. We make no warranty that compiler environments or compiler outputs match production servers.
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <span className="font-bold text-slate-800 block text-xs">Image Compressor & Utilities</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed block">
                    File compressions occur client-side inside your browser context. We do not store or claim ownership of uploaded media or data.
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                4. External Links Disclaimer
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                5. Professional & Tutorial Disclaimer
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                The Site cannot and does not contain professional IT consulting or engineering advice. The tech tutorials, coding guidelines, and blogs are provided for general educational purposes only and are not a substitute for professional consultations. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                6. Testimonials Disclaimer
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services. We do not claim, and you should not assume, that all users will have the same experiences. Your individual results may vary.
              </p>
            </section>

            <section className="pt-4">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                7. Contact Us
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                If you have any questions or require clarifications regarding this Disclaimer, please do not hesitate to contact our legal support team:
              </p>
              
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-sm">
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">ByteBodh Support</h5>
                    <div className="space-y-2 text-slate-600 font-semibold">
                      <p>
                        <span className="font-bold">Email:</span>{' '}
                        <a href="mailto:info@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          info@bytebodh.in
                        </a>
                      </p>
                      <p>
                        <span className="font-bold">Phone:</span>{' '}
                        <a href="tel:+917032488372" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          +91-7032488372
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">Corporate Office</h5>
                    <div className="space-y-2 text-slate-500 font-medium">
                      <p>ByteBodh Tech Solutions</p>
                      <p>Andhra Pradesh, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Disclaimer;

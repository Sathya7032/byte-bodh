import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useSEO from "../hooks/useSEO";


function TermsAndConditions() {
  useSEO({
    title: "Terms and Conditions | ByteBodh - User Agreement",
    description: "Read the Terms and Conditions of ByteBodh. Learn about access licenses, account security, limitations of liability, and service conditions.",
    keywords: "terms and conditions, user agreement, bytebodh terms, developer tools usage"
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600 flex flex-col justify-between">
      <Header />
      
      <div className="flex-grow pt-36 pb-20 bg-gradient-to-br from-emerald-50/10 via-white to-teal-50/10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl border border-slate-200/50 p-8 sm:p-10 shadow-sm space-y-8">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                By accessing and using ByteBodh ("the Website"), you accept and agree to be bound 
                by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                2. Use License
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">
                Permission is granted to temporarily access the materials (information or software) 
                on ByteBodh's website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                This license shall automatically terminate if you violate any of these restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                3. Services
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                ByteBodh provides IT technology tutorials and services for small and micro businesses. 
                Our services include but are not limited to:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm font-medium space-y-2">
                <li>Website development starting from ₹5,000</li>
                <li>Web application development</li>
                <li>IT consultation services</li>
                <li>Technical tutorials and blog content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                4. User Accounts
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current 
                information. You are responsible for safeguarding your account password and for any 
                activities under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                5. Intellectual Property
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                The content, organization, graphics, design, and other matters related to the Website 
                are protected under applicable copyrights and other proprietary laws. The copying, 
                redistribution, use, or publication by you of any such matters is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                6. Limitations
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                In no event shall ByteBodh or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising 
                out of the use or inability to use the materials on ByteBodh's website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                7. Service Modifications
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                ByteBodh reserves the right to modify or discontinue, temporarily or permanently, the 
                Service with or without notice. Prices of all Services are subject to change.
              </p>
            </section>

            <section className="pt-4">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                8. Contact Information
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                For any questions regarding these Terms and Conditions, please contact us:
              </p>
              
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-sm">
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">ByteBodh</h5>
                    <div className="space-y-2 text-slate-600 font-semibold">
                      <p>
                        <span className="font-bold">Phone:</span>{" "}
                        <a href="tel:+917032488372" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          +91 70324 88372
                        </a>
                      </p>
                      <p>
                        <span className="font-bold">Email:</span>{" "}
                        <a href="mailto:info@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          info@bytebodh.in
                        </a>
                      </p>
                      <p>
                        <span className="font-bold">Legal:</span>{" "}
                        <a href="mailto:legal@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          legal@bytebodh.in
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">Response Time</h5>
                    <div className="space-y-2 text-slate-500 font-medium">
                      <p>General Inquiries: Within 24 hours</p>
                      <p>Legal Matters: 2-3 business days</p>
                      <p>Technical Support: Within 12 hours</p>
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

export default TermsAndConditions;
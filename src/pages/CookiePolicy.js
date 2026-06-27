import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useSEO from "../hooks/useSEO";


function CookiePolicy() {
  useSEO({
    title: "Cookie Policy | ByteBodh - Tracking & Settings",
    description: "Read the Cookie Policy of ByteBodh. Learn how we use cookies, what cookies we track, and how you can manage cookie settings.",
    keywords: "cookie policy, bytebodh cookies, tracking preferences, performance cookies"
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600 flex flex-col justify-between">
      <Header />
      
      <div className="flex-grow pt-36 pb-20 bg-gradient-to-br from-emerald-50/10 via-white to-teal-50/10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Cookie Policy
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
                1. What Are Cookies
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Cookies are small text files that are placed on your computer by websites that you visit. 
                They are widely used to make websites work, or work more efficiently, as well as to provide 
                information to the owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                2. How We Use Cookies
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">We use cookies for a variety of reasons detailed below:</p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-slate-800 font-bold">Essential Cookies:</strong>{' '}
                    <span className="text-slate-500 font-medium text-sm">
                      These cookies are necessary for the website to function 
                      and cannot be switched off in our systems.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-slate-800 font-bold">Performance Cookies:</strong>{' '}
                    <span className="text-slate-500 font-medium text-sm">
                      These cookies allow us to count visits and traffic 
                      sources so we can measure and improve the performance of our site.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-slate-800 font-bold">Functionality Cookies:</strong>{' '}
                    <span className="text-slate-500 font-medium text-sm">
                      These cookies enable the website to provide 
                      enhanced functionality and personalization.
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <strong className="text-slate-800 font-bold">Targeting Cookies:</strong>{' '}
                    <span className="text-slate-500 font-medium text-sm">
                      These cookies may be set through our site by our 
                      advertising partners to build a profile of your interests.
                    </span>
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                3. Types of Cookies We Use
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-emerald-50/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                        Cookie Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200 text-sm font-medium text-slate-500">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                        session_id
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Maintains your session state
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Session
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                        user_preferences
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Stores your site preferences
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        1 year
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                        analytics_id
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Helps us understand how visitors interact
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        2 years
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                        marketing_tracking
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Tracks marketing campaign performance
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        90 days
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                4. Third-Party Cookies
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">We may also use various third-party cookies:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-slate-500">
                    <strong className="text-slate-800 font-bold">Google Analytics:</strong> For analyzing website traffic
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-slate-500">
                    <strong className="text-slate-800 font-bold">Social Media Platforms:</strong> For social sharing features
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-slate-500">
                    <strong className="text-slate-800 font-bold">Payment Processors:</strong> For secure transaction processing
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
                  <span className="text-slate-500">
                    <strong className="text-slate-800 font-bold">Advertising Networks:</strong> For relevant ad display
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">
                5. Managing Cookies
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">You can control and/or delete cookies as you wish:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Browser Settings</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    You can delete all cookies that are already on your computer and set most browsers to prevent them from being placed.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Opt-out Tools</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">
                    Various third parties provide opt-out tools to help you manage cookies used for online advertising:
                  </p>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Google Analytics Opt-out Browser Add-on</li>
                    <li>Network Advertising Initiative Opt-out Tool</li>
                    <li>Digital Advertising Alliance Consumer Choice Tool</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="pt-4">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                6. Contact Us
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                If you have any questions about our use of cookies, please contact us:
              </p>
              
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-sm">
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">ByteBodh</h5>
                    <div className="space-y-2 text-slate-600 font-semibold">
                      <p>
                        <span className="font-bold">Phone:</span>{' '}
                        <a href="tel:+917032488372" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          +91 70324 88372
                        </a>
                      </p>
                      <p>
                        <span className="font-bold">Email:</span>{' '}
                        <a href="mailto:info@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          info@bytebodh.in
                        </a>
                      </p>
                      <p>
                        <span className="font-bold">Technical Support:</span>{' '}
                        <a href="mailto:support@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                          support@bytebodh.in
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">Support Hours</h5>
                    <div className="space-y-2 text-slate-500 font-medium">
                      <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p>Emergency Support: 24/7 for critical issues</p>
                      <p>Response Time: Within 4 business hours</p>
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

export default CookiePolicy;
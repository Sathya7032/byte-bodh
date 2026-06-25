import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-600 flex flex-col justify-between">
      <Header />
      
      <div className="flex-grow pt-36 pb-20 bg-gradient-to-br from-emerald-50/10 via-white to-teal-50/10">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Privacy Policy
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
                1. Information We Collect
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                At ByteBodh, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Personal Information</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">We may collect personal information that you voluntarily provide to us:</p>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Payment information for service purchases</li>
                    <li>Communication preferences</li>
                    <li>Business information for service requests</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Automatically Collected Information</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">When you access our website, we automatically collect:</p>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on site</li>
                    <li>Referring website and search terms</li>
                    <li>Clickstream data and browsing patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                2. How We Use Your Information
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">We use the collected information for various purposes:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Service Provision</h3>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Create and manage your account</li>
                    <li>Process transactions and deliver services</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send service-related communications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Website Improvement</h3>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Analyze website usage and performance</li>
                    <li>Develop new features and services</li>
                    <li>Personalize user experience</li>
                    <li>Optimize content delivery</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Marketing and Communication</h3>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Send promotional materials (with your consent)</li>
                    <li>Notify about updates and new features</li>
                    <li>Conduct surveys and gather feedback</li>
                    <li>Administer contests and promotions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Legal Compliance</h3>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Comply with legal obligations</li>
                    <li>Enforce our terms and conditions</li>
                    <li>Protect our rights and property</li>
                    <li>Prevent fraudulent activities</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">We do not sell your personal information to third parties. We may share information in the following circumstances:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Service Providers</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">We may share information with trusted third-party service providers who assist us in:</p>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Payment processing and transaction management</li>
                    <li>Website hosting and maintenance</li>
                    <li>Data analysis and analytics services</li>
                    <li>Customer support and communication services</li>
                    <li>Marketing and advertising partners</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Legal Requirements</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">We may disclose your information when required by law or to:</p>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Comply with legal processes and regulations</li>
                    <li>Protect our rights, privacy, safety, or property</li>
                    <li>Prevent or investigate possible wrongdoing</li>
                    <li>Enforce our terms and conditions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Business Transfers</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                4. Data Security
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">We implement appropriate security measures to protect your personal information:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Security Measures</h3>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers with firewall protection</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication procedures</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Data Retention</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">We retain your personal information only for as long as necessary to:</p>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Fulfill the purposes outlined in this policy</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes and enforce agreements</li>
                  </ul>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-500/10 rounded-2xl p-4 mt-6">
                  <p className="text-emerald-800 font-bold mb-1">Note:</p>
                  <p className="text-emerald-700 text-xs font-semibold leading-relaxed">
                    While we implement robust security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                5. Your Rights and Choices
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">You have the following rights regarding your personal information:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Access and Control</h3>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li><span className="font-bold text-slate-700">Access:</span> Request a copy of your personal data</li>
                    <li><span className="font-bold text-slate-700">Correction:</span> Update or correct inaccurate information</li>
                    <li><span className="font-bold text-slate-700">Deletion:</span> Request deletion of your personal data</li>
                    <li><span className="font-bold text-slate-700">Restriction:</span> Limit how we use your information</li>
                    <li><span className="font-bold text-slate-700">Portability:</span> Receive your data in a readable format</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Communication Preferences</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-3">You can control your communication preferences by:</p>
                  <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2">
                    <li>Unsubscribing from marketing emails using the link in each email</li>
                    <li>Adjusting notification settings in your account</li>
                    <li>Contacting us directly to update your preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">Cookies and Tracking</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    You can manage cookies through your browser settings. See our{' '}
                    <a href="/cookie-policy" className="text-emerald-500 hover:text-emerald-600 font-bold transition-colors">
                      Cookie Policy
                    </a>{' '}
                    for more information.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                6. International Data Transfers
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers, including standard contractual clauses approved by relevant authorities.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                7. Children's Privacy
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                8. Changes to This Policy
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
              <ul className="list-disc pl-6 text-slate-500 text-sm font-medium space-y-2 mb-4">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Sending an email notification to registered users</li>
                <li>Updating the "Last updated" date at the top of this policy</li>
              </ul>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="pt-4">
              <h2 className="text-xl font-black text-slate-900 mb-4 border-b border-slate-100 pb-2">
                9. Contact Us
              </h2>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              
              <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-500/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-sm">
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-800 text-base">ByteBodh Privacy Team</h5>
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
                    <h5 className="font-black text-slate-800 text-base">Data Protection Officer</h5>
                    <div className="space-y-2 text-slate-500 font-medium">
                      <p>Email: <a href="mailto:info@bytebodh.in" className="text-emerald-600 hover:text-emerald-800 transition-colors">info@bytebodh.in</a></p>
                      <p>For data protection inquiries and requests</p>
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

export default PrivacyPolicy;
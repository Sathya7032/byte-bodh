import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Privacy Policy Component
function PrivacyPolicy() {
  return (
    <>
    <Header />
    <div className="policy-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="policy-header text-center mb-5">
              <h1 className="text-primary mb-3">Privacy Policy</h1>
              <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
              <div className="header-divider bg-primary mx-auto"></div>
            </div>

            <div className="policy-content">
              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">1. Information We Collect</h2>
                <p>
                  At ByteBodh, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>
                <h5 className="mt-4">Personal Information</h5>
                <p>We may collect personal information that you voluntarily provide to us:</p>
                <ul>
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information for service purchases</li>
                  <li>Communication preferences</li>
                  <li>Business information for service requests</li>
                </ul>
                
                <h5 className="mt-4">Automatically Collected Information</h5>
                <p>When you access our website, we automatically collect:</p>
                <ul>
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website and search terms</li>
                  <li>Clickstream data and browsing patterns</li>
                </ul>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">2. How We Use Your Information</h2>
                <p>We use the collected information for various purposes:</p>
                
                <h5 className="mt-3">Service Provision</h5>
                <ul>
                  <li>Create and manage your account</li>
                  <li>Process transactions and deliver services</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send service-related communications</li>
                </ul>

                <h5 className="mt-3">Website Improvement</h5>
                <ul>
                  <li>Analyze website usage and performance</li>
                  <li>Develop new features and services</li>
                  <li>Personalize user experience</li>
                  <li>Optimize content delivery</li>
                </ul>

                <h5 className="mt-3">Marketing and Communication</h5>
                <ul>
                  <li>Send promotional materials (with your consent)</li>
                  <li>Notify about updates and new features</li>
                  <li>Conduct surveys and gather feedback</li>
                  <li>Administer contests and promotions</li>
                </ul>

                <h5 className="mt-3">Legal Compliance</h5>
                <ul>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our terms and conditions</li>
                  <li>Protect our rights and property</li>
                  <li>Prevent fraudulent activities</li>
                </ul>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">3. Information Sharing and Disclosure</h2>
                <p>We do not sell your personal information to third parties. We may share information in the following circumstances:</p>
                
                <h5 className="mt-3">Service Providers</h5>
                <p>We may share information with trusted third-party service providers who assist us in:</p>
                <ul>
                  <li>Payment processing and transaction management</li>
                  <li>Website hosting and maintenance</li>
                  <li>Data analysis and analytics services</li>
                  <li>Customer support and communication services</li>
                  <li>Marketing and advertising partners</li>
                </ul>

                <h5 className="mt-3">Legal Requirements</h5>
                <p>We may disclose your information when required by law or to:</p>
                <ul>
                  <li>Comply with legal processes and regulations</li>
                  <li>Protect our rights, privacy, safety, or property</li>
                  <li>Prevent or investigate possible wrongdoing</li>
                  <li>Enforce our terms and conditions</li>
                </ul>

                <h5 className="mt-3">Business Transfers</h5>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information:</p>
                
                <h5 className="mt-3">Security Measures</h5>
                <ul>
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers with firewall protection</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication procedures</li>
                  <li>Data backup and disaster recovery systems</li>
                </ul>

                <h5 className="mt-3">Data Retention</h5>
                <p>We retain your personal information only for as long as necessary to:</p>
                <ul>
                  <li>Fulfill the purposes outlined in this policy</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain business records as required by law</li>
                </ul>

                <div className="alert alert-info mt-4">
                  <strong>Note:</strong> While we implement robust security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
                </div>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">5. Your Rights and Choices</h2>
                <p>You have the following rights regarding your personal information:</p>
                
                <h5 className="mt-3">Access and Control</h5>
                <ul>
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Restriction:</strong> Limit how we use your information</li>
                  <li><strong>Portability:</strong> Receive your data in a readable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                </ul>

                <h5 className="mt-3">Communication Preferences</h5>
                <p>You can control your communication preferences by:</p>
                <ul>
                  <li>Unsubscribing from marketing emails using the link in each email</li>
                  <li>Adjusting notification settings in your account</li>
                  <li>Contacting us directly to update your preferences</li>
                </ul>

                <h5 className="mt-3">Cookies and Tracking</h5>
                <p>You can manage cookies through your browser settings. See our <a href="/cookie-policy" className="text-primary">Cookie Policy</a> for more information.</p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">6. International Data Transfers</h2>
                <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers, including:</p>
                <ul>
                  <li>Standard contractual clauses approved by relevant authorities</li>
                  <li>Adequacy decisions for countries with approved data protection laws</li>
                  <li>Binding corporate rules for intra-organizational transfers</li>
                </ul>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">7. Children's Privacy</h2>
                <p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.</p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">8. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
                <ul>
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Sending an email notification to registered users</li>
                  <li>Updating the "Last updated" date at the top of this policy</li>
                </ul>
                <p>We encourage you to review this Privacy Policy periodically for any changes.</p>
              </section>

              <section className="policy-section">
                <h2 className="text-primary mb-3">9. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="contact-info mt-4 p-4 bg-light rounded">
                  <div className="row">
                    <div className="col-md-6">
                      <h5>ByteBodh Privacy Team</h5>
                      <p className="mb-1">Email: info@bytebodh.in</p>
                      <p className="mb-1">Phone: +91-7032488372</p>
                      
                    </div>
                    <div className="col-md-6">
                      <h5>Data Protection Officer</h5>
                      <p className="mb-1">Email: info@bytebodh.in</p>
                      <p>For data protection inquiries and requests</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
export default PrivacyPolicy;
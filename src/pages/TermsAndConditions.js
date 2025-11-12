import Footer from "../components/Footer";
import Header from "../components/Header";



function TermsAndConditions() {
  return (
    <>
    <Header />
    <div className="policy-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="policy-header text-center mb-5">
              <h1 className="text-primary mb-3">Terms and Conditions</h1>
              <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
              <div className="header-divider bg-primary mx-auto"></div>
            </div>

            <div className="policy-content">
              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using ByteBodh ("the Website"), you accept and agree to be bound 
                  by the terms and provision of this agreement.
                </p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">2. Use License</h2>
                <p>
                  Permission is granted to temporarily access the materials (information or software) 
                  on ByteBodh's website for personal, non-commercial transitory viewing only.
                </p>
                <p>This license shall automatically terminate if you violate any of these restrictions.</p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">3. Services</h2>
                <p>
                  ByteBodh provides IT technology tutorials and services for small and micro businesses. 
                  Our services include but are not limited to:
                </p>
                <ul>
                  <li>Website development starting from ₹5,000</li>
                  <li>Web application development</li>
                  <li>IT consultation services</li>
                  <li>Technical tutorials and blog content</li>
                </ul>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">4. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide accurate, complete, and current 
                  information. You are responsible for safeguarding your account password and for any 
                  activities under your account.
                </p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">5. Intellectual Property</h2>
                <p>
                  The content, organization, graphics, design, and other matters related to the Website 
                  are protected under applicable copyrights and other proprietary laws. The copying, 
                  redistribution, use, or publication by you of any such matters is strictly prohibited.
                </p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">6. Limitations</h2>
                <p>
                  In no event shall ByteBodh or its suppliers be liable for any damages (including, without 
                  limitation, damages for loss of data or profit, or due to business interruption) arising 
                  out of the use or inability to use the materials on ByteBodh's website.
                </p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">7. Service Modifications</h2>
                <p>
                  ByteBodh reserves the right to modify or discontinue, temporarily or permanently, the 
                  Service with or without notice. Prices of all Services are subject to change.
                </p>
              </section>

              <section className="policy-section">
                <h2 className="text-primary mb-3">8. Contact Information</h2>
                <p>
                  For any questions regarding these Terms and Conditions, please contact us:
                </p>
                <div className="contact-info mt-4 p-4 bg-light rounded">
                  <div className="row">
                    <div className="col-md-6">
                      <h5>ByteBodh</h5>
                      <p className="mb-1">
                        <strong>Phone:</strong> <a href="tel:+917032488372" className="text-primary">+91 70324 88372</a>
                      </p>
                      <p className="mb-1">
                        <strong>Email:</strong> <a href="mailto:info@bytebodh.in" className="text-primary">info@bytebodh.in</a>
                      </p>
                      <p className="mb-0">
                        <strong>Legal:</strong> <a href="mailto:legal@bytebodh.in" className="text-primary">legal@bytebodh.in</a>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5>Response Time</h5>
                      <p className="mb-1">General Inquiries: Within 24 hours</p>
                      <p className="mb-1">Legal Matters: 2-3 business days</p>
                      <p className="mb-0">Technical Support: Within 12 hours</p>
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

export default TermsAndConditions;
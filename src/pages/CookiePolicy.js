import Footer from "../components/Footer";
import Header from "../components/Header";


function CookiePolicy() {
  return (
    <>
    <Header />
    <div className="policy-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="policy-header text-center mb-5">
              <h1 className="text-primary mb-3">Cookie Policy</h1>
              <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>
              <div className="header-divider bg-primary mx-auto"></div>
            </div>

            <div className="policy-content">
              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">1. What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your computer by websites that you visit. 
                  They are widely used to make websites work, or work more efficiently, as well as to provide 
                  information to the owners of the site.
                </p>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">2. How We Use Cookies</h2>
                <p>We use cookies for a variety of reasons detailed below:</p>
                <ul>
                  <li>
                    <strong>Essential Cookies:</strong> These cookies are necessary for the website to function 
                    and cannot be switched off in our systems.
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic 
                    sources so we can measure and improve the performance of our site.
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> These cookies enable the website to provide 
                    enhanced functionality and personalization.
                  </li>
                  <li>
                    <strong>Targeting Cookies:</strong> These cookies may be set through our site by our 
                    advertising partners to build a profile of your interests.
                  </li>
                </ul>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">3. Types of Cookies We Use</h2>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-primary">
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>session_id</td>
                        <td>Maintains your session state</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td>user_preferences</td>
                        <td>Stores your site preferences</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td>analytics_id</td>
                        <td>Helps us understand how visitors interact</td>
                        <td>2 years</td>
                      </tr>
                      <tr>
                        <td>marketing_tracking</td>
                        <td>Tracks marketing campaign performance</td>
                        <td>90 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">4. Third-Party Cookies</h2>
                <p>We may also use various third-party cookies:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> For analyzing website traffic</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing features</li>
                  <li><strong>Payment Processors:</strong> For secure transaction processing</li>
                  <li><strong>Advertising Networks:</strong> For relevant ad display</li>
                </ul>
              </section>

              <section className="policy-section mb-5">
                <h2 className="text-primary mb-3">5. Managing Cookies</h2>
                <p>You can control and/or delete cookies as you wish:</p>
                
                <h5 className="mt-3">Browser Settings</h5>
                <p>You can delete all cookies that are already on your computer and set most browsers to prevent them from being placed.</p>
                
                <h5 className="mt-3">Opt-out Tools</h5>
                <p>Various third parties provide opt-out tools to help you manage cookies used for online advertising:</p>
                <ul>
                  <li>Google Analytics Opt-out Browser Add-on</li>
                  <li>Network Advertising Initiative Opt-out Tool</li>
                  <li>Digital Advertising Alliance Consumer Choice Tool</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2 className="text-primary mb-3">6. Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies, please contact us:
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
                        <strong>Technical Support:</strong> <a href="mailto:support@bytebodh.in" className="text-primary">support@bytebodh.in</a>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5>Support Hours</h5>
                      <p className="mb-1">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="mb-1">Emergency Support: 24/7 for critical issues</p>
                      <p className="mb-0">Response Time: Within 4 business hours</p>
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

export default CookiePolicy;
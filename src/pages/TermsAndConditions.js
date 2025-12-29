import Footer from "../components/Footer";
import Header from "../components/Header";

function TermsAndConditions() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-3">
                Terms and Conditions
              </h1>
              <p className="text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using ByteBodh ("the Website"), you accept and agree to be bound 
                  by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  2. Use License
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Permission is granted to temporarily access the materials (information or software) 
                  on ByteBodh's website for personal, non-commercial transitory viewing only.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This license shall automatically terminate if you violate any of these restrictions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  3. Services
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ByteBodh provides IT technology tutorials and services for small and micro businesses. 
                  Our services include but are not limited to:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Website development starting from ₹5,000</li>
                  <li>Web application development</li>
                  <li>IT consultation services</li>
                  <li>Technical tutorials and blog content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  4. User Accounts
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  When you create an account with us, you must provide accurate, complete, and current 
                  information. You are responsible for safeguarding your account password and for any 
                  activities under your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  5. Intellectual Property
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The content, organization, graphics, design, and other matters related to the Website 
                  are protected under applicable copyrights and other proprietary laws. The copying, 
                  redistribution, use, or publication by you of any such matters is strictly prohibited.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  6. Limitations
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall ByteBodh or its suppliers be liable for any damages (including, without 
                  limitation, damages for loss of data or profit, or due to business interruption) arising 
                  out of the use or inability to use the materials on ByteBodh's website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  7. Service Modifications
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  ByteBodh reserves the right to modify or discontinue, temporarily or permanently, the 
                  Service with or without notice. Prices of all Services are subject to change.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  8. Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  For any questions regarding these Terms and Conditions, please contact us:
                </p>
                
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-800 mb-4">ByteBodh</h5>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium text-gray-700">Phone:</span>{' '}
                          <a 
                            href="tel:+917032488372" 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            +91 70324 88372
                          </a>
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">Email:</span>{' '}
                          <a 
                            href="mailto:info@bytebodh.in" 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            info@bytebodh.in
                          </a>
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">Legal:</span>{' '}
                          <a 
                            href="mailto:legal@bytebodh.in" 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            legal@bytebodh.in
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-lg font-semibold text-gray-800 mb-4">Response Time</h5>
                      <div className="space-y-2">
                        <p className="text-gray-700">General Inquiries: Within 24 hours</p>
                        <p className="text-gray-700">Legal Matters: 2-3 business days</p>
                        <p className="text-gray-700">Technical Support: Within 12 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TermsAndConditions;
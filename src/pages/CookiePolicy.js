import Footer from "../components/Footer";
import Header from "../components/Header";

function CookiePolicy() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-3">
                Cookie Policy
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
                  1. What Are Cookies
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files that are placed on your computer by websites that you visit. 
                  They are widely used to make websites work, or work more efficiently, as well as to provide 
                  information to the owners of the site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  2. How We Use Cookies
                </h2>
                <p className="text-gray-700 mb-4">We use cookies for a variety of reasons detailed below:</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-gray-800">Essential Cookies:</strong>{' '}
                      <span className="text-gray-700">
                        These cookies are necessary for the website to function 
                        and cannot be switched off in our systems.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-gray-800">Performance Cookies:</strong>{' '}
                      <span className="text-gray-700">
                        These cookies allow us to count visits and traffic 
                        sources so we can measure and improve the performance of our site.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-gray-800">Functionality Cookies:</strong>{' '}
                      <span className="text-gray-700">
                        These cookies enable the website to provide 
                        enhanced functionality and personalization.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-gray-800">Targeting Cookies:</strong>{' '}
                      <span className="text-gray-700">
                        These cookies may be set through our site by our 
                        advertising partners to build a profile of your interests.
                      </span>
                    </div>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                  3. Types of Cookies We Use
                </h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Cookie Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          session_id
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          Maintains your session state
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          Session
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          user_preferences
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          Stores your site preferences
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          1 year
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          analytics_id
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          Helps us understand how visitors interact
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          2 years
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          marketing_tracking
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          Tracks marketing campaign performance
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          90 days
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  4. Third-Party Cookies
                </h2>
                <p className="text-gray-700 mb-4">We may also use various third-party cookies:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">
                      <strong className="text-gray-800">Google Analytics:</strong> For analyzing website traffic
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">
                      <strong className="text-gray-800">Social Media Platforms:</strong> For social sharing features
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">
                      <strong className="text-gray-800">Payment Processors:</strong> For secure transaction processing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-700">
                      <strong className="text-gray-800">Advertising Networks:</strong> For relevant ad display
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  5. Managing Cookies
                </h2>
                <p className="text-gray-700 mb-6">You can control and/or delete cookies as you wish:</p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser Settings</h3>
                  <p className="text-gray-700">
                    You can delete all cookies that are already on your computer and set most browsers to prevent them from being placed.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Opt-out Tools</h3>
                  <p className="text-gray-700 mb-3">
                    Various third parties provide opt-out tools to help you manage cookies used for online advertising:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Google Analytics Opt-out Browser Add-on</li>
                    <li>Network Advertising Initiative Opt-out Tool</li>
                    <li>Digital Advertising Alliance Consumer Choice Tool</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                  6. Contact Us
                </h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">ByteBodh</h3>
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
                          <span className="font-medium text-gray-700">Technical Support:</span>{' '}
                          <a 
                            href="mailto:support@bytebodh.in" 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            support@bytebodh.in
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Support Hours</h3>
                      <div className="space-y-2 text-gray-700">
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
      </div>
      <Footer />
    </>
  );
}

export default CookiePolicy;
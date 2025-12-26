import React from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaFacebook, 
  FaLinkedin, 
  FaInstagram,
  FaYoutube,
  FaGithub
} from 'react-icons/fa';

function Footer() {
  // Services data
  const SERVICES = [
    { id: 1, title: 'IT Tutorials & Courses' },
    { id: 2, title: 'Websites' },
    { id: 3, title: 'Android Applications' },
    { id: 4, title: 'IOS Applications' },
    { id: 5, title: 'Cloud' },
    { id: 6, title: 'Mobile Apps' }
  ];

  return (
    <footer className="bytebodh-footer bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 mt-auto py-10">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 py-10 border-b border-gray-700">
          <div className="lg:col-span-1 mb-8">
            <div className="bytebodh-footer-brand mb-4">
              <div>
                <div className="bytebodh-footer-company-name text-xl font-bold text-white">
                  ByteBodh
                </div>
              </div>
            </div>
            <p className="bytebodh-footer-description mb-6 text-sm text-gray-300">
              Professional IT tutorials and powerful tools designed for small businesses and startups 
              to thrive in the digital landscape. Empowering your journey with cutting-edge technology education.
            </p>
            <div className="bytebodh-footer-social flex gap-4">
              <a href="https://www.facebook.com/share/1AE1wkgx2m/?mibextid=wwXIfr" className="bytebodh-social-link hover:bg-blue-600 p-2 rounded-full">
                <FaFacebook size={18} />
              </a>
              <a href="https://www.linkedin.com/company/bytebodh/" className="bytebodh-social-link hover:bg-blue-700 p-2 rounded-full">
                <FaLinkedin size={18} />
              </a>
              <a href="https://www.instagram.com/bytebodh/" className="bytebodh-social-link hover:bg-pink-500 p-2 rounded-full">
                <FaInstagram size={18} />
              </a>
              <a href="https://youtube.com/@bytebodh?si=z3Kdf8dOBZMVU9YF" className="bytebodh-social-link hover:bg-red-600 p-2 rounded-full">
                <FaYoutube size={18} />
              </a>
              <a href="#github" className="bytebodh-social-link hover:bg-gray-700 p-2 rounded-full">
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-1 mb-8">
            <h6 className="bytebodh-footer-heading text-white mb-3 text-lg font-semibold">Services</h6>
            <ul className="bytebodh-footer-list">
              {SERVICES.slice(0, 4).map((service) => (
                <li key={service.id} className="mb-2">
                  <a href="#!" className="bytebodh-footer-link hover:text-blue-400">{service.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1 mb-8">
            <h6 className="bytebodh-footer-heading text-white mb-3 text-lg font-semibold">Company</h6>
            <ul className="bytebodh-footer-list">
              <li className="mb-2"><a href="/about" className="bytebodh-footer-link hover:text-blue-400">About Us</a></li>
              <li className="mb-2"><a href="/about" className="bytebodh-footer-link hover:text-blue-400">Our Team</a></li>
              <li className="mb-2"><a href="/contact" className="bytebodh-footer-link hover:text-blue-400">Careers</a></li>
              <li className="mb-2"><a href="/blog" className="bytebodh-footer-link hover:text-blue-400">Blog</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1 mb-8">
            <h6 className="bytebodh-footer-heading text-white mb-3 text-lg font-semibold">Support</h6>
            <ul className="bytebodh-footer-list">
              <li className="mb-2"><a href="/contact" className="bytebodh-footer-link hover:text-blue-400">Help Center</a></li>
              <li className="mb-2"><a href="/contact" className="bytebodh-footer-link hover:text-blue-400">Contact Us</a></li>
              <li className="mb-2"><a href="/privacy-policy" className="bytebodh-footer-link hover:text-blue-400">Privacy Policy</a></li>
              <li className="mb-2"><a href="/terms-and-conditions" className="bytebodh-footer-link hover:text-blue-400">Terms of Service</a></li>
            </ul>
          </div>

          <div className="lg:col-span-1 mb-8">
            <h6 className="bytebodh-footer-heading text-white mb-3 text-lg font-semibold">Contact Info</h6>
            <div className="bytebodh-contact-info text-sm">
              <div className="bytebodh-contact-item flex items-center mb-4">
                <FaEnvelope className="bytebodh-contact-icon text-blue-400 mr-3" />
                <span className="bytebodh-contact-text">info@bytebodh.in</span>
              </div>
              <div className="bytebodh-contact-item flex items-center mb-4">
                <FaPhone className="bytebodh-contact-icon text-blue-400 mr-3" />
                <span className="bytebodh-contact-text">+91 8519965746</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="bytebodh-footer-bottom py-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="bytebodh-copyright text-sm text-gray-400">
              © {new Date().getFullYear()} ByteBodh Technologies. All rights reserved.
            </div>
            <div className="bytebodh-footer-links text-sm text-gray-400">
              <a href="/privacy-policy" className="bytebodh-footer-link hover:text-blue-400 mr-4">Privacy Policy</a>
              <a href="/terms-and-conditions" className="bytebodh-footer-link hover:text-blue-400 mr-4">Terms of Service</a>
              <a href="/cookie-policy" className="bytebodh-footer-link hover:text-blue-400">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

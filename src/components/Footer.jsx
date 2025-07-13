import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-stone-900 py-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div>
            <Link 
              to="/" 
              className="text-2xl font-bold italic inline-block -rotate-3 mb-5"
            >
              <span className="text-green-400">W</span>
              <span className="text-stone-300">ander</span>
              <span className="text-cyan-600">G</span>
              <span className="text-stone-300">o</span>
            </Link>
            <p className="text-gray-100 mb-6">
              Premium car rental services with the best vehicles and customer experience since 2025.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61569230663900" 
                aria-label="Facebook" 
                className="p-2 bg-white rounded-full shadow-sm hover:bg-[#55C15C] hover:text-white transition-colors"
              >
                <FiFacebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/wandergoph/" 
                aria-label="Instagram" 
                className="p-2 bg-white rounded-full shadow-sm hover:bg-[#55C15C] hover:text-white transition-colors"
              >
                <FiInstagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-sky-500 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Our Fleet', path: '/services' },
                { name: 'Book Now', path: '/book-now' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="flex items-center text-gray-100 hover:text-[#55C15C] transition-colors"
                  >
                    <FiArrowRight className="mr-2 text-[#43A2CB]" size={14} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-sky-500 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-[#55C15C] p-2 rounded-full mr-3 flex-shrink-0">
                  <FiPhone className="text-white" size={16} />
                </div>
                <span className="text-gray-100">+63 969 341 1268</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#55C15C] p-2 rounded-full mr-3 flex-shrink-0">
                  <FiMail className="text-white" size={16} />
                </div>
                <span className="text-gray-100">wandergoph@gmail.com</span>
              </li>
              <li className="flex items-start">
                <div className="bg-[#55C15C] p-2 rounded-full mr-3 flex-shrink-0">
                  <FiMapPin className="text-white" size={16} />
                </div>
                <span className="text-gray-100">Tandang Sora, Quezon City, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-sky-500 mb-5">Stay Updated</h3>
            <p className="text-gray-100 mb-4">Subscribe for special offers and updates</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                className="text-gray-100 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#43A2CB]"
                required
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-[#4aa550] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-stone-700 text-sm">
            &copy; {currentYear} Wandergo Car Rental. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
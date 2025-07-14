import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { FaReact } from 'react-icons/fa';
import { SiVite, SiFirebase, SiNodedotjs } from 'react-icons/si';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 px-10">
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
        </div>
        <div className="border-t border-gray-200 pt-8 text-sm text-stone-700">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            
            <div>
              <p className="font-semibold">&copy; {currentYear} Wandergo Car Rental</p>
              <p>All rights reserved.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Made by</p>
                <Link to='https://brunfjell.github.io/brunfjell-portfolio/' className="flex items-center">
                  <img 
                    src="/BrunLogo-bwbg.png" 
                    alt="Brunfjell Logo" 
                    className="h-6 w-6 object-contain"
                  />
                  <p className='font-bold font-sans text-lg'>BRUNFJELL</p>
                </Link>
              </div>
              <div>
                <p className="font-bold">Made with</p>
                <div className="flex items-center gap-2">
                  <FaReact className="h-6 w-6 text-stone-700" />
                  <SiVite className="h-6 w-6 text-stone-700" />
                  <SiNodedotjs className="h-6 w-6 text-stone-700" />
                  <SiFirebase className="h-6 w-6 text-stone-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
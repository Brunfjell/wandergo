import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-xl shadow-md p-8 sm:p-10 text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <FiCheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your booking request has been received. We'll contact you shortly to confirm your reservation.
          </p>
          
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center">
            <Link 
              to="/" 
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              Back to Home
            </Link>
            
            <Link 
              to="/services" 
              className="px-6 py-3 border border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors shadow-sm"
            >
              View Our Fleet
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need immediate assistance? <br />
              Call us at <a href="tel:+639693411268" className="text-green-600 hover:underline">+63 969 341 1268</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
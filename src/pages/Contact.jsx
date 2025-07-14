import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiStar } from 'react-icons/fi';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Contact() {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'testimonial'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (activeTab === 'contact') {
        // Submit contact form to Firestore
        await addDoc(collection(db, 'messages'), {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          createdAt: serverTimestamp()
        });
      } else {
        // Submit testimonial to Firestore (initially not displayed)
        await addDoc(collection(db, 'testimonials'), {
          name: formData.name,
          comment: formData.message,
          rating: formData.rating,
          display: false, // Admin must approve first
          date: serverTimestamp()
        });
      }
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: '',
        rating: 0
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-200 mt-10">    
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-12 text-center text-gray-800"
          >
            {activeTab === 'contact' ? 'Contact Us' : 'Share Your Experience'}
          </motion.h1>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-lg shadow p-1">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'contact' 
                    ? 'bg-[#43A2CB] text-white' 
                    : 'text-gray-600 hover:text-[#55C15C]'
                }`}
              >
                Contact Form
              </button>
              <button
                onClick={() => setActiveTab('testimonial')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'testimonial' 
                    ? 'bg-[#43A2CB] text-white' 
                    : 'text-gray-600 hover:text-[#55C15C]'
                }`}
              >
                Leave Testimonial
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Our Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#55C15C] p-3 rounded-full mr-4 flex-shrink-0">
                    <FiMapPin className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Address</h3>
                    <p className="text-gray-600">Tandang Sora, Quezon City, Philippines</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#55C15C] p-3 rounded-full mr-4 flex-shrink-0">
                    <FiPhone className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Phone</h3>
                    <p className="text-gray-600">+63 969 341 1268</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#55C15C] p-3 rounded-full mr-4 flex-shrink-0">
                    <FiMail className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">wandergoph@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="font-semibold text-gray-800 mb-3">Business Hours</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 3:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Contact/Testimonial Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                {activeTab === 'contact' ? 'Send Us a Message' : 'Share Your Experience'}
              </h2>
              
              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 text-green-800 p-4 rounded-lg mb-6"
                >
                  Thank you for your {activeTab === 'contact' ? 'message' : 'testimonial'}! 
                  {activeTab === 'testimonial' && ' Your feedback will be reviewed before being published.'}
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#43A2CB]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#43A2CB]"
                      required
                    />
                  </div>
                  
                  {activeTab === 'testimonial' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating *
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className="focus:outline-none"
                          >
                            <FiStar
                              size={24}
                              className={
                                star <= formData.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      {activeTab === 'contact' ? 'Your Message *' : 'Your Feedback *'}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#43A2CB]"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 bg-[#4aa550] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiSend className="mr-2" />
                    {isSubmitting 
                      ? 'Submitting...' 
                      : activeTab === 'contact' 
                        ? 'Send Message' 
                        : 'Submit Testimonial'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
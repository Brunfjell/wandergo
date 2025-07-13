import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Navbar } from '../components/Navbar';
import { FiArrowRight, FiStar, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Home() {
  const [offers, setOffers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState({
    offers: true,
    testimonials: true
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const q = query(collection(db, 'offers'), limit(3));
        const querySnapshot = await getDocs(q);
        const offersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOffers(offersData);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(prev => ({ ...prev, offers: false }));
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(collection(db, 'testimonials'), limit(4));
        const querySnapshot = await getDocs(q);
        const testimonialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(prev => ({ ...prev, testimonials: false }));
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div 
          className="bg-[url('./WanderHeroBg.png')] bg-cover bg-center absolute inset-0 z-0"
        ></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold italic inline-block -rotate-3 text-outline text-white mb-6 drop-shadow-lg">
            Ready to <br /> Wander?
          </h1>

          <p className="text-lg md:text-xl font-medium text-white/90 mb-8">
            Every journey tells a story <br /> We're here to help you write yours
          </p>
          <Link 
            to="/book-now" 
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Book Now <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Special Offers
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Take advantage of our current promotions and save on your next rental
            </p>
          </motion.div>

          {loading.offers ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-emerald-600 flex items-center justify-center p-6">
                    <span className="text-white text-2xl md:text-3xl font-bold text-center">{offer.title}</span>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {offer.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/book-now?offer=${offer.id}`}
                        className="text-emerald-600 font-semibold hover:underline flex items-center"
                      >
                        Book Now <FiArrowRight className="ml-1" />
                      </Link>
                      {offer.discount && (
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                          {offer.discount} OFF
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </motion.div>

          {loading.testimonials ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} w-5 h-5`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(testimonial.date.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-6 italic text-lg">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600 font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Wandergo
            </h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We go the extra mile to make your rental experience exceptional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiCheckCircle className="w-10 h-10 text-emerald-500" />,
                title: "No Hidden Fees",
                description: "Transparent pricing with no surprises at checkout"
              },
              {
                icon: <FiCheckCircle className="w-10 h-10 text-emerald-500" />,
                title: "24/7 Roadside Assistance",
                description: "Help is just a phone call away, anytime, anywhere"
              },
              {
                icon: <FiCheckCircle className="w-10 h-10 text-emerald-500" />,
                title: "Flexible Rental Periods",
                description: "Rent by the hour, day, or week - whatever suits your needs"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
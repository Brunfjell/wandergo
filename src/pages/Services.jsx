import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiCheck, FiClock, FiUsers, FiDroplet, FiNavigation } from 'react-icons/fi';

export default function Services() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vehicles'));
        const carsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCars(carsData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 mt-14">
      <Navbar />
      
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-12 text-center text-gray-800"
          >
            Our Vehicle Fleet
          </motion.h1>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#55C15C]"></div>
            </div>
          ) : (
            <div className="space-y-10">
              {cars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="md:flex">
                    {/* Vehicle Image */}
                    <div className="md:w-1/3 h-64 md:h-auto">
                      <img 
                        src={car.imageUrl} 
                        alt={car.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Vehicle Details */}
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{car.name}</h2>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{car.description}</p>
                      
                      {/* Vehicle Specifications */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center">
                          <FiUsers className="text-[#43A2CB] mr-2" />
                          <span className="text-gray-700">{car.seats || '5'} Seats</span>
                        </div>
                        <div className="flex items-center">
                          <FiDroplet className="text-[#43A2CB] mr-2" />
                          <span className="text-gray-700">{car.fuelType || 'Gasoline'}</span>
                        </div>
                        <div className="flex items-center">
                          <FiNavigation className="text-[#43A2CB] mr-2" />
                          <span className="text-gray-700">{car.transmission || 'Automatic'}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="text-[#43A2CB] mr-2" />
                          <span className="text-gray-700">{car.mileage || 'Unlimited'} km</span>
                        </div>
                      </div>
                      
                      {/* Features List */}
                      <div className="mb-6">
                        <h3 className="font-medium text-gray-800 mb-2">Key Features</h3>
                        <ul className="space-y-2">
                          {car.features?.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <FiCheck className="text-[#55C15C] mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link
                        to={`/book-now?car=${car.id}`}
                        className="font-bold inline-block px-6 py-2 bg-[#55C15C] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Book This Vehicle
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
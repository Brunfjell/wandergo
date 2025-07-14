import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiCheck, FiClock } from 'react-icons/fi';

const FormStep2 = ({ formData, onChange }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Only fetch available vehicles
        const q = query(
          collection(db, 'vehicles'),
          where('isAvailable', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const vehiclesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSelect = (vehicleId) => {
    onChange(prev => ({ ...prev, vehicleId }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#55C15C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800">Select Your Vehicle</h3>
        <p className="text-gray-600 mt-1">Choose from our available fleet</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map(vehicle => (
          <div 
            key={vehicle.id}
            onClick={() => handleSelect(vehicle.id)}
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
              formData.vehicleId === vehicle.id
                ? 'border-[#55C15C] ring-2 ring-[#55C15C]/30 bg-[#55C15C]/5'
                : 'border-gray-200 hover:border-[#43A2CB] hover:shadow-md'
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800 text-lg">{vehicle.name}</h4>
                  {formData.vehicleId === vehicle.id && (
                    <FiCheck className="text-[#55C15C] h-5 w-5" />
                  )}
                </div>
                
                <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-1">Type:</span>
                    <span className="capitalize">{vehicle.Type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-1">Seats:</span>
                    <span>{vehicle.Seats}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-1">Fuel:</span>
                    <span className="capitalize">{vehicle.fuelType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {vehicles.length === 0 && !loading && (
        <div className="text-center py-8">
          <FiClock className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-gray-600">No available vehicles at the moment</p>
          <p className="text-sm text-gray-500">Please check back later or contact us</p>
        </div>
      )}
    </div>
  );
};

export default FormStep2;
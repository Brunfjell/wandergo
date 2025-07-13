import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const FormStep2 = ({ formData, onChange }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const carsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCars(carsData);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSelect = (carId) => {
    onChange(prev => ({ ...prev, carId }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#55C15C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Select Vehicle</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {cars.map(car => (
          <div 
            key={car.id}
            onClick={() => handleSelect(car.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.carId === car.id
                ? 'border-[#55C15C] bg-[#55C15C]/10'
                : 'border-gray-300 hover:border-[#43A2CB]'
            }`}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 overflow-hidden">
                {car.imageUrl && (
                  <img src={car.imageUrl} alt={car.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{car.name}</h4>
                <p className="text-sm text-gray-600">₱{car.cost.toLocaleString()} per day</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormStep2;
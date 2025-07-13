import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function CarCard({ car }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-bg-secondary rounded-lg overflow-hidden shadow-lg"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={car.imageUrl} 
          alt={car.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{car.name}</h3>
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
            ₱{car.cost.toLocaleString()}/day
          </span>
        </div>
        
        <p className="text-text-secondary mb-4">{car.description}</p>
        
        <Link 
          to={`/book-now?car=${car.id}`}
          className="btn-primary w-full text-center block"
        >
          Book Now
        </Link>
      </div>
    </motion.div>
  );
}
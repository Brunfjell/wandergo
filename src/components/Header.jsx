import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';

export function Header() {
  const { currentUser } = useAuth();

  return (
    <motion.header 
      className="bg-white shadow-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Wandergo Car Rental
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-secondary">Home</Link>
          <Link to="/services" className="hover:text-secondary">Our Cars</Link>
          <Link to="/book-now" className="hover:text-secondary">Book Now</Link>
          <Link to="/contact" className="hover:text-secondary">Contact</Link>
        </nav>
      </div>
    </motion.header>
  );
}
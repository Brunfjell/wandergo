import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ThankYou() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen">
      <main className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-secondary p-8 rounded-lg shadow-lg"
          >
            <h1 className="text-3xl font-bold mb-4 text-accent">Thank You!</h1>
            <p className="mb-6">Your submission has been received. We appreciate you choosing Wandergo Car Rental.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/" 
                className="btn-primary"
              >
                Back to Home
              </Link>
              <Link 
                to="/services" 
                className="btn-primary bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white"
              >
                View Our Cars
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
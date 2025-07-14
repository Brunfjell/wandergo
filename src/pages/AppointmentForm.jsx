import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import InfoModalLauncher from '../components/InfoModalLauncher';
import FormStep1 from '../components/FormStep1';
import FormStep2 from '../components/FormStep2';
import FormStep3 from '../components/FormStep3';

export default function AppointmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    carId: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Reset time when date changes
    setSelectedTime('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Connect to Firestore
      console.log('Submitting:', {
        ...formData,
        date: selectedDate,
        timeSlot: selectedTime,
        status: 'pending'
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-200 mt-14 md:px-16">    
      <main className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-8 text-center text-gray-800"
          >
            Book Your Rental
          </motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Information */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Rental Information</h2>
              
              {/* Availability Calendar */}
              <div className="mb-8">
                <h3 className="font-medium mb-3 flex items-center text-gray-700">
                  <FiCalendar className="mr-2 text-[#43A2CB]" /> Available Dates
                </h3>
                <AvailabilityCalendar 
                  selectedDate={selectedDate} 
                  onDateSelect={handleDateSelect} 
                />
              </div>
              
              {/* Selected Date & Time */}
              {selectedDate && (
                <div className="mb-8">
                  <h3 className="font-medium mb-3 flex items-center text-gray-700">
                    <FiClock className="mr-2 text-[#43A2CB]" /> Selected Time
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'].map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded border ${
                          selectedTime === time
                            ? 'bg-[#55C15C] text-white border-[#55C15C]'
                            : 'border-gray-300 hover:border-[#43A2CB]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Information Buttons */}
              <div className="space-y-3">
                <InfoModalLauncher 
                  title="Rates & Fees" 
                  content="Our pricing structure and additional charges..."
                  icon="💰"
                />
                <InfoModalLauncher 
                  title="Requirements" 
                  content="Documents needed for rental..."
                  icon="📋"
                />
                <InfoModalLauncher 
                  title="FAQs" 
                  content="Common questions about our rentals..."
                  icon="❓"
                />
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-green-100 text-green-800 p-6 rounded-lg max-w-md mx-auto">
                    <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
                    <p className="mb-4">Your booking request has been received. We'll contact you shortly to confirm.</p>
                    <Link
                      to="/"
                      className="inline-flex items-center px-6 py-2 bg-[#55C15C] text-white rounded-lg hover:opacity-90"
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Form Stepper */}
                  <div className="flex justify-between mb-8">
                    {[1, 2, 3].map(step => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step 
                            ? 'bg-[#55C15C] text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step}
                        </div>
                        <span className={`text-sm mt-2 ${
                          currentStep === step ? 'font-medium text-[#43A2CB]' : 'text-gray-500'
                        }`}>
                          {step === 1 ? 'Details' : step === 2 ? 'Vehicle' : 'Confirm'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Form Content */}
                  <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                      <FormStep1 
                        formData={formData} 
                        onChange={setFormData} 
                      />
                    )}
                    
                    {currentStep === 2 && (
                      <FormStep2 
                        formData={formData} 
                        onChange={setFormData} 
                      />
                    )}
                    
                    {currentStep === 3 && (
                      <FormStep3 
                        formData={formData} 
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                      />
                    )}
                    
                    {/* Form Navigation */}
                    <div className="flex justify-between mt-8">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Back
                        </button>
                      ) : (
                        <div></div>
                      )}
                      
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!formData.fullName || !formData.email || !formData.phone}
                          className="px-6 py-2 bg-[#43A2CB] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                          Next <FiArrowRight className="inline ml-1" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || !selectedDate || !selectedTime}
                          className="px-6 py-2 bg-[#55C15C] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
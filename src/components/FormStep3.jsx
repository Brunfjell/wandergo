import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi';

const FormStep3 = ({ formData, selectedDate, selectedTime }) => {
  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Confirm Your Booking</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
          <FiCheck className="text-[#55C15C] mr-2" /> Booking Summary
        </h4>
        
        <div className="space-y-3">
          {selectedDate && (
            <div className="flex items-start">
              <FiCalendar className="text-[#43A2CB] mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(selectedDate)}</p>
              </div>
            </div>
          )}
          
          {selectedTime && (
            <div className="flex items-start">
              <FiClock className="text-[#43A2CB] mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{selectedTime}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3">Personal Information</h4>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <FiUser className="text-[#43A2CB] mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{formData.fullName}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FiMail className="text-[#43A2CB] mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FiPhone className="text-[#43A2CB] mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{formData.phone}</p>
            </div>
          </div>
          
          {formData.address && (
            <div className="flex items-start">
              <FiMapPin className="text-[#43A2CB] mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{formData.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-3">Special Requests</h4>
        <p className="text-gray-600">
          {formData.specialRequests || 'No special requests'}
        </p>
      </div>
    </div>
  );
};

export default FormStep3;
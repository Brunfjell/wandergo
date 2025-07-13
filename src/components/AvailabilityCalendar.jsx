import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AvailabilityCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate days in month
  const daysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month
  const firstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days
  const generateCalendar = () => {
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty slots for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add actual days of month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push(date);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendar();
  
  // Check if date is available (simplified - in real app, check against bookings)
  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };
  
  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format month/year display
  const monthYearFormat = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentMonth);
  
  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <FiChevronLeft size={20} />
        </button>
        <h4 className="font-medium text-gray-800">{monthYearFormat}</h4>
        <button 
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {calendarDays.map((date, index) => (
          <div key={index} className="text-center">
            {date ? (
              <button
                onClick={() => isDateAvailable(date) && onDateSelect(date)}
                disabled={!isDateAvailable(date)}
                className={`w-full py-2 rounded-full ${
                  selectedDate && date.toDateString() === selectedDate.toDateString()
                    ? 'bg-[#55C15C] text-white'
                    : isDateAvailable(date)
                      ? 'hover:bg-[#43A2CB] hover:text-white'
                      : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="py-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
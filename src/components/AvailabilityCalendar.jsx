import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AvailabilityCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const startOfMonth = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          1
        );
        const endOfMonth = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          0
        );

        const q = query(
          collection(db, 'appointments'),
          where('date', '>=', startOfMonth.toISOString().split('T')[0]),
          where('date', '<=', endOfMonth.toISOString().split('T')[0]),
          where('status', '==', 'approved')
        );

        const querySnapshot = await getDocs(q);
        const dates = querySnapshot.docs.map(doc => doc.data().date);
        console.log(dates);
        
        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedDates();
  }, [currentMonth]);

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
  
  const generateCalendar = () => {
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push(date);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendar();
  
  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return false;
    
    const dateString = date.toISOString().split('T')[0];
    return !bookedDates.includes(dateString);
  };
  
  const isDateBooked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookedDates.includes(dateString);
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const monthYearFormat = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentMonth);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#55C15C]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4">
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
                className={`w-full py-2 rounded-full relative ${
                  selectedDate && date.toDateString() === selectedDate.toDateString()
                    ? 'bg-[#55C15C] text-white'
                    : isDateAvailable(date)
                      ? 'hover:bg-[#43A2CB] hover:text-white'
                      : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {date.getDate()}
                {isDateBooked(date) && (
                  <span className="absolute top-0 right-0 p-1 text-xs text-red-500">
                    <FiCheck className="h-3 w-3" />
                  </span>
                )}
              </button>
            ) : (
              <div className="py-2"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#55C15C] mr-2"></div>
          <span className="text-xs text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 mr-2 relative">
            <FiCheck className="h-2 w-2 text-red-500 absolute top-0.5 left-0.5" />
          </div>
          <span className="text-xs text-gray-600">Booked</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
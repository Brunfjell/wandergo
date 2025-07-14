import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiCalendar, FiCheck, FiX, FiSearch, FiFilter, FiAlertCircle, FiClock, FiUser } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const location = useLocation();

  useEffect(() => {
    const status = new URLSearchParams(location.search).get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [location]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let q = collection(db, 'appointments');
        
        if (statusFilter !== 'all') {
          q = query(q, where('status', '==', statusFilter));
        }

        const querySnapshot = await getDocs(q);
        const appointmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp to Date if needed
          date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
        }));
        
        // Sort by date (newest first)
        appointmentsData.sort((a, b) => b.date - a.date);
        
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [statusFilter]);

  const handleStatusChange = async (id, status, customerName) => {
    const confirmationMessage = 
      status === 'approved' 
        ? `Approve booking for ${customerName}?` 
        : `Reject booking for ${customerName}?`;
    
    if (window.confirm(confirmationMessage)) {
      try {
        await updateDoc(doc(db, 'appointments', id), { status });
        setAppointments(appointments.map(appt => 
          appt.id === id ? { ...appt, status } : appt
        ));
      } catch (error) {
        console.error('Error updating appointment:', error);
      }
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const searchLower = searchTerm.toLowerCase();
    return (
      appt.fullName.toLowerCase().includes(searchLower) ||
      appt.email.toLowerCase().includes(searchLower) ||
      appt.phone.includes(searchTerm) ||
      (appt.serviceName && appt.serviceName.toLowerCase().includes(searchLower))
    );
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#55C15C]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <p className="text-gray-600">View and manage customer reservations</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiClock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or vehicle..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55C15C] focus:border-[#55C15C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#55C15C] focus:border-[#55C15C] rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Information
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appt) => (
                  <motion.tr 
                    key={appt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(85, 193, 92, 0.05)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#55C15C] bg-opacity-10 flex items-center justify-center text-[#55C15C]">
                          <FiUser className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{appt.fullName}</div>
                          <div className="text-sm text-gray-500">{appt.phone}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{appt.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appt.serviceName || `Vehicle ID: ${appt.serviceID}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(appt.date, 'PPP')} • {appt.timeSlot}
                      </div>
                      {appt.address && (
                        <div className="text-sm text-gray-500 mt-1">
                          {appt.address}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      {appt.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'approved', appt.fullName)}
                            className="text-[#55C15C] hover:text-[#43A2CB] inline-flex items-center"
                          >
                            <FiCheck className="mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(appt.id, 'cancelled', appt.fullName)}
                            className="text-red-600 hover:text-red-800 inline-flex items-center"
                          >
                            <FiX className="mr-1" /> Reject
                          </button>
                        </>
                      )}
                      {appt.status !== 'pending' && (
                        <span className="text-gray-400">No actions available</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filter' : 'All bookings are processed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
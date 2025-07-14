import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { FaCarSide } from 'react-icons/fa';

export default function ManageServices() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        let vehiclesQuery;
        
        if (statusFilter !== 'all') {
          vehiclesQuery = query(
            collection(db, 'vehicles'),
            where('isAvailable', '==', statusFilter === 'available')
          );
        } else {
          vehiclesQuery = collection(db, 'vehicles');
        }

        const querySnapshot = await getDocs(vehiclesQuery);
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
  }, [statusFilter]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'vehicles', id));
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.description && vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (vehicle.type && vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-2xl font-bold">Vehicle Fleet Management</h1>
          <p className="text-gray-600">Manage your rental vehicle inventory</p>
        </div>
        <Link
          to="/admin/add-service"
          className="inline-flex items-center px-4 py-2 bg-[#55C15C] text-white rounded-lg hover:bg-[#43A2CB] transition-colors shadow-sm"
        >
          <FiPlus className="mr-2" /> Add New Vehicle
        </Link>
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
              placeholder="Search by name, type, or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55C15C] focus:border-[#55C15C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#55C15C] focus:border-[#55C15C] rounded-lg"
            >
              <option value="all">All Vehicles</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredVehicles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Specs
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
                {filteredVehicles.map((vehicle) => (
                  <motion.tr 
                    key={vehicle.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(85, 193, 92, 0.05)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          {vehicle.imageUrl ? (
                            <img 
                              className="h-full w-full object-cover" 
                              src={vehicle.imageUrl} 
                              alt={vehicle.name} 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <FaCarSide className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{vehicle.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{vehicle.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{vehicle.type}</div>
                      <div className="text-sm text-gray-500">
                        {vehicle.seats} seats • {vehicle.fuelType} • {vehicle.transmission}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/edit-service/${vehicle.id}`}
                        className="text-[#55C15C] hover:text-[#43A2CB] mr-4 inline-flex items-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id, vehicle.name)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No vehicles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search or filter' : 'Add your first vehicle to get started'}
            </p>
            <div className="mt-6">
              <Link
                to="/admin/add-service"
                className="inline-flex items-center px-4 py-2 bg-[#55C15C] text-white rounded-lg hover:bg-[#43A2CB] transition-colors shadow-sm"
              >
                <FiPlus className="mr-2" /> Add Vehicle
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
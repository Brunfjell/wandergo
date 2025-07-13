import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiBarChart2, FiDollarSign, FiCalendar} from 'react-icons/fi';
import { FaCarSide } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState({
    monthlyBookings: [],
    vehiclePopularity: [],
    revenue: 0,
    bookingStatus: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch all appointments
        const appointmentsQuery = query(collection(db, 'appointments'));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate monthly bookings
        const monthlyData = Array(12).fill(0).map((_, i) => ({
          name: new Date(0, i).toLocaleString('default', { month: 'short' }),
          bookings: 0
        }));

        appointmentsData.forEach(appt => {
          const month = new Date(appt.date).getMonth();
          monthlyData[month].bookings++;
        });

        // Calculate vehicle popularity (TODO: Replace with actual vehicle names)
        const vehicleCounts = {};
        appointmentsData.forEach(appt => {
          vehicleCounts[appt.serviceID] = (vehicleCounts[appt.serviceID] || 0) + 1;
        });

        const vehiclePopularity = Object.entries(vehicleCounts).map(([id, count]) => ({
          name: `Vehicle ${id}`,
          value: count
        }));

        // Calculate revenue (assuming all approved bookings are paid)
        const revenue = appointmentsData
          .filter(appt => appt.status === 'approved')
          .reduce((sum, appt) => sum + (appt.serviceID ? 1500 : 0), 0); // TODO: Replace with actual price

        // Booking status distribution
        const statusCounts = {
          approved: 0,
          pending: 0,
          cancelled: 0
        };

        appointmentsData.forEach(appt => {
          statusCounts[appt.status]++;
        });

        const bookingStatus = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value
        }));

        setStats({
          monthlyBookings: monthlyData,
          vehiclePopularity,
          revenue,
          bookingStatus
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#43A2CB', '#55C15C', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiBarChart2 className="h-6 w-6" />}
          title="Total Bookings"
          value={stats.monthlyBookings.reduce((sum, month) => sum + month.bookings, 0)}
        />
        <StatCard 
          icon={<FiDollarSign className="h-6 w-6" />}
          title="Total Revenue"
          value={`₱${stats.revenue.toLocaleString()}`}
        />
        <StatCard 
          icon={<FiCalendar className="h-6 w-6" />}
          title="Pending Bookings"
          value={stats.bookingStatus.find(s => s.name === 'pending')?.value || 0}
        />
        <StatCard 
          icon={<FaCarSide className="h-6 w-6" />}
          title="Available Vehicles"
          value="12" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#43A2CB" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Vehicle Popularity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.vehiclePopularity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.vehiclePopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Booking Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.bookingStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.bookingStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-accent bg-opacity-10 text-accent">
          {icon}
        </div>
      </div>
    </div>
  );
}
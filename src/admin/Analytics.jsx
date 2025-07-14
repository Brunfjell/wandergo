import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiBarChart2, FiDollarSign, FiCalendar, FiTrendingUp, FiClock } from 'react-icons/fi';
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { format, subMonths } from 'date-fns';

const COLORS = ['#43A2CB', '#55C15C', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    summaryStats: {},
    monthlyBookings: [],
    vehiclePopularity: [],
    revenueTrend: [],
    bookingStatus: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12m');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [appointmentsSnapshot, vehiclesSnapshot] = await Promise.all([
          getDocs(collection(db, 'appointments')),
          getDocs(collection(db, 'vehicles'))
        ]);

        const appointmentsData = appointmentsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date instanceof Timestamp ? data.date.toDate() : null,
          };
        });

        const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const monthsToShow = timeRange === '6m' ? 6 : 12;
        const startDate = subMonths(new Date(), monthsToShow - 1);

        const processedData = processAnalyticsData(appointmentsData, vehiclesData, startDate);
        setAnalyticsData(processedData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const processAnalyticsData = (appointments, vehicles, startDate) => {
    // Filter appointments by time range
    const filteredAppointments = appointments.filter(appt => 
      appt.date && appt.date >= startDate
    );

    // Calculate summary statistics
    const summaryStats = {
      totalBookings: filteredAppointments.length,
      totalRevenue: filteredAppointments
        .filter(appt => appt.status === 'approved')
        .reduce((sum, appt) => sum + (appt.cost || 0), 0),
      pendingBookings: filteredAppointments.filter(appt => appt.status === 'pending').length,
      availableVehicles: vehicles.filter(vehicle => vehicle.isAvailable).length
    };

    // Monthly bookings data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      return {
        name: format(date, 'MMM yy'),
        bookings: 0,
        revenue: 0
      };
    });

    filteredAppointments.forEach(appt => {
      const monthIndex = Math.floor(
        (appt.date.getMonth() - startDate.getMonth() + 
        12 * (appt.date.getFullYear() - startDate.getFullYear()))
      );
      if (monthIndex >= 0 && monthIndex < monthlyData.length) {
        monthlyData[monthIndex].bookings++;
        if (appt.status === 'approved') {
          monthlyData[monthIndex].revenue += appt.cost || 0;
        }
      }
    });

    // Vehicle popularity (with actual names)
    const vehicleMap = Object.fromEntries(
      vehicles.map(vehicle => [vehicle.id, vehicle.name])
    );

    const vehicleCounts = {};
    filteredAppointments.forEach(appt => {
      const vehicleName = vehicleMap[appt.serviceID] || `Vehicle ${appt.serviceID}`;
      vehicleCounts[vehicleName] = (vehicleCounts[vehicleName] || 0) + 1;
    });

    const vehiclePopularity = Object.entries(vehicleCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 only

    // Booking status distribution
    const statusCounts = {
      approved: 0,
      pending: 0,
      cancelled: 0
    };

    filteredAppointments.forEach(appt => {
      statusCounts[appt.status]++;
    });

    const bookingStatus = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));

    // Recent activity (last 5 approved bookings)
    const recentActivity = filteredAppointments
      .filter(appt => appt.status === 'approved')
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
      .map(appt => ({
        id: appt.id,
        customer: appt.fullName,
        vehicle: vehicleMap[appt.serviceID] || `Vehicle ${appt.serviceID}`,
        date: format(appt.date, 'MMM dd, yyyy'),
        amount: appt.cost || 0
      }));

    return {
      summaryStats,
      monthlyBookings: monthlyData,
      vehiclePopularity,
      bookingStatus,
      recentActivity
    };
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
          <h1 className="text-2xl font-bold">Business Analytics</h1>
          <p className="text-gray-600">Key metrics and performance indicators</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FiClock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#55C15C]"
          >
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiBarChart2 className="h-5 w-5" />}
          title="Total Bookings"
          value={analyticsData.summaryStats.totalBookings}
          trend="up"
          change="12%"
        />
        <StatCard 
          icon={<FiDollarSign className="h-5 w-5" />}
          title="Total Revenue"
          value={`₱${(analyticsData.summaryStats.totalRevenue ?? 0).toLocaleString()}`}
          trend="up"
          change="18%"
        />
        <StatCard 
          icon={<FiCalendar className="h-5 w-5" />}
          title="Pending Approvals"
          value={analyticsData.summaryStats.pendingBookings}
          trend={analyticsData.summaryStats.pendingBookings > 5 ? "down" : "up"}
          change={analyticsData.summaryStats.pendingBookings > 5 ? "+5" : "-2"}
        />
        <StatCard 
          icon={<FaCarSide className="h-5 w-5" />}
          title="Available Vehicles"
          value={analyticsData.summaryStats.availableVehicles}
          trend="neutral"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bookings & Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Monthly Bookings & Revenue</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'bookings' ? value : `₱${value.toLocaleString()}`,
                    name === 'bookings' ? 'Bookings' : 'Revenue'
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="#43A2CB"
                  fill="#43A2CB"
                  fillOpacity={0.2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#55C15C"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Popularity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Top Booked Vehicles</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={analyticsData.vehiclePopularity}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Bookings" fill="#55C15C">
                  {analyticsData.vehiclePopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Booking Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.bookingStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.bookingStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Completed Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      ₱{activity.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, change }) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    up: <FiTrendingUp className="h-4 w-4" />,
    down: <FiTrendingUp className="h-4 w-4 transform rotate-180" />,
    neutral: <span className="h-4 w-4"></span>
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${trendColors[trend]} bg-opacity-10`}>
          {icon}
        </div>
      </div>
      {trend && change && (
        <div className={`mt-2 flex items-center text-sm ${trendColors[trend]}`}>
          {trendIcons[trend]}
          <span className="ml-1">{change}</span>
          {trend !== 'neutral' && <span className="ml-1">vs last period</span>}
        </div>
      )}
    </div>
  );
}
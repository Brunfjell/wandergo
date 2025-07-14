import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, getDocs, where, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiCalendar, FiMessageSquare, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { FaCarSide } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    bookings: 0,
    pendingBookings: 0,
    messages: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          vehiclesSnapshot,
          bookingsSnapshot,
          pendingBookingsSnapshot,
          messagesSnapshot,
          activitySnapshot
        ] = await Promise.all([
          getDocs(collection(db, 'vehicles')),
          getDocs(collection(db, 'appointments')),
          getDocs(query(collection(db, 'appointments'), where('status', '==', 'pending'))),
          getDocs(collection(db, 'messages')),
          getDocs(query(
            collection(db, 'appointments'),
            orderBy('createdAt', 'desc'),
            limit(5)
          ))
        ]);

        const activity = activitySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'booking',
            title: `New ${data.status} booking`,
            description: `${data.fullName} booked for ${new Date(data.date).toLocaleDateString()}`,
            time: formatTimeAgo(data.createdAt?.toDate()),
            icon: <FiCalendar className="h-4 w-4" />
          };
        });

        setStats({
          vehicles: vehiclesSnapshot.size,
          bookings: bookingsSnapshot.size,
          pendingBookings: pendingBookingsSnapshot.size,
          messages: messagesSnapshot.size,
        });

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTimeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }

    return 'Just now';
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaCarSide className="h-5 w-5" />}
          title="Available Vehicles"
          value={stats.vehicles}
          link="/admin/manage-services"
          linkText="Manage Fleet"
          trend="up"
        />
        <StatCard 
          icon={<FiCalendar className="h-5 w-5" />}
          title="Total Bookings"
          value={stats.bookings}
          link="/admin/manage-appointments"
          linkText="View All"
          trend="neutral"
        />
        <StatCard 
          icon={<FiAlertCircle className="h-5 w-5" />}
          title="Pending Approvals"
          value={stats.pendingBookings}
          link="/admin/manage-appointments?status=pending"
          linkText="Review Now"
          trend="down"
        />
        <StatCard 
          icon={<FiMessageSquare className="h-5 w-5" />}
          title="Customer Messages"
          value={stats.messages}
          link="/admin/manage-messages"
          linkText="Respond"
          trend="neutral"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Link to="/admin/manage-appointments" className="text-sm text-[#55C15C] hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map(activity => (
              <ActivityItem 
                key={activity.id}
                title={activity.title}
                description={activity.description}
                time={activity.time}
                icon={activity.icon}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity found
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickAction 
          title="Add New Vehicle"
          description="Add a new vehicle to your fleet"
          link="/admin/manage-services/new"
          icon={<FaCarSide className="h-5 w-5" />}
        />
        <QuickAction 
          title="Process Bookings"
          description="Review pending bookings"
          link="/admin/manage-appointments?status=pending"
          icon={<FiCalendar className="h-5 w-5" />}
        />
        <QuickAction 
          title="Check Messages"
          description="Respond to customer inquiries"
          link="/admin/manage-messages"
          icon={<FiMessageSquare className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, link, linkText, trend }) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${trendColors[trend]} bg-opacity-10`}>
          {icon}
        </div>
      </div>
      <Link 
        to={link}
        className="mt-4 inline-flex items-center text-sm font-medium text-[#55C15C] hover:underline"
      >
        {linkText} <FiChevronRight className="ml-1" />
      </Link>
    </motion.div>
  );
}

function ActivityItem({ title, description, time, icon }) {
  return (
    <div className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0 group">
      <div className="p-2 rounded-lg bg-[#55C15C] bg-opacity-10 text-[#55C15C] mr-4 group-hover:bg-opacity-20 transition">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ title, description, link, icon }) {
  return (
    <Link 
      to={link}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-[#55C15C] transition-colors group"
    >
      <div className="flex items-start">
        <div className="p-2.5 rounded-lg bg-[#55C15C] bg-opacity-10 text-[#55C15C] mr-4 group-hover:bg-opacity-20 transition">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
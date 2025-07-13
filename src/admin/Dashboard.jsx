import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiCalendar, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { FaCarSide } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    services: 0,
    messages: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get appointments count
        const appointmentsQuery = query(collection(db, 'appointments'));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        
        // Get pending appointments count
        const pendingQuery = query(
          collection(db, 'appointments'),
          where('status', '==', 'pending')
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        
        // Get services count
        const servicesQuery = query(collection(db, 'services'));
        const servicesSnapshot = await getDocs(servicesQuery);
        
        // Get messages count
        const messagesQuery = query(collection(db, 'messages'));
        const messagesSnapshot = await getDocs(messagesQuery);

        setStats({
          appointments: appointmentsSnapshot.size,
          services: servicesSnapshot.size,
          messages: messagesSnapshot.size,
          pendingAppointments: pendingSnapshot.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaCarSide className="h-6 w-6" />}
          title="Total Vehicles"
          value={stats.services}
          link="/admin/manage-services"
          linkText="Manage Vehicles"
        />
        <StatCard 
          icon={<FiCalendar className="h-6 w-6" />}
          title="Total Bookings"
          value={stats.appointments}
          link="/admin/manage-appointments"
          linkText="Manage Bookings"
        />
        <StatCard 
          icon={<FiMessageSquare className="h-6 w-6" />}
          title="Pending Bookings"
          value={stats.pendingAppointments}
          link="/admin/manage-appointments?status=pending"
          linkText="Review Pending"
        />
        <StatCard 
          icon={<FiUsers className="h-6 w-6" />}
          title="Customer Messages"
          value={stats.messages}
          link="/admin/manage-messages"
          linkText="View Messages"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem 
            title="New booking request"
            description="Juan Dela Cruz booked a Toyota Vios for July 20, 2023"
            time="2 hours ago"
          />
          <ActivityItem 
            title="New message"
            description="Maria Santos inquired about long-term rental options"
            time="5 hours ago"
          />
          <ActivityItem 
            title="Booking approved"
            description="Ford Everest booking for July 15 approved"
            time="1 day ago"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, link, linkText }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-accent bg-opacity-10 text-accent">
          {icon}
        </div>
      </div>
      <Link 
        to={link}
        className="mt-4 inline-block text-sm font-medium text-accent hover:text-opacity-80"
      >
        {linkText} →
      </Link>
    </motion.div>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex items-start pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
      <div className="p-2 rounded-full bg-accent bg-opacity-10 text-accent mr-4">
        <FiCalendar className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
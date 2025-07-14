// src/admin/AdminSidebar.jsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiHome, 
  FiCalendar, 
  FiMessageSquare, 
  FiSettings,
  FiTruck,
  FiBarChart2
} from 'react-icons/fi';

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { name: 'Manage Vehicles', path: '/admin/manage-services', icon: FiTruck },
    { name: 'Appointments', path: '/admin/manage-appointments', icon: FiCalendar },
    { name: 'Messages', path: '/admin/manage-messages', icon: FiMessageSquare },
    { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-green-800 text-white transition-all duration-300 flex flex-col h-full`}>
      {/* Logo/Sidebar Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-green-700">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold">Wandergo Admin</h1>
        ) : (
          <h1 className="text-xl font-bold">WG</h1>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-green-700"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-green-700' : 'hover:bg-green-700'}`
                }
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapsed Menu Hint */}
      {!sidebarOpen && (
        <div className="absolute left-20 ml-1 px-2 py-1 bg-green-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
          {navItems.map(item => (
            <div key={item.name} className="whitespace-nowrap py-1">
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
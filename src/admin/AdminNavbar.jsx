// src/admin/AdminNavbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../firebase/authContext';
import { FiLogOut, FiMenu, FiBell, FiUser } from 'react-icons/fi';

const AdminNavbar = ({ toggleSidebar }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left side - Menu button */}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
        >
          <FiMenu className="h-6 w-6" />
        </button>

        {/* Right side - User controls */}
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FiBell className="h-5 w-5" />
          </button>

          <div className="relative ml-3 group">
            <button className="flex items-center space-x-2 max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <FiUser className="h-5 w-5" />
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                Admin
              </span>
            </button>

            {/* Dropdown menu */}
            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiLogOut className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
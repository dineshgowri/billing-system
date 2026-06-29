import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRole, getRoleBadgeColor } from '../utils/auth';
import { 
  FaTooth, 
  FaUsers, 
  FaCalendarAlt, 
  FaFileInvoiceDollar, 
  FaPrescriptionBottle, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserMd,
  FaHome
} from 'react-icons/fa';

function Dashboard() {
  const { user, logout, isAdmin, isDoctor, isFrontOffice } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const items = [
      { name: 'Dashboard', icon: FaHome, path: '/dashboard', roles: ['admin', 'doctor', 'frontoffice'] },
      { name: 'Patients', icon: FaUsers, path: '/patients', roles: ['admin', 'doctor', 'frontoffice'] },
      { name: 'Appointments', icon: FaCalendarAlt, path: '/appointments', roles: ['admin', 'doctor', 'frontoffice'] },
      { name: 'Billing', icon: FaFileInvoiceDollar, path: '/billing', roles: ['admin', 'frontoffice'] },
      { name: 'Treatments', icon: FaPrescriptionBottle, path: '/treatments', roles: ['admin'] },
      { name: 'Doctors', icon: FaUserMd, path: '/doctors', roles: ['admin'] },
      { name: 'Reports', icon: FaChartBar, path: '/reports', roles: ['admin', 'doctor'] },
      { name: 'Settings', icon: FaCog, path: '/settings', roles: ['admin'] },
    ];

    // Filter based on user role
    return items.filter(item => item.roles.includes(user?.role));
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-600 to-indigo-700 text-white transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-blue-500">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="bg-white p-2 rounded-lg">
              <FaTooth className="text-blue-600 text-2xl" />
            </div>
            {sidebarOpen && (
              <span className="ml-3 font-bold text-lg">Dental Clinic</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-blue-500 p-2 rounded-lg transition-colors"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center ${
                sidebarOpen ? 'px-4' : 'px-0 justify-center'
              } py-3 rounded-lg hover:bg-blue-500 transition-colors group`}
              title={!sidebarOpen ? item.name : ''}
            >
              <item.icon className="text-xl" />
              {sidebarOpen && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-blue-500">
          {sidebarOpen ? (
            <div className="mb-3">
              <div className="bg-blue-500 rounded-lg p-3">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-blue-200">{user?.username}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                  {formatRole(user?.role)}
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-3 flex justify-center">
              <div className="bg-blue-500 rounded-lg p-2">
                <FaUserMd className="text-xl" />
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarOpen ? 'px-4' : 'px-0 justify-center'
            } py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <FaSignOutAlt className="text-xl" />
            {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{formatRole(user?.role)}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
              <h2 className="text-3xl font-bold mb-2">
                Welcome to Dental Clinic Billing System! 🎉
              </h2>
              <p className="text-blue-100 text-lg">
                Session 2 Complete: Login & Authentication is now working!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Patients</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaUsers className="text-blue-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Today's Appointments</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">0</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaCalendarAlt className="text-green-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">₹0</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FaFileInvoiceDollar className="text-yellow-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">₹0</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaChartBar className="text-purple-600 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Session 2 Complete Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ✅ Session 2 Complete - What's Working:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Login screen with beautiful UI</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Authentication with bcrypt password hashing</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">JWT token generation and validation</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Session persistence with localStorage</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Role-based navigation (Admin/Doctor/Front Office)</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Dashboard layout with sidebar</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Logout functionality</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Protected routes</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📋 Next Session Preview:
                </p>
                <p className="text-sm text-blue-700">
                  Session 3 will expand the dashboard and add navigation structure for all modules (Patients, Appointments, Billing, etc.)
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Menu,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

const Navbar = ({ 
  toggleSidebar, 
  pageTitle = "Dashboard",
  onSearch,
  user = { name: "Admin User", email: "admin@bytebodh.com", role: "Administrator" }
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

 
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  

  const markAllAsRead = () => {
    setUnreadCount(0);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
      if (showUserMenu && !event.target.closest('.user-menu-dropdown')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications, showUserMenu]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} className="text-gray-600" />
            </button>

            {/* Page Title */}
            <div>
              <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Welcome back, {user.name}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search dashboard..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* User Menu */}
            <div className="relative user-menu-dropdown">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown size={18} className="text-gray-500 hidden lg:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <HelpCircle size={18} />
                      <span>Help & Support</span>
                    </a>
                  </div>
                  <div className="border-t py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
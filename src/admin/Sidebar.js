// components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Users,
  ShoppingCart,
  Shield,
  HelpCircle,
  LogOut,
  User,
  Package,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getUser, logout } from '../services/auth';

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile }) => {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const menuItems = [
    { path: '/admin-dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/admin-users', icon: <Users size={20} />, label: 'Users' },
    { path: '/categories', icon: <BarChart3 size={20} />, label: 'Categories' },
    { path: '/admin-blogs', icon: <ShoppingCart size={20} />, label: 'Blogs' },
    { path: '/admin-contacts', icon: <Package size={20} />, label: 'Contacts' },
  ];

  const secondaryItems = [
    { path: '/help', icon: <HelpCircle size={20} />, label: 'Help Center' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const linkBaseClasses = `
    w-full flex items-center px-3 py-3 rounded-lg transition-colors
  `;

  const getLinkClasses = ({ isActive }) =>
    `${linkBaseClasses}
     ${isCollapsed ? 'justify-center' : 'space-x-3'}
     ${isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-800'
     }`;

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-all duration-300
          ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
          bg-gray-900 text-white h-screen flex flex-col shadow-2xl
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isCollapsed && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield size={24} />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold">ByteBodh</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>

          {!isCollapsed && isMobile && (
            <button onClick={toggleSidebar} className="p-1 hover:bg-gray-800 rounded-lg">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Collapse Button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-gray-800 p-1.5 rounded-full border border-gray-700"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={getLinkClasses}
                  title={isCollapsed ? item.label : ''}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <span>{item.icon}</span>
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={`mt-8 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {!isCollapsed && (
              <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2">
                Settings
              </h2>
            )}

            <ul className="space-y-1">
              {secondaryItems.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={getLinkClasses}
                    title={isCollapsed ? item.label : ''}
                    onClick={isMobile ? toggleSidebar : undefined}
                  >
                    <span>{item.icon}</span>
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg hover:bg-gray-800 transition-colors group`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              {user?.fullName ? (
                <span className="text-white font-semibold text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={20} />
              )}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white truncate">
                    {user?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email || 'admin@bytebodh.com'}
                  </p>
                </div>
                <LogOut 
                  size={18} 
                  className="text-gray-400 group-hover:text-white transition-colors"
                />
              </>
            )}
            {isCollapsed && (
              <LogOut 
                size={18} 
                className="text-gray-400 group-hover:text-white transition-colors"
              />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

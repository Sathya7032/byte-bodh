import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  CreditCard,
  Crown,
  Users,
  Link2,
  Palette
} from 'lucide-react';
import { getAdmin, adminLogout } from '../services/auth';

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getAdmin();
    setUser(userData);
  }, []);

  const menuItems = [
    { path: '/admin-dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin-users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin-subscriptions', icon: <Crown size={20} />, label: 'Subscriptions' },
    { path: '/admin-payments', icon: <CreditCard size={20} />, label: 'Payments & Orders' },
    { path: '/admin-templates', icon: <Layers size={20} />, label: 'Portfolio Templates' },
    { path: '/admin-linktree-templates', icon: <Palette size={20} />, label: 'Linktree Templates' },
    { path: '/admin-linktree', icon: <Link2 size={20} />, label: 'Linktree Bio Links' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out from the admin console?')) {
      adminLogout();
    }
  };

  const getLinkClasses = ({ isActive }) =>
    `w-full cursor-pointer flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-4 py-3'} rounded-xl transition-all duration-300 transform active:scale-95 ${
      isActive
        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-semibold'
        : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 hover:translate-x-1'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-all duration-300 ${
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-[80px]' : 'translate-x-0 w-[280px]'
        } bg-slate-50/95 border-r border-slate-200/60 backdrop-blur-md h-screen flex flex-col`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-white/50 flex-shrink-0">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <Shield size={20} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-base tracking-tight">ByteBodh</span>
                <span className="text-[9px] text-emerald-600 font-bold tracking-wider -mt-0.5">ADMIN CONSOLE</span>
              </div>
            )}
          </div>

          {!isCollapsed && isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Collapse Toggle Button (Desktop) */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-16 bg-white p-1 rounded-full border border-slate-200 shadow-sm text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors z-50"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={getLinkClasses}
              title={isCollapsed ? item.label : ''}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                )}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile & Sign Out Footer */}
        <div className="w-full border-t border-slate-200/60 p-3 bg-white/50 backdrop-blur-sm flex-shrink-0">
          <div
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between space-x-3'
            } p-2.5 rounded-xl hover:bg-slate-100/70 transition-colors group`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={16} />}
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user?.fullName || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.email || 'admin@bytebodh.in'}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

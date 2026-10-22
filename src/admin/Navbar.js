import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu,
  ChevronDown,
  LogOut,
  Shield,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdmin, adminLogout } from "../services/auth";
import { CLOUDFLARE_R2_PUBLIC_URL } from "../config/api";

const Navbar = ({ toggleSidebar, pageTitle = "Dashboard" }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState({
    name: "Administrator",
    email: "admin@bytebodh.in",
    role: "Super Admin"
  });
  const menuRef = useRef(null);

  useEffect(() => {
    const userData = getAdmin();
    if (userData) {
      setUser({
        name: userData.fullName || "Administrator",
        email: userData.email || "admin@bytebodh.in",
        role: userData.role === 'SUPER_ADMIN' ? "Super Admin" : "Administrator",
        avatarUrl: userData.avatarUrl || null
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out from the admin console?")) {
      adminLogout();
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          
          {/* Left: Menu Toggle & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
              title="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                {pageTitle}
              </h2>
            </div>
          </div>

          {/* Right: Quick Links & Admin Profile */}
          <div className="flex items-center space-x-3">
            {/* View Live Website Link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-slate-100/70 border border-slate-200/60 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink size={13} />
            </Link>

            {/* Admin Badge */}
            <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <Shield size={12} className="text-emerald-600" />
              <span>Admin Mode</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100/70 transition-colors"
              >
                <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={
                        user.avatarUrl.startsWith('http')
                          ? user.avatarUrl
                          : `${CLOUDFLARE_R2_PUBLIC_URL}/${user.avatarUrl.replace(/^\//, '')}`
                      }
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : null}
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium leading-none">
                    {user.role}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/60 py-2 z-50 text-left">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Laptop size={14} className="text-slate-400" />
                      <span>User Dashboard</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;

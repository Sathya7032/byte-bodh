import React, { useState, useRef } from "react";
import {
  PersonCircle,
  BoxArrowRight,
  List,
  ChevronDown,
  Search,
  Moon,
  Sun,
  XLg,
} from "react-bootstrap-icons";
import { getUser, logout } from "../../services/auth";

const SimpleNavbar = ({ onToggleSidebar, isDarkMode = false, onToggleTheme, isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = getUser();

  const fullName = user?.fullName || "User";
  const email = user?.email || "user@example.com";
  const role = user?.role || "Student";

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=3b82f6&color=fff&bold=true&size=128`;

  const handleSidebarToggle = () => {
    onToggleSidebar?.();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <button
                onClick={handleSidebarToggle}
                aria-label="Toggle sidebar"
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? (
                  <XLg size={18} />
                ) : (
                  <List size={20} />
                )}
              </button>
            )}

            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#6C63FF] to-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-sm shadow-[#6C63FF]/15 animate-pulse">
                <span className="text-white font-extrabold text-sm">B</span>
              </div>
              <a
                href="/dashboard"
                className="hidden sm:block text-xl font-black tracking-tight bg-gradient-to-r from-[#6C63FF] to-indigo-600 bg-clip-text text-transparent"
              >
                ByteBodh
              </a>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
              >
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-800">
                    {fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-0.5 font-bold tracking-wider uppercase">
                    {role}
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden animate-fadeIn">
                  {/* Header */}
                  <div className="px-4 py-4 bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{fullName}</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[170px]">{email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] text-[10px] font-bold rounded-full">
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1 px-2 space-y-0.5">
                    <a
                      href="/profile"
                      className="flex items-center px-3 py-2.5 text-slate-700 hover:text-[#6C63FF] hover:bg-indigo-50/50 rounded-xl transition-all"
                    >
                      <div className="w-6 flex justify-center">
                        <PersonCircle size={18} className="text-slate-400" />
                      </div>
                      <span className="ml-2.5 font-semibold text-xs">My Profile</span>
                    </a>

                    <div className="my-1 border-t border-slate-100" />

                    <a
                      href="/help"
                      className="flex items-center px-3 py-2.5 text-slate-700 hover:text-[#6C63FF] hover:bg-indigo-50/50 rounded-xl transition-all"
                    >
                      <div className="w-6 flex justify-center text-slate-400 font-bold text-sm">
                        <span>?</span>
                      </div>
                      <span className="ml-2.5 font-semibold text-xs">Help & Support</span>
                    </a>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <div className="w-6 flex justify-center">
                        <BoxArrowRight size={18} />
                      </div>
                      <span className="ml-2.5 font-semibold text-xs">Logout</span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium text-center">
                      © 2026 ByteBodh • v2.2.0
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SimpleNavbar;
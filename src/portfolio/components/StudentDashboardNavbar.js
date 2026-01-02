import React, { useState, useRef } from "react";
import {
  PersonCircle,
  BoxArrowRight,
  List,
  ChevronDown,
  Search,
  Moon,
  Sun,
} from "react-bootstrap-icons";
import { getUser, logout } from "../../services/auth";

const SimpleNavbar = ({ onToggleSidebar, isDarkMode = false, onToggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    const next = !sidebarOpen;
    setSidebarOpen(next);
    onToggleSidebar?.(next);
  };

  const handleLogout = () => {
    logout();
  };

 
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <button
                onClick={handleSidebarToggle}
                aria-label="Toggle sidebar"
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <List size={20} />
              </button>
            )}

            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <a
                href="/dashboard"
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
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
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

           

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    {fullName}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {role}
                    <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{fullName}</h3>
                        <p className="text-sm text-gray-600">{email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 flex justify-center">
                        <PersonCircle size={18} className="text-gray-500" />
                      </div>
                      <span className="ml-2 font-medium">My Profile</span>
                    </a>

                   

                    <div className="my-1 border-t border-gray-100" />

                    <a
                      href="/help"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 flex justify-center">
                        <span className="text-gray-500">?</span>
                      </div>
                      <span className="ml-2 font-medium">Help & Support</span>
                    </a>

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="w-8 flex justify-center">
                        <BoxArrowRight size={18} />
                      </div>
                      <span className="ml-2 font-medium">Logout</span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      © 2024 ByteBodh • v2.1.4
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
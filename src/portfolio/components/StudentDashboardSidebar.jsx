import React from "react";
import {
  HouseDoor,
  FileEarmarkPerson,
  Download,
  Envelope,
  CalendarCheck,
  QuestionCircle,
  XLg,
} from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";

const StudentDashboardSidebar = ({ isOpen, onMenuItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get active item from current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/") return "dashboard";
    if (path === "/profile") return "portfolio";
    if (path === "/resume-builder") return "resume-templates";
    if (path === "/contacts") return "contacts";
    if (path === "/profile-views") return "profile-views";
    if (path === "/tasks") return "tasks";
    if (path === "/resources") return "resources";
    if (path === "/settings") return "settings";
    if (path === "/help") return "help";
    return "";
  };

  const activeItem = getActiveItem();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <HouseDoor size={20} />,
      path: "/dashboard",
    },
    {
      id: "portfolio",
      label: "My Portfolio",
      icon: <FileEarmarkPerson size={20} />,
      path: "/profile",
    },
    {
      id: "resume-templates",
      label: "Resume Templates",
      icon: <Download size={20} />,
      path: "/resume-builder",
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: <Envelope size={20} />,
      path: "/contacts",
    },

    {
      id: "tasks",
      label: "Tasks & Projects",
      icon: <CalendarCheck size={20} />,
      path: "/tasks",
    },
  ];

  const handleNavigate = (id, path) => {
    onMenuItemClick(id);
    navigate(path);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 transition-all duration-300 z-50 lg:static
        ${isOpen ? "w-[280px]" : "w-[80px]"}`}
    >
      {/* ===== BRAND ===== */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isOpen ? (
          <>
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center mr-2 shadow-md">
                <FileEarmarkPerson size={20} />
              </div>
              <div>
                <span className="font-bold text-gray-800 text-sm">StudentFolio</span>
                <span className="ml-2 text-xs px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full font-semibold">
                  PRO
                </span>
              </div>
            </div>

            <button
              onClick={() => onMenuItemClick("collapse")}
              className="lg:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              title="Collapse"
            >
              <XLg size={18} />
            </button>
          </>
        ) : (
          <div className="mx-auto w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md">
            <FileEarmarkPerson size={20} />
          </div>
        )}
      </div>

      {/* ===== MENU ===== */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id, item.path)}
            className={`w-full cursor-pointer flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200
              ${
                activeItem === item.id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className={`flex-shrink-0 ${activeItem === item.id ? "text-white" : "text-gray-600"}`}>
                {item.icon}
              </span>
              {isOpen && <span className="font-medium text-sm">{item.label}</span>}
            </div>

            {isOpen && item.badge && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeItem === item.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ===== SETTINGS & HELP ===== */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-3 space-y-1 bg-white">
        <button
          onClick={() => handleNavigate("help", "/help")}
          className={`w-full cursor-pointer flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200
            ${
              activeItem === "help"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <span className={`flex-shrink-0 ${activeItem === "help" ? "text-white" : "text-gray-600"}`}>
            <QuestionCircle size={20} />
          </span>
          {isOpen && <span className="font-medium text-sm">Help & Support</span>}
        </button>
      </div>
    </div>
  );
};

export default StudentDashboardSidebar;
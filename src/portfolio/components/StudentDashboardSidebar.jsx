import React from "react";
import {
  HouseDoor,
  FileEarmarkPerson,
  Download,
  Envelope,
  CalendarCheck,
  Gear,
  QuestionCircle,
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
      className={`fixed top-0 left-0 h-screen bg-white border-r transition-all duration-300 z-50
        ${isOpen ? "w-[280px]" : "w-[80px]"}`}
    >
      {/* ===== BRAND ===== */}
      <div className="p-4 border-b flex items-center justify-between">
        {isOpen ? (
          <>
            <div className="flex items-center">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                <FileEarmarkPerson size={20} />
              </div>
              <span className="font-bold">StudentFolio</span>
              <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                PRO
              </span>
            </div>

            <button
              onClick={() => onMenuItemClick("collapse")}
              className="text-gray-500 hover:text-gray-700"
              title="Collapse"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>
          </>
        ) : (
          <div className="mx-auto w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center">
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
            className={`w-full cursor-pointer flex items-center justify-between rounded-lg px-4 py-3 transition
              ${
                activeItem === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${activeItem === item.id ? "text-white" : "text-gray-600"}`}>
                {item.icon}
              </span>
              {isOpen && <span className="font-medium">{item.label}</span>}
            </div>

            {isOpen && item.badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeItem === item.id 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ===== SETTINGS & HELP ===== */}
      <div className="absolute bottom-0 w-full border-t p-3 space-y-1">
       

        <button
          onClick={() => handleNavigate("help", "/help")}
          className={`w-full cursor-pointer flex items-center gap-3 rounded-lg px-4 py-3 transition
            ${
              activeItem === "help"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <span className={`${activeItem === "help" ? "text-white" : "text-gray-600"}`}>
            <QuestionCircle size={20} />
          </span>
          {isOpen && <span className="font-medium">Help & Support</span>}
        </button>
      </div>
    </div>
  );
};

export default StudentDashboardSidebar;
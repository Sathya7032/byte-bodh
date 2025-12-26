import React, { useState } from "react";
import StudentDashboardNavbar from "./StudentDashboardNavbar";
import StudentDashboardSidebar from "./StudentDashboardSidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
    console.log(`Navigating to: ${itemId}`);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* ===== SIDEBAR ===== */}
      <StudentDashboardSidebar
        isOpen={sidebarOpen}
        activeItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
      />

      {/* ===== MAIN CONTENT ===== */}
      <div
        className={`min-h-screen transition-all duration-300
          ${sidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        {/* ===== NAVBAR ===== */}
        <StudentDashboardNavbar onToggleSidebar={handleToggleSidebar} />

        {/* ===== PAGE CONTENT ===== */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

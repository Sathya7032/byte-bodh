import React, { useState, useEffect } from "react";
import StudentDashboardNavbar from "./StudentDashboardNavbar";
import StudentDashboardSidebar from "./StudentDashboardSidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Close sidebar on mobile by default
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
    console.log(`Navigating to: ${itemId}`);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div
        className={`transform transition-all duration-300 flex-shrink-0
          ${
            isMobile
              ? `fixed inset-y-0 left-0 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-[280px]`
              : `relative ${sidebarOpen ? "w-[280px]" : "w-[80px]"}`
          }`}
      >
        <StudentDashboardSidebar
          isOpen={sidebarOpen}
          activeItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
        />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* ===== NAVBAR ===== */}
        <StudentDashboardNavbar 
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={sidebarOpen}
        />

        {/* ===== PAGE CONTENT ===== */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import StudentDashboardNavbar from "./StudentDashboardNavbar";
import StudentDashboardSidebar from "./StudentDashboardSidebar";

const DashboardLayout = ({ children, containerClassName }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

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

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: "Home", path: "/dashboard" }];
    
    if (path === "/dashboard" || path === "/") {
      crumbs.push({ label: "Dashboard", path: "/dashboard" });
    } else if (path === "/profile") {
      crumbs.push({ label: "My Portfolio", path: "/profile" });
    } else if (path === "/resume-builder") {
      crumbs.push({ label: "Resume Templates", path: "/resume-builder" });
    } else if (path === "/portfolio-templates") {
      crumbs.push({ label: "Portfolio Templates", path: "/portfolio-templates" });
    } else if (path === "/contacts") {
      crumbs.push({ label: "Contacts", path: "/contacts" });
    } else if (path === "/tasks") {
      crumbs.push({ label: "Tasks & Projects", path: "/tasks" });
    } else if (path === "/billings") {
      crumbs.push({ label: "Billings", path: "/billings" });
    } else if (path === "/help") {
      crumbs.push({ label: "Help & Support", path: "/help" });
    } else {
      // Fallback for any other path
      const segment = path.substring(1);
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
      crumbs.push({ label, path });
    }
    return crumbs;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-left">
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
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">
            {/* Breadcrumb trail */}
            <nav className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 mb-5 tracking-wider uppercase" aria-label="Breadcrumb">
              {getBreadcrumbs().map((crumb, idx, arr) => (
                <React.Fragment key={crumb.path}>
                  {idx > 0 && <span className="text-slate-350 select-none">/</span>}
                  {idx === arr.length - 1 ? (
                    <span className="text-[#6C63FF] font-black">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-slate-600 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            <div className={containerClassName !== undefined ? containerClassName : "bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm min-h-[500px]"}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

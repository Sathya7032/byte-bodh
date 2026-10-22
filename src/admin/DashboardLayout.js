import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, pageTitle = "Dashboard" }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: "Admin", path: "/admin-dashboard" }];

    if (path === "/admin-dashboard") {
      crumbs.push({ label: "Dashboard Overview", path: "/admin-dashboard" });
    } else if (path === "/admin-subscriptions") {
      crumbs.push({ label: "Subscriptions Governance", path: "/admin-subscriptions" });
    } else if (path === "/admin-payments") {
      crumbs.push({ label: "Payments & Invoices", path: "/admin-payments" });
    } else if (path === "/admin-templates") {
      crumbs.push({ label: "Portfolio Templates", path: "/admin-templates" });
    } else if (path === "/admin-linktree-templates") {
      crumbs.push({ label: "Linktree Bio Templates", path: "/admin-linktree-templates" });
    } else if (path === "/admin-linktree") {
      crumbs.push({ label: "Linktree Bio Governance", path: "/admin-linktree" });
    } else {
      const segment = path.replace("/admin-", "").replace("/admin/", "");
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      crumbs.push({ label, path });
    }
    return crumbs;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-600">
      
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Navbar Header */}
        <Navbar
          toggleSidebar={toggleSidebar}
          pageTitle={pageTitle}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/60">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* Breadcrumb Trail */}
            <nav className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 mb-5 tracking-wider uppercase" aria-label="Breadcrumb">
              {getBreadcrumbs().map((crumb, idx, arr) => (
                <React.Fragment key={crumb.path}>
                  {idx > 0 && <span className="text-slate-300 select-none">/</span>}
                  {idx === arr.length - 1 ? (
                    <span className="text-emerald-600 font-black">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-slate-600 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;

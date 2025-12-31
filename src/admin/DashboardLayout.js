// layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';


const DashboardLayout = ({ children, pageTitle = "Dashboard", onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const user = {
    name: "Admin User",
    email: "admin@bytebodh.com",
    role: "Administrator"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          onNavigate={handleNavigate}
        />
        
        <div className="flex-1 flex flex-col">
          <Navbar
            toggleSidebar={toggleSidebar}
            pageTitle={pageTitle}
            onSearch={handleSearch}
            user={user}
          />
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
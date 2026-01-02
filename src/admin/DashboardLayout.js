// layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, pageTitle = "Dashboard", onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarCollapsed(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    onNavigate?.(pageId);
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  const user = {
    name: "Admin User",
    email: "admin@bytebodh.com",
    role: "Administrator"
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="flex h-full">
        
        {/* FIXED SIDEBAR */}
        <aside className="h-screen flex-shrink-0">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
            onNavigate={handleNavigate}
          />
        </aside>

        {/* CONTENT AREA */}
        <div className="flex flex-col flex-1 h-screen overflow-hidden">
          
          {/* FIXED NAVBAR */}
          <header className="flex-shrink-0">
            <Navbar
              toggleSidebar={toggleSidebar}
              pageTitle={pageTitle}
              onSearch={handleSearch}
              user={user}
            />
          </header>

          {/* SCROLLABLE CONTENT ONLY */}
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

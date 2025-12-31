// components/Sidebar.jsx
import React from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings,  
  ShoppingCart, 
  Shield,
  HelpCircle,
  LogOut,
  User,
  Package,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard', badge: null },
    { id: 'users', icon: <Users size={20} />, label: 'Users', badge: null },
    { id: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics', badge: 'New' },
    { id: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders', badge: '24' },
    { id: 'products', icon: <Package size={20} />, label: 'Products', badge: null },
  ];

  const secondaryItems = [
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', badge: null },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help Center', badge: null },
  ];

  const handleItemClick = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
        ${isCollapsed ? 'lg:w-20' : 'w-64'}
        bg-gray-900 text-white h-screen flex flex-col
        shadow-2xl
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={24} />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold">ByteBodh</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && isMobile && (
            <button 
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Collapse Toggle for Desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-gray-800 hover:bg-gray-700 p-1.5 rounded-full border border-gray-700 shadow-lg z-10"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className={`px-4 mb-6 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed && (
              <h2 className="text-xs uppercase text-gray-400 font-semibold tracking-wider">
                Main Menu
              </h2>
            )}
          </div>
          
          <ul className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} 
                    px-3 py-3 rounded-lg transition-colors
                    hover:bg-gray-800 text-gray-300
                    ${item.id === 'dashboard' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className={item.id === 'dashboard' ? 'text-white' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Secondary Items */}
          <div className={`mt-8 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {!isCollapsed && (
              <h2 className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-2">
                Settings
              </h2>
            )}
            
            <ul className="space-y-1">
              {secondaryItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} 
                      px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="text-gray-400">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          <div className={`
            flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} 
            p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer
          `}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={20} />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">admin@bytebodh.com</p>
              </div>
            )}
            {!isCollapsed && (
              <button className="p-1 hover:bg-gray-700 rounded">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
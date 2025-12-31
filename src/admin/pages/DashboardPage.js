// pages/DashboardPage.jsx
import React from 'react';
import DashboardLayout from '../DashboardLayout';


const DashboardPage = () => {
  const handleNavigate = (pageId) => {
    console.log('Navigating to:', pageId);
    // Handle navigation logic here
  };

  return (
    <DashboardLayout 
      pageTitle="Analytics Dashboard"
      onNavigate={handleNavigate}
    >
      <div className="p-6">
        {/* Your dashboard content here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">$24,580</p>
            <p className="text-green-500 text-sm mt-2">+12.5% from last month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-gray-800">1,248</p>
            <p className="text-blue-500 text-sm mt-2">+8.2% from last month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Orders</h3>
            <p className="text-3xl font-bold text-gray-800">324</p>
            <p className="text-purple-500 text-sm mt-2">+5.7% from last month</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-gray-800">24.8%</p>
            <p className="text-orange-500 text-sm mt-2">+3.4% from last month</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
            {/* Chart would go here */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Revenue Chart Component</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {['User registration', 'Order placed', 'Payment received', 'System update'].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-700">{activity}</p>
                  <span className="text-xs text-gray-500 ml-auto">2h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
// pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import { getBlogs } from '../../api/blogs';
import { getUsers } from '../../api/users';
import { getAllContacts } from '../../api/blogs';
import {
  FaBlog,
  FaUsers,
  FaEnvelope,
  FaChartLine,
  FaArrowUp,
  FaSpinner,
  FaExclamationCircle,
} from 'react-icons/fa';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    totalContacts: 0,
    featuredBlogs: 0,
    loading: true,
    error: null,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch all data in parallel
      const [blogsRes, usersRes, contactsRes] = await Promise.all([
        getBlogs(),
        getUsers(),
        getAllContacts(),
      ]);

      // Extract data based on API response structure
      const blogs = blogsRes.data?.data || blogsRes.data || [];
      const users = usersRes.data?.data || usersRes.data || [];
      const contacts = contactsRes.data?.data || contactsRes.data || [];

      // Calculate stats
      const featuredBlogs = blogs.filter(
        (blog) => blog.isFeatured || blog.is_featured
      ).length;

      // Get recent activity (latest 5 blogs and contacts)
      const recentBlogs = blogs
        .sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0))
        .slice(0, 3)
        .map((blog) => ({
          type: 'blog',
          title: blog.title,
          date: blog.createdAt || blog.created_at,
          icon: <FaBlog className="text-blue-500" />,
        }));

      const recentContacts = contacts
        .sort((a, b) => new Date(b.createdTime || b.createdAt || 0) - new Date(a.createdTime || a.createdAt || 0))
        .slice(0, 2)
        .map((contact) => ({
          type: 'contact',
          title: `New message from ${contact.name}`,
          date: contact.createdTime || contact.createdAt,
          icon: <FaEnvelope className="text-green-500" />,
        }));

      const activity = [...recentBlogs, ...recentContacts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setStats({
        totalBlogs: blogs.length,
        totalUsers: users.length,
        totalContacts: contacts.length,
        featuredBlogs,
        loading: false,
        error: null,
      });

      setRecentActivity(activity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data. Please try again.',
      }));
    }
  };

  const handleNavigate = (pageId) => {
    console.log('Navigating to:', pageId);
    // Handle navigation logic here
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }).format(date);
  };

  if (stats.loading) {
    return (
      <DashboardLayout pageTitle="Analytics Dashboard" onNavigate={handleNavigate}>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (stats.error) {
    return (
      <DashboardLayout pageTitle="Analytics Dashboard" onNavigate={handleNavigate}>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FaExclamationCircle className="text-4xl text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-4">{stats.error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Analytics Dashboard" onNavigate={handleNavigate}>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your website.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Blogs Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <FaBlog className="text-2xl" />
              </div>
              <div className="text-right">
                <span className="text-blue-100 text-sm font-medium">Total</span>
                <p className="text-3xl font-bold">{stats.totalBlogs}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Blog Posts</h3>
            <div className="flex items-center text-blue-100 text-sm">
              <FaChartLine className="mr-1" />
              <span>{stats.featuredBlogs} featured posts</span>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <FaUsers className="text-2xl" />
              </div>
              <div className="text-right">
                <span className="text-purple-100 text-sm font-medium">Total</span>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
            <div className="flex items-center text-purple-100 text-sm">
              <FaUsers className="mr-1" />
              <span>All platform users</span>
            </div>
          </div>

          {/* Total Contacts Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <FaEnvelope className="text-2xl" />
              </div>
              <div className="text-right">
                <span className="text-green-100 text-sm font-medium">Total</span>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Contact Inquiries</h3>
            <div className="flex items-center text-green-100 text-sm">
              <FaEnvelope className="mr-1" />
              <span>From website contact form</span>
            </div>
          </div>

          {/* Featured Blogs Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <FaChartLine className="text-2xl" />
              </div>
              <div className="text-right">
                <span className="text-orange-100 text-sm font-medium">Featured</span>
                <p className="text-3xl font-bold">{stats.featuredBlogs}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Featured Posts</h3>
            <div className="flex items-center text-orange-100 text-sm">
              <FaArrowUp className="mr-1" />
              <span>Highlighted content</span>
            </div>
          </div>
        </div>

        {/* Additional Stats and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Quick Statistics</h3>
              <button
                onClick={fetchDashboardData}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-blue-600 text-sm font-medium mb-1">Blog Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
                <p className="text-xs text-gray-500 mt-1">Total articles published</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-purple-600 text-sm font-medium mb-1">Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-green-600 text-sm font-medium mb-1">Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                <p className="text-xs text-gray-500 mt-1">Form submissions</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-orange-600 text-sm font-medium mb-1">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featuredBlogs}</p>
                <p className="text-xs text-gray-500 mt-1">Highlighted posts</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="mt-1">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaChartLine className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

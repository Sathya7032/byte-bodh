import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { getUser, getAccessToken } from "../services/auth";
import { dashboardStats } from "../api/profileService";
import { FaEye, FaTasks, FaClock, FaCheckCircle, FaLightbulb, FaCalendarAlt, FaBell, FaChartLine } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  // Collection of motivational quotes from inspirational figures[citation:1][citation:4][citation:9]
  const quotes = [
    {
      text: "Success is the sum of small efforts, repeated day-in and day-out.",
      author: "Robert Collier",
      category: "Consistency"
    },
    {
      text: "The only place where success comes before work is in the dictionary.",
      author: "Vidal Sassoon",
      category: "Hard Work"
    },
    {
      text: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius",
      category: "Persistence"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Resilience"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "Action"
    },
    {
      text: "Twenty years from now you will be more disappointed by the things you didn't do than by the ones you did do.",
      author: "Mark Twain",
      category: "Opportunity"
    }
  ];

  // Upcoming features placeholder
  const upcomingFeatures = [
    {
      title: "Analytics Dashboard",
      description: "Detailed insights into profile performance",
      icon: <FaChartLine className="w-5 h-5" />,
      status: "Coming Soon",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Task Reminders",
      description: "Set reminders for pending tasks and deadlines",
      icon: <FaBell className="w-5 h-5" />,
      status: "In Development",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Achievement Badges",
      description: "Earn badges for completing milestones",
      icon: <FaCheckCircle className="w-5 h-5" />,
      status: "Planned",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Progress Timeline",
      description: "Visual timeline of your learning journey",
      icon: <FaCalendarAlt className="w-5 h-5" />,
      status: "Planned",
      color: "from-orange-500 to-amber-500"
    }
  ];

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUser();

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchDashboardStats();
    
    // Rotate quotes every 30 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 30000);

    return () => clearInterval(quoteInterval);
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completionPercent =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name || "User"}! 👋</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your portfolio today</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
              Last login: Today
            </span>
          </div>
        </div>
      </div>

      {/* Motivational Quote Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FaLightbulb className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Daily Inspiration</span>
              </div>
              <blockquote className="text-xl font-medium mb-3">
                "{quotes[currentQuote].text}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">— {quotes[currentQuote].author}</p>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full mt-1">
                    {quotes[currentQuote].category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handlePrevQuote}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Previous quote"
                  >
                    ←
                  </button>
                  <button 
                    onClick={handleNextQuote}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Next quote"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Profile Views Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">
                <FaEye className="w-4 h-4" /> Profile Views
              </h6>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.profileViews}</h3>
              <p className="text-sm text-gray-600">Total portfolio visitors</p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-3 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FaEye className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Tasks Completed Card */}
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">
                <FaTasks className="w-4 h-4" /> Tasks Completed
              </h6>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.completedTasks}/{stats.totalTasks}
              </h3>
              <p className="text-sm text-gray-600">Overall progress</p>
            </div>
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm font-semibold text-amber-700">{completionPercent}%</div>
              </div>
              <svg className="transform -rotate-90" width="56" height="56">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#fef3c7"
                  strokeWidth="8"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray={Math.PI * 2 * 24}
                  strokeDashoffset={
                    Math.PI * 2 * 24 * ((100 - completionPercent) / 100)
                  }
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700 font-medium">{completionPercent}% completion</span>
              <span className="text-gray-500">{stats.pendingTasks} pending</span>
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">
                <FaClock className="w-4 h-4" /> Pending Tasks
              </h6>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingTasks}</h3>
              <p className="text-sm text-gray-600">Require attention</p>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-red-50 p-3 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaClock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm">
              <span className="text-red-600 font-medium">Due soon: {Math.min(stats.pendingTasks, 3)}</span>
              <span className="text-gray-500 ml-2">tasks</span>
            </div>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-gray-500 text-sm font-medium mb-2 flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4" /> Completed Tasks
              </h6>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.completedTasks}</h3>
              <p className="text-sm text-gray-600">Great work! 🎉</p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-3 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+{stats.completedTasks} this month</span>
              <span className="text-gray-500 ml-2">Keep it up!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2">
          {/* Upcoming Features Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">🚀 Upcoming Features</h2>
                <p className="text-gray-600 mt-1">Exciting new tools coming to your dashboard</p>
              </div>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-sm font-medium rounded-full">
                Beta Access
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-gradient-to-r ${feature.color} rounded-lg text-white`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          feature.status === 'Coming Soon' ? 'bg-blue-100 text-blue-700' :
                          feature.status === 'In Development' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <span>Estimated launch: Q{(index % 4) + 1} 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Have suggestions for new features?{" "}
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Share your ideas →
                </button>
              </p>
            </div>
          </div>

          {/* Recent Activity Table Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Activity</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaEye className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Profile viewed by recruiter</p>
                          <p className="text-sm text-gray-600">Tech Solutions Inc.</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">Today, 10:30 AM</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Viewed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                          <FaTasks className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Task completed: Update skills</p>
                          <p className="text-sm text-gray-600">Added 3 new skills to profile</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">Yesterday, 3:45 PM</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="lg:col-span-1">
          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-6">
            <h3 className="text-lg font-bold mb-4">📊 Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Profile Completion</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Avg. Daily Views</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Task Completion Rate</span>
                <span className="font-semibold">{completionPercent}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" style={{width: `${completionPercent}%`}}></div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                "Success is the sum of small efforts, repeated day-in and day-out." 
                <span className="block text-gray-300 mt-1">— Robert Collier</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaEye className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Preview Portfolio</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">Complete Tasks</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaChartLine className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">View Analytics</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
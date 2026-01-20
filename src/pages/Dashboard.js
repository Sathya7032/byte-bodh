import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import { getUser, getAccessToken } from "../services/auth";
import { dashboardStats } from "../api/profileService";
import { 
  FaEye, 
  FaTasks, 
  FaClock, 
  FaCheckCircle, 
  FaLightbulb, 
  FaCalendarAlt, 
  FaBell, 
  FaChartLine,
  FaArrowRight,
  FaSpinner,
  FaStar,
  FaTerminal
} from "react-icons/fa";

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
  }, [navigate, quotes.length]);

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
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="text-blue-600 text-2xl animate-spin" />
              </div>
            </div>
            <p className="text-lg text-gray-600 mt-6 font-medium">Loading your dashboard...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching your latest statistics</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const completionPercent =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const userName = user?.fullName || user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="dashboard-welcome-header flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">{userInitial}</span>
            </div>
            <div>
              <h1 className="dashboard-welcome-title text-3xl md:text-4xl font-bold text-gray-900">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userName}</span>! 👋
              </h1>
              <p className="dashboard-welcome-subtitle text-gray-600 mt-2 text-lg">Here's what's happening with your portfolio today</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="dashboard-active-status hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 text-sm font-medium">Active Now</span>
            </div>
            <span className="dashboard-date-display px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm font-medium shadow-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Motivational Quote Section */}
      <div className="mb-8">
        <div className="dashboard-quote-section relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaLightbulb className="w-5 h-5 text-yellow-300" />
                </div>
                <span className="text-sm font-semibold bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  Daily Inspiration
                </span>
              </div>
              <blockquote className="dashboard-quote-text text-2xl md:text-3xl font-semibold mb-4 leading-relaxed">
                "{quotes[currentQuote].text}"
              </blockquote>
              <div className="dashboard-quote-controls flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="dashboard-quote-author text-base opacity-95 font-medium">— {quotes[currentQuote].author}</p>
                  <span className="inline-block mt-2 text-xs font-semibold bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                    {quotes[currentQuote].category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevQuote}
                    className="p-3 hover:bg-white/25 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
                    aria-label="Previous quote"
                  >
                    <FaArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                  <div className="dashboard-quote-dots flex gap-1">
                    {quotes.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentQuote ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={handleNextQuote}
                    className="p-3 hover:bg-white/25 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
                    aria-label="Next quote"
                  >
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="dashboard-stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Profile Views Card */}
        <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FaEye className="w-4 h-4 text-blue-600" />
                </div>
                <h6 className="dashboard-stat-title text-gray-600 text-sm font-semibold uppercase tracking-wide">
                  Profile Views
                </h6>
              </div>
              <h3 className="dashboard-stat-number text-4xl font-bold text-gray-900 mb-2">{stats.profileViews}</h3>
              <p className="dashboard-stat-desc text-sm text-gray-500">Total portfolio visitors</p>
            </div>
            <div className="dashboard-stat-icon w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <FaEye className="dashboard-stat-icon-content w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <FaTerminal className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-semibold">+12%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Completed Card */}
        <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden">
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <FaTasks className="w-4 h-4 text-amber-600" />
                </div>
                <h6 className="dashboard-stat-title text-gray-600 text-sm font-semibold uppercase tracking-wide">
                  Tasks Progress
                </h6>
              </div>
              <h3 className="dashboard-stat-number text-4xl font-bold text-gray-900 mb-2">
                {stats.completedTasks}<span className="text-2xl text-gray-400">/{stats.totalTasks}</span>
              </h3>
              <p className="dashboard-stat-desc text-sm text-gray-500">Overall completion</p>
            </div>
            <div className="dashboard-stat-icon relative w-16 h-16">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="#fef3c7"
                  strokeWidth="6"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={Math.PI * 2 * 26}
                  strokeDashoffset={
                    Math.PI * 2 * 26 * ((100 - completionPercent) / 100)
                  }
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-xs font-bold text-amber-700">{completionPercent}%</div>
              </div>
            </div>
          </div>
          <div className="relative z-10 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-amber-700 font-semibold">{completionPercent}% complete</span>
              <span className="text-gray-500">{stats.pendingTasks} remaining</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden">
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <FaClock className="w-4 h-4 text-red-600" />
                </div>
                <h6 className="dashboard-stat-title text-gray-600 text-sm font-semibold uppercase tracking-wide">
                  Pending Tasks
                </h6>
              </div>
              <h3 className="dashboard-stat-number text-4xl font-bold text-gray-900 mb-2">{stats.pendingTasks}</h3>
              <p className="dashboard-stat-desc text-sm text-gray-500">Require your attention</p>
            </div>
            <div className="dashboard-stat-icon w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <FaClock className="dashboard-stat-icon-content w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-semibold">Due soon: {Math.min(stats.pendingTasks, 3)}</span>
              <span className="text-gray-500">tasks</span>
            </div>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden">
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FaCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <h6 className="dashboard-stat-title text-gray-600 text-sm font-semibold uppercase tracking-wide">
                  Completed
                </h6>
              </div>
              <h3 className="dashboard-stat-number text-4xl font-bold text-gray-900 mb-2">{stats.completedTasks}</h3>
              <p className="dashboard-stat-desc text-sm text-gray-500">Tasks finished successfully</p>
            </div>
            <div className="dashboard-stat-icon w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <FaCheckCircle className="dashboard-stat-icon-content w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span className="text-green-600 font-semibold">+{stats.completedTasks} this month</span>
              <span className="text-gray-500">Keep it up!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-main-layout grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2">
          {/* Upcoming Features Section */}
          <div className="dashboard-card bg-white rounded-2xl border border-gray-200 shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-3xl">🚀</span> Upcoming Features
                </h2>
                <p className="text-gray-600 mt-2">Exciting new tools coming to your dashboard</p>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-full shadow-md whitespace-nowrap">
                Beta Access
              </span>
            </div>
            
            <div className="dashboard-features-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="dashboard-feature-card group relative border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className={`dashboard-feature-icon p-3 bg-gradient-to-r ${feature.color} rounded-xl text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="dashboard-feature-title font-bold text-gray-900 text-lg">{feature.title}</h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${
                          feature.status === 'Coming Soon' ? 'bg-blue-100 text-blue-700' :
                          feature.status === 'In Development' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {feature.status}
                        </span>
                      </div>
                      <p className="dashboard-feature-desc text-sm text-gray-600 mb-3 leading-relaxed">{feature.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaCalendarAlt className="w-3 h-3 mr-1" />
                        <span>Estimated: Q{(index % 4) + 1} 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Have suggestions for new features?{" "}
                <button className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 transition-colors">
                  Share your ideas <FaArrowRight className="w-3 h-3" />
                </button>
              </p>
            </div>
          </div>

          {/* Recent Activity Table Section */}
          <div className="dashboard-card bg-white rounded-2xl border border-gray-200 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <p className="text-gray-600 mt-1 text-sm">Track your latest portfolio interactions</p>
              </div>
              <Link 
                to="/profile" 
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 whitespace-nowrap"
              >
                View All <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="dashboard-activity-table w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Activity</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-4 px-4">
                      <div className="dashboard-activity-row-content flex items-center gap-4">
                        <div className="dashboard-activity-row-icon w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                          <FaEye className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 break-words">Profile viewed by recruiter</p>
                          <p className="text-sm text-gray-600 mt-1">Tech Solutions Inc.</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700 font-medium whitespace-nowrap">Today, 10:30 AM</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 whitespace-nowrap">
                        Viewed
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors duration-150">
                    <td className="py-4 px-4">
                      <div className="dashboard-activity-row-content flex items-center gap-4">
                        <div className="dashboard-activity-row-icon w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                          <FaTasks className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 break-words">Task completed: Update skills</p>
                          <p className="text-sm text-gray-600 mt-1">Added 3 new skills to profile</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700 font-medium whitespace-nowrap">Yesterday, 3:45 PM</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200 whitespace-nowrap">
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
        <div className="dashboard-sidebar lg:col-span-1 space-y-6">
          {/* Quick Stats Summary */}
          <div className="dashboard-card bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-2xl border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <FaChartLine className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">Quick Stats</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">Profile Completion</span>
                  <span className="font-bold text-lg">85%</span>
                </div>
                <div className="dashboard-progress-bar w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000 shadow-lg" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">Avg. Daily Views</span>
                  <span className="font-bold text-lg">12</span>
                </div>
                <div className="dashboard-progress-bar w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 shadow-lg" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">Task Completion</span>
                  <span className="font-bold text-lg">{completionPercent}%</span>
                </div>
                <div className="dashboard-progress-bar w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-1000 shadow-lg" style={{width: `${completionPercent}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-start gap-3">
                <FaLightbulb className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-300 leading-relaxed">
                  "Success is the sum of small efforts, repeated day-in and day-out." 
                  <span className="block text-gray-400 mt-2 font-medium">— Robert Collier</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Link 
                to="/portfolio" 
                className="dashboard-quick-action group w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <FaEye className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Preview Portfolio</span>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
              </Link>
              
              <Link 
                to="/tasks" 
                className="dashboard-quick-action group w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <FaCheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Complete Tasks</span>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
              </Link>
              
              <Link 
                to="/analytics" 
                className="dashboard-quick-action group w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <FaChartLine className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">View Analytics</span>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
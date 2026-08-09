import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PersonCircle,
  BoxArrowRight,
  List,
  ChevronDown,
  Search,
  Moon,
  Sun,
  XLg,
  Bell,
  Trash,
  Check2All,
  Award,
  AwardFill
} from "react-bootstrap-icons";
import { getUser, logout } from "../../services/auth";
import {
  getMyProfile,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications
} from "../../api/profileService";
import { getSubscriptionStatus } from "../../api/subscriptionService";
import { toast } from "react-toastify";

const SimpleNavbar = ({ onToggleSidebar, isDarkMode = false, onToggleTheme, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef(null);

  const [subscription, setSubscription] = useState(null);

  const user = getUser();

  useEffect(() => {
    getSubscriptionStatus()
      .then((res) => {
        if (res.data?.success) setSubscription(res.data.data);
      })
      .catch(() => {});
  }, []);

  const subscriptionIsExpired = (() => {
    if (!subscription?.expiryDate) return false;
    const exp = new Date(subscription.expiryDate);
    if (isNaN(exp.getTime())) return false;
    exp.setHours(23, 59, 59, 999);
    return exp < new Date();
  })();
  const isSubscribed = !!subscription?.active && !subscriptionIsExpired;

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      if (res.data?.success && res.data.data) {
        const list = res.data.data;
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.read).length);
      } else if (Array.isArray(res.data)) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotif = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("Notifications cleared");
    } catch (err) {
      console.error(err);
    }
  };
  const [username, setUsername] = useState(user?.username || "");

  const fullName = user?.fullName || "User";
  const displayName = (user?.fullName && user?.fullName !== "User") ? user.fullName : (user?.name || "");
  const email = user?.email || "user@example.com";
  const role = user?.role || "Student";

  useEffect(() => {
    // If username isn't cached in localStorage, fetch it from profile
    if (!username) {
      getMyProfile()
        .then((res) => {
          if (res.data?.success && res.data?.data?.user?.username) {
            const newUsername = res.data.data.user.username;
            setUsername(newUsername);
            
            // Sync with local storage
            try {
              const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
              storedUser.username = newUsername;
              localStorage.setItem("user", JSON.stringify(storedUser));
            } catch (e) {
              console.error("Error saving username to localStorage:", e);
            }
          }
        })
        .catch((err) => console.error("Error fetching username in navbar:", err));
    }
  }, [username]);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    fullName
  )}&background=10b981&color=fff&bold=true&size=128`;

  const handleSidebarToggle = () => {
    onToggleSidebar?.();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <button
                onClick={handleSidebarToggle}
                aria-label="Toggle sidebar"
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {isSidebarOpen ? (
                  <XLg size={18} />
                ) : (
                  <List size={20} />
                )}
              </button>
            )}

            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-2 shadow-sm shadow-emerald-500/15 animate-pulse">
                <span className="text-white font-extrabold text-sm">B</span>
              </div>
              <a
                href="/dashboard"
                className="hidden sm:block text-xl font-black tracking-tight bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent"
              >
                ByteBodh
              </a>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-3">
            {/* Subscription Status Badge */}
            <button
              onClick={() => navigate("/subscription")}
              title={isSubscribed ? "You have an active subscription" : "Subscribe to unlock premium features"}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                isSubscribed
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              {isSubscribed ? <AwardFill size={12} /> : <Award size={12} />}
              {isSubscribed ? (subscription?.planType === "YEARLY" ? "Yearly Pro" : "Monthly Pro") : "Free Plan"}
            </button>

            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative active:scale-90 cursor-pointer"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden z-50 animate-fadeIn text-left">
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-xs">Notifications</h3>
                      <p className="text-[10px] text-slate-405 font-bold">You have {unreadCount} unread alerts</p>
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleMarkAllAsRead}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                          title="Mark all read"
                        >
                          <Check2All size={14} /> Read All
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="p-1 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded text-[10px] font-bold cursor-pointer"
                          title="Clear all"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-400">
                        <Bell size={24} className="mx-auto mb-2 text-slate-300 animate-pulse" />
                        <p className="text-xs font-semibold">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 flex gap-3 transition-colors ${
                            notif.read ? "bg-white" : "bg-emerald-50/50"
                          }`}
                        >
                          <div className="flex-1 space-y-1">
                            <p className="text-xs font-semibold text-slate-700 leading-normal">
                              {notif.message}
                            </p>
                            <span className="block text-[9px] font-bold text-slate-450">
                              {new Date(notif.createdAt).toLocaleDateString()} at{" "}
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 items-end shrink-0">
                            {!notif.read && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="w-2 h-2 bg-emerald-600 rounded-full cursor-pointer"
                                title="Mark read"
                              />
                            )}
                            <button
                              onClick={() => handleDeleteNotif(notif.id)}
                              className="text-slate-350 hover:text-red-500 p-1 cursor-pointer"
                              title="Delete"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
              >
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{displayName || (username ? `@${username}` : "User")}</span>
                    {displayName && username && (
                      <span className="text-[9px] text-emerald-600 font-black bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-lg tracking-wide">
                        @{username}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-0.5 font-bold tracking-wider uppercase">
                    {role}
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden animate-fadeIn">
                  {/* Header */}
                  <div className="px-4 py-4 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{fullName}</h3>
                        {username && (
                          <p className="text-[10px] font-bold text-emerald-600 mt-0.5">@{username}</p>
                        )}
                        <p className="text-xs text-slate-500 truncate max-w-[170px] mt-0.5">{email}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold rounded-full">
                            {role}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            isSubscribed
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {isSubscribed ? <AwardFill size={10} /> : <Award size={10} />}
                            {isSubscribed ? (subscription?.planType === "YEARLY" ? "Yearly Plan" : "Monthly Plan") : "Not Subscribed"}
                          </span>
                        </div>
                        {isSubscribed && subscription?.expiryDate && (
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">Renews / expires {subscription.expiryDate}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1 px-2 space-y-0.5">
                    <a
                      href="/profile"
                      className="flex items-center px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl transition-all"
                    >
                      <div className="w-6 flex justify-center">
                        <PersonCircle size={18} className="text-slate-400" />
                      </div>
                      <span className="ml-2.5 font-semibold text-xs">My Profile</span>
                    </a>

                    <a
                      href="/subscription"
                      className="flex items-center px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl transition-all"
                    >
                      <div className="w-6 flex justify-center">
                        {isSubscribed ? <AwardFill size={16} className="text-amber-500" /> : <Award size={16} className="text-slate-400" />}
                      </div>
                      <span className="ml-2.5 font-semibold text-xs">{isSubscribed ? "Manage Subscription" : "Subscribe Now"}</span>
                    </a>

                    <div className="my-1 border-t border-slate-100" />

                    <a
                      href="/help"
                      className="flex items-center px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-xl transition-all"
                    >
                      <div className="w-6 flex justify-center text-slate-400 font-bold text-sm">
                        <span>?</span>
                      </div>
                      <span className="ml-2.5 font-semibold text-xs">Help & Support</span>
                    </a>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <div className="w-6 flex justify-center">
                        <BoxArrowRight size={18} />
                      </div>
                      <span className="ml-2.5 font-semibold text-xs">Logout</span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                    <div className="text-[10px] text-slate-400 font-medium text-center">
                      © 2026 ByteBodh • v2.2.0
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SimpleNavbar;
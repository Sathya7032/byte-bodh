import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../DashboardLayout';
import { adminUserApi } from '../../api/adminApiService';
import API_BASE_URL, { getPortfolioUrl } from '../../config/api';
import { toast } from 'react-toastify';
import {
  Users,
  Search,
  Eye,
  MousePointer,
  Crown,
  Laptop,
  Smartphone,
  Tablet,
  RefreshCw,
  ExternalLink,
  UserCheck,
  UserX,
  Sparkles,
  X,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const AdminUsers = () => {
  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    subscribedUsers: 0,
    totalProfileViews: 0,
    totalLinkClicks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Users Table State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 15;

  // Selected User Modal / History State
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userHistory, setUserHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('overview'); // 'overview' | 'sessions' | 'subscriptions'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  // Fetch Summary Statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await adminUserApi.getStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load user management stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch Users with Filters & Pagination
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (subscriptionFilter !== '') {
        params.hasSubscription = subscriptionFilter === 'true';
      }

      const res = await adminUserApi.getAll(params);
      if (res.data) {
        setUsers(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to retrieve user accounts');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, subscriptionFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Search Input Debouncing / Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSubscriptionFilter('');
    setPage(0);
  };

  // Toggle User Activation Status (Activate / Suspend)
  const handleToggleUserStatus = async (user) => {
    const isActivating = user.accountStatus !== 'ACTIVE';
    const actionText = isActivating ? 'activate' : 'suspend';
    
    if (
      !window.confirm(
        `Are you sure you want to ${actionText} account for "${user.fullName || user.username}"?${
          !isActivating ? ' All active device sessions will be immediately terminated.' : ''
        }`
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(user.id);
      const res = await adminUserApi.toggle(user.id);
      const updatedUser = res.data?.user || res.data;
      toast.success(
        res.data?.message ||
          `User ${updatedUser.fullName || updatedUser.username} is now ${updatedUser.accountStatus}`
      );

      // Update in local table
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, accountStatus: updatedUser.accountStatus } : u))
      );

      // Update in history modal if open
      if (userHistory && userHistory.user?.id === user.id) {
        setUserHistory((prev) => ({
          ...prev,
          user: { ...prev.user, accountStatus: updatedUser.accountStatus },
        }));
      }

      // Refresh overview stats
      fetchStats();
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      toast.error(err.response?.data?.message || 'Failed to update user account status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open User History & Audit Modal
  const handleOpenHistoryModal = async (userId) => {
    setSelectedUserId(userId);
    setActiveModalTab('overview');
    try {
      setHistoryLoading(true);
      const res = await adminUserApi.getHistory(userId);
      setUserHistory(res.data);
    } catch (err) {
      console.error('Failed to load user history:', err);
      toast.error('Failed to fetch detailed user history & session tracking');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setUserHistory(null);
  };

  // Copy helper
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.info(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Format Helper
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 2) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <DashboardLayout pageTitle="User Management & Audit">
      <div className="space-y-6 text-left">
        
        {/* Header Banner */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Identity & Governance Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              User Management & Activity Tracking
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search, monitor user login sessions, manage activation status, and inspect portfolio audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchStats();
                fetchUsers();
              }}
              disabled={loading || statsLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading || statsLoading ? 'animate-spin text-emerald-600' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Users */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900">
                {statsLoading ? '—' : stats.totalUsers}
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Registered accounts</p>
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-emerald-600">
                {statsLoading ? '—' : stats.activeUsers}
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Permitted access</p>
            </div>
          </div>

          {/* Card 3: Suspended Users */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Suspended</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <UserX size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-rose-600">
                {statsLoading ? '—' : stats.suspendedUsers}
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Revoked / Restricted</p>
            </div>
          </div>

          {/* Card 4: Subscribed Users */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Subscribed</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Crown size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-amber-600">
                {statsLoading ? '—' : stats.subscribedUsers}
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Paid Pro subscribers</p>
            </div>
          </div>

          {/* Card 5: Profile Views */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-teal-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Views</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Eye size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900">
                {statsLoading ? '—' : Number(stats.totalProfileViews || 0).toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Portfolio views</p>
            </div>
          </div>

          {/* Card 6: Link Clicks */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Link Clicks</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MousePointer size={16} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900">
                {statsLoading ? '—' : Number(stats.totalLinkClicks || 0).toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Outbound interactions</p>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by full name, email, or username handle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 placeholder-slate-400 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Account Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active Accounts</option>
                <option value="SUSPENDED">Suspended Accounts</option>
                <option value="INACTIVE">Inactive Accounts</option>
              </select>

              {/* Subscription Filter */}
              <select
                value={subscriptionFilter}
                onChange={(e) => {
                  setSubscriptionFilter(e.target.value);
                  setPage(0);
                }}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                <option value="">All Subscriptions</option>
                <option value="true">Subscribed (Pro)</option>
                <option value="false">Free Tier</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                Apply
              </button>

              {(search || statusFilter || subscriptionFilter) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2.5 text-slate-500 hover:text-slate-700 text-xs font-semibold hover:bg-slate-100 rounded-xl transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="px-5 py-4">User Profile</th>
                  <th className="px-5 py-4">Template & Niche</th>
                  <th className="px-5 py-4">Plan & Traffic</th>
                  <th className="px-5 py-4">Account Status</th>
                  <th className="px-5 py-4">Last Active</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw size={28} className="animate-spin text-emerald-500 mb-2" />
                        <span className="text-slate-500 font-medium text-xs">Loading user registry...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                          <Users size={24} />
                        </div>
                        <p className="text-slate-800 font-bold text-base">No Users Found</p>
                        <p className="text-slate-400 text-xs mt-1">
                          No users matched your search or status filter criteria. Try resetting filters.
                        </p>
                        {(search || statusFilter || subscriptionFilter) && (
                          <button
                            onClick={handleResetFilters}
                            className="mt-3 text-xs text-emerald-600 font-bold hover:underline"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isActive = user.accountStatus === 'ACTIVE';
                    const isSuspended = user.accountStatus === 'SUSPENDED';

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                        {/* User Identity Column */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              {user.avatarUrl ? (
                                <img
                                  src={
                                    user.avatarUrl.startsWith('http')
                                      ? user.avatarUrl
                                      : `${API_BASE_URL}${user.avatarUrl}`
                                  }
                                  alt={user.fullName || user.username}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                style={{ display: user.avatarUrl ? 'none' : 'flex' }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold items-center justify-center text-sm shadow-sm"
                              >
                                {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                              </div>
                              {user.hasActiveSubscription && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm" title="Pro Subscriber">
                                  <Crown size={10} />
                                </span>
                              )}
                            </div>

                            {/* Name & Handle */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 truncate">
                                  {user.fullName || 'Unnamed Creator'}
                                </span>
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                                  {user.authProvider || 'OAUTH'}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                                <span>@{user.username}</span>
                                <span>•</span>
                                <span className="truncate max-w-[140px]">{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Template & Profession */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 text-xs">
                              {user.activeTemplateName || 'Academic Minimalist'}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5">
                              {user.customProfessionTitle || user.professionCategory || 'General Portfolio'}
                            </span>
                          </div>
                        </td>

                        {/* Subscription & Traffic */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <div>
                              {user.hasActiveSubscription ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Crown size={11} />
                                  Pro Plan
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                                  Free Tier
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-medium">
                              <span className="inline-flex items-center gap-1">
                                <Eye size={11} className="text-teal-500" />
                                {user.totalProfileViews || 0}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MousePointer size={11} className="text-indigo-500" />
                                {user.totalLinkClicks || 0}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Account Status Pill */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                : isSuspended
                                ? 'bg-rose-50 text-rose-700 border border-rose-200/70'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-500' : isSuspended ? 'bg-rose-500' : 'bg-slate-400'
                              }`}
                            />
                            {user.accountStatus || 'ACTIVE'}
                          </span>
                        </td>

                        {/* Last Active Timestamp */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">
                              {formatRelativeTime(user.lastActiveAt || user.updatedAt)}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5">
                              Joined {formatDate(user.createdAt).split(',')[0]}
                            </span>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* History / Audit Button */}
                            <button
                              onClick={() => handleOpenHistoryModal(user.id)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-700 text-xs font-semibold transition-all shadow-sm active:scale-95"
                              title="Inspect Activity History & Sessions"
                            >
                              Audit
                            </button>

                            {/* Public Link Preview */}
                            <a
                              href={getPortfolioUrl(user.username)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Open Public Portfolio (Subdomain)"
                            >
                              <ExternalLink size={15} />
                            </a>

                            {/* Status Toggle Button */}
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              disabled={actionLoadingId === user.id}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                                isActive
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                              title={isActive ? 'Suspend User Access' : 'Reactivate User Account'}
                            >
                              {actionLoadingId === user.id ? (
                                <RefreshCw size={12} className="animate-spin inline mr-1" />
                              ) : null}
                              {isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200/60 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              Showing <span className="font-bold text-slate-800">{users.length}</span> of{' '}
              <span className="font-bold text-slate-800">{totalElements}</span> users registered
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || loading}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>

              <span className="px-3 py-1 font-bold text-slate-700">
                Page {page + 1} of {totalPages || 1}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || loading}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* User History & Tracking Audit Modal */}
        {selectedUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-left">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
                    {userHistory?.user?.avatarUrl ? (
                      <img
                        src={
                          userHistory.user.avatarUrl.startsWith('http')
                            ? userHistory.user.avatarUrl
                            : `${API_BASE_URL}${userHistory.user.avatarUrl}`
                        }
                        alt="Avatar"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      (userHistory?.user?.fullName || 'U').charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 truncate">
                        {userHistory?.user?.fullName || 'User Profile & Audit'}
                      </h3>
                      {userHistory?.user?.hasActiveSubscription && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Crown size={11} /> Pro
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-mono text-emerald-700 font-semibold">
                        @{userHistory?.user?.username}
                      </span>
                      <span>•</span>
                      <span className="truncate">{userHistory?.user?.email}</span>
                      <span>•</span>
                      <button
                        onClick={() => handleCopy(userHistory?.user?.id, 'UUID')}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 font-mono"
                        title="Copy User UUID"
                      >
                        {copiedText === 'UUID' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                        UUID
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {userHistory?.user && (
                    <a
                      href={getPortfolioUrl(userHistory.user.username)}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink size={13} />
                      View Portfolio
                    </a>
                  )}
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Tabs Navigation */}
              <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-6 text-sm font-bold flex-shrink-0">
                <button
                  onClick={() => setActiveModalTab('overview')}
                  className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
                    activeModalTab === 'overview'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles size={16} />
                  Portfolio Assets & Overview
                </button>
                <button
                  onClick={() => setActiveModalTab('sessions')}
                  className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
                    activeModalTab === 'sessions'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Laptop size={16} />
                  Login Sessions & Audit Trail
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                    {userHistory?.sessions?.length || 0}
                  </span>
                </button>
                <button
                  onClick={() => setActiveModalTab('subscriptions')}
                  className={`py-3.5 border-b-2 transition-all flex items-center gap-2 ${
                    activeModalTab === 'subscriptions'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Crown size={16} />
                  Subscription Billing
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
                    {userHistory?.subscriptions?.length || 0}
                  </span>
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {historyLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <RefreshCw size={32} className="animate-spin text-emerald-500 mb-3" />
                    <span className="text-slate-500 font-semibold text-sm">
                      Aggregating user telemetry and audit history...
                    </span>
                  </div>
                ) : !userHistory ? (
                  <div className="py-20 text-center text-slate-400">User details not available.</div>
                ) : (
                  <>
                    {/* TAB 1: OVERVIEW & PORTFOLIO ASSETS */}
                    {activeModalTab === 'overview' && (
                      <div className="space-y-6">
                        {/* Profile Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Headline
                            </span>
                            <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
                              {userHistory.user.headline || 'None provided'}
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Contact Email
                            </span>
                            <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
                              {userHistory.user.contactEmail || userHistory.user.email}
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Location
                            </span>
                            <p className="text-sm font-semibold text-slate-800 mt-1 truncate">
                              {userHistory.user.location || 'Not set'}
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Active Template
                            </span>
                            <p className="text-sm font-semibold text-emerald-700 mt-1 truncate">
                              {userHistory.user.activeTemplateName || 'Academic Minimalist'}
                            </p>
                          </div>
                        </div>

                        {/* Portfolio Summary Asset Counters */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                            Created Portfolio Content Breakdown
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.projectsCount || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Projects</span>
                                <p className="text-[10px] text-slate-400">Showcased items</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.skillsCount || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Skills</span>
                                <p className="text-[10px] text-slate-400">Tech & tools</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.educationCount || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Education</span>
                                <p className="text-[10px] text-slate-400">Academic records</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.certificationsCount || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Certifications</span>
                                <p className="text-[10px] text-slate-400">Verified credentials</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.achievementsCount || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Achievements</span>
                                <p className="text-[10px] text-slate-400">Honors & awards</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.linksCount || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Social Links</span>
                                <p className="text-[10px] text-slate-400">Linktree redirects</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.totalViews || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Views</span>
                                <p className="text-[10px] text-slate-400">Total visitors</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                {userHistory.portfolioSummary?.totalClicks || 0}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-800">Clicks</span>
                                <p className="text-[10px] text-slate-400">Total interactions</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Account Timestamps Card */}
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                          <div>
                            <span className="text-slate-400">Account Created:</span>{' '}
                            <span className="font-semibold text-slate-700">
                              {formatDate(userHistory.user.createdAt)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Last Modified:</span>{' '}
                            <span className="font-semibold text-slate-700">
                              {formatDate(userHistory.user.updatedAt)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Last Session Ping:</span>{' '}
                            <span className="font-semibold text-emerald-700">
                              {formatRelativeTime(userHistory.user.lastActiveAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: DEVICE SESSIONS & ACTIVITY TRAIL */}
                    {activeModalTab === 'sessions' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">
                            Logged device fingerprints, IPs, and active access sessions for user tracking & security audits.
                          </p>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                            {userHistory.sessions?.length || 0} Recorded Sessions
                          </span>
                        </div>

                        {(!userHistory.sessions || userHistory.sessions.length === 0) ? (
                          <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Laptop size={28} className="mx-auto text-slate-300 mb-2" />
                            No recorded device login sessions found.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {userHistory.sessions.map((sess, idx) => {
                              const isDesktop = (sess.deviceType || '').toUpperCase() === 'DESKTOP';
                              const isMobile = (sess.deviceType || '').toUpperCase() === 'MOBILE';

                              return (
                                <div
                                  key={sess.sessionId || idx}
                                  className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                                      {isMobile ? (
                                        <Smartphone size={20} />
                                      ) : isDesktop ? (
                                        <Laptop size={20} />
                                      ) : (
                                        <Tablet size={20} />
                                      )}
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800 text-sm">
                                          {sess.deviceName || 'Browser Session'}
                                        </span>
                                        {sess.isCurrentSession && (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            Active
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                                        <span>IP: {sess.ipAddress || '127.0.0.1'}</span>
                                        <span>•</span>
                                        <span>OS: {sess.deviceOs || 'Desktop OS'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right text-xs text-slate-500 font-medium sm:self-center">
                                    <div>Last active: {formatRelativeTime(sess.lastActiveAt)}</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                      Logged in: {formatDate(sess.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: SUBSCRIPTIONS & ORDERS */}
                    {activeModalTab === 'subscriptions' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">
                            Billing records, Razorpay order IDs, and subscription tier history.
                          </p>
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                            {userHistory.subscriptions?.length || 0} Subscriptions
                          </span>
                        </div>

                        {(!userHistory.subscriptions || userHistory.subscriptions.length === 0) ? (
                          <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Crown size={28} className="mx-auto text-slate-300 mb-2" />
                            This user has not purchased any paid subscription plans yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {userHistory.subscriptions.map((sub, idx) => {
                              const isSubActive = sub.status === 'ACTIVE' || sub.isCurrentlyActive;

                              return (
                                <div
                                  key={sub.id || idx}
                                  className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900 text-sm">
                                        {sub.planName || sub.planCode || 'Pro Subscription'}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                          isSubActive
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                      >
                                        {sub.status || 'PENDING'}
                                      </span>
                                    </div>

                                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                                      {sub.razorpayOrderId && (
                                        <div className="font-mono flex items-center gap-1.5">
                                          <span>Order: {sub.razorpayOrderId}</span>
                                          <button
                                            onClick={() => handleCopy(sub.razorpayOrderId, 'Order ID')}
                                            className="text-slate-400 hover:text-slate-600"
                                            title="Copy Order ID"
                                          >
                                            <Copy size={11} />
                                          </button>
                                        </div>
                                      )}
                                      <div>
                                        Cycle: <span className="font-semibold">{sub.billingCycle || 'MONTHLY'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right sm:self-center">
                                    <div className="text-lg font-black text-slate-900">
                                      ₹{Number(sub.amountPaid || 0).toLocaleString()}
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                      {formatDate(sub.createdAt || sub.startDate)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
                <div>
                  {userHistory?.user && (
                    <button
                      onClick={() => handleToggleUserStatus(userHistory.user)}
                      disabled={actionLoadingId === userHistory.user.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                        userHistory.user.accountStatus === 'ACTIVE'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      <ShieldAlert size={14} />
                      {userHistory.user.accountStatus === 'ACTIVE'
                        ? 'Suspend Account (Revoke Sessions)'
                        : 'Reactivate Account Access'}
                    </button>
                  )}
                </div>

                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import {
  adminTemplateApi,
  adminLinktreeTemplateApi,
  adminSubscriptionApi,
  adminSubscriptionPlanApi,
  adminSessionApi,
  adminUserApi
} from '../../api/adminApiService';
import { adminLinktreeApi } from '../../api/portfolioApiService';
import { CLOUDFLARE_R2_PUBLIC_URL } from '../../config/api';
import {
  Crown,
  Layers,
  CreditCard,
  ShieldCheck,
  Package,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Laptop,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  Users,
  Palette,
  Link2
} from 'lucide-react';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalTemplates: 0,
    activeTemplates: 0,
    premiumTemplates: 0,
    freeTemplates: 0,
    totalSubscriptions: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    totalPlans: 0,
    activePlans: 0,
    activeSessionsCount: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalLinktreeTemplates: 0,
    activeLinktreeTemplates: 0,
    totalLinktreeLinks: 0,
    totalLinktreeClicks: 0,
    loading: true,
    error: null,
  });

  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      const [
        templatesRes,
        subscriptionsRes,
        plansRes,
        sessionsRes,
        usersRes,
        linktreeTemplatesRes,
        linktreeStatsRes
      ] = await Promise.allSettled([
        adminTemplateApi.getAll(),
        adminSubscriptionApi.getAll(),
        adminSubscriptionPlanApi.getAll(),
        adminSessionApi.getActiveSessions(),
        adminUserApi.getStats(),
        adminLinktreeTemplateApi.getAll({ size: 100 }),
        adminLinktreeApi.getStats()
      ]);

      // 1. Templates Data
      const templates = templatesRes.status === 'fulfilled'
        ? (templatesRes.value.data?.data || templatesRes.value.data || [])
        : [];
      const activeTemplates = templates.filter(t => t.isActive).length;
      const premiumTemplates = templates.filter(t => t.isPremium).length;
      const freeTemplates = templates.filter(t => !t.isPremium).length;

      // 2. Subscriptions Data
      const subscriptions = subscriptionsRes.status === 'fulfilled'
        ? (subscriptionsRes.value.data?.data || subscriptionsRes.value.data || [])
        : [];
      const activeSubscribers = subscriptions.filter(
        s => s.isCurrentlyActive || s.status === 'ACTIVE'
      ).length;
      const totalRevenue = subscriptions.reduce(
        (sum, s) => sum + (s.amountPaid ? Number(s.amountPaid) : 0),
        0
      );

      // Latest 5 subscriptions
      const recentSubs = [...subscriptions]
        .sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0))
        .slice(0, 5);

      // 3. Subscription Plans Data
      const plans = plansRes.status === 'fulfilled'
        ? (plansRes.value.data?.data || plansRes.value.data || [])
        : [];
      const activePlans = plans.filter(p => p.isActive).length;

      // 4. Admin Sessions Data
      const sessions = sessionsRes.status === 'fulfilled'
        ? (sessionsRes.value.data?.data || sessionsRes.value.data || [])
        : [];

      // 5. User Stats Data
      const userStats = usersRes.status === 'fulfilled'
        ? (usersRes.value.data?.data || usersRes.value.data || {})
        : {};

      // 6. Linktree Templates Data
      const linktreeTemplates = linktreeTemplatesRes.status === 'fulfilled'
        ? (linktreeTemplatesRes.value.data?.content || linktreeTemplatesRes.value.data || [])
        : [];
      const activeLinktreeTemplates = Array.isArray(linktreeTemplates)
        ? linktreeTemplates.filter(t => t.isActive).length
        : 0;

      // 7. Linktree Links & Clicks Data
      const linktreeStats = linktreeStatsRes.status === 'fulfilled'
        ? (linktreeStatsRes.value.data || {})
        : {};

      setStats({
        totalTemplates: templates.length,
        activeTemplates,
        premiumTemplates,
        freeTemplates,
        totalSubscriptions: subscriptions.length,
        activeSubscribers,
        totalRevenue,
        totalPlans: plans.length,
        activePlans,
        activeSessionsCount: sessions.length,
        totalUsers: userStats.totalUsers || 0,
        activeUsers: userStats.activeUsers || 0,
        totalLinktreeTemplates: Array.isArray(linktreeTemplates) ? linktreeTemplates.length : 0,
        activeLinktreeTemplates,
        totalLinktreeLinks: linktreeStats.totalLinks || 0,
        totalLinktreeClicks: linktreeStats.totalClicks || 0,
        loading: false,
        error: null,
      });

      setRecentSubscriptions(recentSubs);
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load live dashboard statistics. Please verify server connectivity.',
      }));
    } finally {
      setRefreshing(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to revoke this admin session?")) return;
    try {
      await adminSessionApi.revokeSession(sessionId);
      toast.success("Admin session revoked successfully.");
      setActiveSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    } catch (err) {
      console.error("Failed to revoke session:", err);
      toast.error(err.response?.data?.message || "Failed to revoke session.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (stats.loading) {
    return (
      <DashboardLayout pageTitle="Dashboard Overview">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10 mb-4 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="text-slate-600 font-semibold text-sm">Syncing platform administration metrics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Dashboard Overview">
      <div className="space-y-6 text-left">
        
        {/* Welcome & Refresh Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Platform Metrics
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time monitoring of subscription revenue, portfolio layouts, active plans, and admin sessions.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 text-xs transition-all active:scale-95 cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {stats.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold">{stats.error}</p>
          </div>
        )}

        {/* Top 5 KPI Cards (Matching User Dashboard Palette) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Platform Revenue */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
                  Razorpay
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-100">Total Revenue</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight">
                {formatCurrency(stats.totalRevenue)}
              </h3>
            </div>
            <p className="text-[11px] text-emerald-100/90 mt-3 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.totalSubscriptions} recorded orders</span>
            </p>
          </div>

          {/* Card 2: Active Subscribers */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-md shadow-slate-900/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-emerald-400">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Pro Users
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400">Active Subscribers</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight text-white">
                {stats.activeSubscribers}
              </h3>
            </div>
            <p className="text-[11px] text-emerald-400 mt-3 font-semibold">
              {stats.totalSubscriptions > 0
                ? `${Math.round((stats.activeSubscribers / stats.totalSubscriptions) * 100)}% active rate`
                : 'No subscribers yet'}
            </p>
          </div>

          {/* Card 3: Templates Catalog */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                  Catalog
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">Portfolio Templates</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight text-slate-800">
                {stats.totalTemplates}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-medium">
              <span className="text-emerald-600 font-bold">{stats.activeTemplates} active</span> · {stats.premiumTemplates} Pro
            </p>
          </div>

          {/* Card 4: Subscription Plans */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wider">
                  Tiers
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">Subscription Plans</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight text-slate-800">
                {stats.totalPlans}
              </h3>
            </div>
            <p className="text-[11px] text-teal-600 font-bold mt-3">
              {stats.activePlans} available at checkout
            </p>
          </div>

          {/* Card 5: Admin Device Sessions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                  Security
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">Admin Sessions</p>
              <h3 className="text-2xl font-black mt-1 tracking-tight text-slate-800">
                {stats.activeSessionsCount}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-medium">
              Authenticated device logins
            </p>
          </div>

        </div>

        {/* Quick Management Shortcuts (Same layout style as user dashboard widgets) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin-users"
            className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                  User Accounts & Audit
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track {stats.totalUsers} creators, sessions & status
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin-subscriptions"
            className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                  Subscription Governance
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage tiers, pricing, and manual access grants
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin-templates"
            className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                  Portfolio Templates
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publish layout designs ({stats.totalTemplates} templates)
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin-linktree-templates"
            className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                  Linktree Bio Templates
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Design & manage {stats.totalLinktreeTemplates} mobile layouts
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin-linktree"
            className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                  Linktree Links & Clicks
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Moderate {stats.totalLinktreeLinks} bio links & {stats.totalLinktreeClicks} clicks
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin-payments"
            className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm">
                  Payments & Invoices
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit Razorpay orders, payments, and cancellations
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Detailed Sections: Recent Subscriptions & Active Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Subscriptions (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Recent User Subscriptions</h3>
                <p className="text-xs text-slate-400 mt-0.5">Live platform checkout orders</p>
              </div>
              <Link
                to="/admin-subscriptions"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
              >
                <span>View all</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentSubscriptions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200/60 rounded-xl">
                <Crown className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No subscriptions recorded</p>
                <p className="text-xs text-slate-400 mt-1">Users checking out with Razorpay will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Subscriber</th>
                      <th className="pb-3">Plan Name</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Razorpay Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {recentSubscriptions.map((sub) => {
                      const isActive = sub.isCurrentlyActive || sub.status === 'ACTIVE';
                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="relative flex-shrink-0 w-8 h-8 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                {sub.userAvatarUrl ? (
                                  <img
                                    src={
                                      sub.userAvatarUrl.startsWith('http')
                                        ? sub.userAvatarUrl
                                        : `${CLOUDFLARE_R2_PUBLIC_URL}/${sub.userAvatarUrl.replace(/^\//, '')}`
                                    }
                                    alt={sub.userFullName || "User"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div
                                  style={{ display: sub.userAvatarUrl ? 'none' : 'flex' }}
                                  className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold items-center justify-center text-[11px]"
                                >
                                  {(sub.userFullName || sub.userEmail || 'U').charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-800 truncate text-xs">{sub.userFullName || "User"}</div>
                                <div className="text-[10px] text-slate-400 truncate font-mono">{sub.userEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-slate-800">{sub.planName || 'Pro Plan'}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-mono">{sub.billingCycle}</div>
                          </td>
                          <td className="py-3 font-bold text-slate-900">
                            ₹{sub.amountPaid ? Number(sub.amountPaid).toLocaleString() : '0'}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                            }`}>
                              {isActive ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                              <span>{sub.status || 'INACTIVE'}</span>
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 font-medium">
                            {formatDate(sub.createdAt || sub.startDate)}
                          </td>
                          <td className="py-3 text-right font-mono text-[11px] text-slate-400">
                            {sub.razorpayPaymentId || sub.razorpayOrderId || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Admin Device Sessions (1 Col) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Admin Sessions</h3>
                <p className="text-xs text-slate-400 mt-0.5">Active logged-in devices</p>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                {activeSessions.length} Active
              </span>
            </div>

            {activeSessions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <Laptop className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No session data available</p>
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
                {activeSessions.map((s) => (
                  <div
                    key={s.sessionId}
                    className="p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{s.deviceName || 'Admin Terminal'}</span>
                      </div>
                      {s.isCurrentSession && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
                          This Device
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 space-y-0.5 text-[11px]">
                      <p>OS: <span className="text-slate-700 font-semibold">{s.deviceOs || 'Desktop'}</span> · IP: <span className="font-mono text-slate-700">{s.ipAddress || '127.0.0.1'}</span></p>
                      <p className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>Active: {formatDate(s.lastActiveAt || s.createdAt)}</span>
                      </p>
                    </div>
                    {!s.isCurrentSession && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => handleRevokeSession(s.sessionId)}
                          className="text-[11px] font-bold text-red-600 hover:text-red-800"
                        >
                          Revoke Session
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

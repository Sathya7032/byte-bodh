import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../DashboardLayout';
import { adminLinktreeApi, resolveImageUrl } from '../../api/portfolioApiService';
import { getLinktreeUrl } from '../../config/api';
import { toast } from 'react-toastify';
import {
  Link2,
  Search,
  MousePointer,
  RefreshCw,
  ShieldAlert,
  Star,
  Pin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Copy,
  Check
} from 'lucide-react';

const AdminLinktree = () => {
  const [stats, setStats] = useState({
    totalLinks: 0,
    activeLinks: 0,
    sensitiveLinks: 0,
    featuredLinks: 0,
    totalClicks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Table State
  const [links, setLinks] = useState([]);
  const [topClicked, setTopClicked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const pageSize = 15;

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await adminLinktreeApi.getStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin linktree stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTopClicked = async () => {
    try {
      const res = await adminLinktreeApi.getTopClicked();
      const list = res.data?.data || res.data || [];
      setTopClicked(list.slice(0, 4));
    } catch (err) {
      console.error('Error fetching top clicked links:', err);
    }
  };

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
      };
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await adminLinktreeApi.getAllLinks(params);
      const pageData = res.data;

      if (pageData && pageData.content) {
        setLinks(pageData.content);
        setTotalPages(pageData.totalPages || 1);
        setTotalElements(pageData.totalElements || 0);
      } else {
        setLinks(Array.isArray(pageData) ? pageData : []);
      }
    } catch (err) {
      console.error('Error fetching admin links:', err);
      toast.error('Failed to load links for moderation.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchStats();
    fetchTopClicked();
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchLinks();
  };

  const handleToggleActive = async (link) => {
    try {
      setActionLoadingId(link.id);
      await adminLinktreeApi.toggleActive(link.id);
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isActive: !l.isActive } : l))
      );
      toast.success(`Link status updated for "${link.title}"`);
      fetchStats();
    } catch (err) {
      toast.error('Failed to toggle active status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleSensitive = async (link) => {
    try {
      setActionLoadingId(link.id);
      await adminLinktreeApi.toggleSensitive(link.id);
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isSensitive: !l.isSensitive } : l))
      );
      toast.info(`Updated 18+ sensitive flag for "${link.title}"`);
      fetchStats();
    } catch (err) {
      toast.error('Failed to toggle sensitive flag.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteLink = async (link) => {
    if (!window.confirm(`Are you sure you want to delete the link "${link.title}"? This action is permanent.`)) {
      return;
    }

    try {
      setActionLoadingId(link.id);
      await adminLinktreeApi.deleteLink(link.id);
      setLinks((prev) => prev.filter((l) => l.id !== link.id));
      toast.success('Link deleted successfully.');
      fetchStats();
      fetchTopClicked();
    } catch (err) {
      toast.error('Failed to delete link.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardLayout pageTitle="Linktree Moderation & Analytics">
      <div className="space-y-6">
        {/* ===== STATS OVERVIEW CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Links</p>
              <p className="text-2xl font-black text-slate-800 mt-1">
                {statsLoading ? '...' : stats.totalLinks}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Link2 size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Published</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {statsLoading ? '...' : stats.activeLinks}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">18+ Sensitive</p>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {statsLoading ? '...' : stats.sensitiveLinks}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Featured Hero</p>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {statsLoading ? '...' : stats.featuredLinks}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={20} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Link Clicks</p>
              <p className="text-2xl font-black text-teal-600 mt-1">
                {statsLoading ? '...' : stats.totalClicks}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <MousePointer size={20} />
            </div>
          </div>
        </div>

        {/* ===== TOP CLICKED SPOTLIGHT BAR ===== */}
        {topClicked.length > 0 && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <TrendingUp size={14} /> Top Clicked Bio Links Spotlight
              </span>
              <span className="text-[10px] text-slate-400">Platform Analytics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {topClicked.map((top, idx) => (
                <div
                  key={top.id || idx}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2.5 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-emerald-400">#{idx + 1}</span>
                      <h5 className="font-bold text-xs text-white truncate">{top.title}</h5>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      by @{top.userUsername || 'creator'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                      {top.clickCount || 0} clicks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SEARCH & FILTER BAR ===== */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, url, creator name, @username, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                fetchStats();
                fetchLinks();
                fetchTopClicked();
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ===== MODERATION TABLE ===== */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Creator / Owner</th>
                  <th className="py-3.5 px-4">Link Details</th>
                  <th className="py-3.5 px-4">Type & Platform</th>
                  <th className="py-3.5 px-4">Attributes</th>
                  <th className="py-3.5 px-4 text-center">Clicks</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      Loading links for moderation...
                    </td>
                  </tr>
                ) : links.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No links found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  links.map((link) => {
                    const resolvedThumb = link.thumbnailUrl
                      ? resolveImageUrl(link.thumbnailUrl)
                      : null;

                    return (
                      <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Creator Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs shrink-0">
                              {link.userFullName ? link.userFullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">
                                {link.userFullName || 'Anonymous User'}
                              </p>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <a
                                  href={getLinktreeUrl(link.userUsername)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-600 hover:underline font-mono"
                                >
                                  @{link.userUsername || 'user'}
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Link Details */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-start gap-2.5">
                            {resolvedThumb ? (
                              <img
                                src={resolvedThumb}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                <Link2 size={14} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-800 truncate">{link.title}</p>
                              {link.subtitle && (
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {link.subtitle}
                                </p>
                              )}
                              {link.url && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-slate-400 hover:text-emerald-600 truncate font-mono block max-w-[200px]"
                                  >
                                    {link.url}
                                  </a>
                                  <button
                                    onClick={() => copyToClipboard(link.url, link.id)}
                                    className="text-slate-400 hover:text-slate-600"
                                    title="Copy URL"
                                  >
                                    {copiedId === link.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type & Platform */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                              {link.type || 'CLASSIC'}
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {link.platform || 'CUSTOM'}
                            </p>
                          </div>
                        </td>

                        {/* Badges / Flags */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1 max-w-[160px]">
                            {link.isActive ? (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[9px]">
                                Active
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[9px]">
                                Inactive
                              </span>
                            )}

                            {link.isPinned && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[9px] flex items-center gap-0.5">
                                <Pin size={8} /> Pinned
                              </span>
                            )}

                            {link.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[9px] flex items-center gap-0.5">
                                <Star size={8} /> Hero
                              </span>
                            )}

                            {link.isSensitive && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[9px] flex items-center gap-0.5">
                                <ShieldAlert size={8} /> 18+
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Clicks */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                            {link.clickCount || 0}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Active Button */}
                            <button
                              disabled={actionLoadingId === link.id}
                              onClick={() => handleToggleActive(link)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                link.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                              title={link.isActive ? 'Deactivate Link' : 'Activate Link'}
                            >
                              {link.isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                            </button>

                            {/* Toggle Sensitive Flag */}
                            <button
                              disabled={actionLoadingId === link.id}
                              onClick={() => handleToggleSensitive(link)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                link.isSensitive
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                              title={link.isSensitive ? 'Remove 18+ Warning' : 'Mark as 18+ Sensitive'}
                            >
                              <ShieldAlert size={13} />
                            </button>

                            {/* Delete Link */}
                            <button
                              disabled={actionLoadingId === link.id}
                              onClick={() => handleDeleteLink(link)}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                              title="Delete Link"
                            >
                              <Trash2 size={13} />
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
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {links.length} of {totalElements} bio links
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-bold px-2">
                Page {page + 1} of {totalPages || 1}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLinktree;

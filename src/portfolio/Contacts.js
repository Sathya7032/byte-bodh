import React, { useEffect, useState } from "react";
import { getContactMessages, deleteContactMessage, markContactMessageAsRead } from "../api/profileService";
import DashboardLayout from "./components/DashboardLayout";
import SubscriptionRequiredNotice from "./components/SubscriptionRequiredNotice";
import { Mail, MessageSquare, AlertCircle, Trash2, RefreshCw, Clock, Phone, Send } from "lucide-react";
import { toast } from "react-toastify";

const Contacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    setSubscriptionRequired(false);
    try {
      const response = await getContactMessages();
      setMessages(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (err) {
      if (err.response?.status === 402) {
        setSubscriptionRequired(true);
        setSubscriptionMessage(err.response?.data?.message || "");
      } else {
        setError("Failed to load contact messages. Please check your connection or try again.");
      }
      console.error("Fetch contact messages error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setDeletingId(id);
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted successfully");
    } catch (err) {
      console.error("Failed to delete message:", err);
      toast.error(err.response?.data?.message || "Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markContactMessageAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true, read: true, status: "READ" } : m))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead && !m.read).length;

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 text-left">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">Contact Messages</h1>
                {unreadCount > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Review and manage message submissions from visitors on your public portfolio.
              </p>
            </div>
          </div>

          <button
            onClick={fetchMessages}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-20 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-bold">Loading message submissions...</p>
        </div>
      )}

      {/* Subscription Required State */}
      {!loading && subscriptionRequired && (
        <SubscriptionRequiredNotice message={subscriptionMessage} title="Subscribe to view your contact messages" />
      )}

      {/* Error State */}
      {error && !subscriptionRequired && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-6 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-650 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800">Connection Error</h4>
              <p className="text-xs text-red-650 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !subscriptionRequired && messages.length === 0 && !error && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm text-left flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
            📩
          </div>
          <h3 className="text-lg font-black text-slate-800">No messages yet</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm text-center leading-relaxed">
            When recruiters, employers, or visitors send an inquiry via your public portfolio contact form, their message will appear here.
          </p>
        </div>
      )}

      {/* Messages Showcase */}
      {!loading && messages.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-left">
          {/* Header Stats */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Inbox Submission Feed</h2>
              <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                {messages.length} {messages.length === 1 ? "submission" : "submissions"} received
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/30 text-slate-400">
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 text-left text-[10px] font-bold uppercase tracking-wider w-[280px]">
                    Sender Information
                  </th>
                  <th className="py-4 px-6 text-left text-[10px] font-bold uppercase tracking-wider">
                    Message Details
                  </th>
                  <th className="py-4 px-6 text-right text-[10px] font-bold uppercase tracking-wider w-[160px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => {
                  const isUnread = !msg.isRead && !msg.read;
                  return (
                    <tr
                      key={msg.id}
                      onClick={() => isUnread && handleMarkAsRead(msg.id)}
                      className={`hover:bg-slate-50/40 transition-colors ${
                        isUnread ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      <td className="py-5 px-6 align-top">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isUnread
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {getInitials(msg.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-bold text-slate-800 truncate">{msg.name}</p>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="New unread message" />
                              )}
                            </div>
                            {msg.email && (
                              <a
                                href={`mailto:${msg.email}?subject=Re: Inquiry from Portfolio`}
                                className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-1 font-semibold truncate"
                              >
                                <Mail size={11} /> {msg.email}
                              </a>
                            )}
                            {msg.phone && (
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium truncate">
                                <Phone size={10} /> {msg.phone}
                              </p>
                            )}
                            {msg.createdAt && (
                              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5 font-medium">
                                <Clock size={10} /> {formatDate(msg.createdAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 align-top">
                        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 max-w-2xl">
                          {msg.subject && (
                            <h5 className="font-bold text-slate-800 text-xs mb-1.5">
                              {msg.subject}
                            </h5>
                          )}
                          <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                      </td>
                      <td className="py-5 px-6 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          {msg.email && (
                            <a
                              href={`mailto:${msg.email}?subject=Re: Inquiry from Portfolio`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                              title="Reply via Email"
                            >
                              <Send size={11} /> Reply
                            </a>
                          )}
                          <button
                            onClick={(e) => handleDelete(msg.id, e)}
                            disabled={deletingId === msg.id}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                            title="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Deck View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {messages.map((msg) => {
              const isUnread = !msg.isRead && !msg.read;
              return (
                <div
                  key={msg.id}
                  onClick={() => isUnread && handleMarkAsRead(msg.id)}
                  className={`p-5 space-y-4 ${isUnread ? "bg-emerald-50/20" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isUnread
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {getInitials(msg.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-800">{msg.name}</p>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        {msg.email && (
                          <a
                            href={`mailto:${msg.email}?subject=Re: Inquiry from Portfolio`}
                            className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-0.5 font-semibold"
                          >
                            <Mail size={11} /> {msg.email}
                          </a>
                        )}
                        {msg.phone && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                            <Phone size={10} /> {msg.phone}
                          </p>
                        )}
                        {msg.createdAt && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                            <Clock size={10} /> {formatDate(msg.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(msg.id, e)}
                      disabled={deletingId === msg.id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                    {msg.subject && (
                      <h5 className="font-bold text-slate-800 text-xs mb-1.5">
                        {msg.subject}
                      </h5>
                    )}
                    <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  {msg.email && (
                    <div className="flex justify-end pt-1">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Inquiry from Portfolio`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-all"
                      >
                        <Send size={11} /> Reply via Email
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 text-right">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
              Showing {messages.length} of {messages.length} items
            </span>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Contacts;

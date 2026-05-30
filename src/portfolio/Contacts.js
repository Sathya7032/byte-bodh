import React, { useEffect, useState } from "react";
import { getContactMessages } from "../api/profileService";
import DashboardLayout from "./components/DashboardLayout";
import { Mail, MessageSquare, AlertCircle } from "lucide-react";

const Contacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await getContactMessages();
      setMessages(response.data?.data || []);
    } catch (err) {
      setError("Failed to load contact messages");
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 text-left">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-[#6C63FF]/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-[#6C63FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Contact Messages</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Review and manage message submissions from visitors on your public portfolio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-20 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#6C63FF] border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-bold">Loading message submissions...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-6 flex items-center gap-3 text-left">
          <AlertCircle className="w-6 h-6 text-red-650 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-red-800">Connection Error</h4>
            <p className="text-xs text-red-650 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && messages.length === 0 && !error && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm text-left flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
            📩
          </div>
          <h3 className="text-lg font-black text-slate-800">No messages yet</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm text-center">
            When employers or visitors send a message via your public portfolio contact form, they will display here.
          </p>
        </div>
      )}

      {/* Messages Showcase */}
      {!loading && messages.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden text-left">
          {/* Header Stats */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800 text-sm">Inbox Submission Feed</h2>
            <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
              {messages.length} {messages.length === 1 ? 'submission' : 'submissions'} received
            </p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-[#6C63FF] border border-indigo-100 rounded-xl flex items-center justify-center font-bold text-xs">
                          {getInitials(msg.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{msg.name}</p>
                          <a 
                            href={`mailto:${msg.email}`}
                            className="text-xs text-[#6C63FF] hover:underline flex items-center gap-1 mt-1 font-semibold truncate"
                          >
                            <Mail size={11} /> {msg.email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 max-w-2xl">
                        <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Deck View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg.id} className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-[#6C63FF] border border-indigo-100 rounded-xl flex items-center justify-center font-bold text-xs">
                    {getInitials(msg.name)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{msg.name}</p>
                    <a 
                      href={`mailto:${msg.email}`}
                      className="text-xs text-[#6C63FF] hover:underline flex items-center gap-1 mt-0.5 font-semibold"
                    >
                      <Mail size={11} /> {msg.email}
                    </a>
                  </div>
                </div>
                <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                  <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
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
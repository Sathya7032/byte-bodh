// pages/Contacts.jsx
import React, { useEffect, useState } from "react";
import { getContactMessages } from "../api/profileService";
import DashboardLayout from "./components/DashboardLayout";

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
      setMessages(response.data.data); // ApiResponse → data
    } catch (err) {
      setError("Failed to load contact messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Messages</h1>
        <p className="text-gray-600">View and manage all incoming contact form submissions</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && messages.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No contact messages found.</p>
        </div>
      )}

      {/* Messages Table */}
      {!loading && messages.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header with Stats */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">All Messages</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'} total
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Message Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Name</p>
                          <p className="text-gray-700 mt-1">{msg.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <a 
                            href={`mailto:${msg.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {msg.email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Message Content</p>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {messages.length} {messages.length === 1 ? 'entry' : 'entries'}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Contacts;
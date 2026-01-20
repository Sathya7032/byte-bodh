import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  Briefcase,
  Calendar,
  Badge3d,
} from "react-bootstrap-icons";
import DashboardLayout from "../DashboardLayout";
import {
  getJobNotifications,
  deleteJobNotification,
} from "../../api/jobNotifications";
import { Edit, MapPin } from "lucide-react";

const JobNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getJobNotifications();
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch job notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job notification?")) return;
    try {
      await deleteJobNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete job notification:", error);
      alert("Failed to delete notification");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/job-notifications/${id}/edit`);
  };

  const handleView = (id) => {
    navigate(`/admin/job-notifications/${id}`);
  };

  const filteredNotifications = notifications.filter((job) => {
    const matchesSearch =
      job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "active") return matchesSearch && job.isActive;
    if (filterStatus === "inactive") return matchesSearch && !job.isActive;
    return matchesSearch;
  });

  const isDeadlineExpired = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout pageTitle="Job Notifications">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Notifications</h1>
            <p className="text-gray-600 mt-1">Manage and post job opportunities</p>
          </div>
          <button
            onClick={() => navigate("/admin/job-notifications/create")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            <Plus size={20} />
            Create Job
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {notifications.filter((j) => j.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-red-600">
              {notifications.filter((j) => !j.isActive).length}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <Briefcase size={48} className="mb-3 opacity-50" />
              <p className="text-lg">No job notifications found</p>
              <p className="text-sm">Try creating one or adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {job.jobTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            Exp: {job.experienceRequired || 0} years
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-800 font-medium">{job.companyName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-700">
                          <MapPin size={16} />
                          {job.location || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {job.employmentType || "Full-Time"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-1 ${
                            isDeadlineExpired(job.applicationDeadline)
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          <Calendar size={16} />
                          {formatDate(job.applicationDeadline)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {job.isActive ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                            <Badge3d size={14} />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit">
                            <Badge3d size={14} />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(job.id)}
                            title="View Details"
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(job.id)}
                            title="Edit"
                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            title="Delete"
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobNotifications;

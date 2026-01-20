import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trash2,
} from "react-bootstrap-icons";
import DashboardLayout from "../DashboardLayout";
import {
  getJobNotificationById,
  deleteJobNotification,
} from "../../api/jobNotifications";
import { Edit } from "lucide-react";

const JobNotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobNotification();
  }, [id]);

  const fetchJobNotification = async () => {
    setLoading(true);
    try {
      const res = await getJobNotificationById(id);
      setJob(res.data.data);
    } catch (error) {
      console.error("Failed to fetch job notification:", error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job notification?"))
      return;
    try {
      await deleteJobNotification(id);
      navigate("/admin/job-notifications");
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete job notification");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDeadlineExpired = (deadline) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Job Detail">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout pageTitle="Job Detail">
        <div className="p-6 text-center">
          <p className="text-gray-600 text-lg">Job not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Job Detail">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/job-notifications")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Job Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {job.jobTitle}
                  </h2>
                  <p className="text-xl text-gray-600 mt-2">{job.companyName}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    job.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Employment Type</p>
                  <p className="font-semibold text-gray-800">
                    {job.employmentType || "Full-Time"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-800">
                    {job.experienceRequired || 0} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800">
                    {job.location || "Remote"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posted On</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Job Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {job.jobDescription}
              </p>
            </div>

            {/* Skills */}
            {job.requiredSkills && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.split(",").map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Requirements
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {job.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/admin/job-notifications/${id}/edit`)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Edit size={18} />
                  Edit Job
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <Trash2 size={18} />
                  Delete Job
                </button>
              </div>
            </div>

            {/* Deadline Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={20} />
                Deadline
              </h3>
              <p
                className={`text-2xl font-bold ${
                  isDeadlineExpired(job.applicationDeadline)
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {formatDate(job.applicationDeadline)}
              </p>
              {isDeadlineExpired(job.applicationDeadline) && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <Clock size={16} />
                  This deadline has expired
                </p>
              )}
            </div>

            {/* Job Link */}
            {job.jobLink && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-3">Job Link</h3>
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all text-sm"
                >
                  {job.jobLink}
                </a>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mt-6">
              <p className="text-sm text-blue-800">
                <strong>ID:</strong> {job.id}
              </p>
              <p className="text-sm text-blue-800 mt-2">
                <strong>Created:</strong> {formatDate(job.createdAt)}
              </p>
              {job.updatedAt && (
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Last Updated:</strong> {formatDate(job.updatedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobNotificationDetail;

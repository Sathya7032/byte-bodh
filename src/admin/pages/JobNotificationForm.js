import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "react-bootstrap-icons";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import DashboardLayout from "../DashboardLayout";
import {
  getJobNotificationById,
  createJobNotification,
  updateJobNotification,
} from "../../api/jobNotifications";


const JobNotificationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    jobLink: "",
    requiredSkills: "",
    requirements: "",
    location: "",
    employmentType: "Full-Time",
    experienceRequired: 0,
    applicationDeadline: "",
    isActive: true,
  });

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [hasSetInitialContent, setHasSetInitialContent] = useState(false);

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header", "font", "size",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "script",
    "list", "bullet", "indent",
    "link", "image", "video", "align",
    "blockquote", "code-block"
  ];

  const { quillRef: descriptionQuillRef, quill: descriptionQuill } = useQuill({ 
    theme: "snow", 
    modules, 
    formats, 
    placeholder: "Write job description here..." 
  });

  const { quillRef: requirementsQuillRef, quill: requirementsQuill } = useQuill({ 
    theme: "snow", 
    modules, 
    formats, 
    placeholder: "Write requirements here..." 
  });

  // Handle description editor content changes
  useEffect(() => {
    if (descriptionQuill) {
      const handleTextChange = () => {
        const content = descriptionQuill.root.innerHTML;
        setFormData(prev => ({
          ...prev,
          jobDescription: content,
        }));
      };

      descriptionQuill.on("text-change", handleTextChange);

      return () => {
        descriptionQuill.off("text-change", handleTextChange);
      };
    }
  }, [descriptionQuill]);

  // Handle requirements editor content changes
  useEffect(() => {
    if (requirementsQuill) {
      const handleTextChange = () => {
        const content = requirementsQuill.root.innerHTML;
        setFormData(prev => ({
          ...prev,
          requirements: content,
        }));
      };

      requirementsQuill.on("text-change", handleTextChange);

      return () => {
        requirementsQuill.off("text-change", handleTextChange);
      };
    }
  }, [requirementsQuill]);

  const fetchJobNotification = useCallback(async () => {
    setLoading(true);
    setHasSetInitialContent(false);
    try {
      const res = await getJobNotificationById(id);
      const job = res.data.data;
      setFormData({
        ...job,
        applicationDeadline: job.applicationDeadline
          ? new Date(job.applicationDeadline).toISOString().split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Failed to fetch job notification:", error);
      setError("Failed to load job notification");
    }
    setLoading(false);
  }, [id]);

  // Fetch job notification if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchJobNotification();
    }
  }, [isEditMode, fetchJobNotification]);

  // Set initial content in description editor when data is loaded
  useEffect(() => {
    if (descriptionQuill && formData.jobDescription && !hasSetInitialContent && isEditMode) {
      descriptionQuill.clipboard.dangerouslyPasteHTML(formData.jobDescription);
      setHasSetInitialContent(true);
    }
  }, [descriptionQuill, formData.jobDescription, hasSetInitialContent, isEditMode]);

  // Set initial content in requirements editor when data is loaded
  useEffect(() => {
    if (requirementsQuill && formData.requirements && !hasSetInitialContent && isEditMode) {
      requirementsQuill.clipboard.dangerouslyPasteHTML(formData.requirements);
    }
  }, [requirementsQuill, formData.requirements, hasSetInitialContent, isEditMode]);

  // Initialize skills from formData when fetched
  useEffect(() => {
    if (formData.requiredSkills) {
      const skillsArray = typeof formData.requiredSkills === 'string'
        ? formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
        : [];
      setSkills(skillsArray);
    }
  }, [formData.requiredSkills, isEditMode]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      setFormData(prev => ({
        ...prev,
        requiredSkills: newSkills.join(', ')
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    setFormData(prev => ({
      ...prev,
      requiredSkills: newSkills.join(', ')
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Convert date to ISO datetime format (set time to 23:59:59 for deadline)
      let applicationDeadline = null;
      if (formData.applicationDeadline) {
        const date = new Date(formData.applicationDeadline);
        date.setHours(23, 59, 59, 0); // Set to end of day
        applicationDeadline = date.toISOString();
      }

      const submitData = {
        ...formData,
        applicationDeadline,
        experienceRequired: parseInt(formData.experienceRequired, 10),
      };

      if (isEditMode) {
        await updateJobNotification(id, submitData);
        setSuccess("Job notification updated successfully!");
      } else {
        await createJobNotification(submitData);
        setSuccess("Job notification created successfully!");
      }

      setTimeout(() => {
        navigate("/admin/job-notifications");
      }, 1500);
    } catch (error) {
      console.error("Failed to submit form:", error);
      setError(
        error.response?.data?.message || "Failed to save job notification"
      );
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle={isEditMode ? "Edit Job" : "Create Job"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={isEditMode ? "Edit Job" : "Create Job"}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/admin/job-notifications")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditMode ? "Edit Job Notification" : "Create New Job Notification"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update the job notification details below"
                : "Fill in the job details to create a new notification"}
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                placeholder="e.g., Senior React Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="e.g., TechCorp Inc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, India"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            {/* Experience Required */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Required (years)
              </label>
              <input
                type="number"
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                min="0"
                placeholder="e.g., 3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Job Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Link
              </label>
              <input
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                placeholder="e.g., https://example.com/jobs/123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Job Description */}
            <div className="md:col-span-2 mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <div ref={descriptionQuillRef} className="bg-white rounded-lg border border-gray-300 h-48" />
              <p className="text-xs text-gray-500 mt-2">Use the editor to format your job description with rich text options</p>
            </div>

            {/* Required Skills */}
            <div className="md:col-span-2 mt-10">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="Type a skill and press Enter or click Add"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-300">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirements
              </label>
              <div ref={requirementsQuillRef} className="bg-white rounded-lg border border-gray-300 h-48" />
              <p className="text-xs text-gray-500 mt-2">Use the editor to format your requirements with rich text options</p>
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Mark as Active
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Active jobs will be visible to students
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/job-notifications")}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : isEditMode ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default JobNotificationForm;

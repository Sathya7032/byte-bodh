import React, { useEffect, useState } from "react";
import DashboardLayout from "../portfolio/components/DashboardLayout";
import {
  getMyProfile,
  updateProfile,
} from "../api/profileService";
import { toast } from "react-toastify";
import {
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaHistory,
  FaProjectDiagram,
  FaTools,
  FaLink,
  FaSave,
  FaEye,
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaCheck,
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaExternalLinkAlt,
  FaCamera,
  FaUserCircle,
  FaCertificate
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { motion } from "framer-motion";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    mobileNumber: "",
    username: "",
    email: "",
    headline: "",
    summary: "",
    isFresher: false,
    skills: [],
    education: [],
    experience: [],
    projects: [],
    socialMediaLinks: [],
    certifications: [],
    pictureUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [tempItem, setTempItem] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [previewUrl, setPreviewUrl] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  

  const defaultEducation = {
    degree: "",
    fieldOfStudy: "",
    institution: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    cgpa: ""
  };

  const defaultExperience = {
    jobTitle: "",
    company: "",
    location: "",
    startMonth: new Date().getMonth() + 1,
    startYear: new Date().getFullYear(),
    endMonth: "",
    endYear: "",
    currentlyWorking: false,
    description: ""
  };

  const defaultProject = {
    title: "",
    techStack: "",
    projectUrl: "",
    description: ""
  };

  const defaultSocialLink = {
    platform: "LINKEDIN",
    profileUrl: ""
  };

  const defaultCertification = {
    name: "",
    startDate: "",
    endDate: "",
    description: ""
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: <FaUser className="w-4 h-4" /> },
    { id: "professional", label: "Professional", icon: <FaBriefcase className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <FaGraduationCap className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <FaHistory className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram className="w-4 h-4" /> },
    { id: "skills", label: "Skills", icon: <FaTools className="w-4 h-4" /> },
    { id: "social", label: "Social", icon: <FaLink className="w-4 h-4" /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate className="w-4 h-4" /> }
  ];

  const socialPlatforms = [
    { value: "LINKEDIN", label: "LinkedIn", icon: <FaLinkedin />, color: "text-blue-700" },
    { value: "GITHUB", label: "GitHub", icon: <FaGithub />, color: "text-gray-900" },
    { value: "LEETCODE", label: "LeetCode", icon: <SiLeetcode />, color: "text-orange-500" },
    { value: "PORTFOLIO", label: "Portfolio", icon: <FaGlobe />, color: "text-green-600" }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile.username) {
      const url = `${window.location.origin}/portfolio/${profile.username}`;
      setPreviewUrl(url);
    }
  }, [profile.username]);

  const fetchProfile = async () => {
    try {
      const response = await getMyProfile();
      const data = response.data || {};
      setProfile({
        fullName: data.fullName || "",
        mobileNumber: data.mobileNumber || "",
        username: data.user?.username || "",
        email: data.email || "",
        headline: data.headline || "",
        summary: data.summary || "",
        isFresher: data.isFresher !== undefined ? data.isFresher : false,
        skills: data.skills || [],
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        socialMediaLinks: data.socialMediaLinks || [],
        certifications: data.certifications || [],
        pictureUrl: data.pictureUrl || ""
      });
      
      if (data.pictureUrl) {
        setImagePreview(data.pictureUrl);
      }
      
      if (data.id) {
        setProfile(prev => ({ ...prev, id: data.id }));
      }
    } catch (err) {
      console.log(err);
      setError("Profile not created yet. Please fill in your details below.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.match('image/jpeg|image/jpg|image/png|image/gif')) {
        toast.error("Only JPG, PNG, and GIF images are allowed");
        return;
      }
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    const formData = new FormData();

    const payload = {
      fullName: profile.fullName,
      mobileNumber: profile.mobileNumber,
      email: profile.email,
      headline: profile.headline,
      summary: profile.summary,
      isFresher: profile.isFresher,
      skills: profile.skills,
      education: profile.education,
      experience: profile.experience,
      projects: profile.projects,
      socialMediaLinks: profile.socialMediaLinks,
      certifications: profile.certifications,
    };

    // ✅ MUST be Blob
    formData.append(
      "profile",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const res = await updateProfile(formData);

      toast.success("Profile updated successfully");

      setProfile((prev) => ({ ...prev, ...res.data }));

      if (res.data.pictureUrl) {
        setImagePreview(res.data.pictureUrl);
        setProfileImage(null);
      }
    } catch (err) {
      toast.error("Failed to save profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleAddCertification = () => {
    setEditingSection("certification");
    setTempItem(defaultCertification);
  };

  const handleSaveCertification = () => {
    if (!tempItem.name) {
      toast.error("Certification name is required");
      return;
    }

    const updatedCertifications = [...profile.certifications, tempItem];
    setProfile({ ...profile, certifications: updatedCertifications });
    setEditingSection(null);
    setTempItem({});
    toast.success("Certification added successfully");
  };

  const handleEditCertification = (index) => {
    setEditingSection(`certification-${index}`);
    setTempItem(profile.certifications[index]);
  };

  const handleUpdateCertification = (index) => {
    const updatedCertifications = [...profile.certifications];
    updatedCertifications[index] = tempItem;
    setProfile({ ...profile, certifications: updatedCertifications });
    setEditingSection(null);
    setTempItem({});
    toast.success("Certification updated successfully");
  };

  const handleRemoveCertification = (index) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      const updatedCertifications = profile.certifications.filter((_, i) => i !== index);
      setProfile({ ...profile, certifications: updatedCertifications });
      toast.success("Certification removed successfully");
    }
  };

  const handleAddEducation = () => {
    setEditingSection("education");
    setTempItem(defaultEducation);
  };

  const handleSaveEducation = () => {
    if (!tempItem.degree || !tempItem.institution) {
      toast.error("Degree and Institution are required");
      return;
    }

    const updatedEducation = [...profile.education, tempItem];
    setProfile({ ...profile, education: updatedEducation });
    setEditingSection(null);
    setTempItem({});
    toast.success("Education added successfully");
  };

  const handleEditEducation = (index) => {
    setEditingSection(`education-${index}`);
    setTempItem(profile.education[index]);
  };

  const handleUpdateEducation = (index) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = tempItem;
    setProfile({ ...profile, education: updatedEducation });
    setEditingSection(null);
    setTempItem({});
    toast.success("Education updated successfully");
  };

  const handleRemoveEducation = (index) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      const updatedEducation = profile.education.filter((_, i) => i !== index);
      setProfile({ ...profile, education: updatedEducation });
      toast.success("Education removed successfully");
    }
  };

  const handleAddExperience = () => {
    setEditingSection("experience");
    setTempItem(defaultExperience);
  };

  const handleSaveExperience = () => {
    if (!tempItem.jobTitle || !tempItem.company) {
      toast.error("Job title and company are required");
      return;
    }

    const updatedExperience = [...profile.experience, tempItem];
    setProfile({ ...profile, experience: updatedExperience });
    setEditingSection(null);
    setTempItem({});
    toast.success("Experience added successfully");
  };

  const handleEditExperience = (index) => {
    setEditingSection(`experience-${index}`);
    setTempItem(profile.experience[index]);
  };

  const handleUpdateExperience = (index) => {
    const updatedExperience = [...profile.experience];
    updatedExperience[index] = tempItem;
    setProfile({ ...profile, experience: updatedExperience });
    setEditingSection(null);
    setTempItem({});
    toast.success("Experience updated successfully");
  };

  const handleRemoveExperience = (index) => {
    if (window.confirm("Are you sure you want to delete this experience entry?")) {
      const updatedExperience = profile.experience.filter((_, i) => i !== index);
      setProfile({ ...profile, experience: updatedExperience });
      toast.success("Experience removed successfully");
    }
  };

  const handleAddProject = () => {
    setEditingSection("project");
    setTempItem(defaultProject);
  };

  const handleSaveProject = () => {
    if (!tempItem.title) {
      toast.error("Project title is required");
      return;
    }

    const updatedProjects = [...profile.projects, tempItem];
    setProfile({ ...profile, projects: updatedProjects });
    setEditingSection(null);
    setTempItem({});
    toast.success("Project added successfully");
  };

  const handleEditProject = (index) => {
    setEditingSection(`project-${index}`);
    setTempItem(profile.projects[index]);
  };

  const handleUpdateProject = (index) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[index] = tempItem;
    setProfile({ ...profile, projects: updatedProjects });
    setEditingSection(null);
    setTempItem({});
    toast.success("Project updated successfully");
  };

  const handleRemoveProject = (index) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = profile.projects.filter((_, i) => i !== index);
      setProfile({ ...profile, projects: updatedProjects });
      toast.success("Project removed successfully");
    }
  };

  const handleAddSocialLink = () => {
    setEditingSection("social");
    setTempItem(defaultSocialLink);
  };

  const handleSaveSocialLink = () => {
    if (!tempItem.profileUrl) {
      toast.error("Profile URL is required");
      return;
    }

    const updatedSocialLinks = [...profile.socialMediaLinks, tempItem];
    setProfile({ ...profile, socialMediaLinks: updatedSocialLinks });
    setEditingSection(null);
    setTempItem({});
    toast.success("Social link added successfully");
  };

  const handleEditSocialLink = (index) => {
    setEditingSection(`social-${index}`);
    setTempItem(profile.socialMediaLinks[index]);
  };

  const handleUpdateSocialLink = (index) => {
    const updatedSocialLinks = [...profile.socialMediaLinks];
    updatedSocialLinks[index] = tempItem;
    setProfile({ ...profile, socialMediaLinks: updatedSocialLinks });
    setEditingSection(null);
    setTempItem({});
    toast.success("Social link updated successfully");
  };

  const handleRemoveSocialLink = (index) => {
    if (window.confirm("Are you sure you want to delete this social link?")) {
      const updatedSocialLinks = profile.socialMediaLinks.filter((_, i) => i !== index);
      setProfile({ ...profile, socialMediaLinks: updatedSocialLinks });
      toast.success("Social link removed successfully");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaUser className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
              </div>
              <p className="text-gray-600 mb-6">Basic details about you</p>
              
              {/* Profile Image Upload Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <FaUserCircle className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profileImage"
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full cursor-pointer hover:shadow-lg transition-all group-hover:scale-110"
                  >
                    <FaCamera className="w-5 h-5" />
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Click the camera icon to upload a profile picture (Max 5MB)
                </p>
                {profileImage && (
                  <p className="text-sm text-green-600 mt-2">
                    New image selected: {profileImage.name}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={profile.mobileNumber}
                    onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                    placeholder="Enter your mobile number"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                    value={profile.username}
                    readOnly
                    placeholder="Your portfolio URL identifier"
                  />
                  <p className="text-sm text-gray-500">This is used for your portfolio URL</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "professional":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaBriefcase className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Professional Information</h2>
              </div>
              <p className="text-gray-600 mb-6">Your professional identity</p>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    placeholder="e.g., Java Backend Developer | Spring Boot | Fresher"
                  />
                  <p className="text-sm text-gray-500">Appears below your name on your portfolio</p>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Professional Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                    value={profile.summary}
                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    rows={6}
                    placeholder="Brief summary about your professional background, skills, and career goals..."
                  />
                  <p className="text-sm text-gray-500">A compelling summary can attract more opportunities</p>
                </div>
                
                <div className="flex items-center p-4 bg-white rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="isFresher"
                    checked={profile.isFresher}
                    onChange={(e) => setProfile({ ...profile, isFresher: e.target.checked })}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isFresher" className="ml-3 text-sm font-medium text-gray-700">
                    I am currently a fresher / looking for entry-level positions
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "education":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaGraduationCap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                    <p className="text-gray-600 mt-1">Your academic background</p>
                  </div>
                </div>
                <button 
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddEducation}
                  disabled={editingSection}
                >
                  <FaPlus className="w-4 h-4" />
                  Add Education
                </button>
              </div>
              
              {profile.education.length === 0 && !editingSection && (
                <div className="text-center py-12 border-2 border-dashed border-green-200 rounded-xl bg-white/50">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaGraduationCap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No education added yet</h3>
                  <p className="text-gray-600">Add your educational qualifications to showcase your academic background.</p>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    {editingSection === `education-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-blue-600" />
                          Edit Education
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: "Degree *", value: "degree", type: "text", placeholder: "Bachelor of Technology" },
                            { label: "Field of Study", value: "fieldOfStudy", type: "text", placeholder: "Computer Science" },
                            { label: "Institution *", value: "institution", type: "text", placeholder: "ABC University" },
                            { label: "Start Year", value: "startYear", type: "number", placeholder: "2020" },
                            { label: "End Year", value: "endYear", type: "number", placeholder: "2024" },
                            { label: "CGPA/Percentage", value: "cgpa", type: "text", placeholder: "8.5" }
                          ].map((field) => (
                            <div key={field.value} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                              <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                type={field.type}
                                value={tempItem[field.value] || ""}
                                onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                                placeholder={field.placeholder}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                            onClick={() => handleUpdateEducation(index)}
                          >
                            <FaCheck className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{edu.degree}</h4>
                          <p className="text-gray-600 mt-1">{edu.institution}</p>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {edu.fieldOfStudy && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                {edu.fieldOfStudy}
                              </span>
                            )}
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {edu.startYear} - {edu.endYear}
                            </span>
                            {edu.cgpa && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                                CGPA: {edu.cgpa}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => handleEditEducation(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleRemoveEducation(index)}
                            disabled={editingSection}
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {editingSection === "education" && (
                <div className="mt-6 bg-white rounded-xl border-2 border-dashed border-green-300 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-green-600" />
                    Add New Education
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Degree *", value: "degree", type: "text", placeholder: "Bachelor of Technology" },
                      { label: "Field of Study", value: "fieldOfStudy", type: "text", placeholder: "Computer Science" },
                      { label: "Institution *", value: "institution", type: "text", placeholder: "ABC University" },
                      { label: "Start Year", value: "startYear", type: "number", placeholder: "2020" },
                      { label: "End Year", value: "endYear", type: "number", placeholder: "2024" },
                      { label: "CGPA/Percentage", value: "cgpa", type: "text", placeholder: "8.5" }
                    ].map((field) => (
                      <div key={field.value} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          type={field.type}
                          value={tempItem[field.value] || ""}
                          onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                      onClick={handleSaveEducation}
                    >
                      <FaCheck className="w-4 h-4" />
                      Save Education
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case "experience":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FaHistory className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                    <p className="text-gray-600 mt-1">Your professional journey</p>
                  </div>
                </div>
                <button 
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddExperience}
                  disabled={editingSection}
                >
                  <FaPlus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
              
              {profile.experience.length === 0 && !editingSection && (
                <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-xl bg-white/50">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBriefcase className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No experience added yet</h3>
                  <p className="text-gray-600">Add your professional work experience to showcase your career journey.</p>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    {editingSection === `experience-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-blue-600" />
                          Edit Experience
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: "Job Title *", value: "jobTitle", type: "text", placeholder: "Backend Developer" },
                            { label: "Company *", value: "company", type: "text", placeholder: "Tech Solutions Inc." },
                            { label: "Location", value: "location", type: "text", placeholder: "Remote, Bangalore" },
                            { label: "Start Month", value: "startMonth", type: "number", placeholder: "1" },
                            { label: "Start Year", value: "startYear", type: "number", placeholder: "2022" },
                            { label: "End Month", value: "endMonth", type: "number", placeholder: "12" },
                            { label: "End Year", value: "endYear", type: "number", placeholder: "2023" }
                          ].map((field) => (
                            <div key={field.value} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                              <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                type={field.type}
                                value={tempItem[field.value] || ""}
                                onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                                placeholder={field.placeholder}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="currentlyWorking"
                            checked={tempItem.currentlyWorking}
                            onChange={(e) => setTempItem({...tempItem, currentlyWorking: e.target.checked})}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="currentlyWorking" className="ml-2 text-sm font-medium text-gray-700">
                            I currently work here
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={tempItem.description}
                            onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-3">
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                            onClick={() => handleUpdateExperience(index)}
                          >
                            <FaCheck className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h4>
                          <p className="text-gray-600 mt-1">{exp.company} • {exp.location}</p>
                          <div className="flex flex-wrap gap-3 mt-3">
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                              {exp.startMonth}/{exp.startYear} - {exp.currentlyWorking ? 'Present' : `${exp.endMonth}/${exp.endYear}`}
                            </span>
                            {exp.currentlyWorking && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="mt-4 text-gray-700">{exp.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => handleEditExperience(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleRemoveExperience(index)}
                            disabled={editingSection}
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {editingSection === "experience" && (
                <div className="mt-6 bg-white rounded-xl border-2 border-dashed border-orange-300 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-orange-600" />
                    Add New Experience
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Job Title *", value: "jobTitle", type: "text", placeholder: "Backend Developer" },
                      { label: "Company *", value: "company", type: "text", placeholder: "Tech Solutions Inc." },
                      { label: "Location", value: "location", type: "text", placeholder: "Remote, Bangalore" },
                      { label: "Start Month", value: "startMonth", type: "number", placeholder: "1" },
                      { label: "Start Year", value: "startYear", type: "number", placeholder: "2022" }
                    ].map((field) => (
                      <div key={field.value} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          type={field.type}
                          value={tempItem[field.value] || ""}
                          onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="newCurrentlyWorking"
                      checked={tempItem.currentlyWorking}
                      onChange={(e) => setTempItem({...tempItem, currentlyWorking: e.target.checked})}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="newCurrentlyWorking" className="ml-2 text-sm font-medium text-gray-700">
                      I currently work here
                    </label>
                  </div>
                  {!tempItem.currentlyWorking && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">End Month</label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          type="number"
                          value={tempItem.endMonth || ""}
                          onChange={(e) => setTempItem({...tempItem, endMonth: parseInt(e.target.value)})}
                          placeholder="12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">End Year</label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          type="number"
                          value={tempItem.endYear || ""}
                          onChange={(e) => setTempItem({...tempItem, endYear: parseInt(e.target.value)})}
                          placeholder="2023"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 mt-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={tempItem.description}
                      onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                      onClick={handleSaveExperience}
                    >
                      <FaCheck className="w-4 h-4" />
                      Save Experience
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case "projects":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaProjectDiagram className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                    <p className="text-gray-600 mt-1">Showcase your technical projects</p>
                  </div>
                </div>
                <button 
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddProject}
                  disabled={editingSection}
                >
                  <FaPlus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
              
              {profile.projects.length === 0 && !editingSection && (
                <div className="text-center py-12 border-2 border-dashed border-purple-200 rounded-xl bg-white/50">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaProjectDiagram className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects added yet</h3>
                  <p className="text-gray-600">Add your technical projects to showcase your skills and experience.</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                {profile.projects.map((project, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    {editingSection === `project-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-purple-600" />
                          Edit Project
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              value={tempItem.title}
                              onChange={(e) => setTempItem({...tempItem, title: e.target.value})}
                              placeholder="e.g., Student Management System"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              value={tempItem.techStack}
                              onChange={(e) => setTempItem({...tempItem, techStack: e.target.value})}
                              placeholder="e.g., Java, Spring Boot, MySQL"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              value={tempItem.projectUrl}
                              onChange={(e) => setTempItem({...tempItem, projectUrl: e.target.value})}
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              value={tempItem.description}
                              onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                              placeholder="Describe your project..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                            onClick={() => handleUpdateProject(index)}
                          >
                            <FaCheck className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-800">{project.title}</h4>
                          <div className="flex gap-2">
                            <button 
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              onClick={() => handleEditProject(index)}
                              disabled={editingSection}
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleRemoveProject(index)}
                              disabled={editingSection}
                              title="Delete"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {project.techStack && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.techStack.split(',').map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.description && (
                          <p className="text-gray-600 mb-3">{project.description}</p>
                        )}
                        {project.projectUrl && (
                          <a 
                            href={project.projectUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 hover:underline text-sm"
                          >
                            <FaExternalLinkAlt className="w-3 h-3" />
                            View Project
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {editingSection === "project" && (
                <div className="mt-6 bg-white rounded-xl border-2 border-dashed border-purple-300 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-purple-600" />
                    Add New Project
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={tempItem.title}
                        onChange={(e) => setTempItem({...tempItem, title: e.target.value})}
                        placeholder="e.g., Student Management System"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={tempItem.techStack}
                        onChange={(e) => setTempItem({...tempItem, techStack: e.target.value})}
                        placeholder="e.g., Java, Spring Boot, MySQL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={tempItem.projectUrl}
                        onChange={(e) => setTempItem({...tempItem, projectUrl: e.target.value})}
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        value={tempItem.description}
                        onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                        placeholder="Describe your project..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                      onClick={handleSaveProject}
                    >
                      <FaCheck className="w-4 h-4" />
                      Save Project
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case "skills":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaTools className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
                  <p className="text-gray-600 mt-1">Your technical and professional skills</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    className="flex-grow px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Type a skill and press Enter to add"
                    disabled={editingSection}
                  />
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddSkill}
                    disabled={editingSection || !newSkill.trim()}
                  >
                    Add Skill
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Press Enter or click "Add Skill" to add multiple skills</p>
              </div>
              
              {profile.skills.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-blue-200 rounded-xl bg-white/50">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTools className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No skills added yet</h3>
                  <p className="text-gray-600">Add your technical skills to showcase your expertise to recruiters.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="group relative">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
                        <span className="font-medium">{skill}</span>
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-lg font-bold transition-colors"
                          onClick={() => handleRemoveSkill(index)}
                          disabled={editingSection}
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );

      case "social":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FaLink className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Social Media Links</h2>
                    <p className="text-gray-600 mt-1">Your professional online presence</p>
                  </div>
                </div>
                <button 
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddSocialLink}
                  disabled={editingSection}
                >
                  <FaPlus className="w-4 h-4" />
                  Add Link
                </button>
              </div>
              
              {profile.socialMediaLinks.length === 0 && !editingSection && (
                <div className="text-center py-12 border-2 border-dashed border-indigo-200 rounded-xl bg-white/50">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLink className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No social links added yet</h3>
                  <p className="text-gray-600">Add your professional profiles to help recruiters connect with you.</p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                {profile.socialMediaLinks.map((link, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    {editingSection === `social-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-indigo-600" />
                          Edit Social Link
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={tempItem.platform}
                              onChange={(e) => setTempItem({...tempItem, platform: e.target.value})}
                            >
                              {socialPlatforms.map((platform) => (
                                <option key={platform.value} value={platform.value}>
                                  {platform.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL *</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={tempItem.profileUrl}
                              onChange={(e) => setTempItem({...tempItem, profileUrl: e.target.value})}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                            onClick={() => handleUpdateSocialLink(index)}
                          >
                            <FaCheck className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${socialPlatforms.find(p => p.value === link.platform)?.color || 'text-gray-600'}`}>
                            {socialPlatforms.find(p => p.value === link.platform)?.icon || <FaGlobe className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {socialPlatforms.find(p => p.value === link.platform)?.label || link.platform}
                            </h4>
                            <a 
                              href={link.profileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm break-all"
                            >
                              {link.profileUrl}
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            onClick={() => handleEditSocialLink(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleRemoveSocialLink(index)}
                            disabled={editingSection}
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {editingSection === "social" && (
                <div className="mt-6 bg-white rounded-xl border-2 border-dashed border-indigo-300 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-indigo-600" />
                    Add New Social Link
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={tempItem.platform}
                        onChange={(e) => setTempItem({...tempItem, platform: e.target.value})}
                      >
                        {socialPlatforms.map((platform) => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile URL *</label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={tempItem.profileUrl}
                        onChange={(e) => setTempItem({...tempItem, profileUrl: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                      onClick={handleSaveSocialLink}
                    >
                      <FaCheck className="w-4 h-4" />
                      Save Link
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case "certifications":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <FaCertificate className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Certifications</h2>
                    <p className="text-gray-600 mt-1">Your professional certifications and courses</p>
                  </div>
                </div>
                <button 
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddCertification}
                  disabled={editingSection}
                >
                  <FaPlus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>
              
              {profile.certifications.length === 0 && !editingSection && (
                <div className="text-center py-12 border-2 border-dashed border-teal-200 rounded-xl bg-white/50">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCertificate className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No certifications added yet</h3>
                  <p className="text-gray-600">Add your professional certifications to showcase your skills and knowledge.</p>
                </div>
              )}
              
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    {editingSection === `certification-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-teal-600" />
                          Edit Certification
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Certification Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              value={tempItem.name}
                              onChange={(e) => setTempItem({...tempItem, name: e.target.value})}
                              placeholder="e.g., AWS Certified Solutions Architect"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                              <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                type="date"
                                value={tempItem.startDate || ""}
                                onChange={(e) => setTempItem({...tempItem, startDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                              <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                type="date"
                                value={tempItem.endDate || ""}
                                onChange={(e) => setTempItem({...tempItem, endDate: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              value={tempItem.description || ""}
                              onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                              placeholder="What does this certification cover? What skills did you learn?"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                            onClick={() => handleUpdateCertification(index)}
                          >
                            <FaCheck className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{cert.name}</h4>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {cert.startDate && (
                              <span className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
                                Started: {formatDate(cert.startDate)}
                              </span>
                            )}
                            {cert.endDate && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                Completed: {formatDate(cert.endDate)}
                              </span>
                            )}
                          </div>
                          {cert.description && (
                            <p className="mt-4 text-gray-700">{cert.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            onClick={() => handleEditCertification(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleRemoveCertification(index)}
                            disabled={editingSection}
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {editingSection === "certification" && (
                <div className="mt-6 bg-white rounded-xl border-2 border-dashed border-teal-300 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-teal-600" />
                    Add New Certification
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certification Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        value={tempItem.name}
                        onChange={(e) => setTempItem({...tempItem, name: e.target.value})}
                        placeholder="e.g., AWS Certified Solutions Architect"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          type="date"
                          value={tempItem.startDate || ""}
                          onChange={(e) => setTempItem({...tempItem, startDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          type="date"
                          value={tempItem.endDate || ""}
                          onChange={(e) => setTempItem({...tempItem, endDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        value={tempItem.description || ""}
                        onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                        placeholder="What does this certification cover? What skills did you learn?"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                      onClick={handleSaveCertification}
                    >
                      <FaCheck className="w-4 h-4" />
                      Save Certification
                    </button>
                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Manage your professional profile information</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {previewUrl && (
                <button 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                  onClick={() => window.open(previewUrl, '_blank')}
                >
                  <FaEye className="w-4 h-4" />
                  Preview Portfolio
                </button>
              )}
            </div>
          </div>
        </div>
        
        {error && !profile.id && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-xl"
          >
            <strong className="text-blue-800">Note:</strong> <span className="text-blue-700 ml-1">{error}</span>
          </motion.div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto px-4">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 font-medium whitespace-nowrap transition-all relative ${
                    activeTab === tab.id 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
            
            {editingSection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl"
              >
                <p className="text-yellow-800 text-sm flex items-center gap-2">
                  <span className="font-medium">Editing in progress:</span> 
                  Please save or cancel before switching tabs.
                </p>
              </motion.div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600">
                    Your portfolio URL: <span className="font-medium text-blue-600">{previewUrl}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Share this link with recruiters and employers
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={editingSection || saving}
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : profile.id ? (
                      <>
                        <FaSave className="w-4 h-4" />
                        Update Profile
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-4 h-4" />
                        Create Profile
                      </>
                    )}
                  </button>
                  {previewUrl && (
                    <button 
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                      onClick={() => window.open(previewUrl, '_blank')}
                    >
                      <FaEye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
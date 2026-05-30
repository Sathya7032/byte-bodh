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
  FaCertificate,
  FaMobileAlt,
  FaSync
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
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  

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
      const url = `http://localhost:3001/${profile.username}`;
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl">
                  <FaUser className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Personal Information</h2>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Basic details that describe your identity</p>
                </div>
              </div>
              
              {/* Profile Image Upload Section */}
              <div className="flex flex-col items-center mb-8 bg-white/40 border border-slate-200/50 rounded-2xl p-6 max-w-sm mx-auto">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md relative">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
                        <FaUserCircle className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profileImage"
                    className="absolute bottom-1 right-1 bg-[#6C63FF] hover:bg-[#5b52e6] text-white p-2.5 rounded-full cursor-pointer hover:shadow-lg transition-all active:scale-90"
                  >
                    <FaCamera className="w-4 h-4" />
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-3 text-center">
                  PNG, JPG or GIF • Max size 5MB
                </p>
                {profileImage && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 text-center bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    Selected: {profileImage.name}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Mobile Number</label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                    value={profile.mobileNumber}
                    onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                    placeholder="Enter your mobile number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Username</label>
                  <input
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-400"
                    value={profile.username}
                    readOnly
                    placeholder="Your portfolio URL identifier"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">This uniquely identifies your public portfolio link</p>
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl">
                  <FaBriefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Professional Information</h2>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Describe your professional headline and background</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    placeholder="e.g., Java Backend Developer | Spring Boot | Fresher"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Appears below your name on your portfolio</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">
                    Professional Summary <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400 resize-none"
                    value={profile.summary}
                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    rows={6}
                    placeholder="Brief summary about your professional background, skills, and career goals..."
                  />
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">A compelling summary can attract more opportunities</p>
                </div>
                
                <div className="flex items-center p-4 bg-white rounded-2xl border border-slate-200/60">
                  <input
                    type="checkbox"
                    id="isFresher"
                    checked={profile.isFresher}
                    onChange={(e) => setProfile({ ...profile, isFresher: e.target.checked })}
                    className="w-4.5 h-4.5 text-[#6C63FF] border-slate-300 rounded focus:ring-[#6C63FF]/20"
                  />
                  <label htmlFor="isFresher" className="ml-3 text-xs font-bold text-slate-600">
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl shrink-0">
                    <FaGraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Education</h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your academic background and qualifications</p>
                  </div>
                </div>
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                  onClick={handleAddEducation}
                  disabled={editingSection}
                >
                  <FaPlus className="w-3.5 h-3.5" />
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
                  <div key={index} className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:shadow-md transition-shadow">
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
                            <div key={field.value} className="space-y-2 text-left">
                              <label className="block text-xs font-bold text-slate-600">{field.label}</label>
                              <input
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                                type={field.type}
                                value={tempItem[field.value] || ""}
                                onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                                placeholder={field.placeholder}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                            onClick={() => handleUpdateEducation(index)}
                          >
                            <FaCheck className="w-3.5 h-3.5" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-slate-800 tracking-tight">{edu.degree}</h4>
                          <p className="text-xs font-semibold text-slate-500">{edu.institution}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {edu.fieldOfStudy && (
                              <span className="px-2.5 py-1 bg-[#6C63FF]/5 text-[#6C63FF] text-[10px] font-bold rounded-lg border border-[#6C63FF]/10">
                                {edu.fieldOfStudy}
                              </span>
                            )}
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">
                              {edu.startYear} - {edu.endYear}
                            </span>
                            {edu.cgpa && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">
                                CGPA: {edu.cgpa}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-start shrink-0">
                          <button 
                            className="p-2 text-[#6C63FF] hover:bg-[#6C63FF]/5 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleEditEducation(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                <div className="mt-6 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-[#6C63FF]/30 p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 text-left">
                    <FaPlus className="w-4 h-4 text-[#6C63FF]" />
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
                      <div key={field.value} className="space-y-2 text-left">
                        <label className="block text-xs font-bold text-slate-600">{field.label}</label>
                        <input
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                          type={field.type}
                          value={tempItem[field.value] || ""}
                          onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                      onClick={handleSaveEducation}
                    >
                      <FaCheck className="w-3.5 h-3.5" />
                      Save Education
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-3.5 h-3.5" />
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl shrink-0">
                    <FaHistory className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Work Experience</h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your professional work and employment history</p>
                  </div>
                </div>
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                  onClick={handleAddExperience}
                  disabled={editingSection}
                >
                  <FaPlus className="w-3.5 h-3.5" />
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
                  <div key={index} className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:shadow-md transition-shadow">
                    {editingSection === `experience-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-[#6C63FF]" />
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
                            <div key={field.value} className="space-y-2 text-left">
                              <label className="block text-xs font-bold text-slate-600">{field.label}</label>
                              <input
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                                type={field.type}
                                value={tempItem[field.value] || ""}
                                onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                                placeholder={field.placeholder}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center text-left">
                          <input
                            type="checkbox"
                            id="currentlyWorking"
                            checked={tempItem.currentlyWorking}
                            onChange={(e) => setTempItem({...tempItem, currentlyWorking: e.target.checked})}
                            className="w-4.5 h-4.5 text-[#6C63FF] border-slate-300 rounded focus:ring-[#6C63FF]/20"
                          />
                          <label htmlFor="currentlyWorking" className="ml-2.5 text-xs font-bold text-slate-600">
                            I currently work here
                          </label>
                        </div>
                        <div className="space-y-2 text-left">
                          <label className="block text-xs font-bold text-slate-600">Description</label>
                          <textarea
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                            value={tempItem.description}
                            onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={4}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                            onClick={() => handleUpdateExperience(index)}
                          >
                            <FaCheck className="w-3.5 h-3.5" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-slate-800 tracking-tight">{exp.jobTitle}</h4>
                          <p className="text-xs font-semibold text-slate-500">{exp.company} • {exp.location}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <span className="px-2.5 py-1 bg-[#6C63FF]/5 text-[#6C63FF] text-[10px] font-bold rounded-lg border border-[#6C63FF]/10">
                              {exp.startMonth}/{exp.startYear} - {exp.currentlyWorking ? 'Present' : `${exp.endMonth}/${exp.endYear}`}
                            </span>
                            {exp.currentlyWorking && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">
                                Current
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="mt-3 text-xs font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">{exp.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 self-end sm:self-start shrink-0">
                          <button 
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleEditExperience(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                <div className="mt-6 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-[#6C63FF]/30 p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-[#6C63FF]" />
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
                      <div key={field.value} className="space-y-2 text-left">
                        <label className="block text-xs font-bold text-slate-600">{field.label}</label>
                        <input
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                          type={field.type}
                          value={tempItem[field.value] || ""}
                          onChange={(e) => setTempItem({...tempItem, [field.value]: field.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center mt-4 text-left">
                    <input
                      type="checkbox"
                      id="newCurrentlyWorking"
                      checked={tempItem.currentlyWorking}
                      onChange={(e) => setTempItem({...tempItem, currentlyWorking: e.target.checked})}
                      className="w-4.5 h-4.5 text-[#6C63FF] border-slate-300 rounded focus:ring-[#6C63FF]/20"
                    />
                    <label htmlFor="newCurrentlyWorking" className="ml-2.5 text-xs font-bold text-slate-600">
                      I currently work here
                    </label>
                  </div>
                  {!tempItem.currentlyWorking && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-left">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-600">End Month</label>
                        <input
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                          type="number"
                          value={tempItem.endMonth || ""}
                          onChange={(e) => setTempItem({...tempItem, endMonth: parseInt(e.target.value)})}
                          placeholder="12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-600">End Year</label>
                        <input
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                          type="number"
                          value={tempItem.endYear || ""}
                          onChange={(e) => setTempItem({...tempItem, endYear: parseInt(e.target.value)})}
                          placeholder="2023"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 mt-4 text-left">
                    <label className="block text-xs font-bold text-slate-600">Description</label>
                    <textarea
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                      value={tempItem.description}
                      onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                      onClick={handleSaveExperience}
                    >
                      <FaCheck className="w-3.5 h-3.5" />
                      Save Experience
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-3.5 h-3.5" />
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl shrink-0">
                    <FaProjectDiagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Projects</h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Showcase your technical and creative projects</p>
                  </div>
                </div>
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                  onClick={handleAddProject}
                  disabled={editingSection}
                >
                  <FaPlus className="w-3.5 h-3.5" />
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
                  <div key={index} className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:shadow-md transition-shadow">
                    {editingSection === `project-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-[#6C63FF]" />
                          Edit Project
                        </h3>
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Project Title *</label>
                            <input
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                              value={tempItem.title}
                              onChange={(e) => setTempItem({...tempItem, title: e.target.value})}
                              placeholder="e.g., Student Management System"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Tech Stack</label>
                            <input
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                              value={tempItem.techStack}
                              onChange={(e) => setTempItem({...tempItem, techStack: e.target.value})}
                              placeholder="e.g., Java, Spring Boot, MySQL"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Project URL</label>
                            <input
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                              value={tempItem.projectUrl}
                              onChange={(e) => setTempItem({...tempItem, projectUrl: e.target.value})}
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Description</label>
                            <textarea
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                              value={tempItem.description}
                              onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                              placeholder="Describe your project..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                            onClick={() => handleUpdateProject(index)}
                          >
                            <FaCheck className="w-3.5 h-3.5" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="space-y-1 flex-grow">
                          <h4 className="text-lg font-bold text-slate-800 tracking-tight">{project.title}</h4>
                          {project.techStack && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {project.techStack.split(',').map((tech, i) => (
                                <span key={i} className="px-2 py-0.5 bg-[#6C63FF]/5 text-[#6C63FF] text-[10px] font-bold rounded-md border border-[#6C63FF]/10">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {project.description && (
                            <p className="mt-3 text-xs font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">{project.description}</p>
                          )}
                          {project.projectUrl && (
                            <div className="pt-2">
                              <a 
                                href={project.projectUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C63FF] hover:text-[#5b52e6] hover:underline"
                              >
                                <FaExternalLinkAlt className="w-2.5 h-2.5" />
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 self-end sm:self-start shrink-0">
                          <button 
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleEditProject(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleRemoveProject(index)}
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
              
              {editingSection === "project" && (
                <div className="mt-6 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-[#6C63FF]/30 p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-[#6C63FF]" />
                    Add New Project
                  </h3>
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">Project Title *</label>
                      <input
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                        value={tempItem.title}
                        onChange={(e) => setTempItem({...tempItem, title: e.target.value})}
                        placeholder="e.g., Student Management System"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">Tech Stack</label>
                      <input
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                        value={tempItem.techStack}
                        onChange={(e) => setTempItem({...tempItem, techStack: e.target.value})}
                        placeholder="e.g., Java, Spring Boot, MySQL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">Project URL</label>
                      <input
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                        value={tempItem.projectUrl}
                        onChange={(e) => setTempItem({...tempItem, projectUrl: e.target.value})}
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">Description</label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                        value={tempItem.description}
                        onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                        placeholder="Describe your project..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                      onClick={handleSaveProject}
                    >
                      <FaCheck className="w-3.5 h-3.5" />
                      Save Project
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-3.5 h-3.5" />
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl">
                  <FaTools className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Skills</h2>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your technical, design, and professional skills</p>
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
                    className="px-6 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl shrink-0">
                    <FaLink className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Social Media Links</h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your professional online coordinates</p>
                  </div>
                </div>
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                  onClick={handleAddSocialLink}
                  disabled={editingSection}
                >
                  <FaPlus className="w-3.5 h-3.5" />
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
                  <div key={index} className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:shadow-md transition-shadow">
                    {editingSection === `social-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-[#6C63FF]" />
                          Edit Social Link
                        </h3>
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Platform</label>
                            <select
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-bold text-slate-800"
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
                            <label className="block text-xs font-bold text-slate-600 mb-2">Profile URL *</label>
                            <input
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                              value={tempItem.profileUrl}
                              onChange={(e) => setTempItem({...tempItem, profileUrl: e.target.value})}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                            onClick={() => handleUpdateSocialLink(index)}
                          >
                            <FaCheck className="w-3.5 h-3.5" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0 ${socialPlatforms.find(p => p.value === link.platform)?.color || 'text-slate-600'}`}>
                            {socialPlatforms.find(p => p.value === link.platform)?.icon || <FaGlobe className="w-4 h-4" />}
                          </div>
                          <div className="space-y-0.5 text-left">
                            <h4 className="text-xs font-bold text-slate-800">
                              {socialPlatforms.find(p => p.value === link.platform)?.label || link.platform}
                            </h4>
                            <a 
                              href={link.profileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#6C63FF] hover:text-[#5b52e6] hover:underline text-xs font-semibold break-all"
                            >
                              {link.profileUrl}
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-start shrink-0">
                          <button 
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleEditSocialLink(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                <div className="mt-6 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-[#6C63FF]/30 p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-[#6C63FF]" />
                    Add New Social Link
                  </h3>
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">Platform</label>
                      <select
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-bold text-slate-800"
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
                      <label className="block text-xs font-bold text-slate-600 mb-2">Profile URL *</label>
                      <input
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                        value={tempItem.profileUrl}
                        onChange={(e) => setTempItem({...tempItem, profileUrl: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                      onClick={handleSaveSocialLink}
                    >
                      <FaCheck className="w-3.5 h-3.5" />
                      Save Link
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-3.5 h-3.5" />
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
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-indigo-600/5 border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl shrink-0">
                    <FaCertificate className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Certifications</h2>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Your professional licenses, certifications, and courses</p>
                  </div>
                </div>
                <button 
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                  onClick={handleAddCertification}
                  disabled={editingSection}
                >
                  <FaPlus className="w-3.5 h-3.5" />
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
                  <div key={index} className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 hover:shadow-md transition-shadow">
                    {editingSection === `certification-${index}` ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <FaEdit className="w-4 h-4 text-[#6C63FF]" />
                          Edit Certification
                        </h3>
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">
                              Certification Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                              value={tempItem.name}
                              onChange={(e) => setTempItem({...tempItem, name: e.target.value})}
                              placeholder="e.g., AWS Certified Solutions Architect"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">Start Date</label>
                              <input
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-450"
                                type="date"
                                value={tempItem.startDate || ""}
                                onChange={(e) => setTempItem({...tempItem, startDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-2">End Date</label>
                              <input
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-450"
                                type="date"
                                value={tempItem.endDate || ""}
                                onChange={(e) => setTempItem({...tempItem, endDate: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Description</label>
                            <textarea
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                              value={tempItem.description || ""}
                              onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                              placeholder="What does this certification cover? What skills did you learn?"
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                            onClick={() => handleUpdateCertification(index)}
                          >
                            <FaCheck className="w-3.5 h-3.5" />
                            Save Changes
                          </button>
                          <button 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                            onClick={() => {
                              setEditingSection(null);
                              setTempItem({});
                            }}
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="space-y-1 text-left">
                          <h4 className="text-lg font-bold text-slate-800 tracking-tight">{cert.name}</h4>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {cert.startDate && (
                              <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">
                                Started: {formatDate(cert.startDate)}
                              </span>
                            )}
                            {cert.endDate && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100">
                                Completed: {formatDate(cert.endDate)}
                              </span>
                            )}
                          </div>
                          {cert.description && (
                            <p className="mt-3 text-xs font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">{cert.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 self-end sm:self-start shrink-0">
                          <button 
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleEditCertification(index)}
                            disabled={editingSection}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                <div className="mt-6 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-[#6C63FF]/30 p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FaPlus className="w-4 h-4 text-[#6C63FF]" />
                    Add New Certification
                  </h3>
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">
                        Certification Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                        value={tempItem.name}
                        onChange={(e) => setTempItem({...tempItem, name: e.target.value})}
                        placeholder="e.g., AWS Certified Solutions Architect"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">Start Date</label>
                        <input
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-450"
                          type="date"
                          value={tempItem.startDate || ""}
                          onChange={(e) => setTempItem({...tempItem, startDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2">End Date</label>
                        <input
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-450"
                          type="date"
                          value={tempItem.endDate || ""}
                          onChange={(e) => setTempItem({...tempItem, endDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2">Description</label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-[#6C63FF]/15 focus:border-[#6C63FF] transition-all text-xs font-semibold text-slate-800 placeholder-slate-400"
                        value={tempItem.description || ""}
                        onChange={(e) => setTempItem({...tempItem, description: e.target.value})}
                        placeholder="What does this certification cover? What skills did you learn?"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                      onClick={handleSaveCertification}
                    >
                      <FaCheck className="w-3.5 h-3.5" />
                      Save Certification
                    </button>
                    <button 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                      onClick={() => {
                        setEditingSection(null);
                        setTempItem({});
                      }}
                    >
                      <FaTimes className="w-3.5 h-3.5" />
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
    <DashboardLayout containerClassName="w-full min-h-screen bg-slate-50/50 space-y-6">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto text-left animate-fadeIn">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Profile</h1>
              <p className="text-slate-500 text-xs font-semibold mt-1">Manage your digital resume & portfolio content parameters</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {previewUrl && (
                <>
                  <button 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/15 hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                    onClick={() => setMobilePreviewOpen(true)}
                  >
                    <FaMobileAlt className="w-3.5 h-3.5" />
                    Mobile Preview
                  </button>
                  <button 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <FaGlobe className="w-3.5 h-3.5" />
                    Web Preview
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {error && !profile.id && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl"
          >
            <strong className="text-[#6C63FF]">Note:</strong> <span className="text-indigo-800 ml-1 font-medium">{error}</span>
          </motion.div>
        )}
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50">
            <div 
              className="flex overflow-x-auto px-4 gap-1 py-1.5 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 font-bold text-xs rounded-xl whitespace-nowrap transition-all relative ${
                    activeTab === tab.id 
                      ? 'text-[#6C63FF]' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#6C63FF]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {renderTabContent()}
            
            {editingSection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <p className="text-amber-800 text-xs flex items-center gap-2">
                  <span className="font-bold">Editing in progress:</span> 
                  Please save or cancel before switching tabs.
                </p>
              </motion.div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-xs text-slate-500 font-bold">
                    YOUR PORTFOLIO LINK: <span className="font-extrabold text-[#6C63FF] hover:underline cursor-pointer" onClick={() => window.open(previewUrl, '_blank')}>{previewUrl}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">
                    Share this live URL with recruiters, employers, and clients.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/20 hover:shadow-lg hover:shadow-[#6C63FF]/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                    onClick={handleSave}
                    disabled={editingSection || saving}
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : profile.id ? (
                      <>
                        <FaSave className="w-3.5 h-3.5" />
                        Update Profile
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-3.5 h-3.5" />
                        Create Profile
                      </>
                    )}
                  </button>
                  {previewUrl && (
                    <>
                      <button 
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C63FF]/15 hover:shadow-lg transition-all active:scale-95 cursor-pointer animate-pulse w-full sm:w-auto"
                        onClick={() => setMobilePreviewOpen(true)}
                      >
                        <FaMobileAlt className="w-3.5 h-3.5" />
                        Mobile Preview
                      </button>
                      <button 
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
                        onClick={() => window.open(previewUrl, '_blank')}
                      >
                        <FaGlobe className="w-3.5 h-3.5" />
                        Web Preview
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ===== MOBILE PREVIEW SCREEN DRAWER MODAL ===== */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 relative animate-slideUp flex flex-col items-center">
            
            {/* Modal Close */}
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="Close preview"
            >
              <FaTimes size={16} />
            </button>

            {/* Modal Header */}
            <div className="w-full flex items-center justify-start gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="font-black text-slate-800 text-sm">Live Mobile View</h3>
              <button 
                onClick={() => setPreviewKey(prev => prev + 1)}
                className="ml-auto p-1 text-slate-400 hover:text-[#6C63FF] rounded-lg transition-colors cursor-pointer"
                title="Refresh preview screen"
              >
                <FaSync size={12} />
              </button>
            </div>

            {/* SmartPhone Mobile Mockup or Direct Full-width Mobile Iframe on actual mobile */}
            <div className="w-full sm:w-[280px] h-[60vh] sm:h-[520px] bg-slate-900 rounded-3xl sm:rounded-[40px] p-1.5 sm:p-3 shadow-2xl border border-slate-850 sm:border-4 sm:border-slate-800 relative">
              {/* Dynamic Island Notch */}
              <div className="hidden sm:block absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-3.5 bg-black rounded-full z-30"></div>
              
              <div className="w-full h-full bg-white rounded-2xl sm:rounded-[32px] overflow-hidden relative border border-slate-950/10">
                <iframe
                  key={previewKey}
                  src={previewUrl}
                  className="w-full h-full border-none"
                  title="Mobile Live Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              {/* Bottom Home Indicator */}
              <div className="hidden sm:block absolute bottom-2.5 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-slate-800 rounded-full z-30"></div>
            </div>

            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
            >
              Back to Editing
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Profile;
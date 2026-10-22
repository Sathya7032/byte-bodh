import React, { useEffect, useState, useCallback, useRef } from "react";
import DashboardLayout from "./components/DashboardLayout";
import {
  projectsApi,
  skillsApi,
  educationApi,
  certificationsApi,
  achievementsApi,
  linksApi,
  userApi,
  resolveImageUrl,
} from "../api/portfolioApiService";
import { getMyProfile, updateProfile } from "../api/profileService";
import { getPortfolioUrl, getLinktreeUrl } from "../config/api";
import { getAccessToken } from "../services/auth";
import { toast } from "react-toastify";
import {
  FaUser,
  FaGraduationCap,
  FaProjectDiagram,
  FaTools,
  FaCertificate,
  FaTrophy,
  FaLink,
  FaPlus,
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
  FaGlobe,
  FaCopy,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaAward,
  FaCamera,
  FaCloudUploadAlt,
  FaImage,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaEye,
  FaMousePointer,
  FaMoon,
  FaCheck,
  FaCheckCircle,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

// Backend Enums
const PROFESSION_CATEGORIES = [
  { value: "SOFTWARE_ENGINEER", label: "Software Engineer / Developer" },
  { value: "PRODUCT_DESIGNER", label: "Product Designer / UI/UX" },
  { value: "GRAPHIC_DESIGNER", label: "Graphic Designer / Artist" },
  { value: "CONTENT_CREATOR", label: "Content Creator / Influencer" },
  { value: "PHOTOGRAPHER", label: "Photographer" },
  { value: "VIDEOGRAPHER", label: "Filmmaker / Videographer" },
  { value: "WRITER_AUTHOR", label: "Writer / Author / Journalist" },
  { value: "ENTREPRENEUR", label: "Entrepreneur / Founder" },
  { value: "MARKETER", label: "Digital Marketer / Growth" },
  { value: "CONSULTANT", label: "Consultant / Advisor" },
  { value: "MUSICIAN_ARTIST", label: "Musician / Audio Artist" },
  { value: "STUDENT", label: "Student / Learner" },
  { value: "OTHER", label: "Other Profession" },
];

const SKILL_PROFICIENCIES = [
  { value: "BEGINNER", label: "Beginner (Fundamentals)" },
  { value: "INTERMEDIATE", label: "Intermediate (Hands-on)" },
  { value: "ADVANCED", label: "Advanced (High Competence)" },
  { value: "EXPERT", label: "Expert (Mastery / Production)" },
];

const SOCIAL_PLATFORMS = [
  { value: "GITHUB", label: "GitHub", icon: <FaGithub /> },
  { value: "LINKEDIN", label: "LinkedIn", icon: <FaLinkedin /> },
  { value: "TWITTER_X", label: "X / Twitter", icon: <FaTwitter /> },
  { value: "INSTAGRAM", label: "Instagram", icon: <FaInstagram /> },
  { value: "YOUTUBE", label: "YouTube", icon: <FaYoutube /> },
  { value: "LEETCODE", label: "LeetCode", icon: <SiLeetcode /> },
  { value: "WEBSITE", label: "Portfolio / Website", icon: <FaGlobe /> },
  { value: "CUSTOM", label: "Custom Link", icon: <FaLink /> },
];

const ACCENT_COLORS = [
  { label: "Emerald", hex: "#10B981" },
  { label: "Indigo", hex: "#6366F1" },
  { label: "Sky Blue", hex: "#0EA5E9" },
  { label: "Rose Pink", hex: "#F43F5E" },
  { label: "Amber Gold", hex: "#F59E0B" },
  { label: "Violet Purple", hex: "#8B5CF6" },
  { label: "Slate Dark", hex: "#0F172A" },
];

export default function Profile() {
  const [activeCategory, setActiveCategory] = useState("identity"); // identity | projects | skills | education | certifications | achievements | social
  const [loading, setLoading] = useState(true);
  const [savingIdentity, setSavingIdentity] = useState(false);

  // User Identity State (User Entity)
  const [userProfile, setUserProfile] = useState({
    id: "",
    email: "",
    username: "",
    fullName: "",
    headline: "",
    bio: "",
    professionCategory: "SOFTWARE_ENGINEER",
    customProfessionTitle: "",
    avatarUrl: "",
    bannerUrl: "",
    location: "",
    contactEmail: "",
    phoneNumber: "",
    themeAccentColor: "#10B981",
    isDarkModeEnabled: false,
    isProfilePublic: true,
    isOnboardingCompleted: false,
    totalProfileViews: 0,
    totalLinkClicks: 0,
    activeTemplateId: "",
    activeTemplateCode: "BENTO_GRID_PRO",
    hasActiveSubscription: false,
    authProvider: "EMAIL",
    selectedTemplate: "CLASSIC_LINKS",
  });

  // Dedicated file states for avatar & banner
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Entity Lists State
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userLinks, setUserLinks] = useState([]);

  // Modal State for adding/editing entity items
  const [modalType, setModalType] = useState(null); // 'project' | 'skill' | 'education' | 'cert' | 'achievement' | 'link'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [modalImageFile, setModalImageFile] = useState(null);
  const [modalImagePreview, setModalImagePreview] = useState("");
  const [savingItem, setSavingItem] = useState(false);
  const modalFileInputRef = useRef(null);

  // Load all user details and category entities
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        userRes,
        legacyProfileRes,
        projectsRes,
        skillsRes,
        eduRes,
        certsRes,
        achRes,
        linksRes,
      ] = await Promise.allSettled([
        userApi.getProfile().catch(() => ({ data: null })),
        getMyProfile().catch(() => ({ data: null })),
        projectsApi.getAll(),
        skillsApi.getAll(),
        educationApi.getAll(),
        certificationsApi.getAll(),
        achievementsApi.getAll(),
        linksApi.getAll(),
      ]);

      // Unpack user identity
      const userData =
        userRes.status === "fulfilled" && userRes.value?.data
          ? userRes.value.data.data || userRes.value.data
          : legacyProfileRes.status === "fulfilled" && legacyProfileRes.value?.data
          ? legacyProfileRes.value.data.data || legacyProfileRes.value.data
          : {};

      setUserProfile({
        id: userData.id || userData.user?.id || "",
        email: userData.email || userData.user?.email || "",
        username: userData.username || userData.user?.username || "",
        fullName: userData.fullName || userData.user?.fullName || "",
        headline: userData.headline || userData.user?.headline || "",
        bio: userData.bio || userData.summary || "",
        professionCategory: userData.professionCategory || "SOFTWARE_ENGINEER",
        customProfessionTitle: userData.customProfessionTitle || "",
        avatarUrl: userData.avatarUrl || userData.pictureUrl || userData.user?.avatarUrl || userData.user?.pictureUrl || "",
        bannerUrl: userData.bannerUrl || userData.user?.bannerUrl || "",
        location: userData.location || "",
        contactEmail: userData.contactEmail || userData.email || "",
        phoneNumber: userData.phoneNumber || userData.mobileNumber || "",
        themeAccentColor: userData.themeAccentColor || "#10B981",
        isDarkModeEnabled: Boolean(userData.isDarkModeEnabled),
        isProfilePublic: userData.isProfilePublic !== false,
        isOnboardingCompleted: Boolean(userData.isOnboardingCompleted),
        totalProfileViews: userData.totalProfileViews ?? 0,
        totalLinkClicks: userData.totalLinkClicks ?? 0,
        activeTemplateId: userData.activeTemplateId || "",
        activeTemplateCode: userData.activeTemplateCode || "BENTO_GRID_PRO",
        hasActiveSubscription: Boolean(userData.hasActiveSubscription),
        authProvider: userData.authProvider || "EMAIL",
        selectedTemplate: userData.selectedTemplate || "CLASSIC_LINKS",
      });

      if (userData.avatarUrl || userData.pictureUrl) {
        setAvatarPreview(userData.avatarUrl || userData.pictureUrl);
      }
      if (userData.bannerUrl) {
        setBannerPreview(userData.bannerUrl);
      }

      // Unpack Projects
      if (projectsRes.status === "fulfilled" && Array.isArray(projectsRes.value?.data)) {
        setProjects(projectsRes.value.data);
      } else if (Array.isArray(userData.projects)) {
        setProjects(userData.projects);
      }

      // Unpack Skills
      if (skillsRes.status === "fulfilled" && Array.isArray(skillsRes.value?.data)) {
        setSkills(skillsRes.value.data);
      } else if (Array.isArray(userData.skills)) {
        setSkills(
          userData.skills.map((s, idx) =>
            typeof s === "string"
              ? { id: idx, name: s, category: "General", proficiencyLevel: "INTERMEDIATE" }
              : s
          )
        );
      }

      // Unpack Education
      if (eduRes.status === "fulfilled" && Array.isArray(eduRes.value?.data)) {
        setEducation(eduRes.value.data);
      } else if (Array.isArray(userData.education)) {
        setEducation(userData.education);
      }

      // Unpack Certifications
      if (certsRes.status === "fulfilled" && Array.isArray(certsRes.value?.data)) {
        setCertifications(certsRes.value.data);
      } else if (Array.isArray(userData.certifications)) {
        setCertifications(userData.certifications);
      }

      // Unpack Achievements
      if (achRes.status === "fulfilled" && Array.isArray(achRes.value?.data)) {
        setAchievements(achRes.value.data);
      }

      // Unpack Social Links
      if (linksRes.status === "fulfilled" && Array.isArray(linksRes.value?.data)) {
        setUserLinks(linksRes.value.data);
      } else if (Array.isArray(userData.socialMediaLinks)) {
        setUserLinks(userData.socialMediaLinks);
      }
    } catch (err) {
      console.error("Error loading profile categories:", err);
      toast.error("Failed to load details. Using local defaults.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    console.log("%c[ByteBodh Profile] Active JWT Token:", "color:#10b981;font-weight:bold;", token);
    loadAllData();
  }, [loadAllData]);

  const publicPortfolioUrl = getPortfolioUrl(userProfile.username || "portfolio");
  const publicLinktreeUrl = getLinktreeUrl(userProfile.username || "portfolio");
  const [copiedPortfolioUrl, setCopiedPortfolioUrl] = useState(false);
  const [copiedLinktreeUrl, setCopiedLinktreeUrl] = useState(false);

  const handleCopyPortfolioUrl = () => {
    if (!publicPortfolioUrl) return;
    navigator.clipboard.writeText(publicPortfolioUrl);
    setCopiedPortfolioUrl(true);
    toast.success("Portfolio URL copied to clipboard!");
    setTimeout(() => setCopiedPortfolioUrl(false), 2000);
  };

  const handleCopyLinktreeUrl = () => {
    if (!publicLinktreeUrl) return;
    navigator.clipboard.writeText(publicLinktreeUrl);
    setCopiedLinktreeUrl(true);
    toast.success("Linktree URL copied to clipboard!");
    setTimeout(() => setCopiedLinktreeUrl(false), 2000);
  };

  // Client-side image compression to prevent HTTP 413 & CORS rejection
  const compressImageFile = (file, maxWidth = 800, maxHeight = 800, quality = 0.85) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                resolve(file);
              } else {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  // Avatar file selection with auto compression
  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    try {
      const compressed = await compressImageFile(file, 600, 600, 0.85);
      setAvatarFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(compressed);
    } catch {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Banner file selection with auto compression
  const handleBannerSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      const compressed = await compressImageFile(file, 1600, 600, 0.82);
      setBannerFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(compressed);
    } catch {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modal item image selection with auto compression
  const handleModalImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      const compressed = await compressImageFile(file, 900, 900, 0.85);
      setModalImageFile(compressed);
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalImagePreview(reader.result);
      };
      reader.readAsDataURL(compressed);
    } catch {
      setModalImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Identity Details (User Entity) with Avatar & Banner
  const handleSaveIdentity = async (e) => {
    e.preventDefault();
    setSavingIdentity(true);
    try {
      // Build FormData to support avatar and banner multipart uploads
      const payload = new FormData();
      if (avatarFile) {
        payload.append("avatar", avatarFile);
        payload.append("profileImage", avatarFile);
        payload.append("image", avatarFile);
      }
      if (bannerFile) {
        payload.append("banner", bannerFile);
        payload.append("bannerImage", bannerFile);
      }

      payload.append("fullName", userProfile.fullName || "");
      payload.append("headline", userProfile.headline || "");
      payload.append("bio", userProfile.bio || "");
      payload.append("summary", userProfile.bio || "");
      payload.append("professionCategory", userProfile.professionCategory || "SOFTWARE_ENGINEER");
      payload.append("customProfessionTitle", userProfile.customProfessionTitle || "");
      payload.append("location", userProfile.location || "");
      payload.append("contactEmail", userProfile.contactEmail || "");
      payload.append("phoneNumber", userProfile.phoneNumber || "");
      payload.append("themeAccentColor", userProfile.themeAccentColor || "#10B981");
      payload.append("isProfilePublic", String(userProfile.isProfilePublic));

      if (!avatarFile) {
        payload.append("avatarUrl", userProfile.avatarUrl ? userProfile.avatarUrl.trim() : "REMOVE");
      }
      if (!bannerFile) {
        payload.append("bannerUrl", userProfile.bannerUrl ? userProfile.bannerUrl.trim() : "REMOVE");
      }

      const res = await updateProfile(payload);
      const updatedUser = res?.data?.data || res?.data;
      if (updatedUser) {
        const newAvatar = updatedUser.avatarUrl !== undefined ? updatedUser.avatarUrl : null;
        const newBanner = updatedUser.bannerUrl !== undefined ? updatedUser.bannerUrl : null;
        setUserProfile((prev) => ({
          ...prev,
          ...updatedUser,
          avatarUrl: newAvatar || "",
          bannerUrl: newBanner || "",
        }));
        setAvatarPreview(newAvatar || "");
        setBannerPreview(newBanner || "");
        setAvatarFile(null);
        setBannerFile(null);
        if (avatarInputRef.current) avatarInputRef.current.value = "";
        if (bannerInputRef.current) bannerInputRef.current.value = "";

        // Update stored user in localStorage for instant navbar avatar update
        try {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          storedUser.avatarUrl = newAvatar || "";
          storedUser.bannerUrl = newBanner || "";
          localStorage.setItem("user", JSON.stringify(storedUser));
          window.dispatchEvent(new CustomEvent("userUpdated", { detail: updatedUser }));
        } catch (e) {}
      }
      toast.success("Profile & Identity details updated successfully!");
    } catch (err) {
      console.error("Failed to save identity:", err);
      toast.error("Failed to update identity. Saved locally.");
    } finally {
      setSavingIdentity(false);
    }
  };

  // Open Modal to Add/Edit Entity Item
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setModalImageFile(null);

    const initialPreview =
      item?.imageUrl ||
      item?.iconUrl ||
      item?.institutionLogoUrl ||
      item?.certificateImageUrl ||
      item?.badgeImageUrl ||
      "";
    setModalImagePreview(initialPreview);

    if (type === "project") {
      setFormData(
        item || {
          title: "",
          category: "Web Development",
          shortDescription: "",
          description: "",
          technologies: "",
          projectUrl: "",
          githubUrl: "",
          startDate: "",
          endDate: "",
          isOngoing: false,
          isFeatured: true,
          imageUrl: "",
        }
      );
    } else if (type === "skill") {
      setFormData(
        item || {
          name: "",
          category: "Frontend",
          proficiencyLevel: "INTERMEDIATE",
          yearsOfExperience: 1.0,
          isFeatured: true,
          iconUrl: "",
        }
      );
    } else if (type === "education") {
      setFormData(
        item || {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          grade: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
          activities: "",
          description: "",
          institutionLogoUrl: "",
        }
      );
    } else if (type === "cert") {
      setFormData(
        item || {
          name: "",
          issuingOrganization: "",
          issueDate: "",
          expirationDate: "",
          doesNotExpire: false,
          credentialId: "",
          credentialUrl: "",
          certificateImageUrl: "",
        }
      );
    } else if (type === "achievement") {
      setFormData(
        item || {
          title: "",
          issuer: "",
          issueDate: "",
          description: "",
          referenceUrl: "",
          isFeatured: true,
          badgeImageUrl: "",
        }
      );
    } else if (type === "link") {
      setFormData(
        item || {
          title: "",
          url: "",
          platform: "GITHUB",
          isActive: true,
          isFeatured: false,
          iconUrl: "",
        }
      );
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
    setFormData({});
    setModalImageFile(null);
    setModalImagePreview("");
  };

  // Submit Modal Form (Create or Update Category Entity) with Image Upload
  const handleSaveModalItem = async (e) => {
    e.preventDefault();
    setSavingItem(true);
    try {
      // Build FormData payload when a new image file is chosen, otherwise send JSON
      let submissionPayload = formData;
      if (modalImageFile) {
        const multipart = new FormData();
        multipart.append("image", modalImageFile);
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined && key !== "image") {
            multipart.append(key, formData[key]);
          }
        });
        submissionPayload = multipart;
      }

      if (modalType === "project") {
        if (editingItem?.id) {
          const res = await projectsApi.update(editingItem.id, submissionPayload);
          const updated = res.data?.data || res.data || { ...formData, imageUrl: modalImagePreview };
          setProjects((prev) => prev.map((p) => (p.id === editingItem.id ? { ...p, ...updated } : p)));
          toast.success("Project updated!");
        } else {
          const res = await projectsApi.create(submissionPayload);
          const created = res.data?.data || res.data || { ...formData, imageUrl: modalImagePreview, id: Date.now() };
          setProjects((prev) => [created, ...prev]);
          toast.success("Project added successfully!");
        }
      } else if (modalType === "skill") {
        if (editingItem?.id) {
          const res = await skillsApi.update(editingItem.id, submissionPayload);
          const updated = res.data?.data || res.data || { ...formData, iconUrl: modalImagePreview };
          setSkills((prev) => prev.map((s) => (s.id === editingItem.id ? { ...s, ...updated } : s)));
          toast.success("Skill updated!");
        } else {
          const res = await skillsApi.create(submissionPayload);
          const created = res.data?.data || res.data || { ...formData, iconUrl: modalImagePreview, id: Date.now() };
          setSkills((prev) => [created, ...prev]);
          toast.success("Skill added successfully!");
        }
      } else if (modalType === "education") {
        if (editingItem?.id) {
          const res = await educationApi.update(editingItem.id, submissionPayload);
          const updated = res.data?.data || res.data || { ...formData, institutionLogoUrl: modalImagePreview };
          setEducation((prev) => prev.map((e) => (e.id === editingItem.id ? { ...e, ...updated } : e)));
          toast.success("Education record updated!");
        } else {
          const res = await educationApi.create(submissionPayload);
          const created = res.data?.data || res.data || { ...formData, institutionLogoUrl: modalImagePreview, id: Date.now() };
          setEducation((prev) => [created, ...prev]);
          toast.success("Education record added!");
        }
      } else if (modalType === "cert") {
        if (editingItem?.id) {
          const res = await certificationsApi.update(editingItem.id, submissionPayload);
          const updated = res.data?.data || res.data || { ...formData, certificateImageUrl: modalImagePreview };
          setCertifications((prev) => prev.map((c) => (c.id === editingItem.id ? { ...c, ...updated } : c)));
          toast.success("Certification updated!");
        } else {
          const res = await certificationsApi.create(submissionPayload);
          const created = res.data?.data || res.data || { ...formData, certificateImageUrl: modalImagePreview, id: Date.now() };
          setCertifications((prev) => [created, ...prev]);
          toast.success("Certification added!");
        }
      } else if (modalType === "achievement") {
        if (editingItem?.id) {
          const res = await achievementsApi.update(editingItem.id, submissionPayload);
          const updated = res.data?.data || res.data || { ...formData, badgeImageUrl: modalImagePreview };
          setAchievements((prev) => prev.map((a) => (a.id === editingItem.id ? { ...a, ...updated } : a)));
          toast.success("Achievement updated!");
        } else {
          const res = await achievementsApi.create(submissionPayload);
          const created = res.data?.data || res.data || { ...formData, badgeImageUrl: modalImagePreview, id: Date.now() };
          setAchievements((prev) => [created, ...prev]);
          toast.success("Achievement added!");
        }
      } else if (modalType === "link") {
        if (editingItem?.id) {
          const res = await linksApi.update(editingItem.id, submissionPayload);
          const updated = res.data?.data || res.data || { ...formData, iconUrl: modalImagePreview };
          setUserLinks((prev) => prev.map((l) => (l.id === editingItem.id ? { ...l, ...updated } : l)));
          toast.success("Social badge updated!");
        } else {
          const res = await linksApi.create(submissionPayload);
          const created = res.data?.data || res.data || { ...formData, iconUrl: modalImagePreview, id: Date.now() };
          setUserLinks((prev) => [created, ...prev]);
          toast.success("Social badge added!");
        }
      }
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to save details. Please check the fields.");
    } finally {
      setSavingItem(false);
    }
  };

  // Delete an Entity Item
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (type === "project") {
        await projectsApi.delete(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else if (type === "skill") {
        await skillsApi.delete(id);
        setSkills((prev) => prev.filter((s) => s.id !== id));
      } else if (type === "education") {
        await educationApi.delete(id);
        setEducation((prev) => prev.filter((e) => e.id !== id));
      } else if (type === "cert") {
        await certificationsApi.delete(id);
        setCertifications((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "achievement") {
        await achievementsApi.delete(id);
        setAchievements((prev) => prev.filter((a) => a.id !== id));
      } else if (type === "link") {
        await linksApi.delete(id);
        setUserLinks((prev) => prev.filter((l) => l.id !== id));
      }
      toast.success("Item deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete item.");
    }
  };

  const categories = [
    { id: "identity", label: "Profile & Identity", icon: <FaUser />, count: null },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram />, count: projects.length },
    { id: "skills", label: "Skills", icon: <FaTools />, count: skills.length },
    { id: "education", label: "Education", icon: <FaGraduationCap />, count: education.length },
    { id: "certifications", label: "Certifications", icon: <FaCertificate />, count: certifications.length },
    { id: "achievements", label: "Achievements", icon: <FaTrophy />, count: achievements.length },
    { id: "social", label: "Social Badges", icon: <FaLink />, count: userLinks.length },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout containerClassName="w-full space-y-6 flex flex-col bg-transparent animate-fadeIn text-left">
      {/* Top Banner & Live Link Bar */}
      <div className="rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 bg-slate-900">
        {bannerPreview && (
          <img
            src={bannerPreview.startsWith("data:") ? bannerPreview : resolveImageUrl(bannerPreview)}
            alt="Banner Cover"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg shadow-emerald-500/20">
                {avatarPreview ? (
                  <img
                    src={avatarPreview.startsWith("data:") ? avatarPreview : resolveImageUrl(avatarPreview)}
                    alt={userProfile.fullName || "User"}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex";
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <div
                  style={{ display: avatarPreview ? "none" : "flex" }}
                  className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-2xl items-center justify-center"
                >
                  {(userProfile.fullName || "User").charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                <FaCamera className="text-white text-sm" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">{userProfile.fullName || "Your Portfolio"}</h1>
                {userProfile.hasActiveSubscription && (
                  <span className="text-[10px] font-black text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1 shadow-xs">
                    <FaStar size={9} /> PRO MEMBER
                  </span>
                )}
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  LIVE PORTFOLIO
                </span>
                {userProfile.activeTemplateCode && (
                  <span className="text-[10px] font-bold text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-500/30">
                    {userProfile.activeTemplateCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {userProfile.username ? `@${userProfile.username} • ` : ""}
                {userProfile.customProfessionTitle || userProfile.headline || "Configure your portfolio media & details"}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-300 font-medium">
                {userProfile.location && (
                  <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} className="text-emerald-400" /> {userProfile.location}</span>
                )}
                <span className="flex items-center gap-1"><FaEye size={10} className="text-teal-400" /> {userProfile.totalProfileViews || 0} views</span>
                <span className="flex items-center gap-1"><FaMousePointer size={10} className="text-sky-400" /> {userProfile.totalLinkClicks || 0} clicks</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Portfolio URL */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl p-1.5 pl-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 shrink-0">Folio:</span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-[180px]">{publicPortfolioUrl}</span>
              <button
                onClick={handleCopyPortfolioUrl}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                title="Copy Portfolio URL"
              >
                {copiedPortfolioUrl ? <FaCheck size={11} /> : <FaCopy size={11} />}
              </button>
              <a
                href={publicPortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <FaExternalLinkAlt size={10} /> View
              </a>
            </div>

            {/* Linktree URL */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl p-1.5 pl-3">
              <span className="text-[10px] uppercase font-black tracking-wider text-teal-400 shrink-0">Bio:</span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-[180px]">{publicLinktreeUrl}</span>
              <button
                onClick={handleCopyLinktreeUrl}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                title="Copy Linktree URL"
              >
                {copiedLinktreeUrl ? <FaCheck size={11} /> : <FaCopy size={11} />}
              </button>
              <a
                href={publicLinktreeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <FaExternalLinkAlt size={10} /> View
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <span className={isActive ? "text-emerald-400" : "text-slate-400"}>{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.count !== null && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? "bg-emerald-500 text-slate-950" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* CATEGORY 1: USER IDENTITY & PERSONAL INFO (WITH AVATAR & BANNER UPLOAD) */}
      {activeCategory === "identity" && (
        <form onSubmit={handleSaveIdentity} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Personal & Professional Identity</h2>
                {userProfile.hasActiveSubscription && (
                  <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <FaStar size={9} className="text-amber-500" /> PRO MEMBER
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Manage your public portfolio appearance, bio, media assets, and verified contact details
              </p>
            </div>
            <button
              type="submit"
              disabled={savingIdentity}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <FaSave size={13} /> {savingIdentity ? "Saving Updates..." : "Save Identity Details"}
            </button>
          </div>

          {/* ===== LIVE IDENTITY SHOWCASE CARD ===== */}
          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-slate-900 text-white relative">
            {/* Cover Banner with smooth fallback */}
            <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">
              {bannerPreview ? (
                <img
                  src={bannerPreview.startsWith("data:") ? bannerPreview : resolveImageUrl(bannerPreview)}
                  alt="Cover Banner"
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  className="w-full h-full object-cover object-center"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Status Pills inside banner */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${
                  userProfile.isProfilePublic
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-slate-800/80 text-slate-300 border-slate-700"
                }`}>
                  {userProfile.isProfilePublic ? "● Public Portfolio" : "○ Private"}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-slate-800/80 text-slate-300 border border-slate-700">
                  {userProfile.authProvider === "GOOGLE" ? "Google Verified" : "Email Account"}
                </span>
              </div>
            </div>

            {/* Profile Info Overlay */}
            <div className="p-6 relative -mt-16 sm:-mt-20 z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                {/* Avatar with ring */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-slate-900 bg-slate-800 shadow-xl overflow-hidden shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview.startsWith("data:") ? avatarPreview : resolveImageUrl(avatarPreview)}
                      alt={userProfile.fullName || "Avatar"}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex";
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <div
                    style={{ display: avatarPreview ? "none" : "flex" }}
                    className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-3xl sm:text-4xl items-center justify-center"
                  >
                    {(userProfile.fullName || "U").charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">{userProfile.fullName || "Your Full Name"}</h3>
                    <span className="text-xs text-slate-400 font-mono">@{userProfile.username || "username"}</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-bold">
                    {userProfile.customProfessionTitle || userProfile.headline || "Professional Headline"}
                  </p>
                  <p className="text-[11px] text-slate-300 max-w-xl line-clamp-2 mt-0.5">
                    {userProfile.bio || "No biography provided yet. Add your story below."}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    {userProfile.location && (
                      <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} className="text-emerald-400" /> {userProfile.location}</span>
                    )}
                    {userProfile.contactEmail && (
                      <span className="flex items-center gap-1"><FaEnvelope size={10} className="text-teal-400" /> {userProfile.contactEmail}</span>
                    )}
                    {userProfile.phoneNumber && (
                      <span className="flex items-center gap-1"><FaPhone size={10} className="text-sky-400" /> {userProfile.phoneNumber}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges & Metrics */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                    {userProfile.activeTemplateCode || "BENTO_GRID_PRO"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                  <span className="bg-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <FaEye size={10} className="text-teal-400" /> {userProfile.totalProfileViews || 0} views
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <FaMousePointer size={10} className="text-emerald-400" /> {userProfile.totalLinkClicks || 0} clicks
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== VISUAL MEDIA MANAGEMENT (BANNER & AVATAR) ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header Banner Card */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FaImage className="text-emerald-600" /> Cover Banner Image
                  </label>
                  <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    Recommended: 1200 x 400
                  </span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-200 h-32 flex items-center justify-center">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview.startsWith("data:") ? bannerPreview : resolveImageUrl(bannerPreview)}
                      alt="Banner Preview"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex";
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <div
                    style={{ display: bannerPreview ? "none" : "flex" }}
                    className="w-full h-full text-center text-slate-400 flex flex-col items-center justify-center"
                  >
                    <FaImage size={24} className="mx-auto mb-1 opacity-40" />
                    <span className="text-[11px] font-medium">No banner chosen</span>
                  </div>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {/* Direct Banner URL Input */}
                <div className="mt-3 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Or Paste Direct Banner URL (Cloudflare / CDN):</label>
                  <input
                    type="url"
                    value={userProfile.bannerUrl || ""}
                    onChange={(e) => {
                      setUserProfile({ ...userProfile, bannerUrl: e.target.value });
                      setBannerPreview(e.target.value);
                    }}
                    placeholder="https://cdn.bytebodh.in/banners/cover.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FaCloudUploadAlt /> Upload File
                </button>
                {bannerPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview("");
                      setUserProfile({ ...userProfile, bannerUrl: "" });
                    }}
                    className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Remove Banner
                  </button>
                )}
              </div>
            </div>

            {/* Profile Avatar Card */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FaUser className="text-emerald-600" /> Profile Picture / Avatar
                  </label>
                  <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                    Square 400 x 400
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-2xl border-2 border-white shadow-md overflow-hidden cursor-pointer group shrink-0"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview.startsWith("data:") ? avatarPreview : resolveImageUrl(avatarPreview)}
                        alt="Avatar Preview"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = "flex";
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div
                      style={{ display: avatarPreview ? "none" : "flex" }}
                      className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-2xl items-center justify-center"
                    >
                      {(userProfile.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      <FaCamera size={14} className="text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Or Paste Direct Avatar URL (Google / Cloudflare):</label>
                    <input
                      type="url"
                      value={userProfile.avatarUrl || ""}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, avatarUrl: e.target.value });
                        setAvatarPreview(e.target.value);
                      }}
                      placeholder="https://lh3.googleusercontent.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FaCloudUploadAlt /> Upload File
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview("");
                      setUserProfile({ ...userProfile, avatarUrl: "" });
                    }}
                    className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ===== FORM FIELDS: IDENTITY & DETAILS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Display Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Display Name *</label>
              <input
                type="text"
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Headline / Tagline</label>
              <input
                type="text"
                value={userProfile.headline}
                onChange={(e) => setUserProfile({ ...userProfile, headline: e.target.value })}
                placeholder="e.g. Senior Full Stack Engineer building scalable systems"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            {/* Primary Account Email (Read-Only) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Account Login Email</span>
                <span className="text-[10px] text-emerald-600 font-bold lowercase flex items-center gap-1">
                  <FaCheckCircle size={10} /> Verified
                </span>
              </label>
              <input
                type="email"
                value={userProfile.email}
                readOnly
                disabled
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Public Contact Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Public Contact Email</label>
              <input
                type="email"
                value={userProfile.contactEmail}
                onChange={(e) => setUserProfile({ ...userProfile, contactEmail: e.target.value })}
                placeholder="e.g. contact@rahul.dev"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            {/* Profession Category Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Profession Category</label>
              <select
                value={userProfile.professionCategory}
                onChange={(e) => setUserProfile({ ...userProfile, professionCategory: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 bg-white"
              >
                {PROFESSION_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Profession Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Niche Title</label>
              <input
                type="text"
                value={userProfile.customProfessionTitle}
                onChange={(e) => setUserProfile({ ...userProfile, customProfessionTitle: e.target.value })}
                placeholder="e.g. Full-Stack iOS Engineer or Cloud Architect"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location / City</label>
              <input
                type="text"
                value={userProfile.location}
                onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
                placeholder="e.g. Bengaluru, India or San Francisco, CA"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone / WhatsApp</label>
              <input
                type="text"
                value={userProfile.phoneNumber}
                onChange={(e) => setUserProfile({ ...userProfile, phoneNumber: e.target.value })}
                placeholder="e.g. +91 9876543210"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
            </div>

            {/* Accent Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Theme Accent Color</label>
              <div className="flex items-center gap-2.5 pt-1">
                {ACCENT_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => setUserProfile({ ...userProfile, themeAccentColor: col.hex })}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                      userProfile.themeAccentColor === col.hex ? "scale-125 border-slate-900 shadow-md" : "border-white"
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.label}
                  />
                ))}
                <input
                  type="color"
                  value={userProfile.themeAccentColor}
                  onChange={(e) => setUserProfile({ ...userProfile, themeAccentColor: e.target.value })}
                  className="w-8 h-8 rounded-full border border-slate-200 cursor-pointer p-0.5 bg-transparent ml-2"
                />
              </div>
            </div>

            {/* Visibility & Dark Mode Toggles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Display & Preferences</label>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={userProfile.isProfilePublic}
                    onChange={(e) => setUserProfile({ ...userProfile, isProfilePublic: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>Public Portfolio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={userProfile.isDarkModeEnabled}
                    onChange={(e) => setUserProfile({ ...userProfile, isDarkModeEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1"><FaMoon size={11} /> Dark Mode</span>
                </label>
              </div>
            </div>
          </div>

          {/* Bio / Summary */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">About Me & Biography</label>
            <textarea
              rows={4}
              value={userProfile.bio}
              onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
              placeholder="Write a concise overview of your background, experience, and passions..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={savingIdentity}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FaSave size={13} /> {savingIdentity ? "Saving..." : "Save Identity Details"}
            </button>
          </div>
        </form>
      )}

      {/* CATEGORY 2: PROJECTS (WITH PROJECT COVER IMAGE UPLOAD) */}
      {activeCategory === "projects" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Featured Projects</h2>
              <p className="text-xs text-slate-400 font-medium">Showcase work samples with live cover thumbnails and repository links</p>
            </div>
            <button
              onClick={() => openModal("project")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaPlus size={10} /> Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <FaProjectDiagram className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No projects added yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Add your best projects with cover images to impress recruiters.</p>
              <button
                onClick={() => openModal("project")}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + Add First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between space-y-3">
                  <div>
                    {/* Project Cover Image */}
                    {proj.imageUrl && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-200 border border-slate-200/80">
                        <img
                          src={resolveImageUrl(proj.imageUrl)}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                          {proj.category || "Project"}
                        </span>
                        <h3 className="text-sm font-black text-slate-800 mt-0.5">{proj.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openModal("project", proj)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem("project", proj.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    {proj.shortDescription && (
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1.5">{proj.shortDescription}</p>
                    )}
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {proj.technologies.split(",").map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs font-bold">
                    {proj.projectUrl && (
                      <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
                        <FaExternalLinkAlt size={10} /> Live Demo
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-slate-700 hover:underline flex items-center gap-1">
                        <FaGithub size={12} /> Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORY 3: SKILLS (WITH ICON UPLOAD) */}
      {activeCategory === "skills" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Skills & Tech Stack</h2>
              <p className="text-xs text-slate-400 font-medium">Categorized proficiencies with custom brand icons</p>
            </div>
            <button
              onClick={() => openModal("skill")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaPlus size={10} /> Add Skill
            </button>
          </div>

          {skills.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <FaTools className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No skills added yet</p>
              <button
                onClick={() => openModal("skill")}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + Add First Skill
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {skill.iconUrl ? (
                      <img
                        src={resolveImageUrl(skill.iconUrl)}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="w-8 h-8 rounded-lg object-contain bg-white p-1 border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        {skill.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{skill.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        {skill.category || "General"} • {skill.proficiencyLevel || "INTERMEDIATE"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal("skill", skill)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem("skill", skill.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORY 4: EDUCATION (WITH INSTITUTION LOGO UPLOAD) */}
      {activeCategory === "education" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Academic Background</h2>
              <p className="text-xs text-slate-400 font-medium">Universities and degrees with institution logos</p>
            </div>
            <button
              onClick={() => openModal("education")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaPlus size={10} /> Add Education
            </button>
          </div>

          {education.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <FaGraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No education records added yet</p>
              <button
                onClick={() => openModal("education")}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + Add Education Record
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex items-start justify-between">
                  <div className="flex items-start gap-3.5">
                    {edu.institutionLogoUrl ? (
                      <img
                        src={resolveImageUrl(edu.institutionLogoUrl)}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0 mt-0.5"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                        <FaGraduationCap size={16} />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-800">{edu.institution}</h3>
                        {edu.grade && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.2 rounded-full">
                            {edu.grade}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-bold">
                        {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                      </p>
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                          <FaCalendarAlt size={9} /> {edu.startDate || "Started"} — {edu.isCurrent ? "Present" : edu.endDate || "Completed"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal("education", edu)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem("education", edu.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORY 5: CERTIFICATIONS (WITH BADGE / PROOF UPLOAD) */}
      {activeCategory === "certifications" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Certifications & Licenses</h2>
              <p className="text-xs text-slate-400 font-medium">Verified credentials with digital badges and proof documents</p>
            </div>
            <button
              onClick={() => openModal("cert")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaPlus size={10} /> Add Certification
            </button>
          </div>

          {certifications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <FaCertificate className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No certifications added yet</p>
              <button
                onClick={() => openModal("cert")}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + Add Certification
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    {c.certificateImageUrl ? (
                      <img
                        src={resolveImageUrl(c.certificateImageUrl)}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                        <FaCertificate />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-black text-slate-800">{c.name}</h4>
                          <p className="text-[11px] text-slate-500 font-bold mt-0.5">{c.issuingOrganization}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openModal("cert", c)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("cert", c.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                      {c.credentialId && (
                        <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {c.credentialId}</p>
                      )}
                    </div>
                  </div>
                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-600 hover:underline font-bold mt-3 pt-2 border-t border-slate-100 flex items-center gap-1"
                    >
                      <FaExternalLinkAlt size={9} /> Verify Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORY 6: ACHIEVEMENTS (WITH PHOTO / TROPHY UPLOAD) */}
      {activeCategory === "achievements" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Honors & Achievements</h2>
              <p className="text-xs text-slate-400 font-medium">Hackathon trophies, competitions, and recognized milestones</p>
            </div>
            <button
              onClick={() => openModal("achievement")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaPlus size={10} /> Add Achievement
            </button>
          </div>

          {achievements.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <FaTrophy className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No achievements recorded</p>
              <button
                onClick={() => openModal("achievement")}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + Add First Achievement
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex items-start justify-between">
                  <div className="flex items-start gap-3.5">
                    {ach.badgeImageUrl ? (
                      <img
                        src={resolveImageUrl(ach.badgeImageUrl)}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
                        <FaAward />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-800">{ach.title}</h4>
                      </div>
                      {ach.issuer && <p className="text-[11px] text-slate-500 font-semibold">{ach.issuer}</p>}
                      {ach.description && <p className="text-xs text-slate-600 font-normal mt-1">{ach.description}</p>}
                      {ach.referenceUrl && (
                        <a href={ach.referenceUrl} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-600 hover:underline font-bold inline-flex items-center gap-1 pt-1">
                          <FaExternalLinkAlt size={8} /> Reference Link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal("achievement", ach)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem("achievement", ach.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORY 7: SOCIAL BADGES */}
      {activeCategory === "social" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Portfolio Social Badges</h2>
              <p className="text-xs text-slate-400 font-medium">Links displayed in your portfolio header & footer</p>
            </div>
            <button
              onClick={() => openModal("link")}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaPlus size={10} /> Add Badge Link
            </button>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-teal-100 text-teal-700 rounded-xl text-sm font-bold">🔗</span>
              <div>
                <h4 className="text-xs font-bold text-teal-900">Dedicated Linktree (Bio Links) Screen</h4>
                <p className="text-[11px] text-teal-700 font-medium">Manage your Instagram bio links with smartphone preview and click analytics separately.</p>
              </div>
            </div>
            <a
              href="/linktree"
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shrink-0 shadow-sm"
            >
              Open Linktree Manager →
            </a>
          </div>

          {userLinks.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
              <FaLink className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No social badges added yet</p>
              <button
                onClick={() => openModal("link")}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                + Add Social Badge
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userLinks.map((link) => (
                <div key={link.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {link.iconUrl ? (
                      <img
                        src={resolveImageUrl(link.iconUrl)}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="w-8 h-8 rounded-xl object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {link.platform ? link.platform.charAt(0) : "🔗"}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-800 truncate">{link.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openModal("link", link)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem("link", link.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL FOR ADDING / EDITING ENTITY ITEMS (WITH IMAGE UPLOAD) */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">
                {editingItem ? "Edit" : "Add"}{" "}
                {modalType === "project" && "Project"}
                {modalType === "skill" && "Skill"}
                {modalType === "education" && "Education Record"}
                {modalType === "cert" && "Certification"}
                {modalType === "achievement" && "Achievement"}
                {modalType === "link" && "Social Badge"}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveModalItem} className="space-y-4 text-left">
              {/* IMAGE UPLOAD DROPZONE COMPONENT FOR MODAL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">
                  {modalType === "project" && "Project Cover / Screenshot"}
                  {modalType === "skill" && "Skill Icon / Logo"}
                  {modalType === "education" && "Institution / University Logo"}
                  {modalType === "cert" && "Certificate Document / Badge"}
                  {modalType === "achievement" && "Award Photo / Medal"}
                  {modalType === "link" && "Custom Icon"}
                </label>

                <div
                  onClick={() => modalFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/20"
                >
                  {modalImagePreview ? (
                    <div className="relative group w-full flex flex-col items-center">
                      <img
                        src={modalImagePreview.startsWith("data:") ? modalImagePreview : resolveImageUrl(modalImagePreview)}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="max-h-36 rounded-xl object-contain border border-slate-200 shadow-xs mb-2"
                      />
                      <span className="text-[11px] font-bold text-emerald-600 hover:underline">
                        Click to change photo
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2 text-slate-400">
                      <FaCloudUploadAlt size={28} className="mb-1 text-slate-300" />
                      <span className="text-xs font-bold text-slate-700">Click to upload image</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WebP up to 5MB</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={handleModalImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* PROJECT FORM FIELDS */}
              {modalType === "project" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Distributed Task Orchestrator"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Domain Category</label>
                    <input
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Backend / Distributed Systems"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={formData.shortDescription || ""}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="One-sentence elevator pitch"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Explain the problem solved, architecture, and impact..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      value={formData.technologies || ""}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="e.g. Java, Spring Boot, Redis, Kafka, AWS"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Live Demo URL</label>
                      <input
                        type="url"
                        value={formData.projectUrl || ""}
                        onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        value={formData.githubUrl || ""}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* SKILL FORM FIELDS */}
              {modalType === "skill" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Skill Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. React.js, Spring Boot, Python, Docker"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Frontend, Backend, Cloud & DevOps, Database"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Proficiency Level</label>
                    <select
                      value={formData.proficiencyLevel || "INTERMEDIATE"}
                      onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      {SKILL_PROFICIENCIES.map((lvl) => (
                        <option key={lvl.value} value={lvl.value}>
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.yearsOfExperience || 1}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* EDUCATION FORM FIELDS */}
              {modalType === "education" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Institution / College Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.institution || ""}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g. Stanford University or IIT Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Degree / Qualification *</label>
                    <input
                      type="text"
                      required
                      value={formData.degree || ""}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="e.g. B.Tech / Bachelor of Science"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Major / Field of Study</label>
                    <input
                      type="text"
                      value={formData.fieldOfStudy || ""}
                      onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Grade / CGPA</label>
                    <input
                      type="text"
                      value={formData.grade || ""}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="e.g. 8.8 / 10 CGPA or 3.9 GPA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* CERTIFICATION FORM FIELDS */}
              {modalType === "cert" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Certification Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Issuing Organization *</label>
                    <input
                      type="text"
                      required
                      value={formData.issuingOrganization || ""}
                      onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                      placeholder="e.g. Amazon Web Services, Google Cloud"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Credential ID</label>
                    <input
                      type="text"
                      value={formData.credentialId || ""}
                      onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                      placeholder="e.g. AWS-123456789"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Verification URL</label>
                    <input
                      type="url"
                      value={formData.credentialUrl || ""}
                      onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* ACHIEVEMENT FORM FIELDS */}
              {modalType === "achievement" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Achievement Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. 1st Place - Smart India Hackathon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Issuer / Organization</label>
                    <input
                      type="text"
                      value={formData.issuer || ""}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      placeholder="e.g. Ministry of Education & AICTE"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Significance of achievement or prize..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Reference / Credential Link</label>
                    <input
                      type="url"
                      value={formData.referenceUrl || ""}
                      onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* SOCIAL LINK FORM FIELDS */}
              {modalType === "link" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Platform</label>
                    <select
                      value={formData.platform || "GITHUB"}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-white"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Link Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. GitHub Profile"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Destination URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.url || ""}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {savingItem ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

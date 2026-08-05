import axios from "axios";
import {
  getAccessToken,
  handleUnauthorizedError,
} from "../services/auth";
import API_BASE_URL from "../config/api";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorizedError(error, api)
);

/* =========================
   PROFILE APIs
========================= */

export const getMyProfile = () => api.get("/api/profile");

export const createProfile = (data) => {
  if (data instanceof FormData) {
    return api.post("/api/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  return api.post("/api/profile", data);
};

export const updateProfile = (data) => {
  if (data instanceof FormData) {
    return api.put("/api/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
  return api.put("/api/profile", data);
};


export const deleteProfile = () => api.delete("/api/profile");

export const getPublicProfileByUsername = (username) =>axios.get(`${API_BASE_URL}/api/profile/public/${username}`);

export const createContactMessage = (data) => axios.post(`${API_BASE_URL}/api/contact`, data);

export const getContactMessages = () => api.get("/api/contact/my-messages");

export const getUserStats = () => api.get("/api/users/me/stats");

/* =========================
   TASK APIs
========================= */

// Create a new task
export const createTask = (taskData) => 
  api.post('/api/tasks', taskData);

// Get all tasks for the current user
export const getTasks = () => 
  api.get('/api/tasks');

// Update a task
export const updateTask = (id, taskData) => 
  api.put(`/api/tasks/${id}`, taskData);

// Delete a task
export const deleteTask = (id) => 
  api.delete(`/api/tasks/${id}`);

// Mark task as complete
export const completeTask = (id) => 
  api.put(`/api/tasks/${id}/complete`);

export const dashboardStats = () => 
  api.get('/api/dashboard/summary');

export const contact =(data)=>{
  api.post('/api/contact', data)
}

/* =========================
   REFERRAL APIs
========================= */
export const getMyReferrals = () => 
  api.get('/api/referrals/my-referrals');

export const applyReferralCode = (referralCode) => 
  api.post('/api/referrals/apply-referral-code', { referralCode });

/* =========================
   PROJECT & CERTIFICATION INDIVIDUAL APIs
   (Supports Multipart Image Uploads)
========================= */
export const addProject = (formData) => 
  api.post('/api/profile/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const deleteProject = (id) => 
  api.delete(`/api/profile/projects/${id}`);

export const addCertification = (formData) => 
  api.post('/api/profile/certifications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const deleteCertification = (id) => 
  api.delete(`/api/profile/certifications/${id}`);

/* =========================
   CUSTOM DOMAIN APIs
========================= */
export const getMyCustomDomain = () => 
  api.get('/api/custom-domain/my-domain');

export const checkCustomDomain = (domainName) => 
  api.get(`/api/custom-domain/check?domainName=${encodeURIComponent(domainName)}`);

export const createCustomDomainOrder = (dto) => 
  api.post('/api/payment/custom-domain/create-order', dto);

export const getCustomDomainConfig = () => 
  api.get('/api/admin/custom-domain-config');

export const updateCustomDomainConfig = (request) => 
  api.put('/api/admin/custom-domain-config', request);

/* =========================
   NOTIFICATION APIs
========================= */
export const getMyNotifications = () => 
  api.get('/api/notifications');

export const markNotificationRead = (id) => 
  api.put(`/api/notifications/${id}/read`);

export const markAllNotificationsRead = () => 
  api.put('/api/notifications/read-all');

export const deleteNotification = (id) => 
  api.delete(`/api/notifications/${id}`);

export const deleteAllNotifications = () => 
  api.delete('/api/notifications/all');

/* =========================
   USER BLOG APIs
   Base: /api/profile/blogs
========================= */
export const getMyBlogs = () =>
  api.get('/api/profile/blogs');

export const getBlogById = (id) =>
  api.get(`/api/profile/blogs/${id}`);

export const createBlog = (formData) =>
  api.post('/api/profile/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const updateBlog = (id, formData) =>
  api.put(`/api/profile/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteUserBlog = (id) =>
  api.delete(`/api/profile/blogs/${id}`);

export const getBlogsByUsername = (username) =>
  api.get(`/api/profile/blogs/public/${username}`);
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAuthData,
  logout,
} from "../services/auth"; // 👈 the file where your axios code exists
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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const res = await api.post("/auth/refresh-token", { refreshToken });

        if (res.data?.success) {
          saveAuthData(res.data.data);
          originalRequest.headers.Authorization =
            `Bearer ${res.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (e) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

/* =========================
   PROFILE APIs
========================= */

export const getMyProfile = () => api.get("/api/profile");

export const createProfile = (data) => api.post("/api/profile", data);

export const updateProfile = (data) =>
  api.put("/api/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });


export const deleteProfile = () => api.delete("/api/profile");

export const getPublicProfileByUsername = (username) =>axios.get(`${API_BASE_URL}/api/profile/public/${username}`);

export const createContactMessage = (data) => axios.post(`${API_BASE_URL}/api/contact`, data);

export const getContactMessages = () => api.get("/api/contact/my-messages");

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
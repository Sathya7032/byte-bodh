import axios from "axios";
import {
  getAccessToken,
  handleUnauthorizedError,
} from "../services/auth";
import API_BASE_URL from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorizedError(error, api)
);

// Job Notification API methods
export const getJobNotifications = () => api.get("/api/job-notifications");
export const getJobNotificationById = (id) => api.get(`/api/job-notifications/${id}`);
export const createJobNotification = (data) => api.post("/api/job-notifications", data);
export const updateJobNotification = (id, data) => api.put(`/api/job-notifications/${id}`, data);
export const deleteJobNotification = (id) => api.delete(`/api/job-notifications/${id}`);
export const updateActiveStatus = (id, isActive) => api.patch(`/api/job-notifications/${id}/active?isActive=${isActive}`);

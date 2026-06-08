import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAuthData,
  logout,
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

// Template APIs
export const getAllTemplates = () => api.get("/api/templates");
export const getTemplateById = (id) => api.get(`/api/templates/${id}`);
export const activateTemplate = (id) => api.post(`/api/templates/${id}/activate`);
export const createTemplate = (data) => api.post("/api/templates", data);
export const updateTemplate = (id, data) => api.put(`/api/templates/${id}`, data);
export const deleteTemplate = (id) => api.delete(`/api/templates/${id}`);

// Payment APIs
export const createPaymentOrder = (dto) => api.post("/api/payment/create-order", dto);
export const verifyPayment = (dto) => api.post("/api/payment/verify", dto);
export const recordPaymentFailure = (dto) => api.post("/api/payment/failure", dto);
export const getPaymentHistory = () => api.get("/api/payment/history");
export const getAllPayments = () => api.get("/api/payment/admin/payments");

// Stats API
export const getUserStats = () => api.get("/api/users/me/stats");

// User Templates API
export const getUserTemplates = () => api.get("/api/users/me/templates");
export const getAllUserTemplates = () => api.get("/api/templates/admin/user-templates");

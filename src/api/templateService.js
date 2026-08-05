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

// Template APIs
export const getAllTemplates = () => api.get("/api/templates");
export const getTemplateById = (id) => api.get(`/api/templates/${id}`);
export const activateTemplate = (id) => api.post(`/api/templates/${id}/activate`);
export const createTemplate = (data) => api.post("/api/templates", data);
export const updateTemplate = (id, data) => api.put(`/api/templates/${id}`, data);
export const deleteTemplate = (id) => api.delete(`/api/templates/${id}`);

// Payment APIs
export const createPaymentOrder = (dto) => api.post("/api/payment/create-order", dto);
export const createCustomDomainOrder = (dto) => api.post("/api/payment/custom-domain/create-order", dto);
export const getCustomDomainConfig = () => api.get("/api/admin/custom-domain-config");
export const updateCustomDomainConfig = (data) => api.put("/api/admin/custom-domain-config", data);
export const verifyPayment = (dto) => api.post("/api/payment/verify", dto);
export const recordPaymentFailure = (dto) => api.post("/api/payment/failure", dto);
export const getPaymentHistory = () => api.get("/api/payment/history");
export const getAllPayments = () => api.get("/api/payment/admin/all");

// Stats API
export const getUserStats = () => api.get("/api/users/me/stats");

// User Templates API
export const getUserTemplates = () => api.get("/api/users/me/templates");
export const getAllUserTemplates = () => api.get("/api/templates/admin/user-templates");

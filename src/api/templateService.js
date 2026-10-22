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
export const getAllTemplates = () =>
  api.get("/api/v1/templates").catch(() => api.get("/api/templates"));
export const getTemplateById = (id) =>
  api.get(`/api/v1/templates/${id}`).catch(() => api.get(`/api/templates/${id}`));
export const activateTemplate = (id) =>
  api.post(`/api/v1/templates/${id}/activate`).catch(() => api.post(`/api/templates/${id}/activate`));
export const deactivateTemplate = (id) =>
  api.post(`/api/v1/templates/deactivate`).catch(() => api.post(`/api/v1/templates/${id}/deactivate`));
export const getMyActiveTemplate = () =>
  api.get("/api/v1/templates/my-template").catch(() => api.get("/api/templates/my-template"));
export const seedAllWebsiteTemplates = () =>
  api.post("/api/v1/admin/templates/seed-all").catch(() => api.post("/api/v1/templates/seed-all"));
export const createTemplate = (data) =>
  api.post("/api/v1/templates", data).catch(() => api.post("/api/templates", data));
export const updateTemplate = (id, data) =>
  api.put(`/api/v1/templates/${id}`, data).catch(() => api.put(`/api/templates/${id}`, data));
export const deleteTemplate = (id) =>
  api.delete(`/api/v1/templates/${id}`).catch(() => api.delete(`/api/templates/${id}`));

// Payment APIs
// NOTE: Templates are no longer purchased individually. Access to paid templates
// is unlocked by an active platform subscription. See src/api/subscriptionService.js
// for create-order / verify / failure / status endpoints under /api/payment/subscription/*.
export const createCustomDomainOrder = (dto) => api.post("/api/payment/custom-domain/create-order", dto);
export const getCustomDomainConfig = () => api.get("/api/admin/custom-domain-config");
export const updateCustomDomainConfig = (data) => api.put("/api/admin/custom-domain-config", data);
export const getPaymentHistory = () => api.get("/api/payment/history");
// Stats & User Templates API
export const getUserStats = () => api.get("/api/users/me/stats").catch(() => ({ data: {} }));
export const getUserTemplates = () => api.get("/api/users/me/templates").catch(() => ({ data: [] }));

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
  timeout: 30000,
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
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
        config.headers.delete("content-type");
      }
    }
  }
  return config;
});

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorizedError(error, api)
);

/* =========================
   PROFILE & IDENTITY APIs
========================= */
export const getMyProfile = () =>
  api.get("/api/v1/auth/me").catch(() => api.get("/api/profile"));

export const createProfile = (data) => {
  if (data instanceof FormData) {
    return api.post("/api/profile", data);
  }
  return api.post("/api/profile", data);
};

export const updateProfile = (data) => {
  return api
    .put("/api/v1/profile", data)
    .catch((err) => {
      if (err.response?.status === 404) {
        return api.put("/api/profile", data);
      }
      return Promise.reject(err);
    });
};

export const deleteProfile = () => api.delete("/api/profile");

export const getPublicProfileByUsername = (username) =>
  axios.get(`${API_BASE_URL}/api/profile/public/${username}`);

/* =========================
   CONTACT & INQUIRY APIs
========================= */
export const createContactMessage = (data) =>
  axios.post(`${API_BASE_URL}/api/contact`, data);

export const getContactMessages = () =>
  api
    .get("/api/contact/my-messages")
    .catch(() => api.get("/api/v1/contacts/my-messages"));

export const markContactMessageAsRead = (id) =>
  api
    .put(`/api/contact/${id}/read`)
    .catch(() => api.put(`/api/v1/contacts/${id}/read`));

export const deleteContactMessage = (id) =>
  api
    .delete(`/api/contact/${id}`)
    .catch(() => api.delete(`/api/v1/contacts/${id}`));

export const contact = (data) => api.post("/api/contact", data);

/* =========================
   CUSTOM DOMAIN APIs
========================= */
export const getMyCustomDomain = () =>
  api.get("/api/custom-domain/my-domain");

export const checkCustomDomain = (domainName) =>
  api.get(`/api/custom-domain/check?domainName=${encodeURIComponent(domainName)}`);

export const createCustomDomainOrder = (dto) =>
  api.post("/api/payment/custom-domain/create-order", dto);

export const getCustomDomainConfig = () =>
  api.get("/api/admin/custom-domain-config");

export const updateCustomDomainConfig = (request) =>
  api.put("/api/admin/custom-domain-config", request);

/* =========================
   NOTIFICATION APIs
========================= */
export const getMyNotifications = () =>
  api.get("/api/v1/notifications").catch(() => api.get("/api/notifications"));

export const markNotificationRead = (id) =>
  api.put(`/api/v1/notifications/${id}/read`).catch(() => api.put(`/api/notifications/${id}/read`));

export const markAllNotificationsRead = () =>
  api.put("/api/v1/notifications/read-all").catch(() => api.put("/api/notifications/read-all"));

export const deleteNotification = (id) =>
  api.delete(`/api/v1/notifications/${id}`).catch(() => api.delete(`/api/notifications/${id}`));

export const deleteAllNotifications = () =>
  api.delete("/api/v1/notifications/all").catch(() => api.delete("/api/notifications"));

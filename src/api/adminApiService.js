import axios from "axios";
import API_BASE_URL from "../config/api";
import { getAdminAccessToken, getAdminRefreshToken } from "../services/auth";

// Dedicated axios instance for Admin APIs with Bearer token injection
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Admin Access Token
adminApiClient.interceptors.request.use(
  (config) => {
    const adminToken = getAdminAccessToken();
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    const adminRefreshToken = getAdminRefreshToken();
    if (adminRefreshToken) {
      config.headers["X-Refresh-Token"] = adminRefreshToken;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
adminApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getAdminRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await axios.post(
            `${API_BASE_URL}/api/v1/admin/auth/refresh-token`,
            { refreshToken }
          );
          const newAccessToken = refreshRes.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem("adminAccessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return adminApiClient(originalRequest);
          }
        } catch (_refreshErr) {
          localStorage.removeItem("adminAccessToken");
          localStorage.removeItem("adminRefreshToken");
          localStorage.removeItem("admin");
          if (typeof window !== "undefined" && !window.location.pathname.includes("/admin-login")) {
            window.location.href = "/admin-login";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

// ===================================================================
// ADMIN AUTHENTICATION APIs (/api/v1/admin/auth)
// ===================================================================
export const adminAuthApi = {
  signin: (credentials) =>
    adminApiClient
      .post("/api/v1/admin/auth/signin", credentials)
      .catch(() => adminApiClient.post("/api/v1/admin/auth/login", credentials)),
  signup: (signupData) =>
    adminApiClient.post("/api/v1/admin/auth/signup", signupData),
  getMe: () =>
    adminApiClient.get("/api/v1/admin/auth/me"),
  refreshToken: (refreshToken) =>
    adminApiClient.post("/api/v1/admin/auth/refresh-token", { refreshToken }),
  changePassword: (passwordData) =>
    adminApiClient.post("/api/v1/admin/auth/change-password", passwordData),
  forgotPassword: (email) =>
    adminApiClient.post("/api/v1/admin/auth/forgot-password", { email }),
  resetPassword: (resetData) =>
    adminApiClient.post("/api/v1/admin/auth/reset-password", resetData),
  logout: (refreshToken) =>
    adminApiClient.post("/api/v1/admin/auth/logout", { refreshToken }),
};

// ===================================================================
// ADMIN SESSION MANAGEMENT APIs (/api/v1/admin/sessions)
// ===================================================================
export const adminSessionApi = {
  getActiveSessions: () =>
    adminApiClient.get("/api/v1/admin/sessions"),
  revokeSession: (sessionId) =>
    adminApiClient.delete(`/api/v1/admin/sessions/${sessionId}`),
  revokeAllOtherSessions: () =>
    adminApiClient.delete("/api/v1/admin/sessions/others"),
};

// ===================================================================
// ADMIN TEMPLATES MANAGEMENT APIs (/api/v1/admin/templates)
// ===================================================================
export const adminTemplateApi = {
  getAll: () =>
    adminApiClient
      .get("/api/v1/admin/templates")
      .catch(() => adminApiClient.get("/api/templates")),
  getById: (id) =>
    adminApiClient
      .get(`/api/v1/admin/templates/${id}`)
      .catch(() => adminApiClient.get(`/api/templates/${id}`)),
  create: (templateData) =>
    adminApiClient.post("/api/v1/admin/templates", templateData),
  update: (id, templateData) =>
    adminApiClient.put(`/api/v1/admin/templates/${id}`, templateData),
  toggle: (id) =>
    adminApiClient.patch(`/api/v1/admin/templates/${id}/toggle`),
  delete: (id) =>
    adminApiClient.delete(`/api/v1/admin/templates/${id}`),
  seedAll: () =>
    adminApiClient.post("/api/v1/admin/templates/seed-all"),
};

// ===================================================================
// ADMIN LINKTREE TEMPLATES MANAGEMENT APIs (/api/v1/admin/linktree-templates)
// ===================================================================
export const adminLinktreeTemplateApi = {
  getAll: (params = {}) =>
    adminApiClient.get("/api/v1/admin/linktree-templates", { params }),
  getById: (id) =>
    adminApiClient.get(`/api/v1/admin/linktree-templates/${id}`),
  create: (templateData) => {
    if (templateData instanceof FormData) {
      return adminApiClient.post("/api/v1/admin/linktree-templates", templateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return adminApiClient.post("/api/v1/admin/linktree-templates", templateData);
  },
  update: (id, templateData) => {
    if (templateData instanceof FormData) {
      return adminApiClient.put(`/api/v1/admin/linktree-templates/${id}`, templateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return adminApiClient.put(`/api/v1/admin/linktree-templates/${id}`, templateData);
  },
  delete: (id) =>
    adminApiClient.delete(`/api/v1/admin/linktree-templates/${id}`),
  toggleActive: (id) =>
    adminApiClient.patch(`/api/v1/admin/linktree-templates/${id}/toggle-active`),
  togglePremium: (id) =>
    adminApiClient.patch(`/api/v1/admin/linktree-templates/${id}/toggle-premium`),
  seedAll: () =>
    adminApiClient.post("/api/v1/linktree-templates/seed-all"),
};

// ===================================================================
// ADMIN SUBSCRIPTION PLANS APIs (/api/v1/admin/subscription-plans)
// ===================================================================
export const adminSubscriptionPlanApi = {
  getAll: () =>
    adminApiClient
      .get("/api/v1/admin/subscription-plans")
      .catch(() => adminApiClient.get("/api/v1/subscription-plans")),
  getById: (id) =>
    adminApiClient.get(`/api/v1/admin/subscription-plans/${id}`),
  create: (planData) =>
    adminApiClient.post("/api/v1/admin/subscription-plans", planData),
  update: (id, planData) =>
    adminApiClient.put(`/api/v1/admin/subscription-plans/${id}`, planData),
  toggle: (id) =>
    adminApiClient.patch(`/api/v1/admin/subscription-plans/${id}/toggle`),
  delete: (id) =>
    adminApiClient.delete(`/api/v1/admin/subscription-plans/${id}`),
};

// ===================================================================
// ADMIN SUBSCRIPTIONS GOVERNANCE APIs (/api/v1/admin/subscriptions)
// ===================================================================
export const adminSubscriptionApi = {
  getAll: () =>
    adminApiClient
      .get("/api/v1/admin/subscriptions")
      .catch(() => adminApiClient.get("/api/admin/subscriptions/subscribed-users")),
  grantAccess: (userId, planId, customDays) => {
    let url = `/api/v1/admin/subscriptions/grant-access?userId=${userId}&planId=${planId}`;
    if (customDays) url += `&customDays=${customDays}`;
    return adminApiClient.post(url);
  },
  cancel: (subscriptionId, reason) => {
    let url = `/api/v1/admin/subscriptions/${subscriptionId}/cancel`;
    if (reason) url += `?reason=${encodeURIComponent(reason)}`;
    return adminApiClient.post(url);
  },
};

// ===================================================================
// ADMIN USERS GOVERNANCE & AUDIT TRACKING APIs (/api/v1/admin/users)
// ===================================================================
export const adminUserApi = {
  getAll: (params = {}) =>
    adminApiClient.get("/api/v1/admin/users", { params }),
  getStats: () =>
    adminApiClient.get("/api/v1/admin/users/stats"),
  getById: (userId) =>
    adminApiClient.get(`/api/v1/admin/users/${userId}`),
  getHistory: (userId) =>
    adminApiClient.get(`/api/v1/admin/users/${userId}/history`),
  activate: (userId) =>
    adminApiClient.patch(`/api/v1/admin/users/${userId}/activate`),
  deactivate: (userId) =>
    adminApiClient.patch(`/api/v1/admin/users/${userId}/deactivate`),
  toggle: (userId) =>
    adminApiClient.patch(`/api/v1/admin/users/${userId}/toggle`),
};

const adminApiService = {
  auth: adminAuthApi,
  sessions: adminSessionApi,
  templates: adminTemplateApi,
  linktreeTemplates: adminLinktreeTemplateApi,
  plans: adminSubscriptionPlanApi,
  subscriptions: adminSubscriptionApi,
  users: adminUserApi,
};

export default adminApiService;

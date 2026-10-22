import axios from "axios";
import API_BASE_URL, { CLOUDFLARE_R2_PUBLIC_URL } from "../config/api";
import { getAccessToken, handleUnauthorizedError } from "../services/auth";

export { CLOUDFLARE_R2_PUBLIC_URL };

// Dedicated axios instance for portfolio and user APIs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Attach current JWT access token
apiClient.interceptors.request.use(
  (config) => {
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
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle 401 and refresh tokens
apiClient.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorizedError(error, apiClient)
);

// Cloudflare & external direct image resolver (always serves Cloudflare CDN delivery URLs)
export const resolveImageUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  // Strip leading slash if present and deliver directly via Cloudflare R2 bucket CDN
  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${CLOUDFLARE_R2_PUBLIC_URL}/${cleanPath}`;
};

// ===================================================================
// USER & PROFILE IDENTITY APIs
// ===================================================================
export const userApi = {
  getMe: () => apiClient.get("/api/v1/auth/me"),
  getProfile: () =>
    apiClient
      .get("/api/v1/profile")
      .catch(() => apiClient.get("/api/profile"))
      .catch(() => apiClient.get("/api/v1/auth/me")),
  updateProfile: (profileData) => {
    return apiClient
      .put("/api/v1/profile", profileData)
      .catch((err) => {
        if (err.response?.status === 404) {
          return apiClient.put("/api/profile", profileData);
        }
        return Promise.reject(err);
      });
  },
  getSessions: () => apiClient.get("/api/v1/auth/sessions"),
  revokeSession: (sessionId) => apiClient.delete(`/api/v1/auth/sessions/${sessionId}`),
  logoutAll: () => apiClient.post("/api/v1/auth/logout-all"),
};

// ===================================================================
// PROJECTS APIs (Portfolio details)
// ===================================================================
export const projectsApi = {
  getAll: () => apiClient.get("/api/v1/projects"),
  getById: (id) => apiClient.get(`/api/v1/projects/${id}`),
  create: (project) => apiClient.post("/api/v1/projects", project),
  update: (id, project) => apiClient.put(`/api/v1/projects/${id}`, project),
  delete: (id) => apiClient.delete(`/api/v1/projects/${id}`),
  getPublic: (username) => axios.get(`${API_BASE_URL}/api/v1/projects/public/${username}`),
};

// ===================================================================
// SKILLS APIs (Portfolio details)
// ===================================================================
export const skillsApi = {
  getAll: () => apiClient.get("/api/v1/skills"),
  getById: (id) => apiClient.get(`/api/v1/skills/${id}`),
  create: (skill) => apiClient.post("/api/v1/skills", skill),
  update: (id, skill) => apiClient.put(`/api/v1/skills/${id}`, skill),
  delete: (id) => apiClient.delete(`/api/v1/skills/${id}`),
  getPublic: (username) => axios.get(`${API_BASE_URL}/api/v1/skills/public/${username}`),
};

// ===================================================================
// EDUCATION APIs (Portfolio details)
// ===================================================================
export const educationApi = {
  getAll: () => apiClient.get("/api/v1/education"),
  getById: (id) => apiClient.get(`/api/v1/education/${id}`),
  create: (education) => apiClient.post("/api/v1/education", education),
  update: (id, education) => apiClient.put(`/api/v1/education/${id}`, education),
  delete: (id) => apiClient.delete(`/api/v1/education/${id}`),
  getPublic: (username) => axios.get(`${API_BASE_URL}/api/v1/education/public/${username}`),
};

// ===================================================================
// CERTIFICATIONS APIs (Portfolio details)
// ===================================================================
export const certificationsApi = {
  getAll: () => apiClient.get("/api/v1/certifications"),
  getById: (id) => apiClient.get(`/api/v1/certifications/${id}`),
  create: (cert) => apiClient.post("/api/v1/certifications", cert),
  update: (id, cert) => apiClient.put(`/api/v1/certifications/${id}`, cert),
  delete: (id) => apiClient.delete(`/api/v1/certifications/${id}`),
  getPublic: (username) => axios.get(`${API_BASE_URL}/api/v1/certifications/public/${username}`),
};

// ===================================================================
// ACHIEVEMENTS APIs (Portfolio details)
// ===================================================================
export const achievementsApi = {
  getAll: () => apiClient.get("/api/v1/achievements"),
  getById: (id) => apiClient.get(`/api/v1/achievements/${id}`),
  create: (ach) => apiClient.post("/api/v1/achievements", ach),
  update: (id, ach) => apiClient.put(`/api/v1/achievements/${id}`, ach),
  delete: (id) => apiClient.delete(`/api/v1/achievements/${id}`),
  getPublic: (username) => axios.get(`${API_BASE_URL}/api/v1/achievements/public/${username}`),
};

// ===================================================================
// SOCIAL & CUSTOM LINKS APIs (Portfolio details)
// ===================================================================
export const linksApi = {
  getAll: () => apiClient.get("/api/v1/links"),
  getById: (id) => apiClient.get(`/api/v1/links/${id}`),
  create: (link) => apiClient.post("/api/v1/links", link),
  update: (id, link) => apiClient.put(`/api/v1/links/${id}`, link),
  delete: (id) => apiClient.delete(`/api/v1/links/${id}`),
  recordClick: (id) => axios.post(`${API_BASE_URL}/api/v1/links/${id}/click`),
  getPublic: (username) => axios.get(`${API_BASE_URL}/api/v1/links/public/${username}`),
};

// ===================================================================
// LINKTREE MANAGEMENT APIs (Bio Links - SEPARATE)
// ===================================================================
export const linktreeApi = {
  getAll: () => apiClient.get("/api/v1/linktree"),
  getLinks: () => apiClient.get("/api/v1/linktree"),
  getById: (id) => apiClient.get(`/api/v1/linktree/${id}`),
  create: (link) => {
    if (link instanceof FormData) {
      return apiClient.post("/api/v1/linktree", link, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return apiClient.post("/api/v1/linktree", link);
  },
  update: (id, link) => {
    if (link instanceof FormData) {
      return apiClient.put(`/api/v1/linktree/${id}`, link, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return apiClient.put(`/api/v1/linktree/${id}`, link);
  },
  delete: (id) => apiClient.delete(`/api/v1/linktree/${id}`),
  toggleActive: (id) => apiClient.patch(`/api/v1/linktree/${id}/toggle`),
  reorder: (itemsOrIds) => {
    let items = [];
    if (Array.isArray(itemsOrIds)) {
      items = itemsOrIds.map((item, idx) =>
        typeof item === "object" && item.id
          ? { id: item.id, displayOrder: item.displayOrder ?? idx }
          : { id: item, displayOrder: idx }
      );
    } else if (itemsOrIds && Array.isArray(itemsOrIds.items)) {
      items = itemsOrIds.items;
    }
    return apiClient.patch("/api/v1/linktree/reorder", { items });
  },
  recordClick: (id) => axios.post(`${API_BASE_URL}/api/v1/linktree/${id}/click`),
  getPublicBio: (username) => axios.get(`${API_BASE_URL}/api/v1/linktree/public/${username}`),
  getPublicLinks: (username) => axios.get(`${API_BASE_URL}/api/v1/linktree/public/${username}/links`),
};

// ===================================================================
// TEMPLATES APIs (Portfolio Website)
// ===================================================================
export const templatesApi = {
  getAll: (category = "ALL", isPremium) =>
    apiClient.get("/api/v1/templates", { params: { category, isPremium } }),
  getById: (id) => apiClient.get(`/api/v1/templates/${id}`),
  getByCode: (templateCode) => apiClient.get(`/api/v1/templates/code/${templateCode}`),
  activate: (id) => apiClient.post(`/api/v1/templates/${id}/activate`),
};

// ===================================================================
// LINKTREE BIO TEMPLATES APIs (Linktree Bio Page)
// ===================================================================
export const linktreeTemplatesApi = {
  getAll: (isPremium) =>
    apiClient.get("/api/v1/linktree-templates", { params: { isPremium } }),
  getById: (id) => apiClient.get(`/api/v1/linktree-templates/${id}`),
  getByCode: (templateCode) => apiClient.get(`/api/v1/linktree-templates/code/${templateCode}`),
  getMyActive: () => apiClient.get("/api/v1/linktree-templates/my-template"),
  activate: (id) => apiClient.post(`/api/v1/linktree-templates/${id}/activate`),
  deactivate: () => apiClient.post("/api/v1/linktree-templates/deactivate"),
  seedAll: () => apiClient.post("/api/v1/linktree-templates/seed-all"),
};

// ===================================================================
// ADMIN LINKTREE MANAGEMENT APIs
// ===================================================================
export const adminLinktreeApi = {
  getAllLinks: (params) => apiClient.get("/api/v1/admin/linktree/links", { params }),
  getTopClicked: () => apiClient.get("/api/v1/admin/linktree/links/top-clicked"),
  getUserLinks: (userId) => apiClient.get(`/api/v1/admin/linktree/users/${userId}/links`),
  getById: (id) => apiClient.get(`/api/v1/admin/linktree/links/${id}`),
  toggleActive: (id) => apiClient.patch(`/api/v1/admin/linktree/links/${id}/toggle-active`),
  toggleSensitive: (id) => apiClient.patch(`/api/v1/admin/linktree/links/${id}/toggle-sensitive`),
  deleteLink: (id) => apiClient.delete(`/api/v1/admin/linktree/links/${id}`),
  getStats: () => apiClient.get("/api/v1/admin/linktree/stats"),
};

// ===================================================================
// SUBSCRIPTIONS APIs (UserSubscriptionController & SubscriptionPlanController)
// ===================================================================
export const subscriptionsApi = {
  getActivePlans: () => apiClient.get("/api/v1/subscription-plans"),
  getPlansByCycle: (cycle) => apiClient.get(`/api/v1/subscription-plans/cycle/${cycle}`),
  getPlanById: (id) => apiClient.get(`/api/v1/subscription-plans/${id}`),
  getCurrent: () =>
    apiClient
      .get("/api/v1/subscriptions/current")
      .catch(() => apiClient.get("/api/v1/user-subscriptions/current"))
      .catch(() => apiClient.get("/api/subscriptions/my-subscription")),
  getHistory: () =>
    apiClient
      .get("/api/v1/subscriptions/history")
      .catch(() => apiClient.get("/api/v1/user-subscriptions/history")),
  checkout: (planId) =>
    apiClient.post("/api/v1/subscriptions/checkout", { planId }),
  verify: (verificationData) =>
    apiClient.post("/api/v1/subscriptions/verify", verificationData),
};

// ===================================================================
// INSTAGRAM AUTOMATION APIs
// ===================================================================
export const instagramApi = {
  getConnectUrl: () => apiClient.get("/api/v1/instagram/auth/connect-url"),
  handleCallback: (code, state) => apiClient.post("/api/v1/instagram/auth/callback", { code, state }),
  getAccount: () => apiClient.get("/api/v1/instagram/auth/account"),
  getStatus: () => apiClient.get("/api/v1/instagram/auth/account"),
  getAllAccounts: () => apiClient.get("/api/v1/instagram/auth/accounts"),
  disconnect: (id) => apiClient.delete(`/api/v1/instagram/auth/accounts/${id}`),
  getRules: () => apiClient.get("/api/v1/instagram/automation/rules"),
  createRule: (rule) => apiClient.post("/api/v1/instagram/automation/rules", rule),
  updateRule: (id, rule) => apiClient.put(`/api/v1/instagram/automation/rules/${id}`, rule),
  toggleRule: (id, active) => apiClient.patch(`/api/v1/instagram/automation/rules/${id}/toggle?active=${active}`),
  deleteRule: (id) => apiClient.delete(`/api/v1/instagram/automation/rules/${id}`),
  getUserPosts: () => apiClient.get("/api/v1/instagram/automation/posts"),
  getLogs: (page = 0, size = 20) => apiClient.get(`/api/v1/instagram/automation/logs?page=${page}&size=${size}`),
};

const portfolioApiService = {
  user: userApi,
  projects: projectsApi,
  skills: skillsApi,
  education: educationApi,
  certifications: certificationsApi,
  achievements: achievementsApi,
  links: linksApi,
  linktree: linktreeApi,
  templates: templatesApi,
  subscriptions: subscriptionsApi,
  instagram: instagramApi,
};

export default portfolioApiService;

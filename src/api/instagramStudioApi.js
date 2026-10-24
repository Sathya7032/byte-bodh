import axios from "axios";
import API_BASE_URL from "../config/api";
import { getAccessToken, handleUnauthorizedError } from "../services/auth";

/**
 * Instagram Studio API client.
 * Wraps every Meta-backed endpoint exposed by the Spring Boot backend:
 *  - instagram_business_basic            → profile, media
 *  - instagram_business_manage_comments  → comments moderation
 *  - instagram_business_manage_messages  → DM inbox (+ Human Agent)
 *  - instagram_business_content_publish  → publishing
 *  - instagram_business_manage_insights  → analytics
 */
const client = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/instagram`,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

const newRequestId = () =>
  (window.crypto?.randomUUID?.() || `${Date.now()}${Math.random()}`).replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Correlation id: matches the [traceId] in backend logs so support issues can be traced.
  config.headers["X-Request-Id"] = newRequestId();
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => handleUnauthorizedError(error, client)
);

/** Normalises backend / network errors into { message, code, requestId }. */
export const parseApiError = (err, fallback = "Something went wrong. Please try again.") => {
  const data = err?.response?.data || {};
  return {
    message: data.message || (err?.code === "ECONNABORTED" ? "The request timed out. Please try again." : fallback),
    code: data.errorCode || null,
    status: err?.response?.status || null,
    requestId: err?.response?.headers?.["x-request-id"] || err?.config?.headers?.["X-Request-Id"] || null,
  };
};

/** Error codes that mean the user must reconnect Instagram (expired token or missing new permissions). */
export const RECONNECT_CODES = ["INSTAGRAM_RECONNECT_REQUIRED", "INSTAGRAM_PERMISSION_DENIED", "INSTAGRAM_ACCOUNT_DISCONNECTED"];

const data = (p) => p.then((r) => r.data);

export const igStudioApi = {
  // Account connection (existing endpoints)
  getConnectUrl: () => data(client.get("/auth/connect-url")),
  getAccount: () => data(client.get("/auth/account")),

  // instagram_business_basic
  getProfile: () => data(client.get("/profile")),
  getMedia: (after, limit = 24) => data(client.get("/media", { params: { after, limit } })),
  getMediaDetail: (mediaId) => data(client.get(`/media/${mediaId}`)),

  // instagram_business_manage_comments
  getComments: (mediaId, after) => data(client.get(`/media/${mediaId}/comments`, { params: { after } })),
  replyToComment: (commentId, message) => data(client.post(`/comments/${commentId}/replies`, { message })),
  privateReply: (commentId, message) => data(client.post(`/comments/${commentId}/private-reply`, { message })),
  setCommentHidden: (commentId, hidden) => data(client.patch(`/comments/${commentId}/visibility`, null, { params: { hidden } })),
  deleteComment: (commentId) => data(client.delete(`/comments/${commentId}`)),
  setCommentsEnabled: (mediaId, enabled) => data(client.patch(`/media/${mediaId}/comments-enabled`, null, { params: { enabled } })),

  // instagram_business_manage_messages (+ Human Agent)
  getConversations: (after) => data(client.get("/messages/conversations", { params: { after } })),
  getThread: (conversationId) => data(client.get(`/messages/conversations/${conversationId}`)),
  sendMessage: (payload) => data(client.post("/messages/send", payload)),

  // instagram_business_content_publish
  uploadMedia: (file, onProgress) => {
    const form = new FormData();
    form.append("file", file);
    return data(
      client.post("/publish/upload", form, {
        timeout: 300000,
        onUploadProgress: (e) => onProgress && e.total && onProgress(Math.round((e.loaded / e.total) * 100)),
      })
    );
  },
  publish: (payload) => data(client.post("/publish", payload, { timeout: 120000 })),
  getContainerStatus: (containerId) => data(client.get(`/publish/containers/${containerId}`)),
  publishContainer: (containerId) => data(client.post(`/publish/containers/${containerId}/publish`)),
  getPublishingLimit: () => data(client.get("/publish/limit")),

  // instagram_business_manage_insights
  getAccountInsights: (days = 28, refresh = false) => data(client.get("/insights/account", { params: { days, refresh } })),
  getMediaInsights: (mediaId, refresh = false) => data(client.get(`/insights/media/${mediaId}`, { params: { refresh } })),
  getAudience: (breakdown = "country", metric = "follower_demographics", timeframe = "this_month") =>
    data(client.get("/insights/audience", { params: { breakdown, metric, timeframe } })),
};

export default igStudioApi;

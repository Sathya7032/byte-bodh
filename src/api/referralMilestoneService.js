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

/* =========================================================
   USER-FACING: ACTIVE REFERRAL MILESTONES
========================================================= */

export const getActiveMilestones = () => api.get("/api/referrals/milestones");

/* =========================================================
   ADMIN: REFERRAL MILESTONE CRUD
   Base: /api/admin/referral-milestones
========================================================= */

export const getAllMilestones = () => api.get("/api/admin/referral-milestones");

// data: { requiredReferrals, rewardAmount, description, active }
export const createMilestone = (data) => api.post("/api/admin/referral-milestones", data);

export const updateMilestone = (id, data) => api.put(`/api/admin/referral-milestones/${id}`, data);

export const deleteMilestone = (id) => api.delete(`/api/admin/referral-milestones/${id}`);

/* =========================================================
   ADMIN: REFERRERS OVERVIEW + LEADERBOARD
   Base: /api/referrals
========================================================= */

export const getAllReferrers = () => api.get("/api/referrals/admin/all");

export const getReferralLeaderboard = (limit) =>
  api.get("/api/referrals/admin/leaderboard", { params: limit ? { limit } : {} });

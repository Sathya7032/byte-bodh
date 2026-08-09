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
   USER SUBSCRIPTION APIs
   Base: /api/payment/subscription
========================================================= */

// planType: "MONTHLY" | "YEARLY"
export const createSubscriptionOrder = (planType) =>
  api.post("/api/payment/subscription/create-order", { planType });

export const verifySubscriptionPayment = (dto) =>
  api.post("/api/payment/subscription/verify", dto);

export const recordSubscriptionPaymentFailure = (dto) =>
  api.post("/api/payment/subscription/failure", dto);

export const getSubscriptionStatus = () =>
  api.get("/api/payment/subscription/status");

/* =========================================================
   ADMIN SUBSCRIPTION CONFIG APIs
   Base: /api/admin/subscription-config
========================================================= */

export const getSubscriptionConfig = () =>
  api.get("/api/admin/subscription-config");

export const updateSubscriptionConfig = (data) =>
  api.put("/api/admin/subscription-config", data);

/* =========================================================
   ADMIN SUBSCRIBED / UNSUBSCRIBED USERS APIs
   Base: /api/admin/subscriptions
========================================================= */

export const getSubscribedUsers = () =>
  api.get("/api/admin/subscriptions/subscribed-users");

export const getUnsubscribedUsers = () =>
  api.get("/api/admin/subscriptions/unsubscribed-users");

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
   USER SUBSCRIPTION APIs (Spring Boot Controller: /api/v1/subscriptions)
========================================================= */

// Get current active subscription details
export const getSubscriptionStatus = () =>
  api
    .get("/api/v1/subscriptions/current")
    .catch(() => api.get("/api/payment/subscription/status"));

// Checkout / create order for a subscription plan
export const createSubscriptionOrder = (planIdOrCycle) => {
  // If a UUID planId is passed, checkout via /api/v1/subscriptions/checkout
  if (
    typeof planIdOrCycle === "string" &&
    planIdOrCycle.includes("-")
  ) {
    return api.post("/api/v1/subscriptions/checkout", { planId: planIdOrCycle });
  }
  return api
    .post("/api/v1/subscriptions/checkout", { planId: planIdOrCycle })
    .catch(() => api.post("/api/payment/subscription/create-order", { planType: planIdOrCycle }));
};

// Verify Razorpay payment signature
export const verifySubscriptionPayment = (dto) =>
  api
    .post("/api/v1/subscriptions/verify", dto)
    .catch(() => api.post("/api/payment/subscription/verify", dto));

export const recordSubscriptionPaymentFailure = (dto) =>
  api.post("/api/payment/subscription/failure", dto).catch(() => ({ data: { success: true } }));

/* =========================================================
   SUBSCRIPTION PLANS & CONFIG APIs (/api/v1/subscription-plans)
========================================================= */
export const getSubscriptionConfig = () =>
  api
    .get("/api/v1/subscription-plans")
    .catch(() => api.get("/api/admin/subscription-config"));

export const updateSubscriptionConfig = (data) =>
  api.put("/api/admin/subscription-config", data);

/* =========================================================
   ADMIN SUBSCRIPTION APIs
========================================================= */
export const getSubscribedUsers = () =>
  api.get("/api/admin/subscriptions/subscribed-users");

export const getUnsubscribedUsers = () =>
  api.get("/api/admin/subscriptions/unsubscribed-users");

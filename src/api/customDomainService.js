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
   PAYMENT CONTROLLER CUSTOM DOMAIN ORDER API
   Endpoint: POST /api/payment/custom-domain/create-order
========================================================= */
export const createCustomDomainOrder = (dto) =>
  api.post("/api/payment/custom-domain/create-order", dto);

/* =========================================================
   ADMIN CUSTOM DOMAIN CONFIG APIs
   Base URL: /api/admin/custom-domain-config
========================================================= */
export const getCustomDomainConfig = () =>
  api.get("/api/admin/custom-domain-config");

export const updateCustomDomainConfig = (request) =>
  api.put("/api/admin/custom-domain-config", request);

import axios from "axios";
import { getAccessToken, handleUnauthorizedError } from "../services/auth";
import { API_ENDPOINTS } from "../config/api";

const api = axios.create({
  baseURL: API_ENDPOINTS.API,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    console.log("Attaching token to request:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorizedError(error, api)
);

export default api;

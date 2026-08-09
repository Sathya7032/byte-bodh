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
   ADMIN GEMINI API KEY MANAGEMENT
   Base: /api/gemini-api-keys
========================================================= */

export const getAllGeminiKeys = () => api.get("/api/gemini-api-keys");

export const getActiveGeminiKey = () => api.get("/api/gemini-api-keys/active");

export const getGeminiKeyById = (id) => api.get(`/api/gemini-api-keys/${id}`);

// data: { name, apiKey, active }
export const createGeminiKey = (data) => api.post("/api/gemini-api-keys", data);

export const updateGeminiKey = (id, data) => api.put(`/api/gemini-api-keys/${id}`, data);

export const deleteGeminiKey = (id) => api.delete(`/api/gemini-api-keys/${id}`);

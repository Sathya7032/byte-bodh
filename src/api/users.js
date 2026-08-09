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

// User APIs
export const getUsers = () => api.get("/api/users");
export const getUserById = (id) => api.get(`/api/users/${id}`);
export const getUserByProfile = (id) => api.get(`/api/users/${id}`);
export const deleteUser = (id) => api.delete(`/api/users/${id}`);
export const checkUserAvailability = (params) => api.get("/api/users/check-availability", { params });
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAuthData,
  logout,
} from "../services/auth";
import API_BASE_URL from "../config/api";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const res = await api.post("/auth/refresh-token", { refreshToken });

        if (res.data?.success) {
          saveAuthData(res.data.data);
          originalRequest.headers.Authorization =
            `Bearer ${res.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (e) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

/* =========================
   CATEGORIES APIs (Only using available endpoints)
========================= */

// Get all categories
export const getCategories = () => 
  api.get('/api/categories');

// Get single category by ID
export const getCategoryById = (id) => 
  api.get(`/api/categories/${id}`);

// Create a new category
export const createCategory = (categoryData) => 
  api.post('/api/categories', categoryData);

// Update a category
export const updateCategory = (id, categoryData) => 
  api.put(`/api/categories/${id}`, categoryData);

// Delete a category
export const deleteCategory = (id) => 
  api.delete(`/api/categories/${id}`);
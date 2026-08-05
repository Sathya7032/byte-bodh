import axios from "axios";
import {
  getAccessToken,
  handleUnauthorizedError,
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
  (error) => handleUnauthorizedError(error, api)
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
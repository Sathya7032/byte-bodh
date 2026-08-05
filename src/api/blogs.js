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

// Blog API methods
export const getBlogs = () => api.get("/api/blogs");
export const getBlogById = (id) => api.get(`/api/blogs/${id}`);
export const getBlogBySlug = (slug) => api.get(`/api/blogs/slug/${slug}`);
export const createBlog = (blogData, imageFile) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(blogData)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return api.post("/api/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const updateBlog = (id, blogData, imageFile) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(blogData)], { type: "application/json" })
  );
  if (imageFile) {
    formData.append("image", imageFile);
  }
  return api.put(`/api/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const deleteBlog = (id) => api.delete(`/api/blogs/${id}`);

// Categories API (you need to create this endpoint in backend)
export const getCategories = () => api.get("/api/categories");

export const getAllContacts = () => api.get("/api/contacts");
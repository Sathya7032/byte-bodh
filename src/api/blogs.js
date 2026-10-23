import axios from "axios";
import API_BASE_URL from "../config/api";

const publicBlogClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Public Blog API client connecting directly to the Spring Boot backend
 */
export const blogApi = {
  /**
   * Retrieves paginated published blogs with search, category, and tag filters
   */
  getPublishedBlogs: (params = {}) =>
    publicBlogClient.get("/api/v1/blogs/public", { params }),

  /**
   * Retrieves a single published blog by its unique URL slug (automatically increments view count)
   */
  getBlogBySlug: (slug) =>
    publicBlogClient.get(`/api/v1/blogs/public/${encodeURIComponent(slug)}`),

  /**
   * Retrieves a single published blog by its UUID (automatically increments view count)
   */
  getBlogById: (id) =>
    publicBlogClient.get(`/api/v1/blogs/public/id/${id}`),

  /**
   * Retrieves top featured blogs for hero showcase / carousel
   */
  getFeaturedBlogs: () =>
    publicBlogClient.get("/api/v1/blogs/public/featured"),

  /**
   * Retrieves most recent published blogs
   */
  getRecentBlogs: (limit = 6) =>
    publicBlogClient.get("/api/v1/blogs/public/recent", { params: { limit } }),

  /**
   * Retrieves related blogs in the same category
   */
  getRelatedBlogs: (slug, limit = 4) =>
    publicBlogClient.get(`/api/v1/blogs/public/${encodeURIComponent(slug)}/related`, {
      params: { limit },
    }),

  /**
   * Retrieves active categories and their published article counts
   */
  getCategories: () =>
    publicBlogClient.get("/api/v1/blogs/public/categories"),

  /**
   * Retrieves all unique tags across published articles
   */
  getTags: () =>
    publicBlogClient.get("/api/v1/blogs/public/tags"),

  /**
   * Explicitly records a view for a given blog slug
   */
  recordView: (slug) =>
    publicBlogClient.post(`/api/v1/blogs/public/${encodeURIComponent(slug)}/view`),
};

// ===================================================================
// BACKWARD-COMPATIBLE NAMED EXPORTS
// ===================================================================
export const getBlogs = (params) => blogApi.getPublishedBlogs(params);
export const getBlogBySlug = (slug) => blogApi.getBlogBySlug(slug);
export const getBlogById = (id) => blogApi.getBlogById(id);
export const getCategories = () => blogApi.getCategories();
export const getAllContacts = () => publicBlogClient.get("/api/contact");

export default blogApi;

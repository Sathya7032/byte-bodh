// Centralized API Configuration
// Update this base URL to change API endpoint across the entire application

// const API_BASE_URL = "https://backend.bytebodh.in";
const API_BASE_URL = "http://localhost:8080";

export default API_BASE_URL;

// Helper to get full API URL with path
export const getApiUrl = (path = "") => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Export common API endpoints for convenience
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  API: `${API_BASE_URL}/api`,
};


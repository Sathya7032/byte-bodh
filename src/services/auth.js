import axios from "axios";

const API_URL = "https://backend.bytebodh.in/auth";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        
        const response = await api.post("/refresh-token", { refreshToken });
        const apiResponse = response.data;
        
        if (apiResponse.success) {
          saveAuthData(apiResponse.data);
          originalRequest.headers.Authorization = `Bearer ${apiResponse.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        logout();
      }
    }
    
    return Promise.reject(error);
  }
);

/* =========================
   SAVE AUTH DATA
========================= */
export const saveAuthData = (authData) => {
  if (!authData) return;

  localStorage.setItem("accessToken", authData.accessToken);
  localStorage.setItem("refreshToken", authData.refreshToken);
  localStorage.setItem("user", JSON.stringify({
    fullName: authData.fullName,
    email: authData.email,
    role: authData.role,
  }));
};

/* =========================
   PROCESS GOOGLE TOKEN FROM URL
========================= */
export const processGoogleToken = (token) => {
  if (!token) return { success: false, message: "No token provided" };
  
  try {
    // The token from backend Google OAuth callback is a JWT token
    // We need to parse it and create auth data structure
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format");
    }
    
    // Decode JWT payload
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Create auth data structure
    const authData = {
      accessToken: token,
      refreshToken: "", // Google OAuth doesn't provide refresh token in this flow
      fullName: payload.name || payload.email?.split('@')[0] || "User",
      email: payload.sub || payload.email,
      role: payload.role || "USER"
    };
    
    saveAuthData(authData);
    
    return {
      success: true,
      message: "Google login successful",
      data: authData
    };
  } catch (error) {
    console.error("Error processing Google token:", error);
    return {
      success: false,
      message: "Failed to process Google login token"
    };
  }
};

/* =========================
   REGISTER
========================= */
export const registerUser = async (registerData) => {
  try {
    const res = await api.post("/register", registerData);
    const apiResponse = res.data;

    if (apiResponse.success && apiResponse.data) {
      saveAuthData(apiResponse.data);
      return {
        success: true,
        message: apiResponse.message || "Registration successful",
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Registration failed",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.",
    };
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (loginData) => {
  try {
    const res = await api.post("/login", loginData);
    const apiResponse = res.data;

    if (apiResponse.success && apiResponse.data) {
      saveAuthData(apiResponse.data);
      return {
        success: true,
        message: apiResponse.message || "Login successful",
        data: apiResponse.data,
      };
    }

    return {
      success: false,
      message: apiResponse.message || "Login failed",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Invalid username or password",
    };
  }
};

/* =========================
   GOOGLE LOGIN (REDIRECT)
========================= */
export const googleLogin = () => {
  // Clear any existing auth data before starting Google OAuth
  clearAuthData();
  window.location.href = `${API_URL}/google`;
};

/* =========================
   CLEAR AUTH DATA
========================= */
export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

/* =========================
   LOGOUT
========================= */
export const logout = () => {
  clearAuthData();
  window.location.href = "/login";
};

/* =========================
   AUTH UTILITIES
========================= */
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;
  
  // Optional: Check if token is expired
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    }
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
  
  return !!token;
};
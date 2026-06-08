import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_ENDPOINTS.AUTH,
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
    username: authData.username || (authData.user && authData.user.username) || "",
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
  window.location.href = `${API_ENDPOINTS.AUTH}/google`;
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
   FORGOT & CHANGE PASSWORD APIs
========================= */
export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/forgot-password", null, {
      params: { email },
    });
    return {
      success: true,
      message: res.data?.message || "OTP sent to email",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to send OTP. Please try again.",
    };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const res = await api.post("/reset-password", null, {
      params: { email, otp, newPassword },
    });
    return {
      success: true,
      message: res.data?.message || "Password reset successful",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Password reset failed. Please try again.",
    };
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await api.post("/change-password", null, {
      params: { oldPassword, newPassword },
    });
    return {
      success: true,
      message: res.data?.message || "Password changed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to change password. Please try again.",
    };
  }
};

export const adminLogout = () => {

  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("admin");

  window.location.href = "/admin-login";
};

export const adminLogin = async (loginData) => {
  try {
    const res = await axios.post(
      `${API_ENDPOINTS.ADMIN_AUTH}/login`,
      loginData
    );

    const authData = res.data;

    if (authData?.accessToken) {

      localStorage.setItem("adminAccessToken", authData.accessToken);
      localStorage.setItem("adminRefreshToken", authData.refreshToken);

      localStorage.setItem(
        "admin",
        JSON.stringify({
          fullName: authData.fullName,
          email: authData.email,
          role: authData.role,
        })
      );

      return {
        success: true,
        message: "Admin login successful",
        data: authData,
      };
    }

    return {
      success: false,
      message: "Admin login failed",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Invalid admin credentials",
    };
  }
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


export const getAdminAccessToken = () =>
  localStorage.getItem("adminAccessToken");

export const getAdminRefreshToken = () =>
  localStorage.getItem("adminRefreshToken");

export const getAdmin = () => {
  const admin = localStorage.getItem("admin");
  return admin ? JSON.parse(admin) : null;
};

export const isAdminAuthenticated = () => {

  const token = getAdminAccessToken();

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.exp * 1000 > Date.now();

  } catch {
    return false;
  }
};
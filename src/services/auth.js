import axios from "axios";
import API_BASE_URL, { API_ENDPOINTS } from "../config/api";

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

/* =========================
   TOKEN REFRESH INTERCEPTOR LOGIC
========================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const handleUnauthorizedError = async (error, axiosInstance) => {
  const originalRequest = error.config;
  if (!originalRequest) return Promise.reject(error);

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return (axiosInstance || axios)(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Send POST /auth/refresh-token with raw axios to prevent attaching expired access token
      const refreshUrl = `${API_ENDPOINTS.AUTH}/refresh-token`;
      const response = await axios.post(refreshUrl, { refreshToken });
      const apiResponse = response.data;

      if (apiResponse && (apiResponse.success || response.status === 200) && apiResponse.data) {
        const newAuthData = apiResponse.data;
        saveAuthData(newAuthData);
        const newAccessToken = newAuthData.accessToken;

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return (axiosInstance || axios)(originalRequest);
      } else {
        throw new Error(apiResponse?.message || "Token refresh failed");
      }
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      logout();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

// Response interceptor for auth api instance
api.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorizedError(error, api)
);

/* =========================
   SAVE AUTH DATA
========================= */
export const saveAuthData = (authData) => {
  if (!authData) return;

  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isAdmin = path.startsWith("/admin") || path === "/categories" || path.startsWith("/categories/") || path.startsWith("/admin-");

  const userData = authData.user || authData;

  if (isAdmin || authData.role === "ADMIN" || userData.role === "ADMIN") {
    if (authData.accessToken) localStorage.setItem("adminAccessToken", authData.accessToken);
    if (authData.refreshToken) localStorage.setItem("adminRefreshToken", authData.refreshToken);
    if (userData.fullName || userData.email) {
      const existingAdmin = localStorage.getItem("admin") ? JSON.parse(localStorage.getItem("admin")) : {};
      localStorage.setItem("admin", JSON.stringify({
        ...existingAdmin,
        id: userData.id || existingAdmin.id,
        fullName: userData.fullName || existingAdmin.fullName,
        email: userData.email || existingAdmin.email,
        role: userData.role || existingAdmin.role,
      }));
    }
  }

  if (authData.accessToken) localStorage.setItem("accessToken", authData.accessToken);
  if (authData.refreshToken) localStorage.setItem("refreshToken", authData.refreshToken);

  if (userData.fullName || userData.email || userData.username || userData.id) {
    const existingUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};
    localStorage.setItem("user", JSON.stringify({
      ...existingUser,
      id: userData.id || existingUser.id,
      fullName: userData.fullName || existingUser.fullName,
      email: userData.email || existingUser.email,
      role: userData.role || existingUser.role || "USER",
      username: userData.username || existingUser.username || (userData.email ? userData.email.split("@")[0] : ""),
      avatarUrl: userData.avatarUrl || existingUser.avatarUrl || "",
      headline: userData.headline || existingUser.headline || "",
    }));
  }
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
   GOOGLE LOGIN (OAUTH TOKEN EXCHANGE)
========================= */
export const loginWithGoogleApi = async (idToken) => {
  try {
    const res = await axios.post(API_ENDPOINTS.AUTH_GOOGLE, {
      idToken,
      deviceName: navigator.userAgent.includes("Mac") ? "Chrome / Mac" : "Web Browser",
      deviceOs: navigator.platform || "Web",
    });
    if (res.data && res.data.accessToken) {
      saveAuthData({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        ...(res.data.user || {}),
      });
      return { success: true, data: res.data };
    }
    return { success: false, message: "Invalid response from server" };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || "Google sign-in failed",
    };
  }
};

/* =========================
   APPLE LOGIN (OAUTH TOKEN EXCHANGE)
========================= */
export const loginWithAppleApi = async (identityToken, fullName) => {
  try {
    const res = await axios.post(API_ENDPOINTS.AUTH_APPLE, {
      identityToken,
      fullName: fullName || "Apple User",
      deviceName: "Apple Device (Web)",
      deviceOs: "macOS / iOS",
    });
    if (res.data && res.data.accessToken) {
      saveAuthData({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        ...(res.data.user || {}),
      });
      return { success: true, data: res.data };
    }
    return { success: false, message: "Invalid response from server" };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message || "Apple sign-in failed",
    };
  }
};

/* =========================
   GOOGLE LOGIN (REDIRECT FALLBACK)
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
    const res = await axios
      .post(`${API_BASE_URL}/api/v1/admin/auth/signin`, loginData)
      .catch(() => axios.post(`${API_ENDPOINTS.ADMIN_AUTH}/login`, loginData));

    const authData = res.data?.data || res.data;

    if (authData?.accessToken) {
      localStorage.setItem("adminAccessToken", authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem("adminRefreshToken", authData.refreshToken);
      }

      const adminProfile = authData.admin || {
        fullName: authData.fullName,
        email: authData.email,
        role: authData.role || authData.adminRole || "ADMIN",
      };

      localStorage.setItem("admin", JSON.stringify(adminProfile));

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
const isAdminRoute = (path) => {
  return (
    path.startsWith("/admin") ||
    path === "/categories" ||
    path.startsWith("/categories/") ||
    path.startsWith("/admin-")
  );
};

export const getAccessToken = () => {
  const path = window.location.pathname;
  let token = null;
  if (isAdminRoute(path)) {
    const adminToken = localStorage.getItem("adminAccessToken");
    if (adminToken) token = adminToken;
  }
  if (!token) {
    token = localStorage.getItem("accessToken") || localStorage.getItem("adminAccessToken");
  }
  if (token) {
    console.log("%c[ByteBodh JWT Access Token]:", "color:#10b981;font-weight:bold;", token);
  }
  return token;
};

export const getRefreshToken = () => {
  const path = window.location.pathname;
  if (isAdminRoute(path)) {
    const adminRefreshToken = localStorage.getItem("adminRefreshToken");
    if (adminRefreshToken) return adminRefreshToken;
  }
  return localStorage.getItem("refreshToken") || localStorage.getItem("adminRefreshToken");
};

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
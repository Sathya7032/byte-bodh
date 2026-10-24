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

      // Backend returns AuthResponse directly: { accessToken, refreshToken, user }
      const newAuthData = apiResponse?.accessToken ? apiResponse : apiResponse?.data;
      if (newAuthData?.accessToken) {
        saveAuthData({ accessToken: newAuthData.accessToken, refreshToken: newAuthData.refreshToken, ...(newAuthData.user || {}) });
        const newAccessToken = newAuthData.accessToken;

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return (axiosInstance || axios)(originalRequest);
      } else {
        throw new Error(apiResponse?.message || "Token refresh failed");
      }
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      logout({ reason: "expired", revoke: false });
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
   EMAIL / PASSWORD HELPERS
========================= */

/** Best-effort device label sent with auth requests (shown in "Active sessions"). */
const getDeviceInfo = () => {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "Web";
  return { deviceName: `${browser} on ${os}`, deviceOs: os };
};

/**
 * Turns a backend ErrorResponse into one readable message.
 * Prefers the first field validation error (e.g. "Valid email address is required").
 */
export const extractAuthError = (error, fallback) => {
  const data = error?.response?.data;
  if (!error?.response) return "Can't reach the server. Check your internet connection and try again.";
  if (Array.isArray(data?.validationErrors) && data.validationErrors.length) {
    return data.validationErrors[0].message || data.message || fallback;
  }
  if (error.response.status === 429) return "Too many attempts. Please wait a minute and try again.";
  return data?.message || fallback;
};

/** Persists tokens + user from the backend AuthResponse { accessToken, refreshToken, user }. */
const persistAuthResponse = (data) => {
  saveAuthData({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    ...(data.user || {}),
  });
};

/* =========================
   REGISTER (email + password)
   POST /api/v1/auth/register → AuthResponse
========================= */
export const registerUser = async ({ name, fullName, email, password, confirmPassword }) => {
  try {
    const res = await axios.post(`${API_ENDPOINTS.AUTH}/register`, {
      name: (name || fullName || "").trim(),
      email: (email || "").trim().toLowerCase(),
      password,
      confirmPassword: confirmPassword ?? password,
      ...getDeviceInfo(),
    });
    if (res.data?.accessToken) {
      persistAuthResponse(res.data);
      return { success: true, message: "Account created successfully", data: res.data };
    }
    return { success: false, message: "Unexpected response from server. Please try again." };
  } catch (error) {
    return { success: false, status: error.response?.status, message: extractAuthError(error, "Registration failed. Please try again.") };
  }
};

/* =========================
   LOGIN (email + password)
   POST /api/v1/auth/login → AuthResponse
========================= */
export const loginUser = async ({ email, password }) => {
  try {
    const res = await axios.post(`${API_ENDPOINTS.AUTH}/login`, {
      email: (email || "").trim().toLowerCase(),
      password,
      ...getDeviceInfo(),
    });
    if (res.data?.accessToken) {
      persistAuthResponse(res.data);
      return { success: true, message: "Login successful", data: res.data };
    }
    return { success: false, message: "Unexpected response from server. Please try again." };
  } catch (error) {
    return { success: false, status: error.response?.status, message: extractAuthError(error, "Invalid email or password.") };
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
   1. Revokes the session on the server (best effort, survives page navigation via keepalive)
   2. Clears local credentials (other open tabs are notified through the "storage" event)
   3. Replaces the current history entry so "Back" can't reopen the dashboard
========================= */
let loggingOut = false;
export const logout = (options = {}) => {
  if (loggingOut) return;
  loggingOut = true;

  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");
  if (refreshToken && options.revoke !== false) {
    try {
      fetch(`${API_ENDPOINTS.AUTH}/logout`, {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    } catch {
      /* network errors must never block logout */
    }
  }

  clearAuthData();

  const target = options.reason === "expired" ? "/login?session=expired" : "/login";
  if (window.location.pathname === "/login") {
    loggingOut = false;
    return;
  }
  window.location.replace(target);
};

/* =========================
   FORGOT / RESET / CHANGE PASSWORD
========================= */

/** POST /forgot-password { email } — always answers generically; the link arrives by email. */
export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${API_ENDPOINTS.AUTH}/forgot-password`, { email: (email || "").trim().toLowerCase() });
    return { success: true, message: res.data?.message || "If an account exists for this email, a reset link has been sent." };
  } catch (error) {
    return { success: false, message: extractAuthError(error, "Couldn't send the reset link. Please try again.") };
  }
};

/** POST /reset-password { token, newPassword, confirmPassword } */
export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const res = await axios.post(`${API_ENDPOINTS.AUTH}/reset-password`, {
      token: (token || "").trim(),
      newPassword,
      confirmPassword: confirmPassword ?? newPassword,
    });
    return { success: true, message: res.data?.message || "Password reset successful" };
  } catch (error) {
    return { success: false, message: extractAuthError(error, "Password reset failed. Please try again.") };
  }
};

/** POST /change-password { currentPassword, newPassword, confirmPassword } (authenticated) */
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const res = await api.post("/change-password", {
      currentPassword,
      newPassword,
      confirmPassword: confirmPassword ?? newPassword,
    });
    return { success: true, message: res.data?.message || "Password changed successfully" };
  } catch (error) {
    return { success: false, message: extractAuthError(error, "Failed to change password. Please try again.") };
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

/**
 * User pages use ONLY the user token and admin pages ONLY the admin token.
 * (Previously user pages fell back to the admin token, so after a user logout the app still looked
 *  "logged in" whenever an admin token existed → infinite /login ⇄ /dashboard redirects.)
 */
export const getAccessToken = () => {
  const path = window.location.pathname;
  return isAdminRoute(path) ? localStorage.getItem("adminAccessToken") : localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  const path = window.location.pathname;
  return isAdminRoute(path) ? localStorage.getItem("adminRefreshToken") : localStorage.getItem("refreshToken");
};

/** True when the JWT's `exp` is in the future (30s clock-skew margin). */
const isJwtValid = (token) => {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return !payload.exp || payload.exp * 1000 > Date.now() + 30000;
  } catch {
    return false;
  }
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * A user is signed in when we have their profile AND either a valid access token or a refresh token
 * (an expired access token is renewed transparently by the 401 interceptor).
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  if (!token || !user) return false;
  return isJwtValid(token) || Boolean(localStorage.getItem("refreshToken"));
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
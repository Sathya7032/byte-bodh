// Centralized API Configuration for ByteBodh
// Production backend API: https://backend.bytebodh.in

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  "https://backend.bytebodh.in";

// Cloudflare R2 Public Delivery URL
export const CLOUDFLARE_R2_PUBLIC_URL =
  process.env.REACT_APP_R2_PUBLIC_URL || "https://pub-5e4504ca13184912baee2de14afbd467.r2.dev";

export { API_BASE_URL };
export default API_BASE_URL;

// Helper to get full API URL with path
export const getApiUrl = (path = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Centralized API endpoints for ByteBodh Portfolio
export const API_ENDPOINTS = {
  // Authentication & Sessions
  AUTH: `${API_BASE_URL}/api/v1/auth`,
  AUTH_GOOGLE: `${API_BASE_URL}/api/v1/auth/google`,
  AUTH_APPLE: `${API_BASE_URL}/api/v1/auth/apple`,
  AUTH_REFRESH: `${API_BASE_URL}/api/v1/auth/refresh-token`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  AUTH_ME: `${API_BASE_URL}/api/v1/auth/me`,
  AUTH_PROFILE: `${API_BASE_URL}/api/v1/auth/profile`,

  // Core Portfolio Entities
  PROJECTS: `${API_BASE_URL}/api/v1/projects`,
  SKILLS: `${API_BASE_URL}/api/v1/skills`,
  EDUCATION: `${API_BASE_URL}/api/v1/education`,
  CERTIFICATIONS: `${API_BASE_URL}/api/v1/certifications`,
  ACHIEVEMENTS: `${API_BASE_URL}/api/v1/achievements`,
  LINKS: `${API_BASE_URL}/api/v1/links`,

  // Linktree Management (Bio Links)
  LINKTREE: `${API_BASE_URL}/api/v1/linktree`,

  // Templates
  TEMPLATES: `${API_BASE_URL}/api/v1/templates`,
  LINKTREE_TEMPLATES: `${API_BASE_URL}/api/v1/linktree-templates`,

  // Subscriptions & Plans
  SUBSCRIPTION_PLANS: `${API_BASE_URL}/api/v1/subscription-plans`,
  USER_SUBSCRIPTIONS: `${API_BASE_URL}/api/v1/user-subscriptions`,

  // Instagram Automation
  INSTAGRAM_AUTH: `${API_BASE_URL}/api/v1/instagram/auth`,
  INSTAGRAM_AUTOMATION: `${API_BASE_URL}/api/v1/instagram/automation`,

  // Legacy / Compatibility endpoints
  API: `${API_BASE_URL}/api`,
  ADMIN_AUTH: `${API_BASE_URL}/api/v1/admin/auth`,
};

// Helper to extract root domain (e.g. bytebodh.in, domain.com)
export const getRootDomain = (hostname) => {
  if (!hostname) return "bytebodh.in";

  // Local development
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  ) {
    return "localhost";
  }

  if (hostname.endsWith("bytebodh.in")) {
    return "bytebodh.in";
  }

  // Extract root domain from hostname (e.g., sub.domain.com -> domain.com)
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return parts.slice(-2).join(".");
  }
  return hostname;
};

// Helper to extract username from subdomain (e.g. username.domain.com or username.localhost)
export const getUsernameFromDomain = () => {
  if (typeof window === "undefined") return null;
  const hostname = window.location.hostname;

  // Ignore IPv4 addresses
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return null;

  // Local development support (e.g. username.localhost)
  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.replace(/\.localhost$/, "");
    if (subdomain && !["www", "app", "admin", "api"].includes(subdomain.toLowerCase())) {
      return subdomain.toLowerCase();
    }
    return null;
  }

  // Domain format: username.domain.com (or username.bytebodh.in)
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase();
    const reserved = ["www", "app", "admin", "api", "backend", "mail", "ftp", "staging", "dev", "qr"];
    if (!reserved.includes(sub)) {
      return sub;
    }
  }

  return null;
};

export const isSubdomainPortfolio = () => {
  return Boolean(getUsernameFromDomain());
};

// Helper to get portfolio URL in username.domain.com format (e.g. username.bytebodh.in)
export const getPortfolioUrl = (username) => {
  if (!username) return "";
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const protocol = typeof window !== "undefined" ? window.location.protocol : "https:";
  const port =
    typeof window !== "undefined" && window.location.port ? `:${window.location.port}` : "";

  // Local development: username.localhost:3000
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  ) {
    return `${protocol}//${username}.localhost${port}`;
  }

  const rootDomain = getRootDomain(hostname);
  return `${protocol}//${username}.${rootDomain}${port}`;
};

// Helper to get Linktree URL in bytebodh.in/username format
export const getLinktreeUrl = (username) => {
  if (!username) return "";
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const protocol = typeof window !== "undefined" ? window.location.protocol : "https:";
  const port =
    typeof window !== "undefined" && window.location.port ? `:${window.location.port}` : "";

  // Local development: localhost:3000/username
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
  ) {
    return `${protocol}//localhost${port}/${username}`;
  }

  const rootDomain = getRootDomain(hostname);
  return `${protocol}//${rootDomain}${port}/${username}`;
};

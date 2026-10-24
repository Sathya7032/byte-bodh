import axios from "axios";
import API_BASE_URL from "../config/api";

/**
 * Public (no login required) subscription plans configured by the admin.
 * GET /api/v1/subscription-plans → active plans ordered by displayOrder.
 * The result is cached for the page session so the homepage, notices etc. share one request.
 */
let cache = null;
let cachedAt = 0;
const TTL_MS = 5 * 60 * 1000;

export const fetchPublicPlans = (force = false) => {
  if (!force && cache && Date.now() - cachedAt < TTL_MS) return cache;
  cachedAt = Date.now();
  cache = axios
    .get(`${API_BASE_URL}/api/v1/subscription-plans`, { timeout: 15000 })
    .then((res) => {
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      return list
        .filter((p) => p && p.isActive !== false)
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    })
    .catch((err) => {
      cache = null; // allow a retry next time
      throw err;
    });
  return cache;
};

/** Admin enters features comma-separated; also accept one-per-line. */
export const parseFeatures = (features) =>
  String(features || "")
    .split(/\r?\n|,/)
    .map((f) => f.trim())
    .filter(Boolean);

export const formatPrice = (amount, currency = "INR") => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `₹${n}`;
  }
};

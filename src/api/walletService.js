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

/* =========================================================
   USER WALLET APIs
========================================================= */

export const getMyWallet = () => api.get("/api/wallet/me");

export const getMyWalletTransactions = () => api.get("/api/wallet/transactions");

// dto: { amount, accountHolderName, accountNumber, ifscCode, bankName, upiId }
export const requestWithdrawal = (dto) => api.post("/api/wallet/withdrawals", dto);

export const getMyWithdrawals = () => api.get("/api/wallet/withdrawals");

/* =========================================================
   ADMIN WALLET / WITHDRAWAL APIs
========================================================= */

export const getAllWallets = () => api.get("/api/admin/wallets");

export const getAllWithdrawals = () => api.get("/api/admin/withdrawals");

export const approveWithdrawal = (id, adminNote) =>
  api.post(`/api/admin/withdrawals/${id}/approve`, adminNote ? { adminNote } : {});

export const rejectWithdrawal = (id, adminNote) =>
  api.post(`/api/admin/withdrawals/${id}/reject`, adminNote ? { adminNote } : {});

import axios from "axios";
import { CONFIG } from "./config";

// Ensure baseURL ends without trailing slash
const base = String(CONFIG.API_BASE).replace(/\/$/, '');

const axiosClient = axios.create({
  baseURL: base,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s
});

// ✅ Gắn token vào mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response handler
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally emit an event or redirect to login in app code
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

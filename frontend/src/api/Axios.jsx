// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Attach Bearer token automatically if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle 401 / refresh logic here if you implement refresh tokens
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    // e.g., if (err.response?.status === 401) { /* logout or refresh token */ }
    return Promise.reject(err);
  }
);

export default axiosInstance;

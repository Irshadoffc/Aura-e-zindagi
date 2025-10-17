// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true, // important for Sanctum cookie flows
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// optional: a response interceptor to handle 401 globally (redirect to login, etc)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // You can add global error handling here
    return Promise.reject(err);
  }
);

export default api;

import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl ? `${apiBaseUrl}/api` : "/api",
  withCredentials: true,
});

// Return only payload data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;

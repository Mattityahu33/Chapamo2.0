import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// Return only payload data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error.message)
);

export default api;
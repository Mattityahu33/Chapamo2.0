import axios from "axios";

function normalizeApiOrigin(rawValue) {
  const trimmedValue = (rawValue || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");

  if (!trimmedValue) {
    return "";
  }

  let normalizedValue = trimmedValue
    .replace(/^https\/\//i, "https://")
    .replace(/^http\/\//i, "http://");

  const duplicatedOriginMatch = normalizedValue.match(/^(https?:\/\/[^/]+)(https?:\/?\/?.*)$/i);
  if (duplicatedOriginMatch) {
    normalizedValue = duplicatedOriginMatch[1];
  }

  normalizedValue = normalizedValue
    .replace(/\/api\/?$/i, "")
    .replace(/\/+$/, "");

  try {
    return new URL(normalizedValue).origin;
  } catch {
    console.error(
      "Invalid VITE_API_URL. Use the backend origin only, without /api or quotes:",
      rawValue
    );
    return "";
  }
}

const apiOrigin = normalizeApiOrigin(import.meta.env.VITE_API_URL);

const api = axios.create({
  // Keep /api in one place so requests can stay relative like api.get("/job_postings").
  baseURL: apiOrigin ? `${apiOrigin}/api` : "/api",
  withCredentials: true,
});

// Return only payload data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;

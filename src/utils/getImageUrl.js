const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getImageUrl = (path) => {
  if (!path) return "";
  // return `${BASE_URL}/public/uploads/${path}`;
  return `${BASE_URL}/uploads/${path}`;
};
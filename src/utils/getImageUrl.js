const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getImageUrl = (path) => {
  // ❌ handle null, undefined, empty string
  if (!path || path.trim() === "") return "/no-image.png";

  // ✅ if already full URL
  if (path.startsWith("http")) return path;

  return `${BASE_URL}/${path}`;
};
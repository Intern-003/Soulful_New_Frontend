const BASE_URL = import.meta.env.VITE_IMG_URL ;

export const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg";

  // Already full URL
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  // Remove leading slash
  let cleanPath = path.replace(/^\/+/, "");

  // If uploads already present
  if (cleanPath.startsWith("uploads/")) {
    return `${BASE_URL}/${cleanPath}`;
  }

  return `${BASE_URL}/uploads/${cleanPath}`;
};
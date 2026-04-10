// const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// export const getImageUrl = (path) => {
//   if (!path) return "";
//   // return `${BASE_URL}/public/uploads/${path}`;
//   return `${BASE_URL}/uploads/${path}`;
// };

// utils/getImageUrl.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getImageUrl = (path) => {
  if (!path) return "";
  
  // ✅ Remove any 'uploads/' prefix if it already exists in the path
  let cleanPath = path;
  
  // Remove duplicate 'uploads/' if present
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath;
  }
  
  // Handle different path formats
  // If path already contains 'uploads/', don't add it again
  if (cleanPath.includes('uploads/')) {
    return `${BASE_URL}/${cleanPath}`;
  }
  
  // For paths without 'uploads/' prefix
  return `${BASE_URL}/uploads/${cleanPath}`;
};

// Alternative simpler version:
export const getImageUrlSimple = (path) => {
  if (!path) return "";
  
  // Remove any leading slashes
  let cleanPath = path.replace(/^\/+/, '');
  
  // If path already has uploads, don't add another
  if (cleanPath.startsWith('uploads/')) {
    return `${BASE_URL}/${cleanPath}`;
  }
  
  return `${BASE_URL}/uploads/${cleanPath}`;
};
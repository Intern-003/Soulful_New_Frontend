import { getImageUrl } from "./getImageUrl";

// Product image handling
export const getProductImageUrl = (product) => {
  if (!product) return "/placeholder.jpg";
  
  const img = product?.images?.find(i => i.is_primary)?.image_url ||
              product?.images?.[0]?.image_url;
  
  return img ? getImageUrl(img) : "/placeholder.jpg";
};

// API response normalization
export const normalizeProductsFromApi = (data) => {
  if (!data) return [];
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
};

// Navigation helper
export const getProductPath = (product) => {
  if (!product) return "#";
  return `/product/${product.slug ?? product.id}`;
};

// Banner image handling
export const getBannerImageUrl = (image, imagePreview = null) => {
  if (imagePreview?.startsWith("http") || imagePreview?.startsWith("blob:")) 
    return imagePreview;
  if (image?.startsWith("http") || image?.startsWith("blob:")) 
    return image;
  return image ? getImageUrl(image) : "/placeholder.jpg";
};
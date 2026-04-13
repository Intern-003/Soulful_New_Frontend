export const AUTH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
};

export const PRODUCT = {
  DETAILS: (slug) => `/products/${slug}`,
};
export const BANNER = {
  LIST: "/admin/banners",
  CREATE: "/admin/banners",
  UPDATE: (id) => `/admin/banners/${id}`,
  DELETE: (id) => `/admin/banners/${id}`,
};
export const AUTH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
};

export const PRODUCT = {
  DETAILS: (identifier) => `/products/${identifier}`,
};


export const BANNER = {
  LIST: "/admin/banners",
  CREATE: "/admin/banners",
  UPDATE: (id) => `/admin/banners/${id}`,
  DELETE: (id) => `/admin/banners/${id}`,
};
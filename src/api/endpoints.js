export const AUTH = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
};

export const PRODUCT = {
  DETAILS: (slug) => `/products/${slug}`,
};
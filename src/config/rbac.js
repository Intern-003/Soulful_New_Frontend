// src/config/rbac.js
export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_PRODUCTS: "manage_products",
  MANAGE_ORDERS: "manage_orders",
  MANAGE_USERS: "manage_users",
  MANAGE_CATEGORIES: "manage_categories",

};

export const ROLE_PERMISSIONS = {
  admin: [
    "view_dashboard",
    "manage_products",
    "manage_orders",
    "manage_users",
  ],
  vendor: [
    "view_dashboard",
    "manage_products",
    "manage_orders",
  ],
};
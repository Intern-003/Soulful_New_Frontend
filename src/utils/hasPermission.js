// export const hasPermission = (role, permission) => {
//   if (!role) return false;

//   const permissions = {
//     admin: ["view_dashboard", "manage_products", "manage_orders", "manage_users"],
//     vendor: ["view_dashboard", "manage_products", "manage_orders"],
//   };

//   return permissions[role]?.includes(permission);
// };


export const hasPermission = (permissions, module, action) => {
  return permissions?.some(
    (perm) => perm.module === module && perm.action === action
  );
};
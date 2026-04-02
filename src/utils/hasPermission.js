export const hasPermission = (input, module, action) => {
  if (!input) return false;

  // 🔹 CASE 1: role string
  if (typeof input === "string") {
    const map = {
      admin: ["all"],
      vendor: ["products_view", "products_create"],
    };

    return map[input]?.includes("all") || map[input]?.includes(module);
  }

  // 🔹 CASE 2: permissions array
  if (Array.isArray(input)) {
    return input.some(
      (perm) =>
        perm.module === module && perm.action === action
    );
  }

  return false;
};
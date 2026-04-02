// src/components/dashboard/Sidebar.jsx

import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/hasPermission";
import { PERMISSIONS } from "../../config/rbac";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role || "admin";

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      icon: Package,
      permission: PERMISSIONS.MANAGE_PRODUCTS,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: ShoppingCart,
      permission: PERMISSIONS.MANAGE_ORDERS,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: Users,
      permission: PERMISSIONS.MANAGE_USERS,
    },
    {
      name: "Categories",
      path: "/dashboard/categories",
      icon: Package,
      permission: PERMISSIONS.MANAGE_CATEGORIES,
    },
    {
      name: "Roles & Permissions",
      path: "/dashboard/roles",
      icon: Users,
      permission: PERMISSIONS.MANAGE_ROLES,
    },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-sm flex flex-col h-screen">

      {/* LOGO / TITLE */}
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold text-[#7a1c3d]">
          Admin Panel
        </h2>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">

        {menu.map((item) => {
          if (!hasPermission(role, item.permission)) return null;

          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#7a1c3d] text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-gray-400 text-center">
        © 2026 Admin Panel
      </div>

    </div>
  );
};

export default Sidebar;
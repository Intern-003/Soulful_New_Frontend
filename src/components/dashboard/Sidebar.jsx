import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/hasPermission";
import { PERMISSIONS } from "../../config/rbac";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role || "admin";

  const menu = [
    { name: "Dashboard", path: "/dashboard", permission: PERMISSIONS.VIEW_DASHBOARD },
    { name: "Products", path: "/dashboard/products", permission: PERMISSIONS.MANAGE_PRODUCTS },
    { name: "Orders", path: "/dashboard/orders", permission: PERMISSIONS.MANAGE_ORDERS },
    { name: "Users", path: "/dashboard/users", permission: PERMISSIONS.MANAGE_USERS },
  ];

  return (
    <div className="w-64 bg-white shadow-md min-h-screen">
      <h2 className="p-4 font-bold text-[#7a1c3d] text-xl">Dashboard</h2>

      {menu.map((item) => {
        if (!hasPermission(role, item.permission)) return null;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 ${
              location.pathname === item.path
                ? "bg-[#7a1c3d] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
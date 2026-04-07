import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import usePermissions from "../../api/hooks/usePermissions";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

/* ✅ Reusable Menu Item */
const MenuItem = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? "bg-[#7a1c3d] text-white shadow"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { can } = usePermissions();
  const [openOrders, setOpenOrders] = useState(false);

  // Permissions
  const canAdminOrders = can("order_admin", "view");
  const canVendorOrders = can("order_vendor", "view");
  const showOrderDropdown = canAdminOrders && canVendorOrders;

  // Menu config
  const menu = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      module: "dashboard",
    },
    {
      label: "Products",
      path: "/dashboard/products",
      icon: Package,
      module: "product",
    },
    {
      label: "Users",
      path: "/dashboard/users",
      icon: Users,
      module: "user",
    },
    {
      label: "Categories",
      path: "/dashboard/categories",
      icon: Package,
      module: "category",
    },
    {
      label: "Attributes",
      path: "/dashboard/attributes",
      icon: Package,
      module: "attribute",
    },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-sm flex flex-col h-screen">

      {/* HEADER */}
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold text-[#7a1c3d]">
          Admin Panel
        </h2>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">

        {/* Dynamic Menu */}
        {menu.map((item) => {
          if (!can(item.module, "view")) return null;

          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <MenuItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={isActive}
            />
          );
        })}

        {/* ORDERS SECTION */}
        {(canAdminOrders || canVendorOrders) && (
          <div>
            {showOrderDropdown ? (
              <>
                <button
                  onClick={() => setOpenOrders(!openOrders)}
                  className="flex items-center justify-between w-full px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={18} />
                    <span className="text-sm font-medium">Orders</span>
                  </div>
                  <span>{openOrders ? "▲" : "▼"}</span>
                </button>

                {openOrders && (
                  <div className="ml-8 mt-1 space-y-1">
                    {canAdminOrders && (
                      <Link
                        to="/dashboard/orders/admin"
                        className={`block px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                          location.pathname.startsWith(
                            "/dashboard/orders/admin"
                          )
                            ? "text-[#7a1c3d] font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        Admin Orders
                      </Link>
                    )}

                    {canVendorOrders && (
                      <Link
                        to="/dashboard/orders/vendor"
                        className={`block px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                          location.pathname.startsWith(
                            "/dashboard/orders/vendor"
                          )
                            ? "text-[#7a1c3d] font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        Vendor Orders
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {canAdminOrders && !canVendorOrders && (
                  <MenuItem
                    to="/dashboard/orders/admin"
                    icon={ShoppingCart}
                    label="Orders"
                    isActive={location.pathname.startsWith(
                      "/dashboard/orders/admin"
                    )}
                  />
                )}

                {canVendorOrders && !canAdminOrders && (
                  <MenuItem
                    to="/dashboard/orders/vendor"
                    icon={ShoppingCart}
                    label="Orders"
                    isActive={location.pathname.startsWith(
                      "/dashboard/orders/vendor"
                    )}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-gray-400 text-center">
        © 2026 Admin Panel
      </div>
    </div>
  );
};

export default Sidebar;
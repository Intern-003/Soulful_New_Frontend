import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Menu,
} from "lucide-react";

/* ✅ Reusable Menu Item */
const MenuItem = ({ to, icon: Icon, label, isActive, collapsed }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group relative
        ${
          isActive
            ? "bg-[#7a1c3d] text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <Icon size={20} />

      {!collapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}

      {/* Active indicator animation */}
      {isActive && (
        <span className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);

  // Permissions
  // const canAdminOrders = can("order_admin", "view");
  // const canVendorOrders = can("order_vendor", "view");
  // const showOrderDropdown = canAdminOrders && canVendorOrders;

  // Menu config
  const menu = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/dashboard/products",
      icon: Package,
    },
    {
      label: "Users",
      path: "/dashboard/users",
      icon: Users,
    },
    {
      label:"Roles",
      path:"/dashboard/roles",
      icon: Users,
    },
    {
      label: "Categories",
      path: "/dashboard/categories",
      icon: Package,
    },
    {
      label: "Attributes",
      path: "/dashboard/attributes",
      icon: Package,
    },
    {
      label: "Permissions",
      path: "/dashboard/permissions",
      icon: Package,  
    },
    {
      label: "Banners",
      path: "/dashboard/banners",
      icon: Package,
    },
    {
      label: "Brands",
      path: "/dashboard/brands",
      icon: Package,
    },
    {
      label: "Support",
      path: "/dashboard/support",
      icon: Package,
    },
    {
      label: "Vendors",
      path: "/dashboard/vendors",
      icon: Users,
    },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
        <h2 className="text-lg font-bold text-[#7a1c3d]">Admin</h2>
        <button onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r shadow-sm z-50 flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold text-[#7a1c3d]">
              Admin Panel
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {menu.map((item) => {
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
                collapsed={collapsed}
              />
            );
          })}

          {/* ORDERS DROPDOWN */}
          <div>
            <button
              onClick={() => setOpenOrders(!openOrders)}
              className="flex items-center justify-between w-full px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-700"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} />
                {!collapsed && (
                  <span className="text-sm font-medium">Orders</span>
                )}
              </div>
              {!collapsed && <span>{openOrders ? "▲" : "▼"}</span>}
            </button>

            {openOrders && !collapsed && (
              <div className="ml-8 mt-2 space-y-1">
                <Link
                  to="/dashboard/orders/admin"
                  className={`block px-3 py-2 text-sm rounded-lg transition
                  ${
                    location.pathname.startsWith("/dashboard/orders/admin")
                      ? "bg-[#7a1c3d]/10 text-[#7a1c3d] font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Admin Orders
                </Link>

                <Link
                  to="/dashboard/orders/vendor"
                  className={`block px-3 py-2 text-sm rounded-lg transition
                  ${
                    location.pathname.startsWith("/dashboard/orders/vendor")
                      ? "bg-[#7a1c3d]/10 text-[#7a1c3d] font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Vendor Orders
                </Link>
            
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t text-xs text-gray-400 text-center">
          © 2026 Admin Panel
        </div>
      </div>
    </>
  );
};

export default Sidebar;
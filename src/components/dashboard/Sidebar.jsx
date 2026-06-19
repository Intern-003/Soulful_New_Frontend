import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import {
  LayoutDashboard,
  Package,
  Users,
  Shield,
  Layers3,
  Tags,
  KeyRound,
  Image,
  BadgeDollarSign,
  LifeBuoy,
  Store,
  TicketPercent,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  UserCircle2,
  LogOut,
  Sparkles,
  Wallet,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import { logout } from "../../app/slices/authSlice";
import { useDispatch } from "react-redux";

/* ==========================================================
   SIDEBAR WITH ROLE + PERMISSION CHECKS
   ✔ Admins see ALL orders, coupons, earnings
   ✔ Vendors see ONLY their own orders, coupons, earnings
   ✔ Module-based permission checks for other menus
   ✔ Smart dashboard routing for users with multiple roles
========================================================== */

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [couponsOpen, setCouponsOpen] = useState(true);
  const [earningsOpen, setEarningsOpen] = useState(true);
  const [withdrawalsOpen, setWithdrawalsOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [loadingLogout, setLoadingLogout] = useState(false);

  // ✅ Get user, role, and permissions from Redux
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const permissions = useSelector((state) => state.auth.permissions);

  /* ========================================
     PERMISSION HELPERS
  ======================================== */

  // ✅ Check if user has ANY permission for a module
  const canAccessModule = (moduleName) => {
    if (!permissions || permissions.length === 0) return false;

    if (typeof permissions[0] === 'string') {
      return permissions.some((p) => p.startsWith(moduleName + '.'));
    }

    return permissions.some((p) => p.module === moduleName);
  };

  // ✅ Check if user has specific permission
  const hasPermission = (permissionName) => {
    if (!permissions || permissions.length === 0) return false;

    if (typeof permissions[0] === 'string') {
      return permissions.includes(permissionName);
    }

    const [module, action] = permissionName.split('.');
    return permissions.some((p) => p.module === module && p.action === action);
  };

  // ✅ Role checks
  const isAdmin = role === 'admin' || role === 'Admin';
  const isVendor = role === 'vendor' || role === 'Vendor';

  /* ========================================
     ORDERS - ROLE + PERMISSION CHECKS
     ✅ Admin: Can see ALL orders (order.view permission)
     ✅ Vendor: Can see ONLY their own orders (order.view permission)
  ======================================== */

  const canViewAdminOrders = isAdmin && hasPermission("order.view");
  const canViewVendorOrders = isVendor && hasPermission("order.view");
  const canViewOrders = canViewAdminOrders || canViewVendorOrders;

  /* ========================================
     COUPONS - ROLE + PERMISSION CHECKS
     ✅ Admin: Can see ALL coupons (coupon.view permission)
     ✅ Vendor: Can see ONLY their own coupons (coupon.view permission)
  ======================================== */

  const canViewAdminCoupons = isAdmin && hasPermission("coupon.view");
  const canViewVendorCoupons = isVendor && hasPermission("coupon.view");
  const canViewCoupons = canViewAdminCoupons || canViewVendorCoupons;

  /* ========================================
     EARNINGS - ROLE + PERMISSION CHECKS
     ✅ Admin: Can see ALL vendors' earnings (withdrawal.view)
     ✅ Vendor: Can see ONLY their own earnings (wallet.view)
  ======================================== */

  const canViewAdminEarnings = isAdmin && hasPermission("withdrawal.view");
  const canViewVendorEarnings = isVendor && hasPermission("wallet.view");
  const canViewEarnings = canViewAdminEarnings || canViewVendorEarnings;

  /* ========================================
     WITHDRAWALS - ROLE + PERMISSION CHECKS
     ✅ Admin: Can see ALL withdrawals (withdrawal.view)
     ✅ Vendor: Can see ONLY their own withdrawals (wallet.view)
  ======================================== */

  const canViewAdminWithdrawals = isAdmin && hasPermission("withdrawal.view");
  const canViewVendorWithdrawals = isVendor && hasPermission("wallet.view");
  const canViewWithdrawals = canViewAdminWithdrawals || canViewVendorWithdrawals;

  /* ========================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ======================================== */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ========================================
     LOGOUT
  ======================================== */
  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoadingLogout(false);
    }
  };

  /* ========================================
     ✅ MENU ITEMS WITH BOTH DASHBOARDS
     Shows both Admin and Vendor dashboards if permitted
  ======================================== */
  const menus = useMemo(
    () => {
      const menuItems = [];

      // ✅ Admin Dashboard - Show if user has admin dashboard permission
      if (hasPermission("dashboard.view")) {
        menuItems.push({
          label: "Admin Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
          module: "dashboard",
          isAdmin: true,
        });
      }

      // ✅ Vendor Dashboard - Show if user has vendor dashboard permission
      if (hasPermission("vendor.dashboard.view")) {
        menuItems.push({
          label: "Vendor Dashboard",
          path: "/dashboard/vendor/dashboard",
          icon: Store,
          module: "vendor.dashboard",
          isVendor: true,
        });
      }

      // ✅ Other menu items (only if user has access)
      const commonMenus = [
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
          label: "Roles",
          path: "/dashboard/roles",
          icon: Shield,
          module: "role",
        },
        {
          label: "Categories",
          path: "/dashboard/categories",
          icon: Layers3,
          module: "category",
        },
        {
          label: "Attributes",
          path: "/dashboard/attributes",
          icon: Tags,
          module: "attribute",
        },
        {
          label: "Permissions",
          path: "/dashboard/permissions",
          icon: KeyRound,
          module: "permission",
        },
        {
          label: "Banners",
          path: "/dashboard/banners",
          icon: Image,
          module: "banner",
        },
        {
          label: "Brands",
          path: "/dashboard/brands",
          icon: BadgeDollarSign,
          module: "brand",
        },
        {
          label: "Support",
          path: "/dashboard/support",
          icon: LifeBuoy,
          module: "support",
        },
        {
          label: "Vendors",
          path: "/dashboard/vendors",
          icon: Store,
          module: "vendor",
        },
      ];

      // Add common menus if user has permission
      commonMenus.forEach(item => {
        if (canAccessModule(item.module)) {
          menuItems.push(item);
        }
      });

      return menuItems;
    },
    [hasPermission, canAccessModule]
  );

  // ✅ Filter menus by search
  const filteredMenus = menus
    .filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );

  // ✅ Helper: Check if current route is active
  const isActive = (path) => {
    if (path === "/dashboard" || path === "/dashboard/vendor/dashboard") {
      return location.pathname === "/dashboard" || 
             location.pathname === "/dashboard/vendor/dashboard";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Check if current path is in coupon routes
  const isCouponActive = () => {
    return (
      location.pathname.includes("/dashboard/coupons") ||
      location.pathname.includes("/admin/coupons")
    );
  };

  // Check if current path is in orders routes
  const isOrderActive = () => {
    return (
      location.pathname.includes("/dashboard/admin/orders") ||
      location.pathname.includes("/dashboard/vendor/orders")
    );
  };

  // Check if current path is in earnings routes
  const isEarningsActive = () => {
    return (
      location.pathname.includes("/dashboard/earnings") ||
      location.pathname.includes("/dashboard/admin/earnings")
    );
  };

  // Check if current path is in withdrawals routes
  const isWithdrawalsActive = () => {
    return (
      location.pathname.includes("/dashboard/withdrawals") ||
      location.pathname.includes("/dashboard/admin/withdrawals")
    );
  };

  const displayName = user?.name || "Loading...";
  const displayRole = role || "Loading...";

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b flex items-center justify-between px-4">
        <h2 className="font-bold text-[#7b183f]">Admin Panel</h2>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MOBILE SPACER */}
      <div className="h-14 lg:hidden" />

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-white border-r shadow-xl
          transition-all duration-300 flex flex-col
          ${collapsed ? "w-24" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="border-b p-5">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#7b183f]"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {!collapsed ? (
              <div className="ml-2">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-[#7b183f]">
                  <Sparkles size={18} />
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 mt-1">Elite Management Suite</p>
              </div>
            ) : (
              <div className="mx-auto text-2xl font-bold text-[#7b183f]">A</div>
            )}

            <div className="flex gap-1">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* SEARCH */}
          {!collapsed && (
            <div className="mt-4 relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full rounded-xl border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#7b183f]/20"
              />
            </div>
          )}
        </div>

        {/* MENUS */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {/* ✅ Show both dashboards if permitted */}
          {filteredMenus.map((item) => (
            <MenuItem
              key={item.path}
              item={item}
              active={isActive(item.path)}
              collapsed={collapsed}
            />
          ))}

          {/* ✅ ORDERS - Role + Permission based */}
          {canViewOrders && (
            <div>
              <button
                onClick={() => setOrdersOpen(!ordersOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-100 transition ${
                  isOrderActive() && !collapsed ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} />
                  {!collapsed && <span className="text-sm font-medium">Orders</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${ordersOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {!collapsed && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    ordersOpen ? "max-h-40 mt-2" : "max-h-0"
                  }`}
                >
                  {/* ✅ Admin Orders - View ALL orders */}
                  {canViewAdminOrders && (
                    <SubItem
                      to="/dashboard/admin/orders"
                      active={location.pathname.includes("/dashboard/admin/orders")}
                    >
                      All Orders
                      <span className="ml-2 text-xs text-gray-400">(Admin)</span>
                    </SubItem>
                  )}

                  {/* ✅ Vendor Orders - View ONLY own orders */}
                  {canViewVendorOrders && (
                    <SubItem
                      to="/dashboard/vendor/orders"
                      active={location.pathname.includes("/dashboard/vendor/orders")}
                    >
                      My Orders
                      <span className="ml-2 text-xs text-gray-400">(Vendor)</span>
                    </SubItem>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ✅ COUPONS - Role + Permission based */}
          {canViewCoupons && (
            <div>
              <button
                onClick={() => setCouponsOpen(!couponsOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-100 transition ${
                  isCouponActive() && !collapsed ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <TicketPercent size={20} />
                  {!collapsed && <span className="text-sm font-medium">Coupons</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${couponsOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {!collapsed && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    couponsOpen ? "max-h-40 mt-2" : "max-h-0"
                  }`}
                >
                  {/* ✅ Admin Coupons - View ALL coupons */}
                  {canViewAdminCoupons && (
                    <SubItem
                      to="/dashboard/admin/coupons"
                      active={location.pathname.includes("/dashboard/admin/coupons")}
                    >
                      All Coupons
                      <span className="ml-2 text-xs text-gray-400">(Admin)</span>
                    </SubItem>
                  )}

                  {/* ✅ Vendor Coupons - View ONLY own coupons */}
                  {canViewVendorCoupons && (
                    <SubItem
                      to="/dashboard/coupons"
                      active={location.pathname === "/dashboard/coupons" || location.pathname.includes("/dashboard/coupons/")}
                    >
                      My Coupons
                      <span className="ml-2 text-xs text-gray-400">(Vendor)</span>
                    </SubItem>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ✅ EARNINGS - Role + Permission based */}
          {canViewEarnings && (
            <div>
              <button
                onClick={() => setEarningsOpen(!earningsOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-100 transition ${
                  isEarningsActive() && !collapsed ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet size={20} />
                  {!collapsed && <span className="text-sm font-medium">Earnings</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${earningsOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {!collapsed && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    earningsOpen ? "max-h-40 mt-2" : "max-h-0"
                  }`}
                >
                  {/* ✅ Admin Earnings - View ALL vendors' earnings */}
                  {canViewAdminEarnings && (
                    <SubItem
                      to="/dashboard/admin/earnings"
                      active={location.pathname.includes("/dashboard/admin/earnings")}
                    >
                      All Earnings
                      <span className="ml-2 text-xs text-gray-400">(Admin)</span>
                    </SubItem>
                  )}

                  {/* ✅ Vendor Earnings - View ONLY own earnings */}
                  {canViewVendorEarnings && (
                    <SubItem
                      to="/dashboard/earnings"
                      active={location.pathname === "/dashboard/earnings" || location.pathname.includes("/dashboard/earnings/")}
                    >
                      My Earnings
                      <span className="ml-2 text-xs text-gray-400">(Vendor)</span>
                    </SubItem>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ✅ WITHDRAWALS - Role + Permission based */}
          {canViewWithdrawals && (
            <div>
              <button
                onClick={() => setWithdrawalsOpen(!withdrawalsOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-100 transition ${
                  isWithdrawalsActive() && !collapsed ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign size={20} />
                  {!collapsed && <span className="text-sm font-medium">Withdrawals</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${withdrawalsOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {!collapsed && (
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    withdrawalsOpen ? "max-h-40 mt-2" : "max-h-0"
                  }`}
                >
                  {/* ✅ Admin Withdrawals - View ALL withdrawal requests */}
                  {canViewAdminWithdrawals && (
                    <SubItem
                      to="/dashboard/admin/withdrawals"
                      active={location.pathname.includes("/dashboard/admin/withdrawals")}
                    >
                      All Withdrawals
                      <span className="ml-2 text-xs text-gray-400">(Admin)</span>
                    </SubItem>
                  )}

                  {/* ✅ Vendor Withdrawals - View ONLY own withdrawals */}
                  {canViewVendorWithdrawals && (
                    <SubItem
                      to="/dashboard/withdrawals"
                      active={location.pathname === "/dashboard/withdrawals" || location.pathname.includes("/dashboard/withdrawals/")}
                    >
                      My Withdrawals
                      <span className="ml-2 text-xs text-gray-400">(Vendor)</span>
                    </SubItem>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t p-4">
          {!collapsed ? (
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <UserCircle2 size={42} className="text-[#7b183f]" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold truncate">{displayName}</h4>
                  <p className="text-xs text-gray-500 capitalize truncate">{displayRole}</p>
                  {/* ✅ Show role badge for clarity */}
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                    isAdmin ? 'bg-purple-100 text-purple-700' :
                    isVendor ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {isAdmin ? '🔑 Admin' : isVendor ? '🏪 Vendor' : '👤 User'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="mt-3 w-full rounded-xl bg-[#7b183f] text-white py-2 text-sm font-medium hover:bg-[#651432] transition disabled:opacity-50"
              >
                {loadingLogout ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center">
              <LogOut size={20} className="text-[#7b183f]" />
            </button>
          )}
        </div>
      </aside>

      {/* DESKTOP SPACER */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          collapsed ? "w-24" : "w-72"
        }`}
      />
    </>
  );
}

/* ===========================================
   MENU ITEM
=========================================== */
function MenuItem({ item, active, collapsed }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl transition-all
        ${active
          ? "bg-gradient-to-r from-[#7b183f] to-[#a52355] text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <Icon size={20} />
      {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
    </Link>
  );
}

/* ===========================================
   SUB ITEM
=========================================== */
function SubItem({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`
        block ml-8 mb-1 rounded-xl px-3 py-2 text-sm transition
        ${active
          ? "bg-[#7b183f]/10 text-[#7b183f] font-semibold"
          : "text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      {children}
    </Link>
  );
}
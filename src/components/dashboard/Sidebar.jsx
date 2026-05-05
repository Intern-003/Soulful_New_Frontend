import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

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
} from "lucide-react";

import axiosInstance from "../../api/axiosInstance";

/* ==========================================================
   PRODUCTION GRADE ADMIN SIDEBAR
   ✔ Fully Responsive Mobile / Tablet / Desktop
   ✔ Dynamic Name + Role from /auth/me
   ✔ Working Logout API
   ✔ Admin Orders + Vendor Orders Included
   ✔ Collapsible Desktop
   ✔ Search Menu
   ✔ Smooth Animations
========================================================== */

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [ordersOpen, setOrdersOpen] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [loadingLogout, setLoadingLogout] =
    useState(false);

  const [profile, setProfile] =
    useState({
      name: "Loading...",
      role: "Loading...",
    });

  /* ========================================
     FETCH USER PROFILE
  ======================================== */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res =
        await axiosInstance.get(
          "/auth/me"
        );

      setProfile({
        name:
          res?.data?.user?.name ||
          "Admin User",

        role:
          res?.data?.role ||
          "Admin",
      });
    } catch (error) {
      setProfile({
        name: "Admin User",
        role: "Admin",
      });
    }
  };

  /* ========================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ======================================== */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ========================================
     LOGOUT
  ======================================== */
  const handleLogout =
    async () => {
      try {
        setLoadingLogout(true);

        await axiosInstance.post(
          "/auth/logout"
        );
      } catch (error) {}

      localStorage.removeItem(
        "token"
      );
      localStorage.removeItem(
        "user"
      );
      localStorage.removeItem(
        "role"
      );
      localStorage.removeItem(
        "permissions"
      );
      localStorage.removeItem(
        "user_id"
      );

      navigate("/login");
    };

  /* ========================================
     MENU ITEMS
  ======================================== */
  const menus = useMemo(
    () => [
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
        label: "Roles",
        path: "/dashboard/roles",
        icon: Shield,
      },
      {
        label: "Categories",
        path: "/dashboard/categories",
        icon: Layers3,
      },
      {
        label: "Attributes",
        path: "/dashboard/attributes",
        icon: Tags,
      },
      {
        label: "Permissions",
        path: "/dashboard/permissions",
        icon: KeyRound,
      },
      {
        label: "Banners",
        path: "/dashboard/banners",
        icon: Image,
      },
      {
        label: "Brands",
        path: "/dashboard/brands",
        icon: BadgeDollarSign,
      },
      {
        label: "Support",
        path: "/dashboard/support",
        icon: LifeBuoy,
      },
      {
        label: "Vendors",
        path: "/dashboard/vendors",
        icon: Store,
      },
      {
        label: "Coupons",
        path: "/dashboard/coupons",
        icon: TicketPercent,
      },
    ],
    []
  );

  const filteredMenus =
    menus.filter((item) =>
      item.label
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b flex items-center justify-between px-4">
        <h2 className="font-bold text-[#7b183f]">
          Admin Panel
        </h2>

        <button
          onClick={() =>
            setMobileOpen(true)
          }
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
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
fixed top-0 left-0 z-50 h-screen bg-white border-r shadow-xl
transition-all duration-300 flex flex-col

${collapsed ? "w-24" : "w-72"}

${
  mobileOpen
    ? "translate-x-0"
    : "-translate-x-full lg:translate-x-0"
}
`}
      >
        {/* HEADER */}
        <div className="border-b p-5">
          <div className="flex items-center justify-between">
            {!collapsed ? (
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-[#7b183f]">
                  <Sparkles
                    size={18}
                  />
                  Admin Panel
                </h1>

                <p className="text-xs text-gray-500 mt-1">
                  Elite Management
                  Suite
                </p>
              </div>
            ) : (
              <div className="mx-auto text-2xl font-bold text-[#7b183f]">
                A
              </div>
            )}

            <div className="flex gap-1">
              {/* DESKTOP COLLAPSE */}
              <button
                onClick={() =>
                  setCollapsed(
                    !collapsed
                  )
                }
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100"
              >
                {collapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button>

              {/* MOBILE CLOSE */}
              <button
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* SEARCH */}
          {!collapsed && (
            <div className="mt-4 relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(
                  e
                ) =>
                  setSearch(
                    e.target
                      .value
                  )
                }
                placeholder="Search menu..."
                className="w-full rounded-xl border bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#7b183f]/20"
              />
            </div>
          )}
        </div>

        {/* MENUS */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {filteredMenus.map(
            (item) => (
              <MenuItem
                key={item.path}
                item={item}
                active={isActive(
                  location.pathname,
                  item.path
                )}
                collapsed={
                  collapsed
                }
              />
            )
          )}

          {/* ORDERS */}
          <div>
            <button
              onClick={() =>
                setOrdersOpen(
                  !ordersOpen
                )
              }
              className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart
                  size={20}
                />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    Orders
                  </span>
                )}
              </div>

              {!collapsed && (
                <ChevronDown
                  size={16}
                  className={`transition ${
                    ordersOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              )}
            </button>

            {!collapsed && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  ordersOpen
                    ? "max-h-40 mt-2"
                    : "max-h-0"
                }`}
              >
                <SubItem
                  to="/dashboard/admin/orders"
                  active={location.pathname.includes(
                    "/dashboard/admin/orders"
                  )}
                >
                  Admin Orders
                </SubItem>

                <SubItem
                  to="/dashboard/vendor/orders"
                  active={location.pathname.includes(
                    "/dashboard/vendor/orders"
                  )}
                >
                  Vendor Orders
                </SubItem>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t p-4">
          {!collapsed ? (
            <div className="bg-gray-50 rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <UserCircle2
                  size={42}
                  className="text-[#7b183f]"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold truncate">
                    {
                      profile.name
                    }
                  </h4>

                  <p className="text-xs text-gray-500 capitalize truncate">
                    {
                      profile.role
                    }
                  </p>
                </div>
              </div>

              <button
                onClick={
                  handleLogout
                }
                disabled={
                  loadingLogout
                }
                className="mt-3 w-full rounded-xl bg-[#7b183f] text-white py-2 text-sm font-medium hover:bg-[#651432] transition"
              >
                {loadingLogout
                  ? "Logging out..."
                  : "Logout"}
              </button>
            </div>
          ) : (
            <button
              onClick={
                handleLogout
              }
              className="w-full flex justify-center"
            >
              <LogOut
                size={20}
                className="text-[#7b183f]"
              />
            </button>
          )}
        </div>
      </aside>

      {/* DESKTOP SPACER */}
      <div
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          collapsed
            ? "w-24"
            : "w-72"
        }`}
      />
    </>
  );
}

/* ===========================================
   MENU ITEM
=========================================== */
function MenuItem({
  item,
  active,
  collapsed,
}) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className={`
flex items-center gap-3 px-4 py-3 rounded-2xl transition-all

${
  active
    ? "bg-gradient-to-r from-[#7b183f] to-[#a52355] text-white shadow-lg"
    : "text-gray-700 hover:bg-gray-100"
}
`}
    >
      <Icon size={20} />

      {!collapsed && (
        <span className="text-sm font-medium truncate">
          {item.label}
        </span>
      )}
    </Link>
  );
}

/* ===========================================
   SUB ITEM
=========================================== */
function SubItem({
  to,
  active,
  children,
}) {
  return (
    <Link
      to={to}
      className={`
block ml-8 mb-1 rounded-xl px-3 py-2 text-sm transition

${
  active
    ? "bg-[#7b183f]/10 text-[#7b183f] font-semibold"
    : "text-gray-600 hover:bg-gray-100"
}
`}
    >
      {children}
    </Link>
  );
}

/* ===========================================
   ACTIVE ROUTE
=========================================== */
function isActive(
  pathname,
  path
) {
  if (
    path === "/dashboard"
  ) {
    return (
      pathname ===
      "/dashboard"
    );
  }

  return (
    pathname === path ||
    pathname.startsWith(
      path + "/"
    )
  );
}
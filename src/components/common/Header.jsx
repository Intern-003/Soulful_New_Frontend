import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout as logoutAction } from "../../app/slices/authSlice";
import usePermissions from "../../api/hooks/usePermissions";
import { getImageUrl } from "../../utils/getImageUrl";
import axiosInstance from "../../api/axiosInstance";
import TopBar from "./TopBar";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { can } = usePermissions();
  const { items: cartItems } = useSelector((state) => state.cart);

  // Search
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // UI States
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Search with debounce
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/products/search", {
          params: { q: query },
        });
        setSuggestions(res.data?.data?.data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search failed", err);
        setSuggestions([]);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (e) {
      // Handle error silently
    }

    dispatch(logoutAction());
    setProfileOpen(false);
    navigate("/login");
  };

  const wishlistCount = useSelector(
    (state) => state.wishlist?.items?.length || 0,
  );

  // Add touch event handling for mobile
  useEffect(() => {
    const handleTouchOutside = (e) => {
      if (
        profileOpen &&
        !e.target.closest(".profile-dropdown") &&
        !e.target.closest(".profile-trigger")
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("touchstart", handleTouchOutside);
    return () => document.removeEventListener("touchstart", handleTouchOutside);
  }, [profileOpen]);

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <TopBar />

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <button className="md:hidden" onClick={() => setMobileMenu(true)}>
            <Menu size={24} />
          </button>

          {/* Logo */}
          <h1
            className="text-xl md:text-2xl font-extrabold cursor-pointer tracking-tight"
            onClick={() => navigate("/")}
          >
            <span className="text-[#7a1c3d]">Soulful</span>{" "}
            <span className="text-black">Overseas</span>
          </h1>
        </div>

        <div className="hidden md:flex flex-1 max-w-2xl">
          <div className="flex items-center w-full border border-gray-200 rounded-full overflow-hidden bg-gray-50 hover:bg-white transition shadow-sm hover:shadow-md">
            {/* Icon */}
            <Search size={18} className="ml-4 text-gray-400" />

            {/* Input */}
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-3 py-2.5 bg-transparent outline-none text-sm"
            />

            {/* Button */}
            <button className="bg-[#7a1c3d] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#5f132e] transition cursor-pointer">
              Search
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* WISHLIST */}
          <div
            onClick={() => navigate("/wishlist")}
            className="relative cursor-pointer group"
          >
            <Heart
              size={22}
              className="text-gray-700 group-hover:text-[#7a1c3d] transition"
            />

            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#7a1c3d] text-white text-[10px] px-1.5 py-[1px] rounded-full shadow">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* CART */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer group"
          >
            <ShoppingCart
              size={22}
              className="text-gray-700 group-hover:text-[#7a1c3d] transition"
            />

            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#7a1c3d] text-white text-[10px] px-1.5 py-[1px] rounded-full shadow">
                {cartItems.length}
              </span>
            )}
          </div>

          {/* ACCOUNT */}
          <div
            className="relative"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            {/* TRIGGER */}
            <div className="flex items-center gap-2 cursor-pointer">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#f3e8ee] flex items-center justify-center text-[#7a1c3d] font-semibold text-sm shadow-sm hover:shadow-md transition">
                {user?.name?.[0] || "A"}
              </div>

              {/* Name */}
              <div className="hidden md:flex flex-col leading-tight">
                <span className="text-[11px] text-gray-400">Welcome</span>
                <span className="text-sm font-semibold text-gray-800">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
              </div>
            </div>

            {/* DROPDOWN */}
            <div
              className={`absolute right-0 top-full pt-2 z-50 transition-all duration-200
                ${
                  profileOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible translate-y-2"
                }
              `}
            >
              <div className="w-56 bg-white shadow-2xl rounded-xl py-2 border border-gray-100">
                {user ? (
                  <>
                    <div
                      onClick={() => navigate("/account")}
                      className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition"
                    >
                      My Profile
                    </div>

                    <div
                      onClick={handleLogout}
                      className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer text-red-500 transition"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => navigate("/login")}
                    className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition"
                  >
                    Login / Register
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="border-t border-gray-100 hidden md:block bg-white">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-3 pb-6">
          <div className="flex items-center gap-8 text-[14px] font-semibold tracking-wide">
            {[
              { name: "Home", path: "/" },
              { name: "Shop All", path: "/shop" },
              {
                name: "About",
                dropdown: [
                  { name: "About Us", path: "/about" },
                  { name: "Contact Us", path: "/contact" },
                  { name: "Review", path: "/reviews" },
                ],
              },
              { name: "Soulful Special", path: "/soulful-special" },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <span
                  onClick={() => item.path && navigate(item.path)}
                  className="relative cursor-pointer text-gray-700 hover:text-[#7A1C3D] transition"
                >
                  {item.name}

                  {/* <span className="absolute left-0 -bottom-1 h-[1.5px] w-0 bg-[#7A1C3D] transition-all duration-300 group-hover:w-full"></span> */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[1.5px] bg-[#7A1C3D] transition-all duration-300
                      ${location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </span>

                {item.dropdown && (
                  <div
                    className="
                      absolute left-0 top-full mt-4
                      w-48
                      bg-white
                      border border-gray-100
                      shadow-xl
                      rounded-xl
                      opacity-0 invisible
                      translate-y-2
                      group-hover:opacity-100
                      group-hover:visible
                      group-hover:translate-y-0
                      transition-all duration-300
                      z-50
                    "
                  >
                    {item.dropdown.map((sub, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(sub.path)}
                        className="
                          px-4 py-3 text-sm
                          cursor-pointer
                          hover:bg-gray-50
                          hover:text-[#7A1C3D]
                          transition
                          first:rounded-t-xl
                          last:rounded-b-xl
                        "
                      >
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <span className="text-gray-300">|</span>

            {[
              { name: "Electronics", path: "/category/electronics" },
              { name: "Fashion", path: "/category/fashion" },
              { name: "Beauty", path: "/category/beauty" },
              { name: "Footwear", path: "/category/footwear" },
              { name: "Bestsellers", path: "/bestsellers" },
              { name: "Fresh Arrivals", path: "/fresharrivals" },
              { name: "Essentials", path: "/category/essentials" },
              { name: "Exclusive", path: "/exclusive" },
            ].map((item, i) => (
              <span
                key={i}
                onClick={() => item.path && navigate(item.path)}
                className={`relative cursor-pointer transition group
                  ${
                    location.pathname === item.path
                      ? "text-[#7A1C3D]"
                      : "text-gray-700 hover:text-[#7A1C3D]"
                  }
                `}
              >
                {item.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[1.5px] bg-[#7A1C3D] transition-all duration-300
                    ${location.pathname === item.path ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                />
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Promo Banner - Moved BELOW the navigation */}
      <div className="bg-[#8b0d3a] text-white text-sm h-2 flex items-center justify-center overflow-hidden">
        <div className="relative h-10 w-full flex items-center justify-center"></div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenu(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 md:hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold text-[#7a1c3d]">Menu</span>
              <button onClick={() => setMobileMenu(false)}>
                <Menu size={20} />
              </button>
            </div>
            <div className="flex flex-col p-4 gap-4 text-base">
              <span
                onClick={() => {
                  navigate("/");
                  setMobileMenu(false);
                }}
                className="cursor-pointer hover:text-[#7a1c3d]"
              >
                Home
              </span>
              <span
                onClick={() => {
                  navigate("/shop");
                  setMobileMenu(false);
                }}
                className="cursor-pointer hover:text-[#7a1c3d]"
              >
                Shop
              </span>
              <span
                onClick={() => {
                  navigate("/about");
                  setMobileMenu(false);
                }}
                className="cursor-pointer hover:text-[#7a1c3d]"
              >
                About Us
              </span>
              <span
                onClick={() => {
                  navigate("/contact");
                  setMobileMenu(false);
                }}
                className="cursor-pointer hover:text-[#7a1c3d]"
              >
                Contact Us
              </span>
              <span
                onClick={() => {
                  navigate("/soulful-special");
                  setMobileMenu(false);
                }}
                className="cursor-pointer hover:text-[#7a1c3d]"
              >
                Soulful Special
              </span>
              {hasPermission(permissions, "dashboard", "view") && (
                <span
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileMenu(false);
                  }}
                  className="cursor-pointer hover:text-[#7a1c3d]"
                >
                  Dashboard
                </span>
              )}
              <hr />
              {/* Mobile Search */}
              <div className="relative">
                <div className="flex border rounded-lg overflow-hidden">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 py-2 outline-none text-sm"
                    placeholder="Search products..."
                  />
                  <button className="bg-[#7a1c3d] px-4 text-white">
                    <Search size={18} />
                  </button>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 bg-white shadow-xl mt-1 rounded-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
                    {suggestions.slice(0, 5).map((item) => {
                      const imgUrl =
                        item.images?.find((i) => i.is_primary)?.image_url ||
                        item.images?.[0]?.image_url;
                      return (
                        <div
                          key={item.id}
                          className="flex gap-2 p-2 hover:bg-gray-50 cursor-pointer border-b"
                          onClick={() => {
                            navigate(`/product/${item.slug}`);
                            setQuery("");
                            setShowSuggestions(false);
                            setMobileMenu(false);
                          }}
                        >
                          <img
                            src={getImageUrl(imgUrl) || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="text-xs font-medium truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;

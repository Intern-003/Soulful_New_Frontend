import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";

import { logout as logoutAction } from "../../app/slices/authSlice";
import { selectCartItemCount, selectCartItems } from "../../app/slices/cartSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import axiosInstance from "../../api/axiosInstance";
import TopBar from "./TopBar";
import "../../styles/header.css";
import usePermissions from "../../api/hooks/usePermissions";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { can, permissions } = usePermissions(); // ✅ Added permissions here

  // ✅ Use selectors for better performance
  const cartItemCount = useSelector(selectCartItemCount);
  const cartItems = useSelector(selectCartItems);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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
    } catch (e) { }
    dispatch(logoutAction());
    setProfileOpen(false);
    navigate("/login");
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenu(false);
  };

  // Check if user has any admin-related permission
  const hasAdminAccess = useMemo(() => {
  if (!permissions || permissions.length === 0) return false;

  // For string format
  if (typeof permissions[0] === 'string') {
    return permissions.some(p => 
      p === 'dashboard.view' || 
      p === 'vendor.dashboard.view' ||
      p.includes('dashboard') // This will catch any dashboard permission
    );
  }

  // For object format
  return permissions.some(p => 
    (p.module === 'dashboard' && p.action === 'view') ||
    (p.module === 'vendor.dashboard' && p.action === 'view')
  );
}, [permissions, can]);

  const routes = {
    Electronics: "/category/electronics",
    Fashion: "/category/fashion",
    Beauty: "/category/beauty",
    Footwear: "/category/footwear",
    Bestsellers: "/bestsellers",
    "Fresh Arrivals": "/fresh-arrivals",
    Essentials: "/essentials",
    Exclusive: "/exclusive",
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <TopBar />

      {/* Main Header - Tighter spacing */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 gap-3">
        {/* LEFT - Logo */}
        <div className="flex items-center gap-2">
          <button className="md:hidden" onClick={() => setMobileMenu(true)}>
            <Menu size={24} />
          </button>
          <h1
            className="text-xl md:text-2xl font-extrabold cursor-pointer tracking-tight whitespace-nowrap"
            onClick={() => handleNavigation("/")}
          >
            <span className="text-[#7a1c3d]">Soulful</span>{" "}
            <span className="text-black">Overseas</span>
          </h1>
        </div>

        {/* Desktop Search - Compact */}
        <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchInputRef}>
          <div className="flex items-center w-full border border-gray-200 rounded-full overflow-hidden bg-gray-50 hover:bg-white transition">
            <Search size={16} className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-2 py-2 bg-transparent outline-none text-sm"
            />
            <button
              onClick={() => {
                if (query.trim()) navigate(`/search?q=${query}`);
              }}
              className="bg-[#7a1c3d] text-white px-4 py-2 text-sm font-medium hover:bg-[#5f132e] transition cursor-pointer whitespace-nowrap"
            >
              Search
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
              {suggestions.slice(0, 8).map((item) => {
                const imgUrl = item.images?.find((i) => i.is_primary)?.image_url || item.images?.[0]?.image_url;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b"
                    onClick={() => {
                      navigate(`/product/${item.slug}`);
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <img src={getImageUrl(imgUrl) || "/placeholder.jpg"} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT - Icons with tighter spacing */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            className="md:hidden"
            onClick={() => {
              const searchTerm = prompt("Search products:");
              if (searchTerm?.trim()) navigate(`/search?q=${searchTerm}`);
            }}
          >
            <Search size={20} className="text-gray-700" />
          </button>

          <div onClick={() => handleNavigation("/wishlist")} className="relative cursor-pointer group">
            <Heart size={20} className="text-gray-700 group-hover:text-[#7a1c3d] transition" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#7a1c3d] text-white text-[9px] px-1 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </div>

          <div onClick={() => handleNavigation("/cart")} className="relative cursor-pointer group">
            <ShoppingCart size={20} className="text-gray-700 group-hover:text-[#7a1c3d] transition" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#7a1c3d] text-white text-[9px] px-1 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </div>

          <div
            className="relative"
            onClick={() => window.innerWidth < 768 && setProfileOpen(!profileOpen)}
            onMouseEnter={() => window.innerWidth >= 768 && setProfileOpen(true)}
            onMouseLeave={() => window.innerWidth >= 768 && setProfileOpen(false)}
          >
            <div className="flex items-center gap-1.5 cursor-pointer profile-trigger">
              <div className="w-8 h-8 rounded-full bg-[#f3e8ee] flex items-center justify-center text-[#7a1c3d] font-semibold text-xs shadow-sm hover:shadow-md transition">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400">Welcome</span>
                <span className="text-xs font-semibold text-gray-800">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
              </div>
            </div>

            <div
              className={`absolute right-0 top-full pt-2 z-50 transition-all duration-200 profile-dropdown
                ${profileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}
              `}
            >
              <div className="w-52 bg-white shadow-2xl rounded-xl py-2 border border-gray-100">
                {user ? (
                  <>
                    <div
                      onClick={() => {
                        handleNavigation("/account");
                        setProfileOpen(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer transition flex items-center gap-2"
                    >
                      <User size={14} className="text-gray-500" />
                      My Profile
                    </div>
                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer text-red-500 transition"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => {
                      handleNavigation("/login");
                      setProfileOpen(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer transition"
                  >
                    Login / Register
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation - Compact Single Line */}
      <nav className="border-t border-gray-100 hidden md:block bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 lg:gap-5 py-2.5 flex-wrap">
            {/* Main Navigation */}
            <button
              onClick={() => handleNavigation("/")}
              className={`relative whitespace-nowrap text-sm font-medium transition-colors ${location.pathname === "/" ? "text-[#7A1C3D]" : "text-gray-700 hover:text-[#7A1C3D]"
                }`}
            >
              Home
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-[#7A1C3D] transition-all duration-300 ${location.pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
            </button>

            <button
              onClick={() => handleNavigation("/shop")}
              className={`relative whitespace-nowrap text-sm font-medium transition-colors ${location.pathname === "/shop" ? "text-[#7A1C3D]" : "text-gray-700 hover:text-[#7A1C3D]"
                }`}
            >
              Shop All
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-[#7A1C3D] transition-all duration-300 ${location.pathname === "/shop" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
            </button>

            {/* About Dropdown */}
            <div className="relative group">
              <button className="relative whitespace-nowrap text-sm font-medium text-gray-700 hover:text-[#7A1C3D] transition-colors">
                About
                <span className="absolute left-0 -bottom-1 h-0.5 bg-[#7A1C3D] w-0 group-hover:w-full transition-all duration-300" />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-44 bg-white shadow-lg rounded-lg py-1 border border-gray-100">
                  <button onClick={() => handleNavigation("/about")} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A1C3D] transition-colors">
                    About Us
                  </button>
                  <button onClick={() => handleNavigation("/contact")} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A1C3D] transition-colors">
                    Contact Us
                  </button>
                  <button onClick={() => handleNavigation("/reviews")} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A1C3D] transition-colors">
                    Reviews
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleNavigation("/soulful-special")}
              className={`relative whitespace-nowrap text-sm font-medium transition-colors ${location.pathname === "/soulful-special" ? "text-[#7A1C3D]" : "text-gray-700 hover:text-[#7A1C3D]"
                }`}
            >
              Soulful Special
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-[#7A1C3D] transition-all duration-300 ${location.pathname === "/soulful-special" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
            </button>

            <span className="text-gray-300 text-sm">|</span>

            {/* Categories - Compact */}
            {[
              "Electronics", "Fashion", "Beauty", "Footwear",
              "Bestsellers", "Fresh Arrivals", "Essentials", "Exclusive"
            ].map((category) => (
              <button
                key={category}
                onClick={() => handleNavigation(routes[category])}
                className={`group relative whitespace-nowrap text-sm transition-colors ${location.pathname === routes[category]
                  ? "text-[#7A1C3D] font-semibold"
                  : "text-gray-600 hover:text-[#7A1C3D]"
                  }`}
              >
                {category}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-[#7A1C3D] transition-all duration-300 ${location.pathname === routes[category]
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                    }`}
                />
              </button>
            ))}

            {/* Admin Button - Show for any admin dashboard permission */}
            {hasAdminAccess && (
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="relative overflow-hidden flex items-center justify-center w-7 h-7 rounded-full bg-[#7A1C3D]/10 hover:bg-[#7A1C3D] transition-all duration-300 group"
                title="Admin Panel"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent header-admin-shine" />
                <Shield className="w-3.5 h-3.5 text-[#7A1C3D] group-hover:text-white transition duration-300" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenu(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 md:hidden flex flex-col mobile-menu-drawer">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <span className="font-bold text-[#7a1c3d] text-lg">Menu</span>
              <button onClick={() => setMobileMenu(false)} className="p-1">
                <Menu size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                <button onClick={() => handleNavigation("/")} className="block w-full text-left py-2 text-gray-700 hover:text-[#7a1c3d] cursor-pointer font-medium">Home</button>
                <button onClick={() => handleNavigation("/shop")} className="block w-full text-left py-2 text-gray-700 hover:text-[#7a1c3d] cursor-pointer font-medium">Shop All</button>
                <button onClick={() => handleNavigation("/about")} className="block w-full text-left py-2 text-gray-700 hover:text-[#7a1c3d] cursor-pointer font-medium">About Us</button>
                <button onClick={() => handleNavigation("/contact")} className="block w-full text-left py-2 text-gray-700 hover:text-[#7a1c3d] cursor-pointer font-medium">Contact Us</button>
                <button onClick={() => handleNavigation("/soulful-special")} className="block w-full text-left py-2 text-gray-700 hover:text-[#7a1c3d] cursor-pointer font-medium">Soulful Special</button>
                
                {/* Admin Panel in mobile menu */}
                {hasAdminAccess && (
                  <button
                    onClick={() => handleNavigation("/dashboard")}
                    className="block w-full text-left py-2 text-gray-700 hover:text-[#7a1c3d] cursor-pointer font-medium flex items-center gap-2"
                  >
                    <Shield size={18} />
                    Admin Panel
                  </button>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Shop by Category</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Electronics", "Fashion", "Beauty", "Footwear", "Bestsellers", "Fresh Arrivals", "Essentials", "Exclusive"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleNavigation(routes[cat])}
                        className="py-2 px-2 text-sm text-left cursor-pointer hover:text-[#7a1c3d] hover:bg-gray-50 rounded-md transition"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex border rounded-lg overflow-hidden">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1 px-3 py-2 outline-none text-sm"
                      placeholder="Search products..."
                    />
                    <button
                      onClick={() => { if (query.trim()) { navigate(`/search?q=${query}`); setMobileMenu(false); } }}
                      className="bg-[#7a1c3d] px-4 text-white"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
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
import { useSelector, useDispatch } from "react-redux";

import { logout as logoutAction } from "../../app/slices/authSlice";
import usePermissions from "../../api/hooks/usePermissions";
import { getImageUrl } from "../../utils/getImageUrl";
import axiosInstance from "../../api/axiosInstance";


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { can } = usePermissions();
  const { items: cartItems } = useSelector((state) => state.cart);

  // Promo Messages
  // Add this to the top of your component (outside return) for better performance
  const promoMessages = React.useMemo(() => [
    "🎁 20% off on your first order - Use code: FIRST20",
    "🚚 Free Shipping on orders above ₹999",
    "💳 Cash on Delivery Available",
    "⭐ 100% Genuine Products",
    "📦 Easy Returns within 7 days",
  ], []);

  const [currentPromo, setCurrentPromo] = useState(0);
  const [animatePromo, setAnimatePromo] = useState(false);

  // Search
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // UI States
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Fetch cart when user logs in/out or component mounts
  // useEffect(() => {
  //   dispatch(fetchCart());
  // }, [dispatch, user]);

  // Promo rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatePromo(true);
      setTimeout(() => {
        setCurrentPromo((prev) => (prev + 1) % promoMessages.length);
        setAnimatePromo(false);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [promoMessages.length]);

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

  const wishlistCount = useSelector((state) => state.wishlist?.items?.length || 0);

  // Add touch event handling for mobile
  useEffect(() => {
    const handleTouchOutside = (e) => {
      if (profileOpen && !e.target.closest('.profile-dropdown') && !e.target.closest('.profile-trigger')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('touchstart', handleTouchOutside);
    return () => document.removeEventListener('touchstart', handleTouchOutside);
  }, [profileOpen]);

  return (
    <header className="w-full bg-white border-b shadow-sm">
      {/* Top Contact Bar - Hidden on mobile */}
      <div className="hidden md:flex justify-between bg-gray-100 px-6 py-2 text-sm">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <Phone size={14} /> +91 9300098007
          </span>
          <span className="flex items-center gap-2">
            <Mail size={14} /> soulfuloverseas.in@gmail.com
          </span>
        </div>
        <span
          onClick={() => navigate("/track-order")}
          className="cursor-pointer hover:text-[#7a1c3d] font-medium"
        >
          Track Order
        </span>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenu(true)}>
          <Menu size={24} />
        </button>

        {/* Logo */}
        <h1
          className="text-xl md:text-2xl font-extrabold text-[#7a1c3d] cursor-pointer"
          onClick={() => navigate("/")}
        >
          Soulful Overseas
        </h1>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:block flex-1 max-w-2xl mx-6 relative">
          <div className="flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#7a1c3d]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2.5 outline-none text-sm"
              placeholder="Search products..."
            />
            <button className="bg-[#7a1c3d] px-6 text-white">
              <Search size={20} />
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute w-full bg-white shadow-xl mt-1 rounded-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
              {suggestions.map((item) => {
                const imgUrl =
                  item.images?.find((i) => i.is_primary)?.image_url ||
                  item.images?.[0]?.image_url;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                    onClick={() => {
                      navigate(`/product/${item.slug}`);
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <img
                      src={getImageUrl(imgUrl) || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-5 md:gap-8">
          {/* Account */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <User size={22} />
              <span className="hidden md:block text-sm font-medium">
                {user?.name?.split(" ")[0] || "Account"}
              </span>
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-1 z-50 border">
                {user ? (
                  <>
                    <div
                      onClick={() => navigate("/profile")}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer"
                    >
                      My Profile
                    </div>
                    <div
                      onClick={handleLogout}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-red-600"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => navigate("/login")}
                    className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer"
                  >
                    Login / Register
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onClick={() => navigate("/wishlist")}
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#7a1c3d] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
            <span className="hidden md:block text-sm">Wishlist</span>
          </div>

          {/* Cart */}
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#7a1c3d] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
            <span className="hidden md:block text-sm">Cart</span>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="border-t border-gray-200 hidden md:block">
        <div className="flex justify-center gap-10 py-3 text-sm font-medium">
          <span
            onClick={() => navigate("/")}
            className="text-[#7a1c3d] border-b-2 border-[#7a1c3d] pb-1 cursor-pointer"
          >
            Home
          </span>
          <span onClick={() => navigate("/shop")} className="hover:text-[#7a1c3d] cursor-pointer">
            Shop
          </span>
          <span onClick={() => navigate("/about")} className="hover:text-[#7a1c3d] cursor-pointer">
            About Us
          </span>
          <span onClick={() => navigate("/contact")} className="hover:text-[#7a1c3d] cursor-pointer">
            Contact Us
          </span>
          <span onClick={() => navigate("/soulful-special")} className="hover:text-[#7a1c3d] cursor-pointer">
            Soulful Special
          </span>

          {can("dashboard", "view") && (
            <span
              onClick={() => navigate("/dashboard")}
              className="hover:text-[#7a1c3d] cursor-pointer"
            >
              Dashboard
            </span>
          )}
        </div>
      </nav>

      {/* Promo Banner - Moved BELOW the navigation */}
      <div className="bg-[#8b0d3a] text-white text-sm h-10 flex items-center justify-center overflow-hidden">
        <div className="relative h-10 w-full flex items-center justify-center">
          <div
            className={`absolute transition-all duration-500 ${animatePromo ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
              }`}
          >
            {promoMessages[currentPromo]}
          </div>
          <div
            className={`absolute transition-all duration-500 ${animatePromo ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
          >
            {promoMessages[(currentPromo + 1) % promoMessages.length]}
          </div>
        </div>
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
                            <p className="text-xs font-medium truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">₹{item.price}</p>
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
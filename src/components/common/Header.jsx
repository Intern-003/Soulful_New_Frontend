import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import useDelete from "../../api/hooks/useDelete";
import axiosInstance from "../../api/axiosInstance";
import { getImageUrl } from "../../utils/getImageUrl";

const Header = () => {
  const navigate = useNavigate();

  // 🔥 PROMO
  const promoMessages = [
    "🎁 20% off on your first order - Use code: FIRST20",
    "🚚 Free Shipping on orders above ₹999",
    "💳 Cash on Delivery Available",
    "⭐ 100% Genuine Products",
    "📦 Easy Returns within 7 days",
  ];

  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);

      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % promoMessages.length);
        setAnimate(false);
      }, 500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // 🔍 SEARCH
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // UI STATES
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // USER
  const { data: userData } = useGet("/auth/me");
  const user = userData || null;

  // CART
  const { data: cartData, refetch: refetchCart } = useGet("/cart");
  const cartItems = cartData?.data?.cart?.items || [];
  const totals = cartData?.data?.totals;

  // WISHLIST
  const { data: wishlistData } = useGet("/wishlist");
  const wishlistItems = wishlistData?.data || [];

  // LOGOUT
  const { postData: logout } = usePost("/auth/logout");

  // SEARCH API
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) return setShowSuggestions(false);

      try {
        const res = await axiosInstance.get("/products/search", {
          params: { q: query },
        });
        setSuggestions(res.data?.data?.data || []);
        setShowSuggestions(true);
      } catch {}
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRemoveItem = async (id) => {
    await axiosInstance.delete(`/cart-item/${id}`);
    refetchCart();
  };

  return (
    <header className="w-full border-b shadow-sm bg-white">

      {/* TOP BAR */}
      <div className="hidden md:flex justify-between bg-gray-100 px-6 py-2 text-sm">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <Phone size={14} /> +91 9300098007
          </span>
          <span className="flex items-center gap-2">
            <Mail size={14} /> soulfuloverseas.in@gmail.com
          </span>
        </div>

        {/* 🔥 TRACK ORDER BUTTON */}
        <span
          onClick={() => navigate("/track-order")}
          className="cursor-pointer hover:text-[#7a1c3d] font-medium"
        >
          Track Order
        </span>
      </div>

      {/* MAIN */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Menu onClick={() => setMobileMenu(true)} />
        </div>

        {/* LOGO */}
        <h1
          className="text-xl md:text-2xl font-extrabold text-[#7a1c3d] cursor-pointer"
          onClick={() => navigate("/")}
        >
          Soulful Overseas
        </h1>

        {/* SEARCH */}
        <div className="hidden md:block flex-1 max-w-2xl mx-6 relative">
          <div className="flex border rounded-lg overflow-hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 outline-none"
              placeholder="Search..."
            />
            <button className="bg-[#7a1c3d] px-4 text-white">
              <Search size={18} />
            </button>
          </div>

          {showSuggestions && (
            <div className="absolute w-full bg-white shadow-lg mt-1 rounded z-50">
              {suggestions.map((item) => {
                const img =
                  item.images?.find((i) => i.is_primary)?.image_url ||
                  item.images?.[0]?.image_url;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/product/${item.slug}`)}
                  >
                    <img
                      src={getImageUrl(img) || "/placeholder.png"}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">₹ {item.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 md:gap-8">

          {/* ACCOUNT */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
            <User size={20} />
            <span className="hidden md:block text-sm">{user?.name || "Account"}</span>
          </div>

          {/* WISHLIST */}
          <div className="flex items-center gap-2 cursor-pointer relative">
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7a1c3d] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
            <span className="hidden md:block text-sm">Wishlist</span>
          </div>

          {/* CART */}
          <div
            className="flex items-center gap-2 cursor-pointer relative"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7a1c3d] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
            <span className="hidden md:block text-sm">Cart</span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="border-t border-gray-200 hidden md:block">
        <div className="flex justify-center gap-10 py-3 text-sm font-medium">
          <span onClick={() => navigate("/")} className="text-[#7a1c3d] border-b-2 border-[#7a1c3d] pb-1 cursor-pointer">Home</span>
          <span onClick={() => navigate("/shop")} className="hover:text-[#7a1c3d] cursor-pointer">Shop</span>
          <span onClick={() => navigate("/about")} className="hover:text-[#7a1c3d] cursor-pointer">About Us</span>
          <span onClick={() => navigate("/contact")} className="hover:text-[#7a1c3d] cursor-pointer">Contact Us</span>
          <span onClick={() => navigate("/soulful-special")} className="hover:text-[#7a1c3d] cursor-pointer">Soulful Special</span>
          {/* <span className="hover:text-[#7a1c3d] cursor-pointer">Pages</span> */}
        </div>
      </div>

      {/* 🔥 PROMO */}
      <div className="bg-[#8b0d3a] text-white text-sm h-10 flex items-center justify-center overflow-hidden relative">
        <div className="relative h-10 w-full flex items-center justify-center">

          <div className={`absolute transition-all duration-500 ${animate ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
            {promoMessages[current]}
          </div>

          <div className={`absolute transition-all duration-500 ${animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
            {promoMessages[(current + 1) % promoMessages.length]}
          </div>

        </div>
      </div>

    </header>
  );
};

export default Header;
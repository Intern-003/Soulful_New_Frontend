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
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ✅ Dummy Data (UI testing)
  const dummyProducts = [
    { id: 1, name: "Nike Air Max", slug: "nike-air-max" },
    { id: 2, name: "Nike Revolution 6", slug: "nike-revolution-6" },
    { id: 3, name: "Adidas Ultraboost", slug: "adidas-ultraboost" },
    { id: 4, name: "Puma Running Shoes", slug: "puma-running-shoes" },
    { id: 5, name: "Nike Hoodie", slug: "nike-hoodie" },
  ];

  // Redux
  const cartItems = useSelector((state) => state.cart.items || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const user = useSelector((state) => state.auth.user);

  // ✅ Fake Search Logic
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        const results = dummyProducts.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredProducts(results);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        setFilteredProducts([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <header className="w-full border-b shadow-sm bg-white">

      {/* TOP BAR */}
      <div className="hidden md:flex justify-between bg-gray-100 px-6 py-2 text-sm">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <Phone size={14} /> +1 (234) 567-890
          </span>
          <span className="flex items-center gap-2">
            <Mail size={14} /> support@example.com
          </span>
        </div>

        <div className="flex gap-6 items-center">
          <span className="cursor-pointer">Track Order</span>
          <div className="flex items-center gap-1 cursor-pointer">
            English <ChevronDown size={14} />
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            USD <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-3">

        {/* MOBILE MENU */}
        <button className="md:hidden" onClick={() => setMobileMenu(true)}>
          <Menu />
        </button>

        {/* LOGO */}
        <div
          className="text-xl md:text-2xl font-semibold text-pink-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          FashionStore
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6 relative">
          <div className="flex w-full border rounded-lg overflow-hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-2 outline-none"
            />
            <button className="bg-pink-700 px-4 text-white">
              <Search size={18} />
            </button>
          </div>

          {/* 🔎 Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg border mt-1 rounded-lg z-50">

              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                    onClick={() => navigate(`/product/${item.slug}`)}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-400">Product</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">
                  No products found
                </div>
              )}

            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 md:gap-8">

          {/* PROFILE */}
          <div
            className="relative hidden sm:flex items-center gap-2 cursor-pointer"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <User size={20} />
            <span>{user?.name || "Account"}</span>

            {profileOpen && (
              <div className="absolute top-full right-0 bg-white shadow-lg border rounded-md w-40 mt-2 z-50">
                <div className="p-2 hover:bg-gray-100" onClick={() => navigate("/profile")}>
                  Profile
                </div>
                <div className="p-2 hover:bg-gray-100" onClick={() => navigate("/orders")}>
                  Orders
                </div>
                <div className="p-2 hover:bg-gray-100 text-red-500">
                  Logout
                </div>
              </div>
            )}
          </div>

          {/* WISHLIST */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-700 text-white text-xs px-1.5 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </div>

          {/* CART */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-700 text-white text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            )}

            {cartOpen && (
              <div className="absolute right-0 top-full w-64 bg-white shadow-lg border mt-2 rounded-lg z-50 p-3">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Cart is empty</p>
                ) : (
                  cartItems.slice(0, 3).map((item, i) => (
                    <div key={i} className="text-sm py-1 border-b">
                      {item.name}
                    </div>
                  ))
                )}
                <button
                  className="mt-2 w-full bg-pink-700 text-white py-1 rounded"
                  onClick={() => navigate("/cart")}
                >
                  View Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50">
          <div className="w-64 bg-white h-full p-4">
            <div className="flex justify-between mb-4">
              <span>Menu</span>
              <X onClick={() => setMobileMenu(false)} />
            </div>

            <div className="flex flex-col gap-4">
              <span onClick={() => navigate("/")}>Home</span>
              <span onClick={() => navigate("/shop")}>Shop</span>
              <span onClick={() => navigate("/cart")}>Cart</span>
              <span onClick={() => navigate("/wishlist")}>Wishlist</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
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

const Header = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ USER
  const { data: userData } = useGet("/auth/me");
  const user = userData || null;

  // ✅ CART
  const { data: cartData, refetch: refetchCart } = useGet("/cart");
  const cart = cartData?.data?.cart;
  const cartItems = cart?.items || [];
  const totals = cartData?.data?.totals;

  // ✅ WISHLIST
  const { data: wishlistData } = useGet("/wishlist");
  const wishlistItems = wishlistData?.data || [];

  // ✅ LOGOUT
  const { postData: logout } = usePost("/auth/logout");

  // ✅ REMOVE CART ITEM
  const { deleteData: deleteCartItem } = useDelete("");

  // 🔍 SEARCH API
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/products/search", {
          params: { q: query },
        });

        const products = res.data?.data?.data || [];
        setSuggestions(products);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // 🚪 LOGOUT
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // ❌ REMOVE CART ITEM
  const handleRemoveItem = async (id) => {
    try {
      await axiosInstance.delete(`/cart-item/${id}`);
      refetchCart();
    } catch (err) {
      console.error(err);
    }
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

        <div className="flex gap-6 items-center">
          <span className="cursor-pointer">Track Order</span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <h1
          className="text-2xl font-bold text-[#7a1c3d] cursor-pointer"
          onClick={() => navigate("/")}
        >
          FashionStore
        </h1>

        {/* SEARCH */}
        <div className="flex-1 max-w-2xl mx-6 relative hidden md:block">
          <div className="flex border rounded-lg overflow-hidden">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-2 outline-none"
            />
            <button className="bg-[#7a1c3d] px-4 text-white">
              <Search size={18} />
            </button>
          </div>

          {/* SUGGESTIONS */}
          {showSuggestions && (
            <div className="absolute w-full bg-white shadow-lg mt-1 rounded z-50">
              {suggestions.map((item) => {
                const img =
                  item.images?.find((i) => i.is_primary)?.image_url ||
                  item.images?.[0]?.image_url;

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/product/${item.slug}`)}
                  >
                    <img
                      src={`http://localhost:8000/storage/${img}`}
                      className="w-10 h-10 object-cover rounded"
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
        <div className="flex items-center gap-6">

          {/* PROFILE */}
          <div
            className="relative cursor-pointer"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <User />
            <span className="ml-1 text-sm">
              {user?.name || "Account"}
            </span>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded border z-50">

                {user ? (
                  <>
                    <div className="p-3 border-b">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <div
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      My Profile
                    </div>

                    <div
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/orders")}
                    >
                      My Orders
                    </div>

                    <div
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/wishlist")}
                    >
                      Wishlist
                    </div>

                    <div
                      className="p-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <div className="p-4 space-y-2">
                    <button
                      className="w-full bg-[#7a1c3d] text-white py-2 rounded"
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </button>
                    <button
                      className="w-full border py-2 rounded"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WISHLIST */}
          <div onClick={() => navigate("/wishlist")} className="relative cursor-pointer">
            <Heart />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7a1c3d] text-white text-xs px-1 rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </div>

          {/* CART */}
          <div
            className="relative"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <ShoppingCart />

            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7a1c3d] text-white text-xs px-1 rounded-full">
                {cartItems.length}
              </span>
            )}

            {cartOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded border z-50 p-3">

                {cartItems.map((item) => {
                  const img =
                    item.variant?.image ||
                    item.product?.images?.[0]?.image_url;

                  return (
                    <div key={item.id} className="flex gap-3 mb-3">
                      <img
                        src={`http://localhost:8000/storage/${img}`}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 text-sm">
                        <p>{item.product.name}</p>
                        <p className="text-gray-500">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>

                      <button onClick={() => handleRemoveItem(item.id)}>
                        ✕
                      </button>
                    </div>
                  );
                })}

                <div className="border-t pt-2 text-sm">
                  <p className="flex justify-between">
                    <span>Total:</span>
                    <span>₹ {totals?.total}</span>
                  </p>

                  <button
                    className="w-full mt-2 border py-2 rounded"
                    onClick={() => navigate("/cart")}
                  >
                    View Cart
                  </button>

                  <button
                    className="w-full mt-2 bg-[#7a1c3d] text-white py-2 rounded"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* PROMO BAR */}
      <div className="bg-[#8b0d3a] text-white text-center py-2 text-sm">
        🎁 20% off on your first order - Use code: FIRST20
      </div>
    </header>
  );
};

export default Header;
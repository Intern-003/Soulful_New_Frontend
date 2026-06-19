import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import WishlistSkeleton from "../../components/shop/WishlistSkeleton";
import toast from "react-hot-toast";

import {
  removeFromWishlist,
  fetchWishlist,
} from "../../app/slices/wishlistSlice";
import { addToCart } from "../../app/slices/cartSlice";
import { getImageUrl } from "../../utils/getImageUrl";
import useGet from "../../api/hooks/useGet";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const { status, removingId } = useSelector((state) => state.wishlist);
  const { items: cartItems, status: cartStatus } = useSelector((state) => state.cart);
  
  const [addingToCartId, setAddingToCartId] = useState(null);
  const hasFetchedRecommendations = useRef(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Fetch recommendations based on wishlist items
  useEffect(() => {
    if (wishlistItems.length > 0 && !hasFetchedRecommendations.current) {
      const categoryIds = [...new Set(wishlistItems.map(item => item.product?.category_id).filter(Boolean))];
      if (categoryIds.length > 0) {
        fetchRecommendations(categoryIds[0]);
      }
      hasFetchedRecommendations.current = true;
    }
    
    if (wishlistItems.length === 0) {
      setRecommendations([]);
      hasFetchedRecommendations.current = false;
    }
  }, [wishlistItems]);

  const fetchRecommendations = async (categoryId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products?category_id=${categoryId}&per_page=6`);
      const data = await res.json();
      setRecommendations(data?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist({ product_id: productId })).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (item) => {
    if (addingToCartId === item.product_id) return;
    
    // Check if already in cart
    const isInCart = cartItems.some(
      (cartItem) => cartItem.product_id === item.product_id
    );
    
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }
    
    setAddingToCartId(item.product_id);
    
    try {
      await dispatch(
        addToCart({
          product_id: item.product_id,
          quantity: 1,
          variant_id: null,
        })
      ).unwrap();
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err || "Failed to add to cart");
    } finally {
      setAddingToCartId(null);
    }
  };

  const getProductPrice = (product) => {
    return product.discount_price || product.price || 0;
  };

  const getOriginalPrice = (product) => {
    return product.price || 0;
  };

  const getDiscountPercent = (product) => {
    if (product.discount_price && product.price) {
      return Math.round(((product.price - product.discount_price) / product.price) * 100);
    }
    return 0;
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.product_id === productId);
  };

  if (status === "loading") {
    return <WishlistSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-[#7A1C3D] tracking-tight">
            Wishlist
          </h1>
          <p className="text-gray-500 mt-2">
            Your curated favorites collection
          </p>
        </div>

        <div className="px-5 py-2 rounded-full bg-[#8B0D3A] text-white text-sm shadow">
          {wishlistItems.length} saved
        </div>
      </div>

      {/* EMPTY STATE */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#8B0D3A]/10 blur-2xl rounded-full"></div>
            <Heart size={60} className="text-[#8B0D3A] relative z-10" />
          </div>

          <h2 className="text-2xl font-semibold text-[#111]">
            Nothing saved yet
          </h2>

          <p className="text-gray-500 mt-2 max-w-sm">
            Explore and save products you love — your wishlist lives here.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 px-8 py-3 rounded-full bg-[#8B0D3A] text-white hover:opacity-90 transition"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16">
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistItems.map((item, i) => {
              const product = item.product || item;
              const price = getProductPrice(product);
              const originalPrice = getOriginalPrice(product);
              const discountPercent = getDiscountPercent(product);
              const isProductInCart = isInCart(product.id);
              const isRemoving = removingId === product.id;
              const isAdding = addingToCartId === product.id;

              const imgUrl =
                product.images?.find((img) => img.is_primary)?.image_url ||
                product.images?.[0]?.image_url;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* IMAGE CONTAINER */}
                  <div 
                    className="relative overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${product.slug || product.id}`)}
                  >
                    {imgUrl ? (
                      <img
                        src={getImageUrl(imgUrl)}
                        alt={product.name}
                        className="w-full h-[280px] object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-[280px] bg-gray-100 flex items-center justify-center">
                        <ShoppingBag size={40} className="text-gray-300" />
                      </div>
                    )}

                    {/* DISCOUNT BADGE */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 left-3 bg-[#7a1c3d] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        -{discountPercent}%
                      </div>
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                    {/* ACTION BUTTONS - Appear on hover */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart({ product_id: product.id });
                        }}
                        disabled={isProductInCart || isAdding}
                        className={`bg-white text-[#111] px-4 py-2 rounded-full text-xs font-medium shadow-md flex items-center gap-1 transition ${
                          isProductInCart
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-[#8B0D3A] hover:text-white"
                        }`}
                      >
                        {isAdding ? (
                          <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingBag size={14} />
                        )}
                        {isProductInCart ? "In Cart" : "Add to Cart"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(product.id);
                        }}
                        disabled={isRemoving}
                        className="bg-white text-red-500 px-4 py-2 rounded-full text-xs font-medium shadow-md hover:bg-red-100 transition flex items-center gap-1"
                      >
                        {isRemoving ? (
                          <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="p-4">
                    <h3 
                      className="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-[#7a1c3d] transition"
                      onClick={() => navigate(`/product/${product.slug || product.id}`)}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg font-bold text-[#8B0D3A]">
                        ₹{price.toLocaleString()}
                      </p>
                      {discountPercent > 0 && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock > 0 && product.stock <= 5 && (
                      <p className="text-xs text-orange-500 mt-1">
                        Only {product.stock} left
                      </p>
                    )}
                    {product.stock === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Out of stock
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RECOMMENDATIONS SECTION */}
          {recommendations.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-[#111]">
                  You May Also Like
                </h2>
                <button
                  onClick={() => navigate("/shop")}
                  className="text-sm text-[#8B0D3A] hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recommendations.slice(0, 5).map((product) => {
                  const price = getProductPrice(product);
                  const imgUrl = product.images?.find(img => img.is_primary)?.image_url ||
                                product.images?.[0]?.image_url;

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.slug || product.id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(imgUrl)}
                          alt={product.name}
                          className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-800 mt-2 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-sm font-semibold text-[#8B0D3A] mt-1">
                        ₹{price.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div className="text-center pb-10 text-xs text-gray-400">
        Soulfull — Curated with taste & intention
      </div>
    </div>
  );
};

export default Wishlist;
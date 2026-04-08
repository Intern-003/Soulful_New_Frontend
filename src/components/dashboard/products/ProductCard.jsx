import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { getImageUrl } from '../../../utils/getImageUrl';
import { addToCart } from '../../../app/slices/cartSlice';
import { addToWishlist } from '../../../app/slices/wishlistSlice';

const ProductCard = ({ product, loading = false, viewMode = "grid" }) => {
  if (!product) return null;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [isActionLoading, setIsActionLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const isInCart = useMemo(() => {
    if (!product) return false;

    return cartItems.some(
      (item) =>
        item.product_id === product.id || item.product?.id === product.id,
    );
  }, [cartItems, product?.id]);

  const isInWishlist = useMemo(() => {
    return wishlistItems.some(
      (item) =>
        item.product_id === product.id || item.product?.id === product.id,
    );
  }, [wishlistItems, product.id]);

  const image =
    product?.images?.find((img) => img.is_primary)?.image_url ||
    product?.images?.[0]?.image_url;

  const discount =
    product?.discount_price && product?.price
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100,
        )
      : null;

  const handleAddToCart = async (e) => {
    e?.stopPropagation();

    if (isActionLoading || isInCart) return;

    setIsActionLoading(true);

    try {
      await dispatch(
        addToCart({
          product_id: product.id,
          quantity: 1,
        }),
      ).unwrap();

      setAdded(true);

      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e?.stopPropagation();

    if (!user) {
      localStorage.setItem(
        "intended_action",
        JSON.stringify({
          type: "ADD_TO_WISHLIST",
          payload: { product_id: product.id },
        }),
      );
      navigate("/login");
      return;
    }

    if (isInWishlist) return; // ✅ duplicate rokega

    try {
      await dispatch(addToWishlist({ product_id: product.id })).unwrap();
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const handleViewProduct = (e) => {
    e?.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-40 sm:h-52 md:h-[240px] bg-gray-200 animate-pulse" />
        <div className="p-3 sm:p-4 space-y-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleViewProduct}
      // className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
      className={`group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden ${
        viewMode === "list" ? "flex gap-4 p-4 items-center" : ""
      }`}
    >
      {/* IMAGE */}
      {/* <div className="relative h-40 sm:h-52 md:h-[240px] bg-gray-100 flex items-center justify-center overflow-hidden"> */}
      <div
        className={`relative bg-gray-100 flex items-center justify-center overflow-hidden ${
          viewMode === "list"
            ? "w-32 h-32 flex-shrink-0"
            : "h-40 sm:h-52 md:h-[240px]"
        }`}
      >
        <img
          src={getImageUrl(image) || "/placeholder.jpg"}
          alt={product?.name}
          className="h-full object-contain transition duration-500 group-hover:scale-105"
        />

        {/* DISCOUNT */}
        {discount && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-orange-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* ACTION BUTTONS */}
        {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 sm:gap-3"> */}
        <div
          className={`absolute inset-0 bg-black/40 opacity-0 transition items-center justify-center gap-2 sm:gap-3 ${
            viewMode === "grid" ? "group-hover:opacity-100 flex" : "hidden"
          }`}
        >
          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={isActionLoading || isInCart}
            className={`p-2 sm:p-3 rounded-full transition flex items-center justify-center
              ${
                added
                  ? "bg-green-500 text-white"
                  : isInCart
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white hover:bg-[#7a1c3d] hover:text-white"
              }
            `}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>

          {/* WISHLIST */}
          <button
            onClick={handleAddToWishlist}
            // disabled={isActionLoading}
            disabled={isActionLoading || isInWishlist}
            className="bg-white p-2 sm:p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
          >
            <Heart
              size={16}
              className={isInWishlist ? "fill-red-500 text-red-500" : ""}
            />
          </button>

          {/* VIEW */}
          <button
            onClick={handleViewProduct}
            className="bg-white p-2 sm:p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {/* <div className="p-3 sm:p-4 text-center"> */}
      <div
        className={`p-3 sm:p-4 ${
          viewMode === "list"
            ? "flex flex-col justify-between flex-1"
            : "text-center"
        }`}
      >
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-1">
          {product?.name}
        </h3>

        <div className="mt-1">
          <span className="text-[#7a1c3d] font-bold text-sm sm:text-base">
            ₹{product?.discount_price || product?.price}
          </span>

          {product?.discount_price && (
            <span className="text-gray-400 line-through ml-2 text-xs sm:text-sm">
              ₹{product?.price}
            </span>
          )}
        </div>

        {isInCart && !added && (
          <p className="text-[10px] sm:text-xs text-green-600 mt-1">
            Already in cart
          </p>
        )}

        {viewMode === "list" && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className="px-3 py-1 text-xs bg-[#7a1c3d] text-white rounded"
            >
              {isInCart ? "In Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleAddToWishlist}
              className="px-3 py-1 text-xs border rounded"
            >
              Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

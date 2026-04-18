import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";
import { getImageUrl } from "../../../utils/getImageUrl";
import { addToCart } from "../../../app/slices/cartSlice";
import { addToWishlist } from "../../../app/slices/wishlistSlice";

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

    if (isInWishlist) return;

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

  const bestPrice = Math.round(
    (product?.discount_price || product?.price) * 0.9,
  );

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
      className={`group cursor-pointer ${
        viewMode === "list" ? "flex gap-4 items-start" : ""
      }`}
    >
      {/* IMAGE */}
      <div
        className={`relative overflow-hidden bg-[#f5f5f5] ${
          viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-[2/3]"
        }`}
      >
        <img
          src={getImageUrl(image) || "/placeholder.jpg"}
          alt={product?.name}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* DISCOUNT */}
        {discount && (
          <div className="absolute top-3 left-2">
            <div className="relative bg-gradient-to-r from-[#82203D] to-[#A8325E] text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-lg">
              -{discount}%
              <span className="absolute -bottom-1 left-2 w-2 h-2 bg-[#82203D] rotate-45"></span>
            </div>
          </div>
        )}

        {/* ACTION OVERLAY */}
        <div
          className={`absolute inset-0 bg-black/30 opacity-0 transition duration-300 items-center justify-center gap-3 ${
            viewMode === "grid" ? "group-hover:opacity-100 flex" : "hidden"
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isActionLoading || isInCart}
            className={`p-3 rounded-full transition
            ${
              added
                ? "bg-green-500 text-white"
                : isInCart
                  ? "bg-gray-300 text-gray-600"
                  : "bg-white hover:bg-[#8B0D3A] hover:text-white"
            }
          `}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>

          <button
            onClick={handleAddToWishlist}
            disabled={isInWishlist}
            className="bg-white p-3 rounded-full hover:bg-[#8B0D3A] hover:text-white transition"
          >
            <Heart
              size={16}
              className={isInWishlist ? "fill-red-500 text-red-500" : ""}
            />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className={`mt-3 space-y-1 ${
          viewMode === "list" ? "flex flex-col justify-between flex-1 mt-0" : ""
        }`}
      >
        {/* CONTENT */}
        <div className="mt-2 px-1">
          {/* TITLE */}
          <h3 className="text-[13px] font-medium text-[#222] leading-snug line-clamp-2 uppercase tracking-wide">
            {product?.name}
          </h3>

          {/* PRICE ROW */}
          <div className="mt-1 flex items-center gap-2 text-[14px]">
            {/* FINAL PRICE */}
            <span className="font-bold text-[#111]">
              ₹{product?.discount_price || product?.price}
            </span>

            {/* ORIGINAL PRICE */}
            {product?.discount_price && (
              <span className="text-gray-400 line-through text-[13px]">
                ₹{product?.price}
              </span>
            )}

            {/* DISCOUNT */}
            {discount && (
              <span className="text-green-600 text-[13px] font-medium">
                ({discount}% OFF)
              </span>
            )}
          </div>

          {/* BEST PRICE */}
          {product?.discount_price && (
            <p className="text-[13px] text-green-700 mt-0.5 font-medium">
              Best price ₹{bestPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

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
        className={`relative overflow-hidden rounded-md bg-[#f3ebee] ${
          viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-[3/4]"
        }`}
      >
        <img
          src={getImageUrl(image) || "/placeholder.jpg"}
          alt={product?.name}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* DISCOUNT */}
        {discount && (
          <span className="absolute top-2 left-2 bg-[#8B5E3C] text-white text-[10px] px-2 py-1">
            -{discount}%
          </span>
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
        <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug">
          {product?.name}
        </h3>

        <div className="text-sm">
          <span className="font-semibold text-black">
            ₹{product?.discount_price || product?.price}
          </span>

          {product?.discount_price && (
            <>
              <span className="text-gray-400 line-through ml-2">
                ₹{product?.price}
              </span>
              <span className="text-green-600 ml-2 text-xs">
                ({discount}% OFF)
              </span>
            </>
          )}
        </div>

        {viewMode === "grid" && (
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className="
            mt-3 w-full
            border border-gray-300
            py-2 text-xs tracking-widest uppercase
            transition-all duration-300
            hover:border-black
          "
          >
            {isInCart ? "IN CART" : "ADD TO BAG"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

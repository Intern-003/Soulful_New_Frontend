import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductDetailsSkeleton from "../../components/shop/ProductDetailsSkeleton";

import ProductTabs from "../../components/shop/ProductTabs";
import useGet from "../../api/hooks/useGet";
import { PRODUCT } from "../../api/endpoints";
import { getImageUrl } from "../../utils/getImageUrl";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/slices/cartSlice";
import { addToWishlist } from "../../app/slices/wishlistSlice";

const ProductDetails = () => {
  const navigate = useNavigate();
  // const { slug } = useParams();

  // const { data, loading, error } = useGet(PRODUCT.DETAILS(slug));

  const { identifier } = useParams();

const { data, loading, error } = useGet(PRODUCT.DETAILS(identifier));

  const product = data?.data;

  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);

  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const isInCart = cartItems.some(
    (item) =>
      item.product_id === product?.id || item.product?.id === product?.id,
  );

  const images =
    product?.images?.map((img) => getImageUrl(img.image_url)) || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems.some(
    (item) =>
      item.product_id === product?.id || item.product?.id === product?.id,
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const [zoomStyle, setZoomStyle] = useState({});

  const colors = ["#000", "#ccc", "#1e3a8a", "#b45309"];
  const sizes = ["S", "M", "L"];

  const [selectedColor, setSelectedColor] = useState("#000");
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);

  const reviews = product?.reviews || [];

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const discountPercent =
    product?.price && product?.discount_price
      ? Math.round(
          ((product.price - product.discount_price) / product.price) * 100,
        )
      : 0;

  const handleAddToCart = async () => {
    if (isLoading || isInCart) return;

    setIsLoading(true);

    try {
      await dispatch(
        addToCart({
          product_id: product.id,
          quantity: qty,
        }),
      ).unwrap();

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlist = async () => {
    if (wishlistLoading) return;

    // Login check
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
    setWishlistLoading(true);

    try {
      await dispatch(addToWishlist({ product_id: product.id })).unwrap();
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
    });
  };

  // if (loading) return <div className="p-10">Loading...</div>;
  if (loading) return <ProductDetailsSkeleton />;
  if (error) return <div>Error loading product</div>;

  return (
    <>
      {/* TOP HEADER */}
      <div className="bg-[#f6f1f3] border-b border-gray-200 py-6 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-500">
            <span className="text-[#7a1c3d] font-medium cursor-pointer hover:underline">
              Home
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Product Details</span>
          </p>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-semibold text-[#2d0f1f] mt-2">
            Product Details
          </h1>
        </div>
      </div>
      <div className="bg-[#fafafa] min-h-screen py-15 px-4 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {/* LEFT - IMAGES */}
          <div className="flex gap-4">
            {/* THUMBNAILS */}
            <div className="flex flex-col gap-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition
                    ${
                      currentIndex === i
                        ? "border-[#7a1c3d] scale-105"
                        : "border-transparent hover:border-gray-300"
                    }
                  `}
                />
              ))}
            </div>

            {/* MAIN IMAGE WRAPPER */}
            <div className="relative flex-1 p-6">
              {/* IMAGE CONTAINER */}
              <div className="relative w-full h-[400px] rounded-xl bg-white">
                <div
                  className="w-full h-full overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={images[currentIndex]}
                    style={zoomStyle}
                    className="w-full h-full object-contain transition duration-300"
                  />
                </div>

                {/* LEFT BUTTON */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 
                  w-11 h-11 flex items-center justify-center
                  bg-white/90 backdrop-blur-md rounded-full shadow-md
                  hover:scale-110 hover:bg-white transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* RIGHT BUTTON */}
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 
                  w-11 h-11 flex items-center justify-center
                  bg-white/90 backdrop-blur-md rounded-full shadow-md
                  hover:scale-110 hover:bg-white transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="space-y-6">
            {/* CATEGORY */}
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              {product?.category?.name}
            </p>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-[#2d0f1f]">
              {product?.name}
            </h1>

            {/* RATING */}
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <span className="font-medium text-sm">{avgRating}</span>
              <span className="text-gray-400 text-sm">
                {reviews.length} Reviews
              </span>
            </div>

            {/* PRICE CARD */}
            <div className="bg-[#f6f1f3] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#7a1c3d]">
                  ₹{product?.discount_price}
                </span>
                <span className="line-through text-gray-400 text-sm">
                  ₹{product?.price}
                </span>
              </div>

              <span className="inline-block bg-[#7a1c3d] text-white text-xs px-2 py-1 rounded">
                Save {discountPercent}%
              </span>

              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                In Stock
                <span className="text-gray-400">
                  ({product?.stock} items left)
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product?.short_description}
            </p>

            {/* COLOR */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-sm">Color</p>
                <span className="text-xs text-gray-400">Black</span>
              </div>

              <div className="flex gap-3">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    style={{ background: c }}
                    className={`w-9 h-9 rounded-full cursor-pointer border-2 transition-all duration-200 ${
                      selectedColor === c
                        ? "border-[#7a1c3d] scale-110 shadow"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* SIZE */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-sm">Size</p>
                <span className="text-xs text-gray-400">{selectedSize}</span>
              </div>

              <div className="flex gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      selectedSize === s
                        ? "bg-[#7a1c3d] text-white shadow-md"
                        : "bg-white hover:border-[#7a1c3d]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <p className="font-medium text-sm mb-2">Quantity</p>

              <div className="flex items-center border rounded-lg overflow-hidden w-max">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span className="px-5 text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isLoading || isInCart}
                className={`flex-1 py-3 rounded-xl font-medium shadow transition
                  ${
                    isInCart
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : added
                        ? "bg-green-500 text-white"
                        : "bg-[#7a1c3d] text-white hover:shadow-lg"
                  }
                `}
              >
                {isInCart ? "Already in Cart" : added ? "Added" : "Add to Cart"}
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 border border-[#7a1c3d] text-[#7a1c3d] py-3 rounded-xl font-medium hover:bg-[#7a1c3d] hover:text-white transition"
              >
                Buy Now
              </button>

              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`p-3 border rounded-xl transition
                  ${
                    isInWishlist
                      ? "bg-red-50 border-red-200"
                      : "hover:bg-[#7a1c3d] hover:text-white"
                  }
                `}
              >
                <Heart
                  size={18}
                  className={`transition ${
                    isInWishlist
                      ? "fill-red-500 text-red-500 scale-110"
                      : "hover:text-white"
                  }`}
                />
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs text-gray-500">
              <div className="space-y-1">
                <Truck size={18} className="mx-auto text-[#7a1c3d]" />
                <p>Free Shipping</p>
              </div>

              <div className="space-y-1">
                <RotateCcw size={18} className="mx-auto text-[#7a1c3d]" />
                <p>30-Day Returns</p>
              </div>

              <div className="space-y-1">
                <ShieldCheck size={18} className="mx-auto text-[#7a1c3d]" />
                <p>Warranty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs */}
        <ProductTabs product={product} />
      </div>
    </>
  );
};

export default ProductDetails;

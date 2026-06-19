import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Zap,
} from "lucide-react";

import ProductDetailsSkeleton from "../../components/shop/ProductDetailsSkeleton";
import ProductTabs from "../../components/shop/ProductTabs";

import useGet from "../../api/hooks/useGet";
import { PRODUCT } from "../../api/endpoints";

import { getImageUrl } from "../../utils/getImageUrl";

import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../../app/slices/cartSlice";
import { addToWishlist } from "../../app/slices/wishlistSlice";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { identifier } = useParams();
  const dispatch = useDispatch();

  const { data, loading, error, refetch } = useGet(PRODUCT.DETAILS(identifier));
  const product = data?.data;

  // Updated selectors to work with new cart structure
  const { items: cartItems, status: cartStatus } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  const variants = product?.variants || [];

  // DYNAMIC COLOR OPTIONS
  const colors = variants
    .map((v) => ({
      value: v.attributes?.Color?.value,
      hex: v.attributes?.Color?.hex || "#ccc",
    }))
    .filter((c, index, self) =>
      c.value && self.findIndex(t => t.value === c.value) === index
    );

  // DYNAMIC SIZE / STORAGE OPTIONS
  const sizes = [
    ...new Set(
      variants
        .map(
          (v) =>
            v.attributes?.Size?.value ||
            v.attributes?.Storage?.value,
        )
        .filter(Boolean),
    ),
  ];

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Reset selections when product changes
  useEffect(() => {
    setSelectedColor(null);
    setSelectedSize(null);
    setQty(1);
    setCurrentIndex(0);
  }, [product?.id]);

  // SELECTED VARIANT
  const selectedVariant = variants.find((v) => {
    const variantColor = v.attributes?.Color?.value;
    const variantSize = v.attributes?.Size?.value || v.attributes?.Storage?.value;

    if (selectedColor && selectedSize) {
      return variantColor === selectedColor && variantSize === selectedSize;
    }
    if (selectedColor) {
      return variantColor === selectedColor;
    }
    return false;
  });

  // AVAILABLE SIZES for selected color
  const availableSizes = variants
    .filter((v) => v.attributes?.Color?.value === selectedColor)
    .map((v) => v.attributes?.Size?.value || v.attributes?.Storage?.value)
    .filter(Boolean);

  // Get current selling price
  const currentPrice = selectedVariant?.discount_price || selectedVariant?.price || product?.discount_price || product?.price || 0;
  const originalPrice = selectedVariant?.price || product?.price || 0;
  const currentStock = selectedVariant?.stock || product?.stock || 0;

  const images =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images.map((img) => getImageUrl(img.image_url))
      : product?.images?.length > 0
        ? product.images.map((img) => getImageUrl(img.image_url))
        : ["/fallback.png"];

  const reviews = product?.reviews || [];

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const discountPercent =
    originalPrice && currentPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  // Check if product is in cart (updated for new cart structure)
  const isInCart = cartItems.some(
    (item) => item.product_id === product?.id || item.product?.id === product?.id
  );

  const isInWishlist = wishlistItems.some(
    (item) => item.product_id === product?.id || item.product?.id === product?.id
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)" });
  };

  const handleAddToCart = async () => {
    if (isLoading || isInCart) return;

    if (currentStock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    if (qty > currentStock) {
      toast.error(`Only ${currentStock} items available in stock`);
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(
        addToCart({
          product_id: product.id,
          quantity: qty,
          variant_id: selectedVariant?.id,
        })
      ).unwrap();

      setAdded(true);
      toast.success("Added to cart successfully!");

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (err) {
      toast.error(err || "Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function
  const handleReviewSubmitted = () => {
    refetch(); // This will fetch updated product data including new reviews
  };
  const handleBuyNow = () => {
    if (currentStock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    // Add to cart first then navigate to checkout
    dispatch(
      addToCart({
        product_id: product.id,
        quantity: qty,
        variant_id: selectedVariant?.id,
      })
    ).then(() => {
      navigate("/checkout");
    });
  };

  const handleWishlist = async () => {
    if (wishlistLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      toast.info("Product already in wishlist");
      return;
    }

    setWishlistLoading(true);

    try {
      await dispatch(
        addToWishlist({
          product_id: product.id,
        })
      ).unwrap();
      toast.success("Added to wishlist!");
    } catch (err) {
      toast.error("Failed to add to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) return <ProductDetailsSkeleton />;

  if (error)
    return (
      <div className="py-20 text-center">
        <div className="text-red-500 mb-4">Error loading product</div>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#7a1c3d] text-white rounded-lg">
          Try Again
        </button>
      </div>
    );

  if (!product) return null;

  return (
    <>
      {/* HERO HEADER */}
      <div className="bg-gradient-to-r from-[#fdf7f9] to-[#f6f1f3] border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          {/* BREADCRUMB */}
          <nav aria-label="breadcrumb">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[#7a1c3d]">
                Home
              </span>
              <span>/</span>
              {product?.category?.slug && (
                <>
                  <span
                    onClick={() => navigate(`/category/${product.category.slug}`)}
                    className="cursor-pointer hover:text-[#7a1c3d]"
                  >
                    {product.category.name}
                  </span>
                  <span>/</span>
                </>
              )}
              <span className="text-[#2d0f1f] font-medium">{product?.name}</span>
            </div>
          </nav>
          <h1 className="text-2xl md:text-4xl font-bold text-[#2d0f1f] mt-3 leading-tight">
            {product?.name}
          </h1>
        </div>
      </div>

      {/* MAIN */}
      <div className="bg-[#fafafa] min-h-screen py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 xl:gap-14">
          {/* LEFT SIDE - IMAGES */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* THUMBNAILS */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`
                    min-w-[70px] w-[70px] h-[70px]
                    rounded-2xl overflow-hidden border-2 bg-white
                    transition-all duration-300
                    ${currentIndex === i
                      ? "border-[#7a1c3d] shadow-lg scale-105"
                      : "border-gray-200 hover:border-[#7a1c3d]"
                    }
                  `}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div className="relative flex-1">
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div
                  className="h-[350px] md:h-[550px] overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={
                      selectedVariant?.primary_image
                        ? getImageUrl(selectedVariant.primary_image)
                        : images[currentIndex]
                    }
                    style={zoomStyle}
                    className="w-full h-full object-contain transition duration-300"
                    alt={product?.name}
                  />
                </div>

                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:scale-110 transition"
                >
                  <ChevronRight size={20} />
                </button>

                {discountPercent > 0 && (
                  <div className="absolute top-5 left-5 bg-[#7a1c3d] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - DETAILS */}
          <div className="space-y-7">
            <p className="uppercase tracking-[0.25em] text-xs text-gray-400 font-medium">
              {product?.category?.name}
            </p>

            <h2 className="text-3xl md:text-5xl font-bold text-[#2d0f1f] leading-tight">
              {product?.name}
            </h2>

            {/* RATING */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={star <= Math.floor(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 fill-none"
                    }
                  />
                ))}
              </div>
              <span className="font-semibold text-sm">{avgRating}</span>
              <span className="text-gray-400 text-sm">({reviews.length} Reviews)</span>
            </div>

            {/* PRICE CARD */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-4xl font-bold text-[#7a1c3d]">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {originalPrice > currentPrice && (
                  <span className="line-through text-gray-400 text-lg">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                  {currentStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
                {currentStock > 0 && (
                  <span className="text-sm text-gray-500">
                    {currentStock} Units Available
                  </span>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {product?.short_description || product?.description?.substring(0, 200)}
            </p>

            {/* COLOR */}
            {colors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-[#2d0f1f]">Select Color</p>
                  {selectedColor && <span className="text-sm text-gray-500">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((colorObj, index) => {
                    const isSelected = selectedColor === colorObj.value;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedColor(null);
                            setSelectedSize(null);
                          } else {
                            setSelectedColor(colorObj.value);
                            setSelectedSize(null);
                          }
                        }}
                        className={`
                          relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${isSelected
                            ? "border-[#7a1c3d] scale-110 shadow-lg"
                            : "border-gray-300 hover:scale-105"
                          }
                        `}
                      >
                        <span
                          className="w-8 h-8 rounded-full border border-gray-200"
                          style={{ backgroundColor: colorObj.hex }}
                        />
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7a1c3d] border-2 border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIZE / VARIANT */}
            {sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#2d0f1f]">Select Variant</p>
                    {selectedSize && (
                      <span className="text-xs bg-[#f6f1f3] text-[#7a1c3d] px-2 py-1 rounded-full">
                        {selectedSize}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => {
                    const disabled = selectedColor && !availableSizes.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={disabled}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSize(null);
                          } else {
                            setSelectedSize(size);
                          }
                        }}
                        className={`
                          relative min-w-[70px] h-12 px-5 rounded-2xl border text-sm font-semibold transition-all duration-300
                          ${disabled
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : isSelected
                              ? "bg-[#7a1c3d] text-white border-[#7a1c3d] shadow-lg scale-105"
                              : "bg-white border-gray-300 hover:border-[#7a1c3d] hover:text-[#7a1c3d] hover:shadow-md"
                          }
                        `}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="space-y-3">
              <p className="font-semibold text-sm">Quantity</p>
              <div className="flex items-center border border-gray-300 rounded-2xl overflow-hidden w-max bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 hover:bg-gray-100 transition text-lg"
                >
                  −
                </button>
                <span className="w-14 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(currentStock, q + 1))}
                  disabled={qty >= currentStock}
                  className="w-12 h-12 hover:bg-gray-100 transition text-lg disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isLoading || isInCart || currentStock === 0}
                className={`
                  flex-1 h-14 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                  ${isInCart
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : currentStock === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : added
                        ? "bg-green-500 text-white"
                        : "bg-[#7a1c3d] text-white hover:shadow-xl hover:scale-[1.02]"
                  }
                `}
              >
                <ShoppingBag size={18} />
                {isInCart ? "Already in Cart" : added ? "Added Successfully" : "Add To Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className={`flex-1 h-14 rounded-2xl border-2 border-[#7a1c3d] text-[#7a1c3d] font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${currentStock === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7a1c3d] hover:text-white"
                  }`}
              >
                <Zap size={18} />
                Buy Now
              </button>

              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`
                  h-14 w-14 rounded-2xl border flex items-center justify-center transition-all duration-300
                  ${isInWishlist
                    ? "bg-red-50 border-red-200"
                    : "bg-white hover:bg-[#7a1c3d] hover:text-white"
                  }
                `}
              >
                <Heart size={20} className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                <Truck size={20} className="mx-auto mb-2 text-[#7a1c3d]" />
                <p className="text-xs font-medium text-gray-600">Free Shipping</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                <RotateCcw size={20} className="mx-auto mb-2 text-[#7a1c3d]" />
                <p className="text-xs font-medium text-gray-600">Easy Returns</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                <ShieldCheck size={20} className="mx-auto mb-2 text-[#7a1c3d]" />
                <p className="text-xs font-medium text-gray-600">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-14">

          <ProductTabs product={product} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
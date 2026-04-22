import React, { useEffect, useState, useRef, useMemo } from "react";
import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";
import { useNavigate } from "react-router-dom";
import { getProductImageUrl, getProductPath } from "../../utils/productHelpers";
import HeroSliderSkeleton from "../common/HeroSliderSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSlider = () => {
  const { data, loading } = useGet("/admin/banners");
  const banners = data?.data || [];
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  // touch
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);

  // ✅ Process banners with full data
  const processedBanners = useMemo(() => {
    return banners.map((banner) => ({
      ...banner,
      fullUrl: getImageUrl(banner.image),
      products: banner.products || [],
    }));
  }, [banners]);

  // ✅ Preload images
  useEffect(() => {
    if (!processedBanners.length) return;
    processedBanners.forEach((b) => {
      const img = new Image();
      img.src = b.fullUrl;
    });
  }, [processedBanners]);

  // 🔥 AUTO SLIDE (FAST)
  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);

    autoSlideRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
  };

  useEffect(() => {
    if (!processedBanners.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % processedBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [processedBanners.length]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % processedBanners.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? processedBanners.length - 1 : prev - 1));
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    clearInterval(autoSlideRef.current); // pause only on touch
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
  };

  const handleMouseUp = (e) => {
    setTouchEnd(e.clientX);

    if (touchStart - e.clientX > 50) handleNext();
    if (touchStart - e.clientX < -50) handlePrev();
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
  };


  // ✅ Render layout based on banner layout type
  const renderBannerContent = (banner) => {
    const {
      layout = "grid",
      products = [],
      title,
      subtitle,
      description,
    } = banner;

    // ========== GRID LAYOUT ==========
    if (layout === "grid") {
      return (
        <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col md:flex-row items-center justify-between gap-6">
          {/* LEFT SIDE - Text */}
          <div className="text-white flex-1">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4">
              {title || "Special Offer"}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {subtitle || "Premium Collection"}
            </h1>
            <p className="text-sm sm:text-base opacity-95 drop-shadow max-w-md mb-6">
              {description ||
                "Discover premium quality products from our marketplace."}
            </p>
            <button
              onClick={() =>
                products[0] && navigate(getProductPath(products[0]))
              }
              className="bg-white text-black px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-100 transition shadow-lg"
            >
              Shop Now →
            </button>
          </div>

          {/* RIGHT SIDE - Products Grid */}
          {products.length > 0 && (
            <div className="w-full md:w-1/2 lg:w-2/5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {products.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(getProductPath(product))}
                    className="group cursor-pointer rounded-lg overflow-hidden transition hover:scale-[1.02] shadow-lg bg-white/95 backdrop-blur-sm hover:bg-white"
                  >
                    <div className="flex items-center gap-2 p-2 sm:p-3">
                      <img
                        src={getProductImageUrl(product)}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-md"
                        alt={product.name}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 font-medium">
                          ₹{Number(product.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // ========== HIGHLIGHT LAYOUT ==========
    if (layout === "highlight") {
      const product = products[0];
      return (
        <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full">
          {/* Product Card - TOP RIGHT */}
          {product && (
            <div className="flex justify-end">
              <div className="w-full sm:w-80 md:w-96">
                <div
                  onClick={() => navigate(getProductPath(product))}
                  className="bg-white rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition shadow-2xl"
                >
                  <div className="flex gap-3 p-3 sm:p-4">
                    <img
                      src={getProductImageUrl(product)}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      alt={product.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 line-clamp-2 text-sm sm:text-base">
                        {product.name}
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-green-600 mt-2">
                        ₹{Number(product.price || 0).toLocaleString()}
                      </p>
                      <button className="mt-2 text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Banner Text - BOTTOM LEFT */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 max-w-md">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-3">
              {title || "Featured"}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {subtitle || "Special Deal"}
            </h1>
            <p className="text-sm sm:text-base text-white/90 drop-shadow">
              {description || "Limited time offer"}
            </p>
          </div>
        </div>
      );
    }

    // ========== CAROUSEL LAYOUT ==========
    if (layout === "carousel") {
      return (
        <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between">
          {/* Text Section - TOP */}
          <div className="text-white text-center md:text-left">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4">
              {title || "Collection"}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {subtitle || "Shop Now"}
            </h1>
            <p className="text-sm sm:text-base opacity-95 drop-shadow max-w-2xl">
              {description || "Browse our latest collection"}
            </p>
          </div>

          {/* Products Carousel - BOTTOM */}
          {products.length > 0 && (
            <div className="mt-auto">
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(getProductPath(product))}
                    className="min-w-[130px] sm:min-w-[150px] md:min-w-[170px] lg:min-w-[190px] flex-shrink-0 cursor-pointer rounded-lg overflow-hidden bg-white shadow-xl hover:shadow-2xl transition hover:scale-[1.02]"
                  >
                    <img
                      src={getProductImageUrl(product)}
                      className="h-24 sm:h-28 md:h-32 w-full object-cover"
                      alt={product.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    <div className="p-2 sm:p-3">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-green-600 mt-1 sm:mt-2">
                        ₹{Number(product.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default fallback
    return (
      <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex items-center">
        <div className="max-w-2xl">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4">
            {title || "Welcome"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {subtitle || "Premium Collection"}
          </h1>
          <p className="text-sm sm:text-base text-white/90 drop-shadow mb-6">
            {description || "Discover amazing products"}
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-100 transition shadow-lg">
            Shop Now →
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <HeroSliderSkeleton />;
  }

  if (!processedBanners.length) return null;

  return (
    <div
      className="relative w-full min-h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-[#f6f1f4] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Sliding Track */}
      <div className="relative w-full h-full">
        {processedBanners.map((banner, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banner.fullUrl})` }}
            >
              {/* Gradient Overlay based on layout */}
              <div
                className={`absolute inset-0 ${
                  banner.layout === "grid"
                    ? "bg-gradient-to-r from-black/70 to-black/30"
                    : banner.layout === "highlight"
                      ? "bg-gradient-to-br from-black/60 via-black/40 to-transparent"
                      : "bg-gradient-to-t from-black/80 via-black/40 to-black/20"
                }`}
              ></div>
            </div>

            {/* Banner Content with Products */}
            {renderBannerContent(banner)}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {processedBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-1.5 sm:p-2 rounded-full z-20 transition"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-1.5 sm:p-2 rounded-full z-20 transition"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {processedBanners.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
          {processedBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 ${
                current === i
                  ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
              } rounded-full`}
            />
          ))}
        </div>
      )}

      {/* Swipe hint for mobile */}
      {processedBanners.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 sm:hidden text-white/50 text-xs z-20">
          ← Swipe →
        </div>
      )}
    </div>
  );
};

export default HeroSlider;

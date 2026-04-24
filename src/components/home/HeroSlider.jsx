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
  const autoSlideRef = useRef(null);

  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Process banners with full data
  const processedBanners = useMemo(() => {
    return banners.map((banner) => ({
      ...banner,
      fullUrl: getImageUrl(banner.image),
      products: banner.products || [],
    }));
  }, [banners]);

  // Preload images
  useEffect(() => {
    if (!processedBanners.length) return;
    processedBanners.forEach((b) => {
      const img = new Image();
      img.src = b.fullUrl;
    });
  }, [processedBanners]);

  // Auto slide
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

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
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

  // Render layout based on banner layout type
  const renderBannerContent = (banner) => {
    const { layout = "grid", products = [], title, subtitle, description } = banner;

    // ========== GRID LAYOUT ==========
    if (layout === "grid") {
      return (
        <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 h-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          {/* LEFT SIDE - Text Section */}
          <div className="text-white flex-1 text-center lg:text-left max-w-xl">
            <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider mb-4 sm:mb-5 shadow-lg">
              {title || "EXCLUSIVE OFFER"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-5 drop-shadow-2xl leading-tight">
              {subtitle || "Premium Collection"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl opacity-95 drop-shadow-lg mb-6 sm:mb-8 leading-relaxed">
              {description || "Discover premium quality products from our curated marketplace."}
            </p>
            <button
              onClick={() => products[0] && navigate(getProductPath(products[0]))}
              className="bg-white text-gray-900 px-8 py-3.5 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform inline-flex items-center gap-2"
            >
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* RIGHT SIDE - Products Grid - Square Images */}
          {products.length > 0 && (
            <div className="w-full lg:w-1/2 xl:w-2/5">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {products.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(getProductPath(product))}
                    className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-105"
                  >
                    {/* SQUARE IMAGE - 1:1 Aspect Ratio */}
                    <div className="relative w-full pt-[100%]">
                      <img
                        src={getProductImageUrl(product)}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={product.name}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2 mb-1.5">
                        {product.name}
                      </p>
                      <p className="text-base sm:text-lg font-extrabold text-green-600">
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

    // ========== HIGHLIGHT LAYOUT - SQUARE IMAGE NOW ==========
    if (layout === "highlight") {
      const product = products[0];
      return (
        <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 h-full">
          {/* Product Card - TOP RIGHT - With Square Image */}
          {product && (
            <div className="flex justify-end">
              <div className="w-full sm:w-80 md:w-96 lg:w-[420px]">
                <div
                  onClick={() => navigate(getProductPath(product))}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
                >
                  {/* SQUARE IMAGE - Same as grid and carousel */}
                  <div className="relative w-full pt-[100%]">
                    <img
                      src={getProductImageUrl(product)}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={product.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-gray-800 line-clamp-2 text-base sm:text-lg md:text-xl mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-600 mb-3">
                      ₹{Number(product.price || 0).toLocaleString()}
                    </p>
                    <button className="text-sm bg-gradient-to-r from-gray-900 to-black text-white px-5 py-2.5 rounded-lg hover:from-black hover:to-gray-900 transition-all shadow-md inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                      Shop Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Banner Text - BOTTOM LEFT */}
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-6 sm:left-8 md:left-10 max-w-lg">
            <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider mb-3 shadow-lg">
              {title || "FEATURED"}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
              {subtitle || "Special Deal"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/95 drop-shadow-lg leading-relaxed">
              {description || "Limited time offer. Don't miss out!"}
            </p>
          </div>
        </div>
      );
    }

    // ========== CAROUSEL LAYOUT ==========
    if (layout === "carousel") {
      return (
        <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 h-full flex flex-col justify-between">
          {/* Text Section - TOP */}
          <div className="text-white text-center">
            <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider mb-4 shadow-lg">
              {title || "NEW COLLECTION"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-2xl leading-tight">
              {subtitle || "Shop Now"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl opacity-95 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
              {description || "Browse our latest collection of premium products"}
            </p>
          </div>

          {/* Products Carousel - BOTTOM - Square Images */}
          {products.length > 0 && (
            <div className="mt-auto pt-8">
              <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(getProductPath(product))}
                    className="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] flex-shrink-0 cursor-pointer rounded-xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 snap-start"
                  >
                    {/* SQUARE IMAGE - 1:1 Aspect Ratio */}
                    <div className="relative w-full pt-[100%]">
                      <img
                        src={getProductImageUrl(product)}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={product.name}
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2 mb-1.5">
                        {product.name}
                      </p>
                      <p className="text-base sm:text-lg font-extrabold text-green-600">
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
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 h-full flex items-center">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider mb-4 shadow-lg">
            {title || "WELCOME"}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
            {subtitle || "Premium Collection"}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 drop-shadow-lg mb-6 leading-relaxed">
            {description || "Discover amazing products at unbeatable prices"}
          </p>
          <button className="bg-white text-gray-900 px-8 py-3.5 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform inline-flex items-center gap-2">
            Shop Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
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
      className="relative w-full min-h-[450px] sm:h-[550px] md:h-[650px] lg:h-[750px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden"
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
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Parallax Effect */}
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000"
              style={{ 
                backgroundImage: `url(${banner.fullUrl})`,
                transform: i === current ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {/* Dynamic Gradient Overlay based on layout */}
              <div
                className={`absolute inset-0 ${
                  banner.layout === "grid"
                    ? "bg-gradient-to-r from-black/80 via-black/50 to-black/30"
                    : banner.layout === "highlight"
                    ? "bg-gradient-to-br from-black/70 via-black/50 to-transparent"
                    : "bg-gradient-to-t from-black/90 via-black/60 to-black/30"
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
            className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg p-2 md:p-3 rounded-full z-20 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg p-2 md:p-3 rounded-full z-20 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots */}
      {processedBanners.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          {processedBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 ${
                current === i
                  ? "w-8 sm:w-10 h-2 bg-white shadow-lg"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70 hover:w-4"
              } rounded-full`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
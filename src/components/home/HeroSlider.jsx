// FILE: src/components/home/HeroSlider.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";

import {
  getProductImageUrl,
  getProductPath,
} from "../../utils/productHelpers";

import HeroSliderSkeleton from "../common/HeroSliderSkeleton";

// ======================================================
// CONFIG
// ======================================================

const AUTO_SLIDE_DELAY = 5000;
const SWIPE_THRESHOLD = 50;

// ======================================================
// BUTTON STYLES
// ======================================================

const BUTTON_STYLES =
  "group inline-flex items-center justify-center gap-2 rounded-full bg-white text-gray-900 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]";

// ======================================================
// BADGE
// ======================================================

const Badge = ({ children, icon: Icon = Sparkles }) => {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-0.5 sm:py-1 shadow-sm">
      <Icon size={10} className="text-[#7a1c3d] flex-shrink-0" />
      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-gray-800 whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};

// ======================================================
// PRODUCT CARD FOR GRID - Smaller on mobile
// ======================================================

const GridProductCard = ({ product, onClick }) => {
  const image = getProductImageUrl(product);
  
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="relative w-full pt-[100%] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={product?.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-1.5 sm:p-2 text-center">
        <p className="text-[10px] sm:text-xs font-medium text-gray-700 truncate">
          {product?.name?.length > 12 ? product.name.substring(0, 10) + '..' : product?.name}
        </p>
        <p className="text-[11px] sm:text-sm font-bold text-[#7a1c3d] mt-0.5">
          ₹{Number(product?.price || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// ======================================================
// REGULAR PRODUCT CARD
// ======================================================

const ProductCard = ({ product, onClick }) => {
  const image = getProductImageUrl(product);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={product?.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>
      <div className="p-1.5 sm:p-2.5">
        <h3 className="text-[10px] sm:text-xs font-medium text-gray-800 line-clamp-2 min-h-[28px] sm:min-h-[36px]">
          {product?.name?.length > 18 ? product.name.substring(0, 15) + '...' : product?.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-[11px] sm:text-sm font-bold text-[#7a1c3d]">
            ₹{Number(product?.price || 0).toLocaleString()}
          </p>
          <div className="rounded-full bg-[#7a1c3d]/10 p-1 text-[#7a1c3d] transition-all duration-300 group-hover:bg-[#7a1c3d] group-hover:text-white">
            <ShoppingBag size={10} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// PRODUCT MARQUEE
// ======================================================

const ProductMarquee = ({ products, navigate }) => {
  if (!products?.length) return null;

  const duplicated = [...products, ...products, ...products];

  return (
    <div className="relative overflow-hidden py-2 sm:py-3">
      <div className="marquee-track flex w-max gap-2 sm:gap-3 md:gap-4">
        {duplicated.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="w-[100px] xs:w-[110px] sm:w-[130px] md:w-[150px] flex-shrink-0"
          >
            <ProductCard
              product={product}
              onClick={() => navigate(getProductPath(product))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const HeroSlider = () => {
  const navigate = useNavigate();

  const { data, loading } = useGet("/banners");

  const banners = data?.data || [];

  const processedBanners = useMemo(() => {
    return banners.map((banner) => ({
      ...banner,
      fullUrl: getImageUrl(banner.image),
      products: banner.products || [],
      button_text: banner.button_text || "Shop Now",
      button_link: banner.button_link || "",
      layout: banner.layout || "hero",
    }));
  }, [banners]);

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % processedBanners.length);
    }, AUTO_SLIDE_DELAY);
  }, [processedBanners.length]);

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!processedBanners.length) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [processedBanners.length, startAutoSlide]);

  useEffect(() => {
    processedBanners.forEach((banner) => {
      const img = new Image();
      img.src = banner.fullUrl;
    });
  }, [processedBanners]);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % processedBanners.length);
    startAutoSlide();
  }, [processedBanners.length, startAutoSlide]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? processedBanners.length - 1 : prev - 1));
    startAutoSlide();
  }, [processedBanners.length, startAutoSlide]);

  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    stopAutoSlide();
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEnd;

    if (diff > SWIPE_THRESHOLD) handleNext();
    if (diff < -SWIPE_THRESHOLD) handlePrev();
    startAutoSlide();
  };

  const handleCTA = (banner) => {
    if (!banner?.button_link) return;
    const isExternal = banner.button_link.startsWith("http");
    if (isExternal) {
      window.open(banner.button_link, "_blank", "noopener,noreferrer");
    } else {
      navigate(banner.button_link);
    }
  };

  if (loading) return <HeroSliderSkeleton />;
  if (!processedBanners.length) return null;

  const renderLayout = (banner) => {
    const { layout, title, subtitle, description, products } = banner;

    // HERO LAYOUT
    if (layout === "hero") {
      return (
        <div className="flex h-full items-center">
          <div className="container mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
            <div className="max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <Badge icon={Zap}>{title || "Premium Collection"}</Badge>
              <h1 className="mt-2 xs:mt-3 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-lg">
                {subtitle || "Luxury Fashion Collection"}
              </h1>
              <p className="mt-1 xs:mt-2 text-[11px] xs:text-xs sm:text-sm md:text-base text-white/90 drop-shadow">
                {description || "Discover premium collections curated for style and elegance."}
              </p>
              <div className="mt-3 xs:mt-4 sm:mt-5">
                <button onClick={() => handleCTA(banner)} className={BUTTON_STYLES}>
                  {banner.button_text}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // GRID LAYOUT - 2x2 with smaller cards on mobile
    if (layout === "grid") {
      const displayProducts = products?.slice(0, 4) || [];
      
      return (
        <div className="flex h-full items-center">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-8 items-center">
              {/* Left Text Section */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <Badge icon={TrendingUp}>{title || "Trending Now"}</Badge>
                <h1 className="mt-2 xs:mt-3 text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {subtitle}
                </h1>
                <p className="mt-1 xs:mt-2 text-[11px] xs:text-xs sm:text-sm md:text-base text-white/90 drop-shadow max-w-md mx-auto lg:mx-0">
                  {description}
                </p>
                <div className="mt-3 xs:mt-4">
                  <button onClick={() => handleCTA(banner)} className={BUTTON_STYLES}>
                    {banner.button_text}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Section - 2x2 Product Grid with smaller cards on mobile */}
              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 max-w-md mx-auto lg:mx-0 lg:max-w-none">
                  {displayProducts.map((product) => (
                    <GridProductCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(getProductPath(product))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PRODUCTS LAYOUT
    if (layout === "products") {
      return (
        <div className="flex min-h-full items-center py-4 xs:py-5 sm:py-6 md:py-8">
          <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              <Badge icon={TrendingUp}>{title || "Featured Products"}</Badge>
              <h1 className="mt-2 text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                {subtitle}
              </h1>
              <p className="mt-1 text-[10px] xs:text-[11px] sm:text-xs text-white/90">{description}</p>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
              {products?.slice(0, 10).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(getProductPath(product))}
                />
              ))}
            </div>

            <div className="text-center mt-4 xs:mt-5 sm:mt-6 md:mt-8">
              <button onClick={() => handleCTA(banner)} className={BUTTON_STYLES}>
                {banner.button_text}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // SPLIT LAYOUT
    if (layout === "split") {
      return (
        <div className="flex h-full items-end pb-5 xs:pb-6 sm:pb-8 md:pb-10 px-4 xs:px-6 sm:px-8 lg:px-12">
          <div className="max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <Badge icon={Zap}>{title || "Exclusive Offer"}</Badge>
            <h1 className="mt-2 xs:mt-3 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-lg">
              {subtitle}
            </h1>
            <p className="mt-1 xs:mt-2 text-[11px] xs:text-xs sm:text-sm md:text-base text-white/90 drop-shadow">
              {description}
            </p>
            <div className="mt-3 xs:mt-4">
              <button onClick={() => handleCTA(banner)} className={BUTTON_STYLES}>
                {banner.button_text}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // CAROUSEL LAYOUT
    if (layout === "slider" || layout === "carousel") {
      return (
        <div className="flex min-h-full items-center py-4 xs:py-5 sm:py-6 md:py-8">
          <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              <Badge icon={ShoppingBag}>{title || "New Arrivals"}</Badge>
              <h1 className="mt-2 text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                {subtitle}
              </h1>
              <p className="mt-1 text-[10px] xs:text-[11px] sm:text-xs text-white/90">{description}</p>
              <div className="mt-3 xs:mt-4">
                <button onClick={() => handleCTA(banner)} className={BUTTON_STYLES}>
                  {banner.button_text}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <ProductMarquee products={products} navigate={navigate} />
          </div>
        </div>
      );
    }

    // HIGHLIGHT LAYOUT
    if (layout === "highlight") {
      const product = products?.[0];
      
      return (
        <div className="flex h-full items-center">
          <div className="container mx-auto px-4 xs:px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-8 items-center">
              <div className="md:w-1/2 flex justify-center">
                {product && (
                  <div
                    onClick={() => navigate(getProductPath(product))}
                    className="cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-[140px] xs:max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[240px] group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.target.src = "/placeholder.jpg")}
                      />
                    </div>
                    <div className="p-2 sm:p-3">
                      <p className="text-[10px] xs:text-xs font-medium text-gray-800 line-clamp-2">
                        {product?.name?.length > 15 ? product.name.substring(0, 12) + '...' : product?.name}
                      </p>
                      <p className="text-[11px] xs:text-sm font-bold text-[#7a1c3d] mt-0.5">
                        ₹{Number(product?.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:w-1/2 text-center md:text-left">
                <Badge>{title || "Featured Product"}</Badge>
                <h1 className="mt-2 xs:mt-3 text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {subtitle}
                </h1>
                <p className="mt-1 xs:mt-2 text-[11px] xs:text-xs sm:text-sm md:text-base text-white/90 drop-shadow">
                  {description}
                </p>
                <div className="mt-3 xs:mt-4">
                  <button onClick={() => handleCTA(banner)} className={BUTTON_STYLES}>
                    {banner.button_text}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.33%); }
          }
          .marquee-track {
            animation: marquee 25s linear infinite;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          @media (max-width: 640px) {
            .marquee-track {
              animation-duration: 20s;
            }
          }
        `}
      </style>

      <section
        className="relative h-[450px] xs:h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {processedBanners.map((banner, index) => {
          const active = current === index;

          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                active ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${banner.fullUrl})` }}
              />
              
              {/* Clean gradient - minimal for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
              
              <div className="relative z-10 h-full">{renderLayout(banner)}</div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {processedBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 text-gray-800 shadow-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg hidden sm:flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 md:p-2.5 text-gray-800 shadow-md transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg hidden sm:flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {processedBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 sm:gap-2 md:gap-2.5">
            {processedBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-full transition-all duration-300 ${
                  current === index 
                    ? "w-5 sm:w-7 md:w-9 h-1 bg-white shadow-md" 
                    : "w-1 h-1 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default HeroSlider;
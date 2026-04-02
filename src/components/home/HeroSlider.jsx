import React, { useEffect, useState, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";

const HeroSlider = () => {
  const { data, loading } = useGet("/admin/banners");
  const banners = data?.data || [];

  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const sliderRef = useRef(null);

  // ✅ Memoize images (avoid recalculation)
  const bannerImages = useMemo(() => {
    return banners.map((b) => ({
      ...b,
      fullUrl: getImageUrl(b.image),
    }));
  }, [banners]);

  // ✅ Preload images once
  useEffect(() => {
    if (!bannerImages.length) return;

    bannerImages.forEach((b) => {
      const img = new Image();
      img.src = b.fullUrl;
    });
  }, [bannerImages]);

  // ✅ Auto slide
  useEffect(() => {
    if (!bannerImages.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % bannerImages.length);
  };

  const handlePrev = () => {
    setCurrent((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  };

  // ✅ Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!bannerImages.length) return null;

  return (
    <div
      ref={sliderRef}
      className="relative w-full min-h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-[#f6f1f4] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ✅ Sliding Track (GPU optimized) */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {bannerImages.map((banner, i) => (
          <div key={i} className="w-full flex-shrink-0 relative h-full">
            <img
              src={banner.fullUrl}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 sm:from-black/40 sm:to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="w-full sm:max-w-xl md:max-w-2xl space-y-3 sm:space-y-4 md:space-y-6 text-white">
                  <span className="inline-block bg-[#ead1dc] text-[#7a1c3d] px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {banner.title}
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                    {banner.subtitle}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-gray-100 max-w-lg">
                    Discover premium quality products from Soulful Overseas marketplace.
                  </p>

                  <a href={banner.link}>
                    <button className="bg-[#7a1c3d] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-[#5c132d] transition-all hover:scale-105 text-sm sm:text-base font-medium">
                      Shop Now →
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-1.5 sm:p-2 rounded-full z-10"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={handleNext}
        className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-1.5 sm:p-2 rounded-full z-10"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {bannerImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 ${
              current === i
                ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#7a1c3d]"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
            } rounded-full`}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 sm:hidden text-white/50 text-xs">
        ← Swipe →
      </div>
    </div>
  );
};

export default HeroSlider;
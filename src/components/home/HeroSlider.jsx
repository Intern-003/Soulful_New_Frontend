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
    setCurrent((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
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
      <div className="relative w-full h-full">
        {bannerImages.map((banner, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={banner.fullUrl}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="space-y-6">
                  {/* Badge */}
                  <span className="inline-block bg-[#f0dbe4] text-[#8C0D4F] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                    {banner.title}
                  </span>

                  {/* Heading */}
                  <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[#3b0a1c]">
                    {banner.subtitle?.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="text-[#8C0D4F] relative inline-block">
                      {banner.subtitle?.split(" ").slice(-1)}
                      <span className="absolute left-0 bottom-1 w-full h-[3px] bg-[#e7a8c2]"></span>
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-gray-100 text-[15px] leading-relaxed max-w-md">
                    Discover premium quality products from Soulful Overseas
                    marketplace.
                  </p>

                  {/* Button */}
                  <a href={banner.link}>
                    <button className="bg-[#8C0D4F] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#6d0a3e] transition-all duration-300 shadow-sm hover:shadow-md">
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

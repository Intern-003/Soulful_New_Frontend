import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";

const HeroSlider = () => {
  const { data, loading } = useGet("/admin/banners");
  const banners = data?.data || [];

  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);

  // AUTO SLIDE
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [banners, current]);

  const handleNext = () => {
    setAnimate(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
      setAnimate(true);
    }, 50);
  };

  const handlePrev = () => {
    setAnimate(false);
    setTimeout(() => {
      setCurrent((prev) =>
        prev === 0 ? banners.length - 1 : prev - 1
      );
      setAnimate(true);
    }, 50);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left - next slide
      handleNext();
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right - previous slide
      handlePrev();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <div 
      ref={sliderRef}
      className="relative w-full min-h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-[#f6f1f4] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={getImageUrl(banner.image)}
          alt={banner.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 sm:from-black/40 sm:to-black/20" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        
        <div
          className={`w-full sm:w-auto max-w-full sm:max-w-xl md:max-w-2xl space-y-3 sm:space-y-4 md:space-y-6 text-white ${
            animate
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10"
          } transition-all duration-500`}
        >
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

      {/* Navigation Arrows - Hidden on very small screens, visible on tablet+ */}
      <button
        onClick={handlePrev}
        className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-1.5 sm:p-2 rounded-full transition z-10 items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={handleNext}
        className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md p-1.5 sm:p-2 rounded-full transition z-10 items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 ${
              current === i
                ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#7a1c3d]"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
            } rounded-full cursor-pointer`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Mobile swipe hint - optional */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 sm:hidden text-white/50 text-xs">
        ← Swipe →
      </div>
    </div>
  );
};

export default HeroSlider;
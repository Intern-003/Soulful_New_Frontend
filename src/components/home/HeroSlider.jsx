import React, { useEffect, useState, useRef, useMemo } from "react";
import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";
import HeroSliderSkeleton from "../common/HeroSliderSkeleton";

const HeroSlider = () => {
  const { data, loading } = useGet("/admin/banners");
  const banners = data?.data || [];

  const [current, setCurrent] = useState(0);

  // touch
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // mouse drag
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const autoSlideRef = useRef(null);

  // images
  const bannerImages = useMemo(() => {
    return banners.map((b) => ({
      ...b,
      fullUrl: getImageUrl(b.image),
    }));
  }, [banners]);

  // preload images
  useEffect(() => {
    bannerImages.forEach((b) => {
      const img = new Image();
      img.src = b.fullUrl;
    });
  }, [bannerImages]);

  // 🔥 AUTO SLIDE (FAST)
  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);

    autoSlideRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
  };

  useEffect(() => {
    if (!bannerImages.length) return;

    startAutoSlide();

    return () => clearInterval(autoSlideRef.current);
  }, [bannerImages.length]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % bannerImages.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };

  // ================= TOUCH =================
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    clearInterval(autoSlideRef.current); // pause only on touch
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();

    startAutoSlide(); // resume
  };

  // ================= MOUSE DRAG =================
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    clearInterval(autoSlideRef.current); // pause only on drag
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;

    const diff = startX - e.clientX;

    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();

    setIsDragging(false);
    startAutoSlide(); // resume
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-[400px] flex items-center justify-center">
  //       <div className="animate-pulse text-gray-600">Loading...</div>
  //     </div>
  //   );
  // }
  if (loading) {
    return <HeroSliderSkeleton />;
  }

  if (!bannerImages.length) return null;

  return (
    <div
      className="relative w-full min-h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-[#f6f1f4] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* SLIDES */}
      <div className="relative w-full h-full">
        {bannerImages.map((banner, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={banner.fullUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />

            {/* content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full space-y-6">
                <span className="inline-block bg-[#f0dbe4] text-[#8C0D4F] px-4 py-1.5 rounded-full text-xs font-semibold relative tracking-[0.05em] leading-tight transition-all duration-300">
                  {banner.title}
                </span>

                <h1 className="relative text-4xl md:text-4xl uppercase font-semibold tracking-[0.1em] text-white leading-tight transition-all duration-300">
                  {banner.subtitle}
                </h1>

                <p className="relative max-w-md tracking-[0.05em] text-white leading-tight transition-all duration-300">
                  Discover premium quality products from Soulful Overseas
                  marketplace.
                </p>

                <a href={banner.link}>
                  <button className="bg-[#8C0D4F] text-white px-6 py-3 rounded-md hover:bg-[#6d0a3e] transition cursor-pointer">
                    Shop Now →
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerImages.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              startAutoSlide(); // reset timer
            }}
            className={`transition-all duration-300 rounded-full ${
              current === i
                ? "w-8 h-2 bg-[#7a1c3d]"
                : "w-2 h-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;

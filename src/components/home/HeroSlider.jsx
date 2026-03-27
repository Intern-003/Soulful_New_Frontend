import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";

const HeroSlider = () => {
  const { data, loading } = useGet("/admin/banners");

  const banners = data?.data || [];

  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);

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

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <div className="relative w-full bg-[#f6f1f4] overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between">

        {/* LEFT */}
        <div
          className={`max-w-xl space-y-6 transition-all duration-700 ${
            animate
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10"
          }`}
        >
          <span className="bg-[#ead1dc] text-[#7a1c3d] px-4 py-1 rounded-full text-sm font-medium">
            {banner.title}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-[#3a0d1f]">
            {banner.subtitle}
          </h1>

          <p className="text-gray-600">
            Discover premium quality products from Soulful Overseas marketplace.
          </p>

          <a href={banner.link}>
            <button className="bg-[#7a1c3d] text-white px-6 py-3 rounded-md hover:bg-[#5c132d] transition">
              Shop Now →
            </button>
          </a>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className={`mt-10 md:mt-0 transition-all duration-700 ${
            animate
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 translate-x-10 scale-95"
          }`}
        >
          <img
            src={getImageUrl(banner.image)}
            alt={banner.title}
            className="w-[300px] md:w-[480px] object-contain hover:scale-105 transition duration-500"
          />
        </div>
      </div>

      {/* ARROWS */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              current === i
                ? "bg-[#7a1c3d] scale-110"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
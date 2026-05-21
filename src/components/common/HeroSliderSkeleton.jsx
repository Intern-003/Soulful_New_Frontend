// FILE: src/components/common/HeroSliderSkeleton.jsx

import React from "react";

const HeroSliderSkeleton = () => {
  return (
    <div className="relative w-full min-h-[400px] xs:min-h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[650px] overflow-hidden bg-[#EAD2DB]">
      {/* DARK GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B0D3A]/40 via-[#8B0D3A]/20 to-transparent" />

      {/* SHIMMER */}
      <div className="absolute inset-0 shimmer-main" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 w-full space-y-4 xs:space-y-5 sm:space-y-6">
          {/* BADGE */}
          <div className="inline-flex items-center px-3 xs:px-4 py-1 xs:py-2 rounded-full bg-[#e2c0d2]">
            <div className="h-2 xs:h-3 w-16 xs:w-20 skeleton-block" />
          </div>

          {/* HEADING */}
          <div className="space-y-2 xs:space-y-3">
            <div className="inline-flex items-center px-3 xs:px-4 py-2 xs:py-3 rounded-full bg-[#e2c0d2]">
              <div className="h-2 xs:h-3 w-48 xs:w-64 skeleton-block" />
            </div>
          </div>

          <div className="space-y-1 xs:space-y-2">
            <div className="inline-flex items-center px-3 xs:px-4 py-1 xs:py-2 rounded-full bg-[#e2c0d2]">
              <div className="h-1.5 xs:h-2 w-24 xs:w-30 skeleton-block" />
            </div>
          </div>

          {/* BUTTON */}
          <div className="inline-flex items-center justify-center px-5 xs:px-6 py-2 xs:py-3 rounded-md bg-[#e2c0d2]">
            <div className="h-3 xs:h-4 w-20 xs:w-24 skeleton-block" />
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 xs:bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-6 xs:w-8 h-1.5 xs:h-2 rounded-full bg-[#8B0D3A]" />
        <div className="w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full bg-white/50" />
        <div className="w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full bg-white/50" />
      </div>
    </div>
  );
};

export default HeroSliderSkeleton;
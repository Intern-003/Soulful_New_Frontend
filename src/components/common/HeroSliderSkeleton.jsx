import React from "react";

const HeroSliderSkeleton = () => {
  return (
    <div className="relative w-full min-h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-[#EAD2DB]">
      {/* DARK GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B0D3A]/40 via-[#8B0D3A]/20 to-transparent" />

      {/* SHIMMER */}
      <div className="absolute inset-0 shimmer-main" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full space-y-6">
          {/* BADGE */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e2c0d2]">
            <div className="h-3 w-20 skeleton-block" />
          </div>

          {/* HEADING */}
          <div className="space-y-1">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e2c0d2]">
              <div className="h-3 w-80 skeleton-block" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#e2c0d2]">
              <div className="h-2 w-30 skeleton-block" />
            </div>
          </div>

          {/* BUTTON */}
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[#e2c0d2]">
            <div className="h-4 w-24 skeleton-block" />
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-8 h-2 rounded-full bg-[#8B0D3A]" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
      </div>
    </div>
  );
};

export default HeroSliderSkeleton;

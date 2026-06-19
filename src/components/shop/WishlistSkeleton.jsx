import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full h-[300px] rounded-3xl bg-[#8B0D3A]/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      </div>
      <div className="mt-4 space-y-2 px-1">
        <div className="h-4 w-3/4 bg-[#8B0D3A]/25 rounded" />
        <div className="h-4 w-1/2 bg-[#8B0D3A]/15 rounded" />
      </div>
    </div>
  );
};

const WishlistSkeleton = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-8 w-40 bg-[#8B0D3A]/30 rounded animate-pulse" />
          <div className="h-4 w-56 bg-[#8B0D3A]/20 rounded animate-pulse" />
        </div>
        <div className="h-8 w-20 bg-[#8B0D3A]/40 rounded-full animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <div className="mt-24">
          <div className="h-6 w-48 bg-[#8B0D3A]/30 rounded mb-8 animate-pulse" />
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[180px] animate-pulse">
                <div className="w-full h-40 bg-[#8B0D3A]/20 rounded-xl" />
                <div className="h-3 w-3/4 bg-[#8B0D3A]/25 mt-3 rounded" />
                <div className="h-3 w-1/2 bg-[#8B0D3A]/15 mt-2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center pb-10 text-xs text-[#8B0D3A]/40">
        Loading your luxury picks...
      </div>
    </div>
  );
};

export default WishlistSkeleton;
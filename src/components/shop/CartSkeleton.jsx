import React from "react";

const CartItemSkeleton = () => {
  return (
    <div className="relative flex gap-5 p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#f1d6dd] animate-pulse">
      {/* IMAGE */}
      <div className="w-24 h-24 rounded-xl bg-[#8B0D3A]/20 shimmer"></div>

      {/* INFO */}
      <div className="flex-1 space-y-3">
        <div className="h-4 w-2/3 bg-[#8B0D3A]/30 rounded shimmer"></div>
        <div className="h-3 w-1/3 bg-[#8B0D3A]/20 rounded shimmer"></div>
        <div className="h-3 w-1/4 bg-[#8B0D3A]/20 rounded shimmer"></div>

        {/* QTY */}
        <div className="flex items-center gap-2 mt-3">
          <div className="w-8 h-8 rounded-full bg-[#8B0D3A]/20 shimmer"></div>
          <div className="w-6 h-4 bg-[#8B0D3A]/20 rounded shimmer"></div>
          <div className="w-8 h-8 rounded-full bg-[#8B0D3A]/20 shimmer"></div>
        </div>

        {/* REMOVE */}
        <div className="h-3 w-16 bg-[#8B0D3A]/20 rounded shimmer mt-2"></div>
      </div>

      {/* PRICE */}
      <div className="h-5 w-16 bg-[#8B0D3A]/30 rounded shimmer"></div>
    </div>
  );
};

const VendorHeaderSkeleton = () => {
  return (
    <div className="flex items-center gap-3 pb-2 border-b border-gray-200 animate-pulse">
      <div className="w-1 h-6 bg-[#8B0D3A]/30 rounded-full shimmer"></div>
      <div className="h-5 w-32 bg-[#8B0D3A]/30 rounded shimmer"></div>
      <div className="h-4 w-16 bg-[#8B0D3A]/20 rounded shimmer"></div>
    </div>
  );
};

const CartSummarySkeleton = () => {
  return (
    <div className="sticky top-24 h-fit animate-pulse">
      <div className="bg-white/80 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="h-6 w-32 bg-[#8B0D3A]/30 rounded shimmer"></div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-[#8B0D3A]/20 rounded shimmer"></div>
            <div className="h-4 w-16 bg-[#8B0D3A]/20 rounded shimmer"></div>
          </div>

          <div className="flex justify-between">
            <div className="h-4 w-20 bg-[#8B0D3A]/20 rounded shimmer"></div>
            <div className="h-4 w-16 bg-[#8B0D3A]/20 rounded shimmer"></div>
          </div>

          <div className="flex justify-between">
            <div className="h-4 w-20 bg-[#8B0D3A]/20 rounded shimmer"></div>
            <div className="h-4 w-16 bg-[#8B0D3A]/20 rounded shimmer"></div>
          </div>

          <div className="flex justify-between">
            <div className="h-4 w-20 bg-[#8B0D3A]/20 rounded shimmer"></div>
            <div className="h-4 w-16 bg-[#8B0D3A]/20 rounded shimmer"></div>
          </div>

          <div className="h-[1px] bg-[#8B0D3A]/10"></div>

          <div className="flex justify-between">
            <div className="h-5 w-24 bg-[#8B0D3A]/30 rounded shimmer"></div>
            <div className="h-5 w-20 bg-[#8B0D3A]/30 rounded shimmer"></div>
          </div>
        </div>

        {/* COUPON SECTION SKELETON */}
        <div className="mt-6">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-[#8B0D3A]/10 rounded-xl shimmer"></div>
            <div className="w-20 h-10 bg-[#8B0D3A]/30 rounded-xl shimmer"></div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="h-12 w-full bg-[#8B0D3A]/40 rounded-xl shimmer"></div>
        <div className="h-10 w-full bg-[#8B0D3A]/20 rounded-xl shimmer"></div>
      </div>
    </div>
  );
};

const CartSkeleton = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex justify-between items-center flex-wrap gap-4 animate-pulse">
        <div className="space-y-3">
          <div className="h-9 w-36 bg-[#8B0D3A]/30 rounded shimmer"></div>
          <div className="h-4 w-56 bg-[#8B0D3A]/20 rounded shimmer"></div>
        </div>

        <div className="h-8 w-24 bg-[#8B0D3A]/40 rounded-full shimmer"></div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16 grid lg:grid-cols-3 gap-10">
        {/* LEFT ITEMS - With vendor grouping skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Vendor Group 1 */}
          <div className="space-y-4">
            <VendorHeaderSkeleton />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <CartItemSkeleton key={`vendor1-${i}`} />
              ))}
            </div>
          </div>

          {/* Vendor Group 2 (if multi-vendor expected) */}
          <div className="space-y-4">
            <VendorHeaderSkeleton />
            <div className="space-y-4">
              {Array.from({ length: 1 }).map((_, i) => (
                <CartItemSkeleton key={`vendor2-${i}`} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <CartSummarySkeleton />
      </div>

      {/* FOOTER */}
      <div className="text-center pb-10 text-xs text-[#8B0D3A]/40 animate-pulse">
        Preparing your cart...
      </div>

      {/* SHIMMER STYLES - Fixed: removed 'jsx' */}
      <style>
        {`
          .shimmer {
            position: relative;
            overflow: hidden;
          }

          .shimmer::before {
            content: "";
            position: absolute;
            top: 0;
            left: -150px;
            height: 100%;
            width: 150px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(139, 13, 58, 0.25),
              transparent
            );
            animation: shimmerMove 1.2s infinite;
          }

          @keyframes shimmerMove {
            100% {
              left: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CartSkeleton;
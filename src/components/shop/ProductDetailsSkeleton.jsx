import React from "react";

const ProductDetailsSkeleton = () => {
  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="bg-[#f6f1f3] border-b border-gray-200 py-6 px-4 md:px-10 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-3 rounded bg-[#82203D]/20"></div>
            <div className="w-2 h-3 rounded bg-[#82203D]/20"></div>
            <div className="w-24 h-3 rounded bg-[#82203D]/20"></div>
          </div>

          {/* Title */}
          <div className="w-48 h-6 rounded bg-[#82203D]/30"></div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="bg-[#fafafa] min-h-screen py-15 px-4 md:px-10 animate-pulse">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {/* LEFT - IMAGES */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-lg bg-[#82203D]/20" />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 p-6">
              <div className="w-full h-[400px] rounded-xl bg-[#82203D]/20"></div>
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="space-y-6">
            {/* Category */}
            <div className="w-28 h-3 rounded bg-[#82203D]/20"></div>

            {/* Title */}
            <div className="space-y-2">
              <div className="w-3/4 h-7 rounded bg-[#82203D]/30"></div>
              <div className="w-1/2 h-7 rounded bg-[#82203D]/20"></div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="w-24 h-4 bg-[#82203D]/20 rounded"></div>
              <div className="w-10 h-4 bg-[#82203D]/20 rounded"></div>
              <div className="w-20 h-4 bg-[#82203D]/20 rounded"></div>
            </div>

            {/* Price Card */}
            <div className="bg-[#f6f1f3] rounded-2xl p-6 space-y-3">
              <div className="w-32 h-6 bg-[#82203D]/30 rounded"></div>
              <div className="w-20 h-4 bg-[#82203D]/20 rounded"></div>
              <div className="w-40 h-3 bg-[#82203D]/20 rounded"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="w-full h-3 bg-[#82203D]/20 rounded"></div>
              <div className="w-5/6 h-3 bg-[#82203D]/20 rounded"></div>
              <div className="w-4/6 h-3 bg-[#82203D]/20 rounded"></div>
            </div>

            {/* Color */}
            <div>
              <div className="w-20 h-3 bg-[#82203D]/20 rounded mb-2"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-[#82203D]/20"
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="w-20 h-3 bg-[#82203D]/20 rounded mb-2"></div>
              <div className="flex gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-8 rounded-lg bg-[#82203D]/20"
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="w-20 h-3 bg-[#82203D]/20 rounded mb-2"></div>
              <div className="w-28 h-10 bg-[#82203D]/20 rounded"></div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-[#82203D]/30 rounded-xl"></div>
              <div className="flex-1 h-12 bg-[#82203D]/20 rounded-xl"></div>
              <div className="w-12 h-12 bg-[#82203D]/20 rounded-xl"></div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 text-center">
                  <div className="w-6 h-6 mx-auto bg-[#82203D]/30 rounded-full"></div>
                  <div className="w-16 h-3 mx-auto bg-[#82203D]/20 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ================= TABS (CLOSED UI) ================= */}
      <div className="max-w-7xl mx-auto mt-16 space-y-6 animate-pulse">
        {[1, 2, 3].map((_, i) => (
          <div key={i}>
            {/* HEADER LINE */}
            <div className="flex justify-between items-center py-4">
              <div className="w-48 h-4 bg-[#82203D]/30 rounded"></div>

              {/* Chevron icon placeholder */}
              <div className="w-4 h-4 bg-[#82203D]/20 rounded"></div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-gray-200"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductDetailsSkeleton;

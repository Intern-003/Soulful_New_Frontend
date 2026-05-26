// src/components/common/ProductSkeleton.jsx
import React from "react";

const ProductSkeleton = ({ viewMode = "grid" }) => {
  return (
    <div
      className={`group ${viewMode === "list" ? "flex gap-3 xs:gap-4 items-start" : ""}`}
    >
      {/* IMAGE SKELETON */}
      <div
        className={`
          relative overflow-hidden rounded-md bg-gradient-to-br from-[#ead3dd] to-[#f3d6e2]
          ${viewMode === "list" 
            ? "w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg" 
            : "aspect-[2/3] rounded-t-lg"}
        `}
      >
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* CONTENT SKELETON */}
      <div
        className={`
          mt-2 xs:mt-3 space-y-1.5 xs:space-y-2 w-full
          ${viewMode === "list" ? "flex flex-col flex-1 mt-0" : ""}
        `}
      >
        {/* Title skeleton */}
        <div className="h-2.5 xs:h-3 sm:h-3.5 bg-gradient-to-r from-[#ead3dd] to-[#f3d6e2] rounded w-4/5 relative overflow-hidden">
          <div className="shimmer" />
        </div>

        {/* Price skeleton */}
        <div className="h-2.5 xs:h-3 sm:h-3.5 bg-gradient-to-r from-[#ead3dd] to-[#f3d6e2] rounded w-3/5 relative overflow-hidden">
          <div className="shimmer" />
        </div>

        {/* Discount skeleton */}
        <div className="h-2 xs:h-2.5 sm:h-3 bg-gradient-to-r from-[#ead3dd] to-[#f3d6e2] rounded w-2/5 relative overflow-hidden">
          <div className="shimmer" />
        </div>

        {/* Button skeleton for grid view */}
        {viewMode === "grid" && (
          <div className="h-7 xs:h-8 sm:h-9 bg-gradient-to-r from-[#ead3dd] to-[#f3d6e2] rounded-md mt-2 xs:mt-3 relative overflow-hidden">
            <div className="shimmer" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSkeleton;
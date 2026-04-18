import React from "react";

const ProductSkeleton = ({ viewMode = "grid" }) => {
  return (
    <div
      className={`group ${viewMode === "list" ? "flex gap-4 items-start" : ""}`}
    >
      {/* IMAGE */}
      <div
        className={`
          relative overflow-hidden rounded-md bg-[#ead3dd]
          ${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-[2/3]"}
        `}
      >
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* CONTENT */}
      <div
        className={`
          mt-3 space-y-2
          ${viewMode === "list" ? "flex flex-col flex-1 mt-0" : ""}
        `}
      >
        <div className="h-4 bg-[#ead3dd] rounded w-4/5 relative overflow-hidden">
          <div className="shimmer" />
        </div>

        <div className="h-4 bg-[#ead3dd] rounded w-3/5 relative overflow-hidden">
          <div className="shimmer" />
        </div>

        <div className="h-4 bg-[#ead3dd] rounded w-2/5 relative overflow-hidden">
          <div className="shimmer" />
        </div>

        {viewMode === "grid" && (
          <div className="h-9 bg-[#ead3dd] rounded mt-3 relative overflow-hidden">
            <div className="shimmer" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSkeleton;

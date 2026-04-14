import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products = [],
  loading,
  columns = 4,
  viewMode = "grid",
}) => {
  const gridClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  const skeletonCount = 8;

  return (
    <div
      className={`grid 
        ${viewMode === "grid" ? gridClasses[columns] : "grid-cols-1"}
        gap-x-5 sm:gap-x-6 lg:gap-x-8
        gap-y-8 sm:gap-y-10
      `}
    >
      {/* LOADING */}
      {loading &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`skeleton-${index}`} className="animate-pulse">
            {/* IMAGE */}
            <div className="w-full aspect-[3/4] bg-[#f3ebee] rounded-md" />

            {/* CONTENT */}
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-4/5" />
              <div className="h-4 bg-gray-200 rounded w-3/5" />
            </div>
          </div>
        ))}

      {/* PRODUCTS */}
      {!loading &&
        products
          ?.filter(Boolean)
          .map((item) => (
            <ProductCard key={item.id} product={item} viewMode={viewMode} />
          ))}
    </div>
  );
};

export default ProductGrid;

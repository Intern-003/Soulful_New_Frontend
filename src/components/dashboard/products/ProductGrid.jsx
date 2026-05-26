// src/components/dashboard/products/ProductGrid.jsx
import React from "react";

import ProductCard from "./ProductCard";

import ProductSkeleton from "../../common/ProductSkeleton";

const ProductGrid = ({
  products = [],
  loading,
  columns = 5,
  viewMode = "grid",
}) => {
  const gridClasses = {
    2: `
      grid-cols-2
    `,

    3: `
      grid-cols-2
      md:grid-cols-3
    `,

    4: `
      grid-cols-2
      md:grid-cols-3
      xl:grid-cols-4
    `,

    5: `
      grid-cols-2
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      2xl:grid-cols-5
    `,
  };

  const skeletonCount = 10;

  return (
    <div
      className={`
        ${
          viewMode === "grid"
            ? `
              grid
              ${gridClasses[columns]}
            `
            : `
              flex
              flex-col
              gap-5
            `
        }

        gap-4
        md:gap-5
      `}
    >
      {/* LOADING */}
      {loading ? (
        Array.from({
          length: skeletonCount,
        }).map((_, index) => (
          <ProductSkeleton
            key={index}
            viewMode={viewMode}
          />
        ))
      ) : products?.length ===
        0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          {/* ICON */}
          <div className="w-24 h-24 rounded-full bg-[#f8e9ef] flex items-center justify-center text-4xl mb-5">
            🛍️
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-semibold text-[#2d0f1f]">
            No Products Found
          </h3>

          {/* DESC */}
          <p className="text-gray-500 mt-2 text-sm max-w-sm">
            We couldn’t find
            products matching your
            filters.
          </p>
        </div>
      ) : (
        products
          ?.filter(Boolean)
          .map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              viewMode={viewMode}
            />
          ))
      )}
    </div>
  );
};

export default ProductGrid;
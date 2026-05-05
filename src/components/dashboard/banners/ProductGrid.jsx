// FILE: src/components/dashboard/banners/ProductGrid.jsx

import React, { memo } from "react";
import ProductCard from "./ProductCard";

/* ==========================================================
   FILE: ProductGrid.jsx
   Strict Elite Mode
   Production Grade

   Props:
   products = []
   selectedProducts = []
   loading = false
   disabled = false

   onSelect(product)
========================================================== */

const ProductSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="aspect-square animate-pulse bg-slate-200" />

      <div className="space-y-3 p-4">
        <div className="h-4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />

        <div className="flex justify-between pt-2">
          <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h3 className="text-lg font-semibold text-slate-900">
        No Products Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Try another search or category filter.
      </p>
    </div>
  );
};

const ProductGrid = ({
  products = [],
  selectedProducts = [],
  loading = false,
  disabled = false,
  onSelect,
}) => {
  const isSelected =
    (id) =>
      selectedProducts.some(
        (
          item
        ) =>
          (
            item?.id ||
            item
          ) === id
      );

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({
          length: 8,
        }).map(
          (
            _,
            index
          ) => (
            <ProductSkeleton
              key={index}
            />
          )
        )}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map(
        (
          product
        ) => (
          <ProductCard
            key={
              product.id
            }
            product={
              product
            }
            selected={isSelected(
              product.id
            )}
            disabled={
              disabled
            }
            onSelect={
              onSelect
            }
          />
        )
      )}
    </div>
  );
};

export default memo(
  ProductGrid
);
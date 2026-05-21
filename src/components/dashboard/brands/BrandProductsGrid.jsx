// FILE: src/components/dashboard/brands/BrandProductsGrid.jsx

import React, {
  memo,
} from "react";

import {
  PackageSearch,
} from "lucide-react";

import BrandProductCard from "./BrandProductCard";

/* ==========================================================
   FILE: BrandProductsGrid.jsx
   Elite Production Grade

   Features:
   ✅ Loading skeleton
   ✅ Empty state
   ✅ Responsive grid
========================================================== */

const ProductSkeleton =
  () => {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* IMAGE */}
        <div className="aspect-square animate-pulse bg-slate-200" />

        {/* CONTENT */}
        <div className="space-y-3 p-4">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />

          <div className="mt-4 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />

              <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-10 w-16 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  };

const BrandProductsGrid = ({
  products = [],
  loading = false,
}) => {
  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({
          length: 10,
        }).map(
          (
            _,
            index
          ) => (
            <ProductSkeleton
              key={
                index
              }
            />
          )
        )}
      </div>
    );
  }

  /* ========================================================
     EMPTY
  ======================================================== */

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
          <PackageSearch
            size={26}
            className="text-slate-700"
          />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-slate-900">
          No Products Found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          No products match your current filters.
        </p>
      </div>
    );
  }

  /* ========================================================
     GRID
  ======================================================== */

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
      {products.map(
        (
          product
        ) => (
          <BrandProductCard
            key={
              product.id
            }
            product={
              product
            }
          />
        )
      )}
    </div>
  );
};

export default memo(
  BrandProductsGrid
);
// FILE: src/components/dashboard/brands/BrandProductsFilters.jsx

import React, {
  memo,
} from "react";

import {
  Search,
  RotateCcw,
} from "lucide-react";

/* ==========================================================
   FILE: BrandProductsFilters.jsx
   Elite Production Grade

   Features:
   ✅ Product search
   ✅ Reset filters
   ✅ Product count
========================================================== */

const BrandProductsFilters = ({
  search = "",
  total = 0,

  onSearchChange,
  onReset,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* ===================================================
            LEFT
        =================================================== */}

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Product Filters
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Total Products:
            {" "}
            <span className="font-semibold text-slate-900">
              {total}
            </span>
          </p>
        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <button
          type="button"
          onClick={
            onReset
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw
            size={15}
          />

          Reset
        </button>
      </div>

      {/* ===================================================
          SEARCH
      =================================================== */}

      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          Search Product
        </label>

        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={
              search
            }
            onChange={(
              e
            ) =>
              onSearchChange?.(
                e.target
                  .value
              )
            }
            placeholder="Search by product name..."
            className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm outline-none transition focus:border-[#7a1c3d]"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(
  BrandProductsFilters
);
// FILE: src/components/dashboard/banners/ProductSelectorFilters.jsx

import React, { memo } from "react";
import {
  Search,
  RotateCcw,
  Filter,
} from "lucide-react";

/* ==========================================================
   FILE: ProductSelectorFilters.jsx
   Strict Elite Mode
   Production Grade

   Props:
   search = ""
   category = "all"
   categories = []
   selectedCount = 0

   onSearchChange(value)
   onCategoryChange(value)
   onReset()
========================================================== */

const ProductSelectorFilters = ({
  search = "",
  category = "all",
  categories = [],
  selectedCount = 0,
  onSearchChange,
  onCategoryChange,
  onReset,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* TOP */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Product Filters
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Selected:{" "}
            <span className="font-semibold text-slate-900">
              {selectedCount}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={
            onReset
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw
            size={15}
          />
          Reset
        </button>
      </div>

      {/* CONTROLS */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* SEARCH */}
        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Search Product
          </label>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
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
              placeholder="Search by name..."
              className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-[#7a1c3d]"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Category
          </label>

          <div className="relative">
            <Filter
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={
                category
              }
              onChange={(
                e
              ) =>
                onCategoryChange?.(
                  e.target
                    .value
                )
              }
              className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-[#7a1c3d]"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map(
                (
                  item
                ) => (
                  <option
                    key={
                      item.id
                    }
                    value={
                      item.id
                    }
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(
  ProductSelectorFilters
);
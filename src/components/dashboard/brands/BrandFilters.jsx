// FILE: src/components/dashboard/brands/BrandFilters.jsx

import React, {
  memo,
} from "react";

import {
  Search,
  RotateCcw,
  Filter,
} from "lucide-react";

/* ==========================================================
   FILE: BrandFilters.jsx
   Elite Production Grade

   Features:
   ✅ Search
   ✅ Status filtering
   ✅ Reset filters
   ✅ Responsive UI
========================================================== */

const BrandFilters = ({
  search = "",
  status = "",

  onSearchChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="grid flex-1 gap-5 md:grid-cols-2">
          {/* SEARCH */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Search Brand
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
                placeholder="Search by brand name or slug..."
                className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm outline-none transition focus:border-[#7a1c3d]"
              />
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Filter Status
            </label>

            <div className="relative">
              <Filter
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={
                  status
                }
                onChange={(
                  e
                ) =>
                  onStatusChange?.(
                    e.target
                      .value
                  )
                }
                className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#7a1c3d]"
              >
                <option value="">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <button
          type="button"
          onClick={
            onReset
          }
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw
            size={16}
          />

          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default memo(
  BrandFilters
);
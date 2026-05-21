// FILE: src/components/dashboard/banners/BannerFilters.jsx

import React, { memo, useState, useEffect, useCallback } from "react";
import { Search, RotateCcw, SlidersHorizontal, Loader2 } from "lucide-react";

// All available layouts (predefined)
const ALL_LAYOUTS = [
  "hero",
  "grid", 
  "products",
  "split",
  "slider",
  "carousel",
  "highlight"
];

const BannerFilters = ({
  banners = [],
  search = "",
  status = "all",
  layout = "all",
  sortBy = "position_asc",
  loading = false,
  onSearchChange,
  onStatusChange,
  onLayoutChange,
  onSortChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setIsSearching(true);
        onSearchChange?.(localSearch);
        setTimeout(() => setIsSearching(false), 500);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const handleReset = useCallback(() => {
    setLocalSearch("");
    onReset?.();
  }, [onReset]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100">
          <SlidersHorizontal size={18} className="text-slate-800" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Filters & Search</h3>
          <p className="text-xs text-slate-500">Quickly find banners</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {/* SEARCH WITH DEBOUNCE */}
        <div className="xl:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Search
          </label>
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search title or subtitle..."
              className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-10 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
            />
            {isSearching && (
              <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />
            )}
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange?.(e.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* LAYOUT - Now shows ALL predefined layouts */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Layout
          </label>
          <select
            value={layout}
            onChange={(e) => onLayoutChange?.(e.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          >
            <option value="all">All Layouts</option>
            {ALL_LAYOUTS.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Sort
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          >
            <option value="position_asc">Position Low → High</option>
            <option value="position_desc">Position High → Low</option>
            <option value="title_asc">Title A → Z</option>
            <option value="title_desc">Title Z → A</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Filter by visibility, layout or position.</p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw size={16} />
          Reset Filters
        </button>
      </div>
    </section>
  );
};

export default memo(BannerFilters);
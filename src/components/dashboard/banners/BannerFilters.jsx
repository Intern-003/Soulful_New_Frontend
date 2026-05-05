// FILE: src/components/dashboard/banners/BannerFilters.jsx

import React, {
  memo,
  useMemo,
} from "react";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

/* ==========================================================
   BANNER FILTERS
   Elite Production Grade

   Props:
   banners = []

   search = ""
   status = "all"
   layout = "all"
   sortBy = "position_asc"

   onSearchChange(value)
   onStatusChange(value)
   onLayoutChange(value)
   onSortChange(value)
   onReset()
========================================================== */

const BannerFilters = ({
  banners = [],

  search = "",
  status = "all",
  layout = "all",
  sortBy = "position_asc",

  onSearchChange,
  onStatusChange,
  onLayoutChange,
  onSortChange,
  onReset,
}) => {
  const layouts =
    useMemo(() => {
      const values =
        banners
          .map(
            (
              item
            ) =>
              item.layout
          )
          .filter(
            Boolean
          );

      return [
        ...new Set(
          values
        ),
      ].sort();
    }, [banners]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100">
          <SlidersHorizontal
            size={18}
            className="text-slate-800"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Filters & Search
          </h3>

          <p className="text-xs text-slate-500">
            Quickly find banners
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {/* SEARCH */}
        <div className="xl:col-span-2">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Search
          </label>

          <div className="relative">
            <Search
              size={17}
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
              placeholder="Search title or subtitle..."
              className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
            />
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Status
          </label>

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
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          >
            <option value="all">
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

        {/* LAYOUT */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Layout
          </label>

          <select
            value={
              layout
            }
            onChange={(
              e
            ) =>
              onLayoutChange?.(
                e.target
                  .value
              )
            }
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          >
            <option value="all">
              All Layouts
            </option>

            {layouts.map(
              (
                item
              ) => (
                <option
                  key={
                    item
                  }
                  value={
                    item
                  }
                >
                  {item}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-4">
        {/* SORT */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Sort
          </label>

          <select
            value={
              sortBy
            }
            onChange={(
              e
            ) =>
              onSortChange?.(
                e.target
                  .value
              )
            }
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          >
            <option value="position_asc">
              Position Low → High
            </option>
            <option value="position_desc">
              Position High → Low
            </option>
            <option value="title_asc">
              Title A → Z
            </option>
            <option value="title_desc">
              Title Z → A
            </option>
          </select>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Filter by visibility, layout or position.
        </p>

        <button
          type="button"
          onClick={
            onReset
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw
            size={16}
          />
          Reset Filters
        </button>
      </div>
    </section>
  );
};

export default memo(
  BannerFilters
);
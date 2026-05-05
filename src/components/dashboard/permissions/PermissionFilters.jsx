// FILE: src/components/dashboard/permissions/PermissionFilters.jsx

import React, {
  memo,
  useMemo,
} from "react";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

/* ==========================================================
   PERMISSION FILTERS
   Elite Production Grade

   Props:
   permissions = []

   search = ""
   selectedModule = "all"
   sortBy = "module_asc"

   onSearchChange(value)
   onModuleChange(value)
   onSortChange(value)
   onReset()
========================================================== */

const PermissionFilters = ({
  permissions = [],

  search = "",
  selectedModule = "all",
  sortBy = "module_asc",

  onSearchChange,
  onModuleChange,
  onSortChange,
  onReset,
}) => {
  const modules =
    useMemo(() => {
      const list =
        permissions.map(
          (
            item
          ) =>
            item.module
        );

      return [
        ...new Set(
          list
        ),
      ].sort();
    }, [
      permissions,
    ]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100">
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
            Find permissions faster
          </p>
        </div>
      </div>

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
              placeholder="Search module or action..."
              className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
            />
          </div>
        </div>

        {/* MODULE */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Module
          </label>

          <select
            value={
              selectedModule
            }
            onChange={(
              e
            ) =>
              onModuleChange?.(
                e.target
                  .value
              )
            }
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          >
            <option value="all">
              All Modules
            </option>

            {modules.map(
              (
                module
              ) => (
                <option
                  key={
                    module
                  }
                  value={
                    module
                  }
                >
                  {module}
                </option>
              )
            )}
          </select>
        </div>

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
            <option value="module_asc">
              Module A-Z
            </option>
            <option value="module_desc">
              Module Z-A
            </option>
            <option value="action_asc">
              Action A-Z
            </option>
            <option value="action_desc">
              Action Z-A
            </option>
          </select>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Use filters to quickly locate permission rules.
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
  PermissionFilters
);
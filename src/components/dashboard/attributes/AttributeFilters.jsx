// FILE: src/components/dashboard/attributes/AttributeFilters.jsx

import React, { memo } from "react";
import {
  Search,
  Plus,
  X,
  SlidersHorizontal,
} from "lucide-react";

const AttributeFilters = ({
  search = "",
  onSearchChange,
  newAttribute = "",
  onNewAttributeChange,
  onCreate,
  creating = false,
  total = 0,
}) => {
  const canCreate =
    newAttribute.trim().length > 0 && !creating;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canCreate) onCreate?.();
  };

  const clearSearch = () => {
    onSearchChange?.("");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Top Row */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Search */}
        <div className="flex-1">
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <SlidersHorizontal size={14} />
            Search Attributes
          </label>

          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                onSearchChange?.(e.target.value)
              }
              placeholder="Search by attribute name..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <p className="mt-2 text-xs text-slate-500">
            {total} attribute{total !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Create */}
        <div className="w-full xl:w-[420px]">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Create New Attribute
          </label>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={newAttribute}
              onChange={(e) =>
                onNewAttributeChange?.(e.target.value)
              }
              placeholder="e.g. Color, Size, Material"
              className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
            />

            <button
              type="submit"
              disabled={!canCreate}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition-all hover:bg-[#651732] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />

              {creating ? "Creating..." : "Add"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default memo(AttributeFilters);
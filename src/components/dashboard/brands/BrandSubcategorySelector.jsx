// FILE: src/components/dashboard/brands/BrandSubcategorySelector.jsx

import React, {
  memo,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Check,
  FolderTree,
} from "lucide-react";

/* ==========================================================
   FILE: BrandSubcategorySelector.jsx
   Elite Production Grade

   Features:
   ✅ Search
   ✅ Multi select
   ✅ Responsive
   ✅ Optimized rendering
   ✅ Empty state
========================================================== */

const BrandSubcategorySelector = ({
  subcategories = [],
  selected = [],
  onChange,
}) => {
  /* ========================================================
     SEARCH
  ======================================================== */

  const [
    search,
    setSearch,
  ] =
    useState("");

  /* ========================================================
     FILTERED
  ======================================================== */

  const filtered =
    useMemo(() => {
      return subcategories.filter(
        (
          item
        ) =>
          item?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      subcategories,
      search,
    ]);

  /* ========================================================
     TOGGLE
  ======================================================== */

  const handleToggle =
    (id) => {
      const exists =
        selected.includes(
          id
        );

      if (
        exists
      ) {
        onChange?.(
          selected.filter(
            (
              item
            ) =>
              item !== id
          )
        );
      } else {
        onChange?.([
          ...selected,
          id,
        ]);
      }
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div>
      {/* ===================================================
          LABEL
      =================================================== */}

      <label className="mb-3 block text-sm font-semibold text-slate-700">
        Linked Subcategories
      </label>

      {/* ===================================================
          SEARCH
      =================================================== */}

      <div className="relative mb-4">
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
            setSearch(
              e.target
                .value
            )
          }
          placeholder="Search subcategories..."
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#7a1c3d]"
        />
      </div>

      {/* ===================================================
          LIST
      =================================================== */}

      <div className="max-h-72 overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50/50 p-4">
        {/* ===============================================
            EMPTY
        =============================================== */}

        {!filtered.length && (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100">
              <FolderTree
                size={24}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-5 text-sm font-semibold text-slate-900">
              No Subcategories Found
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Try changing your search keyword
            </p>
          </div>
        )}

        {/* ===============================================
            GRID
        =============================================== */}

        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map(
            (
              item
            ) => {
              const active =
                selected.includes(
                  item.id
                );

              return (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  onClick={() =>
                    handleToggle(
                      item.id
                    )
                  }
                  className={`group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all ${
                    active
                      ? "border-[#7a1c3d] bg-[#7a1c3d]/5 shadow-sm"
                      : "border-slate-200 bg-white hover:border-[#7a1c3d]/40 hover:bg-white"
                  }`}
                >
                  {/* ACTIVE ICON */}
                  {active && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#7a1c3d] text-white">
                      <Check
                        size={
                          14
                        }
                      />
                    </div>
                  )}

                  {/* NAME */}
                  <h4
                    className={`text-sm font-semibold transition ${
                      active
                        ? "text-[#7a1c3d]"
                        : "text-slate-800"
                    }`}
                  >
                    {
                      item.name
                    }
                  </h4>

                  {/* ID */}
                  <p className="mt-1 text-xs text-slate-400">
                    ID:
                    {" "}
                    {
                      item.id
                    }
                  </p>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      {!!selected.length && (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#7a1c3d]/5 px-4 py-3">
          <p className="text-sm font-medium text-[#7a1c3d]">
            {
              selected.length
            }
            {" "}
            subcategories selected
          </p>

          <button
            type="button"
            onClick={() =>
              onChange?.([])
            }
            className="text-xs font-semibold text-[#7a1c3d] transition hover:opacity-70"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(
  BrandSubcategorySelector
);
// FILE: src/components/dashboard/brands/BrandProductsPagination.jsx

import React, {
  memo,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ==========================================================
   FILE: BrandProductsPagination.jsx
   Elite Production Grade

   Features:
   ✅ Responsive pagination
   ✅ Page indicators
   ✅ Navigation controls
========================================================== */

const BrandProductsPagination = ({
  currentPage = 1,
  lastPage = 1,
  total = 0,
  perPage = 20,

  onPageChange,
}) => {
  /* ========================================================
     HIDE
  ======================================================== */

  if (
    !lastPage ||
    lastPage <= 1
  ) {
    return null;
  }

  /* ========================================================
     RANGE
  ======================================================== */

  const start =
    (currentPage - 1) *
      perPage +
    1;

  const end =
    Math.min(
      currentPage *
        perPage,
      total
    );

  /* ========================================================
     PAGES
  ======================================================== */

  const pages = [];

  for (
    let i = 1;
    i <= lastPage;
    i++
  ) {
    pages.push(i);
  }

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* ===================================================
            INFO
        =================================================== */}

        <div>
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {start}
            </span>
            {" "}to{" "}
            <span className="font-semibold text-slate-900">
              {end}
            </span>
            {" "}of{" "}
            <span className="font-semibold text-slate-900">
              {total}
            </span>
            {" "}products
          </p>
        </div>

        {/* ===================================================
            CONTROLS
        =================================================== */}

        <div className="flex flex-wrap items-center gap-2">
          {/* PREVIOUS */}
          <button
            type="button"
            disabled={
              currentPage ===
              1
            }
            onClick={() =>
              onPageChange?.(
                currentPage -
                  1
              )
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft
              size={18}
            />
          </button>

          {/* PAGE NUMBERS */}
          {pages.map(
            (
              page
            ) => (
              <button
                key={page}
                type="button"
                onClick={() =>
                  onPageChange?.(
                    page
                  )
                }
                className={`inline-flex h-11 min-w-[44px] items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition ${
                  currentPage ===
                  page
                    ? "border-[#7a1c3d] bg-[#7a1c3d] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* NEXT */}
          <button
            type="button"
            disabled={
              currentPage ===
              lastPage
            }
            onClick={() =>
              onPageChange?.(
                currentPage +
                  1
              )
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight
              size={18}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  BrandProductsPagination
);
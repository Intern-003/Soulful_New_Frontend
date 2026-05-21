// FILE: src/components/dashboard/brands/BrandPagination.jsx

import React, {
  memo,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ==========================================================
   FILE: BrandPagination.jsx
   Elite Production Grade

   Props:
   currentPage=1
   lastPage=1
   total=0
   perPage=10

   onPageChange()
========================================================== */

const BrandPagination = ({
  currentPage = 1,
  lastPage = 1,
  total = 0,
  perPage = 10,

  onPageChange,
}) => {
  /* ========================================================
     NO PAGINATION
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
     PAGE LOGIC
  ======================================================== */

  const pages = [];

  const maxVisible =
    5;

  let startPage =
    Math.max(
      1,
      currentPage -
        2
    );

  let endPage =
    Math.min(
      lastPage,
      startPage +
        maxVisible -
        1
    );

  if (
    endPage -
      startPage +
      1 <
    maxVisible
  ) {
    startPage =
      Math.max(
        1,
        endPage -
          maxVisible +
          1
      );
  }

  for (
    let i =
      startPage;
    i <= endPage;
    i++
  ) {
    pages.push(i);
  }

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
            {" "}brands
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

          {/* FIRST PAGE */}
          {startPage >
            1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  onPageChange?.(
                    1
                  )
                }
                className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                1
              </button>

              {startPage >
                2 && (
                <span className="px-1 text-slate-400">
                  ...
                </span>
              )}
            </>
          )}

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

          {/* LAST PAGE */}
          {endPage <
            lastPage && (
            <>
              {endPage <
                lastPage -
                  1 && (
                <span className="px-1 text-slate-400">
                  ...
                </span>
              )}

              <button
                type="button"
                onClick={() =>
                  onPageChange?.(
                    lastPage
                  )
                }
                className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {
                  lastPage
                }
              </button>
            </>
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
  BrandPagination
);
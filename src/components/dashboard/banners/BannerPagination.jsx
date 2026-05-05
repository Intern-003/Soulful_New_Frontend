// FILE: src/components/dashboard/banners/BannerPagination.jsx

import React, { memo, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ==========================================================
   FILE: BannerPagination.jsx
   Strict Elite Mode
   Production Grade

   Props:
   page = 1
   totalPages = 1
   totalItems = 0
   perPage = 10

   onPageChange(page)
========================================================== */

const BannerPagination = ({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  perPage = 10,
  onPageChange,
}) => {
  const currentPage =
    Math.max(
      1,
      Number(page)
    );

  const pages =
    useMemo(() => {
      const list = [];

      const start =
        Math.max(
          1,
          currentPage - 2
        );

      const end =
        Math.min(
          totalPages,
          currentPage + 2
        );

      for (
        let i =
          start;
        i <= end;
        i++
      ) {
        list.push(i);
      }

      return list;
    }, [
      currentPage,
      totalPages,
    ]);

  const startItem =
    totalItems === 0
      ? 0
      : (currentPage -
          1) *
          perPage +
        1;

  const endItem =
    Math.min(
      currentPage *
        perPage,
      totalItems
    );

  const goToPage =
    (nextPage) => {
      if (
        nextPage <
          1 ||
        nextPage >
          totalPages ||
        nextPage ===
          currentPage
      ) {
        return;
      }

      onPageChange?.(
        nextPage
      );
    };

  if (
    totalPages <= 1
  ) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* INFO */}
        <div className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {startItem}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-900">
            {endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {totalItems}
          </span>{" "}
          banners
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PREV */}
          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage -
                  1
              )
            }
            disabled={
              currentPage ===
              1
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft
              size={16}
            />
          </button>

          {/* PAGES */}
          {pages.map(
            (
              item
            ) => {
              const active =
                item ===
                currentPage;

              return (
                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    goToPage(
                      item
                    )
                  }
                  className={`inline-flex h-10 min-w-[40px] items-center justify-center rounded-2xl px-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#7a1c3d] text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                >
                  {item}
                </button>
              );
            }
          )}

          {/* NEXT */}
          <button
            type="button"
            onClick={() =>
              goToPage(
                currentPage +
                  1
              )
            }
            disabled={
              currentPage ===
              totalPages
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight
              size={16}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(
  BannerPagination
); 
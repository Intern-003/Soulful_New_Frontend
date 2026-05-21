// FILE: src/components/dashboard/brands/BrandSkeleton.jsx

import React, {
  memo,
} from "react";

/* ==========================================================
   FILE: BrandSkeleton.jsx
   Elite Production Grade

   Features:
   ✅ Smooth loading state
   ✅ Mobile + desktop responsive
   ✅ Enterprise shimmer UI
========================================================== */

const SkeletonCard =
  () => {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="animate-pulse">
          {/* =================================================
              TOP
          ================================================= */}

          <div className="flex items-start gap-4">
            {/* LOGO */}
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-200" />

            {/* CONTENT */}
            <div className="flex-1 space-y-3">
              <div className="h-4 w-40 rounded bg-slate-200" />

              <div className="h-3 w-24 rounded bg-slate-100" />

              <div className="h-7 w-20 rounded-full bg-slate-200" />
            </div>
          </div>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="mt-5 h-16 rounded-2xl bg-slate-100" />

          {/* =================================================
              SUBCATEGORIES
          ================================================= */}

          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({
              length: 4,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="h-7 w-24 rounded-full bg-slate-200"
                />
              )
            )}
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-6 flex justify-end gap-2">
            <div className="h-11 w-11 rounded-2xl bg-slate-200" />

            <div className="h-11 w-11 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  };

const BrandSkeleton = ({
  count = 6,
}) => {
  return (
    <div className="grid gap-5">
      {Array.from({
        length: count,
      }).map(
        (
          _,
          index
        ) => (
          <SkeletonCard
            key={
              index
            }
          />
        )
      )}
    </div>
  );
};

export default memo(
  BrandSkeleton
);
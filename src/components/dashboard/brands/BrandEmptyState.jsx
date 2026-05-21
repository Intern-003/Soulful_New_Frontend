// FILE: src/components/dashboard/brands/BrandEmptyState.jsx

import React, {
  memo,
} from "react";

import {
  Store,
  Plus,
} from "lucide-react";

/* ==========================================================
   FILE: BrandEmptyState.jsx
   Elite Production Grade

   Features:
   ✅ Reusable
   ✅ Responsive
   ✅ CTA support
   ✅ Enterprise UI
========================================================== */

const BrandEmptyState = ({
  title = "No Brands Found",

  description = "Create your first brand to start organizing products and subcategories.",

  buttonText = "Create Brand",

  onAction,
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white shadow-sm">
      <div className="flex flex-col items-center px-6 py-20 text-center">
        {/* ===================================================
            ICON
        =================================================== */}

        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#7a1c3d]/10">
          <Store
            size={40}
            className="text-[#7a1c3d]"
          />
        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="mt-8 max-w-md">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {description}
          </p>
        </div>

        {/* ===================================================
            ACTION
        =================================================== */}

        {onAction && (
          <button
            type="button"
            onClick={
              onAction
            }
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus
              size={18}
            />

            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(
  BrandEmptyState
);
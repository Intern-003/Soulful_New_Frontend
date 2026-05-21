// FILE: src/components/dashboard/brands/BrandPageHeader.jsx

import React, {
  memo,
} from "react";

import {
  Plus,
  Store,
} from "lucide-react";

/* ==========================================================
   FILE: BrandPageHeader.jsx
   Elite Production Grade

   Features:
   ✅ Responsive
   ✅ Enterprise dashboard UI
   ✅ Clean CTA section
========================================================== */

const BrandPageHeader = ({
  onCreate,
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* ===================================================
            LEFT
        =================================================== */}

        <div className="flex items-start gap-4">
          {/* ICON */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[2rem] bg-[#7a1c3d]/10">
            <Store
              size={30}
              className="text-[#7a1c3d]"
            />
          </div>

          {/* CONTENT */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Brands Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              Create, manage, and organize product brands with
              enterprise-grade controls, subcategory linking,
              and product management.
            </p>
          </div>
        </div>

        {/* ===================================================
            RIGHT
        =================================================== */}

        <button
          type="button"
          onClick={
            onCreate
          }
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus
            size={18}
          />

          Create Brand
        </button>
      </div>
    </div>
  );
};

export default memo(
  BrandPageHeader
);
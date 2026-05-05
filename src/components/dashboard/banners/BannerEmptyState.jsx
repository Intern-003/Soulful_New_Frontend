// FILE: src/components/dashboard/banners/BannerEmptyState.jsx

import React, { memo } from "react";
import {
  ImageOff,
  Plus,
} from "lucide-react";

/* ==========================================================
   FILE: BannerEmptyState.jsx
   Strict Elite Mode
   Production Grade

   Props:
   onCreate()
========================================================== */

const BannerEmptyState = ({
  onCreate,
}) => {
  return (
    <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
      {/* ICON */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100">
        <ImageOff
          size={28}
          className="text-slate-800"
        />
      </div>

      {/* CONTENT */}
      <h2 className="mt-5 text-2xl font-semibold text-slate-900">
        No Banners Yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create homepage banners for promotions, launches,
        seasonal campaigns, and featured products.
      </p>

      {/* ACTION */}
      <div className="mt-6">
        <button
          type="button"
          onClick={
            onCreate
          }
          className="inline-flex items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#651732]"
        >
          <Plus
            size={17}
          />
          Create Banner
        </button>
      </div>
    </section>
  );
};

export default memo(
  BannerEmptyState
); 
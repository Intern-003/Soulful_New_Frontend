// FILE: src/components/dashboard/banners/ProductPreview.jsx

import React, { memo } from "react";
import {
  Package,
  X,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE: ProductPreview.jsx
   Strict Elite Mode
   Production Grade

   Props:
   products = []
   onRemove(product)
========================================================== */

const ProductPreview = ({
  products = [],
  onRemove,
}) => {
  if (!products.length) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-100">
          <Package
            size={24}
            className="text-slate-800"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No Products Selected
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Select products to attach them with this banner.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Selected Products ({products.length})
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          These products will appear in linked layouts.
        </p>
      </div>

      {/* LIST */}
      <div className="max-h-[420px] overflow-y-auto p-5 space-y-4">
        {products.map(
          (
            product
          ) => (
            <div
              key={
                product.id
              }
              className="flex items-center gap-4 rounded-2xl border border-slate-200 p-3 transition hover:border-slate-300"
            >
              {/* IMAGE */}
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={getImageUrl(
                    product?.image
                  )}
                  alt={
                    product?.name
                  }
                  className="h-full w-full object-cover"
                  onError={(
                    e
                  ) => {
                    e.currentTarget.src =
                      "/placeholder.jpg";
                  }}
                />
              </div>

              {/* INFO */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-slate-900">
                  {product?.name}
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  ID:{" "}
                  {
                    product?.id
                  }
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-600">
                  ₹
                  {Number(
                    product?.price ||
                      0
                  ).toLocaleString()}
                </p>
              </div>

              {/* REMOVE */}
              <button
                type="button"
                onClick={() =>
                  onRemove?.(
                    product
                  )
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Remove product"
              >
                <X
                  size={16}
                />
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default memo(
  ProductPreview
);
// FILE: src/components/dashboard/banners/ProductCard.jsx

import React, { memo } from "react";
import {
  Check,
  Package,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE: ProductCard.jsx
   Strict Elite Mode
   Production Grade

   Props:
   product = {}
   selected = false
   disabled = false

   onSelect(product)
========================================================== */

const ProductCard = ({
  product = {},
  selected = false,
  disabled = false,
  onSelect,
}) => {
  const image =
    getImageUrl(
      product?.image
    );

  const handleClick =
    () => {
      if (
        disabled
      )
        return;

      onSelect?.(
        product
      );
    };

  return (
    <button
      type="button"
      onClick={
        handleClick
      }
      disabled={
        disabled
      }
      className={`group w-full overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition-all ${
        selected
          ? "border-[#7a1c3d] ring-2 ring-[#7a1c3d]/10"
          : "border-slate-200 hover:-translate-y-1 hover:shadow-md"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : ""
      }`}
      aria-pressed={
        selected
      }
      aria-label={
        product?.name
      }
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={
            product?.name ||
            "Product"
          }
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(
            e
          ) => {
            e.currentTarget.src =
              "/placeholder.jpg";
          }}
        />

        {selected && (
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#7a1c3d] text-white shadow-md">
            <Check
              size={14}
            />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900">
          {product?.name ||
            "Unnamed Product"}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-emerald-600">
            ₹
            {Number(
              product?.price ||
                0
            ).toLocaleString()}
          </span>

          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Package
              size={13}
            />
            ID:
            {product?.id ||
              "-"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default memo(
  ProductCard
);
// FILE: src/components/dashboard/brands/BrandProductCard.jsx

import React, {
  memo,
} from "react";

import {
  Eye,
  Pencil,
  Package,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE: BrandProductCard.jsx
   Elite Production Grade

   Features:
   ✅ Product preview card
   ✅ Product actions
   ✅ Image fallback
   ✅ Responsive
========================================================== */

const BrandProductCard = ({
  product,
}) => {
  /* ========================================================
     NAVIGATION
  ======================================================== */

  const navigate =
    useNavigate();

  /* ========================================================
     IMAGE
  ======================================================== */

  const primaryImage =
    product?.images?.find(
      (img) =>
        img?.is_primary
    );

  const image =
    primaryImage
      ?.image_url ||
    product?.images?.[0]
      ?.image_url ||
    product?.thumbnail ||
    product?.image;

  /* ========================================================
     PRICE
  ======================================================== */

  const price =
    Number(
      product?.price ||
        0
    ).toLocaleString();

  const stock =
    Number(
      product?.stock ||
        0
    );

  /* ========================================================
     ACTIONS
  ======================================================== */

  const handleView =
    () => {
      navigate(
        `/products/${product?.slug}`
      );
    };

  const handleEdit =
    () => {
      navigate(
        `/dashboard/products/edit/${product?.id}`
      );
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ===================================================
          IMAGE
      =================================================== */}

      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(
            image
          )}
          alt={
            product?.name
          }
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(
            e
          ) => {
            e.currentTarget.src =
              "/placeholder.jpg";
          }}
        />

        {/* STATUS */}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
              product?.status
                ? "bg-emerald-500 text-white"
                : "bg-slate-300 text-slate-700"
            }`}
          >
            {product?.status
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {/* VIEW */}
          <button
            type="button"
            onClick={
              handleView
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-800 transition hover:scale-105"
          >
            <Eye
              size={16}
            />
          </button>

          {/* EDIT */}
          <button
            type="button"
            onClick={
              handleEdit
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7a1c3d] text-white transition hover:scale-105"
          >
            <Pencil
              size={16}
            />
          </button>
        </div>
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="p-4">
        {/* CATEGORY */}
        {product?.category
          ?.name && (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">
            {
              product
                ?.category
                ?.name
            }
          </p>
        )}

        {/* NAME */}
        <h3 className="line-clamp-2 min-h-[42px] text-sm font-semibold leading-6 text-slate-900">
          {
            product?.name
          }
        </h3>

        {/* PRICE */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">
              Price
            </p>

            <h4 className="text-lg font-bold text-emerald-600">
              ₹
              {price}
            </h4>
          </div>

          {/* STOCK */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
            <Package
              size={14}
            />

            {stock}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(
  BrandProductCard
);
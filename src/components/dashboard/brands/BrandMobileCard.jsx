// FILE: src/components/dashboard/brands/BrandMobileCard.jsx

import React, {
  memo,
} from "react";

import {
  Pencil,
  Trash2,
  Package,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getImageUrl } from "../../../utils/getImageUrl";

import BrandStatusToggle from "./BrandStatusToggle";

/* ==========================================================
   FILE: BrandMobileCard.jsx
   Elite Production Grade

   Features:
   ✅ Mobile responsive
   ✅ Product navigation
   ✅ Status toggle
   ✅ Modern card UI
========================================================== */

const BrandMobileCard = ({
  brand,

  onEdit,
  onDelete,
}) => {
  /* ========================================================
     NAVIGATION
  ======================================================== */

  const navigate =
    useNavigate();

  /* ========================================================
     IMAGE
  ======================================================== */

  const logo =
    brand?.logo
      ? getImageUrl(
          brand.logo
        )
      : "/placeholder.jpg";

  /* ========================================================
     PRODUCTS
  ======================================================== */

  const productsCount =
    brand?.products_count ||
    brand?.products
      ?.length ||
    0;

  /* ========================================================
     SUBCATEGORIES
  ======================================================== */

  const subcategories =
    brand?.subcategories ||
    [];

  /* ========================================================
     OPEN PRODUCTS
  ======================================================== */

  const openProducts =
    () => {
      navigate(
        `/dashboard/brands/${brand.id}/products`
      );
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* ===================================================
          TOP
      =================================================== */}

      <div className="flex items-start gap-4 p-5">
        {/* LOGO */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <img
            src={logo}
            alt={
              brand?.name
            }
            className="h-full w-full object-contain"
            onError={(
              e
            ) => {
              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          {/* NAME */}
          <h3 className="truncate text-base font-bold text-slate-900">
            {
              brand?.name
            }
          </h3>

          {/* SLUG */}
          <p className="mt-1 truncate text-xs text-slate-400">
            /
            {
              brand?.slug
            }
          </p>

          {/* STATUS */}
          <div className="mt-3">
            <BrandStatusToggle
              brand={
                brand
              }
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      <button
        type="button"
        onClick={
          openProducts
        }
        className="mx-5 flex w-[calc(100%-40px)] items-center justify-between rounded-2xl bg-[#7a1c3d]/5 px-4 py-3 transition hover:bg-[#7a1c3d]/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7a1c3d] text-white">
            <Package
              size={18}
            />
          </div>

          <div className="text-left">
            <p className="text-xs text-slate-500">
              Products
            </p>

            <h4 className="text-sm font-bold text-slate-900">
              {
                productsCount
              }
            </h4>
          </div>
        </div>

        <ChevronRight
          size={18}
          className="text-slate-500"
        />
      </button>

      {/* ===================================================
          SUBCATEGORIES
      =================================================== */}

      <div className="px-5 pb-5 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          Linked Subcategories
        </p>

        <div className="flex flex-wrap gap-2">
          {!subcategories.length && (
            <span className="text-xs text-slate-400">
              No subcategories linked
            </span>
          )}

          {subcategories.map(
            (
              item
            ) => (
              <span
                key={
                  item.id
                }
                className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700"
              >
                {
                  item.name
                }
              </span>
            )
          )}
        </div>
      </div>

      {/* ===================================================
          ACTIONS
      =================================================== */}

      <div className="flex border-t border-slate-100">
        {/* EDIT */}
        <button
          type="button"
          onClick={() =>
            onEdit?.(
              brand
            )
          }
          className="flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Pencil
            size={16}
          />

          Edit
        </button>

        {/* DELETE */}
        <button
          type="button"
          onClick={() =>
            onDelete?.(
              brand
            )
          }
          className="flex flex-1 items-center justify-center gap-2 border-l border-slate-100 px-4 py-4 text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          <Trash2
            size={16}
          />

          Delete
        </button>
      </div>
    </div>
  );
};

export default memo(
  BrandMobileCard
);
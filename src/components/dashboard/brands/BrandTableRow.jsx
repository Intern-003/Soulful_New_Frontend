// FILE: src/components/dashboard/brands/BrandTableRow.jsx

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
   FILE: BrandTableRow.jsx
   FINAL STABLE PRODUCTION VERSION

   FEATURES:
   ✅ Keeps your old logic stable
   ✅ Products navigation
   ✅ Responsive clean UI
   ✅ Backend compatible
   ✅ No broken architecture
========================================================== */

const BrandTableRow = ({
  brand,
  index,

  onEdit,
  onDelete,
  refresh,
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
     PRODUCTS COUNT
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

  const visibleSubs =
    subcategories.slice(
      0,
      3
    );

  const remainingCount =
    subcategories.length -
    visibleSubs.length;

  /* ========================================================
     OPEN PRODUCTS
  ======================================================== */

  const handleProductsClick =
    () => {
      navigate(
        `/dashboard/brands/${brand.id}/products`
      );
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <tr className="transition hover:bg-slate-50">
      {/* ===================================================
          INDEX
      =================================================== */}

      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-500">
        {index + 1}
      </td>

      {/* ===================================================
          BRAND
      =================================================== */}

      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
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
          <div className="min-w-0">
            {/* NAME */}
            <h3 className="truncate text-sm font-bold text-slate-900">
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
          </div>
        </div>
      </td>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      <td className="px-4 py-4">
        <button
          type="button"
          onClick={
            handleProductsClick
          }
          className="group inline-flex items-center gap-3 rounded-2xl bg-[#7a1c3d]/5 px-4 py-3 transition hover:bg-[#7a1c3d]/10"
        >
          {/* ICON */}
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7a1c3d] text-white">
            <Package
              size={18}
            />
          </div>

          {/* COUNT */}
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

          <ChevronRight
            size={16}
            className="text-slate-400 transition group-hover:translate-x-1"
          />
        </button>
      </td>

      {/* ===================================================
          SUBCATEGORIES
      =================================================== */}

      <td className="px-4 py-4">
        <div className="flex max-w-sm flex-wrap gap-2">
          {!subcategories.length && (
            <span className="text-xs text-slate-400">
              No subcategories
            </span>
          )}

          {visibleSubs.map(
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

          {remainingCount >
            0 && (
            <span
              className="rounded-full bg-[#7a1c3d]/10 px-3 py-1 text-[11px] font-semibold text-[#7a1c3d]"
              title={subcategories
                .map(
                  (
                    sub
                  ) =>
                    sub.name
                )
                .join(
                  ", "
                )}
            >
              +
              {
                remainingCount
              }
            </span>
          )}
        </div>
      </td>

      {/* ===================================================
          STATUS
      =================================================== */}

      <td className="px-4 py-4">
        <BrandStatusToggle
          brand={brand}
          onSuccess={
            refresh
          }
        />
      </td>

      {/* ===================================================
          ACTIONS
      =================================================== */}

      <td className="whitespace-nowrap px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* EDIT */}
          <button
            type="button"
            onClick={() =>
              onEdit?.(
                brand
              )
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          >
            <Pencil
              size={16}
            />
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() =>
              onDelete?.(
                brand
              )
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 text-red-500 transition hover:bg-red-50"
          >
            <Trash2
              size={16}
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default memo(
  BrandTableRow
);
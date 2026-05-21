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
   Elite Production Grade

   Features:
   ✅ Product navigation
   ✅ Status toggle
   ✅ Modern enterprise table row
========================================================== */

const BrandTableRow = ({
  brand,
  index,

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

  const visibleSubs =
    subcategories.slice(
      0,
      3
    );

  const extraCount =
    subcategories.length -
    visibleSubs.length;

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
    <tr className="group transition hover:bg-slate-50">
      {/* ===================================================
          INDEX
      =================================================== */}

      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-500">
        {index + 1}
      </td>

      {/* LOGO */}
      <td className="px-4">
        <img
  src={brand?.logo ? getImageUrl(brand.logo) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' fill='%23999'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E"}
  alt={brand?.name || "brand"}
  className="w-10 h-10 object-contain rounded"
  onError={(e) => {
    // Prevent infinite loop by removing onError after first failure
    e.currentTarget.onerror = null;
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='1'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' fill='%23999'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  }}
/>
      </td>

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
            openProducts
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

          {extraCount >
            0 && (
            <span className="rounded-full bg-[#7a1c3d]/10 px-3 py-1 text-[11px] font-semibold text-[#7a1c3d]">
              +
              {
                extraCount
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
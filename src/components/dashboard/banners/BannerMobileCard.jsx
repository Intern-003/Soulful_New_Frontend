// FILE: src/components/dashboard/banners/BannerMobileCard.jsx

import React, { memo, useMemo } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  LayoutTemplate,
  MoveVertical,
  Package,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   BANNER MOBILE CARD
   Elite Production Grade

   Props:
   banner
   onEdit(banner)
   onDelete(id)
========================================================== */

const BannerMobileCard = ({
  banner,
  onEdit,
  onDelete,
}) => {
  const image = useMemo(() => {
    return getImageUrl(
      banner?.image
    );
  }, [banner?.image]);

  const isActive = Boolean(
    banner?.status
  );

  const products =
    banner?.products || [];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* IMAGE */}
      <div className="relative">
        <div className="aspect-[16/8] bg-slate-100 overflow-hidden">
          <img
            src={image}
            alt={
              banner?.title ||
              "Banner"
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

        {/* STATUS */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold text-white ${
            isActive
              ? "bg-emerald-500"
              : "bg-slate-500"
          }`}
        >
          {isActive ? (
            <CheckCircle2
              size={13}
            />
          ) : (
            <XCircle
              size={13}
            />
          )}

          {isActive
            ? "Active"
            : "Inactive"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* TITLE */}
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
          {banner?.title ||
            "Untitled Banner"}
        </h3>

        {banner?.subtitle && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {
              banner.subtitle
            }
          </p>
        )}

        {/* META */}
        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <LayoutTemplate
                size={15}
              />
              Layout
            </span>

            <span className="font-medium text-slate-900 capitalize">
              {banner?.layout ||
                "-"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MoveVertical
                size={15}
              />
              Position
            </span>

            <span className="font-medium text-slate-900">
              {banner?.position ??
                "-"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package
                size={15}
              />
              Products
            </span>

            <span className="font-medium text-slate-900">
              {
                products.length
              }
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              onEdit?.(
                banner
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Pencil
              size={16}
            />
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete?.(
                banner.id
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <Trash2
              size={16}
            />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  BannerMobileCard
);
// FILE: src/components/dashboard/banners/BannerCard.jsx

import React, {
  memo,
  useMemo,
} from "react";
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
import BannerLayoutPreview from "./BannerLayoutPreview";

/* ==========================================================
   BANNER CARD
   Elite Production Grade

   Props:
   banner
   onEdit(banner)
   onDelete(id)
========================================================== */

const BannerCard = ({
  banner,
  onEdit,
  onDelete,
}) => {
  const image =
    useMemo(() => {
      return getImageUrl(
        banner?.image
      );
    }, [
      banner?.image,
    ]);

  const isActive =
    Boolean(
      banner?.status
    );

  const products =
    banner?.products ||
    [];

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE */}
      <div className="relative">
        <div className="aspect-[16/6] overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={
              banner?.title ||
              "Banner"
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(
              e
            ) => {
              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />
        </div>

        {/* STATUS */}
        <div className="absolute right-3 top-3">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${
              isActive
                ? "bg-emerald-500"
                : "bg-slate-500"
            }`}
          >
            {isActive ? (
              <CheckCircle2
                size={
                  14
                }
              />
            ) : (
              <XCircle
                size={
                  14
                }
              />
            )}

            {isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* TITLE */}
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
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
        </div>

        {/* META */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Layout
            </p>

            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
              <LayoutTemplate
                size={
                  15
                }
              />
              {banner?.layout ||
                "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Position
            </p>

            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
              <MoveVertical
                size={
                  15
                }
              />
              {banner?.position ??
                "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Products
            </p>

            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
              <Package
                size={
                  15
                }
              />
              {
                products.length
              }{" "}
              linked
            </p>
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Layout Preview
          </p>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <BannerLayoutPreview
              {...banner}
              products={
                products
              }
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              onEdit?.(
                banner
              )
            }
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-semibold text-white transition hover:bg-rose-700"
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
  BannerCard
);
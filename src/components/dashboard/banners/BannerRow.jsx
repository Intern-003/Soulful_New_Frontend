// FILE: src/components/dashboard/banners/BannerRow.jsx

import React, { memo } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE: BannerRow.jsx
   Strict Elite Mode
   Production Grade

   Props:
   banner
   onEdit(banner)
   onDelete(id)
========================================================== */

const BannerRow = ({
  banner,
  onEdit,
  onDelete,
}) => {
  const image =
    getImageUrl(
      banner?.image
    );

  const isActive =
    Boolean(
      banner?.status
    );

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">
      {/* IMAGE */}
      <td className="px-5 py-4">
        <div className="h-14 w-24 overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={image}
            alt={
              banner?.title ||
              "Banner"
            }
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(
              e
            ) => {
              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />
        </div>
      </td>

      {/* TITLE */}
      <td className="px-5 py-4">
        <h3 className="max-w-[240px] truncate text-sm font-semibold text-slate-900">
          {banner?.title ||
            "Untitled Banner"}
        </h3>

        <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500">
          {banner?.subtitle ||
            "—"}
        </p>
      </td>

      {/* LAYOUT */}
      <td className="px-5 py-4">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
          {banner?.layout ||
            "-"}
        </span>
      </td>

      {/* POSITION */}
      <td className="px-5 py-4 text-sm font-medium text-slate-800">
        {banner?.position ??
          "-"}
      </td>

      {/* STATUS */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${
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
      </td>

      {/* ACTIONS */}
      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              onEdit?.(
                banner
              )
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            aria-label="Edit banner"
          >
            <Pencil
              size={15}
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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 text-sm font-medium text-white transition hover:bg-rose-700"
            aria-label="Delete banner"
          >
            <Trash2
              size={15}
            />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default memo(
  BannerRow
);
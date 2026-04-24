import { useMemo } from "react";
import {
  FolderTree,
  Layers3,
  Pencil,
  Trash2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE NAME: CategoryCard.jsx

   CATEGORY CARD
   Excellent Quality / Production Grade

   Props:
   item
   onClick(item)
   onEdit(item)
   onDelete(item)
========================================================== */

const CategoryCard = ({
  item,
  onClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const image =
    useMemo(() => {
      return item?.image
        ? getImageUrl(
            item.image
          )
        : "/no-image.png";
    }, [
      item?.image,
    ]);

  const subCount =
    item?.children
      ?.length || 0;

  const productCount =
    item?.products_count ||
    0;

  const active =
    item?.status ===
      true ||
    item?.status ===
      1 ||
    item?.status ===
      "1";

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE */}
      <div
        onClick={() =>
          onClick(
            item
          )
        }
        className="relative h-44 cursor-pointer overflow-hidden bg-slate-100"
      >
        <img
          src={image}
          alt={
            item?.name
          }
          loading="lazy"
          onError={(
            e
          ) => {
            e.currentTarget.src =
              "/no-image.png";
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {/* Status */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
              active
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            {active ? (
              <CheckCircle2
                size={
                  12
                }
              />
            ) : (
              <XCircle
                size={
                  12
                }
              />
            )}

            {active
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        {/* Position */}
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          #
          {item?.position ??
            "-"}
        </div>

        {/* Name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="truncate text-lg font-bold text-white">
            {
              item?.name
            }
          </h3>

          <p className="mt-1 line-clamp-1 text-xs text-white/80">
            {item?.description ||
              "Manage category structure"}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <MiniStat
            icon={
              <Layers3
                size={
                  15
                }
              />
            }
            label="Subcategories"
            value={
              subCount
            }
          />

          <MiniStat
            icon={
              <Package
                size={
                  15
                }
              />
            }
            label="Products"
            value={
              productCount
            }
          />
        </div>

        {/* Footer */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={() =>
              onClick(
                item
              )
            }
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Open
            <ChevronRight
              size={
                14
              }
            />
          </button>

          <button
            onClick={() =>
              onEdit(
                item
              )
            }
            className="inline-flex items-center justify-center gap-1 rounded-2xl bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            <Pencil
              size={
                14
              }
            />
            Edit
          </button>

          <button
            onClick={() =>
              onDelete(
                item
              )
            }
            className="inline-flex items-center justify-center gap-1 rounded-2xl bg-rose-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
          >
            <Trash2
              size={
                14
              }
            />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;

/* ==========================================================
   MINI STAT
========================================================== */

const MiniStat = ({
  icon,
  label,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}

      <span className="text-[11px] font-semibold uppercase tracking-wide">
        {label}
      </span>
    </div>

    <p className="mt-2 text-xl font-bold text-slate-900">
      {value}
    </p>
  </div>
);
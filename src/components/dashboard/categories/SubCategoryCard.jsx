import {
  Layers3,
  Package,
  Pencil,
  Trash2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  FolderOpen,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE NAME: SubCategoryCard.jsx

   SUBCATEGORY CARD
   Elite Production Grade

   Props:
   item
   onClick(item)
   onEdit(item)
   onDelete(item)

   Expected:
   {
     id,
     name,
     image,
     status,
     position,
     products_count
   }
========================================================== */

const SubCategoryCard = ({
  item,
  onClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const active =
    item?.status ===
      true ||
    item?.status ===
      1 ||
    item?.status ===
      "1";

  const image =
    item?.image
      ? getImageUrl(
          item.image
        )
      : "/no-image.png";

  const products =
    item?.products_count ||
    0;

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
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(
            e
          ) =>
            (e.currentTarget.src =
              "/no-image.png")
          }
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Status */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${
              active
                ? "bg-emerald-500"
                : "bg-rose-500"
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

          <p className="mt-1 text-xs text-white/80">
            Click to manage products
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5">
        {/* STATS */}
        <div className="grid grid-cols-2 gap-3">
          <MiniStat
            icon={
              <Layers3
                size={
                  15
                }
              />
            }
            label="Type"
            value="Sub"
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
              products
            }
          />
        </div>

        {/* ACTIONS */}
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

        {/* FOOT NOTE */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <FolderOpen
            size={
              14
            }
          />
          Opens products listing
        </div>
      </div>
    </div>
  );
};

export default SubCategoryCard;

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
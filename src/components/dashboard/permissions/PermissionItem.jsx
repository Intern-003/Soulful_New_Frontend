// FILE: src/components/dashboard/permissions/PermissionItem.jsx

import React, { memo } from "react";
import {
  Pencil,
  Trash2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* ==========================================================
   PERMISSION ITEM
   Elite Production Grade

   Props:
   perm = { id, module, action }
   onEdit(perm)
   onDelete(id)
========================================================== */

const defaultActions = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
];

const PermissionItem = ({
  perm,
  onEdit,
  onDelete,
}) => {
  const isCustom =
    !defaultActions.includes(
      perm?.action
    );

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* LEFT */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isCustom
                  ? "bg-amber-100"
                  : "bg-violet-100"
              }`}
            >
              {isCustom ? (
                <Sparkles
                  size={16}
                  className="text-slate-800"
                />
              ) : (
                <ShieldCheck
                  size={16}
                  className="text-slate-800"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {perm?.module}
              </p>

              <p className="text-xs text-slate-500">
                Module
              </p>
            </div>
          </div>

          {/* ACTION CHIP */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                isCustom
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {perm?.action}
            </span>

            {isCustom && (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Custom
              </span>
            )}
          </div>

          {/* FULL KEY */}
          <p className="mt-3 text-xs text-slate-400">
            {perm?.module}.
            {perm?.action}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 items-center gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() =>
              onEdit?.(
                perm
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Pencil
              size={15}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete?.(
                perm.id
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50"
          >
            <Trash2
              size={15}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  PermissionItem
);
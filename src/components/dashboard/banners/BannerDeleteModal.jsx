// FILE: src/components/dashboard/banners/BannerDeleteModal.jsx

import React, { memo } from "react";
import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

/* ==========================================================
   FILE: BannerDeleteModal.jsx
   Strict Elite Mode
   Production Grade

   Props:
   open = false
   banner = null
   loading = false

   onClose()
   onConfirm(id)
========================================================== */

const BannerDeleteModal = ({
  open = false,
  banner = null,
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!open) {
    return null;
  }

  const handleClose =
    () => {
      if (
        loading
      ) {
        return;
      }

      onClose?.();
    };

  const handleConfirm =
    () => {
      if (
        loading
      ) {
        return;
      }

      onConfirm?.(
        banner?.id
      );
    };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
              <AlertTriangle
                size={22}
                className="text-rose-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Banner
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading
            }
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X
              size={18}
            />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {banner?.title ||
                "this banner"}
            </span>
            ?
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Linked products and display settings may be affected.
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading
            }
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleConfirm
            }
            disabled={
              loading
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : null}

            {loading
              ? "Deleting..."
              : "Delete Banner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  BannerDeleteModal
); 
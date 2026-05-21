// FILE: src/components/dashboard/brands/DeleteConfirmModal.jsx

import React, {
  memo,
  useEffect,
} from "react";

import {
  Trash2,
  Loader2,
  X,
} from "lucide-react";

/* ==========================================================
   FILE: DeleteConfirmModal.jsx
   Elite Production Grade

   Features:
   ✅ Keyboard escape close
   ✅ Loading state
   ✅ Backdrop click close
   ✅ Responsive
========================================================== */

const DeleteConfirmModal = ({
  open = false,

  title = "Delete Item",

  message = "Are you sure you want to delete this item?",

  loading = false,

  onClose,
  onConfirm,
}) => {
  /* ========================================================
     ESC CLOSE
  ======================================================== */

  useEffect(() => {
    const handleEsc =
      (e) => {
        if (
          e.key ===
          "Escape"
        ) {
          onClose?.();
        }
      };

    if (open) {
      window.addEventListener(
        "keydown",
        handleEsc
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, [
    open,
    onClose,
  ]);

  /* ========================================================
     HIDE
  ======================================================== */

  if (!open)
    return null;

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={
        onClose
      }
    >
      {/* ===================================================
          MODAL
      =================================================== */}

      <div
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(
          e
        ) =>
          e.stopPropagation()
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={
              onClose
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
          >
            <X
              size={16}
            />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="px-6 py-8">
          {/* ICON */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-red-100">
            <Trash2
              size={38}
              className="text-red-500"
            />
          </div>

          {/* TEXT */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              Confirm Deletion
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {message}
            </p>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex gap-3 border-t border-slate-100 p-5">
          {/* CANCEL */}
          <button
            type="button"
            disabled={
              loading
            }
            onClick={
              onClose
            }
            className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/* DELETE */}
          <button
            type="button"
            disabled={
              loading
            }
            onClick={
              onConfirm
            }
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Trash2
                size={16}
              />
            )}

            {loading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(
  DeleteConfirmModal
);
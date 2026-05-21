// FILE: src/components/dashboard/brands/BrandStatusToggle.jsx

import React, {
  memo,
  useState,
} from "react";

import {
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import usePut from "../../../api/hooks/usePut";

/* ==========================================================
   FILE: BrandStatusToggle.jsx
   Elite Production Grade

   Features:
   ✅ Optimistic UI
   ✅ Instant update
   ✅ Error rollback
   ✅ Loading state
========================================================== */

const BrandStatusToggle = ({
  brand,
  onSuccess,
}) => {
  /* ========================================================
     API
  ======================================================== */

  const {
    putData,
  } = usePut();

  /* ========================================================
     STATE
  ======================================================== */

  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const [
    enabled,
    setEnabled,
  ] =
    useState(
      Boolean(
        brand?.status
      )
    );

  /* ========================================================
     TOGGLE
  ======================================================== */

  const handleToggle =
    async () => {
      if (
        loading
      )
        return;

      const previous =
        enabled;

      /* ==============================================
         OPTIMISTIC UI
      ============================================== */

      setEnabled(
        !previous
      );

      setLoading(
        true
      );

      try {
        await putData(
          {
            url: `/admin/brands/${brand?.id}`,

            data: {
              name:
                brand?.name,

              slug:
                brand?.slug,

              status:
                previous
                  ? 0
                  : 1,
            },
          }
        );

        toast.success(
          `Brand ${
            previous
              ? "disabled"
              : "activated"
          }`
        );

        onSuccess?.();
      } catch (
        error
      ) {
        console.error(
          error
        );

        /* ==========================================
           ROLLBACK
        ========================================== */

        setEnabled(
          previous
        );

        toast.error(
          "Failed to update status"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <button
      type="button"
      disabled={
        loading
      }
      onClick={
        handleToggle
      }
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
        enabled
          ? "bg-emerald-500"
          : "bg-slate-300"
      } ${
        loading
          ? "cursor-not-allowed opacity-70"
          : ""
      }`}
    >
      {/* ===================================================
          LOADER
      =================================================== */}

      {loading && (
        <Loader2
          size={12}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 animate-spin text-white"
        />
      )}

      {/* ===================================================
          KNOB
      =================================================== */}

      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-300 ${
          enabled
            ? "translate-x-6"
            : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default memo(
  BrandStatusToggle
);
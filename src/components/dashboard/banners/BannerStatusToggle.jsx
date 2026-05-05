// FILE: src/components/dashboard/banners/BannerStatusToggle.jsx

import React, { memo, useState } from "react";
import { Loader2 } from "lucide-react";

/* ==========================================================
   FILE: BannerStatusToggle.jsx
   Strict Elite Mode
   Production Grade

   Props:
   value = false
   loading = false
   disabled = false

   onChange(nextValue) => Promise | void
========================================================== */

const BannerStatusToggle = ({
  value = false,
  loading = false,
  disabled = false,
  onChange,
}) => {
  const [
    internalLoading,
    setInternalLoading,
  ] = useState(false);

  const busy =
    loading ||
    internalLoading;

  const isActive =
    Boolean(value);

  const handleToggle =
    async () => {
      if (
        busy ||
        disabled
      ) {
        return;
      }

      try {
        setInternalLoading(
          true
        );

        await onChange?.(
          !isActive
        );
      } finally {
        setInternalLoading(
          false
        );
      }
    };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={
        isActive
      }
      aria-label="Toggle banner status"
      disabled={
        busy ||
        disabled
      }
      onClick={
        handleToggle
      }
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 ${
        isActive
          ? "bg-emerald-500"
          : "bg-slate-300"
      } ${
        busy ||
        disabled
          ? "cursor-not-allowed opacity-70"
          : "cursor-pointer"
      }`}
    >
      {/* KNOB */}
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition duration-200 ${
          isActive
            ? "translate-x-7"
            : "translate-x-1"
        }`}
      >
        {busy ? (
          <Loader2
            size={14}
            className="animate-spin text-slate-500"
          />
        ) : null}
      </span>

      {/* LABEL */}
      <span className="sr-only">
        {isActive
          ? "Active"
          : "Inactive"}
      </span>
    </button>
  );
};

export default memo(
  BannerStatusToggle
); 
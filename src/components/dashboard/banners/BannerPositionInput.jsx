// FILE: src/components/dashboard/banners/BannerPositionInput.jsx

import React, {
  memo,
  useEffect,
  useState,
} from "react";
import {
  Minus,
  Plus,
} from "lucide-react";

/* ==========================================================
   FILE: BannerPositionInput.jsx
   Strict Elite Mode
   Production Grade

   Props:
   value = 1
   min = 1
   max = 999
   disabled = false
   loading = false

   onChange(nextValue)
========================================================== */

const clamp = (
  value,
  min,
  max
) =>
  Math.min(
    max,
    Math.max(
      min,
      value
    )
  );

const BannerPositionInput = ({
  value = 1,
  min = 1,
  max = 999,
  disabled = false,
  loading = false,
  onChange,
}) => {
  const [
    localValue,
    setLocalValue,
  ] = useState(
    String(value)
  );

  useEffect(() => {
    setLocalValue(
      String(value)
    );
  }, [value]);

  const isDisabled =
    disabled ||
    loading;

  const emitChange =
    (next) => {
      const parsed =
        Number(next);

      if (
        Number.isNaN(
          parsed
        )
      ) {
        return;
      }

      const finalValue =
        clamp(
          parsed,
          min,
          max
        );

      onChange?.(
        finalValue
      );
    };

  const increase =
    () => {
      emitChange(
        Number(
          localValue ||
            min
        ) + 1
      );
    };

  const decrease =
    () => {
      emitChange(
        Number(
          localValue ||
            min
        ) - 1
      );
    };

  const handleBlur =
    () => {
      const parsed =
        Number(
          localValue
        );

      const finalValue =
        Number.isNaN(
          parsed
        )
          ? min
          : clamp(
              parsed,
              min,
              max
            );

      setLocalValue(
        String(
          finalValue
        )
      );

      onChange?.(
        finalValue
      );
    };

  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* DECREASE */}
      <button
        type="button"
        onClick={
          decrease
        }
        disabled={
          isDisabled
        }
        className="inline-flex h-full w-11 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Decrease position"
      >
        <Minus
          size={16}
        />
      </button>

      {/* INPUT */}
      <input
        type="number"
        min={min}
        max={max}
        value={
          localValue
        }
        disabled={
          isDisabled
        }
        onChange={(
          e
        ) =>
          setLocalValue(
            e.target
              .value
          )
        }
        onBlur={
          handleBlur
        }
        className="h-full w-16 border-x border-slate-200 text-center text-sm font-semibold text-slate-900 outline-none disabled:bg-slate-50"
      />

      {/* INCREASE */}
      <button
        type="button"
        onClick={
          increase
        }
        disabled={
          isDisabled
        }
        className="inline-flex h-full w-11 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Increase position"
      >
        <Plus
          size={16}
        />
      </button>
    </div>
  );
};

export default memo(
  BannerPositionInput
);
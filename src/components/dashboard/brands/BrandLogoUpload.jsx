// FILE: src/components/dashboard/brands/BrandLogoUpload.jsx

import React, {
  memo,
  useRef,
} from "react";

import {
  Upload,
  ImageIcon,
  X,
} from "lucide-react";

/* ==========================================================
   FILE: BrandLogoUpload.jsx
   Elite Production Grade

   Features:
   ✅ Drag feel UI
   ✅ Preview
   ✅ Replace image
   ✅ Remove image
   ✅ Responsive
========================================================== */

const BrandLogoUpload = ({
  preview = null,
  onChange,
  onRemove,
}) => {
  /* ========================================================
     REF
  ======================================================== */

  const inputRef =
    useRef(null);

  /* ========================================================
     OPEN PICKER
  ======================================================== */

  const openPicker =
    () => {
      inputRef.current?.click();
    };

  /* ========================================================
     FILE CHANGE
  ======================================================== */

  const handleFile =
    (e) => {
      const file =
        e.target
          .files?.[0];

      if (!file)
        return;

      onChange?.(
        file
      );
    };

  /* ========================================================
     REMOVE
  ======================================================== */

  const handleRemove =
    () => {
      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }

      onRemove?.();
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div>
      {/* ===================================================
          LABEL
      =================================================== */}

      <label className="mb-3 block text-sm font-semibold text-slate-700">
        Brand Logo
      </label>

      {/* ===================================================
          INPUT
      =================================================== */}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={
          handleFile
        }
      />

      {/* ===================================================
          PREVIEW
      =================================================== */}

      {preview ? (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5">
          {/* REMOVE */}
          <button
            type="button"
            onClick={
              handleRemove
            }
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg transition hover:scale-105"
          >
            <X
              size={18}
            />
          </button>

          {/* IMAGE */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img
                src={
                  preview
                }
                alt="Brand Preview"
                className="h-full w-full object-contain"
              />
            </div>

            {/* ACTION */}
            <button
              type="button"
              onClick={
                openPicker
              }
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Upload
                size={16}
              />

              Replace Logo
            </button>
          </div>
        </div>
      ) : (
        /* ===============================================
            EMPTY STATE
        =============================================== */

        <button
          type="button"
          onClick={
            openPicker
          }
          className="group flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-14 transition hover:border-[#7a1c3d] hover:bg-[#7a1c3d]/5"
        >
          {/* ICON */}
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white shadow-sm transition group-hover:scale-105">
            <ImageIcon
              size={34}
              className="text-[#7a1c3d]"
            />
          </div>

          {/* CONTENT */}
          <h3 className="mt-6 text-base font-semibold text-slate-900">
            Upload Brand Logo
          </h3>

          <p className="mt-2 max-w-sm text-center text-sm leading-6 text-slate-500">
            Drag & drop or browse logo image.
            PNG, JPG, WEBP supported.
          </p>

          {/* BUTTON */}
          <div className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition hover:opacity-90">
            <Upload
              size={16}
            />

            Choose File
          </div>
        </button>
      )}
    </div>
  );
};

export default memo(
  BrandLogoUpload
);
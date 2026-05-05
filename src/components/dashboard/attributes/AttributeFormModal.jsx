// FILE: src/components/dashboard/attributes/AttributeFormModal.jsx

import React, {
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  X,
  Save,
  Layers3,
} from "lucide-react";

/* ==========================================================
   ATTRIBUTE FORM MODAL
   Elite Production Grade

   Props:
   open = false
   mode = "create" | "edit"
   data = { id, name }

   loading = false

   onClose()
   onSubmit(payload)
========================================================== */

const AttributeFormModal = ({
  open = false,
  mode = "create",
  data = null,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const [
    name,
    setName,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const inputRef =
    useRef(null);

  useEffect(() => {
    if (open) {
      setName(
        data?.name ||
          ""
      );

      setError("");

      setTimeout(
        () => {
          inputRef.current?.focus();
        },
        80
      );

      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    open,
    data,
  ]);

  if (!open)
    return null;

  const title =
    mode ===
    "edit"
      ? "Edit Attribute"
      : "Create Attribute";

  const subtitle =
    mode ===
    "edit"
      ? "Update attribute name."
      : "Create a new product attribute.";

  const buttonText =
    loading
      ? mode ===
        "edit"
        ? "Saving..."
        : "Creating..."
      : mode ===
        "edit"
      ? "Save Changes"
      : "Create Attribute";

  const handleSubmit =
    (e) => {
      e.preventDefault();

      const trimmed =
        name.trim();

      if (!trimmed) {
        setError(
          "Attribute name is required."
        );
        return;
      }

      if (
        trimmed.length <
        2
      ) {
        setError(
          "Minimum 2 characters required."
        );
        return;
      }

      setError(
        ""
      );

      onSubmit?.({
        id: data?.id,
        name: trimmed,
      });
    };

  const closeModal =
    () => {
      if (
        loading
      )
        return;

      onClose?.();
    };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      {/* PANEL */}
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
                <Layers3
                  size={
                    22
                  }
                  className="text-slate-800"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                closeModal
              }
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X
                size={
                  18
                }
              />
            </button>
          </div>
        </div>

        {/* BODY */}
        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Attribute Name
              </label>

              <input
                ref={
                  inputRef
                }
                value={
                  name
                }
                onChange={(
                  e
                ) =>
                  setName(
                    e.target
                      .value
                  )
                }
                placeholder="e.g. Color, Size, Material"
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
              />

              {error && (
                <p className="mt-2 text-sm font-medium text-rose-600">
                  {error}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Tip: Keep names short and reusable across products.
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                closeModal
              }
              disabled={
                loading
              }
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition hover:bg-[#651732] disabled:opacity-60"
            >
              <Save
                size={
                  16
                }
              />

              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(
  AttributeFormModal
);
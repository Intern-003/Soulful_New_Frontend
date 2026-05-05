// FILE: src/components/dashboard/permissions/PermissionModal.jsx

import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  X,
  Save,
  ShieldCheck,
} from "lucide-react";

/* ==========================================================
   PERMISSION MODAL
   Elite Production Grade

   Props:
   open = false
   data = { id, module, action }
   loading = false

   onClose()
   onSubmit(payload)
========================================================== */

const DEFAULT_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
];

const PermissionModal = ({
  open = false,
  data = null,
  loading = false,
  onClose,
  onSubmit,
}) => {
  const inputRef =
    useRef(null);

  const [
    form,
    setForm,
  ] = useState({
    module: "",
    action: "view",
    customAction: "",
  });

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (!open)
      return;

    const isDefault =
      DEFAULT_ACTIONS.includes(
        data?.action
      );

    setForm({
      module:
        data?.module ||
        "",
      action:
        isDefault
          ? data?.action
          : "custom",
      customAction:
        isDefault
          ? ""
          : data?.action ||
            "",
    });

    setError("");

    setTimeout(
      () => {
        inputRef.current?.focus();
      },
      80
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open, data]);

  const finalAction =
    useMemo(() => {
      return form.action ===
        "custom"
        ? form.customAction
        : form.action;
    }, [form]);

  const closeModal =
    () => {
      if (
        loading
      )
        return;

      onClose?.();
    };

  const handleSubmit =
    async (
      e
    ) => {
      e.preventDefault();

      const module =
        form.module.trim().toLowerCase();

      const action =
        finalAction.trim().toLowerCase();

      if (!module) {
        setError(
          "Module is required."
        );
        return;
      }

      if (!action) {
        setError(
          "Action is required."
        );
        return;
      }

      setError("");

      onSubmit?.({
        id: data?.id,
        module,
        action,
      });
    };

  if (!open)
    return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
                <ShieldCheck
                  size={22}
                  className="text-slate-800"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Edit Permission
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update module and action rule.
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
                size={18}
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
            {/* MODULE */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Module
              </label>

              <input
                ref={
                  inputRef
                }
                value={
                  form.module
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,
                      module:
                        e
                          .target
                          .value,
                    })
                  )
                }
                placeholder="e.g. products"
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
              />
            </div>

            {/* ACTION */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Action
              </label>

              <select
                value={
                  form.action
                }
                onChange={(
                  e
                ) =>
                  setForm(
                    (
                      prev
                    ) => ({
                      ...prev,
                      action:
                        e
                          .target
                          .value,
                      customAction:
                        "",
                    })
                  )
                }
                className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
              >
                {DEFAULT_ACTIONS.map(
                  (
                    item
                  ) => (
                    <option
                      key={
                        item
                      }
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}

                <option value="custom">
                  Custom Action
                </option>
              </select>
            </div>

            {/* CUSTOM */}
            {form.action ===
              "custom" && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Custom Action
                </label>

                <input
                  value={
                    form.customAction
                  }
                  onChange={(
                    e
                  ) =>
                    setForm(
                      (
                        prev
                      ) => ({
                        ...prev,
                        customAction:
                          e
                            .target
                            .value,
                      })
                    )
                  }
                  placeholder="e.g. export"
                  className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
                />
              </div>
            )}

            {/* ERROR */}
            {error && (
              <p className="text-sm font-medium text-rose-600">
                {error}
              </p>
            )}

            {/* PREVIEW */}
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Preview:{" "}
              <span className="font-semibold text-slate-900">
                {(form.module ||
                  "module")
                  .toLowerCase()}
                .
                {(finalAction ||
                  "action")
                  .toLowerCase()}
              </span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={
                loading
              }
              onClick={
                closeModal
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
                size={16}
              />
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(
  PermissionModal
);
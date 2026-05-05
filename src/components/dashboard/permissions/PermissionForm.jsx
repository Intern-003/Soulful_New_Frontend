// FILE: src/components/dashboard/permissions/PermissionForm.jsx

import React, {
  memo,
  useMemo,
  useState,
} from "react";
import {
  Plus,
  ShieldPlus,
} from "lucide-react";

/* ==========================================================
   PERMISSION FORM
   Elite Production Grade

   Props:
   onSubmit(payload)
   loading = false
========================================================== */

const DEFAULT_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
];

const PermissionForm = ({
  onSubmit,
  loading = false,
}) => {
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

  const finalAction =
    useMemo(() => {
      return form.action ===
        "custom"
        ? form.customAction
        : form.action;
    }, [form]);

  const handleChange =
    (key, value) => {
      setForm(
        (
          prev
        ) => ({
          ...prev,
          [key]:
            value,
        })
      );
    };

  const resetForm =
    () => {
      setForm({
        module: "",
        action: "view",
        customAction:
          "",
      });

      setError(
        ""
      );
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

      const success =
        await onSubmit?.({
          module,
          action,
        });

      if (
        success
      ) {
        resetForm();
      }
    };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
          <ShieldPlus
            size={22}
            className="text-slate-800"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Create Permission
          </h3>
          <p className="text-sm text-slate-500">
            Add a new module action rule.
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={
          handleSubmit
        }
        className="grid grid-cols-1 gap-4 xl:grid-cols-4"
      >
        {/* MODULE */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Module
          </label>

          <input
            value={
              form.module
            }
            onChange={(
              e
            ) =>
              handleChange(
                "module",
                e.target
                  .value
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
                    e.target
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
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Custom Action
          </label>

          <input
            disabled={
              form.action !==
              "custom"
            }
            value={
              form.customAction
            }
            onChange={(
              e
            ) =>
              handleChange(
                "customAction",
                e.target
                  .value
              )
            }
            placeholder="e.g. export"
            className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-[#7a1c3d] focus:ring-4 focus:ring-[#7a1c3d]/10"
          />
        </div>

        {/* BUTTON */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={
              loading
            }
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition hover:bg-[#651732] disabled:opacity-60"
          >
            <Plus
              size={16}
            />
            {loading
              ? "Creating..."
              : "Add Permission"}
          </button>
        </div>
      </form>

      {/* ERROR */}
      {error && (
        <p className="mt-4 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      {/* PREVIEW */}
      <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
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
    </section>
  );
};

export default memo(
  PermissionForm
);
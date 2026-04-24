import { useEffect, useMemo, useState } from "react";
import {
  X,
  ShieldCheck,
  Loader2,
  Save,
} from "lucide-react";

import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";

import PermissionSelectorElite from "./PermissionSelectorElite";

/* ==========================================================
   FILE NAME: RoleFormModal.jsx

   ROLE FORM MODAL
   Elite Production Grade

   Props:
   open = false
   data = null
   onClose()
   onSuccess()

   Create:
   POST /admin/roles

   Update:
   PUT /admin/roles/:id
========================================================== */

const RoleFormModal = ({
  open = false,
  data = null,
  onClose = () => {},
  onSuccess = () => {},
}) => {
  const { postData } =
    usePost();

  const { putData } =
    usePut();

  const [name, setName] =
    useState("");

  const [
    selectedPermissions,
    setSelectedPermissions,
  ] = useState([]);

  const [
    errors,
    setErrors,
  ] = useState(
    {}
  );

  const [
    loading,
    setLoading,
  ] = useState(
    false
  );

  const isEdit =
    !!data;

  /* ==========================================
     PREFILL
  ========================================== */
  useEffect(() => {
    if (open) {
      setName(
        data?.name ||
          ""
      );

      setSelectedPermissions(
        data?.permissions?.map(
          (
            item
          ) =>
            item.id
        ) || []
      );

      setErrors(
        {}
      );
    }
  }, [
    open,
    data,
  ]);

  /* ==========================================
     VALIDATION
  ========================================== */
  const validate =
    () => {
      const newErrors =
        {};

      if (
        !name.trim()
      ) {
        newErrors.name =
          "Role name is required.";
      }

      if (
        selectedPermissions.length ===
        0
      ) {
        newErrors.permissions =
          "Select at least one permission.";
      }

      setErrors(
        newErrors
      );

      return (
        Object.keys(
          newErrors
        ).length ===
        0
      );
    };

  /* ==========================================
     SUBMIT
  ========================================== */
  const handleSubmit =
    async (
      e
    ) => {
      e.preventDefault();

      if (
        !validate()
      )
        return;

      try {
        setLoading(
          true
        );

        const payload =
          {
            name:
              name.trim(),
            permission_ids:
              selectedPermissions,
          };

        if (
          isEdit
        ) {
          await putData(
            {
              url: `/admin/roles/${data.id}`,
              data: payload,
            }
          );
        } else {
          await postData(
            {
              url: "/admin/roles",
              data: payload,
            }
          );
        }

        await onSuccess();
        onClose();
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  if (!open)
    return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        onClick={
          onClose
        }
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#7b183f] to-[#a52355] px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <ShieldCheck
                  size={
                    28
                  }
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {isEdit
                    ? "Edit Role"
                    : "Create New Role"}
                </h2>

                <p className="mt-1 text-sm text-white/80">
                  Configure role name and assign permissions.
                </p>
              </div>
            </div>

            <button
              onClick={
                onClose
              }
              className="rounded-xl p-2 transition hover:bg-white/10"
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
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* ROLE NAME */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role Name
              </label>

              <input
                type="text"
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
                placeholder="e.g. Support Manager"
                className={`h-12 w-full rounded-2xl border bg-slate-50 px-4 text-sm outline-none transition focus:bg-white focus:ring-4 ${
                  errors.name
                    ? "border-rose-300 focus:ring-rose-100"
                    : "border-slate-200 focus:border-[#7b183f] focus:ring-[#7b183f]/10"
                }`}
              />

              {errors.name && (
                <p className="mt-2 text-xs font-medium text-rose-600">
                  {
                    errors.name
                  }
                </p>
              )}
            </div>

            {/* PERMISSIONS */}
            <div>
              <PermissionSelectorElite
                selected={
                  selectedPermissions
                }
                onChange={
                  setSelectedPermissions
                }
              />

              {errors.permissions && (
                <p className="mt-3 text-xs font-medium text-rose-600">
                  {
                    errors.permissions
                  }
                </p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-slate-100 bg-white px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                Selected Permissions:{" "}
                <span className="font-semibold text-slate-900">
                  {
                    selectedPermissions.length
                  }
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={
                    onClose
                  }
                  className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2
                      size={
                        16
                      }
                      className="animate-spin"
                    />
                  ) : (
                    <Save
                      size={
                        16
                      }
                    />
                  )}

                  {isEdit
                    ? "Update Role"
                    : "Create Role"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormModal;
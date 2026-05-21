// FILE: src/components/dashboard/brands/BrandFormModal.jsx

import React, {
  memo,
  useEffect,
  useState,
} from "react";

import {
  X,
  Save,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";

import { getImageUrl } from "../../../utils/getImageUrl";

import BrandLogoUpload from "./BrandLogoUpload";
import BrandSubcategorySelector from "./BrandSubcategorySelector";

/* ==========================================================
   FILE: BrandFormModal.jsx
   Elite Production Grade
========================================================== */

const BrandFormModal = ({
  open = false,
  onClose,
  editData = null,
  refresh,
}) => {
  /* ========================================================
     EDIT MODE
  ======================================================== */

  const isEdit =
    Boolean(
      editData?.id
    );

  /* ========================================================
     API
  ======================================================== */

  const {
    postData,
    loading:
      postLoading,
  } = usePost();

  const {
    putData,
    loading:
      putLoading,
  } = usePut();

  const {
    data: categoriesData,
  } = useGet(
    "/categories"
  );

  /* ========================================================
     SUBCATEGORIES
  ======================================================== */

  const subcategories =
    categoriesData?.data?.flatMap(
      (
        category
      ) =>
        category.children ||
        []
    ) || [];

  /* ========================================================
     LOADING
  ======================================================== */

  const loading =
    postLoading ||
    putLoading;

  /* ========================================================
     FORM STATE
  ======================================================== */

  const [
    form,
    setForm,
  ] =
    useState({
      name: "",
      slug: "",
      logo: null,
      status: true,
      subcategory_ids:
        [],
    });

  const [
    preview,
    setPreview,
  ] =
    useState(
      null
    );

  /* ========================================================
     EDIT LOAD
  ======================================================== */

  useEffect(() => {
    if (
      open &&
      editData
    ) {
      setForm({
        name:
          editData?.name ||
          "",

        slug:
          editData?.slug ||
          "",

        logo:
          null,

        status:
          Boolean(
            editData?.status
          ),

        subcategory_ids:
          editData?.subcategories?.map(
            (
              item
            ) =>
              item.id
          ) || [],
      });

      setPreview(
        getImageUrl(
          editData?.logo
        )
      );
    }

    /* ==========================================
       CREATE RESET
    ========================================== */

    if (
      open &&
      !editData
    ) {
      setForm({
        name: "",
        slug: "",
        logo: null,
        status: true,
        subcategory_ids:
          [],
      });

      setPreview(
        null
      );
    }
  }, [
    open,
    editData,
  ]);

  /* ========================================================
     SET VALUE
  ======================================================== */

  const setValue = (
    key,
    value
  ) => {
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

  /* ========================================================
     IMAGE
  ======================================================== */

  const handleImage =
    (
      file
    ) => {
      if (!file)
        return;

      setValue(
        "logo",
        file
      );

      setPreview(
        URL.createObjectURL(
          file
        )
      );
    };

  /* ========================================================
     SUBMIT
  ======================================================== */

  const handleSubmit =
    async (
      e
    ) => {
      e.preventDefault();

      if (
        !form.name.trim()
      ) {
        toast.error(
          "Brand name required"
        );

        return;
      }

      try {
        const payload =
          new FormData();

        payload.append(
          "name",
          form.name
        );

        payload.append(
          "slug",
          form.slug
        );

        payload.append(
          "status",
          form.status
            ? 1
            : 0
        );

        /* ======================================
           LOGO
        ====================================== */

        if (
          form.logo
        ) {
          payload.append(
            "logo",
            form.logo
          );
        }

        /* ======================================
           SUBCATEGORIES
        ====================================== */

        form.subcategory_ids.forEach(
          (
            id,
            index
          ) => {
            payload.append(
              `subcategory_ids[${index}]`,
              id
            );
          }
        );

        /* ======================================
           UPDATE
        ====================================== */

        if (
          isEdit
        ) {
          await putData(
            {
              url: `/admin/brands/${editData.id}`,
              data: payload,
            }
          );

          toast.success(
            "Brand updated successfully"
          );
        }

        /* ======================================
           CREATE
        ====================================== */

        else {
          await postData(
            {
              url: "/admin/brands",
              data: payload,
            }
          );

          toast.success(
            "Brand created successfully"
          );
        }

        refresh?.();

        onClose?.();
      } catch (
        error
      ) {
        console.error(
          error
        );

        toast.error(
          "Failed to save brand"
        );
      }
    };

  /* ========================================================
     HIDE
  ======================================================== */

  if (!open)
    return null;

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEdit
                  ? "Edit Brand"
                  : "Create Brand"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your product brands
              </p>
            </div>

            <button
              onClick={
                onClose
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 transition hover:bg-slate-50"
            >
              <X
                size={18}
              />
            </button>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-6 p-6"
          >
            {/* ===============================================
                NAME + SLUG
            =============================================== */}

            <div className="grid gap-5 md:grid-cols-2">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Brand Name
                </label>

                <input
                  type="text"
                  value={
                    form.name
                  }
                  onChange={(
                    e
                  ) =>
                    setValue(
                      "name",
                      e.target
                        .value
                    )
                  }
                  placeholder="Enter brand name"
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d]"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Slug
                </label>

                <input
                  type="text"
                  value={
                    form.slug
                  }
                  onChange={(
                    e
                  ) =>
                    setValue(
                      "slug",
                      e.target
                        .value
                    )
                  }
                  placeholder="brand-slug"
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#7a1c3d]"
                />
              </div>
            </div>

            {/* ===============================================
                LOGO
            =============================================== */}

            <BrandLogoUpload
              preview={
                preview
              }
              onChange={
                handleImage
              }
            />

            {/* ===============================================
                SUBCATEGORIES
            =============================================== */}

            <BrandSubcategorySelector
              subcategories={
                subcategories
              }
              selected={
                form.subcategory_ids
              }
              onChange={(
                ids
              ) =>
                setValue(
                  "subcategory_ids",
                  ids
                )
              }
            />

            {/* ===============================================
                STATUS
            =============================================== */}

            <div className="flex items-center gap-3">
              <input
                id="status"
                type="checkbox"
                checked={
                  form.status
                }
                onChange={(
                  e
                ) =>
                  setValue(
                    "status",
                    e.target
                      .checked
                  )
                }
                className="h-5 w-5 rounded border-slate-300"
              />

              <label
                htmlFor="status"
                className="text-sm font-medium text-slate-700"
              >
                Active Brand
              </label>
            </div>

            {/* ===============================================
                FOOTER
            =============================================== */}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={
                  onClose
                }
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Save
                    size={18}
                  />
                )}

                {isEdit
                  ? "Update Brand"
                  : "Create Brand"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(
  BrandFormModal
);
import {
  useEffect,
  useState,
} from "react";
import {
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Loader2,
  FolderTree,
} from "lucide-react";

import toast from "react-hot-toast";

import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   FILE NAME: CategoryFormModal.jsx

   CATEGORY FORM MODAL
   Excellent Quality / Production Grade

   Props:
   open = false
   data = null
   onClose()
   onSuccess()

   APIs:
   POST /admin/categories
   PUT  /admin/categories/:id

   POST /admin/subcategories
   PUT  /admin/subcategories/:id
========================================================== */

const CategoryFormModal = ({
  open = false,
  data = null,
  onClose = () => {},
  onSuccess = () => {},
}) => {
  const { postData } =
    usePost();

  const { putData } =
    usePut();

  const isEdit =
    !!data?.id;

  const [
    loading,
    setLoading,
  ] = useState(
    false
  );

  const [
    preview,
    setPreview,
  ] = useState(
    null
  );

  const [
    file,
    setFile,
  ] = useState(
    null
  );

  const [
    errors,
    setErrors,
  ] = useState(
    {}
  );

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    description:
      "",
    parent_id:
      "",
  });

  /* ==========================================
     PREFILL
  ========================================== */
  useEffect(() => {
    if (
      open
    ) {
      setForm({
        name:
          data?.name ||
          "",
        description:
          data?.description ||
          "",
        parent_id:
          data?.parent_id ||
          "",
      });

      setPreview(
        data?.image
          ? getImageUrl(
              data.image
            )
          : null
      );

      setFile(
        null
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
     HANDLERS
  ========================================== */
  const handleChange =
    (e) => {
      setForm({
        ...form,
        [
          e.target
            .name
        ]:
          e.target
            .value,
      });
    };

  const handleFile =
    (e) => {
      const selected =
        e.target
          .files?.[0];

      if (
        !selected
      )
        return;

      setFile(
        selected
      );

      setPreview(
        URL.createObjectURL(
          selected
        )
      );
    };

  /* ==========================================
     VALIDATE
  ========================================== */
  const validate =
    () => {
      const next =
        {};

      if (
        !form.name.trim()
      ) {
        next.name =
          "Category name is required.";
      }

      setErrors(
        next
      );

      return (
        Object.keys(
          next
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
          new FormData();

        payload.append(
          "name",
          form.name.trim()
        );

        payload.append(
          "description",
          form.description
        );

        if (
          form.parent_id
        ) {
          payload.append(
            "parent_id",
            form.parent_id
          );
        }

        if (
          file
        ) {
          payload.append(
            "image",
            file
          );
        }

        if (
          isEdit
        ) {
          await putData(
            {
              url:
                form.parent_id
                  ? `/admin/subcategories/${data.id}`
                  : `/admin/categories/${data.id}`,
              data: payload,
            }
          );

          toast.success(
            "Updated successfully"
          );
        } else {
          await postData(
            {
              url:
                form.parent_id
                  ? "/admin/subcategories"
                  : "/admin/categories",
              data: payload,
            }
          );

          toast.success(
            "Created successfully"
          );
        }

        await onSuccess();
        onClose();
      } catch (
        error
      ) {
        console.error(
          error
        );

        toast.error(
          error
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  if (!open)
    return null;

  const isSub =
    !!form.parent_id;

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
      <div className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#7b183f] to-[#a52355] px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <FolderTree
                  size={
                    28
                  }
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {isEdit
                    ? `Edit ${
                        isSub
                          ? "Subcategory"
                          : "Category"
                      }`
                    : `Create ${
                        isSub
                          ? "Subcategory"
                          : "Category"
                      }`}
                </h2>

                <p className="mt-1 text-sm text-white/80">
                  Manage names, images and descriptions.
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter category name"
                className={`h-12 w-full rounded-2xl border bg-slate-50 px-4 text-sm outline-none transition ${
                  errors.name
                    ? "border-rose-300"
                    : "border-slate-200 focus:border-[#7b183f]"
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

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </label>

              <textarea
                rows={
                  4
                }
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Write description..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#7b183f]"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Image
              </label>

              <label className="flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-[#7b183f] hover:bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleFile
                  }
                  className="hidden"
                />

                <div>
                  <Upload
                    size={
                      28
                    }
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Click to upload image
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG, WEBP
                  </p>
                </div>
              </label>

              {preview && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={
                      preview
                    }
                    alt="Preview"
                    className="h-52 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-slate-100 bg-white px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {isSub
                  ? "Subcategory will be attached to selected parent."
                  : "Main category will appear in catalog."}
              </p>

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
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
// FILE: src/components/dashboard/banners/BannerFormModal.jsx

import React, {
  memo,
  useEffect,
  useMemo,
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

import BannerPreview from "./BannerPreview";
import ProductSelector from "./ProductSelector";

/* ==========================================================
   FIXED VERSION
   Main Issue Solved:
   Existing selected products not loading in edit mode
========================================================== */

const layouts = [
  "hero",
  "grid",
  "products",
  "split",
  "slider",
];

const getProducts = (
  banner
) => {
  if (
    Array.isArray(
      banner?.products
    )
  )
    return banner.products;

  if (
    Array.isArray(
      banner?.products
        ?.data
    )
  )
    return banner.products.data;

  if (
    Array.isArray(
      banner?.banner_products
    )
  )
    return banner.banner_products;

  return [];
};

const BannerFormModal = ({
  open = false,
  editData = null,
  onClose,
  onSuccess,
}) => {
  const isEdit =
    Boolean(
      editData?.id
    );

  const {
    postData,
    loading: postLoading,
  } = usePost();

  const {
    putData,
    loading: putLoading,
  } = usePut();

  const loading =
    postLoading ||
    putLoading;

  const initialForm =
    {
      title: "",
      subtitle: "",
      layout: "hero",
      position: 1,
      status: true,
      button_text: "",
      button_link: "",
      image: null,
      products: [],
    };

  const [
    form,
    setForm,
  ] =
    useState(
      initialForm
    );

  /* ========================================================
     EDIT DATA LOAD FIXED
  ======================================================== */

  useEffect(() => {
    if (!open)
      return;

    if (
      isEdit &&
      editData
    ) {
      setForm({
        title:
          editData?.title ||
          "",
        subtitle:
          editData?.subtitle ||
          "",
        layout:
          editData?.layout ||
          "hero",
        position:
          Number(
            editData?.position
          ) || 1,
        status:
          Boolean(
            editData?.status
          ),
        button_text:
          editData?.button_text ||
          "",
        button_link:
          editData?.button_link ||
          "",
        image:
          editData?.image ||
          null,

        // 🔥 FIXED
        products:
          getProducts(
            editData
          ),
      });
    } else {
      setForm(
        initialForm
      );
    }
  }, [
    open,
    isEdit,
    editData,
  ]);

  const previewValues =
    useMemo(
      () => form,
      [form]
    );

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
     SUBMIT
  ======================================================== */

  const handleSubmit =
    async (
      e
    ) => {
      e.preventDefault();

      if (
        !form.title.trim()
      ) {
        toast.error(
          "Title required"
        );
        return;
      }

      try {
        const payload =
          new FormData();

        payload.append(
          "title",
          form.title
        );
        payload.append(
          "subtitle",
          form.subtitle
        );
        payload.append(
          "layout",
          form.layout
        );
        payload.append(
          "position",
          form.position
        );
        payload.append(
          "status",
          form.status
            ? 1
            : 0
        );
        payload.append(
          "button_text",
          form.button_text
        );
        payload.append(
          "button_link",
          form.button_link
        );

        if (
          form.image instanceof
          File
        ) {
          payload.append(
            "image",
            form.image
          );
        }

        form.products.forEach(
          (
            item,
            index
          ) => {
            payload.append(
              `products[${index}]`,
              item.id ||
                item
            );
          }
        );

        if (
          isEdit
        ) {
          await putData(
            {
              url: `/admin/banners/${editData.id}`,
              data: payload,
            }
          );

          toast.success(
            "Banner updated"
          );
        } else {
          await postData(
            {
              url: "/admin/banners",
              data: payload,
            }
          );

          toast.success(
            "Banner created"
          );
        }

        onSuccess?.();
      } catch {
        toast.error(
          "Failed to save banner"
        );
      }
    };

  if (!open)
    return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto w-full max-w-7xl rounded-3xl bg-white shadow-2xl">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold">
                {isEdit
                  ? "Edit Banner"
                  : "Create Banner"}
              </h2>

              <p className="text-sm text-slate-500">
                Manage banners
              </p>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-xl p-2 hover:bg-slate-100"
            >
              <X
                size={18}
              />
            </button>
          </div>

          {/* BODY */}
          <form
            onSubmit={
              handleSubmit
            }
            className="grid gap-6 p-6 lg:grid-cols-2"
          >
            <div className="space-y-5">
              <input
                value={
                  form.title
                }
                onChange={(
                  e
                ) =>
                  setValue(
                    "title",
                    e.target
                      .value
                  )
                }
                placeholder="Title"
                className="h-11 w-full rounded-2xl border px-4"
              />

              <textarea
                rows="3"
                value={
                  form.subtitle
                }
                onChange={(
                  e
                ) =>
                  setValue(
                    "subtitle",
                    e.target
                      .value
                  )
                }
                placeholder="Subtitle"
                className="w-full rounded-2xl border px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={
                    form.layout
                  }
                  onChange={(
                    e
                  ) =>
                    setValue(
                      "layout",
                      e.target
                        .value
                    )
                  }
                  className="h-11 rounded-2xl border px-4"
                >
                  {layouts.map(
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
                </select>

                <input
                  type="number"
                  min="1"
                  value={
                    form.position
                  }
                  onChange={(
                    e
                  ) =>
                    setValue(
                      "position",
                      e.target
                        .value
                    )
                  }
                  className="h-11 rounded-2xl border px-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  value={
                    form.button_text
                  }
                  onChange={(
                    e
                  ) =>
                    setValue(
                      "button_text",
                      e.target
                        .value
                    )
                  }
                  placeholder="Button text"
                  className="h-11 rounded-2xl border px-4"
                />

                <input
                  value={
                    form.button_link
                  }
                  onChange={(
                    e
                  ) =>
                    setValue(
                      "button_link",
                      e.target
                        .value
                    )
                  }
                  placeholder="Button link"
                  className="h-11 rounded-2xl border px-4"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(
                  e
                ) =>
                  setValue(
                    "image",
                    e.target
                      .files?.[0] ||
                      null
                  )
                }
              />

              <label className="flex gap-2 text-sm">
                <input
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
                />
                Active Banner
              </label>

              {/* 🔥 FIXED PRODUCT LOAD */}
              <ProductSelector
                selectedProducts={
                  form.products
                }
                onChange={(
                  items
                ) =>
                  setValue(
                    "products",
                    items
                  )
                }
              />
            </div>

            <div>
              <BannerPreview
                values={
                  previewValues
                }
              />
            </div>

            {/* FOOTER */}
            <div className="lg:col-span-2 flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={
                  onClose
                }
                className="h-11 rounded-2xl border px-5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-white"
              >
                {loading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save
                    size={16}
                  />
                )}

                {isEdit
                  ? "Update Banner"
                  : "Create Banner"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(
  BannerFormModal
);
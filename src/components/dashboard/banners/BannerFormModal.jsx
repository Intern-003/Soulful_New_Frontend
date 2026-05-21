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
  Calendar,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";

import BannerPreview from "./BannerPreview";
import ProductSelector from "./ProductSelector";

const layouts = [
  "hero",
  "grid",
  "products",
  "split",
  "slider",
];

// FIXED: Better product extraction with complete data
const getProducts = (banner) => {
  // Direct products array
  if (Array.isArray(banner?.products)) {
    return banner.products.map(product => ({
      ...product,
      // Ensure images array is preserved
      images: product.images || []
    }));
  }

  // Nested products.data structure
  if (Array.isArray(banner?.products?.data)) {
    return banner.products.data.map(product => ({
      ...product,
      images: product.images || []
    }));
  }

  // Banner products relation
  if (Array.isArray(banner?.banner_products)) {
    return banner.banner_products.map(bp => ({
      ...bp.product,
      images: bp.product?.images || []
    }));
  }

  return [];
};

const BannerFormModal = ({
  open = false,
  editData = null,
  onClose,
  onSuccess,
}) => {
  const isEdit = Boolean(editData?.id);

  const { postData, loading: postLoading } = usePost();
  const { putData, loading: putLoading } = usePut();
  const loading = postLoading || putLoading;

  const initialForm = {
    title: "",
    subtitle: "",
    description: "",
    layout: "hero",
    position: 1,
    status: true,
    button_text: "",
    button_link: "",
    start_date: "",
    end_date: "",
    image: null,
    products: [],
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) return;

    if (isEdit && editData) {
      // Format date properly for input[type="date"]
      const formatDate = (dateString) => {
        if (!dateString) return "";
        // If it already has time component, take just the date part
        if (dateString.includes(' ')) {
          return dateString.split(' ')[0];
        }
        // If it includes T (ISO format), take the date part
        if (dateString.includes('T')) {
          return dateString.split('T')[0];
        }
        return dateString;
      };

      setForm({
        title: editData?.title || "",
        subtitle: editData?.subtitle || "",
        description: editData?.description || "",
        layout: editData?.layout || "hero",
        position: Number(editData?.position) || 1,
        status: Boolean(editData?.status),
        button_text: editData?.button_text || "",
        button_link: editData?.button_link || "",
        start_date: formatDate(editData?.start_date),
        end_date: formatDate(editData?.end_date),
        image: editData?.image || null,
        products: editData?.products || [],
      });
    } else {
      setForm(initialForm);
    }
  }, [open, isEdit, editData]);

  const previewValues = useMemo(() => form, [form]);

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title required");
      return;
    }



    try {
      const payload = new FormData();

      payload.append("title", form.title);
      payload.append("subtitle", form.subtitle);
      payload.append("description", form.description);
      payload.append("layout", form.layout);
      payload.append("position", form.position);
      payload.append("status", form.status ? 1 : 0);
      payload.append("button_text", form.button_text);
      payload.append("button_link", form.button_link);

      if (form.start_date) payload.append("start_date", form.start_date);
      if (form.end_date) payload.append("end_date", form.end_date);

      if (form.image instanceof File) {
        payload.append("image", form.image);
      }

      // Send product_ids (not products)
      const productIds = form.products.map(item => item.id || item);


      productIds.forEach((id, index) => {
        payload.append(`product_ids[${index}]`, id);
      });

      if (isEdit) {
        await putData({
          url: `/admin/banners/${editData.id}`,
          data: payload,
        });
        toast.success("Banner updated");
      } else {
        await postData({
          url: "/admin/banners",
          data: payload,
        });
        toast.success("Banner created");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save banner");
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto w-full max-w-7xl rounded-3xl bg-white shadow-2xl">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold">
                {isEdit ? "Edit Banner" : "Create Banner"}
              </h2>
              <p className="text-sm text-slate-500">Manage banners</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* BODY */}
          <form onSubmit={handleSubmit} className="grid gap-6 p-6 lg:grid-cols-2">
            <div className="space-y-5">
              {/* Title */}
              <input
                value={form.title}
                onChange={(e) => setValue("title", e.target.value)}
                placeholder="Title *"
                className="h-11 w-full rounded-2xl border px-4"
              />

              {/* Subtitle */}
              <textarea
                rows="2"
                value={form.subtitle}
                onChange={(e) => setValue("subtitle", e.target.value)}
                placeholder="Subtitle"
                className="w-full rounded-2xl border px-4 py-3"
              />

              {/* Description */}
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setValue("description", e.target.value)}
                  placeholder="Description"
                  className="w-full rounded-2xl border pl-10 pr-4 py-3"
                />
              </div>

              {/* Layout & Position */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.layout}
                  onChange={(e) => setValue("layout", e.target.value)}
                  className="h-11 rounded-2xl border px-4"
                >
                  {layouts.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={form.position}
                  onChange={(e) => setValue("position", e.target.value)}
                  placeholder="Position"
                  className="h-11 rounded-2xl border px-4"
                />
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setValue("start_date", e.target.value)}
                    className="h-11 w-full rounded-2xl border pl-10 pr-4"
                  />
                  <span className="absolute left-10 top-1 text-xs text-gray-400 pointer-events-none">
                    Start Date
                  </span>
                </div>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setValue("end_date", e.target.value)}
                    className="h-11 w-full rounded-2xl border pl-10 pr-4"
                  />
                  <span className="absolute left-10 top-1 text-xs text-gray-400 pointer-events-none">
                    End Date
                  </span>
                </div>
              </div>

              {/* Button Text & Link */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={form.button_text}
                  onChange={(e) => setValue("button_text", e.target.value)}
                  placeholder="Button text"
                  className="h-11 rounded-2xl border px-4"
                />
                <input
                  value={form.button_link}
                  onChange={(e) => setValue("button_link", e.target.value)}
                  placeholder="Button link (URL)"
                  className="h-11 rounded-2xl border px-4"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setValue("image", e.target.files?.[0] || null)}
                  className="w-full"
                />
                <p className="text-xs text-gray-400">Recommended: 1920x600px. Max 4MB</p>
              </div>

              {/* Status */}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) => setValue("status", e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Active Banner</span>
              </label>

              {/* Product Selector */}
              <ProductSelector
                selectedProducts={form.products}
                onChange={(items) => setValue("products", items)}
              />
            </div>

            {/* Preview */}
            <div>
              <BannerPreview values={previewValues} />
            </div>

            {/* FOOTER */}
            <div className="lg:col-span-2 flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-2xl border px-5 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 text-white hover:bg-[#5e1530] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isEdit ? "Update Banner" : "Create Banner"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(BannerFormModal);
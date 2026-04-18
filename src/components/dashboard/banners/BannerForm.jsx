import { useEffect, useState, useCallback, useMemo } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";
import ProductSelector from "./products/ProductSelector";
import BannerLayoutPreview from "./BannerLayoutPreview";
import { getImageUrl } from "../../../utils/getImageUrl";

const BannerForm = ({ editData, onClose, onSuccess }) => {
  const isEdit = !!editData?.id;
  const { postData } = usePost();
  const { putData } = usePut();

  // Fetch all products once for the entire form
  const { data: productsData, loading: productsLoading } = useGet("/admin/products");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    layout: "grid",
    position: 1,
    status: true,
    start_date: "",
    end_date: "",
    image: null,
    imagePreview: "",
    product_ids: [],
  });

  // Normalize and memoize all products
  const allProducts = useMemo(() => {
    if (!productsData) return [];
    if (Array.isArray(productsData?.data?.data)) return productsData.data.data;
    if (Array.isArray(productsData?.data)) return productsData.data;
    if (Array.isArray(productsData)) return productsData;
    return [];
  }, [productsData]);

  // Get full product objects for preview
  const previewProducts = useMemo(() => {
    if (!form.product_ids.length || !allProducts.length) return [];

    return form.product_ids
      .map(id => allProducts.find(p => Number(p.id) === Number(id)))
      .filter(Boolean);
  }, [form.product_ids, allProducts]);

  // Prefill on edit
  useEffect(() => {
    if (!editData) return;

    setForm({
      title: editData.title || "",
      subtitle: editData.subtitle || "",
      description: editData.description || "",
      layout: editData.layout || "grid",
      position: editData.position || 1,
      status: !!editData.status,
      start_date: editData.start_date || "",
      end_date: editData.end_date || "",
      image: null,
      imagePreview: editData.image ? getImageUrl(editData.image) : "",
      product_ids: editData.products?.map((p) => p.id) || [],
    });
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (form.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }

    const preview = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: preview,
    }));
  }, [form.imagePreview]);

  useEffect(() => {
    return () => {
      if (form.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  const handleProductChange = (ids) => {
    setForm((prev) => ({
      ...prev,
      product_ids: ids,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "product_ids" || key === "imagePreview") return;

        if (key === "status") {
          formData.append("status", value ? 1 : 0);
        } else if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      form.product_ids.forEach((id, index) => {
        formData.append(`product_ids[${index}]`, id);
      });

      if (isEdit) {
        await putData({
          url: `/admin/banners/${editData.id}`,
          data: formData,
        });
      } else {
        await postData({
          url: "/admin/banners",
          data: formData,
        });
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2 sm:p-3 md:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg flex flex-col max-h-[95vh] sm:max-h-[90vh] my-2 sm:my-4">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            {isEdit ? "Edit Banner" : "Create Banner"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 md:p-5 overflow-y-auto flex-1 space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter banner title"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="Enter banner subtitle (optional)"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter banner description (optional)"
              rows="3"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Banner Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="border p-2 rounded w-full"
            />
            {form.imagePreview && (
              <div className="mt-2 relative group">
                <img
                  src={form.imagePreview}
                  className="h-32 sm:h-40 w-full object-cover rounded"
                  alt="Banner preview"
                />
                <button
                  onClick={() => setForm(prev => ({ ...prev, imagePreview: "", image: null }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Layout */}
          <div>
            <label className="block text-sm font-medium mb-1">Layout *</label>
            <select
              name="layout"
              value={form.layout}
              onChange={handleChange}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="grid">Grid Layout (Max 4 products)</option>
              <option value="highlight">Highlight Layout (1 product)</option>
              <option value="carousel">Carousel Layout (Unlimited products)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {form.layout === "grid" && "Shows up to 4 products in a 2x2 grid"}
              {form.layout === "highlight" && "Shows 1 featured product prominently"}
              {form.layout === "carousel" && "Shows products in a horizontal scrollable carousel"}
            </p>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium mb-1">Position *</label>
            <input
              name="position"
              type="number"
              value={form.position}
              onChange={handleChange}
              placeholder="Display order (lower numbers appear first)"
              className="border p-2 rounded w-full focus:ring-2 focus:ring-black focus:border-transparent"
              min="1"
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Active (Visible to customers)</span>
            </label>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="datetime-local"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          {/* Product Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Products * ({form.product_ids.length} selected)
            </label>
            <ProductSelector
              selected={form.product_ids}
              onChange={handleProductChange}
              layout={form.layout}
            />
          </div>


          {/* Live Preview - Enhanced */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium">Live Preview</label>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {form.layout === "grid" && "Products: Right Side"}
                  {form.layout === "highlight" && "Product: Top Right"}
                  {form.layout === "carousel" && "Products: Bottom"}
                </span>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
              {productsLoading ? (
                <div className="bg-gray-100 text-center py-12">
                  <p className="text-sm text-gray-500">Loading preview...</p>
                </div>
              ) : (
                <BannerLayoutPreview
                  layout={form.layout}
                  products={previewProducts}
                  title={form.title || "Sample Title"}
                  description={form.description || "Sample description"}
                  image={form.imagePreview}
                />
              )}
            </div>

            {/* Position Indicator */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded ${form.layout === "grid" ? "bg-black text-white" : "bg-gray-100"}`}>
                📱 Grid: Products on right
              </div>
              <div className={`p-2 rounded ${form.layout === "highlight" ? "bg-black text-white" : "bg-gray-100"}`}>
                ⭐ Highlight: Product top-right
              </div>
              <div className={`p-2 rounded ${form.layout === "carousel" ? "bg-black text-white" : "bg-gray-100"}`}>
                🎠 Carousel: Products at bottom
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-3 sm:p-4 border-t sticky bottom-0 bg-white rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-sm sm:text-base disabled:opacity-50"
            disabled={!form.title || !form.product_ids.length}
          >
            {isEdit ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
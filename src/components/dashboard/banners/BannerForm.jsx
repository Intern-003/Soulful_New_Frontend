import { useEffect, useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import ProductSelector from "./products/ProductSelector";
import BannerLayoutPreview from "./BannerLayoutPreview";
import { getImageUrl } from "../../../utils/getImageUrl";

const BannerForm = ({ editData, onClose, onSuccess }) => {
  const isEdit = !!editData;

  const { postData } = usePost();
  const { putData } = usePut();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    layout: "grid",
    position: 1,
    is_active: true,
    start_date: "",
    end_date: "",
    image: null,
    imagePreview: "",
    product_ids: [],
  });

  // ✅ PREFILL
  useEffect(() => {
    if (!editData) return;

    setForm({
      title: editData.title || "",
      subtitle: editData.subtitle || "",
      description: editData.description || "",
      layout: editData.layout || "grid",
      position: editData.position || 1,
      is_active: !!editData.is_active,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "product_ids") return;
        if (key === "imagePreview") return;
        if (value !== null) formData.append(key, value);
      });

      form.product_ids.forEach((id, i) => {
        formData.append(`product_ids[${i}]`, id);
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
      re
      onClose?.();

    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Banner" : "Create Banner"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto space-y-4">

          {/* TEXT INPUTS */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Up to 60% Off"
              className="border p-2 rounded"
            />
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="Discover premium quality products"
              className="border p-2 rounded"
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Extra description..."
            className="border p-2 rounded w-full"
          />

          {/* IMAGE */}
          <div>
            <input type="file" onChange={handleImageChange} />
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                className="mt-2 h-40 w-full object-cover rounded"
              />
            )}
          </div>

          {/* LAYOUT SETTINGS */}
          <div className="grid grid-cols-3 gap-3">
            <select
              name="layout"
              value={form.layout}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="grid">Grid (4)</option>
              <option value="highlight">Highlight (1)</option>
              <option value="carousel">Carousel</option>
            </select>

            <input
              name="position"
              type="number"
              value={form.position}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="datetime-local"
              name="start_date"
              value={form.start_date || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="datetime-local"
              name="end_date"
              value={form.end_date || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          {/* PRODUCT SELECTOR */}
          <div>
            <h3 className="font-medium mb-2">Select Products</h3>
            <ProductSelector
              selected={form.product_ids}
              onChange={(ids) =>
                setForm((prev) => ({ ...prev, product_ids: ids }))
              }
              layout={form.layout}
            />
          </div>

          {/* PREVIEW */}
          <div>
            <h3 className="font-medium mb-2">Preview</h3>
            <BannerLayoutPreview
              layout={form.layout}
              productIds={form.product_ids}
              title={form.title}
              subtitle={form.subtitle}
              description={form.description}
              image={form.imagePreview}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BannerForm;
import React, { useState, useEffect, useRef } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";

import VariantSection from "./VariantSection";
import AttributeSelector from "./AttributeSelector";
import VariantGenerator from "./VariantGenerator";
import toast from "react-hot-toast";

const ProductForm = ({ data, onClose, onSuccess }) => {
  const isEdit = !!data;

  const { data: categoryData } = useGet("/categories");
  const { data: brandData } = useGet("/brands");
  const { data: attributeData } = useGet("/admin/attributes-with-values");

  const { data: subcategoryData, refetch } = useGet("", {
    autoFetch: false,
  });

  const { postData } = usePost();
  const { putData } = usePut();

  // ✅ FIXED REFS
  const variantRef = useRef(null);
  const variantScrollRef = useRef(null);

  const [pendingVariants, setPendingVariants] = useState([]);

  const [productId, setProductId] = useState(data?.id || null);
  const [isLocked, setIsLocked] = useState(false);

  const [form, setForm] = useState({
    name: "",
    short_description: "",
    description: "",
    price: "",
    discount_price: "",
    cost_price: "",
    stock: "",
    category_id: "",
    brand_id: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    is_featured: false,
  });
  const [existingVariants, setExistingVariants] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  // ✅ PREFILL
  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        price: data.price ?? "",
        discount_price: data.discount_price ?? "",
        cost_price: data.cost_price ?? "",
        stock: data.stock ?? "",
        is_featured: !!data.is_featured,
      });

      setParentCategory(data?.category?.parent_id || "");
      setProductId(data.id);
    }
  }, [data]);

  // ✅ SAFE VARIANT INJECTION
  useEffect(() => {
    if (pendingVariants.length > 0) {
      variantRef.current?.addVariants(pendingVariants);
      setPendingVariants([]);
    }
  }, [pendingVariants]);

  const handleCategoryChange = async (e) => {
    const id = e.target.value;
    setParentCategory(id);
    setForm((prev) => ({ ...prev, category_id: "" }));

    if (id) {
      await refetch({ url: `/categories/${id}/children` });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const numberFields = [
      "price",
      "discount_price",
      "cost_price",
      "stock",
      "length",
      "width",
      "height",
      "weight",
    ];

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : numberFields.includes(name)
            ? value === ""
              ? ""
              : Number(value)
            : value,
    }));
  };

  // ✅ IMAGE HANDLING
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...previews]);

    e.target.value = null;
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(preview[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingVariants = (variants) => {
    setExistingVariants(variants);
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (submitting) return; // 🚫 prevent double click

    if (!form.name || !form.category_id || !form.price) {
      alert("Please fill required fields");
      return;
    }

    setSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price || 0),
      discount_price: Number(form.discount_price || 0),
      cost_price: Number(form.cost_price || 0),
      stock: Number(form.stock || 0),
      length: Number(form.length || 0),
      width: Number(form.width || 0),
      height: Number(form.height || 0),
      weight: Number(form.weight || 0),
      is_featured: form.is_featured ? 1 : 0,
      is_approved: 0,
      status: 0,
    };

    try {
      let id;

      if (isEdit) {
        await putData({
          url: `/vendor/products/${data.id}`,
          data: payload,
        });
        id = data.id;
      } else {
        const res = await postData({
          url: "/vendor/products",
          data: payload,
        });

        id = res?.data?.id;
        setProductId(id);
      }

      // ✅ IMAGE UPLOAD WITH LOADER
      if (images.length > 0) {
        setUploadingImages(true);

        const fd = new FormData();
        images.forEach((file) => fd.append("images[]", file));
        fd.append("is_primary", 1);

        await postData({
          url: `/vendor/products/${id}/images`,
          data: fd,
          headers: { "Content-Type": "multipart/form-data" },
        });

        setUploadingImages(false);
      }

      toast.success("Product submitted for approval ✅");
      setIsLocked(true);

      setTimeout(() => {
        variantScrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);

      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Error saving product");
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  };

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];
  const brands = brandData?.data?.data || brandData?.data || [];
  const attributes = attributeData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        {/* ✅ FULL FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" disabled={isLocked && !isEdit} className="border p-2" />

          <input name="short_description" value={form.short_description} onChange={handleChange} placeholder="Short Description" disabled={isLocked && !isEdit} className="border p-2" />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" disabled={isLocked && !isEdit} className="border p-2 md:col-span-2" />

          <select value={parentCategory} onChange={handleCategoryChange} disabled={isLocked && !isEdit} className="border p-2">
            <option>Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select name="category_id" value={form.category_id} onChange={handleChange} disabled={isLocked && !isEdit} className="border p-2">
            <option>Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select name="brand_id" value={form.brand_id} onChange={handleChange} disabled={isLocked && !isEdit} className="border p-2 md:col-span-2">
            <option>Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <input name="price" value={form.price} onChange={handleChange} disabled={isLocked && !isEdit} placeholder="Price" className="border p-2" />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" disabled={isLocked && !isEdit} className="border p-2" />

          <input name="discount_price" value={form.discount_price} onChange={handleChange} placeholder="Discount Price" disabled={isLocked && !isEdit} className="border p-2" />
          <input name="cost_price" value={form.cost_price} onChange={handleChange} disabled={isLocked && !isEdit} placeholder="Cost Price" className="border p-2" />

          <div className="md:col-span-2 grid grid-cols-4 gap-2">
            <input name="length" value={form.length} onChange={handleChange} disabled={isLocked && !isEdit} placeholder="Length" className="border p-2" />
            <input name="width" value={form.width} onChange={handleChange} disabled={isLocked && !isEdit} placeholder="Width" className="border p-2" />
            <input name="height" value={form.height} onChange={handleChange} disabled={isLocked && !isEdit} placeholder="Height" className="border p-2" />
            <input name="weight" value={form.weight} onChange={handleChange} disabled={isLocked && !isEdit} placeholder="Weight" className="border p-2" />
          </div>

          <div className="md:col-span-2 flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} disabled={isLocked && !isEdit} />
              Featured
            </label>
          </div>

          <input type="file" multiple onChange={handleImageChange} disabled={isLocked && !isEdit} className="md:col-span-2" />

          <div className="md:col-span-2 grid grid-cols-4 gap-2">
            {preview.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="h-20 w-full object-cover" />
                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white px-1">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isLocked && !isEdit || submitting || uploadingImages}
            className="bg-[#7a1c3d] text-white px-4 py-2 disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : uploadingImages
                ? "Uploading Images..."
                : isEdit
                  ? "Update Product"
                  : "Create Product"}
          </button>
        </div>

        {/* ATTRIBUTES */}
        <AttributeSelector
          selected={selectedAttributeValues}
          onChange={setSelectedAttributeValues}
          attributes={attributes}
        />

        {/* VARIANTS */}
        {productId && (
          <>
            <VariantGenerator
              attributes={attributes}
              selectedValues={selectedAttributeValues}
              onGenerated={(v) => setPendingVariants(v)}
              disabled={!productId || submitting}
              existingVariants={existingVariants}
            />

            <div ref={variantScrollRef}>
              <VariantSection ref={variantRef} productId={productId} onVariantsLoaded={handleExistingVariants} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
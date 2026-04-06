// src/components/dashboard/products/ProductForm.jsx

import React, { useState, useEffect } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";

import VariantSection from "./VariantSection";
import AttributeSelector from "./AttributeSelector";
import VariantGenerator from "./VariantGenerator";

const ProductForm = ({ data, onClose, onSuccess }) => {
  const isEdit = !!data;

  const { data: categoryData } = useGet("/categories");
  const { data: brandData } = useGet("/admin/brands");
  const { data: userData } = useGet("/auth/me");
  const { data: attributeData } = useGet("/admin/attributes-with-values");

  const { data: subcategoryData, refetch } = useGet("", {
    autoFetch: false,
  });

  const { postData, loading: postLoading } = usePost();
  const { putData, loading: putLoading } = usePut();

  const [productId, setProductId] = useState(data?.id || null);

  const [selectedAttributes, setSelectedAttributes] = useState([]);

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
    vendor_id: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    is_featured: false,
    status: false,       // 🔥 inactive by default
    is_approved: false,  // 🔥 admin approval required
  });

  const [parentCategory, setParentCategory] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // ✅ PREFILL EDIT
  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        short_description: data.short_description || "",
        description: data.description || "",
        price: data.price || "",
        discount_price: data.discount_price || "",
        cost_price: data.cost_price || "",
        stock: data.stock || "",
        category_id: data.category_id || "",
        brand_id: data.brand_id || "",
        vendor_id: data.vendor_id || "",
        weight: data.weight || "",
        length: data.length || "",
        width: data.width || "",
        height: data.height || "",
        is_featured: !!data.is_featured,
        status: !!data.status,
        is_approved: !!data.is_approved,
      });

      setParentCategory(data?.category?.parent_id || "");
      setProductId(data.id);
    }
  }, [data]);

  // ✅ AUTO SET VENDOR
  useEffect(() => {
    if (userData && !isEdit) {
      setForm((prev) => ({
        ...prev,
        vendor_id: userData?.data?.id || userData?.id,
      }));
    }
  }, [userData]);

  // ✅ CATEGORY CHANGE
  const handleCategoryChange = async (e) => {
    const id = e.target.value;
    setParentCategory(id);

    setForm((prev) => ({ ...prev, category_id: "" }));

    if (id) {
      await refetch({ url: `/categories/${id}/children` });
    }
  };

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "price",
              "discount_price",
              "cost_price",
              "stock",
              "length",
              "width",
              "height",
              "weight",
            ].includes(name)
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  // ✅ IMAGE SELECT
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview((prev) => [...prev, ...previews]);

    e.target.value = null;
  };

  // ✅ REMOVE IMAGE
  const removeImage = (index) => {
    URL.revokeObjectURL(preview[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      let id;

      if (isEdit) {
        await putData({
          url: `/vendor/products/${data.id}`,
          data: form,
        });

        id = data.id;
      } else {
        const res = await postData({
          url: "/vendor/products",
          data: form,
        });

        id = res?.data?.id;
        setProductId(id);
      }

      // 🔥 UPLOAD IMAGES
      if (images.length > 0) {
        const fd = new FormData();

        images.forEach((file) => {
          fd.append("images[]", file);
        });

        fd.append("is_primary", 1);

        await postData({
          url: `/vendor/products/${id}/images`,
          data: fd,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSuccess();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];
  const brands = brandData?.data || brandData || [];
  const attributes = attributeData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-6 text-[#7a1c3d]">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <div className="space-y-4">

          {/* BASIC */}
          <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="w-full border p-3 rounded-lg" />
          <input name="short_description" value={form.short_description} onChange={handleChange} placeholder="Short Description" className="w-full border p-3 rounded-lg" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Full Description" className="w-full border p-3 rounded-lg" />

          {/* CATEGORY */}
          <select value={parentCategory} onChange={handleCategoryChange} className="w-full border p-3 rounded-lg">
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full border p-3 rounded-lg">
            <option value="">Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* BRAND */}
          <select name="brand_id" value={form.brand_id} onChange={handleChange} className="w-full border p-3 rounded-lg">
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* PRICING */}
          <div className="grid grid-cols-3 gap-3">
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-3 rounded-lg" />
            <input name="discount_price" value={form.discount_price} onChange={handleChange} placeholder="Discount Price" className="border p-3 rounded-lg" />
            <input name="cost_price" value={form.cost_price} onChange={handleChange} placeholder="Cost Price" className="border p-3 rounded-lg" />
          </div>

          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full border p-3 rounded-lg" />

          {/* DIMENSIONS */}
          <div className="grid grid-cols-4 gap-3">
            <input name="length" value={form.length} onChange={handleChange} placeholder="Length" className="border p-3 rounded-lg" />
            <input name="width" value={form.width} onChange={handleChange} placeholder="Width" className="border p-3 rounded-lg" />
            <input name="height" value={form.height} onChange={handleChange} placeholder="Height" className="border p-3 rounded-lg" />
            <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" className="border p-3 rounded-lg" />
          </div>

          {/* FLAGS */}
          <div className="flex gap-6">
            <label><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured</label>
            <label><input type="checkbox" name="status" checked={form.status} onChange={handleChange} /> Active</label>
            <label><input type="checkbox" name="is_approved" checked={form.is_approved} onChange={handleChange} /> Approved</label>
          </div>

          {/* IMAGE */}
          <input type="file" multiple onChange={handleImageChange} />

          <div className="grid grid-cols-4 gap-2">
            {preview.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="h-20 w-full object-cover rounded" />
                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">✕</button>
              </div>
            ))}
          </div>

          {/* 🔥 ATTRIBUTE SELECTOR */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Select Attributes
            </h3>

            <AttributeSelector
              selected={selectedAttributes}
              onChange={setSelectedAttributes}
            />
          </div>

          {/* 🔥 VARIANT GENERATOR */}
          {productId && selectedAttributes.length > 0 && (
            <VariantGenerator
              productId={productId}
              attributes={attributes}
              selectedValues={selectedAttributes}
            />
          )}

          {/* 🔥 VARIANT MANAGER */}
          {productId && (
            <VariantSection productId={productId} />
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={postLoading || putLoading}
            className="bg-[#7a1c3d] text-white px-6 py-2 rounded-lg"
          >
            {isEdit
              ? putLoading
                ? "Updating..."
                : "Update Product"
              : postLoading
              ? "Creating..."
              : "Create Product"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductForm;
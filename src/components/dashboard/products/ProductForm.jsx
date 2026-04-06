// src/components/dashboard/products/ProductForm.jsx

import React, { useState, useEffect } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useGet from "../../../api/hooks/useGet";
import { useNavigate } from "react-router-dom";

import VariantSection from "./VariantSection";
import AttributeSelector from "./AttributeSelector";
import VariantGenerator from "./VariantGenerator";

const ProductForm = ({ data, onClose, onSuccess }) => {
  const navigate = useNavigate();
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
    user_id: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    is_featured: false,
    status: false,
    is_approved: false,
  });

  const [parentCategory, setParentCategory] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // ✅ PREFILL EDIT
  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        price: data.price ?? "",
        discount_price: data.discount_price ?? "",
        cost_price: data.cost_price ?? "",
        stock: data.stock ?? "",
      });

      setParentCategory(data?.category?.parent_id || "");
      setProductId(data.id);
    }
  }, [data]);

  // ✅ USER / VENDOR SAFE HANDLING
  useEffect(() => {
    const user = userData?.data || userData;

    if (user) {
      setForm((prev) => ({
        ...prev,
        vendor_id: user.vendor_id || "",
        user_id: user.id || "",
      }));
    }
  }, [userData]);

  // ✅ CATEGORY
  const handleCategoryChange = async (e) => {
    const id = e.target.value;
    setParentCategory(id);

    setForm((prev) => ({ ...prev, category_id: "" }));

    if (id) {
      await refetch({ url: `/categories/${id}/children` });
    }
  };

  // ✅ INPUT HANDLER
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
    if (!form.name || !form.category_id || !form.price) {
      alert("Please fill required fields");
      return;
    }

    if (!form.user_id) {
      alert("User not loaded yet. Please wait.");
      return;
    }

    const payload = {
      ...form,
      vendor_id: form.vendor_id || null,
      user_id: form.user_id,

      price: Number(form.price || 0),
      discount_price: Number(form.discount_price || 0),
      cost_price: Number(form.cost_price || 0),
      stock: Number(form.stock || 0),
      length: Number(form.length || 0),
      width: Number(form.width || 0),
      height: Number(form.height || 0),
      weight: Number(form.weight || 0),

      status: false,
      is_approved: false,
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

      // IMAGE UPLOAD
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

      alert("Product Saved ✅");
      onSuccess();

    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];

  // 🔥 FIXED BRAND HANDLING (IMPORTANT)
  const brands =
    brandData?.data?.data ||  // axios wrapped
    brandData?.data ||        // direct API
    [];

  const attributes = attributeData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-6 text-[#7a1c3d]">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/dashboard/attributes")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Manage Attributes
          </button>
        </div>

        <div className="space-y-4">

          <input name="name" value={form.name ?? ""} onChange={handleChange} placeholder="Product Name" className="w-full border p-3 rounded-lg" />
          <input name="short_description" value={form.short_description ?? ""} onChange={handleChange} placeholder="Short Description" className="w-full border p-3 rounded-lg" />
          <textarea name="description" value={form.description ?? ""} onChange={handleChange} placeholder="Full Description" className="w-full border p-3 rounded-lg" />

          <select value={parentCategory ?? ""} onChange={handleCategoryChange} className="w-full border p-3 rounded-lg">
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select name="category_id" value={form.category_id ?? ""} onChange={handleChange} className="w-full border p-3 rounded-lg">
            <option value="">Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select name="brand_id" value={form.brand_id ?? ""} onChange={handleChange} className="w-full border p-3 rounded-lg">
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-3 gap-3">
            <input name="price" value={form.price ?? ""} onChange={handleChange} placeholder="Price" className="border p-3 rounded-lg" />
            <input name="discount_price" value={form.discount_price ?? ""} onChange={handleChange} placeholder="Discount Price" className="border p-3 rounded-lg" />
            <input name="cost_price" value={form.cost_price ?? ""} onChange={handleChange} placeholder="Cost Price" className="border p-3 rounded-lg" />
          </div>

          <input name="stock" value={form.stock ?? ""} onChange={handleChange} placeholder="Stock" className="w-full border p-3 rounded-lg" />

          <div className="grid grid-cols-4 gap-3">
            <input name="length" value={form.length ?? ""} onChange={handleChange} placeholder="Length" className="border p-3 rounded-lg" />
            <input name="width" value={form.width ?? ""} onChange={handleChange} placeholder="Width" className="border p-3 rounded-lg" />
            <input name="height" value={form.height ?? ""} onChange={handleChange} placeholder="Height" className="border p-3 rounded-lg" />
            <input name="weight" value={form.weight ?? ""} onChange={handleChange} placeholder="Weight" className="border p-3 rounded-lg" />
          </div>

          <div className="flex gap-6">
            <label><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured</label>
            <label><input type="checkbox" name="status" checked={form.status} onChange={handleChange} /> Active</label>
            <label><input type="checkbox" name="is_approved" checked={form.is_approved} onChange={handleChange} /> Approved</label>
          </div>

          <input type="file" multiple onChange={handleImageChange} />

          <div className="grid grid-cols-4 gap-2">
            {preview.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="h-20 w-full object-cover rounded" />
                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">✕</button>
              </div>
            ))}
          </div>

          <AttributeSelector
            selected={selectedAttributes}
            onChange={setSelectedAttributes}
          />

          {productId && selectedAttributes.length > 0 && (
            <VariantGenerator
              productId={productId}
              attributes={attributes}
              selectedValues={selectedAttributes}
            />
          )}

          {productId && (
            <VariantSection productId={productId} />
          )}

        </div>

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
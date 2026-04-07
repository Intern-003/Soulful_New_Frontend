import React, { useEffect, useState } from "react";
import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";

import ProductImages from "./ProductImages";
import VariantSection from "./VariantSection";
import AttributeSelector from "./AttributeSelector";
import VariantGenerator from "./VariantGenerator";

const EditProductModal = ({ productId, onClose, onSuccess }) => {

  const { data, loading, refetch } = useGet(`/vendor/products/${productId}`);
  const { putData, loading: updating } = usePut();

  const { data: categoryData } = useGet("/categories");
  const { data: brandData } = useGet("/brands");

  const { data: subcategoryData, refetch: fetchSubcategories } = useGet("", {
    autoFetch: false,
  });

  const { data: attributeData } = useGet("/admin/attributes-with-values");

  const product = data?.data;

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
    status: false,
    is_approved: false,
  });

  const [parentCategory, setParentCategory] = useState("");

  // ✅ NEW STATES
  const [selectedAttributeValues, setSelectedAttributeValues] = useState({});
  const [generatedVariants, setGeneratedVariants] = useState([]);

  // ✅ PREFILL
  useEffect(() => {
    if (product) {
      const isSub = !!product.category?.parent_id;

      setForm({
        name: product.name || "",
        short_description: product.short_description || "",
        description: product.description || "",
        price: product.price ?? "",
        discount_price: product.discount_price ?? "",
        cost_price: product.cost_price ?? "",
        stock: product.stock ?? "",
        category_id: isSub ? product.category.id : "",
        brand_id: product.brand_id || "",
        weight: product.weight || "",
        length: product.length || "",
        width: product.width || "",
        height: product.height || "",
        is_featured: product.is_featured || false,
        status: product.status || false,
        is_approved: product.is_approved || false,
      });

      if (isSub) {
        setParentCategory(product.category.parent_id);

        fetchSubcategories({
          url: `/categories/${product.category.parent_id}/children`,
        });
      } else {
        setParentCategory(product.category?.id || "");
      }
    }
  }, [product]);

  // ✅ CATEGORY CHANGE
  const handleCategoryChange = async (e) => {
    const parentId = Number(e.target.value);
    setParentCategory(parentId);

    await fetchSubcategories({
      url: `/categories/${parentId}/children`,
    });

    setForm((prev) => ({ ...prev, category_id: "" }));
  };

  // ✅ INPUT HANDLER
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const numberFields = [
      "price",
      "discount_price",
      "cost_price",
      "stock",
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

  // ✅ UPDATE PRODUCT
  const handleUpdate = async () => {
    try {
      await putData({
        url: `/vendor/products/${productId}`,
        data: {
          ...form,
          is_approved: false,
          status: false,
        },
      });

      alert("Product Updated ✅");
      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];

  const brands =
    brandData?.data?.data ||
    brandData?.data ||
    [];

  const attributes = attributeData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl p-6 rounded-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold text-[#7a1c3d] mb-6">
          Edit Product
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />

          <input name="short_description" value={form.short_description} onChange={handleChange} placeholder="Short Description" className="border p-2 rounded" />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-2" />

          <select value={parentCategory} onChange={handleCategoryChange} className="border p-2 rounded">
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select name="category_id" value={form.category_id} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Subcategory</option>
            {subcategories.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select name="brand_id" value={form.brand_id} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Brand</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" />
          <input name="discount_price" value={form.discount_price} onChange={handleChange} placeholder="Discount" className="border p-2 rounded" />
          <input name="cost_price" value={form.cost_price} onChange={handleChange} placeholder="Cost" className="border p-2 rounded" />

          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="border p-2 rounded" />

          <input name="length" value={form.length} onChange={handleChange} placeholder="Length" className="border p-2 rounded" />
          <input name="width" value={form.width} onChange={handleChange} placeholder="Width" className="border p-2 rounded" />
          <input name="height" value={form.height} onChange={handleChange} placeholder="Height" className="border p-2 rounded" />
          <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" className="border p-2 rounded" />

          <div className="col-span-2 bg-yellow-50 border p-3 rounded text-sm">
            ⚠️ This product is pending admin approval.
          </div>

        </div>

        {/* IMAGES */}
        <ProductImages
          productId={productId}
          images={product?.images || []}
          onRefresh={refetch}
        />

        {/* ✅ ATTRIBUTE SELECTOR */}
        <AttributeSelector
          attributes={attributes}
          selected={selectedAttributeValues}
          onChange={setSelectedAttributeValues}
        />

        {/* ✅ VARIANT GENERATOR */}
        <VariantGenerator
          attributes={attributes}
          selectedValues={selectedAttributeValues}
          onGenerated={setGeneratedVariants}
        />

        {/* ✅ VARIANT SECTION */}
        <VariantSection
          productId={productId}
          attributes={attributes}
          generatedVariants={generatedVariants}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="bg-[#7a1c3d] text-white px-5 py-2 rounded"
          >
            {updating ? "Updating..." : "Update Product"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProductModal;
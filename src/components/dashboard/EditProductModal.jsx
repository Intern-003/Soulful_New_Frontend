import React, { useEffect, useState } from "react";
import useGet from "../../api/hooks/useGet";
import usePut from "../../api/hooks/usePut";

import ProductImages from "./ProductImages";
import VariantSection from "./VariantSection";

const EditProductModal = ({ productId, onClose, onSuccess }) => {
  const { data, loading, refetch } = useGet(
    `/vendor/products/${productId}`
  );

  const { putData, loading: updating } = usePut("");

  // ✅ CATEGORY + USER
  const { data: categoryData } = useGet("/categories");
  const { data: userData } = useGet("/auth/me");

  // ✅ SUBCATEGORY FETCH
  const {
    data: subcategoryData,
    refetch: fetchSubcategories,
  } = useGet("", { autoFetch: false });

  // ✅ FIXED PRODUCT MAPPING
  const product = data?.data?.data;

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category_id: "",
    vendor_id: "",
  });

  const [parentCategory, setParentCategory] = useState("");

  // ✅ SET FORM DATA + CATEGORY LOGIC
  useEffect(() => {
    if (product) {
      const isSubcategory = !!product.category?.parent_id;

      setForm({
        name: product.name || "",
        price: Number(product.price) || "",
        stock: Number(product.stock) || "",
        description: product.description || "",
        category_id: isSubcategory ? product.category.id : "",
        vendor_id: product.vendor?.id || "",
      });

      if (isSubcategory) {
        // 👉 Product has subcategory
        setParentCategory(product.category.parent_id);

        fetchSubcategories({
          url: `/categories/${product.category.parent_id}/children`,
        });
      } else {
        // 👉 Product is main category
        setParentCategory(product.category?.id || "");
      }
    }
  }, [product]);

  // ✅ AUTO VENDOR
  useEffect(() => {
    if (userData?.id && !form.vendor_id) {
      setForm((prev) => ({
        ...prev,
        vendor_id: userData.id,
      }));
    }
  }, [userData]);

  // ✅ CATEGORY CHANGE
  const handleCategoryChange = async (e) => {
    const parentId = Number(e.target.value);

    setParentCategory(parentId);

    await fetchSubcategories({
      url: `/categories/${parentId}/children`,
    });

    // reset subcategory
    setForm((prev) => ({
      ...prev,
      category_id: "",
    }));
  };

  // ✅ SUBCATEGORY CHANGE
  const handleSubcategoryChange = (e) => {
    setForm((prev) => ({
      ...prev,
      category_id: Number(e.target.value),
    }));
  };

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  // ✅ VALIDATION
  const validate = () => {
    if (!form.name) return "Name required";
    if (!form.price) return "Price required";
    if (!form.stock) return "Stock required";
    if (!form.category_id) return "Select subcategory";
    return null;
  };

  // ✅ UPDATE PRODUCT
  const handleUpdate = async () => {
    const error = validate();
    if (error) return alert(error);

    try {
      await putData({
        url: `/vendor/products/${productId}`,
        data: form,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.log("Update Error:", err);
      alert("Update failed");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#7a1c3d]">
            Edit Product
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-lg"
          >
            ✕
          </button>
        </div>

        {/* ================= FORM ================= */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3 text-gray-700">
            Product Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="border p-2 rounded"
            />

            {/* CATEGORY */}
            <select
              value={parentCategory}
              onChange={handleCategoryChange}
              className="border p-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* SUBCATEGORY */}
            <select
              value={form.category_id || ""}
              onChange={handleSubcategoryChange}
              className="border p-2 rounded"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>

            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
            />

            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-2 rounded"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 rounded md:col-span-2"
            />

          </div>
        </div>

        {/* IMAGES */}
        <div className="mb-8">
          <ProductImages
            productId={productId}
            images={product?.images || []}
            onRefresh={refetch}
          />
        </div>

        {/* VARIANTS */}
        <div className="mb-6">
          <VariantSection productId={productId} />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="px-5 py-2 bg-[#7a1c3d] text-white rounded hover:opacity-90 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Product"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default EditProductModal;
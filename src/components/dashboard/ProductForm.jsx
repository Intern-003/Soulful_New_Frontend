import React, { useState, useEffect } from "react";
import usePost from "../../api/hooks/usePost";
import useGet from "../../api/hooks/useGet";

const ProductForm = ({ onClose, onSuccess }) => {
  const { data: categoryData, loading: catLoading } = useGet("/categories");
  const { data: userData } = useGet("/auth/me");

  // ✅ SUBCATEGORY HOOK
  const {
    data: subcategoryData,
    loading: subLoading,
    refetch: fetchSubcategories,
  } = useGet("", { autoFetch: false });

  // ✅ SINGLE POST HOOK
  const { postData, loading } = usePost("");

  const initialState = {
    name: "",
    price: "",
    stock: "",
    category_id: "",
    vendor_id: "",
    description: "",
  };

  const [form, setForm] = useState(initialState);
  const [parentCategory, setParentCategory] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // ✅ AUTO VENDOR
  useEffect(() => {
    if (userData) {
      setForm((prev) => ({
        ...prev,
        vendor_id: userData.id,
      }));
    }
  }, [userData]);

  // ✅ CATEGORY CHANGE
  const handleCategoryChange = async (e) => {
    const parentId = e.target.value;
    setParentCategory(parentId);

    // reset subcategory
    setForm((prev) => ({
      ...prev,
      category_id: "",
    }));

    if (parentId) {
      await fetchSubcategories({
        url: `/categories/${parentId}/children`,
      });
    }
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

  // ✅ IMAGE CHANGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview(previews);
  };

  // ✅ CLEANUP MEMORY
  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  // ✅ VALIDATION
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.price || form.price <= 0) return "Valid price required";
    if (!form.stock || form.stock < 0) return "Valid stock required";
    if (!parentCategory) return "Select category";
    if (!form.category_id) return "Select subcategory";
    return null;
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);

    try {
      // 1️⃣ CREATE PRODUCT
      const res = await postData({
        url: "/vendor/products",
        data: form,
      });

      const productId = res?.data?.id;

      // 2️⃣ UPLOAD IMAGES
      if (images.length > 0) {
        const formData = new FormData();

        images.forEach((img) => {
          formData.append("images[]", img);
        });

        formData.append("is_primary", 1);

        await postData({
          url: `/vendor/products/${productId}/images`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // ✅ RESET FORM
      setForm(initialState);
      setImages([]);
      setPreview([]);
      setParentCategory("");

      onSuccess();
      onClose();
    } catch (err) {
      console.log("Create Error:", err);
      alert("Failed to create product");
    }
  };

  const categories = categoryData?.data || [];
  const subcategories = subcategoryData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4 text-[#7a1c3d]">
          Add Product
        </h2>

        <div className="space-y-4">

          {/* NAME */}
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* CATEGORY */}
          <select
            value={parentCategory}
            onChange={handleCategoryChange}
            className="w-full border p-2 rounded"
            disabled={catLoading}
          >
            <option value="">
              {catLoading ? "Loading..." : "Select Category"}
            </option>
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
            className="w-full border p-2 rounded"
            disabled={!parentCategory || subLoading}
          >
            <option value="">
              {subLoading
                ? "Loading..."
                : "Select Subcategory"}
            </option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* IMAGE */}
          <input type="file" multiple onChange={handleImageChange} />

          {preview.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {preview.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-20 w-full object-cover rounded"
                />
              ))}
            </div>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded hover:opacity-90"
          >
            {loading ? "Saving..." : "Create Product"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProductForm;
// src/components/dashboard/products/VariantForm.jsx

import React, { useEffect, useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import AttributeSelector from "./AttributeSelector";

const generateSKU = (values = []) => {
  return values.map((v) => v.value?.toUpperCase()).join("-");
};

const VariantForm = ({ productId, data, onClose, onSuccess }) => {
  const { postData } = usePost();
  const { putData } = usePut();

  const [form, setForm] = useState({
    sku: data?.sku || "",
    barcode: data?.barcode || "",
    price: data?.price || "",
    discount_price: data?.discount_price || "",
    stock: data?.stock || "",
    weight: data?.weight || "",
    image: null,
  });

  // 🔥 GROUPED STATE (IMPORTANT)
  const [selectedValues, setSelectedValues] = useState({});

  // 🔹 Convert edit data → grouped format
  useEffect(() => {
    if (data?.attribute_values) {
      const grouped = {};

      data.attribute_values.forEach((val) => {
        if (!grouped[val.attribute_id]) {
          grouped[val.attribute_id] = [];
        }
        grouped[val.attribute_id].push(val.id);
      });

      setSelectedValues(grouped);
    }
  }, [data]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 🔹 Flatten grouped → array for API
  const getFlatValues = () => {
    return Object.values(selectedValues).flat();
  };

  // 🔥 AUTO SKU (optional auto-fill)
  useEffect(() => {
    if (!data) {
      const flat = getFlatValues();
      if (flat.length) {
        setForm((prev) => ({
          ...prev,
          sku: generateSKU(
            flat.map((id) => ({ value: id })) // simple fallback
          ),
        }));
      }
    }
  }, [selectedValues]);

  // 🔹 Submit
  const handleSubmit = async () => {
    try {
      if (data) {
        // ✅ UPDATE
        await putData({
          url: `/vendor/product-variants/${data.id}`,
          data: form,
        });
      } else {
        // ✅ CREATE (with image support)
        const formData = new FormData();

        Object.keys(form).forEach((key) => {
          if (form[key] !== null) {
            formData.append(key, form[key]);
          }
        });

        getFlatValues().forEach((id) => {
          formData.append("attribute_value_ids[]", id);
        });

        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: formData,
          isFormData: true,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Variant Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg">

        {/* 🔹 HEADER */}
        <h2 className="text-xl font-bold mb-4">
          {data ? "Edit Variant" : "Create Variant"}
        </h2>

        {/* 🔹 FORM */}
        <div className="grid grid-cols-2 gap-3">

          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="border p-2 rounded"
          />

          <input
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
            placeholder="Barcode"
            className="border p-2 rounded"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded"
          />

          <input
            name="discount_price"
            value={form.discount_price}
            onChange={handleChange}
            placeholder="Discount Price"
            className="border p-2 rounded"
          />

          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border p-2 rounded"
          />

          <input
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Weight"
            className="border p-2 rounded"
          />

        </div>

        {/* 🔥 IMAGE UPLOAD */}
        {!data && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-600">
              Variant Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        )}

        {/* 🔥 ATTRIBUTE SELECTOR */}
        {!data && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-2">
              Select Attributes
            </h3>

            <AttributeSelector
              selected={selectedValues}
              onChange={setSelectedValues}
            />
          </div>
        )}

        {/* 🔹 ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#7a1c3d] text-white px-5 py-2 rounded-lg"
          >
            {data ? "Update Variant" : "Create Variant"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default VariantForm;
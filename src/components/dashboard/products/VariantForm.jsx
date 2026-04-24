// src/components/dashboard/products/VariantForm.jsx

import React, { useEffect, useState } from "react";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import AttributeSelector from "./AttributeSelector";
import { getImageUrl } from "../../../utils/getImageUrl";

// 🔥 REAL SKU GENERATOR (FIXED)
const generateSKU = (values = [], attributes = []) => {
  return values
    .map((id) => {
      const attr = attributes.find((a) =>
        a.values.some((v) => v.id === id)
      );
      const val = attr?.values.find((v) => v.id === id);
      return val?.value?.toUpperCase().replace(/\s/g, "");
    })
    .join("-");
};

const VariantForm = ({ productId, data, onClose, onSuccess }) => {
  const { postData, loading: postLoading } = usePost();
  const { putData, loading: putLoading } = usePut();

  const [attributes, setAttributes] = useState([]);

  const [form, setForm] = useState({
    sku: data?.sku || "",
    barcode: data?.barcode || "",
    price: data?.price || "",
    discount_price: data?.discount_price || "",
    stock: data?.stock || "",
    weight: data?.weight || "",
    images: [],
    previews: [],
  });

const API_URL = import.meta.env.VITE_API_URL;

const [preview, setPreview] = useState(
  data?.image
    ? getImageUrl(data.image)
    : null
);

// 🔥 GROUPED STATE
const [selectedValues, setSelectedValues] = useState({});

// 🔹 LOAD ATTRIBUTES
useEffect(() => {
  const fetchAttributes = async () => {
    try {
      const res = await fetch(
        `${API_URL}/admin/attributes-with-values`
      );

      const json = await res.json();
      setAttributes(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

    fetchAttributes();
  }, []);

  // 🔹 EDIT MODE → GROUPED FORMAT
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

  // 🔹 INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const files = Array.from(files);

      setForm(prev => ({
        ...prev,
        images: [...(prev.images || []), ...files],
      }));

      setPreview(prev => [
        ...(prev || []),
        ...files.map(f => URL.createObjectURL(f))
      ]);
    }
  }


  // 🔹 FLATTEN VALUES
  const getFlatValues = () => {
    return Object.values(selectedValues).flat();
  };

  // 🔥 AUTO SKU FIXED
  useEffect(() => {
    if (!data) {
      const flat = getFlatValues();

      if (flat.length && attributes.length) {
        setForm((prev) => ({
          ...prev,
          sku: generateSKU(flat, attributes),
        }));
      }
    }
  }, [selectedValues, attributes]);

  // 🔹 SUBMIT
  const handleSubmit = async () => {
    try {
      if (data) {
        // ✅ UPDATE
        const formData = new FormData();

        formData.append("price", Number(form.price));
        formData.append(
          "discount_price",
          Number(form.discount_price || 0)
        );
        formData.append("stock", Number(form.stock));
        formData.append("weight", Number(form.weight || 0));
        formData.append("barcode", form.barcode || "");


        if (form.images?.length) {
          form.images.forEach(img => {
            formData.append("images[]", img);
          });
        }

        await putData({
          url: `/vendor/product-variants/${data.id}`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      } else {
        // ✅ CREATE
        const formData = new FormData();

        formData.append("sku", form.sku);
        formData.append("barcode", form.barcode || "");
        formData.append("price", Number(form.price));
        formData.append(
          "discount_price",
          Number(form.discount_price || 0)
        );
        formData.append("stock", Number(form.stock));
        formData.append("weight", Number(form.weight || 0));

        if (form.image) {
          formData.append("image", form.image);
        }

        getFlatValues().forEach((id) => {
          formData.append("attribute_value_ids[]", id);
        });

        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Variant Saved ✅");
      onSuccess();
      onClose();

    } catch (err) {
      console.error("Variant Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg">

        {/* HEADER */}
        <h2 className="text-xl font-bold mb-4">
          {data ? "Edit Variant" : "Create Variant"}
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-3">

          {/* <input
            name="sku"
            value={form.sku}
            readOnly
            className="border p-2 rounded bg-gray-100"
          /> */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
              SKU: {form.sku}
            </span>
          </div>

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

        {/* IMAGE */}
        <div className="mt-4">
          <label className="text-sm font-medium">
            Variant Image
          </label>

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-1"
          />

          {preview && (
            <img
              src={preview}
              className="mt-2 h-24 rounded border"
            />
          )}
        </div>

        {/* ATTRIBUTES */}
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

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={postLoading || putLoading}
            className="bg-[#7a1c3d] text-white px-5 py-2 rounded-lg"
          >
            {data
              ? putLoading
                ? "Updating..."
                : "Update Variant"
              : postLoading
                ? "Creating..."
                : "Create Variant"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default VariantForm;
import React, { useEffect, useState } from "react";
import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useDelete from "../../../api/hooks/useDelete";
import AttributeSelector from "./AttributeSelector";

// 🔥 SKU GENERATOR
const generateSKU = (values, valueMap) => {
  return values
    .map((id) => valueMap[id]?.toUpperCase())
    .join("-");
};

const VariantSection = ({ productId }) => {
  // ✅ FIXED API
  const { data: attrData } = useGet("/admin/attributes-with-values");
  const { data: productData, refetch } = useGet(`/vendor/products/${productId}`);

  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();

  const attributes = attrData?.data || [];
  const existingVariants = productData?.data?.variants || [];

  const [selectedValues, setSelectedValues] = useState({});
  const [variants, setVariants] = useState([]);
  const [editableVariants, setEditableVariants] = useState([]);

  // ✅ LOAD EXISTING
  useEffect(() => {
    if (existingVariants.length) {
      setEditableVariants(existingVariants);
    }
  }, [existingVariants]);

  // 🔥 VALUE MAP
  const valueMap = {};
  attributes.forEach((attr) => {
    attr.values?.forEach((val) => {
      valueMap[val.id] = val.value;
    });
  });

  // ✅ GENERATE VARIANTS
  const generateVariants = () => {
    const values = Object.values(selectedValues);
    if (!values.length) return;

    const combine = (arr) =>
      arr.reduce(
        (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
        [[]]
      );

    const combos = combine(values);

    setVariants(
      combos.map((combo) => ({
        attribute_value_ids: combo,
        price: "",
        stock: "",
        sku: generateSKU(combo, valueMap), // 🔥 FIXED SKU
        image: null,
      }))
    );
  };

  // 🔥 HANDLE CHANGE
  const handleChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  // 🔥 IMAGE
  const handleImageChange = (i, file) => {
    const updated = [...variants];
    updated[i].image = file;
    setVariants(updated);
  };

  // 🔥 BULK
  const applyBulk = (field, value) => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        [field]: value,
      }))
    );
  };

  // ✅ CREATE
  const handleCreate = async () => {
    try {
      for (let v of variants) {
        const formData = new FormData();

        formData.append("sku", v.sku);
        formData.append("price", v.price);
        formData.append("stock", v.stock);

        if (v.image) {
          formData.append("image", v.image);
        }

        v.attribute_value_ids.forEach((id) => {
          formData.append("attribute_value_ids[]", id);
        });

        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: formData,
          isFormData: true,
        });
      }

      alert("Variants Created 🚀");
      setVariants([]);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ UPDATE
  const handleUpdate = async (variant) => {
    try {
      await putData({
        url: `/vendor/product-variants/${variant.id}`,
        data: {
          price: Number(variant.price),
          stock: Number(variant.stock),
        },
      });

      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete variant?")) return;

    try {
      await deleteData({
        url: `/vendor/product-variants/${id}`,
      });

      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-8">

      <h3 className="text-lg font-bold mb-4">Variants</h3>

      {/* 🔥 USE COMMON SELECTOR */}
      <AttributeSelector
        selected={selectedValues}
        onChange={setSelectedValues}
      />

      {/* GENERATE */}
      <button
        onClick={generateVariants}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Generate Variants
      </button>

      {/* NEW VARIANTS */}
      {variants.length > 0 && (
        <div className="mt-6">

          {/* BULK */}
          <div className="flex gap-2 mb-3">
            <input
              placeholder="Bulk Price"
              onBlur={(e) => applyBulk("price", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              placeholder="Bulk Stock"
              onBlur={(e) => applyBulk("stock", e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {variants.map((v, i) => (
            <div key={i} className="border p-3 rounded mb-2">

              <div className="font-medium mb-2">
                {v.attribute_value_ids.map(id => valueMap[id]).join(" - ")}
              </div>

              <div className="grid grid-cols-3 gap-2">

                <input
                  value={v.sku}
                  onChange={(e) => handleChange(i, "sku", e.target.value)}
                  className="border p-2 rounded"
                />

                <input
                  value={v.price}
                  onChange={(e) => handleChange(i, "price", e.target.value)}
                  className="border p-2 rounded"
                />

                <input
                  value={v.stock}
                  onChange={(e) => handleChange(i, "stock", e.target.value)}
                  className="border p-2 rounded"
                />

              </div>

              {/* IMAGE */}
              <input
                type="file"
                onChange={(e) => handleImageChange(i, e.target.files[0])}
                className="mt-2"
              />

            </div>
          ))}

          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded mt-3"
          >
            Save Variants
          </button>

        </div>
      )}

      {/* EXISTING (UNCHANGED BUT CLEAN) */}
      <div className="mt-6">

        <h4 className="font-semibold mb-2">Existing Variants</h4>

        {editableVariants.map((v, i) => (
          <div key={v.id} className="border p-3 rounded mb-2">

            <div className="mb-2">
              {v.attribute_values?.map(val => val.value).join(" - ")}
            </div>

            <div className="flex gap-2">
              <input
                value={v.price}
                onChange={(e) =>
                  handleExistingChange(i, "price", e.target.value)
                }
                className="border p-2"
              />

              <input
                value={v.stock}
                onChange={(e) =>
                  handleExistingChange(i, "stock", e.target.value)
                }
                className="border p-2"
              />

              <button
                onClick={() => handleUpdate(v)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Update
              </button>

              <button
                onClick={() => handleDelete(v.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default VariantSection;
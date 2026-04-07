import React, { useEffect, useState } from "react";
import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import useDelete from "../../../api/hooks/useDelete";
import AttributeSelector from "./AttributeSelector";
import { CloudCog } from "lucide-react";

// =========================
// 🔥 SKU GENERATOR
// =========================
const generateSKU = (values, valueMap) => {
  const base = values
    .map((id) => valueMap[id]?.toUpperCase())
    .filter(Boolean)
    .join("-");

  return base + "-" + Date.now(); // keep your logic
};

const VariantSection = ({ productId }) => {
  const { data: attrData } = useGet("/admin/attributes-with-values");
  const { data: productData, refetch } = useGet(
    `/vendor/products/${productId}`
  );

  const { postData } = usePost();
  const { putData } = usePut();
  const { deleteData } = useDelete();

  const attributes = (attrData?.data || []).filter(
    (a) => a.values?.length
  );

  const [selectedValues, setSelectedValues] = useState({});
  const [variants, setVariants] = useState([]);

  const editableVariants =
    productData?.data?.variants ||
    productData?.data?.data?.variants ||
    []; 
  // =========================
  // 🔥 VALUE MAP
  // =========================
  const valueMap = {};
  attributes.forEach((attr) => {
    attr.values.forEach((val) => {
      valueMap[val.id] = val.value;
    });
  });

  // =========================
  // 🔥 AUTO GENERATE
  // =========================
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
        sku: generateSKU(combo, valueMap),
        image: null,
      }))
    );
  };

  // =========================
  // 🔥 ADD CUSTOM VARIANT
  // =========================
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        attribute_value_ids: [],
        price: "",
        stock: "",
        sku: "",
        image: null,
      },
    ]);
  };

  // =========================
  // 🔥 HANDLE DROPDOWN
  // =========================
  const handleVariantValueChange = (index, attrId, valueId) => {
    const updated = [...variants];

    const existing = updated[index].attribute_value_ids.filter(
      (id) =>
        !attributes
          .find((a) => a.id === attrId)
          ?.values.map((v) => v.id)
          .includes(id)
    );

    updated[index].attribute_value_ids = [
      ...existing,
      Number(valueId),
    ];

    updated[index].sku = generateSKU(
      updated[index].attribute_value_ids,
      valueMap
    );

    setVariants(updated);
  };

  const handleChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  const handleImageChange = (i, file) => {
    const updated = [...variants];
    updated[i].image = file;
    setVariants(updated);
  };

  // =========================
  // 🔥 SAVE VARIANTS
  // =========================
  const handleCreate = async () => {
    try {
      for (let v of variants) {

        // 🔥 DUPLICATE CHECK (FIXED POSITION)
        const isDuplicate = editableVariants.some((ev) => {
          return (
            ev.attribute_values
              ?.map((val) => val.id)
              .sort()
              .join(",") ===
            v.attribute_value_ids.slice().sort().join(",")
          );
        });

        if (isDuplicate) {
          alert("Variant already exists ⚠️");
          continue; // skip duplicate, don't break app
        }

        const formData = new FormData();

        formData.append("sku", v.sku);
        formData.append("price", Number(v.price || 0));
        formData.append("stock", Number(v.stock || 0));

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
      await refetch();

    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // 🔥 DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete variant?")) return;

    await deleteData({
      url: `/vendor/product-variants/${id}`,
    });

    refetch();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Variants</h3>

      <AttributeSelector
        selected={selectedValues}
        onChange={setSelectedValues}
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={generateVariants}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Auto Generate
        </button>

        <button
          onClick={addVariant}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Variant
        </button>
      </div>

      {/* CUSTOM VARIANTS */}
      {variants.map((v, i) => (
        <div key={i} className="border p-4 mt-4 rounded">

          <div className="grid grid-cols-3 gap-2 mb-3">
            {attributes.map((attr) => (
              <select
                key={attr.id}
                onChange={(e) =>
                  handleVariantValueChange(i, attr.id, e.target.value)
                }
                className="border p-2 rounded"
              >
                <option>Select {attr.name}</option>
                {attr.values.map((val) => (
                  <option key={val.id} value={val.id}>
                    {val.value}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <div className="mb-2 text-sm text-gray-600">
            SKU: {v.sku}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Price"
              value={v.price ?? ""}
              onChange={(e) =>
                handleChange(i, "price", e.target.value)
              }
              className="border p-2"
            />

            <input
              placeholder="Stock"
              value={v.stock ?? ""}
              onChange={(e) =>
                handleChange(i, "stock", e.target.value)
              }
              className="border p-2"
            />
          </div>

          <input
            type="file"
            onChange={(e) =>
              handleImageChange(i, e.target.files[0])
            }
            className="mt-2"
          />
        </div>
      ))}

      {variants.length > 0 && (
        <button
          onClick={handleCreate}
          className="bg-green-700 text-white px-4 py-2 mt-4 rounded"
        >
          Save Variants
        </button>
      )}

      {/* EXISTING */}
      <div className="mt-6">
        <h4 className="font-semibold">Existing Variants</h4>

        {editableVariants.length === 0 ? (
          <p className="text-gray-400 mt-2">
            No variants found
          </p>
        ) : (
          editableVariants.map((v) => (
            <div
              key={v.id}
              className="border p-3 mt-2 rounded flex justify-between items-center"
            >
              <div>
                {v.attribute_values
                  ?.map((val) => val.value)
                  .join(" - ")}
              </div>

              <button
                onClick={() => handleDelete(v.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VariantSection;
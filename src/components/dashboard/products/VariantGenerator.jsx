// src/components/dashboard/products/VariantGenerator.jsx

import { useState } from "react";
import usePost from "../../../api/hooks/usePost";

// 🔥 SKU GENERATOR
const generateSKU = (values = []) => {
  return values
    .map((v) => v.value?.toUpperCase().replace(/\s/g, ""))
    .join("-");
};

// 🔥 COMBINATION LOGIC
const generateCombinations = (arrays) => {
  if (!arrays.length) return [];

  return arrays.reduce(
    (acc, curr) =>
      acc.flatMap((a) => curr.map((b) => [...a, b])),
    [[]]
  );
};

const VariantGenerator = ({
  productId,
  attributes = [],
  selectedValues,
  selectedAttributes,
}) => {
  const [variants, setVariants] = useState([]);
  const { postData, loading } = usePost();

  const [bulk, setBulk] = useState({
    price: "",
    stock: "",
    discount_price: "",
  });

  // ✅ HANDLE BOTH TYPES
  const selected = selectedValues || selectedAttributes || {};

  // =========================
  // 🔥 AUTO GENERATE
  // =========================
  const generate = () => {
    if (!selected || Object.keys(selected).length === 0) {
      alert("Select attributes first");
      return;
    }

    const grouped = {};

    attributes.forEach((attr) => {
      const selectedIds = selected[attr.id] || [];

      const vals = attr.values.filter((v) =>
        selectedIds.includes(v.id)
      );

      if (vals.length) {
        grouped[attr.id] = vals;
      }
    });

    const combos = generateCombinations(Object.values(grouped));

    if (!combos.length) {
      alert("No combinations generated");
      return;
    }

    const result = combos.map((combo) => ({
      values: combo,
      sku: generateSKU(combo),
      price: "",
      discount_price: "",
      stock: "",
      weight: "",
      barcode: "",
      image: null,
      preview: null,
    }));

    setVariants(result);
  };

  // =========================
  // 🔥 ADD CUSTOM VARIANT
  // =========================
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        values: [],
        sku: "",
        price: "",
        stock: "",
        discount_price: "",
        weight: "",
        barcode: "",
        image: null,
        preview: null,
      },
    ]);
  };

  // =========================
  // 🔥 SELECT VALUE PER ATTRIBUTE
  // =========================
  const handleSelect = (variantIndex, attrId, valueId) => {
    const updated = [...variants];

    const attr = attributes.find((a) => a.id === attrId);

    // remove old value of same attribute
    updated[variantIndex].values =
      updated[variantIndex].values.filter(
        (v) => !attr.values.map((x) => x.id).includes(v.id)
      );

    // add new value
    const selectedVal = attr.values.find(
      (v) => v.id === Number(valueId)
    );

    if (selectedVal) {
      updated[variantIndex].values.push(selectedVal);
    }

    // regenerate SKU
    updated[variantIndex].sku = generateSKU(
      updated[variantIndex].values
    );

    setVariants(updated);
  };

  // =========================
  // 🔥 HANDLE INPUT
  // =========================
  const handleChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  // =========================
  // 🔥 IMAGE
  // =========================
  const handleImageChange = (i, file) => {
    const updated = [...variants];
    updated[i].image = file;
    updated[i].preview = URL.createObjectURL(file);
    setVariants(updated);
  };

  // =========================
  // 🔥 BULK APPLY
  // =========================
  const applyBulk = () => {
    const updated = variants.map((v) => ({
      ...v,
      price: bulk.price || v.price,
      stock: bulk.stock || v.stock,
      discount_price: bulk.discount_price || v.discount_price,
    }));

    setVariants(updated);
  };

  // =========================
  // 🔥 SAVE
  // =========================
  const handleSaveAll = async () => {
    try {
      for (const v of variants) {
        const formData = new FormData();

        formData.append("sku", v.sku);
        formData.append("price", Number(v.price || 0));
        formData.append("discount_price", Number(v.discount_price || 0));
        formData.append("stock", Number(v.stock || 0));
        formData.append("weight", Number(v.weight || 0));
        formData.append("barcode", v.barcode || "");

        if (v.image) {
          formData.append("image", v.image);
        }

        v.values.forEach((val) => {
          formData.append("attribute_value_ids[]", val.id);
        });

        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Variants Created 🚀");
      setVariants([]);
    } catch (err) {
      console.error(err);
      alert("Error saving variants");
    }
  };

  return (
    <div className="mt-6">

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <button
          onClick={generate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
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

      {/* VARIANTS */}
      {variants.length > 0 && (
        <div className="mt-4 space-y-4">

          {/* BULK */}
          <div className="flex gap-2 p-3 border rounded bg-gray-50">
            <input
              placeholder="Bulk Price"
              value={bulk.price}
              onChange={(e) =>
                setBulk({ ...bulk, price: e.target.value })
              }
              className="border p-2"
            />
            <input
              placeholder="Bulk Stock"
              value={bulk.stock}
              onChange={(e) =>
                setBulk({ ...bulk, stock: e.target.value })
              }
              className="border p-2"
            />
            <button
              onClick={applyBulk}
              className="bg-black text-white px-3"
            >
              Apply
            </button>
          </div>

          {variants.map((v, i) => (
            <div key={i} className="border p-4 rounded">

              {/* ATTRIBUTE SELECTORS */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {attributes.map((attr) => (
                  <select
                    key={attr.id}
                    onChange={(e) =>
                      handleSelect(i, attr.id, e.target.value)
                    }
                    className="border p-2"
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

              {/* SKU */}
              <div className="text-sm mb-2">
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

          <button
            onClick={handleSaveAll}
            className="bg-purple-700 text-white px-5 py-2 rounded"
          >
            Save Variants
          </button>

        </div>
      )}

    </div>
  );
};

export default VariantGenerator;
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
  attributes,
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

  // ✅ HANDLE ALL TYPES OF INPUT
  const selected = selectedValues || selectedAttributes || [];

  // 🔹 GENERATE VARIANTS
  const generate = () => {
    console.log("SELECTED:", selected);

    if (
      !selected ||
      (Array.isArray(selected) && selected.length === 0) ||
      (typeof selected === "object" &&
        !Array.isArray(selected) &&
        Object.keys(selected).length === 0)
    ) {
      alert("Please select attributes first");
      return;
    }

    const grouped = {};

    attributes.forEach((attr) => {
      let vals = [];

      // ✅ CASE 1: FLAT ARRAY ( [1,2] OR [{id:1}] )
      if (Array.isArray(selected)) {
        vals = attr.values.filter((v) =>
          selected.some((s) =>
            typeof s === "object" ? s.id === v.id : s === v.id
          )
        );
      }

      // ✅ CASE 2: GROUPED OBJECT ( { color:[1], size:[2] } )
      else if (typeof selected === "object") {
        const selectedIds = selected[attr.id] || [];

        vals = attr.values.filter((v) =>
          selectedIds.includes(v.id)
        );
      }

      if (vals.length) {
        grouped[attr.id] = vals;
      }
    });

    const combos = generateCombinations(Object.values(grouped));

    if (!combos.length) {
      alert("No valid combinations generated");
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

  // 🔹 HANDLE INPUT
  const handleChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // 🔥 IMAGE HANDLER
  const handleImageChange = (index, file) => {
    const updated = [...variants];

    updated[index].image = file;
    updated[index].preview = URL.createObjectURL(file);

    setVariants(updated);
  };

  // 🔥 BULK APPLY
  const applyBulk = () => {
    const updated = variants.map((v) => ({
      ...v,
      price: bulk.price || v.price,
      stock: bulk.stock || v.stock,
      discount_price: bulk.discount_price || v.discount_price,
    }));

    setVariants(updated);
  };

  // 🔹 SAVE ALL VARIANTS
  const handleSaveAll = async () => {
    try {
      for (const v of variants) {
        const formData = new FormData();

        formData.append("sku", v.sku);
        formData.append("barcode", v.barcode || "");
        formData.append("price", Number(v.price || 0));
        formData.append(
          "discount_price",
          Number(v.discount_price || 0)
        );
        formData.append("stock", Number(v.stock || 0));
        formData.append("weight", Number(v.weight || 0));

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

      alert("Variants Created Successfully 🚀");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error saving variants");
    }
  };

  return (
    <div className="mt-6">

      {/* GENERATE */}
      <button
        onClick={generate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Generate Variants
      </button>

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
              className="border p-2 rounded"
            />

            <input
              placeholder="Bulk Discount"
              value={bulk.discount_price}
              onChange={(e) =>
                setBulk({
                  ...bulk,
                  discount_price: e.target.value,
                })
              }
              className="border p-2 rounded"
            />

            <input
              placeholder="Bulk Stock"
              value={bulk.stock}
              onChange={(e) =>
                setBulk({ ...bulk, stock: e.target.value })
              }
              className="border p-2 rounded"
            />

            <button
              onClick={applyBulk}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Apply
            </button>
          </div>

          {variants.map((v, i) => (
            <div key={i} className="border p-4 rounded-xl">

              {/* VALUES */}
              <div className="font-medium mb-3 text-[#7a1c3d]">
                {v.values.map((x) => x.value).join(" / ")}
              </div>

              {/* FORM */}
              <div className="grid grid-cols-3 gap-2">

                <input
                  value={v.sku}
                  readOnly
                  className="border p-2 rounded bg-gray-100"
                />

                <input
                  value={v.barcode}
                  onChange={(e) =>
                    handleChange(i, "barcode", e.target.value)
                  }
                  placeholder="Barcode"
                  className="border p-2 rounded"
                />

                <input
                  value={v.price ?? ""}
                  onChange={(e) =>
                    handleChange(i, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="border p-2 rounded"
                />

                <input
                  value={v.discount_price ?? ""}
                  onChange={(e) =>
                    handleChange(i, "discount_price", e.target.value)
                  }
                  placeholder="Discount Price"
                  className="border p-2 rounded"
                />

                <input
                  value={v.stock ?? ""}
                  onChange={(e) =>
                    handleChange(i, "stock", e.target.value)
                  }
                  placeholder="Stock"
                  className="border p-2 rounded"
                />

                <input
                  value={v.weight ?? ""}
                  onChange={(e) =>
                    handleChange(i, "weight", e.target.value)
                  }
                  placeholder="Weight"
                  className="border p-2 rounded"
                />

              </div>

              {/* IMAGE */}
              <div className="mt-3">
                <input
                  type="file"
                  onChange={(e) =>
                    handleImageChange(i, e.target.files[0])
                  }
                />

                {v.preview && (
                  <img
                    src={v.preview}
                    className="mt-2 h-20 rounded"
                  />
                )}
              </div>

            </div>
          ))}

          {/* SAVE */}
          <button
            onClick={handleSaveAll}
            disabled={loading}
            className="bg-[#7a1c3d] text-white px-5 py-2 rounded"
          >
            {loading ? "Saving..." : "Save All Variants"}
          </button>

        </div>
      )}

    </div>
  );
};

export default VariantGenerator;
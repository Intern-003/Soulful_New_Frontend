// src/components/dashboard/products/VariantGenerator.jsx

import { useState } from "react";
import usePost from "../../../api/hooks/usePost";

// 🔥 SKU GENERATOR
const generateSKU = (values = []) => {
  return values.map((v) => v.value?.toUpperCase()).join("-");
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

const VariantGenerator = ({ productId, attributes, selectedValues }) => {
  const [variants, setVariants] = useState([]);
  const { postData, loading } = usePost();

  // 🔹 GENERATE VARIANTS
  const generate = () => {
    const grouped = {};

    // ✅ FIXED (grouped structure)
    attributes.forEach((attr) => {
      const selectedIds = selectedValues[attr.id] || [];

      const vals = attr.values.filter((v) =>
        selectedIds.includes(v.id)
      );

      if (vals.length) {
        grouped[attr.id] = vals;
      }
    });

    const arrays = Object.values(grouped);

    const combos = generateCombinations(arrays);

    const result = combos.map((combo) => ({
      values: combo,
      sku: generateSKU(combo), // 🔥 AUTO SKU
      price: "",
      discount_price: "",
      stock: "",
      weight: "",
      barcode: "",
      image: null,
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
    setVariants(updated);
  };

  // 🔥 BULK APPLY
  const applyBulk = (field, value) => {
    const updated = variants.map((v) => ({
      ...v,
      [field]: value,
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
        formData.append("price", v.price);
        formData.append("discount_price", v.discount_price || 0);
        formData.append("stock", v.stock);
        formData.append("weight", v.weight || 0);

        if (v.image) {
          formData.append("image", v.image);
        }

        v.values.forEach((val) => {
          formData.append("attribute_value_ids[]", val.id);
        });

        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: formData,
          isFormData: true,
        });
      }

      alert("Variants Created Successfully 🚀");
    } catch (err) {
      console.error(err);
      alert("Error saving variants");
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

          {/* 🔥 BULK CONTROLS */}
          <div className="flex gap-2">
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
            <div key={i} className="border p-4 rounded-xl">

              {/* VALUES */}
              <div className="font-medium mb-3 text-[#7a1c3d]">
                {v.values.map((x) => x.value).join(" / ")}
              </div>

              {/* FORM */}
              <div className="grid grid-cols-3 gap-2">

                <input
                  value={v.sku}
                  onChange={(e) =>
                    handleChange(i, "sku", e.target.value)
                  }
                  placeholder="SKU"
                  className="border p-2 rounded"
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
                  value={v.price}
                  onChange={(e) =>
                    handleChange(i, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="border p-2 rounded"
                />

                <input
                  value={v.discount_price}
                  onChange={(e) =>
                    handleChange(i, "discount_price", e.target.value)
                  }
                  placeholder="Discount Price"
                  className="border p-2 rounded"
                />

                <input
                  value={v.stock}
                  onChange={(e) =>
                    handleChange(i, "stock", e.target.value)
                  }
                  placeholder="Stock"
                  className="border p-2 rounded"
                />

                <input
                  value={v.weight}
                  onChange={(e) =>
                    handleChange(i, "weight", e.target.value)
                  }
                  placeholder="Weight"
                  className="border p-2 rounded"
                />

              </div>

              {/* 🔥 IMAGE */}
              <div className="mt-3">
                <input
                  type="file"
                  onChange={(e) =>
                    handleImageChange(i, e.target.files[0])
                  }
                />
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
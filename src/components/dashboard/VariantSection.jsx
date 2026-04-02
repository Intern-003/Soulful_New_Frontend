import React, { useEffect, useState } from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import usePut from "../../api/hooks/usePut";
import useDelete from "../../api/hooks/useDelete";

const VariantSection = ({ productId }) => {
  const { data: attrData } = useGet("/admin/attributes");
  const { data: productData, refetch } = useGet(`/vendor/products/${productId}`);

  const { postData } = usePost("");
  const { putData } = usePut("");
  const { deleteData } = useDelete("");

  const attributes = attrData?.data || [];
  const existingVariants = productData?.data?.variants || [];

  const [selectedValues, setSelectedValues] = useState({});
  const [variants, setVariants] = useState([]);
  const [editableVariants, setEditableVariants] = useState([]);

  // ✅ LOAD EXISTING INTO STATE
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

  // ✅ SELECT VALUES
  const handleSelect = (attrId, valueId) => {
    setSelectedValues((prev) => {
      const existing = prev[attrId] || [];

      if (existing.includes(valueId)) {
        return {
          ...prev,
          [attrId]: existing.filter((v) => v !== valueId),
        };
      }

      return {
        ...prev,
        [attrId]: [...existing, valueId],
      };
    });
  };

  // ✅ GENERATE
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
      combos.map((combo, i) => ({
        attribute_value_ids: combo,
        price: "",
        stock: "",
        sku: `SKU-${Date.now()}-${i}`,
      }))
    );
  };

  // ✅ HANDLE NEW VARIANT CHANGE
  const handleNewChange = (i, field, value) => {
    const updated = [...variants];
    updated[i][field] = value;
    setVariants(updated);
  };

  // ✅ CREATE
  const handleCreate = async () => {
    try {
      for (let v of variants) {
        await postData({
          url: `/vendor/products/${productId}/variants`,
          data: {
            ...v,
            price: Number(v.price),
            stock: Number(v.stock),
          },
        });
      }

      alert("Variants Created");
      setVariants([]);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ HANDLE EXISTING CHANGE
  const handleExistingChange = (i, field, value) => {
    const updated = [...editableVariants];
    updated[i][field] = value;
    setEditableVariants(updated);
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

      {/* ATTRIBUTES */}
      {attributes.map((attr) => (
        <div key={attr.id} className="mb-4">
          <p className="font-medium">{attr.name}</p>

          <div className="flex gap-2 flex-wrap mt-2">
            {attr.values?.map((val) => (
              <button
                key={val.id}
                onClick={() => handleSelect(attr.id, val.id)}
                className={`px-3 py-1 border rounded ${
                  selectedValues[attr.id]?.includes(val.id)
                    ? "bg-[#7a1c3d] text-white"
                    : ""
                }`}
              >
                {val.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* GENERATE */}
      <button
        onClick={generateVariants}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Generate Variants
      </button>

      {/* NEW VARIANTS */}
      {variants.length > 0 && (
        <div className="mb-6">

          <h4 className="font-semibold mb-2">New Variants</h4>

          <table className="w-full bg-white shadow rounded text-sm">
            <tbody>
              {variants.map((v, i) => (
                <tr key={i} className="border-t">

                  <td className="p-2">
                    {v.attribute_value_ids.map(id => valueMap[id]).join(" - ")}
                  </td>

                  <td>
                    <input
                      value={v.price}
                      onChange={(e) => handleNewChange(i, "price", e.target.value)}
                      className="border p-1"
                    />
                  </td>

                  <td>
                    <input
                      value={v.stock}
                      onChange={(e) => handleNewChange(i, "stock", e.target.value)}
                      className="border p-1"
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleCreate}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Variants
          </button>

        </div>
      )}

      {/* EXISTING */}
      <div>

        <h4 className="font-semibold mb-2">Existing Variants</h4>

        <table className="w-full bg-white shadow rounded text-sm">
          <tbody>
            {editableVariants.map((v, i) => (
              <tr key={v.id} className="border-t">

                <td className="p-2">
                  {v.attribute_values?.map(val => val.value).join(" - ")}
                </td>

                <td>
                  <input
                    value={v.price}
                    onChange={(e) =>
                      handleExistingChange(i, "price", e.target.value)
                    }
                    className="border p-1"
                  />
                </td>

                <td>
                  <input
                    value={v.stock}
                    onChange={(e) =>
                      handleExistingChange(i, "stock", e.target.value)
                    }
                    className="border p-1"
                  />
                </td>

                <td className="flex gap-2">
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
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default VariantSection;
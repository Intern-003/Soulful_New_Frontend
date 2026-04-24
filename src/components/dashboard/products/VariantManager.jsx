// src/components/dashboard/products/VariantManager.jsx

import React, { useEffect, useState } from "react";
import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";
import VariantForm from "./VariantForm";
import { getImageUrl } from "../../../utils/getImageUrl";

const VariantManager = ({ productId }) => {
  const { data, loading, refetch } = useGet(
    `/vendor/products/${productId}`
  );

  const { deleteData } = useDelete();

  const [variants, setVariants] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // 🔥 SYNC DATA
  useEffect(() => {
    if (data?.data?.variants) {
      setVariants(data.data.variants);
    }
  }, [data]);

  // 🔥 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete variant?")) return;

    try {
      await deleteData({
        url: `/vendor/product-variants/${id}`,
      });

      setVariants((prev) =>
        prev.filter((v) => v.id !== id)
      );

      alert("Variant Deleted ❌");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SUCCESS
  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="mt-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Product Variants
        </h3>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
        >
          + Add Variant
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">
          Loading variants...
        </p>
      )}

      {/* EMPTY */}
      {!loading && variants.length === 0 && (
        <div className="text-center text-gray-500 py-10 border rounded-lg">
          No variants found. Create your first variant.
        </div>
      )}

      {/* TABLE */}
      {variants.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Attributes</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {variants.map((v) => (
                <tr
                  key={v.id}
                  className="border-t hover:bg-gray-50"
                >
                  {/* IMAGE */}
                  <td className="p-3">
                    {v.image ? (
                      <img
                        src={getImageUrl(v.image)}
                        alt="variant"
                        className="h-12 w-12 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/no-image.png";
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  {/* SKU */}
                  <td className="p-3 font-medium text-gray-800">
                    {v.sku}
                  </td>

                  {/* ATTRIBUTES */}
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {v.attribute_values?.map((attr) => (
                        <span
                          key={attr.id}
                          className="bg-gray-200 px-2 py-1 rounded text-xs"
                        >
                          {attr.value}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="p-3">
                    <div className="font-semibold text-gray-800">
                      ₹{v.discount_price || v.price}
                    </div>

                    {v.discount_price && (
                      <div className="text-xs text-gray-400 line-through">
                        ₹{v.price}
                      </div>
                    )}
                  </td>

                  {/* STOCK */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        v.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {v.stock > 0
                        ? `${v.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelected(v);
                        setOpen(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(v.id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <VariantForm
          productId={productId}
          data={selected}
          onClose={() => setOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default VariantManager;
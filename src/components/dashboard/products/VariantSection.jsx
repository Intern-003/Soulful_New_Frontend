import { useState, useEffect } from "react";
import usePost from "../../../api/hooks/usePost";
import useGet from "../../../api/hooks/useGet";

const VariantSection = ({ productId, attributes, generatedVariants }) => {
  const { data, refetch } = useGet(`/vendor/products/${productId}`);
  const { postData } = usePost();

  const existingVariants =
    data?.data?.variants || data?.data?.data?.variants || [];

  const allVariants = [...existingVariants, ...generatedVariants];

  const handleSave = async () => {
    for (let v of generatedVariants) {
      const fd = new FormData();

      fd.append("sku", v.sku);
      fd.append("price", v.price || 0);
      fd.append("stock", v.stock || 0);

      v.attribute_value_ids.forEach((id) => {
        fd.append("attribute_value_ids[]", id);
      });

      await postData({
        url: `/vendor/products/${productId}/variants`,
        data: fd,
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    alert("Variants Saved 🚀");
    refetch();
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold">Variants</h3>

      {allVariants.map((v, i) => (
        <div key={i} className="border p-3 mt-2">
          <div>SKU: {v.sku}</div>
          <div>Price: {v.price}</div>
          <div>Stock: {v.stock}</div>
        </div>
      ))}

      {generatedVariants.length > 0 && (
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 mt-4">
          Save Variants
        </button>
      )}
    </div>
  );
};

export default VariantSection;
import { useMemo } from "react";
import useGet from "../../../../api/hooks/useGet";
import { getImageUrl } from "../../../../utils/getImageUrl";

const ProductSelector = ({ selected = [], onChange, max = 4 }) => {
  const { data, loading, error } = useGet("/admin/products");

  // ================= NORMALIZE API =================
  const products = useMemo(() => {
    if (!data) return [];

    // Laravel pagination
    if (Array.isArray(data?.data?.data)) {
      return data.data.data;
    }

    // Normal API
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    // Direct array
    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }, [data]);

  // ================= SELECT LOGIC =================
  const handleSelect = (id) => {
    let updated = [];

    if (selected.includes(id)) {
      updated = selected.filter((i) => i !== id);
    } else {
      if (selected.length >= max) {
        alert(`You can select only ${max} products`);
        return;
      }
      updated = [...selected, id];
    }

    onChange(updated);
  };

  // ================= IMAGE HANDLER =================
  const getProductImage = (product) => {
    // Try all possible backend formats
    const img =
      product?.primary_image?.image_url ||
      product?.primaryImage?.image_url ||
      product?.image ||
      product?.images?.[0]?.image_url;

    if (!img) return null;

    return getImageUrl(img);
  };

  // ================= UI STATES =================

  if (loading) {
    return <p className="text-sm text-gray-500">Loading products...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-500">
        Failed to load products
      </p>
    );
  }

  if (!products.length) {
    return (
      <p className="text-sm text-gray-500">
        No products available
      </p>
    );
  }

  // ================= UI =================

  return (
    <div>
      {/* Header */}
      <p className="text-sm mb-2 text-gray-600">
        Select Products ({selected.length}/{max})
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
        {products.map((product) => {
          const isSelected = selected.includes(product.id);
          const image = getProductImage(product);

          return (
            <div
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className={`border rounded-lg p-2 cursor-pointer transition ${
                isSelected
                  ? "border-black ring-2 ring-black bg-gray-50"
                  : "hover:border-gray-400"
              }`}
            >
              {/* IMAGE */}
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                  className="w-full h-24 object-cover rounded"
                />
              ) : (
                <div className="w-full h-24 flex items-center justify-center bg-gray-100 text-xs text-gray-400 rounded">
                  No Image
                </div>
              )}

              {/* DETAILS */}
              <p className="text-sm mt-1 line-clamp-1 font-medium">
                {product.name}
              </p>

              <p className="text-xs text-gray-500">
                ₹{Number(product.price || 0).toLocaleString()}
              </p>

              {/* SELECTED BADGE */}
              {isSelected && (
                <div className="mt-1 text-[10px] text-green-600 font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSelector;
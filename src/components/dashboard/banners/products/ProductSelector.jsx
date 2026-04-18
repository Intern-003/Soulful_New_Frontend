import { useMemo } from "react";
import useGet from "../../../../api/hooks/useGet";
import { normalizeProductsFromApi, getProductImageUrl } from "../../../../utils/productHelpers";

const ProductSelector = ({ selected = [], onChange, layout = "grid" }) => {
  const { data, loading, error } = useGet("/admin/products");
  const products = normalizeProductsFromApi(data);

  const getMax = () => {
    if (layout === "highlight") return 1;
    if (layout === "grid") return 4;
    if (layout === "carousel") return Infinity;
    return 4;
  };

  const max = getMax();

  const handleSelect = (id) => {
    let updated = [];

    if (selected.includes(id)) {
      updated = selected.filter((i) => i !== id);
    } else {
      if (max !== Infinity && selected.length >= max) {
        alert(`You can select only ${max} products for ${layout} layout`);
        return;
      }
      updated = [...selected, id];
    }

    onChange(updated);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-500">Failed to load products</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm mb-3 text-gray-600 font-medium">
        Selected: {selected.length} / {max === Infinity ? "∞" : max}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
        {products.map((product) => {
          const isSelected = selected.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className={`border rounded-lg p-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-black ring-2 ring-black bg-gray-50"
                  : "hover:border-gray-400 hover:shadow-sm"
              }`}
            >
              <img
                src={getProductImageUrl(product)}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
                className="w-full h-24 sm:h-28 object-cover rounded"
              />
              <p className="text-xs sm:text-sm mt-1.5 line-clamp-1 font-medium">
                {product.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                ₹{Number(product.price || 0).toLocaleString()}
              </p>
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
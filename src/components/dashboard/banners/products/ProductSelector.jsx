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
        alert(`You can select only ${max} product${max > 1 ? 's' : ''} for ${layout} layout`);
        return;
      }
      updated = [...selected, id];
    }

    onChange(updated);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black"></div>
        <p className="text-sm text-gray-500 mt-3">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <svg className="w-12 h-12 mx-auto text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-red-600">Failed to load products</p>
        <p className="text-xs text-red-500 mt-1">Please try again later</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm text-gray-500">No products available</p>
        <p className="text-xs text-gray-400 mt-1">Add products to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-700">Select Products</p>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${selected.length === max && max !== Infinity ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          {selected.length} / {max === Infinity ? "∞" : max}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
        {products.map((product) => {
          const isSelected = selected.includes(product.id);
          const isDisabled = !isSelected && max !== Infinity && selected.length >= max;

          return (
            <div
              key={product.id}
              onClick={() => !isDisabled && handleSelect(product.id)}
              className={`group relative border rounded-xl p-2.5 transition-all duration-200 ${
                isSelected
                  ? "border-black ring-2 ring-black/20 bg-gradient-to-br from-gray-50 to-white shadow-md"
                  : isDisabled
                  ? "border-gray-200 opacity-50 cursor-not-allowed"
                  : "border-gray-200 hover:border-gray-400 hover:shadow-md cursor-pointer hover:scale-105"
              }`}
            >
              {isDisabled && (
                <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center z-10">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
              {/* Fixed aspect ratio image container */}
              <div className="relative w-full pt-[100%] mb-2">
                <img
                  src={getProductImageUrl(product)}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>
              <div className="mt-2">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-green-600">
                  ₹{Number(product.price || 0).toLocaleString()}
                </p>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-700 font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Selected
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ProductSelector;
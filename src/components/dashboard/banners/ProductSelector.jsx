// FILE: src/components/dashboard/banners/ProductSelector.jsx

import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, X, ImageOff } from "lucide-react";
import useGet from "../../../api/hooks/useGet";
import { getImageUrl } from "../../../utils/getImageUrl";

const ProductSelector = ({ selectedProducts = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Build URL with query params
  const apiUrl = useMemo(() => {
    let url = `/admin/products?page=${page}&per_page=${perPage}`;
    if (debouncedSearch) {
      url += `&search=${encodeURIComponent(debouncedSearch)}`;
    }
    return url;
  }, [page, debouncedSearch]);

  // Fetch products with pagination
  const { data, loading } = useGet(apiUrl, { autoFetch: isOpen });



  // Extract products and pagination from response
  const products = data?.data || [];
  const pagination = {
    current_page: data?.current_page || 1,
    last_page: data?.last_page || 1,
    total: data?.total || 0,
    per_page: data?.per_page || perPage
  };

  // Get product image using the utility function
  const getProductImageUrl = useCallback((product) => {
    let imagePath = null;

    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.is_primary === 1) || product.images[0];
      if (primaryImage?.image_url) {
        imagePath = primaryImage.image_url;
      }
    }

    return getImageUrl(imagePath);
  }, []);

  const isSelected = useCallback((productId) => {
    return selectedProducts.some(p => (p.id || p) === productId);
  }, [selectedProducts]);

  const toggleProduct = useCallback((product) => {
    const newSelection = isSelected(product.id)
      ? selectedProducts.filter(p => (p.id || p) !== product.id)
      : [...selectedProducts, product];
    onChange(newSelection);
  }, [selectedProducts, isSelected, onChange]);

  const removeProduct = useCallback((productId) => {
    onChange(selectedProducts.filter(p => (p.id || p) !== productId));
  }, [selectedProducts, onChange]);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      setPage(newPage);
    }
  }, [pagination.last_page]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Products
      </label>

      {/* Selected Products Display */}
      {selectedProducts.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg bg-gray-50">
          {selectedProducts.map(product => {
            const id = product.id || product;
            const name = product.name || `Product ${id}`;
            const imageUrl = getProductImageUrl(product);

            return (
              <div
                key={id}
                className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-sm shadow-sm"
              >
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                />
                <span className="max-w-[150px] truncate">{name}</span>
                <button
                  type="button"
                  onClick={() => removeProduct(id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Open Modal Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full border rounded-lg px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {selectedProducts.length === 0
          ? "Select products"
          : `${selectedProducts.length} product(s) selected`}
      </button>

      {/* Modal - Fixed positioning with proper z-index and responsiveness */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-xl z-10">
                <div>
                  <h3 className="text-lg font-semibold">Select Products</h3>
                  <p className="text-sm text-gray-500">Choose products for this banner</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b sticky top-[73px] bg-white z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7a1c3d]" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ImageOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No products found</p>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-2 text-sm text-[#7a1c3d] hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map(product => (
                      <div
                        key={product.id}
                        onClick={() => toggleProduct(product)}
                        className={`cursor-pointer border rounded-lg p-3 transition-all ${isSelected(product.id)
                            ? 'border-[#7a1c3d] bg-[#7a1c3d]/5 ring-2 ring-[#7a1c3d]/30'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                      >
                        <div className="aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={getProductImageUrl(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm truncate" title={product.name}>
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ₹{Number(product.price).toLocaleString()}
                          </p>
                        </div>
                        {isSelected(product.id) && (
                          <div className="mt-2 text-center">
                            <span className="text-xs text-[#7a1c3d] font-medium">✓ Selected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && pagination.last_page > 1 && (
                <div className="border-t p-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white rounded-b-xl">
                  <div className="text-sm text-gray-500 order-2 sm:order-1">
                    Page {pagination.current_page} of {pagination.last_page} ({pagination.total} products)
                  </div>
                  <div className="flex gap-2 order-1 sm:order-2">
                    <button
                      type="button"
                      onClick={() => goToPage(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => goToPage(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t p-4 flex justify-between items-center bg-white rounded-b-xl">
                <span className="text-sm text-gray-500">{selectedProducts.length} selected</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e1530] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(ProductSelector);
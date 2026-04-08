import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";

import Sidebar from "../../components/shop/Sidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/dashboard/products/ProductGrid";
import useGet from "../../api/hooks/useGet";

const ShopPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const parentCategories = useSelector(selectParentCategories);
  const { loading } = useSelector((state) => state.categories);

  const [showFilters, setShowFilters] = useState(false);

  // ✅ PRODUCTS
  const {
    data: productResponse,
    loading: productsLoading,
    error,
    refetch,
  } = useGet("/products", { autoFetch: false });

  const products = Array.isArray(productResponse?.data?.data)
    ? productResponse.data.data
    : [];

  // ✅ BRANDS
  const { data: brandResponse } = useGet("/brands");
  const brands = Array.isArray(brandResponse?.data?.data)
    ? brandResponse.data.data
    : [];

  // ✅ FILTER STATE
  const initialFilters = {
    category: null,
    brands: [],
    color: null,
    price: [0, 5000],
    search: "",
    sort: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ✅ API CALL
  const fetchProducts = useCallback((customFilters) => {
    const f = customFilters || filters;

    let url = "/products";
    let params = {};

    if (f.search) {
      url = "/products/search";
      params.q = f.search;
    } else {
      params.price_min = f.price[0];
      params.price_max = f.price[1];

      if (f.category) params.category_id = f.category;

      if (f.brands.length) {
        params["brands[]"] = f.brands;
      }

      if (f.color) params.color = f.color;
      if (f.sort) params.sort = f.sort;
    }

    refetch({ url, params });
  }, [filters, refetch]);

  // ✅ APPLY FILTERS (MAIN FIX)
  const handleApplyFilters = () => {
    // 👉 update URL ONLY when applying
    const params = {};

    if (filters.category) params.category = filters.category;
    if (filters.brands.length)
      params.brands = filters.brands.join(",");
    if (filters.color) params.color = filters.color;

    params.price_min = filters.price[0];
    params.price_max = filters.price[1];

    if (filters.search) params.q = filters.search;
    if (filters.sort) params.sort = filters.sort;

    setSearchParams(params);

    fetchProducts();
    setShowFilters(false); // close mobile drawer
  };

  // ✅ CLEAR FILTERS
  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchParams({});
    refetch({ url: "/products", params: {} });
  };

  // ✅ SEARCH (debounced)
  useEffect(() => {
    if (!filters.search) return;

    const delay = setTimeout(() => {
      fetchProducts(filters);
    }, 400);

    return () => clearTimeout(delay);
  }, [filters.search]);

  // ✅ HANDLER
  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="bg-gray-100 min-h-screen px-3 sm:px-4 lg:px-6 py-4">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Shop Products
        </h2>

        {/* MOBILE FILTER BUTTON */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(true)}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded w-full"
          >
            Show Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-[260px]">
            <Sidebar
              categories={parentCategories}
              brands={brands}
              loading={loading}
              selectedCategory={filters.category}
              selectedBrands={filters.brands}
              selectedColor={filters.color}
              priceRange={filters.price}
              onCategoryChange={(v) => updateFilter("category", v)}
              onBrandChange={(v) => updateFilter("brands", v)}
              onColorChange={(v) => updateFilter("color", v)}
              onPriceChange={(v) => updateFilter("price", v)}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* MOBILE DRAWER */}
          {showFilters && (
            <div className="fixed inset-0 z-50 flex bg-black/50">
              <div className="bg-white w-80 max-w-[85%] h-full p-4 overflow-y-auto">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>✕</button>
                </div>

                <Sidebar
                  categories={parentCategories}
                  brands={brands}
                  loading={loading}
                  selectedCategory={filters.category}
                  selectedBrands={filters.brands}
                  selectedColor={filters.color}
                  priceRange={filters.price}
                  onCategoryChange={(v) => updateFilter("category", v)}
                  onBrandChange={(v) => updateFilter("brands", v)}
                  onColorChange={(v) => updateFilter("color", v)}
                  onPriceChange={(v) => updateFilter("price", v)}
                  onApplyFilters={handleApplyFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>

              <div
                className="flex-1"
                onClick={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* MAIN */}
          <div className="flex-1">

            <ShopHeader
              searchValue={filters.search}
              onSearch={(v) => updateFilter("search", v)}
              onSortChange={(v) => updateFilter("sort", v)}
            />

            {error && (
              <p className="text-red-500 mb-3">
                Failed to load products
              </p>
            )}

            <ProductGrid
              products={products}
              loading={productsLoading}
              columns={4}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
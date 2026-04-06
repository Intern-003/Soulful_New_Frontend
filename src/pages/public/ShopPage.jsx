import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";

import Sidebar from "../../components/shop/Sidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/common/ProductGrid";

import useGet from "../../api/hooks/useGet";

const ShopPage = () => {
  const dispatch = useDispatch();

  const parentCategories = useSelector(selectParentCategories);
  const { loading: categoryLoading } = useSelector((state) => state.categories);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // ✅ FETCH DATA ONLY ONCE
  const { data: productResponse, loading: productsLoading } = useGet("/products");
  const { data: brandResponse } = useGet("/brands");

  const products = Array.isArray(productResponse?.data?.data)
    ? productResponse.data.data
    : [];
  

  const brands = Array.isArray(brandResponse?.data)
    ? brandResponse.data
    : [];
    console.log(brands)

  // ✅ FILTER STATE
  const [filters, setFilters] = useState({
    category: null,
    brands: [],
    color: null,
    price: [0, 1000000],
    search: "",
    sort: "",
  });

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ✅ UPDATE FILTER
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ CLEAR FILTERS
  const handleClearFilters = () => {
    setFilters({
      category: null,
      brands: [],
      color: null,
      price: [0, 1000000],
      search: "",
      sort: "",
    });
  };

  // ✅ DEBOUNCED SEARCH
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search.toLowerCase());
    }, 400);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // ✅ FILTER + SORT LOGIC (CLIENT SIDE)
  const filteredProducts = useMemo(() => {
  let result = [...products];

  // SEARCH
  if (debouncedSearch) {
    result = result.filter((p) =>
      p.name?.toLowerCase().includes(debouncedSearch)
    );
  }

  // CATEGORY
  if (filters.category) {
    result = result.filter(
      (p) => Number(p.category_id) === Number(filters.category)
    );
  }

  // BRANDS
  if (filters.brands.length) {
    result = result.filter((p) =>
      filters.brands.includes(Number(p.brand_id))
    );
  }

  // COLOR (if exists)
  if (filters.color) {
    result = result.filter(
      (p) => p.color?.toLowerCase() === filters.color
    );
  }

  // ✅ PRICE (IMPORTANT: convert to number)
  result = result.filter(
    (p) => {
      const price = Number(p.price);
      return price >= filters.price[0] && price <= filters.price[1];
    }
  );

  // SORT
  if (filters.sort === "price_asc") {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (filters.sort === "price_desc") {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return result;
}, [products, filters, debouncedSearch]);

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
              loading={categoryLoading}
              selectedCategory={filters.category}
              selectedBrands={filters.brands}
              selectedColor={filters.color}
              priceRange={filters.price}
              onCategoryChange={(v) => updateFilter("category", v)}
              onBrandChange={(v) => updateFilter("brands", v)}
              onColorChange={(v) => updateFilter("color", v)}
              onPriceChange={(v) => updateFilter("price", v)}
              onApplyFilters={() => setShowFilters(false)}
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
                  loading={categoryLoading}
                  selectedCategory={filters.category}
                  selectedBrands={filters.brands}
                  selectedColor={filters.color}
                  priceRange={filters.price}
                  onCategoryChange={(v) => updateFilter("category", v)}
                  onBrandChange={(v) => updateFilter("brands", v)}
                  onColorChange={(v) => updateFilter("color", v)}
                  onPriceChange={(v) => updateFilter("price", v)}
                  onApplyFilters={() => setShowFilters(false)}
                  onClearFilters={handleClearFilters}
                />
              </div>

              <div
                className="flex-1"
                onClick={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="flex-1">

            <ShopHeader
              searchValue={filters.search}
              sortValue={filters.sort}
              viewMode={viewMode}
              onSearch={(v) => updateFilter("search", v)}
              onSortChange={(v) => updateFilter("sort", v)}
              onViewChange={setViewMode}
            />

            <ProductGrid
              products={filteredProducts}
              loading={productsLoading}
              columns={4}
              viewMode={viewMode}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
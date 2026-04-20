import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";

import Sidebar from "../../components/shop/Sidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/dashboard/products/ProductGrid";
import useGet from "../../api/hooks/useGet";

const ShopPage = () => {
  const dispatch = useDispatch();

  const parentCategories = useSelector(selectParentCategories);
  const { loading } = useSelector((state) => state.categories);

  const [showFilters, setShowFilters] = useState(false);

  // PRODUCTS (ONLY ONE API)
  const {
    data: productResponse,
    loading: productsLoading,
    error,
  } = useGet("/products");

  const allProducts = Array.isArray(productResponse?.data?.data)
    ? productResponse.data.data
    : [];

  // BRANDS
  const { data: brandResponse } = useGet("/brands/active");
  const brands = Array.isArray(brandResponse)
    ? brandResponse
    : Array.isArray(brandResponse?.data)
      ? brandResponse.data
      : [];

  console.log("BRANDS:", brands);

  // FILTER STATE
  const initialFilters = {
    category: null,
    brands: [],
    color: null,
    price: [0, 0],
    search: "",
    sort: "",
  };

  const [filters, setFilters] = useState(initialFilters);
  const [priceBounds, setPriceBounds] = useState([0, 0]);
  const [viewMode, setViewMode] = useState("grid");

  // FETCH CATEGORIES
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!allProducts.length) return;

    // const prices = allProducts.map((p) => Number(p.price) || 0);
    const prices = allProducts.map(
      (p) => Number(p.discount_price || p.price) || 0,
    );

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    setPriceBounds([min, max]); // system range

    setFilters((prev) => ({
      ...prev,
      price: [min, max], // user range
    }));
  }, [allProducts]);

  // FRONTEND FILTER LOGIC (MAIN)
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const price = Number(p.discount_price || p.price) || 0;
        const categoryId = Number(p.category_id);
        const brandId = Number(p.brand_id);
        const color = p.color?.toLowerCase();

        //  SEARCH
        if (
          filters.search &&
          !p.name?.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }

        //  CATEGORY
        if (filters.category && categoryId !== Number(filters.category)) {
          return false;
        }

        //  BRANDS
        if (filters.brands.length && !filters.brands.includes(brandId)) {
          return false;
        }

        //  COLOR
        if (filters.color && color !== filters.color) {
          return false;
        }

        //  PRICE
        if (price < filters.price[0] || price > filters.price[1]) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.discount_price || a.price) || 0;
        const priceB = Number(b.discount_price || b.price) || 0;

        if (filters.sort === "price_asc") return priceA - priceB;
        if (filters.sort === "price_desc") return priceB - priceA;

        if (filters.sort === "name_asc") return a.name.localeCompare(b.name);

        if (filters.sort === "name_desc") return b.name.localeCompare(a.name);

        return 0;
      });
  }, [allProducts, filters]);

  // HANDLER
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    if (!allProducts.length) return;

    // const prices = allProducts.map((p) => Number(p.price) || 0);
    const prices = allProducts.map(
      (p) => Number(p.discount_price || p.price) || 0,
    );

    setFilters({
      category: null,
      brands: [],
      color: null,
      price: [Math.min(...prices), Math.max(...prices)],
      search: "",
      sort: "",
    });
  };

  return (
    <div
      className="     
      min-h-screen
      bg-gradient-to-b
      from-[#f1e4ea]
      via-[#f1e4ea]
      to-[#f1e4ea]
      "
    >
      {/* TOP HEADER */}
      <div className="bg-[#f6f1f3] border-b border-gray-200 py-6 px-4 mb-7 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-500">
            <span className="text-[#7a1c3d] font-medium cursor-pointer hover:underline">
              Home
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Shop Products</span>
          </p>

          {/* Title */}
          <div className="flex items-end justify-between mt-2">
            {/* LEFT */}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#2d0f1f]">
                Shop Products
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Showing{" "}
                <span className="text-[#7a1c3d] font-medium">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pb-30">
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
            <div className="sticky top-6">
              <Sidebar
                categories={parentCategories}
                brands={brands}
                loading={loading}
                selectedCategory={filters.category}
                selectedBrands={filters.brands}
                selectedColor={filters.color}
                priceRange={filters.price}
                maxPrice={priceBounds[1]}
                minPrice={priceBounds[0]}
                onCategoryChange={(v) => updateFilter("category", v)}
                onBrandChange={(v) => updateFilter("brands", v)}
                onColorChange={(v) => updateFilter("color", v)}
                onPriceChange={(v) => updateFilter("price", v)}
                onApplyFilters={() => {}} // no API call needed
                onClearFilters={handleClearFilters}
              />
            </div>
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
                  maxPrice={priceBounds[1]}
                  minPrice={priceBounds[0]}
                  onCategoryChange={(v) => updateFilter("category", v)}
                  onBrandChange={(v) => updateFilter("brands", v)}
                  onColorChange={(v) => updateFilter("color", v)}
                  onPriceChange={(v) => updateFilter("price", v)}
                  onApplyFilters={() => setShowFilters(false)}
                  onClearFilters={handleClearFilters}
                />
              </div>

              <div className="flex-1" onClick={() => setShowFilters(false)} />
            </div>
          )}

          {/* MAIN */}
          <div className="flex-1">
            <ShopHeader
              searchValue={filters.search}
              sortValue={filters.sort}
              viewMode={viewMode}
              onSearch={(v) => updateFilter("search", v)}
              onSortChange={(v) => updateFilter("sort", v)}
              onViewChange={(mode) => setViewMode(mode)} // IMPORTANT
            />

            {error && (
              <p className="text-red-500 mb-3">Failed to load products</p>
            )}

            <ProductGrid
              products={filteredProducts}
              loading={productsLoading}
              columns={viewMode === "grid" ? 4 : 1} // switch layout
              viewMode={viewMode} // optional for styling
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

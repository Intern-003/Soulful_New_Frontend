import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";

import Sidebar from "../../components/shop/CategorySidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/dashboard/products/ProductGrid";
import useGet from "../../api/hooks/useGet";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { slug } = useParams(); // 🔥 MAIN

  const parentCategories = useSelector(selectParentCategories);
  const allCategories = useSelector((state) => state.categories.all);
  const { loading } = useSelector((state) => state.categories);

  const [showFilters, setShowFilters] = useState(false);

  // PRODUCTS
  const {
    data: productResponse,
    loading: productsLoading,
    error,
  } = useGet("/products/latest");

  const allProducts = Array.isArray(productResponse?.data)
    ? productResponse.data
    : [];

  // BRANDS
  const { data: brandResponse } = useGet("/brands");
  const brands = Array.isArray(brandResponse?.data) ? brandResponse.data : [];

  // 🔥 CURRENT CATEGORY FROM SLUG
  // const currentCategory = useMemo(() => {
  //   return allCategories.find((cat) => cat.slug === slug);
  // }, [allCategories, slug]);
  const currentCategory = useMemo(() => {
    return allCategories.find(
      (cat) => cat.slug?.toLowerCase().trim() === slug?.toLowerCase().trim(),
    );
  }, [allCategories, slug]);

  // FILTER STATE
  const [filters, setFilters] = useState({
    category: null,
    brands: [],
    color: null,
    price: [0, 5000],
    search: "",
    sort: "",
  });

  const [priceBounds, setPriceBounds] = useState([0, 0]);
  const [viewMode, setViewMode] = useState("grid");

  // FETCH CATEGORIES
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // 🔥 AUTO APPLY CATEGORY FILTER FROM URL
  useEffect(() => {
    if (currentCategory?.id) {
      setFilters((prev) => ({
        ...prev,
        category: currentCategory.id,
      }));
    }
  }, [currentCategory]);

  // PRICE RANGE
  useEffect(() => {
    if (!allProducts.length) return;

    const prices = allProducts.map((p) => Number(p.price) || 0);

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    setPriceBounds([min, max]);

    setFilters((prev) => ({
      ...prev,
      price: [min, max],
    }));
  }, [allProducts]);

  // FILTER LOGIC
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const price = Number(p.price) || 0;
        const categoryId = Number(p.category_id);
        const brandId = Number(p.brand_id);
        const color = p.color?.toLowerCase();

        if (
          filters.search &&
          !p.name?.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false;

        if (filters.category && categoryId !== Number(filters.category))
          return false;

        if (filters.brands.length && !filters.brands.includes(brandId))
          return false;

        if (filters.color && color !== filters.color) return false;

        if (price < filters.price[0] || price > filters.price[1]) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;

        if (filters.sort === "price_asc") return priceA - priceB;
        if (filters.sort === "price_desc") return priceB - priceA;

        if (filters.sort === "name_asc") return a.name.localeCompare(b.name);

        if (filters.sort === "name_desc") return b.name.localeCompare(a.name);

        return 0;
      });
  }, [allProducts, filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    if (!allProducts.length) return;

    const prices = allProducts.map((p) => Number(p.price) || 0);

    setFilters({
      category: currentCategory?.id || null,
      brands: [],
      color: null,
      price: [Math.min(...prices), Math.max(...prices)],
      search: "",
      sort: "",
    });
  };

  if (slug && !currentCategory) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-semibold">Category not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-[#7a1c3d] underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1e4ea]">
      {/* HEADER */}
      <div className="bg-[#f6f1f3] border-b border-gray-200 py-6 px-4 mb-7 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500">
            <span
              onClick={() => navigate("/")}
              className="text-[#7a1c3d] cursor-pointer"
            >
              Home
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-700 capitalize">
              {currentCategory?.name || "Category"}
            </span>
          </p>

          <div className="mt-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#2d0f1f] capitalize">
              {currentCategory?.name || "Category"}
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

      <div className="max-w-7xl mx-auto pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
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
                priceBounds={priceBounds}
                onCategoryChange={(v) => updateFilter("category", v)}
                onBrandChange={(v) => updateFilter("brands", v)}
                onColorChange={(v) => updateFilter("color", v)}
                onPriceChange={(v) => updateFilter("price", v)}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* MAIN */}
          <div className="flex-1">
            <ShopHeader
              searchValue={filters.search}
              sortValue={filters.sort}
              viewMode={viewMode}
              onSearch={(v) => updateFilter("search", v)}
              onSortChange={(v) => updateFilter("sort", v)}
              onViewChange={(mode) => setViewMode(mode)}
            />

            {error && (
              <p className="text-red-500 mb-3">Failed to load products</p>
            )}

            <ProductGrid
              products={filteredProducts}
              loading={productsLoading}
              columns={viewMode === "grid" ? 4 : 1}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { fetchCategories } from "../../app/slices/categorySlice";

import Sidebar from "../../components/shop/CategorySidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/dashboard/products/ProductGrid";
import useGet from "../../api/hooks/useGet";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const allCategories = useSelector(
    (state) => state.categories.all || []
  );

  const { loading } = useSelector((state) => state.categories);

  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState({
    category: "ALL",
    brands: [],
    color: null,
    price: [0, 0],
    search: "",
    sort: "",
  });

  // =========================
  // SAFE CATEGORY MATCH
  // =========================
  const categoryMap = useMemo(() => {
    const map = new Map();

    if (!Array.isArray(allCategories)) {
      return map;
    }

    allCategories.forEach((cat) => {
      if (cat?.slug) {
        map.set(cat.slug.toLowerCase(), cat);
      }
    });

    return map;
  }, [allCategories]);


  const currentCategory = categoryMap.get(
    slug?.toLowerCase()
  );

  const categoryId = Number(currentCategory?.id || 0);

  // =========================
  // PRODUCTS - FETCH BY CATEGORY SLUG (USING BACKEND API)
  // =========================
  const {
    data: productResponse,
    loading: productsLoading,
    error,
  } = useGet(
    slug ? `/categories/${slug}/products` : null  // Using the backend products method
  );

  const allProducts = useMemo(() => {
    return Array.isArray(productResponse?.data?.data)
      ? productResponse.data.data.filter(Boolean)
      : [];
  }, [productResponse]);

  // =========================
  // SUBCATEGORIES (SAFE)
  // =========================
  const { data: subcategoryResponse } = useGet(
    categoryId ? `/categories/${categoryId}/children` : null
  );

  const subcategories = useMemo(() => {
    const data = subcategoryResponse?.data;
    return Array.isArray(data)
      ? data.filter((c) => c && c.id != null)
      : [];
  }, [subcategoryResponse]);

  const subcategoryIds = useMemo(() => {
    return subcategories
      .map((c) => Number(c?.id))
      .filter((id) => !isNaN(id));
  }, [subcategories]);

  const subcategorySet = useMemo(
    () => new Set(subcategoryIds),
    [subcategoryIds]
  );

  // =========================
  // BRANDS (SAFE)
  // =========================
  const { data: brandResponse } = useGet(
    categoryId ? `/brands/category/${categoryId}` : null
  );

  const brands = useMemo(() => {
    const raw = Array.isArray(brandResponse?.data)
      ? brandResponse.data.filter(Boolean)
      : [];

    return raw.filter((brand) => {
      const subs = Array.isArray(brand?.subcategories)
        ? brand.subcategories.filter(Boolean)
        : [];

      if (!subcategoryIds.length) return true;

      return subs.some((sub) => {
        const subId = Number(sub?.id);
        const parentId = Number(sub?.parent_id);

        return (
          subcategorySet.has(subId) ||
          parentId === categoryId
        );
      });
    });
  }, [brandResponse, subcategorySet, categoryId]);

  // =========================
  // PRICE BOUNDS
  // =========================
  const priceBounds = useMemo(() => {
    if (!allProducts.length) return [0, 0];

    let min = Infinity;
    let max = 0;

    allProducts.forEach((p) => {
      const price = Number(
        p?.discount_price || p?.price || 0
      );

      if (price < min) min = price;
      if (price > max) max = price;
    });

    return [min, max];
  }, [allProducts]);

  // init price
  useEffect(() => {
    if (!allProducts.length) return;

    setFilters((prev) => {
      if (prev.price[0] !== 0 || prev.price[1] !== 0) {
        return prev;
      }

      return {
        ...prev,
        price: priceBounds,
      };
    });
  }, [priceBounds, allProducts.length]);


  // =========================
  // FILTER LOGIC
  // =========================
  const filteredProducts = useMemo(() => {
    const searchTerm = filters.search.toLowerCase();

    let filtered = [...allProducts];

    filtered = filtered.filter((p) => {
      if (!p) return false;

      const productBrandId = Number(p?.brand_id);
      const price = Number(
        p?.discount_price || p?.price || 0
      );

      if (
        filters.search &&
        !(p?.name || "")
          .toLowerCase()
          .includes(searchTerm)) {
        return false;
      }

      if (
        filters.category !== "ALL" &&
        Number(filters.category) !== Number(p?.category_id)
      ) {
        return false;
      }

      if (
        filters.brands.length &&
        !filters.brands.includes(productBrandId)
      ) {
        return false;
      }

      if (
        filters.color &&
        (p?.color || "").toLowerCase() !==
        filters.color.toLowerCase()
      ) {
        return false;
      }

      const min = filters.price?.[0] ?? 0;
      const max = filters.price?.[1] ?? Infinity;

      if (price < min || price > max) {
        return false;
      }

      return true;
    });

    switch (filters.sort) {
      case "price_asc":
        filtered.sort(
          (a, b) =>
            Number(a.discount_price || a.price || 0) -
            Number(b.discount_price || b.price || 0)
        );
        break;

      case "price_desc":
        filtered.sort(
          (a, b) =>
            Number(b.discount_price || b.price || 0) -
            Number(a.discount_price || a.price || 0)
        );
        break;

      case "name_asc":
        filtered.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        break;

      case "name_desc":
        filtered.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [
    allProducts,
    filters.search,
    filters.category,
    filters.brands,
    filters.color,
    filters.price,
    filters.sort,
  ]);
  // =========================
  // FILTER HANDLER
  // =========================
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "ALL",
      brands: [],
      color: null,
      price: priceBounds,
      search: "",
      sort: "",
    });
  };

  // =========================
  // LOAD CATEGORIES
  // =========================
  const fetched = useSelector(
    (state) => state.categories.fetched
  );

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchCategories());
    }
  }, [dispatch, fetched]);

  useEffect(() => {
    setFilters({
      category: "ALL",
      brands: [],
      color: null,
      price: [0, 0],
      search: "",
      sort: "",
    });
  }, [slug]);
  // =========================
  // LOADING GUARD
  // =========================
  if (loading && !allCategories.length) {
    return (
      <div className="min-h-screen bg-[#f1e4ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (
    slug &&
    !loading &&
    allCategories.length > 0 &&
    !currentCategory
  ) {
    return (
      <div className="min-h-[60vh] bg-[#f1e4ea] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-3 text-[#2d0f1f]">Category Not Found</h2>
        <p className="text-gray-600 mb-6">The category "{slug}" does not exist.</p>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e142e] transition-colors"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  if (!currentCategory && loading) {
    return (
      <div className="min-h-screen bg-[#f1e4ea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }
  if (!currentCategory && !allCategories.length) {
    return (
      <div className="min-h-screen bg-[#f1e4ea] flex items-center justify-center">
        ...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f1e4ea]">
      {/* HEADER */}
      <div className="bg-[#f6f1f3] border-b py-6 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer text-[#7a1c3d] hover:underline"
            >
              Home
            </span>
            <span>/</span>
            <span className="text-gray-700 capitalize">{currentCategory.name}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-[#2d0f1f] capitalize">
            {currentCategory.name}
          </h1>

          {currentCategory.description && (
            <p className="text-gray-600 mt-1">{currentCategory.description}</p>
          )}

          <p className="text-sm text-gray-500 mt-2">
            Showing{" "}
            <span className="text-[#7a1c3d] font-medium">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-6">
              <Sidebar
                categories={subcategories}
                brands={brands}
                loading={false}
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
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* MAIN */}
          <div className="flex-1 min-w-0">
            <ShopHeader
              searchValue={filters.search}
              sortValue={filters.sort}
              viewMode={viewMode}
              onSearch={(v) => updateFilter("search", v)}
              onSortChange={(v) => updateFilter("sort", v)}
              onViewChange={setViewMode}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600">Failed to load products. Please try again.</p>
              </div>
            )}

            <ProductGrid
              products={filteredProducts}
              loading={productsLoading}
              viewMode={viewMode}
            />

            {!productsLoading && filteredProducts.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
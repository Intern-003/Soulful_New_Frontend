import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";
import Sidebar from "../../components/shop/Sidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/dashboard/products/ProductGrid";
import useGet from "../../api/hooks/useGet";
import { Link } from "react-router-dom";

const ShopPage = () => {
  const dispatch = useDispatch();

  const parentCategories = useSelector(
    selectParentCategories,
  );

  const { loading } = useSelector(
    (state) => state.categories,
  );

  const [showFilters, setShowFilters] =
    useState(false);

  const [viewMode, setViewMode] =
    useState("grid");

  // PRODUCTS
  const {
    data: productResponse,
    loading: productsLoading,
    error,
  } = useGet("/products");

  const allProducts = Array.isArray(
    productResponse?.data?.data,
  )
    ? productResponse.data.data
    : [];

  // BRANDS
  const { data: brandResponse } =
    useGet("/brands/active");

  const brands = Array.isArray(brandResponse)
    ? brandResponse
    : Array.isArray(brandResponse?.data)
      ? brandResponse.data
      : [];

  // FILTERS
  const initialFilters = {
    category: null,
    brands: [],
    color: null,
    price: [0, 0],
    search: "",
    sort: "",
  };

  const [filters, setFilters] =
    useState(initialFilters);

  const [priceBounds, setPriceBounds] =
    useState([0, 0]);

  // FETCH CATEGORIES
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // PRICE RANGE
  useEffect(() => {
    if (!allProducts.length) return;

    const prices = allProducts.map(
      (p) =>
        Number(
          p.discount_price || p.price,
        ) || 0,
    );

    const min = Math.min(...prices);

    const max = Math.max(...prices);

    setPriceBounds([min, max]);

    setFilters((prev) => ({
      ...prev,
      price: [min, max],
    }));
  }, [allProducts]);

  // FILTERED PRODUCTS
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        const price =
          Number(
            p.discount_price || p.price,
          ) || 0;

        const categoryId = Number(
          p.category_id,
        );

        const brandId = Number(
          p.brand_id,
        );

        const color =
          p.color?.toLowerCase();

        // SEARCH
        if (
          filters.search &&
          !p.name
            ?.toLowerCase()
            .includes(
              filters.search.toLowerCase(),
            )
        ) {
          return false;
        }

        // CATEGORY
        if (
          filters.category &&
          categoryId !==
            Number(filters.category)
        ) {
          return false;
        }

        // BRANDS
        if (
          filters.brands.length &&
          !filters.brands.includes(
            brandId,
          )
        ) {
          return false;
        }

        // COLOR
        if (
          filters.color &&
          color !== filters.color
        ) {
          return false;
        }

        // PRICE
        if (
          price < filters.price[0] ||
          price > filters.price[1]
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA =
          Number(
            a.discount_price || a.price,
          ) || 0;

        const priceB =
          Number(
            b.discount_price || b.price,
          ) || 0;

        if (
          filters.sort === "price_asc"
        ) {
          return priceA - priceB;
        }

        if (
          filters.sort === "price_desc"
        ) {
          return priceB - priceA;
        }

        if (
          filters.sort === "name_asc"
        ) {
          return a.name.localeCompare(
            b.name,
          );
        }

        if (
          filters.sort === "name_desc"
        ) {
          return b.name.localeCompare(
            a.name,
          );
        }

        return 0;
      });
  }, [allProducts, filters]);

  // UPDATE FILTER
  const updateFilter = (
    key,
    value,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    if (!allProducts.length) return;

    const prices = allProducts.map(
      (p) =>
        Number(
          p.discount_price || p.price,
        ) || 0,
    );

    setFilters({
      category: null,
      brands: [],
      color: null,
      price: [
        Math.min(...prices),
        Math.max(...prices),
      ],
      search: "",
      sort: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#fdf7f9] to-[#f6f1f3] border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
          {/* BREADCRUMB */}
        

<div className="flex items-center gap-2 text-sm text-gray-500">
  <Link
    to="/"
    className="hover:text-[#7a1c3d] transition"
  >
    Home
  </Link>

  <span>/</span>

  <span className="text-[#2d0f1f] font-medium">
    Shop Products
  </span>
</div>

          {/* TITLE */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 gap-3">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#2d0f1f]">
                Shop Products
              </h1>

              <p className="text-gray-500 mt-2">
                Showing{" "}
                <span className="font-semibold text-[#7a1c3d]">
                  {
                    filteredProducts.length
                  }
                </span>{" "}
                products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* MOBILE FILTER BUTTON */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() =>
              setShowFilters(true)
            }
            className="
              w-full
              h-12
              rounded-2xl
              bg-[#7a1c3d]
              text-white
              font-semibold
              shadow-lg
            "
          >
            Show Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-[290px] shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <Sidebar
                  categories={
                    parentCategories
                  }
                  brands={brands}
                  loading={loading}
                  selectedCategory={
                    filters.category
                  }
                  selectedBrands={
                    filters.brands
                  }
                  selectedColor={
                    filters.color
                  }
                  priceRange={
                    filters.price
                  }
                  maxPrice={
                    priceBounds[1]
                  }
                  minPrice={
                    priceBounds[0]
                  }
                  onCategoryChange={(
                    v,
                  ) =>
                    updateFilter(
                      "category",
                      v,
                    )
                  }
                  onBrandChange={(v) =>
                    updateFilter(
                      "brands",
                      v,
                    )
                  }
                  onColorChange={(v) =>
                    updateFilter(
                      "color",
                      v,
                    )
                  }
                  onPriceChange={(v) =>
                    updateFilter(
                      "price",
                      v,
                    )
                  }
                  onApplyFilters={() => {}}
                  onClearFilters={
                    handleClearFilters
                  }
                />
              </div>
            </div>
          </div>

          {/* MOBILE FILTER DRAWER */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-black/40 flex">
              <div className="bg-white w-[320px] max-w-[85%] h-full overflow-y-auto p-5">
                {/* TOP */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">
                    Filters
                  </h2>

                  <button
                    onClick={() =>
                      setShowFilters(
                        false,
                      )
                    }
                    className="text-xl"
                  >
                    ✕
                  </button>
                </div>

                <Sidebar
                  categories={
                    parentCategories
                  }
                  brands={brands}
                  loading={loading}
                  selectedCategory={
                    filters.category
                  }
                  selectedBrands={
                    filters.brands
                  }
                  selectedColor={
                    filters.color
                  }
                  priceRange={
                    filters.price
                  }
                  maxPrice={
                    priceBounds[1]
                  }
                  minPrice={
                    priceBounds[0]
                  }
                  onCategoryChange={(
                    v,
                  ) =>
                    updateFilter(
                      "category",
                      v,
                    )
                  }
                  onBrandChange={(v) =>
                    updateFilter(
                      "brands",
                      v,
                    )
                  }
                  onColorChange={(v) =>
                    updateFilter(
                      "color",
                      v,
                    )
                  }
                  onPriceChange={(v) =>
                    updateFilter(
                      "price",
                      v,
                    )
                  }
                  onApplyFilters={() =>
                    setShowFilters(
                      false,
                    )
                  }
                  onClearFilters={
                    handleClearFilters
                  }
                />
              </div>

              <div
                className="flex-1"
                onClick={() =>
                  setShowFilters(false)
                }
              />
            </div>
          )}

          {/* PRODUCTS */}
          <div className="flex-1 min-w-0">
            {/* SHOP HEADER */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6">
              <ShopHeader
                searchValue={
                  filters.search
                }
                sortValue={filters.sort}
                viewMode={viewMode}
                onSearch={(v) =>
                  updateFilter(
                    "search",
                    v,
                  )
                }
                onSortChange={(v) =>
                  updateFilter(
                    "sort",
                    v,
                  )
                }
                onViewChange={(mode) =>
                  setViewMode(mode)
                }
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-5">
                Failed to load products
              </div>
            )}

            {/* PRODUCT GRID */}
            <ProductGrid
              products={
                filteredProducts
              }
              loading={
                productsLoading
              }
              columns={
                viewMode === "grid"
                  ? 5
                  : 1
              }
              viewMode={viewMode}
              onClearFilters={
                handleClearFilters
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
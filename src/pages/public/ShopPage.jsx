import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";
import Sidebar from "../../components/shop/Sidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/dashboard/products/ProductGrid";
import useGet from "../../api/hooks/useGet";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ShopPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const parentCategories = useSelector(selectParentCategories);
  const { loading: categoriesLoading } = useSelector((state) => state.categories);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  // Build query params from URL
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (searchParams.get('category')) params.append('category_slug', searchParams.get('category'));
    if (searchParams.get('brand')) params.append('brand_id', searchParams.get('brand'));
    if (searchParams.get('color')) params.append('color', searchParams.get('color')); // Color filter
    if (searchParams.get('search')) params.append('search', searchParams.get('search'));
    if (searchParams.get('min_price')) params.append('price_min', searchParams.get('min_price'));
    if (searchParams.get('max_price')) params.append('price_max', searchParams.get('max_price'));
    if (searchParams.get('min_rating')) params.append('min_rating', searchParams.get('min_rating'));
    if (searchParams.get('sort')) params.append('sort_by', searchParams.get('sort'));
    if (searchParams.get('in_stock') === '1') params.append('in_stock', 1);
    if (searchParams.get('on_sale') === '1') params.append('on_sale', 1);
    
    params.append('page', currentPage);
    params.append('per_page', perPage);
    
    return params;
  };

  // Fetch products with filters
  const { data: productResponse, loading: productsLoading, error, refetch } = useGet(
    `/products?${buildQueryParams().toString()}`
  );

  const products = productResponse?.data?.data || [];
  const pagination = productResponse?.data;
  
  // Fetch filter counts from backend
  const { data: filterData } = useGet("/products?get_filters=1");
  const filterCounts = filterData?.filters || {};
  
  // Brands from filter counts or separate API
  const brands = filterCounts?.brands || [];

  // Filters state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || null,
    brands: searchParams.get('brand') ? [Number(searchParams.get('brand'))] : [],
    color: searchParams.get('color') || null, // Color filter
    minPrice: searchParams.get('min_price') || null,
    maxPrice: searchParams.get('max_price') || null,
    search: searchParams.get('search') || "",
    sort: searchParams.get('sort') || "",
    minRating: searchParams.get('min_rating') || null,
    inStock: searchParams.get('in_stock') === '1',
    onSale: searchParams.get('on_sale') === '1',
  });

  const [priceBounds, setPriceBounds] = useState({
    min: filterCounts?.price_range?.min || 0,
    max: filterCounts?.price_range?.max || 100000
  });

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.brands.length === 1) params.append('brand', filters.brands[0]);
    if (filters.color) params.append('color', filters.color); // Color filter
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.minPrice) params.append('min_price', filters.minPrice);
    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
    if (filters.minRating) params.append('min_rating', filters.minRating);
    if (filters.inStock) params.append('in_stock', '1');
    if (filters.onSale) params.append('on_sale', '1');
    
    setSearchParams(params, { replace: true });
    setCurrentPage(1);
    refetch();
  }, [filters]);

  // Update price bounds when filter counts load
  useEffect(() => {
    if (filterCounts?.price_range) {
      setPriceBounds({
        min: filterCounts.price_range.min || 0,
        max: filterCounts.price_range.max || 100000
      });
      if (!filters.minPrice && !filters.maxPrice) {
        setFilters(prev => ({
          ...prev,
          minPrice: filterCounts.price_range.min,
          maxPrice: filterCounts.price_range.max
        }));
      }
    }
  }, [filterCounts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
  // Wait for price bounds to be loaded from backend
  const minPriceValue = priceBounds.min !== 0 ? priceBounds.min : 0;
  const maxPriceValue = priceBounds.max !== 100000 ? priceBounds.max : 50000;
  
  setFilters({
    category: null,
    brands: [],
    color: null,
    minPrice: minPriceValue,
    maxPrice: maxPriceValue,
    search: "",
    sort: "",
    minRating: null,
    inStock: false,
    onSale: false,
  });
};
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = pagination?.last_page || 1;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#fdf7f9] to-[#f6f1f3] border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#7a1c3d] transition">Home</Link>
            <span>/</span>
            <span className="text-[#2d0f1f] font-medium">Shop Products</span>
          </div>

          {/* TITLE */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 gap-3">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#2d0f1f]">Shop Products</h1>
              <p className="text-gray-500 mt-2">
                Showing <span className="font-semibold text-[#7a1c3d]">{pagination?.total || 0}</span> products
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
            onClick={() => setShowFilters(true)}
            className="w-full h-12 rounded-2xl bg-[#7a1c3d] text-white font-semibold shadow-lg"
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
                  categories={parentCategories}
                  brands={brands}
                  loading={categoriesLoading}
                  selectedCategory={filters.category}
                  selectedBrands={filters.brands}
                  selectedColor={filters.color}
                  priceRange={[filters.minPrice || priceBounds.min, filters.maxPrice || priceBounds.max]}
                  maxPrice={priceBounds.max}
                  minPrice={priceBounds.min}
                  selectedRating={filters.minRating}
                  inStock={filters.inStock}
                  onSale={filters.onSale}
                  onCategoryChange={(v) => updateFilter("category", v)}
                  onBrandChange={(v) => updateFilter("brands", v)}
                  onColorChange={(v) => updateFilter("color", v)}
                  onPriceChange={([min, max]) => {
                    updateFilter("minPrice", min);
                    updateFilter("maxPrice", max);
                  }}
                  onRatingChange={(v) => updateFilter("minRating", v)}
                  onStockChange={(v) => updateFilter("inStock", v)}
                  onSaleChange={(v) => updateFilter("onSale", v)}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>

          {/* MOBILE FILTER DRAWER */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-black/40 flex">
              <div className="bg-white w-[320px] max-w-[85%] h-full overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="text-xl">✕</button>
                </div>
                <Sidebar
                  categories={parentCategories}
                  brands={brands}
                  loading={categoriesLoading}
                  selectedCategory={filters.category}
                  selectedBrands={filters.brands}
                  selectedColor={filters.color}
                  priceRange={[filters.minPrice || priceBounds.min, filters.maxPrice || priceBounds.max]}
                  maxPrice={priceBounds.max}
                  minPrice={priceBounds.min}
                  selectedRating={filters.minRating}
                  inStock={filters.inStock}
                  onSale={filters.onSale}
                  onCategoryChange={(v) => updateFilter("category", v)}
                  onBrandChange={(v) => updateFilter("brands", v)}
                  onColorChange={(v) => updateFilter("color", v)}
                  onPriceChange={([min, max]) => {
                    updateFilter("minPrice", min);
                    updateFilter("maxPrice", max);
                  }}
                  onRatingChange={(v) => updateFilter("minRating", v)}
                  onStockChange={(v) => updateFilter("inStock", v)}
                  onSaleChange={(v) => updateFilter("onSale", v)}
                  onApplyFilters={() => setShowFilters(false)}
                  onClearFilters={handleClearFilters}
                />
              </div>
              <div className="flex-1" onClick={() => setShowFilters(false)} />
            </div>
          )}

          {/* PRODUCTS */}
          <div className="flex-1 min-w-0">
            {/* SHOP HEADER */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6">
              <ShopHeader
                searchValue={filters.search}
                sortValue={filters.sort}
                viewMode={viewMode}
                perPage={perPage}
                onSearch={(v) => updateFilter("search", v)}
                onSortChange={(v) => updateFilter("sort", v)}
                onViewChange={(mode) => setViewMode(mode)}
                onPerPageChange={(v) => setPerPage(v)}
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-5">
                Failed to load products. Please try again.
              </div>
            )}

            {/* PRODUCT GRID */}
            <ProductGrid
              products={products}
              loading={productsLoading}
              columns={viewMode === "grid" ? 5 : 1}
              viewMode={viewMode}
              onClearFilters={handleClearFilters}
            />

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg transition ${
                          currentPage === pageNum
                            ? "bg-[#7a1c3d] text-white"
                            : "border hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
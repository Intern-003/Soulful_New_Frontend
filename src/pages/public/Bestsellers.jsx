import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";
import Sidebar from "../../components/shop/Sidebar";
import ShopHeader from "../../components/shop/ShopHeader";
import ProductGrid from "../../components/dashboard/products/ProductGrid";
import useGet from "../../api/hooks/useGet";
import { Link } from "react-router-dom";

const FreshArrivals = () => {
  const dispatch = useDispatch();
  const parentCategories = useSelector(selectParentCategories);
  const { loading: categoriesLoading } = useSelector((state) => state.categories);
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  // Fetch best sellers from backend
  const { data: productResponse, loading: productsLoading, error } = useGet("/products/best-sellers");

  // Access data correctly - API returns { success: true, data: [...] }
  const products = productResponse?.data || [];
  const allProducts = Array.isArray(products) ? products : [];

  // Fetch brands
  const { data: brandResponse } = useGet("/brands/active");
  const brands = Array.isArray(brandResponse?.data) ? brandResponse.data : [];

  // Filter state
  const initialFilters = {
    category: null,
    brands: [],
    color: null,
    price: [0, 50000],
    search: "",
    sort: "",
    inStock: false,
    onSale: false,
    minRating: null,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [priceBounds, setPriceBounds] = useState([0, 50000]);
  const [hasMounted, setHasMounted] = useState(false);

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Set price bounds from products
  useEffect(() => {
    if (!allProducts.length || hasMounted) return;
    
    const prices = allProducts.map(p => p.current_price || p.discount_price || p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    setPriceBounds([min, max]);
    setFilters(prev => ({
      ...prev,
      price: [min, max],
    }));
    setHasMounted(true);
  }, [allProducts, hasMounted]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const price = p.current_price || p.discount_price || p.price || 0;
      const categoryId = Number(p.category_id);
      const brandId = Number(p.brand_id);
      
      // Search
      if (filters.search && !p.name?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Category
      if (filters.category && categoryId !== Number(filters.category)) {
        return false;
      }
      
      // Brands
      if (filters.brands.length && !filters.brands.includes(brandId)) {
        return false;
      }
      
      // Price
      if (price < filters.price[0] || price > filters.price[1]) {
        return false;
      }
      
      // In Stock
      if (filters.inStock && p.stock <= 0) {
        return false;
      }
      
      // On Sale
      if (filters.onSale && !p.discount_price) {
        return false;
      }
      
      // Rating
      if (filters.minRating && (p.average_rating || 0) < filters.minRating) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      const priceA = a.current_price || a.discount_price || a.price || 0;
      const priceB = b.current_price || b.discount_price || b.price || 0;
      
      if (filters.sort === "price_low") return priceA - priceB;
      if (filters.sort === "price_high") return priceB - priceA;
      if (filters.sort === "name_asc") return a.name?.localeCompare(b.name) || 0;
      if (filters.sort === "name_desc") return b.name?.localeCompare(a.name) || 0;
      if (filters.sort === "rating") return (b.average_rating || 0) - (a.average_rating || 0);
      if (filters.sort === "popular") return (b.sold_count || 0) - (a.sold_count || 0);
      if (filters.sort === "latest") return new Date(b.created_at) - new Date(a.created_at);
      
      return 0;
    });
  }, [allProducts, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: null,
      brands: [],
      color: null,
      price: priceBounds,
      search: "",
      sort: "",
      inStock: false,
      onSale: false,
      minRating: null,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load bestsellers</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#7a1c3d] text-white rounded-lg">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* TOP HEADER */}
      <div className="bg-gradient-to-r from-[#fdf7f9] to-[#f6f1f3] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-[#7a1c3d] transition">Home</Link>
            <span>/</span>
            <span className="text-[#2d0f1f] font-medium">Bestsellers</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#2d0f1f]">Bestsellers</h1>
              <p className="text-gray-500 mt-2">
                Showing <span className="font-semibold text-[#7a1c3d]">{filteredProducts.length}</span> products
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
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
                  priceRange={filters.price}
                  maxPrice={priceBounds[1]}
                  minPrice={priceBounds[0]}
                  selectedRating={filters.minRating}
                  inStock={filters.inStock}
                  onSale={filters.onSale}
                  onCategoryChange={(v) => updateFilter("category", v)}
                  onBrandChange={(v) => updateFilter("brands", v)}
                  onPriceChange={(v) => updateFilter("price", v)}
                  onRatingChange={(v) => updateFilter("minRating", v)}
                  onStockChange={(v) => updateFilter("inStock", v)}
                  onSaleChange={(v) => updateFilter("onSale", v)}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>

          {/* MOBILE DRAWER */}
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
                  priceRange={filters.price}
                  maxPrice={priceBounds[1]}
                  minPrice={priceBounds[0]}
                  selectedRating={filters.minRating}
                  inStock={filters.inStock}
                  onSale={filters.onSale}
                  onCategoryChange={(v) => updateFilter("category", v)}
                  onBrandChange={(v) => updateFilter("brands", v)}
                  onPriceChange={(v) => updateFilter("price", v)}
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

            <ProductGrid
              products={filteredProducts}
              loading={productsLoading}
              columns={viewMode === "grid" ? 4 : 1}
              viewMode={viewMode}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreshArrivals;
import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = ({
  categories = [],
  brands = [],
  loading,

  selectedCategory,
  selectedBrands = [],
  selectedColor = null,
  priceRange = [0, 0],
  selectedRating = null,
  inStock = false,
  onSale = false,

  onCategoryChange,
  onBrandChange,
  onColorChange,
  onPriceChange,
  onRatingChange,
  onStockChange,
  onSaleChange,
  onClearFilters,

  maxPrice,
  minPrice,
}) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    brand: true,
    color: false,
    rating: false,
    other: false,
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBrandToggle = (id) => {
    const updated = selectedBrands.includes(id)
      ? selectedBrands.filter((b) => b !== id)
      : [...selectedBrands, id];
    onBrandChange(updated);
  };

  const ratings = [
    { value: 4, label: "4 & above" },
    { value: 3, label: "3 & above" },
    { value: 2, label: "2 & above" },
    { value: 1, label: "1 & above" },
  ];

  // Minimal, elegant color options
  const colors = [
    { name: "Black", value: "black", class: "bg-gray-900" },
    { name: "White", value: "white", class: "bg-white border border-gray-300" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Navy", value: "navy", class: "bg-blue-900" },
  ];

  const SectionHeader = ({ title, sectionKey, count }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between py-3 text-left group"
    >
      <span className="text-sm font-medium text-gray-700 group-hover:text-[#7a1c3d] transition">
        {title}
        {count !== undefined && count > 0 && (
          <span className="ml-1 text-xs text-gray-400">({count})</span>
        )}
      </span>
      {openSections[sectionKey] ? (
        <ChevronUp size={16} className="text-gray-400" />
      ) : (
        <ChevronDown size={16} className="text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-800">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-xs text-[#7a1c3d] hover:underline font-medium"
        >
          Clear All
        </button>
      </div>

      {/* CATEGORY */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Category" sectionKey="category" />
        <div className={`overflow-hidden transition-all duration-300 ${openSections.category ? "max-h-80 pb-3" : "max-h-0"}`}>
          <div className="space-y-1.5">
            <button
              onClick={() => onCategoryChange(null)}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition ${
                !selectedCategory
                  ? "bg-[#7a1c3d]/10 text-[#7a1c3d] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All Products
            </button>
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition ${
                  selectedCategory === cat.id
                    ? "bg-[#7a1c3d]/10 text-[#7a1c3d] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
            {categories.length > 8 && (
              <button className="text-xs text-[#7a1c3d] mt-1 px-2">+ {categories.length - 8} more</button>
            )}
          </div>
        </div>
      </div>

      {/* PRICE */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Price" sectionKey="price" />
        <div className={`overflow-hidden transition-all duration-300 ${openSections.price ? "max-h-28 pb-3" : "max-h-0"}`}>
          <div className="px-1">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#7a1c3d]"
              style={{
                background: `linear-gradient(to right, #7a1c3d 0%, #7a1c3d ${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%, #e5e7eb ${((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* BRAND */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Brand" sectionKey="brand" />
        <div className={`overflow-hidden transition-all duration-300 ${openSections.brand ? "max-h-64 pb-3" : "max-h-0"}`}>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scroll">
            {brands.slice(0, 10).map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleBrandToggle(brand.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition ${
                  selectedBrands.includes(brand.id)
                    ? "bg-[#7a1c3d]/10 text-[#7a1c3d]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{brand.name}</span>
                {selectedBrands.includes(brand.id) && (
                  <div className="w-2 h-2 bg-[#7a1c3d] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COLOR - Elegant minimal */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Color" sectionKey="color" />
        <div className={`overflow-hidden transition-all duration-300 ${openSections.color ? "max-h-24 pb-3" : "max-h-0"}`}>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(selectedColor === color.value ? null : color.value)}
                className={`w-8 h-8 rounded-full ${color.class} shadow-sm transition-transform hover:scale-105 ${
                  selectedColor === color.value ? "ring-2 ring-[#7a1c3d] ring-offset-1" : ""
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RATING - Compact & Clean */}
      <div className="border-b border-gray-100">
        <SectionHeader title="Rating" sectionKey="rating" />
        <div className={`overflow-hidden transition-all duration-300 ${openSections.rating ? "max-h-40 pb-3" : "max-h-0"}`}>
          <div className="space-y-1.5">
            {ratings.map((rating) => (
              <button
                key={rating.value}
                onClick={() => onRatingChange(selectedRating === rating.value ? null : rating.value)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition ${
                  selectedRating === rating.value
                    ? "bg-[#7a1c3d]/10 text-[#7a1c3d]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < rating.value
                          ? "fill-[#f5a623] text-[#f5a623]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">& up</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OTHER FILTERS */}
      <div className="pt-2">
        <SectionHeader title="More Filters" sectionKey="other" />
        <div className={`overflow-hidden transition-all duration-300 ${openSections.other ? "max-h-20 pb-3" : "max-h-0"}`}>
          <div className="space-y-2 px-1">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-600">In Stock Only</span>
              <button
                onClick={() => onStockChange(!inStock)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                  inStock ? "bg-[#7a1c3d]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition ${
                    inStock ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-600">On Sale</span>
              <button
                onClick={() => onSaleChange(!onSale)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                  onSale ? "bg-[#7a1c3d]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition ${
                    onSale ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
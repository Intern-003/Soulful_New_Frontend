import React, { useState, useMemo } from "react";

const Sidebar = ({
  categories = [],
  brands = [],
  loading,
  priceBounds = [0, 100000],

  selectedCategory,
  selectedBrands = [],
  selectedColor,
  priceRange = [0, 1000000],

  onCategoryChange,
  onBrandChange,
  onColorChange,
  onPriceChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const [search, setSearch] = useState("");

  // ✅ CATEGORY SEARCH FILTER
  const filteredCategories = useMemo(() => {
    if (!search) return categories;

    return categories.filter((cat) =>
      cat.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categories, search]);

  // ✅ BRAND TOGGLE (FIXED NUMBER ISSUE)
  const handleBrandToggle = (brandId) => {
    const id = Number(brandId);

    let updated = selectedBrands.includes(id)
      ? selectedBrands.filter((b) => b !== id)
      : [...selectedBrands, id];

    onBrandChange(updated);
  };

  return (
    <div className="space-y-4 w-full">
      {/* 🔍 CATEGORY */}
      <div className="bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3 text-sm focus:ring-2 focus:ring-[#7a1c3d]"
        />

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
            {/* ALL */}
            <li
              onClick={() => onCategoryChange(null)}
              className={`cursor-pointer ${
                !selectedCategory
                  ? "text-[#7a1c3d] font-semibold"
                  : "hover:text-[#7a1c3d]"
              }`}
            >
              All
            </li>

            {filteredCategories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => onCategoryChange(Number(cat.id))} // ✅ FIX
                className={`cursor-pointer ${
                  selectedCategory === Number(cat.id)
                    ? "text-[#7a1c3d] font-semibold"
                    : "hover:text-[#7a1c3d]"
                }`}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 💰 PRICE */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Price Range</h3>

        {/* SLIDER */}
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          value={priceRange[1]}
          onChange={(e) =>
            onPriceChange([priceRange[0], Number(e.target.value)])
          }
          className="w-full"
        />

        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* 🎨 COLORS */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Colors</h3>

        <div className="flex gap-3 flex-wrap">
          {["black", "red", "blue", "green", "yellow"].map((color) => (
            <div
              key={color}
              onClick={() =>
                onColorChange(
                  selectedColor === color ? null : color, // ✅ TOGGLE FIX
                )
              }
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                selectedColor === color
                  ? "border-[#7a1c3d] scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* 🏷 BRANDS */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Brands</h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {brands.map((brand) => {
            const id = Number(brand.id);

            return (
              <label
                key={id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(id)}
                  onChange={() => handleBrandToggle(id)}
                  className="accent-[#7a1c3d]"
                />
                {brand.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* 🚀 ACTIONS */}
      <div className="bg-white p-4 rounded shadow sticky bottom-0">
        <button
          onClick={onApplyFilters}
          className="w-full bg-[#7a1c3d] text-white py-2 rounded mb-2"
        >
          Apply Filters
        </button>

        <button
          onClick={onClearFilters}
          className="w-full border py-2 rounded hover:bg-gray-100"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

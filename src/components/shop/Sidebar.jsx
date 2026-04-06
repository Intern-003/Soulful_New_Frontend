import React from "react";

const Sidebar = ({
  categories = [],
  brands = [],
  loading,

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
  const handleBrandToggle = (brandId) => {
    const id = Number(brandId);

    let updated = selectedBrands.includes(id)
      ? selectedBrands.filter((b) => b !== id)
      : [...selectedBrands, id];

    onBrandChange(updated);
  };

  return (
    <div className="space-y-4 w-full">

      {/* Categories */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Categories</h3>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
            <li
              onClick={() => onCategoryChange(null)}
              className={`cursor-pointer ${
                !selectedCategory ? "text-[#7a1c3d] font-semibold" : "hover:text-[#7a1c3d]"
              }`}
            >
              All
            </li>

            {categories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`cursor-pointer transition ${
                  selectedCategory === cat.id
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

      <div>
  {/* Search Input */}
  <input
    type="text"
    placeholder="Search categories..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border px-2 py-1 mb-3"
  />

  {/* Category Tree */}
  {filteredCategories.map((cat) => (
    <CategoryItem
      key={cat.id}
      category={cat}
      onSelect={(id) => onCategoryChange(id)}
    />
  ))}
</div>

      {/* Price */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Price Range</h3>

        <input
          type="range"
          min="0"
          max="1000000"
          value={priceRange[1]}
          onChange={(e) =>
            onPriceChange([0, Number(e.target.value)])
          }
          className="w-full"
        />

        <div className="flex justify-between text-sm mt-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Colors</h3>

        <div className="flex gap-3 flex-wrap">
          {["black", "red", "blue", "green", "yellow"].map((color) => (
            <div
              key={color}
              onClick={() => onColorChange(color)}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                selectedColor === color
                  ? "border-[#7a1c3d]"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Brands */}
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

      {/* ACTION BUTTONS */}
      <div className="bg-white p-4 rounded shadow sticky bottom-0">
        <button
          onClick={onApplyFilters}
          className="w-full bg-[#7a1c3d] text-white py-2 rounded mb-2 hover:opacity-90"
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
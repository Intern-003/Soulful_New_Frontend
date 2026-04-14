import React, { useState } from "react";

const Sidebar = ({
  categories = [],
  brands = [],
  loading,

  selectedCategory,
  selectedBrands = [],
  selectedColor,
  priceRange = [0, 5000],

  onCategoryChange,
  onBrandChange,
  onColorChange,
  onPriceChange,
}) => {
  const [open, setOpen] = useState({
    category: true,
    color: false,
    price: false,
    brand: false,
  });

  const toggle = (key) => {
    setOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleBrandToggle = (id) => {
    const updated = selectedBrands.includes(id)
      ? selectedBrands.filter((b) => b !== id)
      : [...selectedBrands, id];

    onBrandChange(updated);
  };

  return (
    <div className="bg-[#F6F3F5] border border-[#e7e2e5] p-6 rounded-2xl text-sm text-gray-800">
      {/* TITLE */}
      <h3 className="text-lg font-semibold tracking-wide mb-4">Filters</h3>
      <div className="border-b border-gray-200 mb-4" />

      {/* SECTION COMPONENT */}
      {[
        { key: "category", label: "Category" },
        { key: "color", label: "Color" },
        { key: "price", label: "Price" },
        { key: "brand", label: "Brands" },
      ].map((section) => (
        <div
          key={section.key}
          className="border-b border-gray-200 py-3 text-[11px] tracking-[0.12em]"
        >
          {/* HEADER */}
          <div
            onClick={() => toggle(section.key)}
            className="flex justify-between items-center cursor-pointer group"
          >
            <span className="font-medium group-hover:text-[#8B0D3A] transition">
              {section.label}
            </span>

            <span
              className={`
                transition-transform duration-300
                ${open[section.key] ? "rotate-180" : ""}
              `}
            >
              +
            </span>
          </div>

          {/* CONTENT */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${open[section.key] ? "max-h-[400px] mt-3" : "max-h-0"}
            `}
          >
            {/* CATEGORY */}
            {section.key === "category" && (
              <div className="space-y-2">
                <div
                  onClick={() => onCategoryChange(null)}
                  className={`
                    flex justify-between items-center cursor-pointer group
                    px-2 py-1.5 rounded-md transition
                    ${!selectedCategory ? "bg-[#8B0D3A]/10" : "hover:bg-gray-100"}
                  `}
                >
                  {/* TEXT */}
                  <span
                    className={`
                      ${
                        !selectedCategory
                          ? "text-[#8B0D3A] font-medium"
                          : "group-hover:text-[#8B0D3A]"
                      }
                    `}
                  >
                    All
                  </span>

                  {/* CHECKBOX */}
                  <div
                    className={`
                      w-5 h-5 border rounded-sm flex items-center justify-center
                      transition
                      ${
                        !selectedCategory
                          ? "bg-[#8B0D3A] border-[#8B0D3A]"
                          : "border-gray-300 group-hover:border-[#8B0D3A]"
                      }
                    `}
                  >
                    {!selectedCategory && (
                      <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />
                    )}
                  </div>
                </div>

                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`
                      flex justify-between items-center cursor-pointer group
                      transition-all duration-200
                      px-2 py-1.5 rounded-md
                      ${selectedCategory === cat.id ? "bg-[#8B0D3A]/10" : "hover:bg-gray-100"}
                    `}
                  >
                    {/* TEXT */}
                    <span
                      className={`
                        transition
                        ${
                          selectedCategory === cat.id
                            ? "text-[#8B0D3A] font-medium"
                            : "group-hover:text-[#8B0D3A]"
                        }
                      `}
                    >
                      {cat.name}
                    </span>

                    {/* CHECKBOX */}
                    <div
                      className={`
                        w-5 h-5 rounded-sm border flex items-center justify-center
                        transition-all duration-200
                        ${
                          selectedCategory === cat.id
                            ? "bg-[#8B0D3A] border-[#8B0D3A]"
                            : "border-gray-300 group-hover:border-[#8B0D3A]"
                        }
                      `}
                    >
                      {selectedCategory === cat.id && (
                        <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* COLOR */}
            {section.key === "color" && (
              <div className="space-y-2">
                {["black", "beige", "blue", "red"].map((color) => (
                  <div
                    key={color}
                    onClick={() =>
                      onColorChange(selectedColor === color ? null : color)
                    }
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="group-hover:text-[#8B0D3A] transition">
                        {color}
                      </span>
                    </div>

                    <div
                      className={`
                        w-4 h-4 border rounded-sm
                        ${
                          selectedColor === color
                            ? "bg-[#8B0D3A] border-[#8B0D3A]"
                            : "border-gray-300"
                        }
                      `}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* PRICE */}
            {section.key === "price" && (
              <div>
                <p className="text-xs text-gray-500 mb-3">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </p>

                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceChange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-[#8B0D3A]"
                />
              </div>
            )}

            {/* BRANDS */}
            {section.key === "brand" && (
              <div className="space-y-2 max-h-52 custom-scrollbar">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => handleBrandToggle(brand.id)}
                    className={`
                      flex justify-between items-center cursor-pointer group
                      px-2 py-1.5 rounded-md transition
                      ${
                        selectedBrands.includes(brand.id)
                          ? "bg-[#8B0D3A]/10"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    <span
                      className={`
                        ${
                          selectedBrands.includes(brand.id)
                            ? "text-[#8B0D3A] font-medium"
                            : "group-hover:text-[#8B0D3A]"
                        }
                      `}
                    >
                      {brand.name}
                    </span>

                    <div
                      className={`
                        w-5 h-5 border rounded-sm
                        ${
                          selectedBrands.includes(brand.id)
                            ? "bg-[#8B0D3A] border-[#8B0D3A]"
                            : "border-gray-300"
                        }
                      `}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

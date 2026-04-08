import React from "react";

const ShopHeader = ({
  searchValue = "",
  sortValue = "",
  viewMode = "grid",

  onSearch,
  onSortChange,
  onViewChange,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      {/* SEARCH */}
      <input
        type="text"
        value={searchValue}
        placeholder="Search products..."
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(e.target.value);
          }
        }}
        className="border px-3 py-2 rounded w-full md:w-1/3 focus:ring-2 focus:ring-[#7a1c3d]"
      />

      {/* SORT */}
      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="border px-3 py-2 rounded w-full md:w-auto"
      >
        <option value="">Default</option>
        <option value="price_asc">Price Low to High</option>
        <option value="price_desc">Price High to Low</option>
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
      </select>

      {/* VIEW TOGGLE */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange("grid")}
          className={`px-3 py-2 border rounded ${
            viewMode === "grid" ? "bg-[#7a1c3d] text-white" : ""
          }`}
        >
          Grid
        </button>

        <button
          onClick={() => onViewChange("list")}
          className={`px-3 py-2 border rounded ${
            viewMode === "list" ? "bg-[#7a1c3d] text-white" : ""
          }`}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default ShopHeader;

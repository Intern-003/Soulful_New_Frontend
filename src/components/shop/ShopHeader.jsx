import React from "react";
import { Search, Grid3X3, List } from "lucide-react";

const ShopHeader = ({
  searchValue = "",
  sortValue = "",
  priceValue = "",
  viewMode = "grid",
  perPage = 12,

  onSearch,
  onSortChange,
  onPriceChange,
  onViewChange,
  onPerPageChange,
}) => {
  return (
    <div className="bg-[#f6f3f5] border border-[#e7e2e5] rounded-2xl px-6 py-5 mb-8">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
        {/* LEFT */}
        <div className="flex flex-wrap gap-8 items-end">
          {/* SEARCH */}
          <div>
            <p className="text-[11px] tracking-[0.12em] uppercase text-gray-500 mb-2">
              Search Products
            </p>

            <div className="flex items-stretch border border-[#e3ccd5] rounded-xl bg-white overflow-hidden">
              {/* INPUT */}
              <input
                type="text"
                value={searchValue}
                placeholder="Search for products..."
                onChange={(e) => onSearch(e.target.value)}
                className="
                  px-4 text-sm outline-none
                  w-[280px]
                  h-[42px]
                "
              />

              {/* BUTTON */}
              <button
                className="
                  flex items-center justify-center
                  px-4
                  h-[42px]
                  bg-[#7a1c3d] text-white
                  transition-all duration-300
                  hover:bg-[#5f142f]
                "
              >
                <Search size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-end gap-8">
          {/* SORT */}
          <div className="group">
            <p className="text-[11px] tracking-[0.18em] uppercase text-gray-500 mb-2">
              Sort By
            </p>

            <div className="relative">
              <select
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white pr-10 transition-all duration-300 hover:border-gray-300 focus:ring-2 focus:ring-[#7a1c3d]/20 outline-none"
              >
                <option value="">Featured</option>
                <option value="price_asc">Price Low → High</option>
                <option value="price_desc">Price High → Low</option>
              </select>

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                ⌄
              </span>
            </div>
          </div>

          {/* VIEW */}
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-gray-500 mb-2">
              View
            </p>

            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
              <button
                onClick={() => onViewChange("grid")}
                className={`
                  px-3 py-2.5 flex items-center justify-center
                  transition-all duration-300
                  ${
                    viewMode === "grid"
                      ? "bg-[#7a1c3d] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                <Grid3X3 size={16} />
              </button>

              <button
                onClick={() => onViewChange("list")}
                className={`
                  px-3 py-2.5 border-l flex items-center justify-center
                  transition-all duration-300
                  ${
                    viewMode === "list"
                      ? "bg-[#7a1c3d] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* PER PAGE */}
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-gray-500 mb-2">
              Show
            </p>

            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(e.target.value)}
                className="appearance-none px-4 py-2.5 text-sm border border-[#7a1c3d] rounded-xl bg-white pr-10 transition-all duration-300 hover:shadow-sm focus:ring-2 focus:ring-[#7a1c3d]/20 outline-none"
              >
                <option value={12}>12 per page</option>
                <option value={24}>24 per page</option>
                <option value={48}>48 per page</option>
              </select>

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                ⌄
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;

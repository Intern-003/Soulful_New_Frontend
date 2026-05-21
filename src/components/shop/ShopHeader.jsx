import React from "react";

import {
  Search,
  Grid3X3,
  List,
} from "lucide-react";

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
    <div
      className="
        bg-[#f6f3f5]
        border
        border-[#e7e2e5]
        rounded-3xl

        p-4
        md:p-6

        mb-6
      "
    >
      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-end
          xl:justify-between

          gap-5
          xl:gap-8
        "
      >
        {/* LEFT */}
        <div className="flex-1 min-w-0">
          {/* SEARCH */}
          <div>
            <p
              className="
                text-[11px]
                tracking-[0.18em]
                uppercase
                text-gray-500
                mb-2
              "
            >
              Search Products
            </p>

            <div
              className="
                flex
                items-stretch
                border
                border-[#e3ccd5]
                rounded-2xl
                bg-white
                overflow-hidden
                w-full
              "
            >
              {/* INPUT */}
              <input
                type="text"
                value={searchValue}
                placeholder="Search for products..."
                onChange={(e) =>
                  onSearch(
                    e.target.value,
                  )
                }
                className="
                  flex-1
                  min-w-0

                  px-4
                  text-sm
                  outline-none

                  h-[48px]

                  bg-transparent
                "
              />

              {/* BUTTON */}
              <button
                className="
                  w-[52px]
                  h-[48px]

                  flex
                  items-center
                  justify-center

                  bg-[#7a1c3d]
                  text-white

                  transition-all
                  duration-300

                  hover:bg-[#5f142f]

                  shrink-0
                "
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="
            flex
            flex-wrap
            items-end

            gap-4
            md:gap-5
          "
        >
          {/* SORT */}
          <div className="min-w-[160px]">
            <p
              className="
                text-[11px]
                tracking-[0.18em]
                uppercase
                text-gray-500
                mb-2
              "
            >
              Sort By
            </p>

            <div className="relative">
              <select
                value={sortValue}
                onChange={(e) =>
                  onSortChange(
                    e.target.value,
                  )
                }
                className="
                  appearance-none

                  w-full
                  h-[48px]

                  px-4
                  pr-10

                  text-sm

                  border
                  border-gray-200

                  rounded-2xl
                  bg-white

                  transition-all
                  duration-300

                  hover:border-gray-300

                  focus:ring-2
                  focus:ring-[#7a1c3d]/20

                  outline-none
                "
              >
                <option value="">
                  Featured
                </option>

                <option value="price_asc">
                  Price Low → High
                </option>

                <option value="price_desc">
                  Price High → Low
                </option>

                <option value="name_asc">
                  Name A-Z
                </option>

                <option value="name_desc">
                  Name Z-A
                </option>
              </select>

              <span
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2

                  text-gray-400
                  text-xs

                  pointer-events-none
                "
              >
                ⌄
              </span>
            </div>
          </div>

          {/* VIEW */}
          <div>
            <p
              className="
                text-[11px]
                tracking-[0.18em]
                uppercase
                text-gray-500
                mb-2
              "
            >
              View
            </p>

            <div
              className="
                flex
                rounded-2xl
                overflow-hidden

                border
                border-gray-200

                bg-white

                h-[48px]
              "
            >
              {/* GRID */}
              <button
                onClick={() =>
                  onViewChange(
                    "grid",
                  )
                }
                className={`
                  w-[48px]

                  flex
                  items-center
                  justify-center

                  transition-all
                  duration-300

                  ${
                    viewMode === "grid"
                      ? "bg-[#7a1c3d] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                <Grid3X3
                  size={16}
                />
              </button>

              {/* LIST */}
              <button
                onClick={() =>
                  onViewChange(
                    "list",
                  )
                }
                className={`
                  w-[48px]

                  border-l

                  flex
                  items-center
                  justify-center

                  transition-all
                  duration-300

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
          <div className="min-w-[150px]">
            <p
              className="
                text-[11px]
                tracking-[0.18em]
                uppercase
                text-gray-500
                mb-2
              "
            >
              Show
            </p>

            <div className="relative">
              <select
                value={perPage}
                onChange={(e) =>
                  onPerPageChange(
                    Number(
                      e.target.value,
                    ),
                  )
                }
                className="
                  appearance-none

                  w-full
                  h-[48px]

                  px-4
                  pr-10

                  text-sm

                  border
                  border-[#7a1c3d]

                  rounded-2xl
                  bg-white

                  transition-all
                  duration-300

                  hover:shadow-sm

                  focus:ring-2
                  focus:ring-[#7a1c3d]/20

                  outline-none
                "
              >
                <option value={12}>
                  12 per page
                </option>

                <option value={24}>
                  24 per page
                </option>

                <option value={48}>
                  48 per page
                </option>
              </select>

              <span
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2

                  text-gray-400
                  text-xs

                  pointer-events-none
                "
              >
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
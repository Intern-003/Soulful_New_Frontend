import React, {
  useMemo,
} from "react";

import {
  Grid3X3,
  Tag,
} from "lucide-react";

const StoreCategoryTabs = ({
  categories = [],
  products = [],
  selectedCategory,
  onCategoryChange,
  themeColor = "#7a1c3d",
}) => {

  const categoryStats =
    useMemo(() => {
      const stats = {};

      products.forEach(
        (product) => {
          const categoryId =
            product?.category?.id;

          if (!categoryId) return;

          stats[categoryId] =
            (stats[categoryId] || 0) + 1;
        }
      );

      return stats;
    }, [products]);

  const totalProducts =
    products.length;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-6">

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        {/* Header */}

        <div
          className="
            px-5
            py-3
            border-b
            border-slate-100
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <Tag
              size={16}
              style={{
                color: themeColor,
              }}
            />

            <h2
              className="
                text-base
                font-semibold
                text-slate-900
              "
            >
              Browse Categories
            </h2>
          </div>
        </div>

        {/* Categories */}

        <div
          className="
            p-4
            flex
            gap-2
            overflow-x-auto
            scrollbar-hide
          "
        >

          {/* All Products */}

          <button
            onClick={() =>
              onCategoryChange(
                "all"
              )
            }
            style={
              selectedCategory ===
              "all"
                ? {
                    backgroundColor:
                      themeColor,
                    color: "#fff",
                  }
                : {}
            }
            className={`
              shrink-0
              flex
              items-center
              gap-2

              px-4
              py-2.5

              rounded-xl

              text-sm
              font-medium

              transition-all

              ${
                selectedCategory ===
                "all"
                  ? "shadow-md"
                  : `
                    bg-slate-50
                    text-slate-700
                    hover:bg-slate-100
                  `
              }
            `}
          >
            <Grid3X3
              size={15}
            />

            Home

            <span
              className="
                min-w-[24px]
                h-5

                px-1.5

                rounded-full

                flex
                items-center
                justify-center

                text-[11px]
                font-semibold

                bg-black/10
              "
            >
              {totalProducts}
            </span>
          </button>

          {/* Dynamic Categories */}

          {categories.map(
            (
              category
            ) => {

              const count =
                categoryStats[
                  category.id
                ] || 0;

              const active =
                selectedCategory ===
                category.id;

              return (
                <button
                  key={
                    category.id
                  }
                  onClick={() =>
                    onCategoryChange(
                      category.id
                    )
                  }
                  style={
                    active
                      ? {
                          backgroundColor:
                            themeColor,
                          color: "#fff",
                        }
                      : {}
                  }
                  className={`
                    shrink-0

                    flex
                    items-center
                    gap-2

                    px-4
                    py-2.5

                    rounded-xl

                    text-sm
                    font-medium

                    transition-all

                    ${
                      active
                        ? "shadow-md"
                        : `
                          bg-slate-50
                          text-slate-700
                          hover:bg-slate-100
                        `
                    }
                  `}
                >
                  {category.name}

                  <span
                    className="
                      min-w-[24px]
                      h-5

                      px-1.5

                      rounded-full

                      flex
                      items-center
                      justify-center

                      text-[11px]
                      font-semibold

                      bg-black/10
                    "
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}

        </div>

        {/* Footer */}

        <div
          className="
            px-5
            py-2.5

            border-t
            border-slate-100

            bg-slate-50

            text-xs
            text-slate-500
          "
        >
          {selectedCategory ===
          "all"
            ? `Showing ${totalProducts} products`
            : `Showing ${
                categoryStats[
                  selectedCategory
                ] || 0
              } products`}
        </div>

      </div>

    </section>
  );
};

export default StoreCategoryTabs;
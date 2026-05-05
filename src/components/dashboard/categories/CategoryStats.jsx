import {
  FolderTree,
  Layers3,
  Package,
  TrendingUp,
} from "lucide-react";

/* ==========================================================
   FILE NAME: CategoryStats.jsx

   CATEGORY STATS
   Excellent Quality / Production Grade

   Props:
   categories = []

   Expected structure:
   [
     {
       id,
       name,
       children: [],
       products_count
     }
   ]
========================================================== */

const CategoryStats = ({
  categories = [],
}) => {
  const safeCategories =
    Array.isArray(
      categories
    )
      ? categories
      : [];

  /* ==========================================
     CALCULATIONS
  ========================================== */
  const totalCategories =
    safeCategories.length;

  const totalSubCategories =
    safeCategories.reduce(
      (
        total,
        item
      ) =>
        total +
        (item
          ?.children
          ?.length ||
          0),
      0
    );

  const totalProducts =
    safeCategories.reduce(
      (
        total,
        item
      ) =>
        total +
        (item
          ?.products_count ||
          0) +
        (item
          ?.children
          ?.reduce(
            (
              subTotal,
              child
            ) =>
              subTotal +
              (child?.products_count ||
                0),
            0
          ) ||
          0),
      0
    );

  const activeCategories =
    safeCategories.filter(
      (item) =>
        item.status ===
          true ||
        item.status ===
          1 ||
        item.status ===
          "1"
    ).length;

  const cards = [
    {
      title:
        "Categories",
      value:
        totalCategories,
      subtitle:
        "Main parent groups",
      icon: FolderTree,
      glow: "from-blue-500 to-cyan-500",
      chip: "+6%",
    },
    {
      title:
        "Subcategories",
      value:
        totalSubCategories,
      subtitle:
        "Nested category items",
      icon: Layers3,
      glow: "from-violet-500 to-indigo-500",
      chip: "+11%",
    },
    {
      title:
        "Products",
      value:
        totalProducts,
      subtitle:
        "Mapped products count",
      icon: Package,
      glow: "from-emerald-500 to-green-500",
      chip: "+18%",
    },
    {
      title:
        "Active",
      value:
        activeCategories,
      subtitle:
        "Currently enabled",
      icon: TrendingUp,
      glow: "from-rose-500 to-pink-500",
      chip: "+4%",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        (
          item,
          index
        ) => {
          const Icon =
            item.icon;

          return (
            <div
              key={
                index
              }
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Glow Orb */}
              <div
                className={`absolute right-0 top-0 h-28 w-28 rounded-full bg-gradient-to-br ${item.glow} opacity-10 blur-2xl transition-all duration-300 group-hover:scale-125`}
              />

              {/* Top */}
              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.glow} text-white shadow-lg`}
                >
                  <Icon
                    size={
                      24
                    }
                  />
                </div>

                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {
                    item.chip
                  }
                </span>
              </div>

              {/* Body */}
              <div className="relative mt-5">
                <p className="text-sm font-medium text-slate-500">
                  {
                    item.title
                  }
                </p>

                <h3 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                  {formatNumber(
                    item.value
                  )}
                </h3>

                <p className="mt-2 text-xs text-slate-400">
                  {
                    item.subtitle
                  }
                </p>
              </div>

              {/* Bottom Meter */}
              <div className="relative mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.glow}`}
                  style={{
                    width:
                      "76%",
                  }}
                />
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default CategoryStats;

/* ==========================================================
   HELPERS
========================================================== */

function formatNumber(
  num
) {
  return new Intl.NumberFormat().format(
    num || 0
  );
}
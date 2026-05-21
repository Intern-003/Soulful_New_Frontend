// FILE: src/components/dashboard/brands/BrandStats.jsx

import React, {
  memo,
} from "react";

import {
  Store,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

/* ==========================================================
   FILE: BrandStats.jsx
   Elite Production Grade

   Props:
   brands=[]
========================================================== */

const StatCard = ({
  title,
  value,
  icon,
  color,
  iconColor,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        {/* RIGHT */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-3xl ${color}`}
        >
          {React.cloneElement(
            icon,
            {
              className:
                iconColor,
            }
          )}
        </div>
      </div>
    </div>
  );
};

const BrandStats = ({
  brands = [],
}) => {
  /* ========================================================
     STATS
  ======================================================== */

  const totalBrands =
    brands.length;

  const activeBrands =
    brands.filter(
      (
        item
      ) =>
        item?.status
    ).length;

  const inactiveBrands =
    totalBrands -
    activeBrands;

  const totalProducts =
    brands.reduce(
      (
        total,
        item
      ) => {
        return (
          total +
          (
            item?.products_count ||
            item?.products
              ?.length ||
            0
          )
        );
      },
      0
    );

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {/* TOTAL */}
      <StatCard
        title="Total Brands"
        value={
          totalBrands
        }
        color="bg-[#7a1c3d]/10"
        iconColor="text-[#7a1c3d]"
        icon={
          <Store
            size={24}
          />
        }
      />

      {/* ACTIVE */}
      <StatCard
        title="Active Brands"
        value={
          activeBrands
        }
        color="bg-emerald-100"
        iconColor="text-emerald-600"
        icon={
          <CheckCircle2
            size={24}
          />
        }
      />

      {/* INACTIVE */}
      <StatCard
        title="Inactive Brands"
        value={
          inactiveBrands
        }
        color="bg-red-100"
        iconColor="text-red-500"
        icon={
          <XCircle
            size={24}
          />
        }
      />

      {/* PRODUCTS */}
      <StatCard
        title="Linked Products"
        value={
          totalProducts
        }
        color="bg-blue-100"
        iconColor="text-blue-600"
        icon={
          <Package
            size={24}
          />
        }
      />
    </div>
  );
};

export default memo(
  BrandStats
);
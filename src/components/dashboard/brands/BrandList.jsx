// FILE: src/components/dashboard/brands/BrandList.jsx

import React, {
  memo,
} from "react";

import BrandTable from "./BrandTable";
import BrandMobileCard from "./BrandMobileCard";

/* ==========================================================
   FILE: BrandList.jsx
   Elite Production Grade

   Features:
   ✅ Desktop table
   ✅ Mobile cards
   ✅ Responsive rendering
   ✅ Clean architecture
========================================================== */

const BrandList = ({
  brands = [],

  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-5">
      {/* ===================================================
          MOBILE
      =================================================== */}

      <div className="grid gap-5 lg:hidden">
        {brands.map(
          (
            brand
          ) => (
            <BrandMobileCard
              key={
                brand.id
              }
              brand={
                brand
              }
              onEdit={
                onEdit
              }
              onDelete={
                onDelete
              }
            />
          )
        )}
      </div>

      {/* ===================================================
          DESKTOP
      =================================================== */}

      <BrandTable
        brands={brands}
        onEdit={
          onEdit
        }
        onDelete={
          onDelete
        }
      />
    </div>
  );
};

export default memo(
  BrandList
);
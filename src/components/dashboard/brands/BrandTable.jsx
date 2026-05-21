// FILE: src/components/dashboard/brands/BrandTable.jsx

import React, {
  memo,
} from "react";

import BrandTableRow from "./BrandTableRow";

/* ==========================================================
   FILE: BrandTable.jsx
   Elite Production Grade

   Features:
   ✅ Sticky header
   ✅ Enterprise table
   ✅ Responsive overflow
   ✅ Clean architecture
========================================================== */

const TABLE_HEADERS = [
  "#",
  "Brand",
  "Products",
  "Subcategories",
  "Status",
  "Actions",
];

const BrandTable = ({
  brands = [],

  onEdit,
  onDelete,
}) => {
  return (
    <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
      {/* ===================================================
          WRAPPER
      =================================================== */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* =================================================
              HEADER
          ================================================= */}

          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr className="border-b border-slate-200">
              {TABLE_HEADERS.map(
                (
                  item
                ) => (
                  <th
                    key={
                      item
                    }
                    className="whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500"
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody className="divide-y divide-slate-100">
            {brands.map(
              (
                brand,
                index
              ) => (
                <BrandTableRow
                  key={
                    brand.id
                  }
                  brand={
                    brand
                  }
                  index={
                    index
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(
  BrandTable
);
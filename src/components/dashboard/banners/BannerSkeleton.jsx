// FILE: src/components/dashboard/banners/BannerSkeleton.jsx

import React from "react";

/* ==========================================================
   FILE: BannerSkeleton.jsx
   Strict Elite Mode
   Production Grade

   Props:
   count = 4
   type = "card" | "table"
========================================================== */

const CardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* IMAGE */}
      <div className="aspect-[16/6] animate-pulse bg-slate-200" />

      {/* BODY */}
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          <div className="col-span-2 h-16 animate-pulse rounded-2xl bg-slate-100" />
        </div>

        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />

        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-11 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

const TableRowSkeleton = ({
  index,
}) => {
  return (
    <tr
      key={index}
      className="border-b border-slate-100"
    >
      <td className="px-5 py-4">
        <div className="h-14 w-24 animate-pulse rounded-2xl bg-slate-200" />
      </td>

      <td className="px-5 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100" />
      </td>

      <td className="px-5 py-4">
        <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
      </td>

      <td className="px-5 py-4">
        <div className="h-4 w-10 animate-pulse rounded bg-slate-100" />
      </td>

      <td className="px-5 py-4">
        <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
      </td>

      <td className="px-5 py-4">
        <div className="ml-auto h-10 w-28 animate-pulse rounded-2xl bg-slate-200" />
      </td>
    </tr>
  );
};

const BannerSkeleton = ({
  count = 4,
  type = "card",
}) => {
  if (type === "table") {
    return (
      <tbody>
        {Array.from({
          length: count,
        }).map(
          (
            _,
            index
          ) => (
            <TableRowSkeleton
              key={index}
              index={index}
            />
          )
        )}
      </tbody>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
      {Array.from({
        length: count,
      }).map(
        (
          _,
          index
        ) => (
          <CardSkeleton
            key={index}
          />
        )
      )}
    </section>
  );
};

export default BannerSkeleton; 
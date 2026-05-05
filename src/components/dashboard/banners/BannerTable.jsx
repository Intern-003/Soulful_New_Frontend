// FILE: src/components/dashboard/banners/BannerTable.jsx

import React, { memo } from "react";
import BannerRow from "./BannerRow";

/* ==========================================================
   BANNER TABLE
   Strict Elite Mode
   Production Grade

   Props:
   banners = []
   loading = false
   onEdit(banner)
   onDelete(id)
========================================================== */

const TableSkeleton = () => {
  return (
    <tbody>
      {Array.from({
        length: 6,
      }).map(
        (
          _,
          index
        ) => (
          <tr
            key={
              index
            }
            className="border-b border-slate-100"
          >
            <td className="px-5 py-4">
              <div className="h-14 w-24 animate-pulse rounded-xl bg-slate-200" />
            </td>

            <td className="px-5 py-4">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100" />
            </td>

            <td className="px-5 py-4">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
            </td>

            <td className="px-5 py-4">
              <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
            </td>

            <td className="px-5 py-4">
              <div className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
            </td>

            <td className="px-5 py-4">
              <div className="ml-auto h-10 w-28 animate-pulse rounded-2xl bg-slate-200" />
            </td>
          </tr>
        )
      )}
    </tbody>
  );
};

const EmptyState = () => {
  return (
    <tbody>
      <tr>
        <td
          colSpan={6}
          className="px-6 py-16 text-center"
        >
          <div className="mx-auto max-w-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-100 text-lg font-bold text-slate-900">
              B
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No Banners Found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create banners to start promotions.
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );
};

const BannerTable = ({
  banners = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* HEADER */}
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Banner
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Title
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Layout
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Position
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          {/* BODY */}
          {loading ? (
            <TableSkeleton />
          ) : !banners.length ? (
            <EmptyState />
          ) : (
            <tbody>
              {banners.map(
                (
                  banner
                ) => (
                  <BannerRow
                    key={
                      banner.id
                    }
                    banner={
                      banner
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
          )}
        </table>
      </div>
    </div>
  );
};

export default memo(
  BannerTable
);
// FILE: src/components/dashboard/banners/BannerStats.jsx

import React, { memo, useMemo } from "react";
import {
  Image,
  CheckCircle2,
  XCircle,
  LayoutGrid,
} from "lucide-react";

/* ==========================================================
   BANNER STATS
   Elite Production Grade

   Props:
   banners = []
   filteredCount = 0
========================================================== */

const StatCard = ({
  title,
  value,
  icon: Icon,
  hint,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {hint}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
          <Icon
            size={22}
            className="text-slate-800"
          />
        </div>
      </div>
    </div>
  );
};

const BannerStats = ({
  banners = [],
  filteredCount = 0,
}) => {
  const stats =
    useMemo(() => {
      const total =
        banners.length;

      const active =
        banners.filter(
          (
            item
          ) =>
            item.status
        ).length;

      const inactive =
        total -
        active;

      const layouts =
        new Set(
          banners.map(
            (
              item
            ) =>
              item.layout
          )
        ).size;

      return {
        total,
        active,
        inactive,
        layouts,
      };
    }, [banners]);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Banners"
        value={
          stats.total
        }
        icon={Image}
        hint={`${filteredCount} visible`}
      />

      <StatCard
        title="Active"
        value={
          stats.active
        }
        icon={
          CheckCircle2
        }
        hint="Live banners"
      />

      <StatCard
        title="Inactive"
        value={
          stats.inactive
        }
        icon={XCircle}
        hint="Hidden banners"
      />

      <StatCard
        title="Layouts"
        value={
          stats.layouts
        }
        icon={
          LayoutGrid
        }
        hint="Used styles"
      />
    </section>
  );
};

export default memo(
  BannerStats
);
// FILE: src/components/dashboard/permissions/PermissionStats.jsx

import React, { memo, useMemo } from "react";
import {
  ShieldCheck,
  FolderKanban,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

/* ==========================================================
   PERMISSION STATS
   Elite Production Grade

   Props:
   permissions = []
   filteredCount = 0
   search = ""
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

const PermissionStats = ({
  permissions = [],
  filteredCount = 0,
  search = "",
}) => {
  const stats =
    useMemo(() => {
      const total =
        permissions.length;

      const modules =
        new Set(
          permissions.map(
            (
              item
            ) =>
              item.module
          )
        ).size;

      const defaultActions =
        [
          "view",
          "create",
          "update",
          "delete",
          "approve",
          "reject",
        ];

      const custom =
        permissions.filter(
          (
            item
          ) =>
            !defaultActions.includes(
              item.action
            )
        ).length;

      return {
        total,
        modules,
        custom,
      };
    }, [permissions]);

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Permissions"
        value={
          stats.total
        }
        icon={
          ShieldCheck
        }
        hint="All permissions in system"
      />

      <StatCard
        title="Modules"
        value={
          stats.modules
        }
        icon={
          FolderKanban
        }
        hint="Unique grouped modules"
      />

      <StatCard
        title="Custom Actions"
        value={
          stats.custom
        }
        icon={
          Sparkles
        }
        hint="Non-default actions"
      />

      <StatCard
        title={
          search
            ? "Search Results"
            : "Visible Items"
        }
        value={
          filteredCount
        }
        icon={
          BadgeCheck
        }
        hint={
          search
            ? `Results for "${search}"`
            : "Currently displayed"
        }
      />
    </section>
  );
};

export default memo(
  PermissionStats
);
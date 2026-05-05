// FILE: src/components/dashboard/attributes/AttributeStats.jsx

import React, { memo } from "react";
import {
  Layers3,
  Tags,
  Search,
  Activity,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-slate-50 via-transparent to-slate-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <Icon size={22} className="text-slate-800" />
        </div>
      </div>
    </div>
  );
};

const AttributeStats = ({
  attributes = [],
  filteredCount = 0,
  search = "",
}) => {
  const totalAttributes = attributes.length;

  const totalValues = attributes.reduce(
    (sum, attr) => sum + (attr.values?.length || 0),
    0
  );

  const avgValues =
    totalAttributes > 0
      ? (totalValues / totalAttributes).toFixed(1)
      : 0;

  const stats = [
    {
      title: "Total Attributes",
      value: totalAttributes,
      subtitle: "Configured product attributes",
      icon: Layers3,
      iconBg: "bg-violet-100",
    },
    {
      title: "Total Values",
      value: totalValues,
      subtitle: "All attribute options combined",
      icon: Tags,
      iconBg: "bg-emerald-100",
    },
    {
      title: "Search Results",
      value: search ? filteredCount : totalAttributes,
      subtitle: search
        ? `Matching "${search}"`
        : "Showing all attributes",
      icon: Search,
      iconBg: "bg-sky-100",
    },
    {
      title: "Avg Values",
      value: avgValues,
      subtitle: "Average values per attribute",
      icon: Activity,
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          icon={item.icon}
          iconBg={item.iconBg}
        />
      ))}
    </section>
  );
};

export default memo(AttributeStats);
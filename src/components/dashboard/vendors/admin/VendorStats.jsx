import { useMemo } from "react";

const VendorStats = ({
  vendors = [],
}) => {
  const stats = useMemo(() => {
    const total =
      vendors.length;

    const approved =
      vendors.filter(
        (item) =>
          item.status ===
          "approved"
      ).length;

    const pending =
      vendors.filter(
        (item) =>
          item.status ===
          "pending"
      ).length;

    const rejected =
      vendors.filter(
        (item) =>
          item.status ===
          "rejected"
      ).length;

    const avgRating =
      vendors.length > 0
        ? (
            vendors.reduce(
              (
                total,
                item
              ) =>
                total +
                Number(
                  item.rating ||
                    0
                ),
              0
            ) /
            vendors.length
          ).toFixed(1)
        : "0.0";

    return {
      total,
      approved,
      pending,
      rejected,
      avgRating,
    };
  }, [vendors]);

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
      <StatCard
        title="Total Vendors"
        value={
          stats.total
        }
        subtitle="All registered sellers"
        color="slate"
      />

      <StatCard
        title="Approved"
        value={
          stats.approved
        }
        subtitle="Live active vendors"
        color="green"
      />

      <StatCard
        title="Pending"
        value={
          stats.pending
        }
        subtitle="Awaiting review"
        color="amber"
      />

      <StatCard
        title="Rejected"
        value={
          stats.rejected
        }
        subtitle="Declined requests"
        color="red"
      />

      <StatCard
        title="Avg Rating"
        value={`${stats.avgRating} ★`}
        subtitle="Overall vendor score"
        color="blue"
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  subtitle,
  color = "slate",
}) => {
  const theme = {
    slate:
      "bg-white border-slate-200 text-slate-900",
    green:
      "bg-green-50 border-green-200 text-green-700",
    amber:
      "bg-amber-50 border-amber-200 text-amber-700",
    red:
      "bg-red-50 border-red-200 text-red-700",
    blue:
      "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${theme[color]}`}
    >
      <p className="text-xs uppercase tracking-wide opacity-70">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-bold">
        {value}
      </h3>

      <p className="mt-2 text-sm opacity-75">
        {subtitle}
      </p>
    </div>
  );
};

export default VendorStats;
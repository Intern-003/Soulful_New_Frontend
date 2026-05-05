import {
  ShieldCheck,
  KeyRound,
  Crown,
  Layers3,
  TrendingUp,
} from "lucide-react";

/* ==========================================================
   FILE NAME: RoleStats.jsx

   ROLE STATS
   Elite Production Grade

   Props:
   roles = []

   Expected role structure:
   {
     id,
     name,
     permissions: []
   }
========================================================== */

const RoleStats = ({
  roles = [],
}) => {
  const totalRoles =
    roles.length;

  const totalPermissions =
    roles.reduce(
      (
        total,
        role
      ) =>
        total +
        (role
          ?.permissions
          ?.length ||
          0),
      0
    );

  const adminRoles =
    roles.filter(
      (role) =>
        role.name
          ?.toLowerCase()
          .includes(
            "admin"
          )
    ).length;

  const customRoles =
    roles.filter(
      (role) =>
        ![
          "admin",
          "super admin",
          "user",
          "customer",
          "vendor",
        ].includes(
          role.name?.toLowerCase()
        )
    ).length;

  const cards = [
    {
      title:
        "Total Roles",
      value:
        totalRoles,
      icon: ShieldCheck,
      text: "All available system roles",
      chip: "+4%",
      glow: "from-indigo-500 to-blue-500",
    },
    {
      title:
        "Permissions",
      value:
        totalPermissions,
      icon: KeyRound,
      text: "Assigned access rules",
      chip: "+12%",
      glow: "from-emerald-500 to-green-500",
    },
    {
      title:
        "Admin Roles",
      value:
        adminRoles,
      icon: Crown,
      text: "Management access roles",
      chip: "+1%",
      glow: "from-amber-500 to-orange-500",
    },
    {
      title:
        "Custom Roles",
      value:
        customRoles,
      icon: Layers3,
      text: "Manually created roles",
      chip: "+7%",
      glow: "from-pink-600 to-rose-500",
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
              {/* Glow */}
              <div
                className={`absolute right-0 top-0 h-28 w-28 rounded-full bg-gradient-to-br ${item.glow} opacity-10 blur-2xl transition-all duration-300 group-hover:scale-125`}
              />

              {/* Header */}
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

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <TrendingUp
                    size={
                      12
                    }
                  />
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
                    item.text
                  }
                </p>
              </div>

              {/* Bottom Bar */}
              <div className="relative mt-5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.glow}`}
                  style={{
                    width:
                      "78%",
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

export default RoleStats;

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
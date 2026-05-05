import {
  Users,
  UserCheck,
  Store,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

/* ==========================================================
   USER STATS
   Elite Production Grade Component
   ----------------------------------------------------------
   Props:
   users = array of users

   Expected user structure:
   {
     id,
     name,
     email,
     status,
     role,
     role_id
   }
========================================================== */

const UserStats = ({
  users = [],
}) => {
  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (u) =>
        u.status ===
          true ||
        u.status ===
          1 ||
        u.status ===
          "1" ||
        u.status ===
          "active"
    ).length;

  const vendorUsers =
    users.filter((u) =>
      getRoleName(
        u
      ).includes(
        "vendor"
      )
    ).length;

  const adminUsers =
    users.filter((u) =>
      getRoleName(
        u
      ).includes(
        "admin"
      )
    ).length;

  const cards = [
    {
      title:
        "Total Users",
      value:
        totalUsers,
      icon: Users,
      text: "All registered users",
      glow: "from-indigo-500 to-blue-500",
      chip: "+12%",
    },
    {
      title:
        "Active Users",
      value:
        activeUsers,
      icon: UserCheck,
      text: "Currently active accounts",
      glow: "from-emerald-500 to-green-500",
      chip: "+8%",
    },
    {
      title:
        "Vendors",
      value:
        vendorUsers,
      icon: Store,
      text: "Seller accounts",
      glow: "from-orange-500 to-amber-500",
      chip: "+5%",
    },
    {
      title:
        "Admins",
      value:
        adminUsers,
      icon: ShieldCheck,
      text: "Management access",
      glow: "from-pink-600 to-rose-500",
      chip: "+2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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
              {/* Glow Background */}
              <div
                className={`absolute top-0 right-0 h-28 w-28 rounded-full bg-gradient-to-br ${item.glow} opacity-10 blur-2xl transition-all duration-300 group-hover:scale-125`}
              />

              {/* Top Row */}
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

              {/* Bottom Line */}
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

export default UserStats;

/* ==========================================================
   HELPERS
========================================================== */

function getRoleName(
  user
) {
  return (
    user?.role
      ?.name ||
    user?.role ||
    ""
  )
    .toString()
    .toLowerCase();
}

function formatNumber(
  num
) {
  return new Intl.NumberFormat().format(
    num || 0
  );
} 
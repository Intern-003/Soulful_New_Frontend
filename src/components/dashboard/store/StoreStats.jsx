import React from "react";
import {
  Package,
  Users,
  Star,
  CalendarDays,
} from "lucide-react";

const StoreStats = ({
  totalProducts = 0,
  followersCount = 0,
  rating = 0,
  joinedDate,
  themeColor = "#7a1c3d",
}) => {
  const joinedYear = joinedDate
    ? new Date(joinedDate).getFullYear()
    : "-";

  const stats = [
    {
      icon: Package,
      label: "Products",
      value: totalProducts,
    },
    {
      icon: Users,
      label: "Followers",
      value: followersCount,
    },
    {
      icon: Star,
      label: "Rating",
      value: rating || "New",
    },
    {
      icon: CalendarDays,
      label: "Joined",
      value: joinedYear,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-5">
      <div
        className="
          grid
          grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                p-4
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
              "
            >
              <div className="flex items-center gap-3">

                {/* Icon */}

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                  style={{
                    backgroundColor: `${themeColor}12`,
                  }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: themeColor,
                    }}
                  />
                </div>

                {/* Content */}

                <div className="min-w-0">

                  <p
                    className="
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    {item.label}
                  </p>

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-slate-900
                      leading-tight
                      mt-0.5
                    "
                  >
                    {item.value}
                  </h3>

                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StoreStats;
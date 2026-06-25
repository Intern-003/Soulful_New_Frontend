import React from "react";

import {
  Package,
  Users,
  Star,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

import StoreFollowButton from "./StoreFollowButton";
import StoreShareButton from "./StoreShareButton";
const DEFAULT_THEME = "#7a1c3d";

const StoreHero = ({
  vendor,
  totalProducts = 0,
  followersCount = 0,
  onFollowChange,
  themeColor,
}) => {
  if (!vendor) return null;

  const primaryColor =
    themeColor ||
    vendor?.theme_color ||
    DEFAULT_THEME;

  const joinedYear =
    vendor?.created_at
      ? new Date(
          vendor.created_at
        ).getFullYear()
      : "-";

  const storeName =
    vendor?.store_name ||
    "Store";

  const description =
    vendor?.description ||
    "Explore premium products from this trusted marketplace seller.";

  return (
    <section className="relative">

      {/* COVER */}

      <div
        className="
          relative
          h-[190px]
          md:h-[280px]
          overflow-hidden
        "
      >
        <img
          src={
            vendor?.store_banner
              ? getImageUrl(
                  vendor.store_banner
                )
              : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2200"
          }
          alt={storeName}
          className="
            w-full
            h-full
            object-cover
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/30
            to-black/10
          "
        />
      </div>

      {/* STORE CARD */}

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div
          className="
            relative
            z-20
            -mt-12

            bg-white

            rounded-[24px]

            border
            border-slate-200

            shadow-lg

            p-4
            md:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
            "
          >

            {/* LEFT SIDE */}

            <div
              className="
                flex
                items-center
                gap-4
                min-w-0
              "
            >

              {/* LOGO */}

              <div
                className="
                  w-20
                  h-20

                  md:w-24
                  md:h-24

                  rounded-full
                  overflow-hidden

                  border-4
                  border-white

                  shadow-md

                  shrink-0
                "
              >
                <img
                  src={
                    vendor?.store_logo
                      ? getImageUrl(
                          vendor.store_logo
                        )
                      : `https://ui-avatars.com/api/?background=${primaryColor.replace(
                          "#",
                          ""
                        )}&color=fff&name=${encodeURIComponent(
                          storeName
                        )}`
                  }
                  alt={storeName}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              </div>

              {/* DETAILS */}

              <div className="min-w-0 flex-1">

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <h1
                    className="
                      text-xl
                      md:text-3xl
                      font-bold
                      text-slate-900
                      truncate
                    "
                  >
                    {storeName}
                  </h1>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1

                      px-2.5
                      py-1

                      rounded-full

                      text-[11px]
                      font-semibold
                    "
                    style={{
                      backgroundColor:
                        `${primaryColor}15`,
                      color:
                        primaryColor,
                    }}
                  >
                    <BadgeCheck
                      size={13}
                    />

                    Verified
                  </span>
                </div>

                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                  "
                >
                  @{vendor?.store_slug}
                </p>

                <p
                  className="
                    mt-2

                    text-sm
                    md:text-[15px]

                    text-slate-600

                    line-clamp-2

                    max-w-3xl
                  "
                >
                  {description}
                </p>

                {/* STATS */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-4
                    md:gap-5
                    mt-3

                    text-sm
                    text-slate-700
                  "
                >

                  {/* <div className="flex items-center gap-1.5">
                    <Package size={15} />
                    <span>
                      <strong>
                        {totalProducts}
                      </strong>{" "}
                      Products
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users size={15} />
                    <span>
                      <strong>
                        {followersCount}
                      </strong>{" "}
                      Followers
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Star size={15} />
                    <span>
                      {vendor?.rating ||
                        "New Store"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CalendarDays
                      size={15}
                    />
                    <span>
                      Since{" "}
                      {joinedYear}
                    </span>
                  </div> */}

                </div>

              </div>

            </div>

            {/* ACTIONS */}
<div
  className="
    flex
    flex-wrap
    items-center
    gap-3
  "
>
  <StoreShareButton
    storeName={
      vendor.store_name
    }
  />

  <StoreFollowButton
    slug={
      vendor.store_slug
    }
    initiallyFollowing={
      vendor.is_following
    }
    primaryColor={
      vendor.theme_color ||
      "#7a1c3d"
    }
    onSuccess={
      onFollowChange
    }
  />
</div>

          </div>
        </div>

      </div>

    </section>
  );
};

export default StoreHero;
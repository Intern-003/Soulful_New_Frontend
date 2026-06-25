import React from "react";

import {
  FaGlobe,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaCheckCircle,
  FaStore,
  FaUsers,
  FaStar,
} from "react-icons/fa";

const StoreAbout = ({
  vendor,
  totalProducts = 0,
  followersCount = 0,
  rating = 0,
  themeColor = "#7a1c3d",
}) => {
  if (!vendor) return null;

  const socialLinks = [
    {
      label: "Facebook",
      icon: FaFacebookF,
      url: vendor.facebook_url,
    },
    {
      label: "Instagram",
      icon: FaInstagram,
      url: vendor.instagram_url,
    },
    {
      label: "Twitter",
      icon: FaTwitter,
      url: vendor.twitter_url,
    },
    {
      label: "YouTube",
      icon: FaYoutube,
      url: vendor.youtube_url,
    },
  ].filter((item) => item.url);

  const joinedYear = vendor.created_at
    ? new Date(vendor.created_at).getFullYear()
    : "-";

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          overflow-hidden
        "
      >
        {/* HEADER */}

        <div className="px-5 md:px-6 py-4 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <FaStore
              size={18}
              style={{
                color: themeColor,
              }}
            />

            <h2
              className="
                text-lg
                md:text-xl
                font-bold
                text-slate-900
              "
            >
              About This Store
            </h2>

          </div>

        </div>

        <div className="p-5 md:p-6">

          {/* TRUST INFO */}

          <div
            className="
              flex
              flex-wrap
              gap-3
              mb-6
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-green-50
                text-green-700
                text-sm
                font-medium
              "
            >
              <FaCheckCircle />
              Verified Seller
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-slate-100
                text-slate-700
                text-sm
              "
            >
              Joined {joinedYear}
            </div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-slate-100
                text-slate-700
                text-sm
              "
            >
              @{vendor.store_slug}
            </div>

          </div>

          {/* STATS */}

          <div
            className="
              grid
              grid-cols-3
              gap-4
              mb-8
            "
          >
            <div
              className="
                border
                border-slate-200
                rounded-2xl
                p-4
              "
            >
              <FaStore
                className="mb-2"
                style={{
                  color: themeColor,
                }}
              />

              <div className="text-xl font-bold">
                {totalProducts}
              </div>

              <div className="text-sm text-slate-500">
                Products
              </div>
            </div>

            <div
              className="
                border
                border-slate-200
                rounded-2xl
                p-4
              "
            >
              <FaUsers
                className="mb-2"
                style={{
                  color: themeColor,
                }}
              />

              <div className="text-xl font-bold">
                {followersCount}
              </div>

              <div className="text-sm text-slate-500">
                Followers
              </div>
            </div>

            <div
              className="
                border
                border-slate-200
                rounded-2xl
                p-4
              "
            >
              <FaStar
                className="mb-2"
                style={{
                  color: themeColor,
                }}
              />

              <div className="text-xl font-bold">
                {rating || "New"}
              </div>

              <div className="text-sm text-slate-500">
                Rating
              </div>
            </div>

          </div>

          {/* DESCRIPTION */}

          {vendor.description && (
            <div className="mb-8">

              <h3
                className="
                  text-base
                  font-semibold
                  text-slate-900
                  mb-3
                "
              >
                Store Description
              </h3>

              <p
                className="
                  text-slate-600
                  leading-7
                "
              >
                {vendor.description}
              </p>

            </div>
          )}

          {/* ABOUT SELLER */}

          {vendor.store_about && (
            <div className="mb-8">

              <h3
                className="
                  text-base
                  font-semibold
                  text-slate-900
                  mb-3
                "
              >
                About Seller
              </h3>

              <div
                className="
                  text-slate-600
                  leading-7
                  whitespace-pre-line
                "
              >
                {vendor.store_about}
              </div>

            </div>
          )}

          {/* SOCIAL LINKS */}

          {socialLinks.length > 0 && (
            <div className="mb-8">

              <h3
                className="
                  text-base
                  font-semibold
                  text-slate-900
                  mb-4
                "
              >
                Connect With Us
              </h3>

              <div className="flex flex-wrap gap-3">

                {socialLinks.map(
                  (social, index) => {
                    const Icon =
                      social.icon;

                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-4
                          py-2.5
                          rounded-xl
                          border
                          border-slate-200
                          hover:shadow-md
                          transition-all
                        "
                      >
                        <Icon
                          size={16}
                        />

                        <span
                          className="
                            text-sm
                            font-medium
                          "
                        >
                          {social.label}
                        </span>
                      </a>
                    );
                  }
                )}

              </div>

            </div>
          )}

          {/* TRUST */}

          <div
            className="
              bg-slate-50
              border
              border-slate-200
              rounded-2xl
              p-5
            "
          >
            <div className="flex items-center gap-2 mb-2">
              <FaGlobe
                style={{
                  color: themeColor,
                }}
              />

              <span className="font-semibold">
                Marketplace Protection
              </span>
            </div>

            <ul
              className="
                text-sm
                text-slate-600
                space-y-2
              "
            >
              <li>✓ Verified Marketplace Seller</li>
              <li>✓ Secure Checkout Protection</li>
              <li>✓ Approved Vendor Account</li>
              <li>✓ Quality Product Standards</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
};

export default StoreAbout;
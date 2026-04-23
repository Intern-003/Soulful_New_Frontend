import { useMemo } from "react";
import VendorStatusBadge from "./VendorStatusBadge";

const VendorDetailsDrawer = ({
  vendor,
  onClose,
}) => {
  if (!vendor) return null;

  const joinedDate =
    useMemo(() => {
      if (
        !vendor.created_at
      )
        return "-";

      return new Date(
        vendor.created_at
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    }, [
      vendor.created_at,
    ]);

  const approvedDate =
    useMemo(() => {
      if (
        !vendor.approved_at
      )
        return "-";

      return new Date(
        vendor.approved_at
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    }, [
      vendor.approved_at,
    ]);

  const rating =
    Number(
      vendor.rating ||
        0
    ).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Vendor Profile
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {
                vendor.store_name
              }
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              /
              {
                vendor.store_slug
              }
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-[#7b1238] to-[#a61f54]" />

        {/* Logo + Main */}
        <div className="px-6 pb-8">
          <div className="-mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 rounded-3xl border-4 border-white bg-white shadow-md overflow-hidden">
                {vendor.store_logo ? (
                  <img
                    src={
                      vendor.store_logo
                    }
                    alt={
                      vendor.store_name
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400">
                    {vendor.store_name
                      ?.charAt(
                        0
                      )
                      ?.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="pb-2">
                <VendorStatusBadge
                  status={
                    vendor.status
                  }
                />
              </div>
            </div>

            <div className="pb-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <span>
                  ★
                </span>

                <span>
                  {rating}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">
              About Store
            </h3>

            <p className="mt-3 text-sm text-slate-600 leading-7">
              {vendor.description ||
                "No description available."}
            </p>
          </div>

          {/* Grid */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <InfoCard
              label="Vendor ID"
              value={
                vendor.id
              }
            />

            <InfoCard
              label="User ID"
              value={
                vendor.user_id
              }
            />

            <InfoCard
              label="Joined On"
              value={
                joinedDate
              }
            />

            <InfoCard
              label="Approved On"
              value={
                approvedDate
              }
            />

            <InfoCard
              label="Approved By"
              value={
                vendor.approved_by ||
                "-"
              }
            />

            <InfoCard
              label="Current Rating"
              value={`${rating} / 5`}
            />
          </div>

          {/* Store Media */}
          <div className="mt-8">
            <h3 className="font-semibold text-slate-900 mb-4">
              Store Media
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <MediaCard
                title="Store Logo"
                image={
                  vendor.store_logo
                }
              />

              <MediaCard
                title="Store Banner"
                image={
                  vendor.store_banner
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              Use this drawer to review vendor profile details before approval, rejection or KYC verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <p className="text-xs uppercase tracking-wide text-slate-400">
      {label}
    </p>

    <p className="mt-2 font-semibold text-slate-900 break-words">
      {value}
    </p>
  </div>
);

const MediaCard = ({
  title,
  image,
}) => (
  <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white">
    <div className="px-4 py-3 border-b border-slate-100">
      <p className="font-medium text-slate-800">
        {title}
      </p>
    </div>

    <div className="h-52 bg-slate-100">
      {image ? (
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-slate-400">
          No Image
        </div>
      )}
    </div>
  </div>
);

export default VendorDetailsDrawer;
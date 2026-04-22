import VendorActions from "./VendorActions";
import VendorStatusBadge from "./VendorStatusBadge";

const VendorRow = ({
  vendor,
  actionLoading = false,
  onApprove,
  onReject,
  onViewKYC,
  onViewDetails,
}) => {
  if (!vendor) return null;

  const {
    id,
    user_id,
    store_name,
    store_slug,
    rating,
    status,
    created_at,
    store_logo,
  } = vendor;

  const formattedDate =
    created_at
      ? new Date(
          created_at
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "-";

  const formattedRating =
    rating
      ? Number(
          rating
        ).toFixed(1)
      : "0.0";

  return (
    <tr className="hover:bg-slate-50 transition">
      {/* Store */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            {store_logo ? (
              <img
                src={
                  store_logo
                }
                alt={
                  store_name
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                {store_name
                  ?.charAt(
                    0
                  )
                  ?.toUpperCase() ||
                  "V"}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                onViewDetails?.(
                  vendor
                )
              }
              className="font-semibold text-slate-900 hover:text-[#7b1238] transition text-left"
            >
              {store_name ||
                "-"}
            </button>

            <p className="text-xs text-slate-500 mt-1">
              /
              {store_slug ||
                "-"}
            </p>
          </div>
        </div>
      </td>

      {/* Owner */}
      <td className="px-6 py-5">
        <div>
          <p className="font-medium text-slate-800">
            User #
            {user_id ||
              "-"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Vendor ID #
            {id}
          </p>
        </div>
      </td>

      {/* Rating */}
      <td className="px-6 py-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
          <span>
            ★
          </span>

          <span>
            {
              formattedRating
            }
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <VendorStatusBadge
          status={
            status
          }
        />
      </td>

      {/* Created */}
      <td className="px-6 py-5">
        <div>
          <p className="text-sm font-medium text-slate-800">
            {
              formattedDate
            }
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Joined
          </p>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-5 text-right">
        <VendorActions
          vendor={
            vendor
          }
          loading={
            actionLoading
          }
          onApprove={
            onApprove
          }
          onReject={
            onReject
          }
          onViewKYC={
            onViewKYC
          }
          onViewDetails={
            onViewDetails
          }
        />
      </td>
    </tr>
  );
};

export default VendorRow;
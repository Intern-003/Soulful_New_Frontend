import { useState } from "react";
import usePermissions from "../../../../api/hooks/usePermissions";

const VendorActions = ({
  vendor,
  loading = false,
  onApprove,
  onReject,
  onViewKYC,
  onViewDetails,
}) => {
  const { can } =
    usePermissions();

  const [open, setOpen] =
    useState(false);

  if (!vendor) return null;

  const status =
    vendor.status ||
    "pending";

  const canManage =
    can(
      "vendor",
      "approve"
    ) ||
    can(
      "vendors",
      "approve"
    ) ||
    can(
      "vendor",
      "manage"
    );

  const handleAction =
    async (
      callback
    ) => {
      setOpen(false);

      if (
        loading
      )
        return;

      await callback?.(
        vendor.id
      );
    };

  return (
    <div className="relative inline-flex justify-end">
      {/* Main Buttons */}
      <div className="hidden xl:flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onViewDetails?.(
              vendor
            )
          }
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Details
        </button>

        <button
          type="button"
          onClick={() =>
            onViewKYC?.(
              vendor
            )
          }
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          KYC
        </button>

        {status !==
          "approved" &&
          canManage && (
            <button
              type="button"
              disabled={
                loading
              }
              onClick={() =>
                handleAction(
                  onApprove
                )
              }
              className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Approve
            </button>
          )}

        {status !==
          "rejected" &&
          canManage && (
            <button
              type="button"
              disabled={
                loading
              }
              onClick={() =>
                handleAction(
                  onReject
                )
              }
              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Reject
            </button>
          )}
      </div>

      {/* Mobile / Compact Menu */}
      <div className="xl:hidden relative">
        <button
          type="button"
          onClick={() =>
            setOpen(
              (
                prev
              ) =>
                !prev
            )
          }
          className="h-10 w-10 rounded-xl border border-slate-300 hover:bg-slate-50"
        >
          ⋯
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-xl z-30 overflow-hidden">
            <MenuButton
              label="View Details"
              onClick={() => {
                setOpen(
                  false
                );
                onViewDetails?.(
                  vendor
                );
              }}
            />

            <MenuButton
              label="View KYC"
              onClick={() => {
                setOpen(
                  false
                );
                onViewKYC?.(
                  vendor
                );
              }}
            />

            {status !==
              "approved" &&
              canManage && (
                <MenuButton
                  label="Approve"
                  success
                  disabled={
                    loading
                  }
                  onClick={() =>
                    handleAction(
                      onApprove
                    )
                  }
                />
              )}

            {status !==
              "rejected" &&
              canManage && (
                <MenuButton
                  label="Reject"
                  danger
                  disabled={
                    loading
                  }
                  onClick={() =>
                    handleAction(
                      onReject
                    )
                  }
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

const MenuButton = ({
  label,
  onClick,
  danger = false,
  success = false,
  disabled = false,
}) => {
  let color =
    "text-slate-700 hover:bg-slate-50";

  if (danger) {
    color =
      "text-red-600 hover:bg-red-50";
  }

  if (success) {
    color =
      "text-green-600 hover:bg-green-50";
  }

  return (
    <button
      type="button"
      disabled={
        disabled
      }
      onClick={onClick}
      className={`w-full px-4 py-3 text-left text-sm font-medium transition disabled:opacity-50 ${color}`}
    >
      {label}
    </button>
  );
};

export default VendorActions;
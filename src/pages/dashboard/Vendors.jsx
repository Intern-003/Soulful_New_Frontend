import { useMemo, useState } from "react";

import useGet from "../../api/hooks/useGet";
import usePut from "../../api/hooks/usePut";

import VendorStats from "../../components/dashboard/vendors/admin/VendorStats";
import VendorFilters from "../../components/dashboard/vendors/admin/VendorFilters";
import VendorTable from "../../components/dashboard/vendors/admin/VendorTable";
import VendorKYCModal from "../../components/dashboard/vendors/admin/VendorKYCModal";
import VendorDetailsDrawer from "../../components/dashboard/vendors/admin/VendorDetailsDrawer";

const Vendors = () => {
  const { data, loading, refetch } =
    useGet("/admin/vendors");

  const { putData } = usePut();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [selectedVendor, setSelectedVendor] =
    useState(null);

  const [kycVendor, setKycVendor] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const vendors =
    data?.data || [];

  const filteredVendors =
    useMemo(() => {
      return vendors.filter(
        (vendor) => {
          const matchesSearch =
            vendor.store_name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            vendor.store_slug
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            String(
              vendor.user_id
            ).includes(search);

          const matchesStatus =
            status === "all"
              ? true
              : vendor.status ===
                status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      vendors,
      search,
      status,
    ]);

  const handleApprove =
    async (id) => {
      try {
        setActionLoading(
          true
        );
        setError("");
        setMessage("");

        await putData({
          url: `/admin/vendors/${id}/approve`,
        });

        setMessage(
          "Vendor approved successfully."
        );

        refetch({
          force: true,
        });
      } catch (err) {
        setError(
          "Unable to approve vendor."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  const handleReject =
    async (id) => {
      try {
        setActionLoading(
          true
        );
        setError("");
        setMessage("");

        await putData({
          url: `/admin/vendors/${id}/reject`,
        });

        setMessage(
          "Vendor rejected successfully."
        );

        refetch({
          force: true,
        });
      } catch (err) {
        setError(
          "Unable to reject vendor."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Vendor Management
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage vendor approvals, KYC and marketplace sellers.
          </p>
        </div>

        <button
          onClick={() =>
            refetch({
              force: true,
            })
          }
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <VendorStats
        vendors={
          vendors
        }
      />

      {/* Filters */}
      <VendorFilters
        search={
          search
        }
        setSearch={
          setSearch
        }
        status={
          status
        }
        setStatus={
          setStatus
        }
        total={
          filteredVendors.length
        }
      />

      {/* Table */}
      <VendorTable
        vendors={
          filteredVendors
        }
        loading={
          loading
        }
        actionLoading={
          actionLoading
        }
        onApprove={
          handleApprove
        }
        onReject={
          handleReject
        }
        onViewKYC={
          setKycVendor
        }
        onViewDetails={
          setSelectedVendor
        }
      />

      {/* KYC Modal */}
      {kycVendor && (
        <VendorKYCModal
          vendor={
            kycVendor
          }
          onClose={() =>
            setKycVendor(
              null
            )
          }
          onRefresh={() =>
            refetch({
              force: true,
            })
          }
        />
      )}

      {/* Details Drawer */}
      {selectedVendor && (
        <VendorDetailsDrawer
          vendor={
            selectedVendor
          }
          onClose={() =>
            setSelectedVendor(
              null
            )
          }
        />
      )}
    </div>
  );
};

export default Vendors;
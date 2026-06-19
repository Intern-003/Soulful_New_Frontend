import { Link, useLocation } from "react-router-dom";
import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";
import usePut from "../../../api/hooks/usePut";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CouponsList = () => {
  const [filters, setFilters] = useState({ status: "", search: "", funded_by: "" });
  const { data, loading, refetch } = useGet("/vendor/coupons", { params: filters });
  const { deleteData } = useDelete();
  const { putData } = usePut();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refresh) {
      refetch({ force: true });
    }
  }, [location.state, refetch]);

  const coupons = data?.data?.data || data?.data || [];
  const meta = data?.data;

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon? This action cannot be undone.")) return;
    try {
      await deleteData({ url: `/vendor/coupons/${id}` });
      toast.success("Coupon deleted");
      refetch({ force: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await putData({ url: `/vendor/coupons/${id}/toggle-status` });
      toast.success(currentStatus ? "Coupon deactivated" : "Coupon activated");
      refetch({ force: true });
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiry_date);
    const startDate = new Date(coupon.start_date);

    if (!coupon.status) return { text: "Inactive", color: "bg-gray-100 text-gray-700" };
    if (expiryDate < now) return { text: "Expired", color: "bg-red-100 text-red-700" };
    if (startDate > now) return { text: "Scheduled", color: "bg-yellow-100 text-yellow-700" };
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { text: "Used Up", color: "bg-orange-100 text-orange-700" };
    }
    return { text: "Active", color: "bg-green-100 text-green-700" };
  };

  const getFundingBadge = (fundedBy) => {
    const config = {
      admin: { text: "Admin Funded", color: "bg-blue-100 text-blue-700" },
      vendor: { text: "Vendor Funded", color: "bg-purple-100 text-purple-700" },
      shared: { text: "Shared", color: "bg-indigo-100 text-indigo-700" }
    };
    const c = config[fundedBy] || config.vendor;
    return <span className={`px-2 py-1 rounded-full text-xs ${c.color}`}>{c.text}</span>;
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ status: "", search: "", funded_by: "" });
    refetch({ params: { status: "", search: "", funded_by: "" } });
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a1c3d]"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#7a1c3d]">My Coupons</h2>
        <Link
          to="/dashboard/coupons/create"
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition"
        >
          + Create Coupon
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by code..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d]"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filters.funded_by}
            onChange={(e) => setFilters({ ...filters, funded_by: e.target.value })}
            className="border rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Funding</option>
            <option value="vendor">Vendor Funded</option>
            <option value="admin">Admin Funded</option>
            <option value="shared">Shared</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => refetch({ params: filters })}
              className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5e132f] transition"
            >
              Search
            </button>
            {(filters.search || filters.status || filters.funded_by) && (
              <button
                onClick={clearFilters}
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Order</th>
              <th>Usage</th>
              <th>Funding</th>
              <th>Status</th>
              <th>Listing</th>
              <th>Validity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {coupons.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-gray-500">
                  No coupons found
                  {(filters.search || filters.status || filters.funded_by) && (
                    <button onClick={clearFilters} className="ml-2 text-[#7a1c3d] underline">
                      Clear filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              coupons.map((c) => {
                const statusBadge = getStatusBadge(c);
                return (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-semibold">{c.code}</td>
                    <td className="p-3 capitalize">{c.type}</td>
                    <td className="p-3">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                    <td className="p-3">{c.min_order_amount ? `₹${c.min_order_amount}` : '-'}</td>
                    <td className="p-3">
                      {c.used_count}/{c.usage_limit || '∞'}
                      {c.usage_limit && (
                        <div className="w-16 mt-1 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${Math.min(100, (c.used_count / c.usage_limit) * 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="p-3">{getFundingBadge(c.funded_by)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="p-3">
                      {c.show_on_listing !== false ? (
                        <span className="text-green-600">✓ Visible</span>
                      ) : (
                        <span className="text-gray-400">⊙ Hidden</span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-gray-500">
                      {new Date(c.start_date).toLocaleDateString()} - {new Date(c.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        <Link
                          to={`/dashboard/coupons/${c.id}`}
                          className="text-green-600 hover:text-green-800 text-xs"
                        >
                          View
                        </Link>
                        <Link
                          to={`/dashboard/coupons/edit/${c.id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(c.id, c.status)}
                          className="text-yellow-600 hover:text-yellow-800 text-xs"
                        >
                          {c.status ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={meta.current_page === 1}
            onClick={() => refetch({ params: { ...filters, page: meta.current_page - 1 } })}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => refetch({ params: { ...filters, page: meta.current_page + 1 } })}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Summary Stats */}
      {coupons.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {coupons.length} of {meta?.total || coupons.length} coupons
          {filters.funded_by && (
            <span className="ml-2">
              | Filtered by: <span className="font-medium">{filters.funded_by === 'shared' ? 'Shared' : filters.funded_by === 'admin' ? 'Admin Funded' : 'Vendor Funded'}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponsList;
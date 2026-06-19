import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGet from "../../../api/hooks/useGet";
import useDelete from "../../../api/hooks/useDelete";
import usePut from "../../../api/hooks/usePut";
import { Search, Filter, RefreshCw, Eye, Edit, Trash2, Plus, PieChart } from "lucide-react";
import toast from "react-hot-toast";

const AdminCouponsList = () => {
  const [filters, setFilters] = useState({
    status: "",
    funded_by: "",
    type: "",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const { data, loading, refetch } = useGet("/admin/coupons", {
    params: appliedFilters,
  });
  const { deleteData } = useDelete();
  const { putData } = usePut();

  const coupons = data?.data?.data || data?.data || [];
  const meta = data?.data;
  const statistics = data?.statistics;

  const handleFilter = () => {
    const cleanedFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key] !== "") {
        cleanedFilters[key] = filters[key];
      }
    });
    setAppliedFilters(cleanedFilters);
    refetch({ params: cleanedFilters });
  };

  const handleReset = () => {
    setFilters({ status: "", funded_by: "", type: "", search: "" });
    setAppliedFilters({});
    refetch({ params: {} });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await putData({
        url: `/admin/coupons/${id}/toggle-status`,
      });
      toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'}`);
      refetch({ force: true });
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon? This action cannot be undone.")) return;
    try {
      await deleteData({ url: `/admin/coupons/${id}` });
      toast.success("Coupon deleted successfully");
      refetch({ force: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.start_date);
    const expiryDate = new Date(coupon.expiry_date);

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
      admin: { text: "Admin Funded", color: "bg-blue-100 text-blue-700", icon: "👑" },
      vendor: { text: "Vendor Funded", color: "bg-purple-100 text-purple-700", icon: "🏪" },
      shared: { text: "Shared", color: "bg-indigo-100 text-indigo-700", icon: "🤝" }
    };
    const c = config[fundedBy] || config.admin;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${c.color} flex items-center gap-1 w-fit`}>
        <span>{c.icon}</span> {c.text}
      </span>
    );
  };

  // Get active filters count
  const activeFiltersCount = Object.values(appliedFilters).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#7a1c3d]">Coupons Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform-wide and vendor coupons with custom funding splits</p>
        </div>
        <Link
          to="/dashboard/admin/coupons/create"
          className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition flex items-center gap-2"
        >
          <Plus size={18} />
          Create Coupon
        </Link>
      </div>

      {/* Stats Cards */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Total Coupons</p>
            <p className="text-2xl font-bold text-gray-800">{statistics.total_coupons || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Active Coupons</p>
            <p className="text-2xl font-bold text-green-600">{statistics.active_coupons || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Total Usage</p>
            <p className="text-2xl font-bold text-blue-600">{statistics.total_used || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Total Savings</p>
            <p className="text-2xl font-bold text-[#7a1c3d]">₹{(statistics.total_savings || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <h3 className="font-semibold text-gray-700">Filters</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-[#7a1c3d] text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <RefreshCw size={14} /> Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search by code..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d] outline-none"
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
            <option value="admin">Admin Funded</option>
            <option value="vendor">Vendor Funded</option>
            <option value="shared">Shared</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border rounded-lg p-2 text-sm bg-white"
          >
            <option value="">All Types</option>
            <option value="fixed">Fixed Amount</option>
            <option value="percent">Percentage</option>
          </select>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleFilter}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#5e132f] transition"
          >
            <Search size={14} /> Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a1c3d]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Value</th>
                  <th className="p-3 text-left">Min Order</th>
                  <th className="p-3 text-left">Funding</th>
                  <th className="p-3 text-center">Usage</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Validity</th>
                  <th className="p-3 text-left">Listing</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-gray-500">
                      No coupons found
                      {activeFiltersCount > 0 && (
                        <button onClick={handleReset} className="ml-2 text-[#7a1c3d] underline">
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const statusBadge = getStatusBadge(coupon);
                    return (
                      <tr key={coupon.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-semibold">{coupon.code}</td>
                        <td className="p-3 capitalize">{coupon.type}</td>
                        <td className="p-3">{coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                        <td className="p-3">{coupon.min_order_amount ? `₹${coupon.min_order_amount}` : '-'}</td>
                        <td className="p-3">
                          {getFundingBadge(coupon.funded_by)}
                          {coupon.funded_by === 'shared' && (
                            <div className="text-xs text-gray-500 mt-1">
                              {coupon.vendor_share_percentage}% / {coupon.admin_share_percentage}%
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {coupon.used_count}/{coupon.usage_limit || '∞'}
                          {coupon.usage_limit && (
                            <div className="w-16 mx-auto mt-1 bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-600 h-1 rounded-full"
                                style={{ width: `${Math.min(100, (coupon.used_count / coupon.usage_limit) * 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusBadge.color}`}>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {new Date(coupon.start_date).toLocaleDateString()} - {new Date(coupon.expiry_date).toLocaleDateString()}
                        </td>

                        <th className="p-3 text-left">Listing</th>


                        <td className="p-3">
                          {coupon.show_on_listing !== false ? (
                            <span className="text-green-600 text-xs">✓ Visible</span>
                          ) : (
                            <span className="text-gray-400 text-xs">⊙ Hidden</span>
                          )}
                        </td>

                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/dashboard/admin/coupons/${coupon.id}`}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              to={`/dashboard/admin/coupons/edit/${coupon.id}`}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Edit Coupon"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(coupon.id, coupon.status)}
                              className={`p-1 ${coupon.status ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
                              title={coupon.status ? 'Deactivate' : 'Activate'}
                            >
                              {coupon.status ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(coupon.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete Coupon"
                            >
                              <Trash2 size={16} />
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
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={meta.current_page === 1}
            onClick={() => refetch({ params: { ...appliedFilters, page: meta.current_page - 1 } })}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => refetch({ params: { ...appliedFilters, page: meta.current_page + 1 } })}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Footer Stats */}
      {coupons.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {coupons.length} of {meta?.total || coupons.length} coupons
          {activeFiltersCount > 0 && (
            <span className="ml-2">
              | Filtered by:
              {appliedFilters.funded_by && <span className="ml-1 font-medium">Funding: {appliedFilters.funded_by}</span>}
              {appliedFilters.status && <span className="ml-2 font-medium">Status: {appliedFilters.status}</span>}
              {appliedFilters.type && <span className="ml-2 font-medium">Type: {appliedFilters.type}</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCouponsList;
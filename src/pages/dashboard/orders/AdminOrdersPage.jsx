import React, { useState } from "react";
import useGet from "../../../api/hooks/useGet";
import AdminOrdersTable from "../../../components/dashboard/orders/AdminOrdersTable";
import usePermissions from "../../../api/hooks/usePermissions";
import { Search, Filter, RefreshCw, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const AdminOrdersPage = () => {
  const { can } = usePermissions();
  const [filters, setFilters] = useState({
    status: "",
    payment_status: "",
    settlement_status: "",
    search: "",
    date_from: "",
    date_to: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  // Fetch orders with filters
  const { data, loading, error, refetch } = useGet("/admin/orders", {
    params: appliedFilters,
  });

  // Fetch summary data
  const { data: summaryData, refetch: refetchSummary } = useGet("/admin/orders/summary");
  const summary = summaryData?.data;

  // Get currency symbol
  const getCurrencySymbol = () => '₹';
  const currencySymbol = getCurrencySymbol();

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return `${currencySymbol}0`;
    return `${currencySymbol}${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleFilter = () => {
    // Remove empty filters
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
    setFilters({
      status: "",
      payment_status: "",
      settlement_status: "",
      search: "",
      date_from: "",
      date_to: "",
    });
    setAppliedFilters({});
    refetch({ params: {} });
    refetchSummary();
  };

  const handleRefresh = () => {
    refetch({ params: appliedFilters });
    refetchSummary();
    toast.success("Data refreshed");
  };

  // FIXED: Check for 'order' (singular) permission, not 'orders' (plural)
  // The backend middleware uses 'order.view'
  const hasPermission = can('order', 'view') || can('orders', 'view');

  // Check if user has permission to view orders
  if (!hasPermission) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view orders.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#7a1c3d] text-white rounded-lg hover:bg-[#5e132f] transition"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#7a1c3d]">Orders Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white border border-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Total Orders</p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{summary.total_orders || 0}</h2>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <h2 className="text-lg sm:text-xl font-bold text-[#7a1c3d]">{formatCurrency(summary.total_revenue || 0)}</h2>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Pending Payment</p>
            <h2 className="text-lg sm:text-xl font-bold text-yellow-600">{formatCurrency(summary.total_pending_payment || 0)}</h2>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Today's Orders</p>
            <h2 className="text-lg sm:text-xl font-bold text-blue-600">{summary.today?.orders || 0}</h2>
            <p className="text-xs text-gray-400">Revenue: {formatCurrency(summary.today?.revenue || 0)}</p>
          </div>

          {summary.status_breakdown && Object.entries(summary.status_breakdown).slice(0, 2).map(([key, value]) => (
            <div key={key} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
              <p className="text-xs text-gray-500 capitalize">{key}</p>
              <h2 className="text-lg sm:text-xl font-bold">{value}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Search order # or customer"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent bg-white"
          >
            <option value="">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.payment_status}
            onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent bg-white"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={filters.settlement_status}
            onChange={(e) => setFilters({ ...filters, settlement_status: e.target.value })}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent bg-white"
          >
            <option value="">All Settlement Status</option>
            <option value="pending">Pending Settlement</option>
            <option value="settled">Settled</option>
          </select>

          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent"
            placeholder="From Date"
          />

          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d] focus:border-transparent"
            placeholder="To Date"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleFilter}
            className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition flex items-center gap-2 text-sm"
          >
            <Search size={14} />
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Reset
          </button>
        </div>

        {/* Active filters display */}
        {Object.keys(appliedFilters).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(appliedFilters).map(([key, value]) => (
              <span key={key} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {key.replace('_', ' ')}: {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Orders Table */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a1c3d]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
          Error loading orders: {error}
        </div>
      )}

      {data && data.data && data.data.data && (
        <AdminOrdersTable orders={data.data.data} />
      )}

      {data && data.data && !data.data.data?.length && !loading && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
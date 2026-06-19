import React, { useState } from "react";
import useGet from "../../../api/hooks/useGet";
import OrdersTable from "../../../components/dashboard/orders/OrdersTable";
import usePermissions from "../../../api/hooks/usePermissions";
import { Search, Filter, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const VendorOrdersPage = () => {
  const { can } = usePermissions();
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  // Fetch orders with filters
  const { data, loading, error, refetch } = useGet("/vendor/orders", {
    params: appliedFilters,
  });

  // Check permission
  const hasPermission = can('order', 'view') || can('orders', 'view');

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
    setFilters({ status: "", search: "" });
    setAppliedFilters({});
    refetch({ params: {} });
  };

  const handleRefresh = () => {
    refetch({ params: appliedFilters });
    toast.success("Orders refreshed");
  };

  if (!hasPermission) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view orders.</p>
        </div>
      </div>
    );
  }

  // Get orders data
  const orders = data?.data?.data || data?.data || [];
  const meta = data?.data;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate summary stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.grand_total || 0), 0);
  const pendingOrders = orders.filter(o => o.order_status === 'pending').length;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#7a1c3d]">My Orders</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and track your store orders</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500">Total Orders</p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">{totalOrders}</h2>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <h2 className="text-lg sm:text-xl font-bold text-[#7a1c3d]">{formatCurrency(totalRevenue)}</h2>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border">
          <p className="text-xs text-gray-500">Pending Orders</p>
          <h2 className="text-lg sm:text-xl font-bold text-yellow-600">{pendingOrders}</h2>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Search by order # or customer"
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

      {orders && orders.length > 0 && (
        <OrdersTable orders={orders} />
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center gap-2">
          <button
            disabled={meta.current_page === 1}
            onClick={() => refetch({ params: { ...appliedFilters, page: meta.current_page - 1 } })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => refetch({ params: { ...appliedFilters, page: meta.current_page + 1 } })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorOrdersPage;
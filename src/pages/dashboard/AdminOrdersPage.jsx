// src/pages/admin/AdminOrdersPage.jsx
import React, { useState } from "react";
import useGet from "../../api/hooks/useGet";
import AdminOrdersTable from "../../components/dashboard/orders/AdminOrdersTable";

const AdminOrdersPage = () => {
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });

  const { data, loading, error, refetch } = useGet("/admin/orders", {
    params: filters,
  });

  const { data: summary } = useGet("/admin/orders/summary");

  const handleFilter = () => {
    refetch({ params: filters });
  };

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 Summary Cards */}
      {summary && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 shadow rounded">
            <p>Total Orders</p>
            <h2 className="text-xl font-bold">
              {summary.data.total_orders}
            </h2>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <p>Revenue</p>
            <h2 className="text-xl font-bold text-[#7a1c3d]">
              ₹{summary.data.total_revenue}
            </h2>
          </div>

          {Object.entries(summary.data.status_breakdown).map(
            ([key, value]) => (
              <div key={key} className="bg-white p-4 shadow rounded">
                <p className="capitalize">{key}</p>
                <h2 className="text-lg font-bold">{value}</h2>
              </div>
            )
          )}
        </div>
      )}

      {/* 🔍 Filters */}
      <div className="bg-white p-4 rounded shadow flex gap-3">
        <input
          placeholder="Search order or user"
          className="border p-2 rounded w-1/3"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={handleFilter}
          className="bg-[#7a1c3d] text-white px-4 rounded"
        >
          Apply
        </button>
      </div>

      {/* 📦 Orders Table */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error</p>}

      {data && (
        <AdminOrdersTable orders={data.data.data} />
      )}
    </div>
  );
};

export default AdminOrdersPage;
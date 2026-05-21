// src/components/admin/orders/AdminOrdersTable.jsx
import React from "react";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
};

const AdminOrdersTable = ({ orders }) => {
  if (!orders?.length) {
    return (
      <div className="bg-white shadow rounded p-8 text-center text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#7a1c3d] text-white">
          <tr>
            <th className="p-3 text-left">Order #</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-center">Items</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{order.order_number}</td>
              <td className="p-3">
                <div>
                  <p>{order.user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </div>
              </td>
              <td className="p-3 text-right font-semibold">₹{Number(order.total).toLocaleString()}</td>
              <td className="p-3">
                <StatusBadge status={order.order_status} />
              </td>
              <td className="p-3">
                <span className={`text-xs ${
                  order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.payment_method} - {order.payment_status}
                </span>
              </td>
              <td className="p-3 text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="p-3 text-center">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {order.items?.length || 0} items
                </span>
              </td>
              <td className="p-3 text-center">
                <Link
                  to={`/dashboard/admin/orders/${order.id}`}
                  className="text-[#7a1c3d] hover:underline font-medium"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
// src/components/dashboard/orders/OrdersTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const OrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p className="p-4 text-gray-500 text-center">No orders found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-lg">
        <thead className="bg-[#7a1c3d] text-white">
          <tr>
            <th className="p-3 text-left">Order #</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Items</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{order.order_number}</td>
              <td className="p-3 text-right font-semibold">₹{Number(order.total).toLocaleString()}</td>
              <td className="p-3">
                <StatusBadge status={order.order_status} />
              </td>
              <td className="p-3">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {order.items?.length || 0} items
                </span>
              </td>
              <td className="p-3 text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="p-3 text-center">
                <Link
                  to={`/dashboard/vendor/orders/${order.id}`}
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

export default OrdersTable;
import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const OrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p className="p-4 text-gray-500">No orders found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-[#7a1c3d] text-white">
          <tr>
            <th className="p-3 text-left">Order #</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{order.order_number}</td>
              <td className="p-3">₹{order.total}</td>
              <td className="p-3">
                <StatusBadge status={order.order_status} />
              </td>
              <td className="p-3">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="p-3">
                <Link
                  to={`/dashboard/orders/${order.id}`}
                  className="text-[#7a1c3d] font-medium hover:underline"
                >
                  View
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
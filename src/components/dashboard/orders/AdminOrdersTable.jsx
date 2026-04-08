// src/components/admin/orders/AdminOrdersTable.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminOrdersTable = ({ orders }) => {
  return (
    <div className="bg-white shadow rounded overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#7a1c3d] text-white">
          <tr>
            <th className="p-3 text-left">Order</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.order_number}</td>
              <td>{order.user?.name}</td>
              <td>₹{order.total}</td>
              <td>{order.order_status}</td>
              <td>
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td>
                <Link
                  to={`/dashboard/admin/orders/${order.id}`}
                  className="text-[#7a1c3d]"
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

export default AdminOrdersTable;
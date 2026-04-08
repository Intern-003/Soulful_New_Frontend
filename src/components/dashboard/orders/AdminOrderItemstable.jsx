// src/components/admin/orders/AdminOrderItemsTable.jsx
import React from "react";

const AdminOrderItemsTable = ({ items }) => {
  return (
    <div className="bg-white shadow rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th>Vendor</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.product?.name}</td>
              <td>{item.vendor_id || item.creator_id}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
              <td>₹{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderItemsTable;
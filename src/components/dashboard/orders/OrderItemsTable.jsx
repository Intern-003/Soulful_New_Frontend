import React from "react";
import usePut from "../../../api/hooks/usePut";
import StatusBadge from "./StatusBadge";

const OrderItemsTable = ({ items, onUpdated }) => {
  const { putData } = usePut();

  const handleStatusChange = async (itemId, status) => {
    try {
      await putData({
        url: `/vendor/order-items/${itemId}/status`,
        data: { status },
      });

      onUpdated();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!items || items.length === 0) {
    return <p className="p-4 text-gray-500">No items found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-[#7a1c3d] text-white">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Qty</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Update</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{item.product?.name}</td>
              <td className="p-3">{item.quantity}</td>
              <td className="p-3">₹{item.price}</td>
              <td className="p-3">
                <StatusBadge status={item.status} />
              </td>

              <td className="p-3">
                <select
                  onChange={(e) =>
                    handleStatusChange(item.id, e.target.value)
                  }
                  defaultValue={item.status}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderItemsTable;
// src/components/dashboard/orders/OrderItemsTable.jsx
import React, { useCallback } from "react";
import usePut from "../../../api/hooks/usePut";
import StatusBadge from "./StatusBadge";

const OrderItemsTable = ({ items, onUpdated, canUpdate = true }) => {
  const { putData, loading } = usePut();
  const [updatingId, setUpdatingId] = React.useState(null);

  const handleStatusChange = useCallback(async (itemId, status) => {
    if (updatingId || loading) return;
    
    setUpdatingId(itemId);
    try {
      await putData({
        url: `/vendor/order-items/${itemId}/status`,
        data: { status },
      });
      // Call onUpdated only once after successful update
      if (onUpdated) {
        onUpdated();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }, [putData, onUpdated, updatingId, loading]);

  if (!items || items.length === 0) {
    return <p className="p-4 text-gray-500 text-center">No items found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded-lg">
        <thead className="bg-[#7a1c3d] text-white">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-center">Qty</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-left">Status</th>
            {canUpdate && <th className="p-3 text-left">Update Status</th>}
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  {item.variant_id && (
                    <p className="text-xs text-gray-500">Variant ID: {item.variant_id}</p>
                  )}
                  {item.shipment?.tracking_number && (
                    <p className="text-xs text-green-600 mt-1">
                      Tracking: {item.shipment.tracking_number}
                    </p>
                  )}
                </div>
               </td>
              <td className="p-3 text-center">{item.quantity}</td>
              <td className="p-3 text-right">₹{Number(item.price).toLocaleString()}</td>
              <td className="p-3 text-right font-medium">₹{Number(item.total).toLocaleString()}</td>
              <td className="p-3">
                <StatusBadge status={item.status} />
              </td>
              {canUpdate && (
                <td className="p-3">
                  <select
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    defaultValue={item.status}
                    disabled={updatingId === item.id || item.status === 'delivered' || loading}
                    className={`border rounded px-2 py-1 text-sm ${
                      item.status === 'delivered' ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingId === item.id && (
                    <span className="ml-2 text-xs text-gray-400">Updating...</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        
        <tfoot className="bg-gray-50 border-t">
          <tr>
            <td colSpan="3" className="p-3 text-right font-semibold">Total:</td>
            <td className="p-3 text-right font-bold text-[#7a1c3d]">
              ₹{items.reduce((sum, item) => sum + Number(item.total), 0).toLocaleString()}
            </td>
            <td colSpan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderItemsTable;
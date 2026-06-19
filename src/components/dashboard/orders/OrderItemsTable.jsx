import React, { useCallback, useState } from "react";
import usePut from "../../../api/hooks/usePut";
import StatusBadge from "./StatusBadge";
import { Package, Truck, ChevronDown, ChevronUp } from "lucide-react";

const OrderItemsTable = ({ items, onUpdated, canUpdate = true }) => {
  const { putData, loading } = usePut();
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleStatusChange = useCallback(async (itemId, status) => {
    if (updatingId || loading) return;
    
    setUpdatingId(itemId);
    try {
      await putData({
        url: `/vendor/order-items/${itemId}/status`,
        data: { status },
      });
      if (onUpdated) {
        onUpdated();
      }
      toast.success(`Item status updated to ${status}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }, [putData, onUpdated, updatingId, loading]);

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Package size={48} className="mx-auto text-gray-300 mb-3" />
        <p>No items found in this order</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-700">Product Details</th>
            <th className="p-4 text-center font-semibold text-gray-700">Qty</th>
            <th className="p-4 text-right font-semibold text-gray-700">Unit Price</th>
            <th className="p-4 text-right font-semibold text-gray-700">Total</th>
            <th className="p-4 text-left font-semibold text-gray-700">Status</th>
            {canUpdate && <th className="p-4 text-left font-semibold text-gray-700">Update Status</th>}
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <tr className="border-t hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Product Image */}
                    {item.product?.images?.[0]?.image_url ? (
                      <img 
                        src={item.product.images[0].image_url} 
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover border"
                        onError={(e) => e.target.src = "/placeholder.jpg"}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium text-gray-900">{item.product?.name || item.product_name}</p>
                      {item.variant_id && (
                        <p className="text-xs text-gray-500 mt-0.5">Variant ID: {item.variant_id}</p>
                      )}
                      {item.product_sku && (
                        <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
                      )}
                      
                      {/* Expand button for more details */}
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        {expandedItems[item.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {expandedItems[item.id] ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                  </div>
                </td>
                
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-gray-100 rounded-full text-sm font-medium">
                    {item.quantity}
                  </span>
                </td>
                
                <td className="p-4 text-right">
                  <div className="text-gray-700">{formatCurrency(item.selling_price || item.price)}</div>
                  {item.mrp && item.mrp > item.selling_price && (
                    <div className="text-xs text-gray-400 line-through">{formatCurrency(item.mrp)}</div>
                  )}
                </td>
                
                <td className="p-4 text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency((item.selling_price || item.price) * item.quantity)}</div>
                  {item.commission_amount > 0 && (
                    <div className="text-xs text-red-500">Commission: {formatCurrency(item.commission_amount)}</div>
                  )}
                </td>
                
                <td className="p-4">
                  <StatusBadge status={item.status} />
                  {item.shipment?.tracking_number && (
                    <p className="text-xs text-green-600 mt-1">
                      Tracking: {item.shipment.tracking_number}
                    </p>
                  )}
                </td>
                
                {canUpdate && (
                  <td className="p-4">
                    <select
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      defaultValue={item.status}
                      disabled={updatingId === item.id || item.status === 'delivered' || item.status === 'cancelled' || loading}
                      className={`border rounded px-2 py-1 text-sm ${
                        (item.status === 'delivered' || item.status === 'cancelled') 
                          ? 'bg-gray-100 cursor-not-allowed' 
                          : 'bg-white'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
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
              
              {/* Expanded Details Row */}
              {expandedItems[item.id] && (
                <tr className="bg-gray-50">
                  <td colSpan={canUpdate ? 6 : 5} className="p-4">
                    <div className="bg-white rounded-lg p-3 border">
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">Item Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {item.shipping_mode && (
                          <div><span className="text-gray-500">Shipping Mode:</span> <span className="font-medium capitalize">{item.shipping_mode}</span></div>
                        )}
                        {item.shipping_charge > 0 && (
                          <div><span className="text-gray-500">Shipping Charge:</span> <span className="font-medium">{formatCurrency(item.shipping_charge)}</span></div>
                        )}
                        {item.tax_rate > 0 && (
                          <div><span className="text-gray-500">Tax Rate:</span> <span className="font-medium">{item.tax_rate}%</span></div>
                        )}
                        {item.tax_amount > 0 && (
                          <div><span className="text-gray-500">Tax Amount:</span> <span className="font-medium">{formatCurrency(item.tax_amount)}</span></div>
                        )}
                        {item.commission_rate > 0 && (
                          <div><span className="text-gray-500">Commission:</span> <span className="font-medium">{item.commission_rate}% ({item.commission_type})</span></div>
                        )}
                        {item.vendor_payout > 0 && (
                          <div><span className="text-gray-500">Your Earnings:</span> <span className="font-medium text-green-600">{formatCurrency(item.vendor_payout)}</span></div>
                        )}
                        {item.settlement_status && (
                          <div><span className="text-gray-500">Settlement:</span> <span className={`font-medium ${item.settlement_status === 'settled' ? 'text-green-600' : 'text-orange-600'}`}>{item.settlement_status}</span></div>
                        )}
                      </div>
                    </div>
                   </td>
                 </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
        
        <tfoot className="bg-gray-50 border-t">
          <tr>
            <td colSpan="3" className="p-4 text-right font-semibold text-gray-700">Total:</td>
            <td className="p-4 text-right font-bold text-[#7a1c3d]">
              {formatCurrency(items.reduce((sum, item) => sum + (parseFloat(item.selling_price || item.price || 0) * (item.quantity || 0)), 0))}
             </td>
            <td colSpan={canUpdate ? 2 : 1}></td>
          </tr>
        </tfoot>
       </table>
    </div>
  );
};

export default OrderItemsTable;
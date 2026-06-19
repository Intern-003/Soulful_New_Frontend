import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { Eye, Package } from "lucide-react";

const OrdersTable = ({ orders }) => {
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white shadow rounded-xl p-8 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-[#7a1c3d] to-[#9b2c4f] text-white">
            <tr>
              <th className="p-3 sm:p-4 text-left font-semibold">Order #</th>
              <th className="p-3 sm:p-4 text-left font-semibold">Customer</th>
              <th className="p-3 sm:p-4 text-right font-semibold">Total</th>
              <th className="p-3 sm:p-4 text-right font-semibold">Vendor Payout</th>
              <th className="p-3 sm:p-4 text-left font-semibold">Status</th>
              <th className="p-3 sm:p-4 text-left font-semibold">Payment</th>
              <th className="p-3 sm:p-4 text-left font-semibold">Date</th>
              <th className="p-3 sm:p-4 text-center font-semibold">Items</th>
              <th className="p-3 sm:p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const vendorPayout = order.items?.reduce((sum, item) => sum + parseFloat(item.vendor_payout || 0), 0) || 0;
              
              return (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 sm:p-4">
                    <div className="font-medium text-gray-900">#{order.order_number}</div>
                    {order.settlement_status === 'pending' && (
                      <span className="text-xs text-orange-600 mt-0.5 inline-block">Pending Settlement</span>
                    )}
                  </td>
                  
                  <td className="p-3 sm:p-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || 'No email'}</p>
                    </div>
                  </td>
                  
                  <td className="p-3 sm:p-4 text-right">
                    <div className="font-semibold text-[#7a1c3d]">{formatCurrency(order.grand_total)}</div>
                   </td>
                  
                  <td className="p-3 sm:p-4 text-right">
                    <div className="font-semibold text-green-600">{formatCurrency(vendorPayout)}</div>
                   </td>
                  
                  <td className="p-3 sm:p-4">
                    <StatusBadge status={order.order_status} />
                   </td>
                  
                  <td className="p-3 sm:p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                   </td>
                  
                  <td className="p-3 sm:p-4">
                    <div className="text-gray-600">{new Date(order.created_at).toLocaleDateString('en-IN')}</div>
                    <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString('en-IN')}</div>
                   </td>
                  
                  <td className="p-3 sm:p-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {order.items?.length || 0}
                    </span>
                   </td>
                  
                  <td className="p-3 sm:p-4 text-center">
                    <Link
                      to={`/dashboard/vendor/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-[#7a1c3d] hover:text-[#5e132f] transition font-medium"
                    >
                      <Eye size={16} />
                      <span className="text-sm">View</span>
                    </Link>
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
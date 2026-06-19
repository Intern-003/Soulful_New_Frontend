// src/components/admin/orders/AdminOrdersTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Eye, Package, Clock, CheckCircle, Truck, XCircle, CreditCard } from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
    processing: { color: "bg-blue-100 text-blue-700", icon: Package },
    confirmed: { color: "bg-purple-100 text-purple-700", icon: CheckCircle },
    shipped: { color: "bg-indigo-100 text-indigo-700", icon: Truck },
    delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>
      <CreditCard size={12} />
      {status}
    </span>
  );
};

// Helper to format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const AdminOrdersTable = ({ orders }) => {
  if (!orders?.length) {
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
              <th className="p-3 sm:p-4 text-left font-semibold">Status</th>
              <th className="p-3 sm:p-4 text-left font-semibold">Payment</th>
              <th className="p-3 sm:p-4 text-left font-semibold">Date</th>
              <th className="p-3 sm:p-4 text-center font-semibold">Items</th>
              <th className="p-3 sm:p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                {/* Order Number */}
                <td className="p-3 sm:p-4">
                  <div className="font-medium text-gray-900">#{order.order_number}</div>
                  {order.settlement_status === 'pending' && (
                    <span className="text-xs text-orange-600 mt-0.5 inline-block">Pending Settlement</span>
                  )}
                 </td>
                
                {/* Customer */}
                <td className="p-3 sm:p-4">
                  <div>
                    <p className="font-medium text-gray-900">{order.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || 'No email'}</p>
                    {order.user?.phone && (
                      <p className="text-xs text-gray-400 mt-0.5">{order.user.phone}</p>
                    )}
                  </div>
                </td>
                
                {/* Total */}
                <td className="p-3 sm:p-4 text-right">
                  <div className="font-semibold text-[#7a1c3d]">{formatCurrency(order.grand_total)}</div>
                  <div className="text-xs text-gray-400">
                    {order.total_items || order.items?.length || 0} items
                  </div>
                </td>
                
                {/* Order Status */}
                <td className="p-3 sm:p-4">
                  <StatusBadge status={order.order_status} />
                </td>
                
                {/* Payment Status */}
                <td className="p-3 sm:p-4">
                  <div>
                    <PaymentStatusBadge status={order.payment_status} />
                    {order.payment_method && (
                      <div className="text-xs text-gray-500 mt-1">{order.payment_method}</div>
                    )}
                  </div>
                </td>
                
                {/* Date */}
                <td className="p-3 sm:p-4">
                  <div className="text-gray-600">{new Date(order.created_at).toLocaleDateString('en-IN')}</div>
                  <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString('en-IN')}</div>
                </td>
                
                {/* Items Count */}
                <td className="p-3 sm:p-4 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                    {order.total_items || order.items?.length || 0}
                  </span>
                </td>
                
                {/* Action */}
                <td className="p-3 sm:p-4 text-center">
                  <Link
                    to={`/dashboard/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-[#7a1c3d] hover:text-[#5e132f] transition font-medium"
                  >
                    <Eye size={16} />
                    <span className="text-sm">View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersTable;
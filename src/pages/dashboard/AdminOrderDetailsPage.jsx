import React from "react";
import { useParams } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import usePut from "../../api/hooks/usePut";
import AdminOrderItemsTable from "../../components/dashboard/orders/AdminOrderItemsTable";
import usePermissions from "../../api/hooks/usePermissions";

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const { can } = usePermissions();
  const { data, loading, error, refetch } = useGet(`/admin/orders/${id}`);
  const { putData } = usePut();

  const handleStatusChange = async (status) => {
    await putData({
      url: `/admin/orders/${id}/status`,
      data: { status },
    });
    refetch({ force: true });
  };

  if (loading) return <div className="p-6 text-center">Loading order details...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error loading order</div>;

  const order = data.data;

  // Calculate order totals
  const subtotal = order.items?.reduce((sum, item) => sum + Number(item.total), 0) || 0;
  const discount = order.discount || 0;
  const tax = order.tax || 0;
  const shippingCost = order.shipping_cost || 0;
  const total = order.total || subtotal + tax + shippingCost - discount;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#7a1c3d]">
            Order #{order.order_number}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        
        {can('orders', 'update') && (
          <select
            value={order.order_status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm font-medium focus:ring-[#7a1c3d] focus:border-[#7a1c3d]"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}
      </div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Customer</p>
          <p className="font-semibold mt-1">{order.user?.name || 'Guest'}</p>
          <p className="text-xs text-gray-400">{order.user?.email}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Payment</p>
          <p className="font-semibold mt-1 capitalize">{order.payment_method}</p>
          <p className={`text-xs mt-1 ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
            {order.payment_status}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Order Status</p>
          <p className={`font-semibold mt-1 capitalize ${
            order.order_status === 'delivered' ? 'text-green-600' :
            order.order_status === 'cancelled' ? 'text-red-600' :
            'text-blue-600'
          }`}>
            {order.order_status}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-xl font-bold text-[#7a1c3d] mt-1">₹{Number(total).toLocaleString()}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-[#7a1c3d] mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{Number(subtotal).toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Discount</span>
              <span className="text-red-600">-₹{Number(discount).toLocaleString()}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax</span>
              <span>₹{Number(tax).toLocaleString()}</span>
            </div>
          )}
          {shippingCost > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Shipping</span>
              <span>₹{Number(shippingCost).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t font-semibold">
            <span>Total</span>
            <span className="text-[#7a1c3d] text-lg">₹{Number(total).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-[#7a1c3d]">Order Items</h2>
        </div>
        <AdminOrderItemsTable items={order.items} />
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
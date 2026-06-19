import React from "react";
import { useParams } from "react-router-dom";
import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";
import AdminOrderItemsTable from "../../../components/dashboard/orders/AdminOrderItemsTable";
import usePermissions from "../../../api/hooks/usePermissions";
import toast from "react-hot-toast";
import { Truck, Package, CheckCircle, Clock, XCircle, CreditCard, MapPin, User, Calendar } from "lucide-react";
import AdminOrderShipments from "./AdminOrderShipments";

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const { can } = usePermissions();
  const { data, loading, error, refetch } = useGet(`/admin/orders/${id}`);
  const { putData } = usePut();

  // ✅ Define handleRefresh function
  const handleRefresh = () => {
    refetch({ force: true });
  };

  // Get currency symbol
  const getCurrencySymbol = () => '₹';
  const currencySymbol = getCurrencySymbol();

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return `${currencySymbol}0`;
    return `${currencySymbol}${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleStatusChange = async (status) => {
    if (!can('orders', 'update')) {
      toast.error("You don't have permission to update order status");
      return;
    }

    try {
      await putData({
        url: `/admin/orders/${id}/status`,
        data: { status },
      });
      toast.success(`Order status updated to ${status}`);
      refetch({ force: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d]"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500">Error loading order: {error}</div>
  );

  // Get order data from response structure
  const orderData = data?.data;
  const order = orderData?.order;
  const totals = orderData?.totals;
  const vendorBreakdown = orderData?.vendor_breakdown;
  const itemsByVendor = orderData?.items_by_vendor;

  if (!order) return <div className="p-6 text-center">Order not found</div>;

  // Calculate order totals using backend totals if available
  const subtotal = totals?.subtotal || order.subtotal || 0;
  const discount = totals?.coupon_discount || order.coupon_discount || 0;
  const tax = totals?.tax_total || order.tax_total || 0;
  const shippingCost = totals?.shipping_total || order.shipping_total || 0;
  const grandTotal = totals?.grand_total || order.grand_total || subtotal + tax + shippingCost - discount;

  // Status badge color mapping
  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'processing': { color: 'bg-blue-100 text-blue-800', icon: Package },
      'confirmed': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      'shipped': { color: 'bg-indigo-100 text-indigo-800', icon: Truck },
      'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${config.color}`}>
        <Icon size={12} /> {status.toUpperCase()}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[status] || statusMap.pending}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#7a1c3d]">
              Order #{order.order_number}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Calendar size={14} className="text-gray-400" />
              <p className="text-xs sm:text-sm text-gray-500">
                Placed on {new Date(order.created_at).toLocaleString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {can('orders', 'update') && (
            <select
              value={order.order_status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border rounded-lg px-3 sm:px-4 py-2 text-sm font-medium focus:ring-[#7a1c3d] focus:border-[#7a1c3d] bg-white"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>
      </div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customer Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#7a1c3d]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
              <p className="font-semibold text-gray-800 mt-1">{order.user?.name || 'Guest'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.user?.email}</p>
              {order.user?.phone && (
                <p className="text-xs text-gray-500 mt-0.5">{order.user.phone}</p>
              )}
            </div>
            <User size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
              <p className="font-semibold text-gray-800 mt-1 capitalize">{order.payment_method || 'N/A'}</p>
              <div className="mt-1">{getPaymentStatusBadge(order.payment_status)}</div>
            </div>
            <CreditCard size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Order Status Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
              <div className="mt-1">{getStatusBadge(order.order_status)}</div>
              {order.shipped_at && (
                <p className="text-xs text-gray-500 mt-2">Shipped: {new Date(order.shipped_at).toLocaleDateString()}</p>
              )}
              {order.delivered_at && (
                <p className="text-xs text-gray-500">Delivered: {new Date(order.delivered_at).toLocaleDateString()}</p>
              )}
            </div>
            <Package size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
              <p className="text-xl sm:text-2xl font-bold text-[#7a1c3d] mt-1">{formatCurrency(grandTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Items: {order.items?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Card */}
      {order.address && (
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {order.address.address_line1}<br />
                {order.address.address_line2 && <>{order.address.address_line2}<br /></>}
                {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                {order.address.country}
              </p>
              {order.address.phone && (
                <p className="text-sm text-gray-600 mt-1">Phone: {order.address.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border">
        <h2 className="text-base sm:text-lg font-semibold text-[#7a1c3d] mb-4">Order Summary</h2>
        <div className="space-y-2 max-w-md">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Discount</span>
              <span className="text-red-600">-{formatCurrency(discount)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax (GST)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          {shippingCost > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Shipping</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t font-semibold">
            <span>Grand Total</span>
            <span className="text-[#7a1c3d] text-base sm:text-lg font-bold">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Vendor Breakdown (if multiple vendors) */}
      {vendorBreakdown && vendorBreakdown.length > 1 && (
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border">
          <h2 className="text-base sm:text-lg font-semibold text-[#7a1c3d] mb-4">Vendor Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Vendor</th>
                  <th className="p-3 text-right">Items</th>
                  <th className="p-3 text-right">Subtotal</th>
                  <th className="p-3 text-right">Commission</th>
                  <th className="p-3 text-right">Vendor Payout</th>
                </tr>
              </thead>
              <tbody>
                {vendorBreakdown.map((vendor) => (
                  <tr key={vendor.vendor_id} className="border-t">
                    <td className="p-3">{vendor.vendor_name}</td>
                    <td className="p-3 text-right">{vendor.items_count}</td>
                    <td className="p-3 text-right">{formatCurrency(vendor.subtotal)}</td>
                    <td className="p-3 text-right text-red-600">{formatCurrency(vendor.commission)}</td>
                    <td className="p-3 text-right text-green-600">{formatCurrency(vendor.vendor_payout)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Items Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-[#7a1c3d]">Order Items</h2>
        </div>
        <AdminOrderItemsTable items={order.items} totals={totals} />
      </div>

      {/* ✅ Shipments Section - Already correct */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-[#7a1c3d] flex items-center gap-2">
            <Truck size={18} />
            Shipments
          </h2>
        </div>
        <div className="p-4 sm:p-5">
          <AdminOrderShipments
            orderId={order.id}
            onUpdated={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
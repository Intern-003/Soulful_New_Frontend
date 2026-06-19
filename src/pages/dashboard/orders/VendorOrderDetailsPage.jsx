import React, { useCallback, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGet from "../../../api/hooks/useGet";
import usePut from "../../../api/hooks/usePut";
import OrderItemsTable from "../../../components/dashboard/orders/OrderItemsTable";
import ShipmentForm from "../../../components/dashboard/orders/ShipmentForm";
import usePermissions from "../../../api/hooks/usePermissions";
import toast from "react-hot-toast";
import { Truck, Package, CheckCircle, Clock, XCircle, CreditCard, MapPin, User, Calendar } from "lucide-react";

const VendorOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();

  const { data, loading, error, refetch } = useGet(`/vendor/orders/${id}`);
  const { putData } = usePut();

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
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
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} /> {status?.toUpperCase()}
      </span>
    );
  };

  const handleRefetch = useCallback(() => {
    refetch({ force: true });
  }, [refetch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7a1c3d]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">Error loading order: {error}</div>
    );
  }

  const orderData = data?.data;
  const order = orderData?.order || orderData;
  const totals = orderData?.totals;
  const vendorBreakdown = orderData?.vendor_breakdown;

  if (!order) {
    return <div className="p-6 text-center">Order not found</div>;
  }

  // Calculate totals
  const subtotal = totals?.subtotal || order.subtotal || 0;
  const discount = totals?.coupon_discount || order.discount || 0;
  const tax = totals?.tax_total || order.tax || 0;
  const shippingCost = totals?.shipping_total || order.shipping_total || 0;
  const grandTotal = totals?.grand_total || order.grand_total || subtotal + tax + shippingCost - discount;
  const totalCommission = totals?.total_commission || order.items?.reduce((sum, item) => sum + parseFloat(item.commission_amount || 0), 0) || 0;
  const totalVendorPayout = totals?.total_vendor_payout || order.items?.reduce((sum, item) => sum + parseFloat(item.vendor_payout || 0), 0) || 0;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb + Back */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-sm text-gray-500">
          <Link to="/dashboard/vendor/orders" className="hover:text-[#7a1c3d] transition">
            Orders
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#7a1c3d] font-medium">
            Order #{order.order_number}
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>

      {/* Order Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Order Status Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
              <div className="mt-1">{StatusBadge({ status: order.order_status })}</div>
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

        {/* Payment Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
              <p className="font-semibold text-gray-800 mt-1 capitalize">{order.payment_method || 'N/A'}</p>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.payment_status?.toUpperCase()}
              </span>
            </div>
            <CreditCard size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Customer Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#7a1c3d]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
              <p className="font-semibold text-gray-800 mt-1">{order.user?.name || 'Guest'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.user?.email}</p>
              {order.address?.phone && (
                <p className="text-xs text-gray-500 mt-0.5">{order.address.phone}</p>
              )}
            </div>
            <User size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
              <p className="text-xl sm:text-2xl font-bold text-[#7a1c3d] mt-1">{formatCurrency(grandTotal)}</p>
              <p className="text-xs text-green-600 mt-1">Vendor Payout: {formatCurrency(totalVendorPayout)}</p>
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
          {totalCommission > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Platform Commission</span>
              <span className="text-red-600">-{formatCurrency(totalCommission)}</span>
            </div>
          )}
          <div className="flex justify-between py-3 border-t font-semibold">
            <span>Grand Total</span>
            <span className="text-[#7a1c3d] text-base sm:text-lg font-bold">{formatCurrency(grandTotal)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-green-200 bg-green-50 -mx-2 px-2 rounded">
            <span className="font-semibold text-green-700">Your Earnings (Vendor Payout)</span>
            <span className="font-bold text-green-700 text-lg">{formatCurrency(totalVendorPayout)}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-[#7a1c3d]">Order Items</h2>
        </div>
        <OrderItemsTable 
          items={order.items} 
          onUpdated={handleRefetch}
          canUpdate={order.order_status !== 'delivered' && order.order_status !== 'cancelled'}
        />
      </div>

      {/* Shipment Section - Only show if not delivered/cancelled */}
      {order.order_status !== 'delivered' && order.order_status !== 'cancelled' && (
        <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border">
          <h2 className="text-base sm:text-lg font-semibold text-[#7a1c3d] mb-4 flex items-center gap-2">
            <Truck size={18} />
            Shipment Management
          </h2>
          <ShipmentForm orderId={order.id} onCreated={handleRefetch} />
        </div>
      )}
    </div>
  );
};

export default VendorOrderDetailsPage;
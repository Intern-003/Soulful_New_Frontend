// src/components/admin/orders/AdminOrderItemsTable.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package, Truck, Store, User, DollarSign } from "lucide-react";

// Helper to format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Item Status Badge
const ItemStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
    processing: { color: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
    confirmed: { color: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
    shipped: { color: "bg-indigo-100 text-indigo-800", dot: "bg-indigo-500" },
    delivered: { color: "bg-green-100 text-green-800", dot: "bg-green-500" },
    cancelled: { color: "bg-red-100 text-red-800", dot: "bg-red-500" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

// Single Item Row Component
const OrderItemRow = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);

  // Get seller info with proper priority
  const getSellerInfo = () => {
    // Priority 1: Vendor with store_name
    if (item.vendor?.store_name) {
      return {
        name: item.vendor.store_name,
        type: 'vendor',
        id: item.vendor_id,
        icon: Store,
        color: 'bg-purple-100 text-purple-700'
      };
    }

    // Priority 2: Creator/User
    if (item.creator?.name) {
      return {
        name: item.creator.name,
        type: 'individual',
        id: item.creator_id,
        icon: User,
        color: 'bg-blue-100 text-blue-700'
      };
    }

    // Priority 3: Fallback
    return {
      name: item.vendor_id ? `Vendor #${item.vendor_id}` : (item.creator_id ? `Seller #${item.creator_id}` : 'Unknown Seller'),
      type: 'unknown',
      id: item.vendor_id || item.creator_id,
      icon: Store,
      color: 'bg-gray-100 text-gray-700'
    };
  };

  const seller = getSellerInfo();
  const SellerIcon = seller.icon;

  // Check if item has shipping info
  const hasShippingInfo = item.shipping_mode || item.shipping_charge;

  return (
    <>
      <tr className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
        {/* Product Details with Expand/Collapse for shipping info */}
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

            {/* Product Info */}
            <div>
              <p className="font-medium text-gray-900">{item.product?.name || item.product_name || 'Product'}</p>
              {item.variant_id && (
                <p className="text-xs text-gray-500 mt-0.5">Variant ID: {item.variant_id}</p>
              )}
              {item.product_sku && (
                <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
              )}

              {/* Expand/Collapse button for shipping details */}
              {hasShippingInfo && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {expanded ? 'Hide Shipping Details' : 'Show Shipping Details'}
                </button>
              )}
            </div>
          </div>
        </td>

        {/* Seller Info */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${seller.color}`}>
              <SellerIcon size={14} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{seller.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${seller.color}`}>
                  {seller.type === 'vendor' ? 'Vendor' : (seller.type === 'individual' ? 'Individual' : 'Seller')}
                </span>
                <span className="text-xs text-gray-400">ID: {seller.id}</span>
              </div>
            </div>
          </div>
        </td>

        {/* Quantity */}
        <td className="p-4 text-center">
          <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 bg-gray-100 rounded-full text-sm font-medium">
            {item.quantity}
          </span>
        </td>

        {/* Unit Price */}
        <td className="p-4 text-right">
          <div className="text-gray-700">{formatCurrency(item.selling_price || item.price)}</div>
          {item.mrp && item.mrp > item.selling_price && (
            <div className="text-xs text-gray-400 line-through">{formatCurrency(item.mrp)}</div>
          )}
        </td>

        {/* Total */}
        <td className="p-4 text-right">
          <div className="font-semibold text-gray-900">{formatCurrency((item.selling_price || item.price) * item.quantity)}</div>
          {item.commission_amount > 0 && (
            <div className="text-xs text-red-500">Commission: {formatCurrency(item.commission_amount)}</div>
          )}
          {item.coupon_discount > 0 && (
            <div className="text-xs text-green-600">Coupon Discount: -{formatCurrency(item.coupon_discount)}</div>
          )}
        </td>

        {/* Item Status */}
        <td className="p-4">
          <ItemStatusBadge status={item.status || 'pending'} />
        </td>
      </tr>

      {/* Expanded Shipping Details Row */}
      {expanded && hasShippingInfo && (
        <tr className="bg-gray-50">
          <td colSpan="6" className="p-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-2">Shipping & Tax Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {item.shipping_mode && (
                      <div>
                        <span className="text-gray-500">Shipping Mode:</span>
                        <span className="ml-2 font-medium capitalize">{item.shipping_mode}</span>
                      </div>
                    )}
                    {item.shipping_charge > 0 && (
                      <div>
                        <span className="text-gray-500">Shipping Charge:</span>
                        <span className="ml-2 font-medium">{formatCurrency(item.shipping_charge)}</span>
                      </div>
                    )}
                    {item.tax_rate > 0 && (
                      <div>
                        <span className="text-gray-500">Tax Rate:</span>
                        <span className="ml-2 font-medium">{item.tax_rate}%</span>
                      </div>
                    )}
                    {item.tax_amount > 0 && (
                      <div>
                        <span className="text-gray-500">Tax Amount:</span>
                        <span className="ml-2 font-medium">{formatCurrency(item.tax_amount)}</span>
                      </div>
                    )}
                    {item.commission_rate > 0 && (
                      <div>
                        <span className="text-gray-500">Commission Rate:</span>
                        <span className="ml-2 font-medium">{item.commission_rate}% ({item.commission_type})</span>
                      </div>
                    )}
                    {item.settlement_status && (
                      <div>
                        <span className="text-gray-500">Settlement:</span>
                        <span className={`ml-2 font-medium capitalize ${item.settlement_status === 'settled' ? 'text-green-600' : 'text-orange-600'}`}>
                          {item.settlement_status}
                        </span>
                      </div>
                    )}
                    {item.settled_at && (
                      <div>
                        <span className="text-gray-500">Settled At:</span>
                        <span className="ml-2 text-sm">
                          {new Date(item.settled_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Vendor Payout Info */}
                  {item.vendor_payout > 0 && (
                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="text-sm text-gray-600">Vendor Payout:</span>
                      </div>
                      <span className="font-semibold text-green-600">{formatCurrency(item.vendor_payout)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AdminOrderItemsTable = ({ items, totals }) => {
  // Calculate totals from items
  const subtotal = items?.reduce((sum, item) => sum + (parseFloat(item.selling_price || item.price || 0) * (item.quantity || 0)), 0) || 0;
  const totalCommission = items?.reduce((sum, item) => sum + parseFloat(item.commission_amount || 0), 0) || 0;
  const totalVendorPayout = items?.reduce((sum, item) => sum + parseFloat(item.vendor_payout || 0), 0) || 0;
  const totalTax = items?.reduce((sum, item) => sum + parseFloat(item.tax_amount || 0), 0) || 0;
  const totalShipping = items?.reduce((sum, item) => sum + parseFloat(item.shipping_charge || 0), 0) || 0;
  const totalDiscount = items?.reduce((sum, item) => sum + parseFloat(item.coupon_discount || 0), 0) || 0;

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
        <thead className="bg-gray-50 border-b sticky top-0">
          <tr>
            <th className="p-4 text-left font-semibold text-gray-700">Product Details</th>
            <th className="p-4 text-left font-semibold text-gray-700">Seller</th>
            <th className="p-4 text-center font-semibold text-gray-700">Quantity</th>
            <th className="p-4 text-right font-semibold text-gray-700">Unit Price</th>
            <th className="p-4 text-right font-semibold text-gray-700">Total</th>
            <th className="p-4 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>

        <tbody>
          {items?.map((item, index) => (
            <OrderItemRow key={item.id} item={item} index={index} />
          ))}
        </tbody>

        {/* Summary Footer */}
        <tfoot className="bg-gray-50 border-t sticky bottom-0">
          {/* Subtotal */}
          <tr className="border-b">
            <td colSpan="3" className="p-4 text-right font-semibold text-gray-700">
              Subtotal
            </td>
            <td colSpan="3" className="p-4 text-right font-semibold text-gray-900">
              {formatCurrency(subtotal)}
            </td>
          </tr>

          {/* Discount */}
          {totalDiscount > 0 && (
            <tr className="border-b">
              <td colSpan="3" className="p-4 text-right text-gray-600">
                Discount
              </td>
              <td colSpan="3" className="p-4 text-right text-red-600">
                -{formatCurrency(totalDiscount)}
              </td>
            </tr>
          )}

          {/* Tax */}
          {totalTax > 0 && (
            <tr className="border-b">
              <td colSpan="3" className="p-4 text-right text-gray-600">
                Tax (GST)
              </td>
              <td colSpan="3" className="p-4 text-right text-gray-900">
                {formatCurrency(totalTax)}
              </td>
            </tr>
          )}

          {/* Shipping */}
          {totalShipping > 0 && (
            <tr className="border-b">
              <td colSpan="3" className="p-4 text-right text-gray-600">
                Shipping
              </td>
              <td colSpan="3" className="p-4 text-right text-gray-900">
                {formatCurrency(totalShipping)}
              </td>
            </tr>
          )}

          {/* Commission */}
          {totalCommission > 0 && (
            <tr className="border-b">
              <td colSpan="3" className="p-4 text-right text-gray-600">
                Platform Commission
              </td>
              <td colSpan="3" className="p-4 text-right text-red-600">
                -{formatCurrency(totalCommission)}
              </td>
            </tr>
          )}

          {/* Vendor Payout */}
          {totalVendorPayout > 0 && (
            <tr className="bg-green-50">
              <td colSpan="3" className="p-4 text-right font-semibold text-green-700">
                Total Vendor Payout
              </td>
              <td colSpan="3" className="p-4 text-right font-bold text-green-700 text-lg">
                {formatCurrency(totalVendorPayout)}
              </td>
            </tr>
          )}

          {/* Grand Total */}
          <tr className="bg-[#7a1c3d]/5">
            <td colSpan="3" className="p-4 text-right font-bold text-gray-800">
              Grand Total
            </td>
            <td colSpan="3" className="p-4 text-right font-bold text-[#7a1c3d] text-xl">
              {formatCurrency(subtotal + totalTax + totalShipping - totalDiscount)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default AdminOrderItemsTable;
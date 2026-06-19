// src/components/dashboard/orders/UserOrderShipments.jsx
import React from "react";
import useGet from "../../api/hooks/useGet";
import { Truck, Package, CheckCircle, Clock, XCircle } from "lucide-react";

const UserOrderShipments = ({ orderId }) => {
  const { data, loading } = useGet(`/orders/${orderId}/shipment-details`);
  
  const shipments = data?.data?.all_shipments || [];
  const vendorShipments = data?.data?.vendor_shipments || [];
  const marketplaceShipments = data?.data?.marketplace_shipments || [];

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      processing: { color: "bg-blue-100 text-blue-800", icon: Clock },
      shipped: { color: "bg-indigo-100 text-indigo-800", icon: Truck },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle }
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${c.color}`}>
        <Icon size={12} /> {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7a1c3d]"></div></div>;
  }

  if (shipments.length === 0) {
    return <p className="text-center text-gray-500 py-4">No shipments available</p>;
  }

  return (
    <div className="space-y-4">
      {vendorShipments.map((shipment) => (
        <div key={shipment.id} className="border rounded-lg p-4 bg-purple-50">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-purple-600" />
                <span className="font-medium text-sm">Vendor: {shipment.vendor_name}</span>
              </div>
              <p className="text-sm mt-1">Carrier: {shipment.carrier}</p>
              <p className="text-xs text-gray-500">Tracking: {shipment.tracking_number}</p>
              <div className="mt-2">
                {shipment.items?.map((item) => (
                  <span key={item.id} className="text-xs bg-white px-2 py-0.5 rounded mr-1">
                    {item.product_name} x{item.quantity}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(shipment.status)}
              {shipment.shipped_at && (
                <p className="text-xs text-gray-500 mt-1">
                  Shipped: {new Date(shipment.shipped_at).toLocaleDateString()}
                </p>
              )}
              {shipment.estimated_delivery && (
                <p className="text-xs text-gray-500">
                  Est. Delivery: {new Date(shipment.estimated_delivery).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {marketplaceShipments.map((shipment) => (
        <div key={shipment.id} className="border rounded-lg p-4 bg-blue-50">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                <span className="font-medium text-sm">Marketplace Shipping</span>
              </div>
              <p className="text-sm mt-1">Carrier: {shipment.carrier}</p>
              <p className="text-xs text-gray-500">Tracking: {shipment.tracking_number}</p>
              <div className="mt-2">
                {shipment.items?.map((item) => (
                  <span key={item.id} className="text-xs bg-white px-2 py-0.5 rounded mr-1">
                    {item.product_name} x{item.quantity}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(shipment.status)}
              {shipment.shipped_at && (
                <p className="text-xs text-gray-500 mt-1">
                  Shipped: {new Date(shipment.shipped_at).toLocaleDateString()}
                </p>
              )}
              {shipment.estimated_delivery && (
                <p className="text-xs text-gray-500">
                  Est. Delivery: {new Date(shipment.estimated_delivery).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserOrderShipments;
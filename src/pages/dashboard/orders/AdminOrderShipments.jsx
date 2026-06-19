// src/components/dashboard/orders/AdminOrderShipments.jsx
import React, { useState, useEffect } from "react";
import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import usePut from "../../../api/hooks/usePut";
import toast from "react-hot-toast";
import { Truck, Package, CheckCircle, XCircle, Clock, Plus } from "lucide-react";

const AdminOrderShipments = ({ orderId, onUpdated }) => {
  const [showForm, setShowForm] = useState(false);
  const [shipmentData, setShipmentData] = useState({
    carrier: "",
    tracking_number: "",
    estimated_delivery: "",
    courier_cost: "",
    item_ids: [],
  });

  // Fetch order shipments
  const { data, loading, refetch } = useGet(`/admin/orders/${orderId}/shipments`);
  const { postData, loading: postLoading } = usePost();
  //const { putData, loading: putLoading } = usePut();

  const shipments = data?.data;
  const vendorShipments = shipments?.vendor_shipments || [];
  const marketplaceShipments = shipments?.marketplace_shipments || [];
  const pendingMarketplaceItems = shipments?.pending_marketplace_items || [];

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    
    if (shipmentData.item_ids.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    try {
      await postData({
        url: "/admin/orders/marketplace-shipment",
        data: {
          order_id: orderId,
          carrier: shipmentData.carrier,
          tracking_number: shipmentData.tracking_number,
          item_ids: shipmentData.item_ids,
          courier_cost: shipmentData.courier_cost || 0,
          estimated_delivery: shipmentData.estimated_delivery || null,
        },
      });
      
      toast.success("Marketplace shipment created successfully");
      setShowForm(false);
      setShipmentData({
        carrier: "",
        tracking_number: "",
        estimated_delivery: "",
        courier_cost: "",
        item_ids: [],
      });
      refetch();
      if (onUpdated) onUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create shipment");
    }
  };

  const handleUpdateShipmentStatus = async (shipmentId, status) => {
    try {
      await putData({
        url: `/admin/shipments/${shipmentId}/status`,
        data: { status },
      });
      toast.success(`Shipment status updated to ${status}`);
      refetch();
      if (onUpdated) onUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const toggleItemSelection = (itemId) => {
    setShipmentData(prev => ({
      ...prev,
      item_ids: prev.item_ids.includes(itemId)
        ? prev.item_ids.filter(id => id !== itemId)
        : [...prev.item_ids, itemId]
    }));
  };

  const handleSelectAll = () => {
    const allIds = pendingMarketplaceItems.map(item => item.id);
    if (shipmentData.item_ids.length === allIds.length) {
      setShipmentData(prev => ({ ...prev, item_ids: [] }));
    } else {
      setShipmentData(prev => ({ ...prev, item_ids: allIds }));
    }
  };

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
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7a1c3d]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vendor Shipments */}
      {vendorShipments.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Truck size={16} className="text-purple-600" />
            Vendor Shipments
          </h4>
          <div className="space-y-3">
            {vendorShipments.map((shipment) => (
              <div key={shipment.id} className="border rounded-lg p-4 bg-purple-50">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-sm">{shipment.carrier}</p>
                    <p className="text-xs text-gray-500">Tracking: {shipment.tracking_number}</p>
                    <p className="text-xs text-gray-500">
                      Vendor: {shipment.vendor?.store_name || 'Unknown'}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {shipment.items?.map((item) => (
                        <span key={item.id} className="text-xs bg-white px-2 py-0.5 rounded">
                          {item.product_name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(shipment.status)}
                    <select
                      value={shipment.status}
                      onChange={(e) => handleUpdateShipmentStatus(shipment.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marketplace Shipments */}
      {marketplaceShipments.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Package size={16} className="text-blue-600" />
            Marketplace Shipments
          </h4>
          <div className="space-y-3">
            {marketplaceShipments.map((shipment) => (
              <div key={shipment.id} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-sm">{shipment.carrier}</p>
                    <p className="text-xs text-gray-500">Tracking: {shipment.tracking_number}</p>
                    <p className="text-xs text-gray-500">
                      Courier Cost: ₹{shipment.courier_cost || 0}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {shipment.items?.map((item) => (
                        <span key={item.id} className="text-xs bg-white px-2 py-0.5 rounded">
                          {item.product_name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(shipment.status)}
                    <select
                      value={shipment.status}
                      onChange={(e) => handleUpdateShipmentStatus(shipment.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Marketplace Shipment */}
      {pendingMarketplaceItems.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-[#7a1c3d] font-medium text-sm flex items-center gap-2 hover:underline"
          >
            <Plus size={16} />
            {showForm ? 'Cancel' : 'Create Marketplace Shipment'}
          </button>

          {showForm && (
            <form onSubmit={handleCreateShipment} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Carrier *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentData.carrier}
                    onChange={(e) => setShipmentData({ ...shipmentData, carrier: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="e.g., BlueDart"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tracking Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipmentData.tracking_number}
                    onChange={(e) => setShipmentData({ ...shipmentData, tracking_number: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="Tracking number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    value={shipmentData.estimated_delivery}
                    onChange={(e) => setShipmentData({ ...shipmentData, estimated_delivery: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Courier Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={shipmentData.courier_cost}
                    onChange={(e) => setShipmentData({ ...shipmentData, courier_cost: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-700">
                    Select Items to Ship ({pendingMarketplaceItems.length} available)
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-[#7a1c3d] hover:underline"
                  >
                    {shipmentData.item_ids.length === pendingMarketplaceItems.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                  {pendingMarketplaceItems.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 ${
                        shipmentData.item_ids.includes(item.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={shipmentData.item_ids.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="rounded border-gray-300 text-[#7a1c3d]"
                      />
                      <div className="flex-1">
                        <p className="text-sm">{item.product_name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {shipmentData.item_ids.length} items
                </p>
              </div>

              <button
                type="submit"
                disabled={postLoading || shipmentData.item_ids.length === 0}
                className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition disabled:opacity-50"
              >
                {postLoading ? "Creating..." : "Create Shipment"}
              </button>
            </form>
          )}
        </div>
      )}

      {vendorShipments.length === 0 && marketplaceShipments.length === 0 && pendingMarketplaceItems.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-4">
          No shipments found for this order
        </p>
      )}
    </div>
  );
};

export default AdminOrderShipments;
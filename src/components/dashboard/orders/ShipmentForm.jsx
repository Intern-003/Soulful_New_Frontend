// src/components/dashboard/orders/ShipmentForm.jsx
import React, { useState, useEffect } from "react";
import useGet from "../../../api/hooks/useGet";
import usePost from "../../../api/hooks/usePost";
import toast from "react-hot-toast";

const ShipmentForm = ({ orderId, onCreated }) => {
  const [form, setForm] = useState({
    carrier: "",
    tracking_number: "",
    estimated_delivery: "",
    item_ids: [],
  });
  const [items, setItems] = useState([]);
  const { postData, loading } = usePost();

  // Fetch vendor items for this order
  const { data, loading: loadingItems, refetch } = useGet(`/vendor/orders/${orderId}/items`);

  useEffect(() => {
    if (data?.data?.items) {
      // Only show items without shipment
      const pendingItems = data.data.items.filter(item => !item.shipment_id);
      setItems(pendingItems);
    }
  }, [data]);

  const handleToggleItem = (itemId) => {
    setForm(prev => ({
      ...prev,
      item_ids: prev.item_ids.includes(itemId)
        ? prev.item_ids.filter(id => id !== itemId)
        : [...prev.item_ids, itemId]
    }));
  };

  const handleSelectAll = () => {
    const allIds = items.map(item => item.id);
    if (form.item_ids.length === allIds.length) {
      setForm(prev => ({ ...prev, item_ids: [] }));
    } else {
      setForm(prev => ({ ...prev, item_ids: allIds }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.item_ids.length === 0) {
      toast.error("Please select at least one item to ship");
      return;
    }

    if (!form.carrier || !form.tracking_number) {
      toast.error("Please fill in carrier and tracking number");
      return;
    }

    try {
      await postData({
        url: `/vendor/orders/${orderId}/shipment`,
        data: {
          carrier: form.carrier,
          tracking_number: form.tracking_number,
          estimated_delivery: form.estimated_delivery || null,
          item_ids: form.item_ids,
        },
      });
      
      toast.success("Shipment created successfully");
      setForm({
        carrier: "",
        tracking_number: "",
        estimated_delivery: "",
        item_ids: [],
      });
      refetch();
      if (onCreated) onCreated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create shipment");
    }
  };

  if (loadingItems) {
    return <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7a1c3d]"></div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p>All items have been shipped</p>
        <p className="text-xs mt-1">No pending items available for shipment</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Carrier *</label>
          <input
            type="text"
            value={form.carrier}
            onChange={(e) => setForm({ ...form, carrier: e.target.value })}
            placeholder="e.g., BlueDart, Delhivery"
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tracking Number *</label>
          <input
            type="text"
            value={form.tracking_number}
            onChange={(e) => setForm({ ...form, tracking_number: e.target.value })}
            placeholder="Enter tracking number"
            className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#7a1c3d]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Delivery</label>
          <input
            type="date"
            value={form.estimated_delivery}
            onChange={(e) => setForm({ ...form, estimated_delivery: e.target.value })}
            className="w-full border rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-gray-700">Items to Ship ({items.length} available)</label>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-[#7a1c3d] hover:underline"
          >
            {form.item_ids.length === items.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
          {items.map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 ${
                form.item_ids.includes(item.id) ? 'bg-blue-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={form.item_ids.includes(item.id)}
                onChange={() => handleToggleItem(item.id)}
                className="rounded border-gray-300 text-[#7a1c3d]"
              />
              <div className="flex-1">
                <p className="text-sm">{item.product_name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                <p className="text-xs text-gray-400">SKU: {item.product_sku}</p>
              </div>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Selected: {form.item_ids.length} items
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || form.item_ids.length === 0}
        className="bg-[#7a1c3d] text-white px-4 py-2 rounded-lg hover:bg-[#5e132f] transition disabled:opacity-50 w-full sm:w-auto"
      >
        {loading ? "Creating..." : "Create Shipment"}
      </button>
    </form>
  );
};

export default ShipmentForm;
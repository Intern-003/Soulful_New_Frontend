// src/components/dashboard/orders/ShipmentForm.jsx
import React, { useState, useCallback } from "react";
import usePost from "../../../api/hooks/usePost";

const ShipmentForm = ({ orderId, onCreated }) => {
  const { postData, loading } = usePost();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    carrier: "",
    tracking_number: "",
    estimated_delivery: "",
  });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!form.carrier || !form.tracking_number) {
      alert("Please fill carrier and tracking number");
      return;
    }

    if (submitted || loading) return;
    
    setSubmitted(true);
    try {
      await postData({
        url: `/vendor/orders/${orderId}/shipment`,
        data: form,
      });

      setForm({ carrier: "", tracking_number: "", estimated_delivery: "" });
      
      // Call onCreated only once
      if (onCreated) {
        onCreated();
      }
      
      alert("Shipment created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Shipment creation failed");
    } finally {
      setSubmitted(false);
    }
  }, [form, orderId, postData, onCreated, submitted, loading]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrier *
          </label>
          <select
            value={form.carrier}
            onChange={(e) => setForm({ ...form, carrier: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-[#7a1c3d] focus:border-[#7a1c3d]"
            required
            disabled={submitted || loading}
          >
            <option value="">Select Carrier</option>
            <option value="Blue Dart">Blue Dart</option>
            <option value="DTDC">DTDC</option>
            <option value="Delhivery">Delhivery</option>
            <option value="India Post">India Post</option>
            <option value="FedEx">FedEx</option>
            <option value="DHL">DHL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number *
          </label>
          <input
            type="text"
            placeholder="Enter tracking number"
            value={form.tracking_number}
            onChange={(e) =>
              setForm({ ...form, tracking_number: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:ring-[#7a1c3d] focus:border-[#7a1c3d]"
            required
            disabled={submitted || loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Delivery Date (Optional)
          </label>
          <input
            type="date"
            value={form.estimated_delivery}
            onChange={(e) =>
              setForm({ ...form, estimated_delivery: e.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 focus:ring-[#7a1c3d] focus:border-[#7a1c3d]"
            disabled={submitted || loading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitted || loading}
        className="bg-[#7a1c3d] text-white px-5 py-2 rounded-lg hover:bg-[#5e1530] transition disabled:opacity-50"
      >
        {submitted || loading ? "Creating Shipment..." : "Create Shipment"}
      </button>
    </form>
  );
};

export default ShipmentForm;
import React, { useState } from "react";
import usePost from "../../../api/hooks/usePost";

const ShipmentForm = ({ orderId, onCreated }) => {
  const { postData, loading } = usePost();

  const [form, setForm] = useState({
    carrier: "",
    tracking_number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.carrier || !form.tracking_number) {
      alert("Please fill all fields");
      return;
    }

    try {
      await postData({
        url: `/vendor/orders/${orderId}/shipment`,
        data: form,
      });

      setForm({ carrier: "", tracking_number: "" });
      onCreated();
    } catch (err) {
      alert("Shipment failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="Carrier"
          value={form.carrier}
          onChange={(e) =>
            setForm({ ...form, carrier: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Tracking Number"
          value={form.tracking_number}
          onChange={(e) =>
            setForm({ ...form, tracking_number: e.target.value })
          }
          className="border p-2 rounded"
        />
      </div>

      <button
        disabled={loading}
        className="bg-[#7a1c3d] text-white px-4 py-2 rounded hover:opacity-90"
      >
        {loading ? "Creating..." : "Create Shipment"}
      </button>
    </form>
  );
};

export default ShipmentForm;
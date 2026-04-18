import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import OrderItemsTable from "../../components/dashboard/orders/OrderItemsTable";
import ShipmentForm from "../../components/dashboard/orders/ShipmentForm";

const VendorOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useGet(`vendor/orders/${id}`);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading order...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">Error loading order</div>
    );
  }

  const order = data.data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <Link to="/vendor/orders" className="hover:underline">
            Orders
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#7a1c3d] font-medium">
            Order #{order.order_number}
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
        >
          ← Back
        </button>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-5 rounded-xl shadow-sm border space-y-2">
        <h2 className="text-lg font-semibold text-[#7a1c3d]">
          Order Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="font-medium">#{order.order_number}</p>
          </div>

          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-medium">₹{order.total}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium capitalize">{order.order_status}</p>
          </div>

          <div>
            <p className="text-gray-500">Placed On</p>
            <p className="font-medium">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-[#7a1c3d] mb-4">
          Order Items
        </h2>

        <OrderItemsTable items={order.items} onUpdated={refetch({ force: true })} />
      </div>

      {/* Shipment Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-[#7a1c3d] mb-4">
          Shipment
        </h2>

        <ShipmentForm orderId={order.id} onCreated={refetch({ force: true })} />
      </div>
    </div>
  );
};

export default VendorOrderDetailsPage;
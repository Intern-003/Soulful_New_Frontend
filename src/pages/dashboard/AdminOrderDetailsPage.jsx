import React from "react";
import { useParams } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import usePut from "../../api/hooks/usePut";
import AdminOrderItemsTable from "../../components/dashboard/orders/AdminOrderItemsTable";

const AdminOrderDetailsPage = () => {
  const { id } = useParams();

  const { data, loading, error, refetch } = useGet(`/admin/orders/${id}`);
  const { putData } = usePut();

  const handleStatusChange = async (status) => {
    await putData({
      url: `/admin/orders/${id}/status`,
      data: { status },
    });

    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const order = data.data;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Order #{order.order_number}
        </h1>

        <select
          value={order.order_status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order Info */}
      <div className="bg-white p-4 shadow rounded">
        <p><b>User:</b> {order.user?.name}</p>
        <p><b>Total:</b> ₹{order.total}</p>
        <p><b>Status:</b> {order.order_status}</p>
      </div>

      {/* Items */}
      <AdminOrderItemsTable items={order.items} />
    </div>
  );
};

export default AdminOrderDetailsPage;
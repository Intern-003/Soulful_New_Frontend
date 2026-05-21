import React from "react";
import useGet from "../../api/hooks/useGet";
import OrdersTable from "../../components/dashboard/orders/OrdersTable";
import usePermissions from "../../api/hooks/usePermissions";

const VendorOrdersPage = () => {
  const { data, loading, error } = useGet("/vendor/orders");
const { can } = usePermissions();

  // if (!can('orders', 'view')) {
  //   return <div className="p-6 text-center text-red-500">Access Denied</div>;
  // }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#7a1c3d]">
          Orders
        </h1>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border">
        {loading && (
          <p className="p-4 text-gray-500">Loading orders...</p>
        )}

        {error && (
          <p className="p-4 text-red-500">
            Error loading orders
          </p>
        )}

        {data && (
          <OrdersTable orders={data.data.data} />
        )}
      </div>
    </div>
  );
};

export default VendorOrdersPage;
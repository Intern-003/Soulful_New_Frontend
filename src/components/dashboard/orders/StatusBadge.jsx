// src/components/dashboard/orders/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const getColor = () => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      paid: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-orange-100 text-orange-700",
    };
    return statusMap[status] || "bg-gray-100 text-gray-600";
  };

  const getLabel = () => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || status;
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
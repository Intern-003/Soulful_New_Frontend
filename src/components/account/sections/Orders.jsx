import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useGet from "../../../api/hooks/useGet";

const statusStyles = {
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
  pending: "bg-yellow-100 text-yellow-600",
};

export default function Orders() {
  const [openOrder, setOpenOrder] = useState(null);

  // 🔥 API
  const { data, loading, error } = useGet("/orders");

  const orders = data?.data?.data || []; // 👈 important (pagination structure)

  // ✅ LOADING
  if (loading) {
    return <p className="text-sm text-gray-500">Loading orders...</p>;
  }

  // ❌ ERROR
  if (error) {
    return <p className="text-red-500">Failed to load orders</p>;
  }

  return (
    <div className="relative">
      {/* 🔥 Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#7A1C3D]/10 blur-3xl rounded-full -z-10"></div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#2d0f1f]">Orders</h2>
          <p className="text-sm text-gray-500">Track and manage your orders</p>
        </div>
      </div>

      {/* EMPTY */}
      {orders.length === 0 && (
        <p className="text-gray-500 text-sm">No orders found</p>
      )}

      {/* ORDERS */}
      <div className="space-y-5">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            layout
            className="bg-white/80 backdrop-blur-xl border border-[#ead9e0] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* TOP ROW */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* LEFT */}
              <div>
                <p className="text-sm text-gray-500">Order</p>
                <p className="font-semibold text-[#2d0f1f]">
                  {order.order_number}
                </p>

                {/* ADDRESS */}
                <p className="text-xs text-gray-500 mt-2">
                  {order.address?.city}, {order.address?.state}
                </p>
              </div>

              {/* DATE */}
              <div className="flex flex-col md:items-center">
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* STATUS */}
              <div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                    statusStyles[order.order_status] ||
                    "bg-gray-100 text-gray-500"
                  }`}
                >
                  {order.order_status}
                </span>
              </div>

              {/* TOTAL */}
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold text-[#7A1C3D]">₹{order.total}</p>
              </div>

              {/* ACTION */}
              <button
                onClick={() => setOpenOrder(openOrder === index ? null : index)}
                className="w-9 h-9 rounded-full border border-[#ead9e0] flex items-center justify-center hover:bg-[#f9f3f6] transition"
              >
                {openOrder === index ? "−" : "+"}
              </button>
            </div>

            {/* EXPAND */}
            <AnimatePresence>
              {openOrder === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 pt-5 border-t"
                >
                  {/* ITEMS */}
                  {order.items.length > 0 ? (
                    order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between mb-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image || "/placeholder.png"}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-[#7A1C3D]">
                          ₹{item.price}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No items found for this order
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useGet from "../../../api/hooks/useGet";
import { getImageUrl } from "../../../utils/getImageUrl";
import { Package, Truck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import UserOrderShipments from "../../../pages/user/UserOrderShipments";

const statusStyles = {
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-600", icon: XCircle },
  pending: { color: "bg-yellow-100 text-yellow-600", icon: Clock },
  processing: { color: "bg-blue-100 text-blue-600", icon: Package },
  shipped: { color: "bg-purple-100 text-purple-600", icon: Truck },
  confirmed: { color: "bg-indigo-100 text-indigo-600", icon: AlertCircle },
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "₹0";
  return `₹${parseFloat(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function Orders() {
  const [openOrder, setOpenOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // API call with pagination
  const { data, loading, error, refetch } = useGet(`/orders?page=${currentPage}`);
  
  // Extract data from response
  const orders = data?.data?.data || [];
  const pagination = data?.data;
  const totalPages = pagination?.last_page || 1;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setOpenOrder(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <OrdersSkeleton />;
  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-500">Failed to load orders</p>
      <button 
        onClick={() => refetch()}
        className="mt-3 px-4 py-2 bg-[#7a1c3d] text-white rounded-lg text-sm"
      >
        Try Again
      </button>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="relative">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#7A1C3D]/10 blur-3xl rounded-full -z-10"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2d0f1f]">Orders</h2>
            <p className="text-sm text-gray-500">Track and manage your orders</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-[#ead9e0] rounded-2xl p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-sm text-gray-400 mt-2">
            Looks like you haven't placed any orders yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#7A1C3D]/10 blur-3xl rounded-full -z-10"></div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#2d0f1f]">Orders</h2>
          <p className="text-sm text-gray-500">Track and manage your orders</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-[#7a1c3d]">{pagination?.total || orders.length}</span> orders
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-5">
        {orders.map((order, index) => {
          const statusStyle = statusStyles[order.order_status] || statusStyles.pending;
          const StatusIcon = statusStyle.icon;
          
          // Calculate item count
          const itemCount = order.items?.length || order.total_items || 0;
          
          // Get correct total amount
          const totalAmount = order.grand_total || order.total;
          
          return (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/80 backdrop-blur-xl border border-[#ead9e0] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* TOP ROW */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* ORDER INFO */}
                <div className="min-w-[140px]">
                  <p className="text-xs text-gray-500">Order #{order.order_number}</p>
                  <p className="text-xs text-gray-400 mt-1">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                </div>

                {/* DATE */}
                <div className="min-w-[100px]">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* STATUS */}
                <div className="min-w-[100px]">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full font-medium capitalize ${statusStyle.color}`}
                  >
                    <StatusIcon size={12} />
                    {order.order_status}
                  </span>
                </div>

                {/* TOTAL */}
                <div className="min-w-[100px] text-right md:text-left">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-semibold text-[#7A1C3D]">{formatCurrency(totalAmount)}</p>
                </div>

                {/* ACTION BUTTON */}
                <button
                  onClick={() => setOpenOrder(openOrder === index ? null : index)}
                  className="w-9 h-9 rounded-full border border-[#ead9e0] flex items-center justify-center hover:bg-[#f9f3f6] transition text-lg"
                >
                  {openOrder === index ? "−" : "+"}
                </button>
              </div>

              {/* EXPANDED DETAILS */}
              <AnimatePresence>
                {openOrder === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 pt-5 border-t border-[#ead9e0]"
                  >
                    {/* ORDER ITEMS */}
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, i) => {
                            const product = item.product;
                            const price = item.selling_price || item.price;
                            const totalPrice = price * item.quantity;
                            const img = product?.images?.find((img) => img.is_primary)?.image_url ||
                                       product?.images?.[0]?.image_url;

                            return (
                              <div key={item.id || i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={getImageUrl(img || "/placeholder.png")}
                                    alt={product?.name || item.product_name}
                                    className="w-12 h-12 rounded-xl object-cover border"
                                    onError={(e) => (e.target.src = "/placeholder.png")}
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {product?.name || item.product_name}
                                    </p>
                                    {item.variant_name && (
                                      <p className="text-xs text-gray-500">Variant: {item.variant_name}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                      Qty: {item.quantity} × {formatCurrency(price)}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-[#7A1C3D]">
                                  {formatCurrency(totalPrice)}
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-500">No items found</p>
                        )}
                      </div>
                    </div>

                    {/* ✅ SHIPMENT TRACKING - ADD THIS SECTION */}
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Truck size={16} />
                        Shipment Tracking
                      </h4>
                      <UserOrderShipments orderId={order.id} />
                    </div>

                    {/* SHIPPING ADDRESS */}
                    {order.address && (
                      <div className="mb-5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h4>
                        <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600">
                          <p>{order.address.name || "Customer"}</p>
                          <p>{order.address.address_line1}</p>
                          {order.address.address_line2 && <p>{order.address.address_line2}</p>}
                          <p>{order.address.city}, {order.address.state} - {order.address.postal_code}</p>
                          <p>{order.address.country}</p>
                          {order.address.phone && <p className="mt-1">Phone: {order.address.phone}</p>}
                        </div>
                      </div>
                    )}

                    {/* ORDER SUMMARY */}
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Summary</h4>
                      <div className="bg-gray-50 p-3 rounded-xl space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span>{formatCurrency(order.shipping_total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax (GST)</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t mt-2 font-semibold">
                          <span>Grand Total</span>
                          <span className="text-[#7A1C3D]">{formatCurrency(order.grand_total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* PAYMENT INFO */}
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl flex-1">
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium capitalize mt-1">{order.payment_method || "COD"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl flex-1">
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <p className={`text-sm font-medium mt-1 capitalize ${order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                          {order.payment_status || "pending"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg transition ${
                    currentPage === pageNum
                      ? "bg-[#7a1c3d] text-white"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Orders Skeleton Component
function OrdersSkeleton() {
  return (
    <div className="relative animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-7 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-56 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-7 w-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, Clock, ArrowRight, Printer, Download, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../app/slices/cartSlice";
import { useLocation } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

// Mock order data - In production, this would come from your API response
const mockOrderDetails = {
  orderId: "SFP-2412-89A4",
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  time: new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }),
  estimatedDelivery: "Wed, Dec 27 - Fri, Dec 29",
  paymentMethod: "Credit Card",
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    address: "123 Luxury Lane",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    country: "India",
  },
};

const OrderComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, displayTotals: cartTotals } = useSelector((state) => state.cart);

  // Get order data from navigation state or fallback to cart data
  const { orderData, orderSummary } = location.state || {};

  // Use real order data if available, otherwise use cart data
  const displayItems = orderSummary?.items || cartItems;
  const displayTotals = orderSummary?.totals || cartTotals;
  const shippingAddress = orderSummary?.shippingAddress || mockOrderDetails.shippingAddress;
  const paymentMethod = orderSummary?.paymentMethod || mockOrderDetails.paymentMethod;

  const orderId = orderData?.orderId || mockOrderDetails.orderId;
  const orderDate = orderData?.timestamp
    ? new Date(orderData.timestamp).toLocaleDateString()
    : mockOrderDetails.date;


  // Clear cart on successful order placement (only once)
  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(clearCart());
    }
  }, [dispatch, cartItems.length]);

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  const handleViewOrders = () => {
    navigate("/account");
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // In production, call API to generate/download invoice
    alert("Invoice download will be available in the full version");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#8B0D3A]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7A1C3D]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Success Header with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full mb-5 mx-auto shadow-lg">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </motion.div>

        {/* Order Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl border border-[#f1d6dd] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Order Header */}
          <div className="bg-gradient-to-r from-[#8B0D3A]/5 to-[#7A1C3D]/5 px-5 md:px-8 py-5 md:py-6 border-b border-[#f1d6dd]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Order ID
                </p>
                <p className="text-lg md:text-2xl font-mono font-semibold text-[#8B0D3A]">
                  #{mockOrderDetails.orderId}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePrintOrder}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:border-[#8B0D3A] hover:text-[#8B0D3A] transition-all duration-200"
                >
                  <Printer size={16} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:border-[#8B0D3A] hover:text-[#8B0D3A] transition-all duration-200"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Invoice</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 mt-4 text-xs md:text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                {mockOrderDetails.date} at {mockOrderDetails.time}
              </span>
              <span className="flex items-center gap-2">
                <Truck size={14} className="text-gray-400" />
                Est. Delivery: {mockOrderDetails.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Order Timeline - Responsive Steps */}
          <div className="px-5 md:px-8 py-6 md:py-8 border-b border-[#f1d6dd]">
            <div className="relative">
              {/* Desktop Timeline */}
              <div className="hidden md:flex justify-between">
                {[
                  { label: "Order Placed", status: "completed", date: "Today" },
                  { label: "Processing", status: "completed", date: "Today" },
                  { label: "Shipped", status: "current", date: "Est. Tomorrow" },
                  { label: "Delivered", status: "pending", date: "Est. Dec 27-29" },
                ].map((step, idx) => (
                  <div key={idx} className="flex-1 text-center relative">
                    <div className="relative z-10">
                      <div
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 
                          ${step.status === "completed"
                            ? "bg-green-500 border-green-500 text-white"
                            : step.status === "current"
                              ? "bg-[#8B0D3A] border-[#8B0D3A] text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle size={18} />
                        ) : step.status === "current" ? (
                          <Package size={18} />
                        ) : (
                          <Clock size={18} />
                        )}
                      </div>
                      <p className="font-medium text-sm mt-3">{step.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                    </div>
                    {idx < 3 && (
                      <div
                        className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 
                          ${idx === 0 || idx === 1
                            ? "bg-green-500"
                            : "bg-gray-200"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Timeline - Vertical */}
              <div className="md:hidden space-y-6">
                {[
                  { label: "Order Placed", status: "completed", description: "Your order has been confirmed" },
                  { label: "Processing", status: "completed", description: "Payment verified & order packed" },
                  { label: "Shipped", status: "current", description: "Ready for dispatch" },
                  { label: "Delivered", status: "pending", description: "Estimated by Dec 27-29" },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                          ${step.status === "completed"
                            ? "bg-green-500 border-green-500 text-white"
                            : step.status === "current"
                              ? "bg-[#8B0D3A] border-[#8B0D3A] text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle size={16} />
                        ) : step.status === "current" ? (
                          <Package size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                      </div>
                      {idx < 3 && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-sm">{step.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-5 md:px-8 py-6 md:py-8">
            <h3 className="font-semibold text-gray-800 mb-4 text-base md:text-lg">
              Order Summary
            </h3>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              {displayItems.map((item, idx) => {
                const product = item.product;
                const img =
                  product?.images?.find((i) => i.is_primary)?.image_url ||
                  product?.images?.[0]?.image_url;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(img || "/placeholder.png")}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                      />

                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {product?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-[#8B0D3A] text-sm sm:text-base">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Price Details */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{displayTotals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{displayTotals.shipping.toLocaleString()}</span>
              </div>
              {displayTotals.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{displayTotals.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base md:text-lg font-bold">
                <span>Total</span>
                <span className="text-[#8B0D3A]">₹{displayTotals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping & Payment Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/70 backdrop-blur-sm border border-[#f1d6dd] rounded-xl p-5"
          >
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Truck size={16} className="text-[#8B0D3A]" />
              Shipping Address
            </h4>



            <p className="text-sm text-gray-700">
              {shippingAddress.firstName} {shippingAddress.lastName}
              <br />
              {shippingAddress.address}
              <br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              <br />
              {shippingAddress.country}
            </p>


            <p className="text-sm text-gray-700">{paymentMethod}</p>

            <p className="text-lg md:text-2xl font-mono font-semibold text-[#8B0D3A]">
              #{orderId}
            </p>


            <span className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              {orderDate}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-white/70 backdrop-blur-sm border border-[#f1d6dd] rounded-xl p-5"
          >
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              💳 Payment Method
            </h4>
            <p className="text-sm text-gray-700">{paymentMethod}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle size={12} /> Payment confirmed
            </p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={handleContinueShopping}
            className="group flex items-center justify-center gap-2 px-6 md:px-8 py-3 bg-[#8B0D3A] text-white rounded-xl font-medium hover:bg-[#6e0a2e] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home size={18} />
            Continue Shopping
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={handleViewOrders}
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 border border-[#8B0D3A] text-[#8B0D3A] rounded-xl font-medium hover:bg-[#8B0D3A] hover:text-white transition-all duration-300"
          >
            <Package size={18} />
            View My Orders
          </button>
        </motion.div>

        {/* Help Section */}
        <p className="text-center text-xs md:text-sm text-gray-400 mt-10">
          A confirmation email has been sent to your registered email address.
          <br />
          For any queries, please contact our{" "}
          <button className="text-[#8B0D3A] hover:underline font-medium">
            support team
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default OrderComplete;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} from "../../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, Tag, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";
import CartSkeleton from "../../components/shop/CartSkeleton";
import useGet from "../../api/hooks/useGet";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  const {
    items,
    itemsByVendor,
    totals,
    status,
    updatingItemId,
    removingItemId,
    appliedCoupon,
    vendorSummaries,
  } = useSelector((state) => state.cart);

  // Get cart ID from state
  const cartId = useSelector((state) => state.cart.id);

  // In Cart.jsx, add this helper function after your selectors:

// Helper to get vendor name with fallback for individual sellers
const getVendorDisplayName = (vendorGroup) => {
  if (!vendorGroup) return "Independent Seller";
  if (vendorGroup.vendor_name && vendorGroup.vendor_name !== 'Unknown') {
    return vendorGroup.vendor_name;
  }
  if (vendorGroup.vendor_id) {
    return `Vendor #${vendorGroup.vendor_id}`;
  }
  return "Independent Seller";
};




  // ✅ Use useGet instead of fetch
  const { data: couponsData, loading: loadingCoupons, refetch: refetchCoupons } = useGet(
    "/coupon/available",
    {
      params: {
        cart_total: totals.subtotal || 0,
        cart_id: cartId || '',
      },
      autoFetch: totals.subtotal > 0 && !appliedCoupon,
    }
  );

  const availableCoupons = couponsData?.data?.applicable || [];

  // Refetch coupons when cart total changes
  useEffect(() => {
    if (totals.subtotal > 0 && !appliedCoupon) {
      refetchCoupons();
    }
  }, [totals.subtotal, cartId, appliedCoupon]);

  const getStock = (item) => {
    if (item.variant?.stock !== undefined) return item.variant.stock;
    return item.product?.stock ?? 0;
  };

  const getSellingPrice = (item) => {
    return item.selling_price || item.price || 0;
  };

  const handleQtyChange = (id, qty, item) => {
    if (qty < 1) return;
    if (updatingItemId || removingItemId) return;

    const stock = getStock(item);

    if (qty > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    dispatch(updateCartItem({ itemId: id, quantity: qty }));
  };

  const handleRemove = (id) => {
    if (updatingItemId || removingItemId) return;
    dispatch(removeCartItem({ itemId: id }));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    try {
      await dispatch(applyCoupon({ coupon_code: couponCode })).unwrap();
      toast.success("Coupon applied successfully!");
      setCouponCode("");
      setShowAvailableCoupons(false);
      refetchCoupons();
    } catch (err) {
      toast.error(err || "Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleApplySuggestedCoupon = async (code) => {
    setApplyingCoupon(true);
    try {
      await dispatch(applyCoupon({ coupon_code: code })).unwrap();
      toast.success("Coupon applied successfully!");
      setCouponCode("");
      setShowAvailableCoupons(false);
      refetchCoupons();
    } catch (err) {
      toast.error(err || "Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await dispatch(removeCoupon()).unwrap();
      toast.success("Coupon removed");
      refetchCoupons();
    } catch (err) {
      toast.error("Failed to remove coupon");
    }
  };

  // Format date for coupon expiry
  const formatExpiryDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expired";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  if (status === "loading" && items.length === 0) {
    return <CartSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-[#7A1C3D]">Your Cart</h1>
          <p className="text-gray-500 mt-2">
            Review your selections before checkout
          </p>
        </div>

        <div className="px-5 py-2 rounded-full bg-[#8B0D3A] text-white text-sm shadow">
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-32 h-32 rounded-full bg-[#f8e9ef] flex items-center justify-center text-5xl mb-6">
            🛒
          </div>
          <h2 className="text-2xl font-semibold text-[#111]">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything to your cart yet
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 px-8 py-3 rounded-full bg-[#8B0D3A] text-white hover:bg-[#6b0a2e] transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (

        
        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16 grid lg:grid-cols-3 gap-10">
          {/* LEFT ITEMS - Grouped by Vendor */}
          <div className="lg:col-span-2 space-y-8">
            {itemsByVendor.map((vendorGroup, vendorIndex) => (
              <div key={vendorGroup.vendor_id} className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                  <div className="w-1 h-6 bg-[#8B0D3A] rounded-full"></div>
                  <h3 className="font-semibold text-gray-800">
                    {vendorGroup.vendor_name}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {vendorGroup.items?.length || 0} items
                  </span>
                </div>

                <div className="space-y-4">
                  {vendorGroup.items?.map((item, i) => {
                    const product = item.product;
                    const variant = item.variant;
                    const img =
                      product?.images?.find((img) => img.is_primary)?.image_url ||
                      product?.images?.[0]?.image_url ||
                      variant?.images?.[0]?.image_url;

                    const sellingPrice = getSellingPrice(item);
                    const totalPrice = sellingPrice * item.quantity;
                    const stock = getStock(item);
                    const isLowStock = stock <= 5 && stock > 0;
                    const isUpdating = updatingItemId === item.id;
                    const isRemoving = removingItemId === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`group relative flex gap-5 p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#f1d6dd] shadow-sm hover:shadow-md transition ${
                          isRemoving ? "opacity-50" : ""
                        }`}
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {img ? (
                            <img
                              src={getImageUrl(img)}
                              alt={product?.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              🛍️
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium text-[#222] line-clamp-2">
                            {product?.name}
                          </h3>

                          {variant && (
                            <p className="text-xs text-gray-500 mt-1">
                              Variant: {variant.sku}
                            </p>
                          )}

                          <p className="text-sm text-gray-500 mt-1">
                            ₹{sellingPrice.toLocaleString()}
                          </p>

                          {isLowStock && stock > 0 && (
                            <p className="text-orange-600 text-xs mt-2">
                              Only {stock} items left in stock
                            </p>
                          )}

                          {stock === 0 && (
                            <p className="text-red-600 text-xs mt-2">
                              Out of stock
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() =>
                                handleQtyChange(item.id, item.quantity - 1, item)
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 rounded-full border hover:bg-[#8B0D3A] hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="min-w-[30px] text-center text-sm">
                              {isUpdating ? "..." : item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleQtyChange(item.id, item.quantity + 1, item)
                              }
                              disabled={item.quantity >= stock || stock === 0}
                              className="p-2 rounded-full border disabled:opacity-40 hover:bg-[#8B0D3A] hover:text-white transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id)}
                            className="flex items-center gap-1 text-xs text-red-500 mt-3 hover:underline transition"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>

                        <div className="font-semibold text-[#8B0D3A] min-w-[80px] text-right">
                          ₹{totalPrice.toLocaleString()}
                        </div>

                        {isUpdating && (
                          <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center text-sm backdrop-blur-sm">
                            Updating...
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="sticky top-24 h-fit">
            <div className="bg-white/80 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-[#7A1C3D] mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{totals.subtotal?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    ₹{totals.shipping_total?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">
                    ₹{totals.tax_total?.toLocaleString() || 0}
                  </span>
                </div>

                {totals.coupon_discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{totals.coupon_discount?.toLocaleString() || 0}</span>
                  </div>
                )}

                <hr className="my-3" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Grand Total</span>
                  <span className="text-[#8B0D3A]">
                    ₹{totals.grand_total?.toLocaleString() || 0}
                  </span>
                </div>

                {totals.coupon_discount > 0 && (
                  <div className="mt-2 p-3 bg-green-50 rounded-xl text-center">
                    <p className="text-xs text-green-700">
                      You saved ₹{totals.coupon_discount?.toLocaleString()} with coupon
                    </p>
                  </div>
                )}
              </div>

              {/* AVAILABLE COUPONS SECTION */}
              {!appliedCoupon && availableCoupons.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-[#f8e9ef] rounded-xl hover:from-pink-100 hover:to-[#f1d6dd] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#8B0D3A]" />
                      <span className="text-sm font-medium text-gray-700">
                        {availableCoupons.length} Coupons Available!
                      </span>
                    </div>
                    {showAvailableCoupons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  <AnimatePresence>
                    {showAvailableCoupons && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2 overflow-hidden"
                      >
                        {loadingCoupons ? (
                          <div className="p-4 text-center">
                            <div className="w-6 h-6 border-2 border-[#8B0D3A] border-t-transparent rounded-full animate-spin mx-auto" />
                          </div>
                        ) : (
                          availableCoupons.slice(0, 3).map((coupon) => (
                            <div
                              key={coupon.id}
                              className="p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-[#8B0D3A] text-sm">
                                      {coupon.code}
                                    </span>
                                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    {coupon.min_order_amount > 0 && (
                                      <span className="text-xs text-gray-400">
                                        Min: ₹{coupon.min_order_amount}
                                      </span>
                                    )}
                                    <span className={`text-xs ${coupon.days_left <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                                      {formatExpiryDate(coupon.expiry_date)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleApplySuggestedCoupon(coupon.code)}
                                  disabled={applyingCoupon}
                                  className="px-3 py-1 text-xs bg-[#8B0D3A] text-white rounded-lg hover:bg-[#6b0a2e] transition disabled:opacity-50"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                        {availableCoupons.length > 3 && (
                          <button
                            onClick={() => navigate("/shop")}
                            className="w-full text-center text-xs text-[#8B0D3A] hover:underline mt-2"
                          >
                            + {availableCoupons.length - 3} more coupons available
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* COUPON SECTION */}
              <div className="mt-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-[#f8e9ef] rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-[#8B0D3A]" />
                      <span className="text-sm font-medium text-[#8B0D3A]">
                        {appliedCoupon.coupon_code || "Coupon Applied"}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 hover:bg-[#d4b8c1] rounded-full transition"
                    >
                      <X size={14} className="text-[#8B0D3A]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8B0D3A]/30 text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon}
                      className="px-4 py-2 rounded-xl bg-[#8B0D3A] text-white text-sm font-medium hover:bg-[#6b0a2e] transition disabled:opacity-50"
                    >
                      {applyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {/* CTA BUTTONS */}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full py-3 rounded-xl bg-[#8B0D3A] text-white font-medium shadow hover:bg-[#6b0a2e] transition"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={handleClearCart}
                className="mt-3 w-full py-2 text-sm border rounded-xl text-red-500 hover:bg-red-50 transition"
              >
                Clear Cart
              </button>
            </div>

            {/* Vendor Summary */}
            {vendorSummaries && vendorSummaries.length > 1 && (
              <div className="mt-4 p-4 bg-white/50 backdrop-blur rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Shipping from:</p>
                <div className="space-y-1">
                  {vendorSummaries.map((vendor) => (
                    <div key={vendor.vendor_id} className="flex justify-between text-xs">
                      <span className="text-gray-600">{vendor.vendor_name}</span>
                      <span className="text-gray-500">
                        {vendor.items_count} item{vendor.items_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="text-center pb-10 text-xs text-gray-400">
        Soulfull — Designed for a seamless checkout experience
      </div>
    </div>
  );
};

export default Cart;
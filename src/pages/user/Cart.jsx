import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totals, status, updatingItemId, removingItemId } = useSelector(
    (state) => state.cart,
  );

  const handleQtyChange = (id, qty) => {
    if (qty < 1) return;
    if (updatingItemId || removingItemId) return;
    dispatch(updateCartItem({ itemId: id, quantity: qty }));
  };

  const handleRemove = (id) => {
    if (updatingItemId || removingItemId) return;
    dispatch(removeCartItem({ itemId: id }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (status === "loading" && items.length === 0) {
    return <div className="p-10 text-center">Loading cart...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-[#7A1C3D]">Your Cart</h1>
          <p className="text-gray-500 mt-2">
            Review your selections before checkout
          </p>
        </div>

        <div className="px-5 py-2 rounded-full bg-[#8B0D3A] text-white text-sm shadow">
          {items.length} items
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h2 className="text-2xl font-semibold text-[#111]">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="mt-6 px-8 py-3 rounded-full bg-[#8B0D3A] text-white"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16 grid lg:grid-cols-3 gap-10">
          {/* LEFT ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, i) => {
              const product = item.product;

              const img =
                product?.images?.find((i) => i.is_primary)?.image_url ||
                product?.images?.[0]?.image_url;

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
                  {/* IMAGE */}
                  <div className="w-28 h-28 rounded-xl overflow-hidden">
                    <img
                      src={getImageUrl(img)}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <h3 className="font-medium text-[#222]">{product?.name}</h3>

                    <p className="text-sm text-gray-500 mt-1">₹{item.price}</p>

                    {/* QTY */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity - 1)
                        }
                        className="p-2 rounded-full border hover:bg-[#8B0D3A] hover:text-white transition"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="min-w-[30px] text-center text-sm">
                        {isUpdating ? "..." : item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity + 1)
                        }
                        className="p-2 rounded-full border hover:bg-[#8B0D3A] hover:text-white transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="flex items-center gap-1 text-xs text-red-500 mt-3 hover:underline"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  {/* PRICE */}
                  <div className="font-semibold text-[#8B0D3A]">
                    ₹{item.price * item.quantity}
                  </div>

                  {/* LOADER */}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm">
                      Updating...
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="sticky top-24 h-fit">
            <div className="bg-white/80 backdrop-blur-xl border border-[#f1d6dd] rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-[#7A1C3D] mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{totals.shipping}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[#8B0D3A]">₹{totals.total}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full py-3 rounded-xl bg-[#8B0D3A] text-white font-medium shadow hover:opacity-90 transition"
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

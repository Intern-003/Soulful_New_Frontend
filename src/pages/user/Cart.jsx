import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totals, status, updatingItemId, removingItemId } = useSelector(
    (state) => state.cart,
  );

  // useEffect(() => {
  //   dispatch(fetchCart());
  // }, [dispatch]);

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

  // ✅ Initial loading only
  if (status === "loading" && items.length === 0) {
    return <div className="p-10 text-center">Loading cart...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/shop")}
            className="bg-[#7a1c3d] text-white px-6 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT - ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;

              const img =
                product?.images?.find((i) => i.is_primary)?.image_url ||
                product?.images?.[0]?.image_url;

              const isUpdating = updatingItemId === item.id;
              const isRemoving = removingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col md:flex-row gap-4 border p-4 rounded-lg relative ${
                    isRemoving ? "opacity-50" : ""
                  }`}
                >
                  {/* IMAGE */}
                  <img
                    src={getImageUrl(img) || "/placeholder.jpg"}
                    alt={product?.name}
                    className="w-full md:w-28 h-28 object-cover rounded"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product?.name}</h3>

                    <p className="text-gray-500 text-sm">₹{item.price}</p>

                    {/* QTY */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        -
                      </button>

                      <span className="min-w-[20px] text-center">
                        {isUpdating ? "..." : item.quantity}
                      </span>

                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isRemoving}
                      className="text-red-500 text-sm mt-3 disabled:opacity-50"
                    >
                      {isRemoving ? "Removing..." : "Remove"}
                    </button>
                  </div>

                  {/* TOTAL */}
                  <div className="text-right font-semibold">
                    ₹{item.price * item.quantity}
                  </div>

                  {/* OVERLAY LOADER */}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <span className="text-sm text-gray-600">Updating...</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="border p-5 rounded-lg h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
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

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{totals.total}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-5 bg-[#7a1c3d] text-white py-2 rounded"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={handleClearCart}
              className="w-full mt-3 border py-2 rounded text-red-500"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

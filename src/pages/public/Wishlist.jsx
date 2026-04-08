import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { removeFromWishlist } from "../../app/slices/wishlistSlice";
import { fetchWishlist } from "../../app/slices/wishlistSlice";
import { fetchRelatedProducts } from "../../app/slices/productSlice";
import { clearRelated } from "../../app/slices/productSlice";
import { addToCart } from "../../app/slices/cartSlice";
import { getImageUrl } from "../../utils/getImageUrl";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((state) => state.wishlist.items || []);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const { status } = useSelector((state) => state.wishlist);

  const handleRemove = async (product_id) => {
    await dispatch(removeFromWishlist({ product_id }));
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  const { related = [], relatedStatus = "idle" } = useSelector(
    (state) => state.products || {},
  );

  const hasFetchedRelated = useRef(false);

  useEffect(() => {
    if (wishlistItems.length > 0 && !hasFetchedRelated.current) {
      const ids = wishlistItems.map((item) => item.product_id);
      dispatch(fetchRelatedProducts(ids));
      hasFetchedRelated.current = true; // 🔥 only once
    }

    if (wishlistItems.length === 0) {
      dispatch(clearRelated());
      hasFetchedRelated.current = false; // reset
    }
  }, [wishlistItems, dispatch]);

  if (status === "loading") {
    return <div className="p-10 text-center">Loading wishlist...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 md:px-8 py-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Wishlist ❤️
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Save your favorite fragrances for later
            </p>
          </div>
          <span className="text-sm text-gray-600">
            {wishlistItems.length} items
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {wishlistItems.length === 0 ? (
          // EMPTY STATE
          <div className="flex flex-col items-center justify-center text-center py-20">
            <Heart size={60} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              Your wishlist is empty 💔
            </h2>
            <p className="text-gray-500 mt-2">
              Start exploring and save your favorite items
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="mt-6 px-6 py-3 bg-#7a1c3d] text-white rounded-lg hover:bg-[#5a142c] transition"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                // const imgUrl =
                //   item.images?.find((i) => i.is_primary)?.image_url ||
                //   item.images?.[0]?.image_url;

                const product = item.product || item;

                const imgUrl =
                  product.images?.find((i) => i.is_primary)?.image_url ||
                  product.images?.[0]?.image_url;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 group overflow-hidden"
                  >
                    {/* IMAGE */}
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(imgUrl) || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
                      />

                      {/* REMOVE BTN */}
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-red-50"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>

                    {/* DETAILS */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-[#7a1c3d] font-bold mt-2">
                        ₹{product.price}
                      </p>

                      {/* ACTIONS */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            handleAddToCart({
                              product_id: product.id,
                              quantity: 1,
                            })
                          }
                          className="flex-1 flex items-center justify-center gap-2 bg-[#7a1c3d] text-white py-2 rounded-lg text-sm hover:bg-[#5a142c] transition"
                        >
                          <ShoppingCart size={16} />
                          Add
                        </button>

                        <button
                          onClick={() => navigate(`/product/${product.slug}`)}
                          className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RECOMMENDATIONS (STATIC PLACEHOLDER FOR NOW) */}
            <div className="mt-16">
              <h2 className="text-xl font-semibold mb-6">
                ✨ You may also like
              </h2>

              {relatedStatus === "loading" ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {related.map((product) => {
                    const imgUrl =
                      product.images?.find((i) => i.is_primary)?.image_url ||
                      product.images?.[0]?.image_url;

                    return (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <img
                          src={getImageUrl(imgUrl) || "/placeholder.jpg"}
                          className="w-full h-40 object-cover rounded"
                        />

                        <h3 className="text-sm font-medium mt-2 line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-[#7a1c3d] font-bold text-sm mt-1">
                          ₹{product.price}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

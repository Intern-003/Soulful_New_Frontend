import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import WishlistSkeleton from "../../components/shop/WishlistSkeleton";

import {
  removeFromWishlist,
  fetchWishlist,
} from "../../app/slices/wishlistSlice";
import {
  fetchRelatedProducts,
  clearRelated,
} from "../../app/slices/productSlice";
import { addToCart } from "../../app/slices/cartSlice";
import { getImageUrl } from "../../utils/getImageUrl";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const { status } = useSelector((state) => state.wishlist);
  const { related = [], relatedStatus = "idle" } = useSelector(
    (state) => state.products || {},
  );

  const hasFetchedRelated = useRef(false);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (wishlistItems.length > 0 && !hasFetchedRelated.current) {
      const ids = wishlistItems.map((item) => item.product_id);
      dispatch(fetchRelatedProducts(ids));
      hasFetchedRelated.current = true;
    }

    if (wishlistItems.length === 0) {
      dispatch(clearRelated());
      hasFetchedRelated.current = false;
    }
  }, [wishlistItems, dispatch]);

  const handleRemove = async (product_id) => {
    await dispatch(removeFromWishlist({ product_id }));
  };

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  if (status === "loading") {
    return <WishlistSkeleton />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff9fb] via-white to-[#fff3f6] overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8B0D3A]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7A1C3D]/10 blur-[120px] rounded-full" />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-[#7A1C3D] tracking-tight">
            Wishlist
          </h1>
          <p className="text-gray-500 mt-2">
            Your curated favorites collection
          </p>
        </div>

        <div className="px-5 py-2 rounded-full bg-[#8B0D3A] text-white text-sm shadow">
          {wishlistItems.length} saved
        </div>
      </div>

      {/* EMPTY STATE */}
      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#8B0D3A]/10 blur-2xl rounded-full"></div>
            <Heart size={60} className="text-[#8B0D3A] relative z-10" />
          </div>

          <h2 className="text-2xl font-semibold text-[#111]">
            Nothing saved yet
          </h2>

          <p className="text-gray-500 mt-2 max-w-sm">
            Explore and save products you love — your wishlist lives here.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-6 px-8 py-3 rounded-full bg-[#8B0D3A] text-white hover:opacity-90 transition"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-16 pb-16">
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {wishlistItems.map((item, i) => {
              const product = item.product || item;

              const imgUrl =
                product.images?.find((i) => i.is_primary)?.image_url ||
                product.images?.[0]?.image_url;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden rounded-3xl">
                    <img
                      src={getImageUrl(imgUrl)}
                      className="w-full h-[300px] object-cover transition duration-700 group-hover:scale-110"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                    {/* ACTIONS */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart({
                            product_id: product.id,
                            quantity: 1,
                          });
                        }}
                        className="bg-white text-[#111] px-4 py-2 rounded-full text-xs shadow hover:bg-[#8B0D3A] hover:text-white transition"
                      >
                        <ShoppingBag size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.product_id);
                        }}
                        className="bg-white text-red-500 px-4 py-2 rounded-full text-xs shadow hover:bg-red-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="mt-4 px-1">
                    <h3 className="text-sm font-medium text-[#222] line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-lg font-semibold mt-1 text-[#8B0D3A]">
                      ₹{product.price}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RECOMMENDATIONS */}
          <div className="mt-24">
            <h2 className="text-2xl font-semibold mb-8 text-[#111]">
              Discover More
            </h2>

            {relatedStatus === "loading" ? (
              <div className="text-gray-400 text-center">Loading...</div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-2">
                {related.map((product) => {
                  const imgUrl =
                    product.images?.find((i) => i.is_primary)?.image_url ||
                    product.images?.[0]?.image_url;

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="min-w-[180px] cursor-pointer group"
                    >
                      <div className="rounded-xl overflow-hidden">
                        <img
                          src={getImageUrl(imgUrl)}
                          className="w-full h-40 object-cover group-hover:scale-105 transition"
                        />
                      </div>

                      <p className="text-sm mt-2 line-clamp-2">
                        {product.name}
                      </p>

                      <p className="text-sm text-[#8B0D3A] font-semibold">
                        ₹{product.price}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="text-center pb-10 text-xs text-gray-400">
        Soulfull — Curated with taste & intention
      </div>
    </div>
  );
};

export default Wishlist;

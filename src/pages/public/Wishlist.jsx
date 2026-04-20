// import React, { useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Heart, ShoppingCart, Trash2 } from "lucide-react";

// import {
//   removeFromWishlist,
//   fetchWishlist,
// } from "../../app/slices/wishlistSlice";
// import {
//   fetchRelatedProducts,
//   clearRelated,
// } from "../../app/slices/productSlice";
// import { addToCart } from "../../app/slices/cartSlice";
// import { getImageUrl } from "../../utils/getImageUrl";

// const Wishlist = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const wishlistItems = useSelector((state) => state.wishlist.items || []);
//   const { status } = useSelector((state) => state.wishlist);

//   const { related = [], relatedStatus = "idle" } = useSelector(
//     (state) => state.products || {},
//   );

//   const hasFetchedRelated = useRef(false);

//   useEffect(() => {
//     dispatch(fetchWishlist());
//   }, [dispatch]);

//   useEffect(() => {
//     if (wishlistItems.length > 0 && !hasFetchedRelated.current) {
//       const ids = wishlistItems.map((item) => item.product_id);
//       dispatch(fetchRelatedProducts(ids));
//       hasFetchedRelated.current = true;
//     }

//     if (wishlistItems.length === 0) {
//       dispatch(clearRelated());
//       hasFetchedRelated.current = false;
//     }
//   }, [wishlistItems, dispatch]);

//   const handleRemove = async (product_id) => {
//     await dispatch(removeFromWishlist({ product_id }));
//   };

//   const handleAddToCart = (item) => {
//     dispatch(addToCart(item));
//   };

//   if (status === "loading") {
//     return <div className="p-10 text-center">Loading wishlist...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#f3f3f3]">
//       {/* HEADER */}
//       <div className="backdrop-blur-md bg-white/80 border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-semibold tracking-tight text-[#111]">
//               My Wishlist
//             </h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Your saved luxury picks ✨
//             </p>
//           </div>

//           <div className="px-4 py-2 rounded-full bg-[#8B0D3A] text-white text-sm shadow-md">
//             {wishlistItems.length} items
//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
//         {wishlistItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-24 text-center">
//             <div className="bg-white shadow-xl rounded-full p-8 mb-6">
//               <Heart size={50} className="text-[#8B0D3A]" />
//             </div>

//             <h2 className="text-2xl font-semibold text-[#111]">
//               Your wishlist feels empty
//             </h2>

//             <p className="text-gray-500 mt-2 max-w-sm">
//               Discover premium fragrances and save your favorites here
//             </p>

//             <button
//               onClick={() => navigate("/shop")}
//               className="mt-6 px-8 py-3 rounded-full bg-[#8B0D3A] text-white text-sm hover:bg-[#6F0A2E] transition"
//             >
//               Explore Products
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* GRID */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//               {wishlistItems.map((item) => {
//                 const product = item.product || item;

//                 const imgUrl =
//                   product.images?.find((i) => i.is_primary)?.image_url ||
//                   product.images?.[0]?.image_url;

//                 return (
//                   <div
//                     key={item.id}
//                     className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
//                     onClick={() => navigate(`/product/${product.slug}`)}
//                   >
//                     {/* IMAGE */}
//                     <div className="relative overflow-hidden">
//                       <img
//                         src={getImageUrl(imgUrl) || "/placeholder.jpg"}
//                         alt={product.name}
//                         className="w-full h-64 object-cover transition duration-500 group-hover:scale-110"
//                       />

//                       {/* REMOVE BTN */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemove(item.product_id);
//                         }}
//                         className="absolute top-3 right-3 backdrop-blur-md bg-white/90 p-2 rounded-full shadow hover:bg-red-100 transition"
//                       >
//                         <Trash2 size={16} className="text-red-500" />
//                       </button>
//                     </div>

//                     {/* DETAILS */}
//                     <div className="p-5">
//                       <h3 className="text-sm font-medium text-[#222] line-clamp-2">
//                         {product.name}
//                       </h3>

//                       <p className="text-lg font-semibold mt-2 text-[#111]">
//                         ₹{product.price}
//                       </p>

//                       {/* ACTIONS */}
//                       <div className="flex gap-2 mt-5">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleAddToCart({
//                               product_id: product.id,
//                               quantity: 1,
//                             });
//                           }}
//                           className="flex-1 bg-[#8B0D3A] text-white py-2 rounded-full text-sm hover:bg-[#6F0A2E] transition"
//                         >
//                           Add to Cart
//                         </button>

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/product/${product.slug}`);
//                           }}
//                           className="px-4 py-2 border border-[#8B0D3A] text-[#8B0D3A] rounded-full text-sm hover:bg-[#8B0D3A] hover:text-white transition"
//                         >
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* RECOMMENDATIONS */}
//             <div className="mt-20">
//               <h2 className="text-2xl font-semibold mb-8 text-[#111]">
//                 You may also like
//               </h2>

//               {relatedStatus === "loading" ? (
//                 <div className="text-center text-gray-500">Loading...</div>
//               ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                   {related.map((product) => {
//                     const imgUrl =
//                       product.images?.find((i) => i.is_primary)?.image_url ||
//                       product.images?.[0]?.image_url;

//                     return (
//                       <div
//                         key={product.id}
//                         onClick={() => navigate(`/product/${product.slug}`)}
//                         className="group cursor-pointer bg-white rounded-xl overflow-hidden hover:shadow-lg transition"
//                       >
//                         <img
//                           src={getImageUrl(imgUrl)}
//                           className="w-full h-44 object-cover group-hover:scale-105 transition"
//                         />

//                         <div className="p-3">
//                           <h3 className="text-sm line-clamp-2 text-[#222]">
//                             {product.name}
//                           </h3>

//                           <p className="text-sm font-semibold mt-1 text-[#8B0D3A]">
//                             ₹{product.price}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

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
    return <div className="p-10 text-center">Loading wishlist...</div>;
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
            Your curated favorites collection ✨
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

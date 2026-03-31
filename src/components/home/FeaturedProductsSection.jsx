// import React, { useState } from "react";
// import useGet from "../../api/hooks/useGet";
// import usePost from "../../api/hooks/usePost";
// import { getImageUrl } from "../../utils/getImageUrl";
// import { useNavigate } from "react-router-dom";

// const FeaturedProductsSection = () => {
//   const navigate = useNavigate();

//   const { data, loading } = useGet("/products/featured");
//   const products = (data?.data || []).slice(0, 8);

//   // ✅ SAME HOOK (NO RENAMING)
//   const { postData, loading: actionLoading } = usePost("");

//   const [activeId, setActiveId] = useState(null);

//   // 🛒 ADD TO CART
//   const handleAddToCart = async (product) => {
//     try {
//       setActiveId(product.id);

//       await postData(
//         {
//           product_id: product.id,
//           quantity: 1,
//         },
//         {
//           url: "/cart/add",
//         }
//       );

//       alert("Added to cart ✅");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActiveId(null);
//     }
//   };

//   // ❤️ ADD TO WISHLIST
//   const handleWishlist = async (product) => {
//     try {
//       setActiveId(product.id);

//       await postData(
//         {
//           product_id: product.id,
//         },
//         {
//           url: "/wishlist",
//         }
//       );

//       alert("Added to wishlist ❤️");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setActiveId(null);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-16">

//       {/* HEADER */}
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-bold text-[#7a1c3d]">
//           Featured Products
//         </h2>
//         <p className="text-gray-500 mt-2">
//           Handpicked products just for you
//         </p>
//       </div>

//       {/* GRID */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

//         {/* ✅ CLEAN LOADING (NO NULL CRASH) */}
//         {loading &&
//           Array(8)
//             .fill(0)
//             .map((_, i) => (
//               <div
//                 key={i}
//                 className="h-[300px] bg-gray-200 animate-pulse rounded-xl"
//               />
//             ))}

//         {/* ✅ REAL DATA */}
//         {!loading &&
//           products.map((item) => {
//             const image =
//               item?.images?.find((img) => img.is_primary)?.image_url ||
//               item?.images?.[0]?.image_url;

//             const discount =
//               item?.discount_price &&
//               Math.round(
//                 ((item.price - item.discount_price) / item.price) * 100
//               );

//             return (
//               <div key={item.id} className="group">

//                 <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">

//                   {/* IMAGE */}
//                   <div className="relative h-[260px] bg-gray-100 flex items-center justify-center overflow-hidden">

//                     <img
//                       src={getImageUrl(image)}
//                       alt={item.name}
//                       className="h-full object-contain transition duration-500 group-hover:scale-110"
//                     />

//                     {/* DISCOUNT */}
//                     {discount && (
//                       <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">
//                         -{discount}%
//                       </span>
//                     )}

//                     {/* ACTIONS */}
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">

//                       {/* CART */}
//                       <button
//                         onClick={() => handleAddToCart(item)}
//                         className="bg-white px-3 py-2 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
//                       >
//                         {activeId === item.id && actionLoading
//                           ? "..."
//                           : "🛒"}
//                       </button>

//                       {/* WISHLIST */}
//                       <button
//                         onClick={() => handleWishlist(item)}
//                         className="bg-white px-3 py-2 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
//                       >
//                         {activeId === item.id && actionLoading
//                           ? "..."
//                           : "❤️"}
//                       </button>

//                       {/* VIEW */}
//                       <button
//                         onClick={() =>
//                           navigate(`/product/${item.slug}`)
//                         }
//                         className="bg-white px-3 py-2 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
//                       >
//                         👁
//                       </button>

//                     </div>
//                   </div>

//                   {/* DETAILS */}
//                   <div className="p-4 text-center">
//                     <h3 className="text-sm font-semibold line-clamp-1">
//                       {item.name}
//                     </h3>

//                     <div className="mt-1">
//                       <span className="text-[#7a1c3d] font-bold">
//                         ₹{item.discount_price || item.price}
//                       </span>

//                       {item.discount_price && (
//                         <span className="text-gray-400 line-through ml-2 text-sm">
//                           ₹{item.price}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       {/* VIEW ALL */}
//       <div className="text-center mt-10">
//         <button
//           onClick={() => navigate("/products")}
//           className="bg-[#7a1c3d] text-white px-6 py-2 rounded-full hover:bg-[#5a142c] transition"
//         >
//           View All →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FeaturedProductsSection;

// src/components/home/FeaturedProductsSection.jsx
// src/components/home/FeaturedProductsSection.jsx
// src/components/home/FeaturedProductsSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGet from '../../api/hooks/useGet';
import SectionHeader from '../common/SectionHeader';
import ProductGrid from '../common/ProductGrid';

const FeaturedProductsSection = () => {
  const navigate = useNavigate();
  const { data, loading } = useGet('/products/featured');
  
  // ✅ Access data correctly
  const products = (data?.data || []).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeader 
        title="Featured Products"
        subtitle="Handpicked products just for you"
      />
      
      <ProductGrid products={products} loading={loading} columns={4} />

      <div className="text-center mt-10">
        <button
          onClick={() => navigate('/products')}
          className="bg-[#7a1c3d] text-white px-6 py-2 rounded-full hover:bg-[#5a142c] transition"
        >
          View All →
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductsSection;
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import useGet from "../../api/hooks/useGet";
// import { getImageUrl } from "../../utils/getImageUrl";

// const CategoryCards = () => {
//   const navigate = useNavigate();
//   const { data, loading, error } = useGet("/categories");

//   const categories =
//     data?.data
//       ?.filter((cat) => cat.parent_id === null)
//       ?.sort((a, b) => a.position - b.position)
//       ?.slice(0, 4) || [];

//   // ✅ LOADING
//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {[...Array(4)].map((_, i) => (
//             <div
//               key={i}
//               className="h-[240px] rounded-2xl bg-gray-200 animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ✅ ERROR
//   if (error) {
//     return (
//       <div className="text-center py-10 text-red-500">
//         Failed to load categories
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

//         {categories.map((cat, index) => (
//           <div
//             key={cat.id}
//             onClick={() => navigate(`/category/${cat.slug}`)}
//             className={`group relative flex flex-col justify-between
//             rounded-2xl p-5 sm:p-6 h-[240px] sm:h-[260px]
//             overflow-hidden cursor-pointer
//             transition-all duration-300 ease-in-out
//             hover:shadow-xl hover:-translate-y-2
//             ${bgColors[index % bgColors.length]}`}
//           >

//             {/* TEXT CONTENT */}
//             <div className="z-10">

//               <p className="text-xs text-gray-500 mb-1 capitalize">
//                 {cat.slug.replace("-", " ")}
//               </p>

//               <h3 className="text-lg sm:text-xl font-semibold text-[#2b1b12] mb-2 leading-snug">
//                 {cat.name}
//               </h3>

//               <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">
//                 {cat.description}
//               </p>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/category/${cat.slug}`);
//                 }}
//                 className="text-sm font-medium border-b border-[#7a1c3d] text-[#7a1c3d]
//                 hover:opacity-70 transition"
//               >
//                 Shop Now
//               </button>
//             </div>

//             {/* IMAGE */}
//             <div className="absolute bottom-0 right-0 w-full flex justify-end pr-2 pointer-events-none">
//               <img
//                 src={getImageUrl(cat.image)}
//                 alt={cat.name}
//                 onError={(e) => (e.target.src = "/fallback.png")}
//                 className="w-[90px] sm:w-[110px] md:w-[130px] object-contain
//                 transition-transform duration-500 ease-out
//                 group-hover:scale-110 group-hover:-translate-y-1"
//               />
//             </div>

//             {/* HOVER OVERLAY EFFECT */}
//             <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition duration-300 rounded-2xl" />

//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// export default CategoryCards;

// // 🎨 COLORS
// const bgColors = [
//   "bg-[#f3ede9]",
//   "bg-[#eef2ef]",
//   "bg-[#f5efe7]",
//   "bg-[#eef1f4]",
// ];

// src/components/common/CategoryCards.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../app/slices/categorySlice";
import { selectParentCategories } from "../../app/selectors/categorySelectors";
import CategoryCard from "../common/CategoryCard";

const CategoryCards = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectParentCategories);
  const loading = useSelector((state) => state.categories.loading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.slice(0, 4).map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
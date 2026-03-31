// import React, { useEffect, useState } from "react";
// import useGet from "../../api/hooks/useGet";
// import { getImageUrl } from "../../utils/getImageUrl";
// import { useNavigate } from "react-router-dom";

// const CategoryBannerSection = () => {
//   const navigate = useNavigate();

//   const { data, loading } = useGet("/categories");

//   const parentCategories =
//     data?.data?.filter((cat) => cat.parent_id === null) || [];

//   const [activeParent, setActiveParent] = useState(null);

//   const {
//     data: childData,
//     refetch: fetchChildren,
//     loading: childLoading,
//   } = useGet("", { autoFetch: false });

//   const children = childData?.data || [];

//   // default tab
//   useEffect(() => {
//     if (parentCategories.length && !activeParent) {
//       setActiveParent(parentCategories[0]);
//     }
//   }, [parentCategories]);

//   // fetch children
//   useEffect(() => {
//     if (activeParent) {
//       fetchChildren({
//         url: `/categories/${activeParent.id}/children`,
//       });
//     }
//   }, [activeParent]);

//   // skeleton
//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-6 py-16">
//         <div className="flex justify-center gap-6 mb-10">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="h-[300px] bg-gray-200 animate-pulse rounded-xl" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-20">

//       {/* TABS */}
//       <div className="flex justify-center gap-10 mb-12 border-b pb-4 flex-wrap">
//         {parentCategories.map((cat) => (
//           <button
//             key={cat.id}
//             onClick={() => setActiveParent(cat)}
//             className={`uppercase text-sm font-semibold tracking-wide pb-2 transition
//               ${
//                 activeParent?.id === cat.id
//                   ? "text-[#7a1c3d] border-b-2 border-[#7a1c3d]"
//                   : "text-gray-500 hover:text-[#7a1c3d]"
//               }`}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

//         {(childLoading ? [1,2,3] : children.slice(0,3)).map((item, i) => (
//           <div
//             key={item?.id || i}
//             onClick={() => item && navigate(`/category/${item.slug}`)}
//             className="relative rounded-xl overflow-hidden group cursor-pointer h-[280px] md:h-[320px]"
//           >

//             {/* IMAGE */}
//             {childLoading ? (
//               <div className="w-full h-full bg-gray-200 animate-pulse" />
//             ) : (
//               <img
//                 src={getImageUrl(item.image) || "/placeholder.png"}
//                 alt={item.name}
//                 className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
//               />
//             )}

//             {/* OVERLAY */}
//             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition" />

//             {/* BUTTON */}
//             {!childLoading && (
//               <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
//                 <button className="bg-white text-[#7a1c3d] px-6 py-2 rounded-full text-sm font-semibold shadow-md group-hover:bg-[#7a1c3d] group-hover:text-white transition">
//                   {item.name.toUpperCase()} →
//                 </button>
//               </div>
//             )}

//           </div>
//         ))}

//       </div>
//     </div>
//   );
// };

// export default CategoryBannerSection;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchChildrenByParent,
} from "../../app/slices/categorySlice";
import {
  selectParentCategories,
  selectChildrenByParent,
} from "../../app/selectors/categorySelectors";
import CategoryCard from "../common/CategoryCard";

const CategoryBannerSection = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.categories.loading);
  const parentCategories = useSelector(selectParentCategories);

  const [activeParent, setActiveParent] = useState(null);

  // Memoized children for current active parent
  const children = useSelector((state) =>
    selectChildrenByParent(state, activeParent?.id)
  );

  // Fetch all parent categories once
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Set default active parent when parents are loaded
  useEffect(() => {
    if (parentCategories.length > 0 && !activeParent) {
      setActiveParent(parentCategories[0]);
    }
  }, [parentCategories, activeParent]);

  // Fetch children when active parent changes
  useEffect(() => {
    if (activeParent?.id) {
      dispatch(fetchChildrenByParent(activeParent.id));
    }
  }, [dispatch, activeParent]);

  if (loading && parentCategories.length === 0) {
    return <div className="p-10 text-center">Loading categories...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* TABS */}
      <div className="flex justify-center gap-10 mb-12 border-b pb-4 flex-wrap">
        {parentCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveParent(cat)}
            className={`pb-2 text-lg font-medium transition-colors ${
              activeParent?.id === cat.id
                ? "text-[#7a1c3d] border-b-2 border-[#7a1c3d]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* CHILDREN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.length > 0 ? (
          children.slice(0, 3).map((item) => (
            <CategoryCard
              key={item.id}
              category={item}
              variant="banner"
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 py-10">
            No subcategories found
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryBannerSection;
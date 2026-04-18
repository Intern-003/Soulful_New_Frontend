// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { selectParentCategories } from "../../app/selectors/categorySelectors";
// import CategoryCard from "../common/CategoryCard";
// import CategoryCardSkeleton from "../common/CategoryCardSkeleton";
// import { getImageUrl } from "../../utils/getImageUrl";

// const CategoryCards = () => {
//   const categories = useSelector(selectParentCategories);
//   const loading = useSelector((state) => state.categories.loading);

//   // Preload images (performance boost)
//   useEffect(() => {
//     if (!categories?.length) return;

//     categories.slice(0, 6).forEach((cat) => {
//       if (cat?.image) {
//         const img = new Image();
//         img.src = getImageUrl(cat.image);
//       }
//     });
//   }, [categories]);

//   // Skeleton loader
//   if (loading && categories.length === 0) {
//     return (
//       <section className="max-w-7xl mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <CategoryCardSkeleton key={i} />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="max-w-7xl mx-auto px-6 pt-25 pb-5">
//       {/* Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {categories?.slice(0, 4).map((cat, index) => (
//           <CategoryCard key={cat.id} category={cat} index={index} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default CategoryCards;

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectParentCategories } from "../../app/selectors/categorySelectors";
import CategoryCard from "../common/CategoryCard";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryCards = () => {
  const categories = useSelector(selectParentCategories);
  const loading = useSelector((state) => state.categories.loading);

  // Preload images
  useEffect(() => {
    if (!categories?.length) return;

    categories.slice(0, 6).forEach((cat) => {
      if (cat?.image) {
        const img = new Image();
        img.src = getImageUrl(cat.image);
      }
    });
  }, [categories]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading && categories.length === 0
          ? renderCategorySkeleton(4)
          : categories
              ?.slice(0, 4)
              .map((cat, index) => (
                <CategoryCard key={cat.id} category={cat} index={index} />
              ))}
      </div>
    </section>
  );
};

export default CategoryCards;

const renderCategorySkeleton = (count = 4) => {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-7 bg-[#8B0D3A]/20 min-h-[340px] md:min-h-[380px]"
    >
      {/* 🔥 SHIMMER (INLINE, NO CSS FILE) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          animation: "shimmerMove 2s infinite",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-[75%] space-y-4">
        {/* LABEL */}
        <div className="h-3 w-20 rounded bg-white/40 relative overflow-hidden">
          <div className="absolute inset-0 animate-[shimmerMove_1.2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </div>

        {/* TITLE */}
        <div className="space-y-2">
          <div className="h-6 w-[80%] rounded bg-white/40 relative overflow-hidden">
            <div className="absolute inset-0 animate-[shimmerMove_1.2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <div className="h-6 w-[60%] rounded bg-white/40 relative overflow-hidden">
            <div className="absolute inset-0 animate-[shimmerMove_1.2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <div className="h-3 w-[90%] rounded bg-white/40 relative overflow-hidden">
            <div className="absolute inset-0 animate-[shimmerMove_1.2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <div className="h-3 w-[80%] rounded bg-white/40 relative overflow-hidden">
            <div className="absolute inset-0 animate-[shimmerMove_1.2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <div className="h-3 w-[60%] rounded bg-white/40 relative overflow-hidden">
            <div className="absolute inset-0 animate-[shimmerMove_1.2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <div className="h-4 w-24 rounded bg-white/40 relative overflow-hidden">
            <div className="absolute inset-0 animate-[shimmerMove_1.2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  ));
};

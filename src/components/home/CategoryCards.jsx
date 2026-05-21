import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectParentCategories } from "../../app/selectors/categorySelectors";
import CategoryCard from "../common/CategoryCard";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryCards = () => {
  const categories = useSelector(selectParentCategories);
  const loading = useSelector((state) => state.categories.loading);

  // Preload images for better performance
  useEffect(() => {
    if (!categories?.length) return;

    categories.slice(0, 3).forEach((cat) => {
      if (cat?.image) {
        const img = new Image();
        img.src = getImageUrl(cat.image);
      }
    });
  }, [categories]);

  return (
    <section className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Smaller on mobile */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm max-w-2xl mx-auto px-2 sm:px-4">
            Explore our curated collections
          </p>
          <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-[#8B0D3A] to-[#d43f7a] mx-auto mt-2 sm:mt-3 rounded-full" />
        </div>

        {/* ALWAYS 3 COLUMNS - Fixed height cards */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
          {loading && categories.length === 0
            ? renderCategorySkeleton(3)
            : categories
                ?.slice(0, 3)
                .map((cat, index) => (
                  <CategoryCard key={cat.id} category={cat} index={index} />
                ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;

const renderCategorySkeleton = (count = 3) => {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-200 to-gray-100"
      style={{ height: "clamp(180px, 25vw, 380px)" }}
    >
      {/* Image Skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-gray-300 to-gray-200 animate-pulse" />
      </div>
      
      {/* Content Skeleton */}
      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:p-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 space-y-1.5 sm:space-y-2">
          <div className="h-3 sm:h-4 md:h-5 bg-gray-300 rounded-lg w-3/4 animate-pulse" />
          <div className="h-1.5 sm:h-2 bg-gray-300 rounded w-full animate-pulse hidden sm:block" />
          <div className="flex items-center">
            <div className="h-2 sm:h-2.5 md:h-3 bg-gray-300 rounded w-14 sm:w-16 animate-pulse" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 ml-1 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
  );
};
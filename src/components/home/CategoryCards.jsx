import React from "react";
import { useSelector } from "react-redux";
import { selectParentCategories } from "../../app/selectors/categorySelectors";
import CategoryCard from "../common/CategoryCard";
import CategoryCardSkeleton from "../common/CategoryCardSkeleton";
import { useEffect } from "react";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryCards = () => {
  const categories = useSelector(selectParentCategories);
  const loading = useSelector((state) => state.categories.loading);


  useEffect(() => {
    if (!categories?.length) return;

    categories.slice(0, 6).forEach((cat) => {
      if (cat.image) {
        const img = new Image();
        img.src = getImageUrl(cat.image);
      }
    });
  }, [categories?.length]);


  if (loading && categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.slice(0, 4).map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
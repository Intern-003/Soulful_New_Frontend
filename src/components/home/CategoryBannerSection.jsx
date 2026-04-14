import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildrenByParent } from "../../app/slices/categorySlice";
import {
  selectParentCategories,
  selectChildrenByParent,
} from "../../app/selectors/categorySelectors";
import CategoryCard from "../common/CategoryBannerCard";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryBannerSection = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.categories.loading);
  const parentCategories = useSelector(selectParentCategories);

  const [activeParent, setActiveParent] = useState(null);
  const parentId = activeParent?.id;

  const children = useSelector((state) =>
    selectChildrenByParent(state, parentId),
  );

  const childrenCache = useSelector((state) => state.categories.children);

  useEffect(() => {
    if (!children?.length) return;

    children.slice(0, 3).forEach((cat) => {
      if (cat.image) {
        const img = new Image();
        img.src = getImageUrl(cat.image);
      }
    });
  }, [children?.length]);

  useEffect(() => {
    if (!activeParent?.id) return;

    if (!childrenCache[activeParent.id]) {
      dispatch(fetchChildrenByParent(activeParent.id));
    }
  }, [dispatch, activeParent?.id, childrenCache[activeParent?.id]]);

  useEffect(() => {
    if (parentCategories.length > 0 && !activeParent?.id) {
      setActiveParent(parentCategories[0]);
    }
  }, [parentCategories]);

  if (loading && parentCategories.length === 0) {
    return <div className="p-10 text-center">Loading categories...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* TABS */}
      <div className="flex justify-center gap-12 mb-14 border-b border-gray-200 pb-3">
        {parentCategories.slice(0, 3).map((cat) => {
          const isActive = activeParent?.id === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveParent(cat)}
              className={`
                relative text-xs md:text-sm uppercase tracking-[0.1em]
                transition-all duration-300 pb-3

                ${isActive ? "text-[#7a1c3d]" : "text-gray-400 hover:text-gray-700"}
              `}
            >
              {cat.name}

              <span
                className={`
                  absolute left-0 bottom-0 h-[1px] w-full
                  bg-[#7a1c3d]
                  transition-all duration-300

                  ${
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:scale-x-100"
                  }
                `}
              />
            </button>
          );
        })}
      </div>

      {/* CHILDREN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.length > 0 ? (
          children
            .slice(0, 3)
            .map((item) => (
              <CategoryCard key={item.id} category={item} variant="banner" />
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

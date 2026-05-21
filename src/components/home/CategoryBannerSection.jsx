// FILE: src/components/home/CategoryBannerSection.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight } from "lucide-react"; // ADD THIS IMPORT
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

  // Preload images for better performance
  useEffect(() => {
    if (!children?.length) return;

    const itemsToShow = window.innerWidth < 640 ? 4 : 3;
    children.slice(0, itemsToShow).forEach((cat) => {
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

  // Get responsive number of items to show
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 4 : 3;
    }
    return 3; // Default for SSR
  };

  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    setItemsToShow(getItemsToShow());
    
    const handleResize = () => {
      setItemsToShow(getItemsToShow());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayChildren = children.slice(0, itemsToShow);

  if (loading && parentCategories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 py-12 xs:py-16 sm:py-20">
        {/* TABS SKELETON */}
        <div className="flex justify-center gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 xs:mb-10 sm:mb-12 md:mb-14 border-b border-gray-200 pb-2 xs:pb-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 xs:w-20 sm:w-24 md:w-28 h-7 xs:h-8 sm:h-9 md:h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        
        {/* GRID SKELETON - Responsive 2x2 on mobile, 1x3 on tablet, 3x1 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hidden sm:block first:block sm:first:block h-[200px] xs:h-[220px] sm:h-[240px] md:h-[280px] lg:h-[320px] bg-gray-200 rounded-lg xs:rounded-xl animate-pulse" />
          ))}
          {[1, 2, 3, 4].slice(0, 4).map((i) => (
            <div key={i} className="block sm:hidden h-[200px] xs:h-[220px] bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8 py-12 xs:py-16 sm:py-20">
        {/* SECTION HEADER - Optional but recommended */}
        <div className="text-center mb-8 xs:mb-10 sm:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-gray-800">
            Shop by <span className="font-semibold text-[#7a1c3d]">Category</span>
          </h2>
          <div className="w-12 xs:w-16 h-0.5 bg-[#7a1c3d] mx-auto mt-2 xs:mt-3"></div>
        </div>

        {/* TABS - FULLY RESPONSIVE WITH SCROLL ON MOBILE IF NEEDED */}
        <div className="flex justify-center items-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8 xs:mb-10 sm:mb-12 md:mb-14 border-b border-gray-200 pb-2 xs:pb-3 overflow-x-auto scrollbar-hide">
          {parentCategories.slice(0, 3).map((cat) => {
            const isActive = activeParent?.id === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveParent(cat)}
                className={`
                  relative text-[11px] xs:text-xs sm:text-sm md:text-base
                  uppercase tracking-[0.08em] xs:tracking-[0.1em]
                  font-medium
                  transition-all duration-300 pb-2 xs:pb-3
                  whitespace-nowrap
                  px-1 xs:px-2

                  ${isActive ? "text-[#7a1c3d]" : "text-gray-400 hover:text-gray-600"}
                `}
              >
                {cat.name.length > 12 ? cat.name.substring(0, 10) + '...' : cat.name}

                <span
                  className={`
                    absolute left-0 bottom-0 h-[1.5px] xs:h-[2px] w-full
                    bg-[#7a1c3d]
                    transition-all duration-300

                    ${
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                    }
                  `}
                />
              </button>
            );
          })}
        </div>

        {/* CHILDREN CARDS - RESPONSIVE GRID (2x2 on mobile, 1x3 on tablet/desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {displayChildren.length > 0 ? (
            displayChildren.map((item, index) => (
              <div 
                key={item.id} 
                className={`
                  transform transition-all duration-300
                  hover:scale-[1.02] sm:hover:scale-[1.03]
                  ${index === 3 ? 'block sm:hidden' : ''}
                `}
              >
                <CategoryCard category={item} variant="banner" />
              </div>
            ))
          ) : (
            <div className="col-span-2 sm:col-span-3 text-center py-10 xs:py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-12 h-12 xs:w-16 xs:h-16 bg-gray-100 rounded-full mb-3 xs:mb-4">
                <svg className="w-6 h-6 xs:w-8 xs:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm xs:text-base">No subcategories available</p>
            </div>
          )}
        </div>

        {/* VIEW ALL BUTTON - Optional but adds better UX */}
        {children.length > itemsToShow && (
          <div className="text-center mt-8 xs:mt-10 sm:mt-12">
            <button
              onClick={() => {
                if (activeParent?.slug) {
                  // Navigate to parent category page
                  window.location.href = `/category/${activeParent.slug}`;
                }
              }}
              className="inline-flex items-center gap-2 px-5 xs:px-6 py-2 xs:py-2.5 rounded-full border border-[#7a1c3d] text-[#7a1c3d] text-xs xs:text-sm font-medium hover:bg-[#7a1c3d] hover:text-white transition-all duration-300 group"
            >
              View All {activeParent?.name} Categories
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryBannerSection;
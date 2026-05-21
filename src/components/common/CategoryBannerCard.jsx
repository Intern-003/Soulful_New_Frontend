// FILE: src/components/common/CategoryBannerCard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryBannerCard = ({ category }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    if (category?.slug) {
      navigate(`/category/${category.slug}`);
    }
  };

  const imageUrl = category?.image
    ? getImageUrl(category.image)
    : "/placeholder.jpg";

  // Get category name with better truncation logic
  const getDisplayName = () => {
    const name = category?.name || "Category";
    
    if (isMobile) {
      // On mobile: show max 12 characters
      return name.length > 12 ? name.substring(0, 10) + '...' : name;
    } else if (window.innerWidth < 768) {
      // On tablet: show max 15 characters
      return name.length > 15 ? name.substring(0, 13) + '...' : name;
    } else {
      // On desktop: show full name or max 20 characters
      return name.length > 20 ? name.substring(0, 18) + '...' : name;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative overflow-hidden
        rounded-lg xs:rounded-xl
        cursor-pointer group
        w-full
        bg-gray-100

        h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px]
        
        shadow-sm hover:shadow-md
        transition-all duration-300
      `}
    >
      {/* IMAGE LOADING PLACEHOLDER */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
      )}

      {/* MAIN IMAGE */}
      <img
        src={imageUrl}
        alt={category?.name || "Category"}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.jpg";
          setImageLoaded(true);
        }}
        className={`
          w-full h-full object-cover
          transition-all duration-500 md:duration-700 ease-out
          group-hover:scale-105
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* DARK OVERLAY ON HOVER */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-400 md:duration-500" />

      {/* CATEGORY BUTTON/LABEL - IMPROVED TEXT HANDLING */}
      <div className="absolute left-1/2 bottom-2 xs:bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 -translate-x-1/2 w-[90%] xs:w-auto">
        <div
          className={`
            inline-flex items-center justify-center gap-1.5 xs:gap-2
            w-full xs:w-auto
            px-2.5 xs:px-3.5 sm:px-4 md:px-5 lg:px-6
            py-1.5 xs:py-2 sm:py-2 md:py-2.5
            rounded-full
            text-[10px] xs:text-[11px] sm:text-xs md:text-sm
            tracking-[0.05em] xs:tracking-[0.08em] sm:tracking-[0.1em]
            uppercase
            font-semibold xs:font-medium
            text-center
            whitespace-nowrap

            bg-white/95 backdrop-blur-sm
            text-[#7a1c3d]

            shadow-[0_2px_8px_rgba(0,0,0,0.1)]
            
            transition-all duration-300 ease-out

            group-hover:bg-[#7a1c3d]
            group-hover:text-white
            group-hover:shadow-[0_4px_12px_rgba(122,28,61,0.3)]
            group-hover:-translate-y-0.5
            group-hover:scale-105

            active:scale-95
            touch-manipulation
          `}
        >
          <span className="truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[140px] md:max-w-[160px]">
            {getDisplayName()}
          </span>
          <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm group-hover:translate-x-0.5 transition-transform duration-300">
            {isMobile ? '→' : '→'}
          </span>
        </div>
      </div>

      {/* DECORATIVE ELEMENT */}
      <div className="absolute top-0 right-0 w-16 h-16 xs:w-20 xs:h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default React.memo(CategoryBannerCard);
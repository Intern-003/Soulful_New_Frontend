import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const bgGradients = [
  "from-[#1a0a2e] to-[#2d1b4e]",
  "from-[#0f2027] to-[#203a43]",
  "from-[#2c1a1a] to-[#4a2c2c]",
  "from-[#1a2a3a] to-[#2a3a4a]",
  "from-[#2a1a3a] to-[#3a2a4a]",
  "from-[#1a3a2a] to-[#2a4a3a]",
];

const CategoryCard = ({ category, index = 0 }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (category?.slug) {
      navigate(`/category/${category.slug}`);
    }
  };

  const imageUrl = category?.image && !imageError
    ? getImageUrl(category.image)
    : "https://placehold.co/600x400/2d1b4e/ffffff?text=Premium";

  const gradientClass = bgGradients[index % bgGradients.length];

  return (
    <div
      onClick={handleClick}
      className={`
        group relative overflow-hidden
        rounded-xl sm:rounded-2xl md:rounded-3xl
        cursor-pointer
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-black/20
        active:scale-[0.98]
        w-full
      `}
      style={{ 
        height: "clamp(180px, 25vw, 380px)",
        background: `linear-gradient(135deg, ${gradientClass.split(' ')[1]?.replace('from-', '') || '#1a0a2e'}, ${gradientClass.split(' ')[2]?.replace('to-', '') || '#2d1b4e'})`
      }}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90`} />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Image Section - Centered nicely */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5 md:p-6">
        <div className={`
          relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48
          transition-all duration-500 ease-out
          ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}>
          {/* Image Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <img
            src={imageUrl}
            alt={category?.name || "Category"}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className={`
              w-full h-full
              object-contain
              transition-all duration-400 ease-out
              drop-shadow-lg
              group-hover:scale-110 
              group-hover:drop-shadow-xl
            `}
            style={{
              filter: 'drop-shadow(0 8px 6px rgba(0,0,0,0.15))',
            }}
          />
        </div>
      </div>

      {/* Content Overlay - Bottom aligned */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        {/* Gradient fade from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl" />
        
        <div className="relative p-2.5 sm:p-3 md:p-4 lg:p-5">
          {/* Category Name */}
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 leading-tight line-clamp-1">
            {category?.name}
          </h3>
          
          {/* Description - Hidden on very small screens, shown on tablet+ */}
          <p className="hidden sm:block text-white/70 text-[10px] sm:text-xs md:text-sm leading-relaxed mb-1.5 sm:mb-2 line-clamp-1">
            {category?.description ||
              "Discover premium collection"}
          </p>
          
          {/* CTA */}
          <div className="inline-flex items-center group/btn">
            <span className="text-white/90 text-[9px] sm:text-xs md:text-sm font-medium tracking-wide">
              Shop Now
            </span>
            <svg 
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 ml-0.5 sm:ml-1 text-white/90 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/0 group-hover:border-white/15 transition-all duration-300 pointer-events-none" />
      
      {/* Subtle Shine on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </div>
    </div>
  );
};

export default React.memo(CategoryCard, (prev, next) => {
  return (
    prev.category.id === next.category.id &&
    prev.category.image === next.category.image &&
    prev.category.name === next.category.name &&
    prev.category.description === next.category.description
  );
});
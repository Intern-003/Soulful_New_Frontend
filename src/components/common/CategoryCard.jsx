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
        w-full h-full
      `}
      style={{ 
        minHeight: "clamp(240px, 35vw, 420px)",
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

      {/* Image Section - Responsive sizing */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6">
        <div className={`
          relative w-full max-w-[75%] sm:max-w-[80%] md:max-w-[85%] lg:max-w-[90%]
          transition-all duration-500 ease-out
          ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          {/* Image Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
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
              w-full h-auto
              object-contain
              transition-all duration-400 ease-out
              drop-shadow-lg
              ${imageLoaded ? 'scale-100' : 'scale-90'}
              group-hover:scale-105 
              group-hover:drop-shadow-xl
            `}
            style={{
              filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.15))',
            }}
          />
        </div>
      </div>

      {/* Content Overlay - Bottom aligned */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        {/* Gradient fade from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-36 md:h-40 lg:h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-xl sm:rounded-b-2xl md:rounded-b-3xl" />
        
        <div className="relative p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Category Name - Clean and prominent */}
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-1.5 md:mb-2 leading-tight line-clamp-2">
            {category?.name}
          </h3>
          
          {/* Description - Subtle */}
          <p className="text-white/70 text-[10px] sm:text-xs md:text-sm leading-relaxed mb-2 sm:mb-2.5 md:mb-3 line-clamp-2">
            {category?.description ||
              "Discover premium collection"}
          </p>
          
          {/* CTA - Clean arrow */}
          <div className="inline-flex items-center group/btn">
            <span className="text-white/90 text-[10px] sm:text-xs md:text-sm font-medium tracking-wide">
              Shop Now
            </span>
            <svg 
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 ml-1 text-white/90 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
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
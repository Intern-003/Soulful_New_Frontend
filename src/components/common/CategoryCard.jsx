import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const bgVariants = [
  "bg-[#F4F1EC]",
  "bg-[#E6ECE9]",
  "bg-[#EFE6DC]",
  "bg-[#E9EDF2]",
];

const CategoryCard = ({ category, index = 0 }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = React.useState(false);

  const handleClick = () => {
    if (category?.slug) {
      navigate(`/category/${category.slug}`);
    }
  };

  const imageUrl = category?.image
    ? getImageUrl(category.image)
    : "/placeholder.jpg";

  const bg = bgVariants[index % bgVariants.length];

  return (
    <div
      onClick={handleClick}
      className={`
        relative overflow-hidden
        rounded-2xl md:rounded-3xl
        p-6 md:p-7 ${bg}
        cursor-pointer group
        transition-all duration-300 ease-out
        hover:-translate-y-1.5 hover:shadow-lg
        
        min-h-[340px] md:min-h-[380px]
      `}
    >
      {/* TEXT CONTENT */}
      <div className="relative z-10 max-w-[75%]">
        {/* Small Label */}
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
          {category?.slug?.replace("-", " ") || "Category"}
        </p>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight mb-3">
          {category?.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {category?.description ||
            "Discover premium collection crafted for modern lifestyle."}
        </p>

        {/* CTA */}
        <div className="mt-5">
          <span className="text-sm font-semibold text-black inline-block">
            Shop Now
            <span className="block h-[1px] bg-black mt-1 w-0 group-hover:w-full transition-all duration-300"></span>
          </span>
        </div>
      </div>

      {/* IMAGE (BOTTOM RIGHT FLOATING) */}
      <div className="absolute bottom-0 right-0 w-[120px] md:w-[150px] lg:w-[170px] pointer-events-none">
        <img
          src={imageUrl}
          alt={category?.name || "Category"}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
            setLoaded(true);
          }}
          className={`
            w-full h-auto object-contain
            transition-all duration-500
            ${loaded ? "opacity-100" : "opacity-0"}
            group-hover:scale-105
          `}
        />
      </div>

      {/* SUBTLE GLOW EFFECT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"></div>
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

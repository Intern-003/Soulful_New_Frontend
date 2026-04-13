import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryBannerCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (category?.slug) {
      navigate(`/category/${category.slug}`);
    }
  };

  const imageUrl = category?.image
    ? getImageUrl(category.image)
    : "/placeholder.jpg";

  return (
    <div
      onClick={handleClick}
      className="
        relative overflow-hidden
        rounded-xl
        cursor-pointer group

        h-[260px] md:h-[300px] lg:h-[380px]
      "
    >
      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={category?.name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.jpg";
        }}
        className="
          w-full h-full object-cover
          transition-transform duration-700 ease-out
          group-hover:scale-105
        "
      />

      {/* SUBTLE OVERLAY */}
      <div className="absolute inset-0 bg-black/[0.03] group-hover:bg-black/[0.08] transition duration-500" />

      <div className="absolute left-1/2 bottom-6 -translate-x-1/2">
        <div
          className="
            px-5 py-2 rounded-full
            text-xs tracking-[0.10em] uppercase
            font-medium

            bg-white text-[#7a1c3d]

            shadow-[0_2px_8px_rgba(0,0,0,0.08)]
            
            transition-all duration-300 ease-out

            group-hover:bg-[#7a1c3d]
            group-hover:text-white
            group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]
            group-hover:-translate-y-0.5
            group-hover:scale-105
            "
        >
          {category?.name} →
        </div>
      </div>
    </div>
  );
};

export default React.memo(CategoryBannerCard);

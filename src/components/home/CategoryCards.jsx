import React from "react";
import { useNavigate } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryCards = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useGet("/categories");

  // ✅ extract safely
  const categories =
    data?.data?.filter((cat) => cat.parent_id === null).slice(0, 4) || [];

  // ✅ loading UI
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[260px] rounded-xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ✅ error UI
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load categories
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

        {categories.map((cat, index) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className={`group relative rounded-2xl p-6 h-[260px] overflow-hidden cursor-pointer
            transition-all duration-300 hover:shadow-xl hover:-translate-y-2
            ${bgColors[index % bgColors.length]}`}
          >

            {/* SMALL TEXT */}
            <p className="text-xs text-gray-500 mb-2">
              {cat.slug}
            </p>

            {/* TITLE */}
            <h3 className="text-lg md:text-xl font-semibold text-[#2b1b12] mb-3">
              {cat.name}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {cat.description}
            </p>

            {/* BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/category/${cat.slug}`);
              }}
              className="text-sm font-medium border-b border-[#7a1c3d] text-[#7a1c3d] hover:opacity-70 transition"
            >
              Shop Now
            </button>

            {/* IMAGE */}
            <img
              src={getImageUrl(cat.image)}
              alt={cat.name}
              className="absolute bottom-0 right-2 w-[110px] md:w-[130px] object-contain 
              transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ))}

      </div>
    </div>
  );
};

export default CategoryCards;

//
// 🎨 COLORS (MATCH TEMPLATE EXACTLY)
//
const bgColors = [
  "bg-[#f3ede9]",
  "bg-[#eef2ef]",
  "bg-[#f5efe7]",
  "bg-[#eef1f4]",
];
import React from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryCard = ({ category, variant = "default" }) => {
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

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col border border-gray-100 hover:border-gray-200"
    >
      {/* Text Content */}
      <div className="p-6 pb-4 flex-1">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
          {category?.slug?.replace("-", " ") || ""}
        </p>
        <h3 className="text-2xl font-semibold text-gray-900 leading-tight mb-3">
          {category?.name}
        </h3>
        <p className="text-gray-600 text-[15px] line-clamp-3">
          {category?.description || "Explore our premium collection"}
        </p>
      </div>

      {/* Shop Now */}
      <div className="px-6 pb-6">
        <span className="inline-block text-[#7a1c3d] font-medium text-sm border-b border-[#7a1c3d] pb-0.5 group-hover:border-[#9a2a4f] transition-colors">
          Shop Now
        </span>
      </div>

      <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">


        {/* Main image */}
        <img
          src={imageUrl}
          alt={category?.name || "Category"}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
            setLoaded(true);
          }}
          className={`relative max-h-full max-w-full object-contain transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"
            } group-hover:scale-105 transition-transform duration-700`}
        />
      </div>

      {/* Image */}
      {/* <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        <img
          src={imageUrl}
          alt={category?.name || "Category"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
          className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
      </div> */}
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
// src/components/common/CategoryCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/getImageUrl";

const CategoryCard = ({ 
  category, 
  variant = "default", 
}) => {
  const navigate = useNavigate();

  const [imgSrc, setImgSrc] = useState("/placeholder.jpg");
  const [isLoading, setIsLoading] = useState(true);

  // Set image source once when category changes
  useEffect(() => {
    if (!category?.image) {
      setImgSrc("/placeholder.jpg");
      setIsLoading(false);
      return;
    }

    const url = getImageUrl(category.image);
    setImgSrc(url || "/placeholder.jpg");
    setIsLoading(true);
  }, [category]);

  const handleClick = () => {
    if (category?.slug) {
      navigate(`/category/${category.slug}`);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImgSrc("/placeholder.jpg");
    setIsLoading(false);
  };

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

      {/* Image Area */}
      <div className="relative h-64 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-8 h-8 border-4 border-[#7a1c3d] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <img
          src={imgSrc}
          alt={category?.name || "Category"}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105 ${isLoading ? "opacity-0" : "opacity-100"}`}
        />
      </div>
    </div>
  );
};

export default CategoryCard;
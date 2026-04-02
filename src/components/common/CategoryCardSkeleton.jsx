import React from "react";

const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 animate-pulse">
      {/* Text */}
      <div className="mb-4">
        <div className="h-3 w-24 bg-gray-200 mb-3 rounded"></div>
        <div className="h-6 w-3/4 bg-gray-300 mb-3 rounded"></div>
        <div className="h-4 w-full bg-gray-200 mb-2 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>

      {/* Button */}
      <div className="h-4 w-20 bg-gray-300 mb-6 rounded"></div>

      {/* Image */}
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
};

export default CategoryCardSkeleton;
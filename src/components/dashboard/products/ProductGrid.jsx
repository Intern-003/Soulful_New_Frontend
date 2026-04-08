import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], loading, columns = 4 }) => {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  const skeletonCount = 8;

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 sm:gap-6`}>
      
      {/* LOADING SKELETONS */}
      {loading &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="h-40 sm:h-52 md:h-[240px] bg-gray-200 animate-pulse" />
            <div className="p-3 sm:p-4 space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
            </div>
          </div>
        ))}

      {/* PRODUCTS */}
      {!loading &&
        products?.filter(Boolean).map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
    </div>
  );
};

export default ProductGrid;
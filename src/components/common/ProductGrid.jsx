import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], loading, columns = 4 }) => {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  const skeletonArray = Array(8).fill(0);

  return (
    <div className={`grid ${columnClasses[columns]} gap-6 md:gap-8`}>
      
      {/* ✅ LOADING SKELETONS */}
      {loading &&
        skeletonArray.map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="h-[240px] bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
            </div>
          </div>
        ))}

      {/* ✅ REAL PRODUCTS */}
      {!loading &&
        products?.filter(Boolean).map((item) => (
          <ProductCard key={item.id} product={item} loading={false} />
        ))}
    </div>
  );
};

export default ProductGrid;
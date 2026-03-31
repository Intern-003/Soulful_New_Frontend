// src/components/common/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, columns = 4 }) => {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  const skeletonArray = Array(8).fill(null);

  return (
    <div className={`grid ${columnClasses[columns]} gap-6 md:gap-8`}>
      {(loading ? skeletonArray : products).map((item, index) => (
        <ProductCard key={item?.id || index} product={item} loading={loading} />
      ))}
    </div>
  );
};

export default ProductGrid;
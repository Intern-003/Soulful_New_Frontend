// src/components/home/BestSellerSection.jsx
import React from 'react';
import useGet from '../../api/hooks/useGet';
import SectionHeader from '../common/SectionHeader';
import ProductGrid from "../dashboard/products/ProductGrid";
const BestSellerSection = () => {
  const { data, loading } = useGet('/products/best-sellers');
  
  // ✅ Access data correctly - your API returns { success: true, data: [...] }
  const products = data?.data?.slice(0, 8) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <SectionHeader 
        title="Best Sellers"
        subtitle="Discover our most popular products"
      />
      <ProductGrid products={products} loading={loading} columns={4} />
    </div>
  );
};

export default BestSellerSection;
import React from "react";
import useGet from "../../api/hooks/useGet";
import SectionHeader from "../common/SectionHeader";
import ProductGrid from "../dashboard/products/ProductGrid";

const BestSellerSection = () => {
  const { data, loading } = useGet("/products/best-sellers");

  // Access data correctly - API returns { success: true, data: [...] }
  const products = (data?.data || []).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 py-10 xs:py-12 sm:py-16 lg:py-20">
      <SectionHeader
        title="Best Sellers"
        subtitle="Discover our most loved and highest-rated products, trusted by thousands of happy customers"
      />
      <ProductGrid products={products} loading={loading} columns={4} />
    </div>
  );
};

export default BestSellerSection;
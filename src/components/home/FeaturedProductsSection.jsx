// src/components/home/FeaturedProductsSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import SectionHeader from "../common/SectionHeader";
import ProductGrid from "../dashboard/products/ProductGrid";
const FeaturedProductsSection = () => {
  const navigate = useNavigate();
  const { data, loading } = useGet("/products/featured");

  // ✅ Access data correctly
  const products = (data?.data || []).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <SectionHeader
        title="Featured Products"
        subtitle="Handpicked products just for you"
      />

      <ProductGrid products={products} loading={loading} columns={4} />

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#7a1c3d] text-white px-6 py-2 rounded-full hover:bg-[#5a142c] transition cursor-pointer"
        >
          View All →
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductsSection;

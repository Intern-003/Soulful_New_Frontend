import React from "react";
import { useNavigate } from "react-router-dom";
import useGet from "../../api/hooks/useGet";
import SectionHeader from "../common/SectionHeader";
import ProductGrid from "../dashboard/products/ProductGrid";

const FeaturedProductsSection = () => {
  const navigate = useNavigate();
  const { data, loading } = useGet("/products/featured");

  // Access data correctly - API returns { success: true, data: [...] }
  const products = (data?.data || []).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 py-10 xs:py-12 sm:py-16 lg:py-20">
      <SectionHeader
        title="Featured Products"
        subtitle="Handpicked products just for you"
      />

      <ProductGrid products={products} loading={loading} columns={4} />

      {/* VIEW ALL BUTTON */}
      <div className="text-center mt-8 xs:mt-10 sm:mt-12 md:mt-16">
        <button
          onClick={() => navigate("/shop")}
          className="
            group inline-flex items-center justify-center gap-2 xs:gap-3
            bg-[#7a1c3d] text-white px-5 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3
            text-xs xs:text-sm sm:text-base font-semibold rounded-full 
            hover:bg-[#5a142c] transition-all duration-300 cursor-pointer
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95
          "
        >
          <span>View All</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductsSection;
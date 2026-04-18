import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import ProductGrid from "../../components/dashboard/products/ProductGrid";

export default function SoulfullSpecialPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // API CALL
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axiosInstance.get("/products/deals");

        // structure safe handling
        const data = res.data?.data?.data || res.data?.data || [];

        setProducts(data);
      } catch (err) {
        console.error("Deals fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="bg-[#F6F6F6] text-white min-h-screen">
      {/* HERO BANNER */}
      <section className="relative h-[80vh] bg-[#7A1C3D] flex items-center justify-center overflow-hidden">
        {/* Background Design */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 bg-[#EBDBE2] skew-x-[-20deg] -ml-20"></div>
          <div className="w-1/3 bg-[#7A1C3D]"></div>
          <div className="w-1/3 bg-[#EBDBE2] skew-x-[-20deg] ml-20"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-xl"
        >
          <p className="tracking-widest text-sm text-gray-300 mb-2">
            NEW SEASON
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">Super Sale</h1>

          <p className="text-gray-300 text-sm mb-6">
            Discover premium deals curated just for you. Limited time offer.
          </p>

          <button className="bg-white text-black px-6 py-2 text-sm font-semibold hover:scale-105 transition cursor-pointer">
            SHOP NOW
          </button>

          <p className="text-xs text-gray-100 mt-4">SOULFULL</p>
        </motion.div>
      </section>
      <div className="bg-[#8b0d3a] text-white text-sm h-2 flex items-center justify-center overflow-hidden">
        <div className="relative h-10 w-full flex items-center justify-center"></div>
      </div>

      <section className="relative overflow-hidden px-4 md:px-6 py-14">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EBDBE2] via-[#F6F6F6] to-[#F6F6F6]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#7A1C3D]/10 blur-3xl rounded-full" />

        <div className="relative z-10 max-w-[1280px] mx-auto">
          {/* Heading */}
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-xs tracking-[0.35em] text-[#7A1C3D]/70">
                EXCLUSIVE COLLECTION
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mt-1">
                Exclusive Products
              </h2>
            </div>

            <div className="hidden md:block h-[1px] flex-1 ml-6 bg-gradient-to-r from-[#7A1C3D]/40 to-transparent" />
            {!loading && (
              <span className="text-sm text-gray-500">
                {products.length} products
              </span>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-6 md:px-16 pb-16">
        {/* PRODUCT GRID COMPONENT */}
        <ProductGrid
          products={products}
          loading={loading}
          columns={4}
          viewMode="grid"
        />
      </section>
    </div>
  );
}

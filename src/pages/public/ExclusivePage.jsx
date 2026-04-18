import { motion } from "framer-motion";
import useGet from "../../api/hooks/useGet";
import ProductGrid from "../../components/dashboard/products/ProductGrid";

export default function ExclusivePage() {
  // FEATURED PRODUCTS API
  const {
    data: featuredResponse,
    loading: featuredLoading,
    error,
  } = useGet("/products/featured");

  const featuredProducts = Array.isArray(featuredResponse?.data)
    ? featuredResponse.data
    : [];

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      {/* HERO */}
      <section className="relative h-[80vh] bg-[#e9d9ce] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 flex">
          {/* RIGHT LIGHT FADE */}
          <div className="w-[25%] bg-[#e9d9ce] skew-x-[-20deg] ml-[-40px] z-10"></div>

          {/* LEFT LAYER 1 */}
          <div className="w-[30%] bg-[#E5D2C3] skew-x-[-20deg] -ml-24 shadow-2xl z-10"></div>

          {/* LEFT LAYER 2 */}
          <div className="w-[25%] bg-[#d6c2b1] skew-x-[-20deg] -ml-20 shadow-xl z-20"></div>

          {/* CENTER DARK MAIN */}
          <div className="flex-1 bg-gradient-to-br from-[#2a2a2a] to-[#111] skew-x-[-20deg] z-30 shadow-inner"></div>

          {/* RIGHT DARK LAYER */}
          <div className="w-[20%] bg-[#1a1a1a] skew-x-[-20deg] ml-[-60px] shadow-xl z-20"></div>
        </div>

        {/* ✨ CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-50 ml-auto mr-6 md:mr-20 max-w-lg text-right text-white"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Exclusive</h1>

          <p className="tracking-widest text-sm mb-4 text-gray-300">
            UP TO 50% OFF
          </p>

          <p className="text-sm mb-6 text-white">
            Discover exclusive premium collections curated just for you.
            Limited-time luxury deals.
          </p>

          <button className="bg-white text-[#7A1C3D] px-6 py-2 text-sm font-semibold hover:scale-105 transition shadow-lg">
            SHOP NOW
          </button>

          <p className="text-xs mt-4 text-gray-100">SOULFULL EXCLUSIVE</p>
        </motion.div>
      </section>

      {/* FEATURED STRIP */}
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
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-4 md:px-6 pb-16">
        <div className="max-w-[1280px] mx-auto">
          {/* Error */}
          {error && (
            <p className="text-red-500 mb-4">
              Failed to load featured products
            </p>
          )}

          {/* GRID */}
          <ProductGrid
            products={featuredProducts}
            loading={featuredLoading}
            columns={4} // 🔥 FIXED SIZE
            viewMode="grid"
          />
        </div>
      </section>
    </div>
  );
}

// import React from "react";
// import ProductCard from "./ProductCard";
// import ProductSkeleton from "../../common/ProductSkeleton";

// const ProductGrid = ({
//   products = [],
//   loading,
//   columns = 4,
//   viewMode = "grid",
//   onClearFilters,
// }) => {
//   const gridClasses = {
//     2: "grid-cols-1 sm:grid-cols-2",
//     3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
//     4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
//   };

//   const skeletonCount = 8;

//   return (
//     <div
//       className={`grid 
//         ${viewMode === "grid" ? gridClasses[columns] : "grid-cols-1"}
//         gap-x-5 sm:gap-x-6 lg:gap-x-8
//         gap-y-8 sm:gap-y-10
//       `}
//     >
//       {/* LOADING */}
//       {loading ? (
//         Array.from({ length: skeletonCount }).map((_, index) => (
//           <ProductSkeleton key={index} viewMode={viewMode} />
//         ))
//       ) : products?.length === 0 ? (
//         /* EMPTY STATE */
//         <div className="col-span-full flex flex-col items-center justify-center py-10 text-center relative">
//           {/* Glow Background */}
//           <div className="absolute w-72 h-72 bg-[#7a1c3d]/10 blur-3xl rounded-full -z-10"></div>

//           {/* Icon Box */}
//           <div className="relative mb-6">
//             <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#f8e9ef] to-[#f3d6e2] flex items-center justify-center shadow-inner border border-[#e7d3dc]">
//               <span className="text-3xl">🛍️</span>
//             </div>

//             {/* Floating dot */}
//             <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#7a1c3d] rounded-full animate-ping"></div>
//           </div>

//           {/* Title */}
//           <h3 className="text-xl font-semibold text-[#2d0f1f] tracking-wide">
//             Nothing here yet
//           </h3>

//           {/* Subtitle */}
//           <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
//             We couldn’t find anything matching your selection. Try adjusting
//             filters or explore something new.
//           </p>
//         </div>
//       ) : (
//         /* PRODUCTS */
//         products
//           ?.filter(Boolean)
//           .map((item) => (
//             <ProductCard key={item.id} product={item} viewMode={viewMode} />
//           ))
//       )}
//     </div>
//   );
// };

// export default ProductGrid;


// src/components/dashboard/products/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "../../common/ProductSkeleton";

const ProductGrid = ({
  products = [],
  loading,
  columns = 4,
  viewMode = "grid",
  onClearFilters,
}) => {
  const gridClasses = {
    2: "grid-cols-1 xs:grid-cols-2",
    3: "grid-cols-1 xs:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  const skeletonCount = 8;

  return (
    <div
      className={`grid 
        ${viewMode === "grid" ? gridClasses[columns] : "grid-cols-1"}
        gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8
      `}
    >
      {/* LOADING */}
      {loading ? (
        Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductSkeleton key={index} viewMode={viewMode} />
        ))
      ) : products?.length === 0 ? (
        /* EMPTY STATE - FULLY RESPONSIVE */
        <div className="col-span-full flex flex-col items-center justify-center py-12 xs:py-16 sm:py-20 text-center relative">
          {/* Glow Background */}
          <div className="absolute w-48 h-48 xs:w-56 xs:h-56 sm:w-72 sm:h-72 bg-[#7a1c3d]/10 blur-3xl rounded-full -z-10"></div>

          {/* Icon Box */}
          <div className="relative mb-4 xs:mb-5 sm:mb-6">
            <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#f8e9ef] to-[#f3d6e2] flex items-center justify-center shadow-inner border border-[#e7d3dc]">
              <span className="text-2xl xs:text-3xl sm:text-4xl">🛍️</span>
            </div>

            {/* Floating dot */}
            <div className="absolute -top-2 -right-2 w-3 h-3 xs:w-4 xs:h-4 bg-[#7a1c3d] rounded-full animate-ping"></div>
          </div>

          {/* Title */}
          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-[#2d0f1f] tracking-wide">
            Nothing here yet
          </h3>

          {/* Subtitle */}
          <p className="text-xs xs:text-sm text-gray-500 mt-2 max-w-xs leading-relaxed px-4">
            We couldn't find anything matching your selection. Try adjusting
            filters or explore something new.
          </p>
        </div>
      ) : (
        /* PRODUCTS */
        products
          ?.filter(Boolean)
          .map((item) => (
            <ProductCard key={item.id} product={item} viewMode={viewMode} />
          ))
      )}
    </div>
  );
};

export default ProductGrid;
import React from "react";

import {
  PackageSearch,
} from "lucide-react";

import ProductCard from "../../../components/dashboard/products/ProductCard";

const ProductGridSkeleton = () => {
  return (
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-4
      "
    >
      {Array.from({
        length: 10,
      }).map((_, index) => (
        <div
          key={index}
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            overflow-hidden
            animate-pulse
          "
        >
          <div className="aspect-square bg-slate-200" />

          <div className="p-3 space-y-3">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({
  title,
  themeColor,
}) => {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-3xl
        p-10
        text-center
      "
    >
      <div
        className="
          w-16
          h-16
          mx-auto
          rounded-full
          flex
          items-center
          justify-center
        "
        style={{
          backgroundColor: `${themeColor}15`,
        }}
      >
        <PackageSearch
          size={28}
          style={{
            color: themeColor,
          }}
        />
      </div>

      <h3
        className="
          text-lg
          font-bold
          text-slate-900
          mt-4
        "
      >
        No Products Found
      </h3>

      <p
        className="
          text-sm
          text-slate-500
          mt-2
          max-w-md
          mx-auto
        "
      >
        {title} currently has no products available.
      </p>
    </div>
  );
};

const StoreProductGrid = ({
  title = "Products",
  products = [],
  loading = false,
  themeColor = "#7a1c3d",
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-7">

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          mb-5
        "
      >
        <div>
          <h2
            className="
              text-xl
              md:text-2xl
              font-bold
              text-slate-900
            "
          >
            {title}
          </h2>

          <div
            className="
              h-[3px]
              w-12
              rounded-full
              mt-2
            "
            style={{
              backgroundColor:
                themeColor,
            }}
          />
        </div>

        <div
          className="
            text-sm
            font-medium
            text-slate-500
          "
        >
          {products.length} Items
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <ProductGridSkeleton />
      )}

      {/* Empty */}

      {!loading &&
        products.length === 0 && (
          <EmptyState
            title={title}
            themeColor={
              themeColor
            }
          />
        )}

      {/* Products */}

      {!loading &&
        products.length > 0 && (
          <div
            className="
              grid

              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5

              gap-4
            "
          >
            {products.map(
              (
                product
              ) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>
        )}
    </section>
  );
};

export default StoreProductGrid;
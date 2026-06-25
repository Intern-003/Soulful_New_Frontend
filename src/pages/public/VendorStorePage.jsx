import React, {
  useMemo,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import { Search } from "lucide-react";

import useGet from "../../api/hooks/useGet";

import { VENDOR } from "../../api/endpoints";

import StoreHero from "../../components/dashboard/store/StoreHero";
import StoreStats from "../../components/dashboard/store/StoreStats";
import StoreBannerSlider from "../../components/dashboard/store/StoreBannerSlider";
import StoreCategoryTabs from "../../components/dashboard/store/StoreCategoryTabs";
import StoreProductGrid from "../../components/dashboard/store/StoreProductGrid";
import StoreAbout from "../../components/dashboard/store/StoreAbout";
import StoreSections from "../../components/dashboard/store/StoreSections";
import StoreReviews from "../../components/dashboard/store/StoreReviews";
import StoreNavigation from "../../components/dashboard/store/StoreNavigation";

const DEFAULT_THEME = "#7a1c3d";

const VendorStorePage = () => {
  const { slug } = useParams();

  const {
    data,
    loading,
    error,
    refetch,
  } = useGet(
    VENDOR.HOMEPAGE(slug)
  );

  const homepage = data || {};

const {
  data: reviewsData,
} = useGet(
  VENDOR.REVIEWS(slug)
);
  const vendor =
    homepage?.vendor || {};

  const categories =
    homepage?.categories || [];

  const featuredProducts =
    homepage?.featured_products || [];

  const newArrivals =
    homepage?.new_arrivals || [];

  const sections =
    homepage?.sections || [];

  const banners =
    homepage?.banners || [];

  const themeColor =
    vendor?.theme_color ||
    DEFAULT_THEME;

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  /*
  |--------------------------------------------------------------------------
  | MERGE PRODUCTS
  |--------------------------------------------------------------------------
  */

  const allProducts =
    useMemo(() => {
      const productMap =
        new Map();

      [
        ...featuredProducts,
        ...newArrivals,
      ].forEach((product) => {
        productMap.set(
          product.id,
          product
        );
      });

      return Array.from(
        productMap.values()
      );
    }, [
      featuredProducts,
      newArrivals,
    ]);

  /*
  |--------------------------------------------------------------------------
  | FILTER PRODUCTS
  |--------------------------------------------------------------------------
  */

  const filteredProducts =
    useMemo(() => {
      let result = [
        ...allProducts,
      ];

      if (
        selectedCategory !==
        "all"
      ) {
        result =
          result.filter(
            (product) =>
              Number(
                product?.category?.id
              ) ===
              Number(
                selectedCategory
              )
          );
      }

      if (
        searchTerm.trim()
      ) {
        const keyword =
          searchTerm.toLowerCase();

        result =
          result.filter(
            (product) =>
              product?.name
                ?.toLowerCase()
                ?.includes(
                  keyword
                )
          );
      }

      return result;
    }, [
      allProducts,
      selectedCategory,
      searchTerm,
    ]);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >
        <div className="text-lg font-semibold">
          Loading Store...
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >
        <div className="text-red-500">
          Failed to load store.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* HERO */}

<StoreHero
  vendor={vendor}
  totalProducts={
    homepage?.total_products ||
    allProducts.length
  }
  followersCount={
    homepage?.followers_count ||
    0
  }
  themeColor={themeColor}
  onFollowChange={() =>
    refetch({
      force: true,
    })
  }
/>

<StoreNavigation
  themeColor={themeColor}
/>
      

      {/* STATS */}

<StoreStats
  totalProducts={
    homepage?.total_products || 0
  }
  followersCount={
    homepage?.followers_count || 0
  }
  rating={
    vendor?.rating || 0
  }
  joinedDate={
    vendor?.created_at
  }
  themeColor={
    vendor?.theme_color
  }
/>

      {/* BANNERS */}

      {banners.length > 0 && (
<StoreBannerSlider
  banners={banners}
  themeColor={
    vendor?.theme_color
  }
/>
      )}

      {/* SEARCH */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-6
        "
      >
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-4
          "
        >
          <div className="relative">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={
                searchTerm
              }
              placeholder={`Search in ${
                vendor?.store_name ||
                "Store"
              }`}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="
                w-full
                h-12
                pl-11
                pr-4
                rounded-xl
                border
                border-slate-300
                outline-none
              "
              style={{
                borderColor:
                  searchTerm
                    ? themeColor
                    : undefined,
              }}
            />
          </div>
        </div>
      </section>

      {/* CATEGORYS */}
<div id="products">
<StoreCategoryTabs
  categories={categories}
  products={allProducts}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  themeColor={vendor.theme_color}
/>
</div>

      {/* SEARCH RESULTS */}

      {(searchTerm ||
        selectedCategory !==
          "all") && (
        <StoreProductGrid
          title="Products"
          products={
            filteredProducts
          }
     themeColor={
    vendor?.theme_color
  }
        />
      )}

      {/* DYNAMIC SECTIONS */}

      {!searchTerm &&
        selectedCategory ===
          "all" && (
          <StoreSections
            sections={
              sections
            }
            featuredProducts={
              featuredProducts
            }
            newArrivals={
              newArrivals
            }
   themeColor={
    vendor?.theme_color ||
    "#7a1c3d"
  }
          />
        )}

      {/* FALLBACK */}

      {!searchTerm &&
        selectedCategory ===
          "all" &&
        sections.length ===
          0 && (
          <>
            <StoreProductGrid
              title="Featured Products"
              products={
                featuredProducts
              }
             themeColor={
    vendor?.theme_color
  }
            />

            <StoreProductGrid
              title="New Arrivals"
              products={
                newArrivals
              }
              themeColor={
    vendor?.theme_color
  }
            />
          </>
        )}

      {/* ABOUT */}


<div id="reviews">
<StoreReviews
  reviews={
    reviewsData?.reviews || []
  }
  averageRating={
    reviewsData?.summary
      ?.average_rating || 0
  }
  totalReviews={
    reviewsData?.summary
      ?.total_reviews || 0
  }
  ratingBreakdown={
    reviewsData?.summary
      ?.rating_breakdown || {}
  }
  themeColor={
    vendor?.theme_color ||
    "#7a1c3d"
  }
/>
</div>

<div id="about">
<StoreAbout
  vendor={vendor}
  totalProducts={homepage?.total_products || 0}
  followersCount={homepage?.followers_count || 0}
  rating={vendor?.rating || 0}
  themeColor={
    vendor?.theme_color ||
    "#7a1c3d"
  }
/>
</div>
    </div>
  );
};

export default VendorStorePage;
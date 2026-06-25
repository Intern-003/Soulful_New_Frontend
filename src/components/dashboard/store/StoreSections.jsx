import React, {
  useMemo,
} from "react";

import StoreProductGrid from "./StoreProductGrid";

const StoreSections = ({
  sections = [],
  featuredProducts = [],
  newArrivals = [],
  bestSellers = [],
  topRatedProducts = [],
  themeColor = "#7a1c3d",
}) => {
  const sectionProducts =
    useMemo(
      () => ({
        featured_products:
          featuredProducts,

        new_arrivals:
          newArrivals,

        best_sellers:
          bestSellers,

        top_rated:
          topRatedProducts,
      }),
      [
        featuredProducts,
        newArrivals,
        bestSellers,
        topRatedProducts,
      ]
    );

  const visibleSections =
    useMemo(() => {
      return sections.filter(
        (section) => {
          const products =
            sectionProducts[
              section.type
            ] || [];

          return (
            products.length > 0
          );
        }
      );
    }, [
      sections,
      sectionProducts,
    ]);

  if (
    !visibleSections.length
  ) {
    return null;
  }

  return (
    <>
      {visibleSections.map(
        (section) => {
          const products =
            sectionProducts[
              section.type
            ] || [];

          return (
            <StoreProductGrid
              key={section.id}
              title={
                section.title
              }
              products={
                products
              }
              themeColor={
                themeColor
              }
            />
          );
        }
      )}
    </>
  );
};

export default StoreSections;
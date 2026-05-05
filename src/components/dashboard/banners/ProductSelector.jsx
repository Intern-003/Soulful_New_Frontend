// FILE: src/components/dashboard/banners/ProductSelector.jsx

import React, {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";

import useGet from "../../../api/hooks/useGet";

import ProductSelectorFilters from "./ProductSelectorFilters";
import ProductGrid from "./ProductGrid";
import ProductPreview from "./ProductPreview";

/* ==========================================================
   FILE: ProductSelector.jsx
   Strict Elite Mode (Refactored Final)

   Props:
   selectedProducts = []
   onChange(products)
========================================================== */

const ProductSelector = ({
  selectedProducts = [],
  onChange,
}) => {
  const {
    data,
    loading,
  } = useGet(
    "/admin/products"
  );

  const {
    data: categoryData,
  } = useGet(
    "/categories"
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState(
    "all"
  );

  const [
    selected,
    setSelected,
  ] = useState([]);

  useEffect(() => {
    setSelected(
      selectedProducts
    );
  }, [
    selectedProducts,
  ]);

  const products =
    data?.data?.data ||
    data?.data ||
    data ||
    [];

  const categories =
    categoryData?.data ||
    categoryData ||
    [];

  /* ========================================================
     FILTERED DATA
  ======================================================== */

  const filtered =
    useMemo(() => {
      let list = [
        ...products,
      ];

      if (
        search.trim()
      ) {
        const q =
          search.toLowerCase();

        list =
          list.filter(
            (
              item
            ) =>
              item.name
                ?.toLowerCase()
                .includes(
                  q
                )
          );
      }

      if (
        category !==
        "all"
      ) {
        list =
          list.filter(
            (
              item
            ) =>
              String(
                item.category_id
              ) ===
              String(
                category
              )
          );
      }

      return list;
    }, [
      products,
      search,
      category,
    ]);

  /* ========================================================
     ACTIONS
  ======================================================== */

  const isSelected =
    (id) =>
      selected.some(
        (
          item
        ) =>
          String(
            item.id ||
              item
          ) ===
          String(id)
      );

  const toggleProduct =
    (
      product
    ) => {
      const exists =
        isSelected(
          product.id
        );

      let next =
        [];

      if (
        exists
      ) {
        next =
          selected.filter(
            (
              item
            ) =>
              String(
                item.id ||
                  item
              ) !==
              String(
                product.id
              )
          );
      } else {
        next = [
          ...selected,
          product,
        ];
      }

      setSelected(
        next
      );

      onChange?.(
        next
      );
    };

  const removeProduct =
    (
      product
    ) => {
      const next =
        selected.filter(
          (
            item
          ) =>
            String(
              item.id ||
                item
            ) !==
            String(
              product.id
            )
        );

      setSelected(
        next
      );

      onChange?.(
        next
      );
    };

  const resetFilters =
    () => {
      setSearch("");
      setCategory(
        "all"
      );
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="space-y-5">
      <ProductSelectorFilters
        search={
          search
        }
        category={
          category
        }
        categories={
          categories
        }
        selectedCount={
          selected.length
        }
        onSearchChange={
          setSearch
        }
        onCategoryChange={
          setCategory
        }
        onReset={
          resetFilters
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <ProductGrid
          products={
            filtered
          }
          selectedProducts={
            selected
          }
          loading={
            loading
          }
          onSelect={
            toggleProduct
          }
        />

        <ProductPreview
          products={
            selected
          }
          onRemove={
            removeProduct
          }
        />
      </div>
    </div>
  );
};

export default memo(
  ProductSelector
);
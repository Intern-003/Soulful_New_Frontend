// FILE: src/pages/dashboard/brands/BrandProductsPage.jsx

import React, {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Store,
} from "lucide-react";

import useGet from "../../../api/hooks/useGet";

import BrandProductsGrid from "../../../components/dashboard/brands/BrandProductsGrid";

import BrandProductsFilters from "../../../components/dashboard/brands/BrandProductsFilters";

import BrandProductsPagination from "../../../components/dashboard/brands/BrandProductsPagination";

/* ==========================================================
   FILE: BrandProductsPage.jsx
   Elite Production Grade

   Features:
   ✅ Brand products listing
   ✅ Search products
   ✅ Pagination ready
   ✅ Responsive
========================================================== */

const PER_PAGE = 20;

const BrandProductsPage = () => {
  /* ========================================================
     ROUTER
  ======================================================== */

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  /* ========================================================
     API
  ======================================================== */

  const {
    data,
    loading,
  } = useGet(
    `/brands/${id}`
  );

  /* ========================================================
     BRAND
  ======================================================== */

  const brand =
    data?.data;

  /* ========================================================
     PRODUCTS
  ======================================================== */

  const products =
    brand?.products ||
    [];

  /* ========================================================
     STATE
  ======================================================== */

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] =
    useState(1);

  /* ========================================================
     FILTERED
  ======================================================== */

  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (
          product
        ) =>
          product?.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      products,
      search,
    ]);

  /* ========================================================
     PAGINATION
  ======================================================== */

  const lastPage =
    Math.ceil(
      filteredProducts.length /
        PER_PAGE
    );

  const paginatedProducts =
    filteredProducts.slice(
      (
        currentPage -
        1
      ) * PER_PAGE,
      currentPage *
        PER_PAGE
    );

  /* ========================================================
     RESET
  ======================================================== */

  const handleReset =
    () => {
      setSearch("");

      setCurrentPage(
        1
      );
    };

  /* ========================================================
     UI
  ======================================================== */

  return (
    <div className="space-y-6 p-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="flex items-start gap-4">
            {/* BACK */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  -1
                )
              }
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 transition hover:bg-slate-50"
            >
              <ArrowLeft
                size={18}
              />
            </button>

            {/* CONTENT */}
            <div className="flex items-start gap-4">
              {/* ICON */}
              <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-[#7a1c3d]/10">
                <Store
                  size={30}
                  className="text-[#7a1c3d]"
                />
              </div>

              {/* TEXT */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {
                    brand?.name
                  }
                </h1>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Products linked with this brand
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-2xl bg-[#7a1c3d]/5 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Total Products
            </p>

            <h2 className="mt-1 text-3xl font-bold text-[#7a1c3d]">
              {
                filteredProducts.length
              }
            </h2>
          </div>
        </div>
      </div>

      {/* ===================================================
          FILTERS
      =================================================== */}

      <BrandProductsFilters
        search={
          search
        }
        total={
          filteredProducts.length
        }
        onSearchChange={(
          value
        ) => {
          setSearch(
            value
          );

          setCurrentPage(
            1
          );
        }}
        onReset={
          handleReset
        }
      />

      {/* ===================================================
          GRID
      =================================================== */}

      <BrandProductsGrid
        products={
          paginatedProducts
        }
        loading={
          loading
        }
      />

      {/* ===================================================
          PAGINATION
      =================================================== */}

      <BrandProductsPagination
        currentPage={
          currentPage
        }
        lastPage={
          lastPage
        }
        total={
          filteredProducts.length
        }
        perPage={
          PER_PAGE
        }
        onPageChange={
          setCurrentPage
        }
      />
    </div>
  );
};

export default BrandProductsPage;
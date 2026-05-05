import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  Grid3X3,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import axiosInstance from "../../../api/axiosInstance";
import ProductCard from "../../../components/dashboard/products/ProductCard";

/* ==========================================================
   FILE NAME: SubCategoryProducts.jsx

   SUBCATEGORY PRODUCTS PAGE
   Elite Production Grade

   APIs:
   GET /products?category=:id
   GET /categories/:id
========================================================== */

const SubCategoryProducts = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    products,
    setProducts,
  ] = useState(
    []
  );

  const [
    subcategory,
    setSubcategory,
  ] = useState(
    null
  );

  const [
    search,
    setSearch,
  ] = useState("");

  /* ==========================================
     LOAD DATA
  ========================================== */
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData =
    async () => {
      try {
        setLoading(
          true
        );

        const [
          productRes,
          categoryRes,
        ] =
          await Promise.all(
            [
              axiosInstance.get(
                `/products?category=${id}`
              ),
              axiosInstance.get(
                `/categories/${id}`
              ),
            ]
          );

        setProducts(
          productRes
            ?.data
            ?.data
            ?.data ||
            productRes
              ?.data
              ?.data ||
            []
        );

        setSubcategory(
          categoryRes
            ?.data
            ?.data ||
            {}
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* ==========================================
     FILTER PRODUCTS
  ========================================== */
  const filtered =
    useMemo(() => {
      let result = [
        ...products,
      ];

      if (
        search.trim()
      ) {
        result =
          result.filter(
            (
              item
            ) =>
              item.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      return result;
    }, [
      products,
      search,
    ]);

  /* ==========================================
     UI
  ========================================== */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() =>
                navigate(
                  -1
                )
              }
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#7b183f]"
            >
              <ArrowLeft
                size={
                  16
                }
              />
              Back
            </button>

            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Package
                size={
                  24
                }
                className="text-[#7b183f]"
              />
              {subcategory?.name ||
                "Products"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage products inside this subcategory.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                `/dashboard/products/create?category=${id}`
              )
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-[#7b183f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <Plus
              size={
                18
              }
            />
            Add Product
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
              placeholder="Search products..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#7b183f] focus:bg-white focus:ring-4 focus:ring-[#7b183f]/10"
            />
          </div>

          {/* Count */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Grid3X3
              size={16}
            />
            {
              filtered.length
            }{" "}
            Products
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map(
            (
              _,
              i
            ) => (
              <div
                key={
                  i
                }
                className="h-80 animate-pulse rounded-3xl bg-slate-200"
              />
            )
          )}
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7b183f]/10 text-[#7b183f]">
            <Package
              size={
                30
              }
            />
          </div>

          <h3 className="mt-5 text-xl font-semibold text-slate-900">
            No Products Found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Add products to this subcategory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(
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
    </div>
  );
};

export default SubCategoryProducts;
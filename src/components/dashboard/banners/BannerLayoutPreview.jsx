// FILE: src/components/dashboard/banners/BannerLayoutPreview.jsx

import React, { memo } from "react";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "../../../utils/getImageUrl";

/* ==========================================================
   ELITE FIXED VERSION

   FIXED:
   ✅ Banner image loading
   ✅ Product image loading
   ✅ Dynamic button text
   ✅ Dynamic button link
   ✅ Supports create/edit preview
========================================================== */

const getProductImage = (product) => {
  const raw =
    product?.image ||
    product?.product_image ||
    product?.thumbnail ||
    product?.featured_image ||
    product?.photos?.[0]?.image ||
    product?.gallery?.[0]?.image ||
    "";

  return getImageUrl(raw);
};

const getBannerImage = (banner) => {
  if (banner?.image instanceof File) {
    return URL.createObjectURL(banner.image);
  }

  return getImageUrl(banner?.image);
};

const normalizeProducts = (banner) => {
  if (Array.isArray(banner?.products)) return banner.products;
  if (Array.isArray(banner?.products?.data)) return banner.products.data;
  if (Array.isArray(banner?.banner_products)) return banner.banner_products;
  return [];
};

const price = (value) =>
  `₹${Number(value || 0).toLocaleString()}`;

const ProductCard = ({ item }) => {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-200">
      <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
        <img
          src={getProductImage(item)}
          alt={item?.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
      </div>

      <p className="mt-2 text-xs font-semibold line-clamp-2 text-slate-800">
        {item?.name || "Product"}
      </p>

      <p className="mt-1 text-xs font-bold text-emerald-600">
        {price(item?.price)}
      </p>
    </div>
  );
};

const BannerLayoutPreview = (props) => {
  const banner = props?.banner || props;

  const title = banner?.title || "Banner Title";
  const subtitle =
    banner?.subtitle || "Promotional campaign";
  const layout =
    (banner?.layout || "hero").toLowerCase();

  const image = getBannerImage(banner);

  const buttonText =
    banner?.button_text?.trim() ||
    "Shop Now";

  const buttonLink =
    banner?.button_link?.trim() || "#";

  const products = normalizeProducts(banner);

  /* =====================================================
     HERO
  ===================================================== */

  if (layout === "hero") {
    return (
      <div className="overflow-hidden rounded-3xl border shadow-sm relative">
        <div className="aspect-[16/7]">
          <img
            src={image}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />
        </div>

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-6 md:px-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-3 text-sm text-white/90 max-w-md">
            {subtitle}
          </p>

          <a
            href={buttonLink}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
          >
            {buttonText}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  /* =====================================================
     PRODUCTS
  ===================================================== */

  if (
    layout === "products" ||
    layout === "grid"
  ) {
    /* SINGLE PRODUCT */
    if (products.length === 1) {
      const item = products[0];

      return (
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="grid md:grid-cols-2 min-h-[340px]">
            {/* LEFT */}
            <div className="flex flex-col justify-center p-6 md:p-8">
              <span className="mb-3 w-fit rounded-full bg-[#7a1c3d]/10 px-3 py-1 text-xs font-semibold text-[#7a1c3d]">
                Featured Product
              </span>

              <h2 className="text-3xl font-bold text-slate-900">
                {title}
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                {subtitle}
              </p>

              <a
                href={buttonLink}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white"
              >
                {buttonText}
                <ArrowRight size={16} />
              </a>
            </div>

            {/* RIGHT */}
            <div className="relative flex items-center justify-center bg-slate-50 p-8">
              <img
                src={getProductImage(item)}
                alt={item?.name}
                className="max-h-[270px] object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src =
                    "/placeholder.jpg";
                }}
              />

              <div className="absolute bottom-5 left-5 rounded-2xl bg-white px-4 py-3 shadow-xl">
                <p className="text-sm font-semibold text-slate-900">
                  {item?.name}
                </p>

                <p className="text-lg font-bold text-emerald-600 mt-1">
                  {price(item?.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* MULTI PRODUCTS */
    return (
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* LEFT */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            <span className="mb-3 w-fit rounded-full bg-[#7a1c3d]/10 px-3 py-1 text-xs font-semibold text-[#7a1c3d]">
              New Arrivals
            </span>

            <h2 className="text-3xl font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              {subtitle}
            </p>

            <a
              href={buttonLink}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white"
            >
              {buttonText}
              <ArrowRight size={16} />
            </a>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5">
            {products.slice(0, 4).map((item, index) => (
              <ProductCard
                key={item?.id || index}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     SPLIT
  ===================================================== */

  if (layout === "split") {
    return (
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm grid md:grid-cols-2">
        <img
          src={image}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "/placeholder.jpg";
          }}
        />

        <div className="flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            {subtitle}
          </p>

          <a
            href={buttonLink}
            className="mt-6 w-fit rounded-2xl bg-[#7a1c3d] px-5 py-3 text-sm font-semibold text-white"
          >
            {buttonText}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-white p-10 text-center text-slate-400">
      Unsupported layout: {layout}
    </div>
  );
};

export default memo(BannerLayoutPreview);
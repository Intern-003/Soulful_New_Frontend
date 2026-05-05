// FILE: src/components/dashboard/banners/BannerPreview.jsx

import React, { memo } from "react";
import {
  ImageIcon,
  ExternalLink,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";
import BannerLayoutPreview from "./BannerLayoutPreview";

/* ==========================================================
   FILE: BannerPreview.jsx
   Strict Elite Mode
   Production Grade

   Props:
   values = {
     title,
     subtitle,
     image,
     layout,
     status,
     button_text,
     button_link,
     products
   }
========================================================== */

const BannerPreview = ({
  values = {},
}) => {
  const {
    title,
    subtitle,
    image,
    layout,
    status,
    button_text,
    button_link,
    products = [],
  } = values;

  const previewImage =
    typeof image ===
      "string" &&
    image
      ? getImageUrl(
          image
        )
      : image instanceof
        File
      ? URL.createObjectURL(
          image
        )
      : "";

  const isActive =
    Boolean(status);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Live Preview
          </h3>

          <p className="text-xs text-slate-500">
            How the banner may appear on storefront
          </p>
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${
            isActive
              ? "bg-emerald-500"
              : "bg-slate-500"
          }`}
        >
          {isActive
            ? "Active"
            : "Inactive"}
        </span>
      </div>

      {/* IMAGE */}
      <div className="p-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="aspect-[16/6]">
            {previewImage ? (
              <img
                src={
                  previewImage
                }
                alt={
                  title ||
                  "Banner Preview"
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <ImageIcon
                    size={28}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-2 text-sm text-slate-500">
                    No image selected
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TEXT */}
        <div className="mt-5">
          <h4 className="text-lg font-semibold text-slate-900">
            {title ||
              "Banner Title"}
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle ||
              "Banner subtitle or campaign message."}
          </p>
        </div>

        {/* CTA */}
        {(button_text ||
          button_link) && (
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#7a1c3d] px-4 py-2 text-sm font-semibold text-white"
            >
              {button_text ||
                "Shop Now"}

              <ExternalLink
                size={15}
              />
            </button>

            {button_link && (
              <p className="mt-2 truncate text-xs text-slate-400">
                {
                  button_link
                }
              </p>
            )}
          </div>
        )}

        {/* LAYOUT PREVIEW */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Layout Style
          </p>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <BannerLayoutPreview
              layout={
                layout
              }
              title={
                title
              }
              subtitle={
                subtitle
              }
              image={
                previewImage
              }
              products={
                products
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(
  BannerPreview
); 
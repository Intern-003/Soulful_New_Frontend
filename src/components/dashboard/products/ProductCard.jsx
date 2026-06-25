import React, { useState, useMemo } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  Heart,
  ShoppingCart,
  Check,
  Eye,
  Star,
  Share2,
} from "lucide-react";;

import { getImageUrl } from "../../../utils/getImageUrl";

import { addToCart } from "../../../app/slices/cartSlice";

import { addToWishlist } from "../../../app/slices/wishlistSlice";

const ProductCard = ({
  product,
  loading = false,
  viewMode = "grid",
}) => {
  if (!product) return null;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth,
  );

  const { items: cartItems } = useSelector(
    (state) => state.cart,
  );

  const { items: wishlistItems } =
    useSelector(
      (state) => state.wishlist,
    );

  const [isActionLoading, setIsActionLoading] =
    useState(false);

  const [added, setAdded] =
    useState(false);

  // CART CHECK
  const isInCart = useMemo(() => {
    return cartItems.some(
      (item) =>
        item.product_id === product.id ||
        item.product?.id === product.id,
    );
  }, [cartItems, product.id]);

  // WISHLIST CHECK
  const isInWishlist = useMemo(() => {
    return wishlistItems.some(
      (item) =>
        item.product_id === product.id ||
        item.product?.id === product.id,
    );
  }, [wishlistItems, product.id]);

  // PRODUCT IMAGE
  const image =
    product?.images?.find(
      (img) => img.is_primary,
    )?.image_url ||
    product?.images?.[0]?.image_url;

  // DISCOUNT
  const discount =
    product?.discount_price &&
    product?.price
      ? Math.round(
          ((product.price -
            product.discount_price) /
            product.price) *
            100,
        )
      : null;

  // BEST PRICE
  const bestPrice = Math.round(
    Number(
      product?.discount_price ||
        product?.price,
    ) * 0.9,
  );

  // VIEW PRODUCT
  const handleViewProduct = () => {
    navigate(
      `/product/${product.slug}`,
    );
  };

  // ADD TO CART
  const handleAddToCart = async (
    e,
  ) => {
    e.stopPropagation();

    if (
      isActionLoading ||
      isInCart
    )
      return;

    setIsActionLoading(true);

    try {
      await dispatch(
        addToCart({
          product_id: product.id,
          quantity: 1,
        }),
      ).unwrap();

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    } catch (err) {
      console.error(
        "Add to cart failed:",
        err,
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  // ADD TO WISHLIST
  const handleAddToWishlist =
    async (e) => {
      e.stopPropagation();

      if (!user) {
        localStorage.setItem(
          "intended_action",
          JSON.stringify({
            type: "ADD_TO_WISHLIST",
            payload: {
              product_id: product.id,
            },
          }),
        );

        navigate("/login");

        return;
      }

      if (isInWishlist) return;

      try {
        await dispatch(
          addToWishlist({
            product_id: product.id,
          }),
        ).unwrap();
      } catch (err) {
        console.error(
          "Wishlist error:",
          err,
        );
      }
    };
const handleShare = async (e) => {
  e.stopPropagation();

  const shareData = {
    title: product?.name,
    text: product?.name,
    url: `${window.location.origin}/product/${product.slug}`,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Product link copied!");
    }
  } catch (err) {
    console.log("Share cancelled");
  }
}; 

  // LOADING
  if (loading) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
        <div className="h-[200px] sm:h-[240px] bg-gray-200" />

        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />

          <div className="h-4 bg-gray-200 rounded w-1/2" />

          <div className="h-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        group
        bg-white
        rounded-2xl
        border
        border-gray-100
        overflow-hidden
        hover:shadow-xl
        transition-all
        duration-300

        ${
          viewMode === "list"
            ? "flex gap-4 p-4 items-start"
            : ""
        }
      `}
    >
      {/* IMAGE */}
      <div
        onClick={handleViewProduct}
        className={`
          relative
          overflow-hidden
          bg-[#f7f7f7]
          cursor-pointer

          ${
            viewMode === "list"
              ? "w-32 h-32 rounded-2xl flex-shrink-0"
              : `
                h-[180px]
                sm:h-[220px]
                md:h-[250px]
                rounded-t-2xl
              `
          }
        `}
      >
        <img
          src={
            getImageUrl(image) ||
            "/placeholder.jpg"
          }
          alt={product?.name}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* DISCOUNT BADGE */}
        {discount && (
          <div className="absolute top-3 left-3 bg-[#7a1c3d] text-white text-[11px] font-semibold px-2 py-1 rounded-full shadow-lg">
            -{discount}% OFF
          </div>
        )}

        {/* RIGHT ACTIONS */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {/* WISHLIST */}
          <button
            type="button"
            onClick={
              handleAddToWishlist
            }
            disabled={
              isInWishlist
            }
            className="
              w-9
              h-9
              rounded-full
              bg-white/90
              backdrop-blur
              shadow-md
              flex
              items-center
              justify-center
              transition
              hover:bg-[#7a1c3d]
              hover:text-white
            "
          >
            <Heart
              size={16}
              className={
                isInWishlist
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />
          </button>

          {/* VIEW */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProduct();
            }}
            className="
              w-9
              h-9
              rounded-full
              bg-white/90
              backdrop-blur
              shadow-md
              flex
              items-center
              justify-center
              transition
              hover:bg-[#7a1c3d]
              hover:text-white
            "
          >
            <Eye size={16} />
          </button>

          {/* SHARE */}
<button
  type="button"
  onClick={handleShare}
  className="
    w-9
    h-9
    rounded-full
    bg-white/90
    backdrop-blur
    shadow-md
    flex
    items-center
    justify-center
    transition
    hover:bg-[#7a1c3d]
    hover:text-white
  "
>
  <Share2 size={16} />
</button>

        </div>



        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-black/20
            opacity-0
            group-hover:opacity-100
            transition
            duration-300
          "
        />

        {/* DESKTOP ADD TO CART */}
        {viewMode === "grid" && (
          <div
            className="
              hidden
              lg:block
              absolute
              bottom-3
              left-3
              right-3
              translate-y-5
              opacity-0
              group-hover:translate-y-0
              group-hover:opacity-100
              transition-all
              duration-300
              z-20
            "
          >
            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                isActionLoading ||
                isInCart
              }
              className={`
                w-full
                h-11
                rounded-xl
                font-medium
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                transition-all

                ${
                  added
                    ? "bg-green-500 text-white"
                    : isInCart
                      ? "bg-gray-300 text-gray-600"
                      : "bg-white hover:bg-[#7a1c3d] hover:text-white"
                }
              `}
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={16}
                  />

                  {isInCart
                    ? "In Cart"
                    : "Add To Cart"}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div
        className={`
          p-4
          flex
          flex-col
          justify-between
          flex-1

          ${
            viewMode === "list"
              ? "py-1"
              : ""
          }
        `}
      >
        {/* TOP CONTENT */}
        <div>
          {/* CATEGORY */}
          {product?.category
            ?.name && (
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
              {
                product.category
                  .name
              }
            </p>
          )}

          {/* TITLE */}
          <h3
            onClick={
              handleViewProduct
            }
            className="
              text-sm
              md:text-[15px]
              font-semibold
              text-[#2d0f1f]
              leading-snug
              line-clamp-2
              min-h-[42px]
              cursor-pointer
              hover:text-[#7a1c3d]
              transition
            "
          >
            {product?.name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map(
                (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill="currentColor"
                  />
                ),
              )}
            </div>

            <span className="text-[11px] text-gray-500">
              (
              {product?.total_reviews ||
                0}
              )
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-lg md:text-xl font-bold text-[#111]">
              ₹
              {product?.discount_price ||
                product?.price}
            </span>

            {product?.discount_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product?.price}
              </span>
            )}

            {discount && (
              <span className="text-green-600 text-sm font-medium">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* BEST PRICE */}
          {product?.discount_price && (
            <p className="text-[13px] text-green-700 font-medium mt-1">
              Best price ₹
              {bestPrice}
            </p>
          )}
        </div>

        {/* MOBILE ADD TO CART */}
        {viewMode === "grid" && (
          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={
              isActionLoading ||
              isInCart
            }
            className={`
              lg:hidden
              mt-4
              h-11
              rounded-xl
              text-sm
              font-medium
              flex
              items-center
              justify-center
              gap-2
              transition-all

              ${
                added
                  ? "bg-green-500 text-white"
                  : isInCart
                    ? "bg-gray-300 text-gray-600"
                    : "bg-[#7a1c3d] text-white"
              }
            `}
          >
            {added ? (
              <>
                <Check size={16} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart
                  size={16}
                />

                {isInCart
                  ? "In Cart"
                  : "Add To Cart"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
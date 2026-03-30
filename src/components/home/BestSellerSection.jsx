import React from "react";
import useGet from "../../api/hooks/useGet";
import usePost from "../../api/hooks/usePost";
import { getImageUrl } from "../../utils/getImageUrl";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye } from "lucide-react";

const BestSellerSection = () => {
  const navigate = useNavigate();

  // ✅ GET PRODUCTS
  const { data, loading } = useGet("/products/best-sellers");
  const products = data?.data?.slice(0, 8) || [];

  // ✅ ADD TO CART
  const { postData: addToCart } = usePost("/cart/add");

  // ✅ ADD TO WISHLIST
  const { postData: addToWishlist } = usePost("/wishlist");

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      await addToCart({
        product_id: product.id,
        quantity: 1,
      });
      alert("Added to cart ✅");
    } catch {
      alert("Error adding to cart ❌");
    }
  };

  const handleWishlist = async (e, product) => {
    e.stopPropagation();
    try {
      await addToWishlist({
        product_id: product.id,
      });
      alert("Added to wishlist ❤️");
    } catch {
      alert("Error adding to wishlist ❌");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#7a1c3d]">
          Best Sellers
        </h2>
        <p className="text-gray-500 mt-2">
          Discover our most popular products
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">

        {(loading ? Array(8).fill(null) : products).map((item, i) => {
          const image =
            item?.images?.find((img) => img.is_primary)?.image_url ||
            item?.images?.[0]?.image_url;

          const discount =
            item?.discount_price && item?.price
              ? Math.round(
                  ((item.price - item.discount_price) / item.price) * 100
                )
              : null;

          return (
            <div
              key={item?.id || i}
              onClick={() => item && navigate(`/product/${item.slug}`)}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative h-[240px] md:h-[260px] bg-gray-100 flex items-center justify-center overflow-hidden">

                {loading ? (
                  <div className="w-full h-full animate-pulse bg-gray-200" />
                ) : (
                  <img
                    src={getImageUrl(image) || "/placeholder.png"}
                    alt={item.name}
                    className="h-full object-contain transition duration-500 group-hover:scale-110"
                  />
                )}

                {/* DISCOUNT */}
                {!loading && discount && (
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    -{discount}%
                  </span>
                )}

                {/* 🔥 HOVER ACTIONS */}
                {!loading && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">

                    {/* CART */}
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="bg-white p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
                    >
                      <ShoppingCart size={18} />
                    </button>

                    {/* WISHLIST */}
                    <button
                      onClick={(e) => handleWishlist(e, item)}
                      className="bg-white p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
                    >
                      <Heart size={18} />
                    </button>

                    {/* VIEW */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.slug}`);
                      }}
                      className="bg-white p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
                    >
                      <Eye size={18} />
                    </button>

                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="p-4 text-center">

                <h3 className="text-sm font-semibold line-clamp-1">
                  {loading ? "Loading..." : item.name}
                </h3>

                {/* PRICE */}
                {!loading && (
                  <div className="mt-1">
                    <span className="text-[#7a1c3d] font-bold">
                      ₹{item.discount_price || item.price}
                    </span>

                    {item.discount_price && (
                      <span className="text-gray-400 line-through ml-2 text-sm">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                )}

                {/* RATING */}
                {!loading && (
                  <div className="text-yellow-500 text-sm mt-1">
                    ⭐ 4.{Math.floor(Math.random() * 5)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BestSellerSection;
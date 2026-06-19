import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { getImageUrl } from "../../../utils/getImageUrl";
import { addToCart } from "../../../app/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../../app/slices/wishlistSlice";
import toast from "react-hot-toast";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const price = product.discount_price || product.price;
  const originalPrice = product.price;
  const discountPercent = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;
  const primaryImage = product.primary_image || (product.images?.[0]?.image_url);
  const averageRating = product.average_rating || 0;
  const totalReviews = product.total_reviews || 0;
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(
    (item) => item.product_id === product.id || item.product?.id === product.id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    
    dispatch(addToCart({
      product_id: product.id,
      quantity: 1,
      variant_id: null
    })).unwrap()
      .then(() => {
        toast.success("Added to cart!");
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart");
      });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    
    if (isInWishlist) {
      // Remove from wishlist
      dispatch(removeFromWishlist({ product_id: product.id }))
        .unwrap()
        .then(() => {
          toast.success("Removed from wishlist");
        })
        .catch((err) => {
          toast.error("Failed to remove from wishlist");
        });
    } else {
      // Add to wishlist
      dispatch(addToWishlist({ product_id: product.id }))
        .unwrap()
        .then(() => {
          toast.success("Added to wishlist!");
        })
        .catch((err) => {
          toast.error("Failed to add to wishlist");
        });
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <Link to={`/product/${product.slug || product.id}`} className="sm:w-48 h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
            {primaryImage ? (
              <img src={getImageUrl(primaryImage)} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-16 h-16 text-gray-300">🖼️</div>
            )}
          </Link>
          
          {/* Content */}
          <div className="flex-1 p-4">
            <Link to={`/product/${product.slug || product.id}`}>
              <h3 className="font-semibold text-gray-800 hover:text-[#7a1c3d] transition line-clamp-2">{product.name}</h3>
            </Link>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-xs text-gray-500">({totalReviews})</span>
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-[#7a1c3d]">₹{price.toLocaleString()}</span>
              {discountPercent > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                  <span className="text-xs text-green-600 font-medium">{discountPercent}% OFF</span>
                </>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.short_description}</p>
            
            <div className="flex items-center gap-3 mt-4">
              <Link to={`/product/${product.slug || product.id}`} className="flex-1 bg-[#7a1c3d] text-white px-4 py-2 rounded-lg text-center hover:bg-[#5e132f] transition">
                View Details
              </Link>
              <button 
                onClick={handleAddToCart}
                className="p-2 border rounded-lg hover:bg-gray-50 transition"
              >
                <ShoppingBag size={18} className="text-gray-500" />
              </button>
              <button 
                onClick={handleWishlist}
                className="p-2 border rounded-lg hover:bg-gray-50 transition"
              >
                <Heart size={18} className={`${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link to={`/product/${product.slug || product.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
        >
          <Heart size={16} className={isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"} />
        </button>
        {primaryImage ? (
          <img src={getImageUrl(primaryImage)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🖼️</div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-[#7a1c3d] transition line-clamp-2 min-h-[48px]">{product.name}</h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({totalReviews})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2 flex-wrap">
          <span className="text-lg font-bold text-[#7a1c3d]">₹{price.toLocaleString()}</span>
          {discountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.stock > 0 ? (
            product.stock <= 5 ? (
              <span className="text-xs text-orange-600">Only {product.stock} left</span>
            ) : (
              <span className="text-xs text-green-600">In Stock</span>
            )
          ) : (
            <span className="text-xs text-red-600">Out of Stock</span>
          )}
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full mt-3 bg-[#7a1c3d] text-white py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            product.stock <= 0 ? "opacity-50 cursor-not-allowed" : "opacity-0 group-hover:opacity-100 hover:bg-[#5e132f]"
          }`}
        >
          <ShoppingBag size={16} />
          <span className="text-sm">{product.stock <= 0 ? "Out of Stock" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
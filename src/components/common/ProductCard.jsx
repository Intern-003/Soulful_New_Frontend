// src/components/common/ProductCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import { addToCart } from '../../app/slices/cartSlice';
import { addToWishlist } from '../../app/slices/wishlistSlice';

const ProductCard = ({ product, loading = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const image = product?.images?.find((img) => img.is_primary)?.image_url ||
                product?.images?.[0]?.image_url;
  
  const discount = product?.discount_price && product?.price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    
    setIsActionLoading(true);
    try {
      await dispatch(addToCart({
        product_id: product.id,
        quantity: 1
      })).unwrap();
      alert('Added to cart ✅');
    } catch (err) {
      alert('Error adding to cart ❌');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddToWishlist = async (e) => {
    e?.stopPropagation();
    
    if (!isAuthenticated) {
      // Save intended action for after login
      localStorage.setItem('intended_action', JSON.stringify({
        type: 'ADD_TO_WISHLIST',
        payload: { product_id: product.id }
      }));
      alert('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    setIsActionLoading(true);
    try {
      await dispatch(addToWishlist({ product_id: product.id })).unwrap();
      alert('Added to wishlist ❤️');
    } catch (err) {
      alert(err || 'Error adding to wishlist ❌');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewProduct = (e) => {
    e?.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  const isLoading = isActionLoading || cartLoading;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-[240px] bg-gray-200 animate-pulse" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleViewProduct}
      className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
    >
      <div className="relative h-[240px] bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={getImageUrl(image) || '/placeholder.jpg'}
          alt={product?.name}
          className="h-full object-contain transition duration-500 group-hover:scale-110"
        />

        {discount && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="bg-white p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition disabled:opacity-50"
          >
            <ShoppingCart size={18} />
          </button>

          <button
            onClick={handleAddToWishlist}
            disabled={isLoading}
            className="bg-white p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition disabled:opacity-50"
          >
            <Heart size={18} />
          </button>

          <button
            onClick={handleViewProduct}
            className="bg-white p-3 rounded-full hover:bg-[#7a1c3d] hover:text-white transition"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold line-clamp-1">{product?.name}</h3>
        
        <div className="mt-1">
          <span className="text-[#7a1c3d] font-bold">
            ₹{product?.discount_price || product?.price}
          </span>
          {product?.discount_price && (
            <span className="text-gray-400 line-through ml-2 text-sm">
              ₹{product?.price}
            </span>
          )}
        </div>

        <div className="text-yellow-500 text-sm mt-1">
          ⭐ 4.{Math.floor(Math.random() * 5)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
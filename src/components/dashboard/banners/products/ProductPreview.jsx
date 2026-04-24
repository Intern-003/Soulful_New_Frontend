import { useNavigate } from "react-router-dom";
import { getProductImageUrl, getProductPath } from "../../../utils/productHelpers";

const ProductPreview = ({ product, onClick, className = "" }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      navigate(getProductPath(product));
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105 ${className}`}
    >
      {/* Fixed aspect ratio image container */}
      <div className="relative w-full pt-[100%] overflow-hidden">
        <img
          src={getProductImageUrl(product)}
          alt={product?.name || "Product"}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
      </div>
      <div className="p-3">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
          {product?.name || "Unnamed Product"}
        </p>
        <p className="text-sm sm:text-base font-bold text-green-600">
          ₹{Number(product?.price || 0).toLocaleString()}
        </p>
        <button className="mt-2 text-xs text-gray-500 group-hover:text-black transition-colors font-medium inline-flex items-center gap-1">
          View Details
          <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductPreview;
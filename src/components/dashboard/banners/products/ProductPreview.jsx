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
      className={`bg-white rounded-xl shadow p-2 hover:shadow-md transition cursor-pointer ${className}`}
    >
      <img
        src={getProductImageUrl(product)}
        alt={product?.name || "Product"}
        onError={(e) => {
          e.target.src = "/placeholder.jpg";
        }}
        className="w-full h-24 object-cover rounded"
      />
      <div className="mt-2">
        <p className="text-xs font-medium line-clamp-1">
          {product?.name || "No name"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          ₹{product?.price || 0}
        </p>
      </div>
    </div>
  );
};

export default ProductPreview;
import React from "react";

const ProductPreview = ({ product }) => {
  if (!product) return null;

  const getImage = () => {
    const img = product?.primary_image?.image_url;
   if (!img) return "/placeholder.jpg";

    if (img.startsWith("http")) return img;

    return `http://127.0.0.1:8000/storage/${img}`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-2 hover:shadow-md transition">
      {/* Image */}
      <img
        src={getImage()}
        alt={product.name}
        className="w-full h-24 object-cover rounded"
      />

      {/* Info */}
      <div className="mt-2">
        <p className="text-xs font-medium line-clamp-1">
          {product.name}
        </p>
        <p className="text-xs text-gray-500">
          ₹{product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductPreview;
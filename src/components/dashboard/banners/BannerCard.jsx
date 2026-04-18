import BannerLayoutPreview from "./BannerLayoutPreview";
import { getImageUrl } from "../../../utils/getImageUrl";

const BannerCard = ({ banner, onEdit, onDelete }) => {
  const bannerImage = getImageUrl(banner?.image);
  const products = banner?.products || [];

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      onDelete(banner.id);
    }
  };

  return (
    <div className="border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition bg-white">
      {/* Image Section */}
      <div className="relative">
        <img
          src={bannerImage}
          alt={banner?.title || "Banner"}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
          className="w-full h-32 sm:h-40 object-cover rounded-lg sm:rounded-xl"
        />
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
            banner?.status
              ? "bg-green-500 text-white"
              : "bg-gray-400 text-white"
          }`}
        >
          {banner?.status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Info Section */}
      <div className="mt-3">
        <h2 className="font-semibold text-base sm:text-lg">
          {banner?.title || "No Title"}
        </h2>
        {banner?.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {banner.subtitle}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1 capitalize">
          {banner?.layout} • Position: {banner?.position}
        </p>
        {(banner?.start_date || banner?.end_date) && (
          <p className="text-xs text-gray-400 mt-1">
            {banner?.start_date || "Always"} → {banner?.end_date || "No End"}
          </p>
        )}
      </div>

      {/* Preview Section */}
      <div className="mt-3 sm:mt-4">
        <BannerLayoutPreview
          layout={banner?.layout}
          products={products}
          title={banner?.title}
          description={banner?.description}
          image={banner?.image}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-3 sm:mt-4">
        <button
          onClick={() => onEdit(banner)}
          className="px-3 py-1.5 border rounded hover:bg-gray-100 text-sm transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BannerCard;
import BannerLayoutPreview from "./BannerLayoutPreview";
import { getImageUrl } from "../../../utils/getImageUrl";

const BannerCard = ({ banner, onEdit, onDelete }) => {
  const bannerImage = getImageUrl(banner?.image);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    onDelete(banner.id);
  };

  // ✅ USE FULL PRODUCTS (NOT IDs)
  const products = banner?.products || [];

  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white">
      
      {/* IMAGE */}
      <div className="relative">
        <img
          src={bannerImage}
          alt={banner?.title || "Banner"}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
          className="w-full h-40 object-cover rounded-xl"
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

      {/* INFO */}
      <div className="mt-3">
        <h2 className="font-semibold text-lg">
          {banner?.title || "No Title"}
        </h2>

        {banner?.subtitle && (
          <p className="text-sm text-gray-500">
            {banner.subtitle}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-1 capitalize">
          {banner?.layout} • Position: {banner?.position}
        </p>

        {(banner?.start_date || banner?.end_date) && (
          <p className="text-xs text-gray-400 mt-1">
            {banner?.start_date || "Always"} →{" "}
            {banner?.end_date || "No End"}
          </p>
        )}
      </div>

      {/* ✅ FIXED PREVIEW */}
      <div className="mt-4">
        <BannerLayoutPreview
          layout={banner?.layout}
          products={products} // ✅ IMPORTANT FIX
          title={banner?.title}
          description={banner?.description}
          image={banner?.image}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => onEdit(banner)}
          className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BannerCard;
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
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-lg transition bg-white">
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="aspect-[16/6]">
          <img
            src={bannerImage}
            className="w-full h-full object-cover"
          />
        </div>

        <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${banner?.status ? "bg-green-500" : "bg-gray-400"
          } text-white`}>
          {banner?.status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* INFO */}
      <div className="mt-4">
        <h2 className="font-semibold text-lg">{banner?.title}</h2>

        {banner?.subtitle && (
          <p className="text-sm text-gray-500">{banner.subtitle}</p>
        )}

        <p className="text-xs text-gray-400 mt-1 capitalize">
          {banner?.layout} • Position {banner?.position}
        </p>
      </div>

      {/* PREVIEW */}
      <div className="mt-4">
        <BannerLayoutPreview {...banner} products={products} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 mt-4">
        <button className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 text-sm">
          Edit
        </button>
        <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
          Delete
        </button>
      </div>

    </div>
  );
};

export default BannerCard;
import BannerCard from "./BannerCard";

const BannerList = ({
  banners = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  // ================= NORMALIZE =================
  const safeBanners = Array.isArray(banners)
    ? banners
    : banners?.data || [];

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse border rounded-xl p-4 space-y-3"
          >
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
            <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // ================= EMPTY =================
  if (!safeBanners.length) {
    return (
      <div className="text-center py-12 text-gray-500 border rounded-xl">
        No banners found
      </div>
    );
  }

  // ================= LIST =================
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {safeBanners.map((banner) => {
        if (!banner?.id) return null;

        return (
          <BannerCard
            key={banner.id}
            banner={banner}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default BannerList;
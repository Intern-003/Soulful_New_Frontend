import { useMemo } from "react";
import useGet from "../../../api/hooks/useGet";
import { getImageUrl } from "../../../utils/getImageUrl";

const BannerLayoutPreview = ({
  layout = "grid",
  productIds = [],
  title,
  description,
  image,
}) => {
  const { data } = useGet("/admin/products");

  const allProducts = useMemo(() => {
    if (Array.isArray(data?.data?.data)) return data.data.data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

const products = useMemo(() => {
  if (!productIds?.length || !allProducts.length) return [];

  return productIds
    .map((id) =>
      allProducts.find((p) => Number(p.id) === Number(id))
    )
    .filter(Boolean);
}, [productIds, allProducts]);
console.log("ALL PRODUCTS:", allProducts);
console.log("IDS:", productIds);

//   const getSafeImage = (p) => {
//     const url = getImageUrl(p?.primary_image?.image_url);
//     return url || "/placeholder.jpg";
//   };
const getSafeImage = (p) => {
  if (!p) return "/placeholder.jpg";

  const primary = p.images?.find((img) => img.is_primary);
  const imgPath = primary?.image_url || p.images?.[0]?.image_url;

  return imgPath ? getImageUrl(imgPath) : "/placeholder.jpg";
};

//   const bannerImage = image
//     ? typeof image === "string"
//       ? getImageUrl(image)
//       : URL.createObjectURL(image)
//     : "/placeholder.jpg";
const bannerImage = (() => {
  if (!image) return "/placeholder.jpg";

  // ✅ if already full URL or blob → use directly
  if (image.startsWith("http") || image.startsWith("blob:")) {
    return image;
  }

  // ✅ otherwise it's backend path
  return getImageUrl(image);
})();

  if (!products.length) {
    return (
      <div className="border p-6 text-center text-gray-500 rounded-xl">
        No preview available
      </div>
    );
  }

  // ================= GRID =================
  if (layout === "grid") {
    return (
      <div
        className="rounded-2xl p-6 relative text-white"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

        <div className="relative grid grid-cols-2 gap-4 items-center">
          {/* Left Text */}
          <div>
            <h2 className="text-2xl font-bold">{title || "Banner Title"}</h2>
            <p className="text-sm mt-2">
              {description || "Banner description"}
            </p>

            <button className="mt-4 px-4 py-2 bg-white text-black rounded">
              Shop Now
            </button>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-2 text-black">
                <img
                  src={getSafeImage(p)}
                  className="h-20 w-full object-cover rounded"
                />
                <p className="text-xs mt-1">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= HIGHLIGHT =================
  if (layout === "highlight") {
    const p = products[0];

    return (
      <div
        className="rounded-2xl p-6 flex items-center gap-6 text-white"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

        {/* Left */}
        <div className="relative flex-1">
          <h2 className="text-3xl font-bold">
            {title || "Featured Product"}
          </h2>
          <p className="mt-2">
            {description || "Premium quality products"}
          </p>

          <button className="mt-4 px-4 py-2 bg-white text-black rounded">
            Shop Now
          </button>
        </div>

        {/* Product */}
        <div className="relative w-48 bg-white p-2 rounded-xl text-black">
          <img
            src={getSafeImage(p)}
            className="h-32 w-full object-cover rounded"
          />
          <p className="mt-2 font-medium">{p.name}</p>
        </div>
      </div>
    );
  }

  // ================= CAROUSEL =================
  if (layout === "carousel") {
    return (
      <div
        className="rounded-2xl p-6 text-white"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

        <div className="relative">
          <h2 className="text-2xl font-bold">
            {title || "Trending Products"}
          </h2>
          <p className="text-sm mb-4">
            {description || "Explore latest items"}
          </p>

          <div className="flex gap-3 overflow-x-auto">
            {products.map((p) => (
              <div
                key={p.id}
                className="min-w-[140px] bg-white text-black p-2 rounded-xl"
              >
                <img
                  src={getSafeImage(p)}
                  className="h-24 w-full object-cover rounded"
                />
                <p className="text-xs mt-1">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BannerLayoutPreview;
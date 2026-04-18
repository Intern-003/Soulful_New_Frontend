import { useNavigate } from "react-router-dom";
import { getProductImageUrl, getProductPath, getBannerImageUrl } from "../../../utils/productHelpers";

const BannerLayoutPreview = ({ layout = "grid", products = [], title, description, image }) => {
  const navigate = useNavigate();
  const bannerImage = getBannerImageUrl(image);

  // Empty state
  if (!products.length && layout !== "highlight") {
    return (
      <div className="border p-4 sm:p-6 text-center text-gray-500 rounded-lg sm:rounded-xl bg-gray-50">
        No products selected
      </div>
    );
  }

  // ================= GRID LAYOUT =================
  // Products on the RIGHT side of banner
  if (layout === "grid") {
    return (
      <div className="relative rounded-lg sm:rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
        {/* Banner Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
        </div>

        {/* Content - LEFT side text, RIGHT side products */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col md:flex-row items-center justify-between gap-6">
          {/* LEFT SIDE - Text Section */}
          <div className="text-white flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
              {title || "Banner Title"}
            </h2>
            <p className="text-sm sm:text-base opacity-95 drop-shadow max-w-md">
              {description || "Banner description"}
            </p>
          </div>

          {/* RIGHT SIDE - Products Grid */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(getProductPath(product))}
                  className="group cursor-pointer rounded-lg overflow-hidden transition hover:scale-[1.02] shadow-lg bg-white/95 backdrop-blur-sm hover:bg-white"
                >
                  <div className="flex items-center gap-2 p-2 sm:p-3">
                    <img
                      src={getProductImageUrl(product)}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-md"
                      alt={product.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 font-medium">
                        ₹{Number(product.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= HIGHLIGHT LAYOUT =================
  // Product in TOP RIGHT corner
  if (layout === "highlight") {
    const product = products[0];

    if (!product) {
      return (
        <div className="border p-4 sm:p-6 text-center text-gray-500 rounded-lg sm:rounded-xl bg-gray-50">
          No product selected
        </div>
      );
    }

    return (
      <div className="relative rounded-lg sm:rounded-2xl overflow-hidden min-h-[350px] sm:min-h-[400px] md:min-h-[450px]">
        {/* Banner Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full">
          {/* Product Card - TOP RIGHT CORNER */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 md:w-96">
              <div
                onClick={() => navigate(getProductPath(product))}
                className="bg-white rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition shadow-2xl"
              >
                <div className="flex gap-3 p-3 sm:p-4">
                  <img
                    src={getProductImageUrl(product)}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                    alt={product.name}
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 line-clamp-2 text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-green-600 mt-2">
                      ₹{Number(product.price || 0).toLocaleString()}
                    </p>
                    <button className="mt-2 text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Text - BOTTOM LEFT CORNER */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 max-w-md">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {title || "Featured Offer"}
            </h2>
            <p className="text-sm sm:text-base text-white/90 drop-shadow">
              {description || "Special deal just for you"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= CAROUSEL LAYOUT =================
  // Products at the BOTTOM of banner
  if (layout === "carousel") {
    return (
      <div className="relative rounded-lg sm:rounded-2xl overflow-hidden min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
        {/* Banner Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex flex-col justify-between">
          {/* Text Section - TOP */}
          <div className="text-white text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
              {title || "Shop Our Collection"}
            </h2>
            <p className="text-sm sm:text-base opacity-95 drop-shadow max-w-2xl">
              {description || "Browse our featured products"}
            </p>
          </div>

          {/* Products Carousel - BOTTOM */}
          <div className="mt-auto">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(getProductPath(product))}
                  className="min-w-[130px] sm:min-w-[150px] md:min-w-[170px] lg:min-w-[190px] flex-shrink-0 cursor-pointer rounded-lg overflow-hidden bg-white shadow-xl hover:shadow-2xl transition hover:scale-[1.02]"
                >
                  <img
                    src={getProductImageUrl(product)}
                    className="h-24 sm:h-28 md:h-32 w-full object-cover"
                    alt={product.name}
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div className="p-2 sm:p-3">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-sm sm:text-base font-bold text-green-600 mt-1 sm:mt-2">
                      ₹{Number(product.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BannerLayoutPreview;
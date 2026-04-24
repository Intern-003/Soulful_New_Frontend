import { useNavigate } from "react-router-dom";
import { getProductImageUrl, getProductPath, getBannerImageUrl } from "../../../utils/productHelpers";

const BannerLayoutPreview = ({ layout = "grid", products = [], title, description, image }) => {
  const navigate = useNavigate();
  const bannerImage = getBannerImageUrl(image);

  // Empty state
  if (!products.length && layout !== "highlight") {
    return (
      <div className="border-2 border-dashed border-gray-200 p-8 sm:p-12 text-center text-gray-400 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">No products selected</p>
        <p className="text-xs mt-1">Select products to display in this banner</p>
      </div>
    );
  }

  // ================= GRID LAYOUT =================
  if (layout === "grid") {
    return (
      <div className="relative rounded-xl overflow-hidden group min-h-[400px] md:min-h-[450px] lg:min-h-[500px] shadow-lg">
        {/* Banner Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* LEFT SIDE - Text Section */}
          <div className="text-white flex-1 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg leading-tight">
              {title || "Banner Title"}
            </h2>
            <p className="text-sm sm:text-base opacity-95 drop-shadow max-w-md mx-auto lg:mx-0">
              {description || "Discover our amazing collection"}
            </p>
          </div>

          {/* RIGHT SIDE - Products Grid - SQUARE IMAGES */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(getProductPath(product))}
                  className="group/item cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-105"
                >
                  {/* SQUARE IMAGE - 1:1 Aspect Ratio */}
                  <div className="relative w-full pt-[100%]">
                    <img
                      src={getProductImageUrl(product)}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={product.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  </div>
                  <div className="p-2 sm:p-3">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                      {product.name}
                    </p>
                    <p className="text-sm sm:text-base font-bold text-green-600">
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

  // ================= HIGHLIGHT LAYOUT - SQUARE IMAGE NOW =================
  if (layout === "highlight") {
    const product = products[0];

    if (!product) {
      return (
        <div className="border-2 border-dashed border-gray-200 p-8 text-center text-gray-400 rounded-2xl bg-gray-50">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No product selected for highlight layout</p>
        </div>
      );
    }

    return (
      <div className="relative rounded-xl overflow-hidden group min-h-[450px] md:min-h-[500px] lg:min-h-[550px] shadow-lg">
        {/* Banner Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full">
          {/* Product Card - TOP RIGHT - SQUARE IMAGE */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 md:w-96">
              <div
                onClick={() => navigate(getProductPath(product))}
                className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
              >
                {/* SQUARE IMAGE - Same as grid and carousel */}
                <div className="relative w-full pt-[100%]">
                  <img
                    src={getProductImageUrl(product)}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={product.name}
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-gray-800 line-clamp-2 text-sm sm:text-base mb-2">
                    {product.name}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-green-600 mb-2">
                    ₹{Number(product.price || 0).toLocaleString()}
                  </p>
                  <button className="text-xs bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition w-full">
                    Shop Now →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Text - BOTTOM LEFT */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 max-w-md">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg leading-tight">
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
  if (layout === "carousel") {
    return (
      <div className="relative rounded-xl overflow-hidden group min-h-[450px] md:min-h-[500px] lg:min-h-[550px] shadow-lg">
        {/* Banner Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex flex-col justify-between">
          {/* Text Section - TOP */}
          <div className="text-white text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg leading-tight">
              {title || "Shop Our Collection"}
            </h2>
            <p className="text-sm sm:text-base opacity-95 drop-shadow max-w-2xl mx-auto">
              {description || "Browse our featured products"}
            </p>
          </div>

          {/* Products Carousel - BOTTOM - SQUARE IMAGES */}
          <div className="mt-auto pt-6">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(getProductPath(product))}
                  className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] flex-shrink-0 cursor-pointer rounded-xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 snap-start"
                >
                  {/* SQUARE IMAGE - 1:1 Aspect Ratio */}
                  <div className="relative w-full pt-[100%]">
                    <img
                      src={getProductImageUrl(product)}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={product.name}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  </div>
                  <div className="p-2 sm:p-3">
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                      {product.name}
                    </p>
                    <p className="text-sm sm:text-base font-bold text-green-600">
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
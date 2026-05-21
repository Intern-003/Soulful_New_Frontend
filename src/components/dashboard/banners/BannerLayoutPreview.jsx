// FILE: src/components/dashboard/banners/BannerLayoutPreview.jsx

import React, { memo, useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../../utils/getImageUrl";

const getProductImageUrl = (product) => {
  let imagePath = null;
  
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.is_primary === 1) || product.images[0];
    if (primaryImage?.image_url) {
      imagePath = primaryImage.image_url;
    }
  }
  
  return getImageUrl(imagePath);
};

const price = (value) => `₹${Number(value || 0).toLocaleString()}`;

const ProductCard = ({ item, onClick }) => {
  const imageUrl = getProductImageUrl(item);
  
  return (
    <div 
      onClick={onClick}
      className="rounded-2xl bg-white p-3 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all hover:scale-105 flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
    >
      <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={item?.name}
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
        />
      </div>
      <p className="mt-2 text-xs font-semibold line-clamp-2 text-slate-800">
        {item?.name || "Product"}
      </p>
      <p className="mt-1 text-xs font-bold text-emerald-600">
        {price(item?.price)}
      </p>
    </div>
  );
};

// Horizontal Scroll Carousel Component
const HorizontalScrollCarousel = ({ products }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const carouselRef = useRef(null);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        carousel.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [products]);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  if (!products.length) return null;

  return (
    <div className="relative w-full">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
      )}
      
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start">
            <ProductCard item={product} />
          </div>
        ))}
      </div>
      
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      )}
    </div>
  );
};

const BannerLayoutPreview = ({ banner }) => {
  if (!banner) return null;

  const getValidLinkUrl = (link) => {
    if (!link) return "#";
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    }
    if (link.startsWith('/')) {
      return link;
    }
    return `/${link}`;
  };

  const title = banner?.title || "Banner Title";
  const subtitle = banner?.subtitle || "Promotional campaign";
  const layout = (banner?.layout || "hero").toLowerCase();
  const imageUrl = banner?.image || "";
  const buttonText = banner?.button_text?.trim() || "Shop Now";
  const buttonLink = getValidLinkUrl(banner?.button_link);
  const products = Array.isArray(banner?.products) ? banner.products : [];

  // ========== HERO LAYOUT ==========
  if (layout === "hero") {
    return (
      <div className="overflow-hidden rounded-3xl border shadow-sm relative">
        <div className="aspect-[16/7]">
          <img
            src={imageUrl || "/placeholder.jpg"}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
          />
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-6 md:px-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
          <p className="mt-3 text-sm text-white/90 max-w-md">{subtitle}</p>
          <a
            href={buttonLink}
            target={banner?.button_link?.startsWith('http') ? "_blank" : "_self"}
            rel={banner?.button_link?.startsWith('http') ? "noopener noreferrer" : ""}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-gray-100 transition-colors"
          >
            {buttonText}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  // ========== GRID LAYOUT ==========
  if (layout === "grid") {
    return (
      <div className="overflow-hidden rounded-3xl border shadow-sm relative min-h-[400px]">
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative z-10 flex items-center min-h-[400px]">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white flex-1 text-center lg:text-left max-w-xl">
                <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-4">
                  {title}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {subtitle}
                </h2>
                <p className="text-sm md:text-base text-white/90 mb-6">
                  {banner?.description || "Discover our exclusive collection"}
                </p>
                <a
                  href={buttonLink}
                  target={banner?.button_link?.startsWith('http') ? "_blank" : "_self"}
                  rel={banner?.button_link?.startsWith('http') ? "noopener noreferrer" : ""}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-gray-100 transition-colors"
                >
                  {buttonText}
                  <ArrowRight size={16} />
                </a>
              </div>
              
              {products.length > 0 && (
                <div className="w-full lg:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    {products.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} item={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== PRODUCTS LAYOUT ==========
  if (layout === "products") {
    return (
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm p-6">
        <div className="text-center mb-6">
          <span className="inline-block bg-[#7a1c3d]/10 px-4 py-1.5 rounded-full text-xs font-semibold text-[#7a1c3d] mb-3">
            {title || "Featured Products"}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{subtitle}</h2>
          {banner?.description && (
            <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">{banner.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
        
        {buttonText && buttonLink !== "#" && (
          <div className="text-center mt-6">
            <a
              href={buttonLink}
              target={banner?.button_link?.startsWith('http') ? "_blank" : "_self"}
              rel={banner?.button_link?.startsWith('http') ? "noopener noreferrer" : ""}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#7a1c3d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5e1530] transition-colors"
            >
              {buttonText}
              <ArrowRight size={16} />
            </a>
          </div>
        )}
      </div>
    );
  }

  // ========== SPLIT LAYOUT (No products) ==========
  if (layout === "split") {
    return (
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm grid md:grid-cols-2">
        <div className="aspect-[4/3] md:aspect-auto min-h-[300px]">
          <img
            src={imageUrl || "/placeholder.jpg"}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-8">
          <span className="mb-3 w-fit rounded-full bg-[#7a1c3d]/10 px-3 py-1 text-xs font-semibold text-[#7a1c3d]">
            {title}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{subtitle}</h2>
          <p className="mt-3 text-sm text-slate-500">{banner?.description}</p>
          <a
            href={buttonLink}
            target={banner?.button_link?.startsWith('http') ? "_blank" : "_self"}
            rel={banner?.button_link?.startsWith('http') ? "noopener noreferrer" : ""}
            className="mt-6 w-fit rounded-2xl bg-[#7a1c3d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5e1530] transition-colors"
          >
            {buttonText}
          </a>
        </div>
      </div>
    );
  }

  // ========== SLIDER / CAROUSEL LAYOUT ==========
  if (layout === "slider" || layout === "carousel") {
    return (
      <div className="overflow-hidden rounded-3xl border shadow-sm relative min-h-[500px]">
        <img
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative z-10 flex flex-col justify-between min-h-[500px] p-6 md:p-8">
          <div className="text-white text-center max-w-2xl mx-auto mt-8 md:mt-12">
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-3">
              {title}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{subtitle}</h2>
            <p className="text-sm text-white/90">{banner?.description}</p>
            <a
              href={buttonLink}
              target={banner?.button_link?.startsWith('http') ? "_blank" : "_self"}
              rel={banner?.button_link?.startsWith('http') ? "noopener noreferrer" : ""}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2 mt-4 text-sm font-semibold text-slate-900 hover:bg-gray-100 transition-colors"
            >
              {buttonText}
              <ArrowRight size={14} />
            </a>
          </div>
          
          {products.length > 0 && (
            <div className="mt-auto pt-8 pb-4">
              <HorizontalScrollCarousel products={products} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-white p-10 text-center text-slate-400">
      Unsupported layout: {layout}
    </div>
  );
};

export default memo(BannerLayoutPreview);
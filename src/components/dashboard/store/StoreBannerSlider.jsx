import React, {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";

const AUTO_SLIDE_INTERVAL = 5000;

const StoreBannerSlider = ({
  banners = [],
  themeColor = "#7a1c3d",
}) => {
  const [activeIndex, setActiveIndex] =
    useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex(
        (prev) =>
          (prev + 1) %
          banners.length
      );
    }, AUTO_SLIDE_INTERVAL);

    return () =>
      clearInterval(timer);
  }, [banners]);

  if (!banners?.length) {
    return null;
  }

  const nextSlide = () => {
    setActiveIndex(
      (prev) =>
        (prev + 1) %
        banners.length
    );
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) =>
        prev === 0
          ? banners.length - 1
          : prev - 1
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 mt-6">

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          shadow-sm
          bg-white
        "
      >
        {/* Slides */}

        <div
          className="
            relative
            h-[180px]
            sm:h-[220px]
            md:h-[280px]
            lg:h-[320px]
          "
        >
          {banners.map(
            (
              banner,
              index
            ) => (
              <div
                key={
                  banner.id
                }
                className={`
                  absolute
                  inset-0
                  transition-opacity
                  duration-700

                  ${
                    activeIndex ===
                    index
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }
                `}
              >
                <img
                  src={getImageUrl(
                    banner.image
                  )}
                  alt={
                    banner.title ||
                    "Banner"
                  }
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

                {/* Overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-black/60
                    via-black/30
                    to-transparent
                  "
                />

                {/* Content */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                  "
                >
                  <div
                    className="
                      px-5
                      md:px-10
                      max-w-xl
                      text-white
                    "
                  >
                    {banner.title && (
                      <h2
                        className="
                          text-lg
                          md:text-3xl
                          font-bold
                          leading-tight
                        "
                      >
                        {banner.title}
                      </h2>
                    )}

                    {banner.button_text &&
                      banner.button_link && (
                        <a
                          href={
                            banner.button_link
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                            inline-flex
                            items-center
                            mt-4
                            px-5
                            py-2.5
                            rounded-xl
                            text-white
                            text-sm
                            font-semibold
                            shadow-lg
                            transition-all
                            hover:scale-105
                          "
                          style={{
                            backgroundColor:
                              themeColor,
                          }}
                        >
                          {
                            banner.button_text
                          }
                        </a>
                      )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Navigation */}

        {banners.length > 1 && (
          <>
            <button
              onClick={
                prevSlide
              }
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                z-20

                w-9
                h-9

                rounded-full

                bg-white/90

                flex
                items-center
                justify-center

                shadow
              "
            >
              <ChevronLeft
                size={18}
              />
            </button>

            <button
              onClick={
                nextSlide
              }
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                z-20

                w-9
                h-9

                rounded-full

                bg-white/90

                flex
                items-center
                justify-center

                shadow
              "
            >
              <ChevronRight
                size={18}
              />
            </button>
          </>
        )}

        {/* Indicators */}

        {banners.length > 1 && (
          <div
            className="
              absolute
              bottom-4
              left-1/2
              -translate-x-1/2

              flex
              gap-2

              z-20
            "
          >
            {banners.map(
              (
                _,
                index
              ) => (
                <button
                  key={
                    index
                  }
                  onClick={() =>
                    setActiveIndex(
                      index
                    )
                  }
                  className="
                    h-2
                    rounded-full
                    transition-all
                  "
                  style={{
                    width:
                      activeIndex ===
                      index
                        ? "28px"
                        : "8px",

                    backgroundColor:
                      activeIndex ===
                      index
                        ? themeColor
                        : "rgba(255,255,255,0.65)",
                  }}
                />
              )
            )}
          </div>
        )}

      </div>

    </section>
  );
};

export default StoreBannerSlider;
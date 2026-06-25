import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

const StoreNavigation = ({
  themeColor = "#7a1c3d",
}) => {
  const [active, setActive] =
    useState("products");

  const sections =
    useMemo(
      () => [
        {
          id: "products",
          label: "Products",
        },
        {
          id: "reviews",
          label: "Reviews",
        },
        {
          id: "about",
          label: "About",
        },
      ],
      []
    );

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                setActive(
                  entry.target.id
                );
              }
            }
          );
        },
        {
          rootMargin:
            "-150px 0px -60% 0px",
          threshold: 0.1,
        }
      );

    sections.forEach(
      (section) => {
        const element =
          document.getElementById(
            section.id
          );

        if (element) {
          observer.observe(
            element
          );
        }
      }
    );

    return () =>
      observer.disconnect();
  }, [sections]);

  const scrollToSection = (
    id
  ) => {
    const element =
      document.getElementById(
        id
      );

    if (!element) return;

    const offset = 90;

    const position =
      element.getBoundingClientRect()
        .top +
      window.pageYOffset -
      offset;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  return (
<section
  className="
    sticky
    top-0
    z-40

    mt-4

    bg-white/95
    backdrop-blur-md

    border
    border-slate-200

    rounded-2xl

    shadow-sm
  "
>   
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className="
            flex
            items-center

            gap-2

            overflow-x-auto
            scrollbar-hide

            py-3
          "
        >
          {sections.map(
            (section) => {
              const isActive =
                active ===
                section.id;

              return (
                <button
                  key={
                    section.id
                  }
                  onClick={() =>
                    scrollToSection(
                      section.id
                    )
                  }
                  className="
                    relative

                    shrink-0

                    px-4
                    py-2

                    rounded-xl

                    text-sm
                    font-semibold

                    transition-all
                    duration-200
                  "
                  style={
                    isActive
                      ? {
                          background:
                            `${themeColor}15`,
                          color:
                            themeColor,
                        }
                      : {
                          color:
                            "#475569",
                        }
                  }
                >
                  {
                    section.label
                  }

                  {isActive && (
                    <span
                      className="
                        absolute

                        left-1/2
                        bottom-0

                        h-[3px]
                        w-8

                        -translate-x-1/2

                        rounded-full
                      "
                      style={{
                        background:
                          themeColor,
                      }}
                    />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};

export default StoreNavigation;
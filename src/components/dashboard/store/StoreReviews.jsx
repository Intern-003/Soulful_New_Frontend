import React from "react";

import {
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

const ReviewStars = ({
  rating,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map(
        (_, index) => (
          <FaStar
            key={index}
            size={14}
            className={
              index < rating
                ? "text-yellow-400"
                : "text-slate-300"
            }
          />
        )
      )}
    </div>
  );
};

const RatingBar = ({
  star,
  count,
  total,
  themeColor,
}) => {
  const percentage =
    total > 0
      ? (count / total) * 100
      : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 text-sm font-medium text-slate-700">
        {star}★
      </div>

      <div
        className="
          flex-1
          h-2.5
          bg-slate-100
          rounded-full
          overflow-hidden
        "
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            background:
              themeColor,
          }}
        />
      </div>

      <div
        className="
          w-8
          text-right
          text-sm
          text-slate-500
        "
      >
        {count}
      </div>
    </div>
  );
};

const ReviewCard = ({
  review,
}) => {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-5
        hover:shadow-md
        transition-all
      "
    >
      <div className="flex items-center justify-between gap-3">

        <div>
          <ReviewStars
            rating={
              review.rating
            }
          />
        </div>

        <span
          className="
            text-xs
            text-slate-400
          "
        >
          {new Date(
            review.created_at
          ).toLocaleDateString()}
        </span>

      </div>

      {review.title && (
        <h3
          className="
            mt-4
            text-base
            font-semibold
            text-slate-900
          "
        >
          {review.title}
        </h3>
      )}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          mt-2
        "
      >
        <span
          className="
            font-medium
            text-slate-800
            text-sm
          "
        >
          {review.user?.name}
        </span>

        {review.verified_purchase && (
          <span
            className="
              inline-flex
              items-center
              gap-1
              text-green-600
              text-xs
              font-medium
            "
          >
            <FaCheckCircle />
            Verified Purchase
          </span>
        )}
      </div>

      {review.product?.name && (
        <div
          className="
            mt-2
            text-xs
            text-slate-500
          "
        >
          Product:
          {" "}
          <span className="font-medium">
            {review.product.name}
          </span>
        </div>
      )}

      <p
        className="
          mt-4
          text-slate-600
          leading-7
        "
      >
        {review.review}
      </p>
    </div>
  );
};

const StoreReviews = ({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  ratingBreakdown = {},
  themeColor = "#7a1c3d",
}) => {
  if (
    !reviews.length &&
    totalReviews === 0
  ) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          overflow-hidden
        "
      >
        <div
          className="
            px-6
            py-5
            border-b
            border-slate-100
          "
        >
          <h2
            className="
              text-xl
              md:text-2xl
              font-bold
              text-slate-900
            "
          >
            Customer Reviews
          </h2>
        </div>

        <div
          className="
            grid
            lg:grid-cols-[320px_1fr]
          "
        >
          {/* LEFT PANEL */}

          <div
            className="
              p-6
              border-b
              lg:border-b-0
              lg:border-r
              border-slate-100
            "
          >
            <div className="text-center">

              <div
                className="
                  text-5xl
                  font-bold
                "
                style={{
                  color: themeColor,
                }}
              >
                {averageRating}
              </div>

              <div className="mt-3 flex justify-center">
                <ReviewStars
                  rating={Math.round(
                    averageRating
                  )}
                />
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  text-slate-500
                "
              >
                Based on{" "}
                {totalReviews} reviews
              </p>

            </div>

            <div className="mt-8 space-y-3">

              {[5, 4, 3, 2, 1].map(
                (star) => (
                  <RatingBar
                    key={star}
                    star={star}
                    count={
                      ratingBreakdown[
                        star
                      ] || 0
                    }
                    total={
                      totalReviews
                    }
                    themeColor={
                      themeColor
                    }
                  />
                )
              )}

            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="p-6">

            <div className="space-y-5">

              {reviews.map(
                (review) => (
                  <ReviewCard
                    key={
                      review.id
                    }
                    review={
                      review
                    }
                  />
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default StoreReviews; 
import React, { useState, useRef } from "react";
import { CheckCircle, Package, ChevronDown, Trash2 } from "lucide-react";
import usePost from "../../api/hooks/usePost";
import useDelete from "../../api/hooks/useDelete";

const ProductTabs = ({ product }) => {
  const [openTabs, setOpenTabs] = useState([]);

  const specs = product?.specifications || [];

  const half = Math.ceil(specs.length / 2);

  const leftSpecs = specs.slice(0, half);
  const rightSpecs = specs.slice(half);

  const [reviewForm, setReviewForm] = useState({
    rating: 4,
    title: "",
    review: "",
    name: "",
    email: "",
  });

  const { postData, loading } = usePost("/reviews");
  const { deleteData, loading: deleteLoading } = useDelete();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  const totalReviews = product?.reviews?.length || 0;

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = product?.reviews?.slice(startIndex, endIndex);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        product_id: product.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        review: reviewForm.review,
      };

      await postData(payload);

      alert("Review submitted successfully ✅");

      // reset form
      setReviewForm({
        rating: 5,
        title: "",
        review: "",
        name: "",
        email: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit review ❌");
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    try {
      await deleteData({ url: `/reviews/${reviewId}` });

      product.reviews = product.reviews.filter((r) => r.id !== reviewId);

      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Delete failed ❌");
    }
  };

  const toggleTab = (tab) => {
    setOpenTabs((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab],
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 space-y-6">
      {/* ---------- ITEM ---------- */}
      {[
        { key: "description", title: "Product Description" },
        { key: "specifications", title: "All Specifications" },
        {
          key: "reviews",
          title: `Customer Reviews (${product?.reviews?.length || 0})`,
        },
      ].map((item) => (
        <div key={item.key} className="transition-all duration-300">
          {/* HEADER */}
          <button
            onClick={() => toggleTab(item.key)}
            className="w-full flex justify-between items-center py-4 text-left font-semibold text-[#7a1c3d] cursor-pointer"
          >
            {item.title}

            <ChevronDown
              className={`transition-transform duration-300 ${
                openTabs.includes(item.key) ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ANIMATED CONTENT */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              openTabs.includes(item.key)
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="pb-6 text-gray-600">
                {/* DESCRIPTION */}
                {item.key === "description" && (
                  <>
                    <h2 className="text-lg font-semibold mb-4 text-black">
                      Product Overview
                    </h2>

                    <p className="mb-6 text-sm md:text-base">
                      {product?.description || "No description available"}
                    </p>
                  </>
                )}

                {/* SPECIFICATIONS */}
                {item.key === "specifications" && (
                  <div className="px-2 py-2 md:px-3 md:py-3">
                    <div className="grid md:grid-cols-2 gap-10 text-sm">
                      {/* LEFT */}
                      <div>
                        <h3 className="font-semibold text-black mb-4">
                          Specifications
                        </h3>

                        <div className="space-y-4">
                          {leftSpecs.length > 0 ? (
                            leftSpecs.map((spec, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center border-b border-gray-300 pb-3"
                              >
                                <span className="font-medium text-[#7a1c3d]">
                                  {spec.name}
                                </span>
                                <span className="text-gray-700 text-right">
                                  {spec.value}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">
                              No specifications available
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div>
                        <h3 className="font-semibold text-black mb-4 opacity-0">
                          Hidden Title
                        </h3>

                        <div className="space-y-4">
                          {rightSpecs.map((spec, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center border-b border-gray-300 pb-3"
                            >
                              <span className="font-medium text-[#7a1c3d]">
                                {spec.name}
                              </span>
                              <span className="text-gray-700 text-right">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* REVIEWS */}
                {item.key === "reviews" && (
                  <div className="space-y-10">
                    {/* SUMMARY */}
                    <div className="bg-[#f6f1f3] rounded-2xl p-6 md:p-8 grid md:grid-cols-[300px_1fr] gap-8">
                      {/* LEFT */}
                      <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold text-[#7a1c3d]">
                          {product?.reviews?.length
                            ? (
                                product.reviews.reduce(
                                  (acc, r) => acc + r.rating,
                                  0,
                                ) / product.reviews.length
                              ).toFixed(1)
                            : "0.0"}
                        </h2>

                        <div className="text-yellow-400 text-lg mt-2">
                          {"★".repeat(
                            Math.round(
                              product?.reviews?.length
                                ? product.reviews.reduce(
                                    (a, r) => a + r.rating,
                                    0,
                                  ) / product.reviews.length
                                : 0,
                            ),
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          Based on {product?.reviews?.length || 0} reviews
                        </p>
                      </div>

                      {/* RIGHT - Rating bars */}
                      <div className="space-y-3 text-sm">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count =
                            product?.reviews?.filter((r) => r.rating === star)
                              .length || 0;

                          const percent =
                            product?.reviews?.length > 0
                              ? (count / product.reviews.length) * 100
                              : 0;

                          return (
                            <div key={star} className="flex items-center gap-3">
                              <span className="w-14 text-gray-600">
                                {star} star
                              </span>

                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-yellow-400 rounded-full"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>

                              <span className="w-6 text-right text-gray-600 text-xs">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* REVIEWS LIST */}
                    <div className="space-y-6">
                      {currentReviews?.length > 0 ? (
                        currentReviews.map((review, i) => (
                          <div
                            key={i}
                            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                <img
                                  src="https://i.pravatar.cc"
                                  className="w-10 h-10 rounded-full"
                                />

                                <div>
                                  <p className="font-medium text-sm">
                                    {review.user?.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      review.created_at,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-yellow-400 text-sm">
                                  {"★".repeat(review.rating)}
                                </div>

                                {/* DELETE ICON */}
                                {currentUser &&
                                  review.user_id === currentUser.id && (
                                    <Trash2
                                      onClick={() => handleDelete(review.id)}
                                      className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
                                    />
                                  )}
                              </div>
                            </div>

                            <h4 className="font-semibold mt-4 text-[#7a1c3d]">
                              {review.title}
                            </h4>

                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                              {review.review}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">
                          No reviews yet
                        </p>
                      )}
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-2 mt-6 mr-6">
                          {/* PREV */}
                          <button
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                          >
                            Prev
                          </button>

                          {/* PAGE NUMBERS */}
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`px-3 py-1 rounded ${
                                currentPage === index + 1
                                  ? "bg-[#7a1c3d] text-white"
                                  : "border"
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}

                          {/* NEXT */}
                          <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#f6f1f3] rounded-2xl p-6 md:p-8">
                      <h3 className="font-semibold text-lg mb-6 text-[#7a1c3d]">
                        Write a Review
                      </h3>

                      <div className="space-y-5 text-sm">
                        {/* RATING */}
                        <div className="flex gap-1 text-2xl cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() =>
                                setReviewForm((prev) => ({
                                  ...prev,
                                  rating: star,
                                }))
                              }
                              className={
                                star <= reviewForm.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        {/* NAME + EMAIL */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="name"
                            value={reviewForm.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]/30"
                          />
                          <input
                            type="email"
                            name="email"
                            value={reviewForm.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]/30"
                          />
                        </div>

                        <input
                          type="text"
                          name="title"
                          value={reviewForm.title}
                          onChange={handleChange}
                          placeholder="Review Title"
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]/30"
                        />

                        <textarea
                          name="review"
                          value={reviewForm.review}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Your Review"
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#7a1c3d]/30"
                        />

                        <p className="text-xs text-gray-500">
                          Tell others what you think about this product. Be
                          honest and helpful!
                        </p>

                        {/* BUTTON */}
                        <div className="flex justify-end">
                          <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#7a1c3d] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                          >
                            {loading ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider (soft line instead of border box) */}
          <div className="h-[1px] bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
};

export default ProductTabs;

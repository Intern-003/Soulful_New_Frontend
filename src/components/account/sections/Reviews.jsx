import { useState } from "react";

const initialReviews = [
  {
    id: 1,
    product: "Leather Jacket",
    image: "/p1.png",
    rating: 4,
    review: "Great quality and perfect fit. Totally worth it!",
    date: "Feb 12, 2025",
  },
  {
    id: 2,
    product: "Running Shoes",
    image: "/p2.png",
    rating: 5,
    review: "Super comfortable, I use them daily.",
    date: "Jan 28, 2025",
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditText(review.review);
  };

  const handleSave = (id) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, review: editText } : r)),
    );
    setEditingId(null);
  };

  return (
    <div>
      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-6">My Reviews</h2>

      {/* REVIEWS LIST */}
      <div className="space-y-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="border rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="flex gap-4">
              {/* IMAGE */}
              <img
                src={r.image}
                alt={r.product}
                className="w-20 h-20 rounded object-cover"
              />

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{r.product}</h3>
                  <span className="text-xs text-gray-500">{r.date}</span>
                </div>

                {/* STARS */}
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= r.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* REVIEW TEXT */}
                {editingId === r.id ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border rounded-lg p-2 mt-3 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 mt-3">{r.review}</p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-4 mt-4 text-sm">
                  {editingId === r.id ? (
                    <button
                      onClick={() => handleSave(r.id)}
                      className="text-[#7a1c3d] hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-[#7a1c3d] hover:underline"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

const initialWishlist = [
  {
    id: 1,
    name: "Leather Jacket",
    price: 120,
    image: "/p1.png",
    inStock: true,
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 80,
    image: "/p2.png",
    inStock: true,
  },
  {
    id: 3,
    name: "Casual T-shirt",
    price: 25,
    image: "/p3.png",
    inStock: false,
  },
];

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item) => {
    console.log("Add to cart:", item);
    alert(`${item.name} added to cart 🛒`);
  };

  return (
    <div>
      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-6">Wishlist</h2>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-lg font-medium mb-2">
            Your wishlist is empty 💔
          </h3>
          <p className="text-gray-500 mb-4">
            Browse products and add them to wishlist
          </p>
          <button className="bg-[#7a1c3d] text-white px-5 py-2 rounded-lg">
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-4 hover:shadow-md transition group"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-cover rounded-lg"
                />

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-50"
                >
                  ❌
                </button>

                {/* STOCK BADGE */}
                {!item.inStock && (
                  <span className="absolute bottom-2 left-2 bg-red-100 text-red-500 text-xs px-2 py-1 rounded">
                    Out of stock
                  </span>
                )}
              </div>

              {/* DETAILS */}
              <div className="mt-4">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-[#7a1c3d] font-semibold mt-1">
                  ₹{item.price}
                </p>
              </div>

              {/* ACTION */}
              <button
                onClick={() => handleAddToCart(item)}
                disabled={!item.inStock}
                className={`mt-4 w-full py-2 rounded-lg text-sm transition ${
                  item.inStock
                    ? "bg-[#7a1c3d] text-white hover:bg-[#5a142c]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {item.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

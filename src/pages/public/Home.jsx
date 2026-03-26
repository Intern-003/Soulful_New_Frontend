import React from "react";

const Home = () => {
  const products = [
    { id: 1, name: "Nike Air Max", price: "$120" },
    { id: 2, name: "Adidas Ultraboost", price: "$140" },
    { id: 3, name: "Puma Running Shoes", price: "$90" },
    { id: 4, name: "Reebok Classic", price: "$110" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* HERO */}
      <div className="bg-gray-200 rounded-xl p-10 text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome to FashionStore</h1>
        <p className="text-gray-600">
          Discover the latest trends in fashion
        </p>
      </div>

      {/* PRODUCTS */}
      <h2 className="text-xl font-semibold mb-6">Featured Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="h-40 bg-gray-100 rounded mb-4"></div>

            <h3 className="font-medium">{item.name}</h3>
            <p className="text-pink-700 font-semibold">{item.price}</p>

            <button className="mt-3 w-full bg-pink-700 text-white py-2 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;
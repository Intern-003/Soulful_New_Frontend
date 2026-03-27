import React from "react";
import HeroSlider from "../../components/home/HeroSlider";
import CategoryCards from "../../components/home/CategoryCards";

const Home = () => {
  const products = [
    { id: 1, name: "Nike Air Max", price: "$120" },
    { id: 2, name: "Adidas Ultraboost", price: "$140" },
    { id: 3, name: "Puma Running Shoes", price: "$90" },
    { id: 4, name: "Reebok Classic", price: "$110" },
  ];

  return (
    <div className="w-full">

      {/* HERO SLIDER */}
      <HeroSlider />


      {/* CATEGORY SECTION */}
      <CategoryCards />

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* PRODUCTS */}
        <h2 className="text-2xl font-semibold mb-6">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="h-40 bg-gray-100 rounded mb-4"></div>

              <h3 className="font-medium">{item.name}</h3>
              <p className="text-[#7a1c3d] font-semibold">
                {item.price}
              </p>

              <button className="mt-3 w-full bg-[#7a1c3d] text-white py-2 rounded hover:bg-[#5c132d]">
                Add to Cart
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
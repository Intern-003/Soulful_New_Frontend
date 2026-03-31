// import React from "react";
// import HeroSlider from "../../components/home/HeroSlider";
// import CategoryCards from "../../components/home/CategoryCards";
// import CategoryBannerSection from "../../components/home/CategoryBannerSection";
// import BestSellerSection from "../../components/home/BestSellerSection";    
// import { FeatherIcon } from "lucide-react";
// import FeaturedProductsSection from "../../components/home/FeaturedProductsSection";
// const Home = () => {
//   const products = [
//     { id: 1, name: "Nike Air Max", price: "$120" },
//     { id: 2, name: "Adidas Ultraboost", price: "$140" },
//     { id: 3, name: "Puma Running Shoes", price: "$90" },
//     { id: 4, name: "Reebok Classic", price: "$110" },
//   ];

//   return (
//     <div className="w-full">

//       {/* HERO SLIDER */}
//       <HeroSlider />


//       {/* CATEGORY SECTION */}
//       <CategoryCards />
//       <CategoryBannerSection />

//       <BestSellerSection />
//       {/* CONTENT CONTAINER */}
//       <FeaturedProductsSection />
//     </div>
//   );
// }
// export default Home;

// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeroSlider from '../../components/home/HeroSlider';
import CategoryCards from '../../components/home/CategoryCards';
import BestSellerSection from '../../components/home/BestSellerSection';
import FeaturedProductsSection from '../../components/home/FeaturedProductsSection';
import CategoryBannerSection from '../../components/home/CategoryBannerSection';
import { fetchCart } from '../../app/slices/cartSlice';
import { fetchWishlist } from '../../app/slices/wishlistSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Always fetch cart (handles guest token internally)
    dispatch(fetchCart());
    
    // Only fetch wishlist if authenticated
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <main>
      <HeroSlider />
      <CategoryCards />
      <BestSellerSection />
      <FeaturedProductsSection />
      <CategoryBannerSection />
    </main>
  );
};

export default Home;
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroSlider from "../../components/home/HeroSlider";
import CategoryCards from "../../components/home/CategoryCards";
import BestSellerSection from "../../components/home/BestSellerSection";
import FeaturedProductsSection from "../../components/home/FeaturedProductsSection";
import CategoryBannerSection from "../../components/home/CategoryBannerSection";
import { fetchCategories } from "../../app/slices/categorySlice";

const Home = () => {
  const dispatch = useDispatch();


  const { all: categories, fetched } = useSelector((state) => state.categories);

  useEffect(() => {
    // ✅ Fetch categories only once
    if (!fetched) {
      dispatch(fetchCategories());
    }
  }, [dispatch, fetched]);

  return (
    <main>
      <HeroSlider />
      <CategoryCards />
      <CategoryBannerSection />
      <BestSellerSection />
      <FeaturedProductsSection />
    </main>
  );
};

export default Home;

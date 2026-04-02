import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { fetchCart } from "../../app/slices/cartSlice";
import { fetchWishlist } from "../../app/slices/wishlistSlice";
import { useDispatch, useSelector } from 'react-redux';

const MainLayout = () => {


  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { status: cartStatus } = useSelector((state) => state.cart);
  const { status: wishlistStatus } = useSelector((state) => state.wishlist);

  useEffect(() => {
    // ✅ Fetch cart only if not already fetched
    if (cartStatus === "idle") {
      dispatch(fetchCart());
    }

    // ✅ Fetch wishlist only if logged in AND not already fetched
    if (isAuthenticated && wishlistStatus === "idle") {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated, cartStatus, wishlistStatus]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet /> {/* ✅ THIS IS REQUIRED */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;